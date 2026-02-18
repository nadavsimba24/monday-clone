import { z } from 'zod';

function env(name, fallback = undefined) {
  const v = process.env[name];
  return (v && v.trim()) ? v.trim() : fallback;
}

const ActionSchema = z.object({
  type: z.string().min(1),
}).passthrough();

const AgentResponseSchema = z.object({
  message: z.string().default(''),
  actions: z.array(ActionSchema).default([]),
});

export async function runMeshkalWeave46({ prompt, state }) {
  const apiKey = env('DEEPSEEK_API_KEY');
  if (!apiKey) {
    const err = new Error('Missing DEEPSEEK_API_KEY');
    err.status = 500;
    throw err;
  }

  const baseUrl = env('DEEPSEEK_BASE_URL', 'https://api.deepseek.com');
  const model = env('DEEPSEEK_MODEL', 'deepseek-chat');

  const system = `You are an AI agent named "משכל וייב 46" (Meshkal Weave 46).
You control a Monday-like board app.

Return STRICT JSON only (no markdown) with shape:
{
  "message": string,
  "actions": Array<object>
}

Allowed actions (client will dispatch into a reducer):
- {"type":"ADD_BOARD","name":string}
- {"type":"ADD_BOARD_DIRECT","board":object}
- {"type":"SET_ACTIVE_BOARD","boardId":string}
- {"type":"RENAME_BOARD","boardId":string,"name":string}
- {"type":"DELETE_BOARD","boardId":string}
- {"type":"ADD_GROUP","boardId":string,"title":string,"color":string}
- {"type":"RENAME_GROUP","boardId":string,"groupId":string,"title":string}
- {"type":"DELETE_GROUP","boardId":string,"groupId":string}
- {"type":"ADD_ITEM","boardId":string,"groupId":string,"name":string}
- {"type":"RENAME_ITEM","boardId":string,"groupId":string,"itemId":string,"name":string}
- {"type":"DELETE_ITEM","boardId":string,"groupId":string,"itemId":string}
- {"type":"UPDATE_ITEM_VALUE","boardId":string,"groupId":string,"itemId":string,"columnId":string,"value":any}

Rules:
- Prefer ADD_BOARD_DIRECT when creating a full new board with columns+groups+items.
- Use UUID v4 strings for new ids you create.
- Do not invent unknown action types.
- Keep actions minimal.
`;

  const user = {
    prompt,
    state,
    notes: "State contains boards/groups/items/columns. Use existing ids when updating."
  };

  const url = baseUrl.replace(/\/$/, '') + '/v1/chat/completions';

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  const text = await resp.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    const err = new Error('DeepSeek returned non-JSON');
    err.status = 502;
    err.details = text;
    throw err;
  }

  if (!resp.ok) {
    const err = new Error(`DeepSeek HTTP ${resp.status}`);
    err.status = resp.status;
    err.details = json;
    throw err;
  }

  const content = json?.choices?.[0]?.message?.content;
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const err = new Error('Agent content was not valid JSON');
    err.status = 502;
    err.details = { content };
    throw err;
  }

  const safe = AgentResponseSchema.parse(parsed);
  return safe;
}
