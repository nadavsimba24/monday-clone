import 'dotenv/config';
import express from 'express';
import path from 'path';

const app = express();
app.use(express.json({ limit: '2mb' }));

function env(name, fallback = undefined) {
  const v = process.env[name];
  return (v && v.trim()) ? v.trim() : fallback;
}

async function n8nFetch(pathname, { method = 'GET', body } = {}) {
  const base = env('N8N_BASE_URL');
  if (!base) {
    const err = new Error('Missing N8N_BASE_URL');
    err.status = 500;
    throw err;
  }

  const prefix = env('N8N_API_PREFIX', '/api/v1');
  const url = base.replace(/\/$/, '') + prefix + pathname;

  const apiKey = env('N8N_API_KEY');
  const jwt = env('N8N_JWT');

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (apiKey) headers['X-N8N-API-KEY'] = apiKey;
  else if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
  else {
    const err = new Error('Missing N8N_API_KEY (or N8N_JWT)');
    err.status = 500;
    throw err;
  }

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 15_000);
  try {
    const resp = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ac.signal,
    });

    const text = await resp.text();
    const json = text ? JSON.parse(text) : null;

    if (!resp.ok) {
      const err = new Error(`n8n HTTP ${resp.status}`);
      err.status = resp.status;
      err.details = json;
      throw err;
    }

    return json;
  } finally {
    clearTimeout(t);
  }
}

app.get('/api/n8n/workflows', async (req, res) => {
  try {
    const out = await n8nFetch('/workflows');
    res.json(out);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message, details: e.details });
  }
});

app.post('/api/n8n/workflows/:id/run', async (req, res) => {
  try {
    const { id } = req.params;
    const out = await n8nFetch(`/workflows/${id}/run`, { method: 'POST', body: req.body || {} });
    res.json(out);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message, details: e.details });
  }
});

app.get('/api/n8n/health', async (_req, res) => {
  try {
    // Cheapest check: list workflows (requires auth anyway)
    await n8nFetch('/workflows');
    res.json({ ok: true });
  } catch (e) {
    res.status(e.status || 500).json({ ok: false, error: e.message, details: e.details });
  }
});

// Production: serve built app
const distDir = path.resolve(process.cwd(), 'dist');
app.use(express.static(distDir));
// Express 5 (path-to-regexp v6) doesn't accept "*" string patterns.
app.get(/.*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

const port = Number(env('PORT', '3001'));
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
