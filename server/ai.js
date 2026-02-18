import { z } from 'zod';
import crypto from 'crypto';

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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function newId() {
  return crypto.randomUUID();
}
function asUuid(maybe) {
  return (typeof maybe === 'string' && UUID_RE.test(maybe)) ? maybe : newId();
}

function normalizeBoard(board) {
  const b = board && typeof board === 'object' ? board : {};
  const columnsIn = Array.isArray(b.columns) ? b.columns : [];
  const groupsIn = Array.isArray(b.groups) ? b.groups : [];

  const columns = columnsIn.map((c) => ({
    id: asUuid(c?.id),
    type: typeof c?.type === 'string' ? c.type : 'text',
    title: typeof c?.title === 'string' ? c.title : 'Column',
    width: Number.isFinite(c?.width) ? c.width : 140,
  }));

  const colIds = new Set(columns.map((c) => c.id));

  const groups = groupsIn.map((g) => {
    const itemsIn = Array.isArray(g?.items) ? g.items : [];
    const items = itemsIn.map((it) => {
      const values = (it?.values && typeof it.values === 'object') ? it.values : (it?.columnValues && typeof it.columnValues === 'object' ? it.columnValues : {});
      // keep only values whose column exists
      const safeValues = {};
      for (const [k, v] of Object.entries(values)) {
        if (colIds.has(k)) safeValues[k] = v;
      }
      return {
        id: asUuid(it?.id),
        name: typeof it?.name === 'string' ? it.name : 'New Item',
        values: safeValues,
      };
    });

    return {
      id: asUuid(g?.id),
      title: typeof g?.title === 'string' ? g.title : 'Group',
      color: typeof g?.color === 'string' ? g.color : '#4caf82',
      collapsed: Boolean(g?.collapsed) || false,
      items,
    };
  });

  return {
    id: asUuid(b.id),
    name: typeof b.name === 'string' ? b.name : 'New Board',
    favorite: Boolean(b.favorite) || false,
    columns: columns.length ? columns : [
      { id: newId(), type: 'status', title: 'Status', width: 140 },
    ],
    groups: groups.length ? groups : [
      { id: newId(), title: 'Group 1', color: '#4caf82', collapsed: false, items: [] },
    ],
  };
}

function buildStateIndex(state) {
  const boards = Array.isArray(state?.boards) ? state.boards : [];

  const byBoardId = new Map();
  const boardIdByName = new Map();

  for (const b of boards) {
    if (!b?.id) continue;
    const boardId = String(b.id);
    const boardName = String(b.name || '').toLowerCase();
    if (boardName && !boardIdByName.has(boardName)) boardIdByName.set(boardName, boardId);

    const columns = Array.isArray(b.columns) ? b.columns : [];
    const groups = Array.isArray(b.groups) ? b.groups : [];

    const colById = new Map(columns.map((c) => [String(c.id), c]));
    const colByTitle = new Map(
      columns
        .filter((c) => c?.title)
        .map((c) => [String(c.title).toLowerCase(), String(c.id)])
    );

    const groupById = new Map(groups.map((g) => [String(g.id), g]));
    const groupByTitle = new Map(
      groups
        .filter((g) => g?.title)
        .map((g) => [String(g.title).toLowerCase(), String(g.id)])
    );

    const itemById = new Map();
    const itemIdByName = new Map(); // within board (may be ambiguous)
    for (const g of groups) {
      const items = Array.isArray(g?.items) ? g.items : [];
      for (const it of items) {
        if (it?.id) itemById.set(String(it.id), it);
        const nm = String(it?.name || '').toLowerCase();
        if (nm && it?.id && !itemIdByName.has(nm)) itemIdByName.set(nm, String(it.id));
      }
    }

    byBoardId.set(boardId, {
      board: b,
      colById,
      colByTitle,
      groupById,
      groupByTitle,
      itemById,
      itemIdByName,
    });
  }

  return { byBoardId, boardIdByName };
}

