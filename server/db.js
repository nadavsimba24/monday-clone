import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

export async function openDb(dbPath) {
  const SQL = await initSqlJs({
    // uses the wasm bundled by the package
    locateFile: (file) => `node_modules/sql.js/dist/${file}`,
  });

  ensureDir(dbPath);

  let db;
  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath);
    db = new SQL.Database(new Uint8Array(buf));
  } else {
    db = new SQL.Database();
  }

  // schema
  db.run(`CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`);

  function persist() {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }

  function get(key) {
    const stmt = db.prepare('SELECT value FROM kv WHERE key = ?');
    stmt.bind([key]);
    let value = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      value = row.value;
    }
    stmt.free();
    return value;
  }

  function set(key, value) {
    const ts = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO kv(key, value, updated_at) VALUES(?, ?, ?)\n' +
      'ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at'
    );
    stmt.run([key, value, ts]);
    stmt.free();
    persist();
  }

  return { get, set, persist };
}
