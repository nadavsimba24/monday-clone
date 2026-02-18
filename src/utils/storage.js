const STORAGE_KEY = 'monday_clone_data';

export function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// ---- Remote persistence (best-effort) ----

export async function loadRemoteState() {
  const resp = await fetch('/api/state');
  if (!resp.ok) return null;
  const json = await resp.json().catch(() => null);
  return json?.state || null;
}

export async function saveRemoteState(state) {
  await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
}