function normalizeActions(actions, state) {
  if (!Array.isArray(actions)) return [];
  const idx = buildStateIndex(state);

  const maybeResolveBoardId = (a) => {
    if (a.boardId) return a;
    if (a.boardName) {
      const bid = idx.boardIdByName.get(String(a.boardName).toLowerCase());
      if (bid) return { ...a, boardId: bid };
    }
    return a;
  };

  const maybeResolveGroupId = (a, rec) => {
    if (a.groupId) return a;
    if (a.groupTitle) {
      const gid = rec.groupByTitle.get(String(a.groupTitle).toLowerCase());
      if (gid) return { ...a, groupId: gid };
    }
    return a;
  };

  const maybeResolveItemId = (a, rec) => {
    if (a.itemId) return a;
    if (a.itemName) {
      const iid = rec.itemIdByName.get(String(a.itemName).toLowerCase());
      if (iid) return { ...a, itemId: iid };
    }
    return a;
  };

  const maybeResolveColumnId = (a, rec) => {
    if (a.columnId) return a;
    if (a.columnTitle) {
      const cid = rec.colByTitle.get(String(a.columnTitle).toLowerCase());
      if (cid) return { ...a, columnId: cid };
    }
    return a;
  };

  return actions
    .map((raw) => {
      if (!raw || typeof raw !== 'object' || typeof raw.type !== 'string') return null;

      if (raw.type === 'ADD_BOARD_DIRECT') {
        return { ...raw, board: normalizeBoard(raw.board) };
      }

      let a = maybeResolveBoardId(raw);
      const boardId = a.boardId ? String(a.boardId) : '';
      const rec = boardId ? idx.byBoardId.get(boardId) : null;

      if (rec) {
        a = maybeResolveGroupId(a, rec);
        a = maybeResolveItemId(a, rec);
        a = maybeResolveColumnId(a, rec);
      }

      return a;
    })
    .filter(Boolean);
}

function buildMappingContext(state) {
  const boards = Array.isArray(state?.boards) ? state.boards : [];
  const activeBoardId = state?.activeBoardId || null;

  const summarizeBoard = (b) => ({
    id: b.id,
    name: b.name,
    columns: (b.columns || []).map((c) => ({ id: c.id, title: c.title, type: c.type, width: c.width })),
    groups: (b.groups || []).map((g) => ({
      id: g.id,
      title: g.title,
      color: g.color,
      items: (g.items || []).slice(0, 20).map((it) => ({ id: it.id, name: it.name })),
    })),
  });

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  return {
    activeBoardId,
    activeBoard: activeBoard ? summarizeBoard(activeBoard) : null,
    boards: boards.slice(0, 8).map(summarizeBoard),
    notes: {
      itemValuesPath: "state.boards[].groups[].items[].values[columnId]",
      updateValueAction: {
        type: "UPDATE_ITEM_VALUE",
        boardId: "<boardId>",
        groupId: "<groupId>",
        itemId: "<itemId>",
        columnId: "<columnId>",
        value: "<any>",
      },
    },
  };
}

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

Data model (important):
- state.boards[]: list of boards.
- board.columns[]: columns with {id, type, title, width}
- board.groups[]: groups with {id, title, color, collapsed, items[]}
- group.items[]: items with {id, name, values}
- item.values is a dictionary keyed by columnId: values[columnId] = value.

Allowed actions (client will dispatch into a reducer):
- {"type":"ADD_BOARD","name":string}
- {"type":"ADD_BOARD_DIRECT","board":object}  // preferred for creating full board
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
- Use existing ids from the mapping context when updating.
- If you don't know an id, you may include boardName / groupTitle / itemName / columnTitle and the server will resolve it when possible.
- Use UUID v4 strings for new ids you create. (If you are unsure, omit ids and the server will generate them.)
- Do not invent unknown action types.
- Keep actions minimal.
`;

  const user = {
    prompt,
    mapping: buildMappingContext(state),
    // Full state is still included for edge cases, but mapping is the primary guide.
    state,
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
  safe.actions = normalizeActions(safe.actions, state);
  return safe;
}
