import { useEffect, useMemo, useState } from 'react';
import Modal from '../Common/Modal';
import { useSettings } from '../../context/SettingsContext';
import { FiPlay, FiRefreshCw } from 'react-icons/fi';
import './N8nWorkflowsModal.css';

async function apiGet(path) {
  const resp = await fetch(path);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);
  return json;
}

async function apiPost(path, body) {
  const resp = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);
  return json;
}

export default function N8nWorkflowsModal({ onClose }) {
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [query, setQuery] = useState('');
  const [runningId, setRunningId] = useState(null);
  const [lastRun, setLastRun] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const out = await apiGet('/api/n8n/workflows');
      // n8n often returns { data: [...] }
      setWorkflows(out?.data || out || []);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter((w) => (w.name || '').toLowerCase().includes(q));
  }, [workflows, query]);

  async function runWorkflow(id) {
    setRunningId(id);
    setError('');
    setLastRun(null);
    try {
      const out = await apiPost(`/api/n8n/workflows/${id}/run`, {});
      setLastRun(out);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setRunningId(null);
    }
  }

  return (
    <Modal title={t('n8nWorkflows')} onClose={onClose}>
      <div className="n8n-modal">
        <div className="n8n-toolbar">
          <input
            className="n8n-search"
            placeholder={t('searchWorkflows')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="n8n-btn" onClick={load} disabled={loading} title={t('refresh')}>
            <FiRefreshCw />
            {t('refresh')}
          </button>
        </div>

        {error && <div className="n8n-error">{error}</div>}

        {loading ? (
          <div className="n8n-empty">{t('loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="n8n-empty">{t('noWorkflowsFound')}</div>
        ) : (
          <div className="n8n-list">
            {filtered.map((w) => (
              <div key={w.id} className="n8n-row">
                <div className="n8n-name">
                  <div className="n8n-title">{w.name}</div>
                  <div className="n8n-sub">id: {w.id}</div>
                </div>
                <button
                  className="n8n-btn primary"
                  onClick={() => runWorkflow(w.id)}
                  disabled={runningId === w.id}
                >
                  <FiPlay />
                  {runningId === w.id ? t('running') : t('run')}
                </button>
              </div>
            ))}
          </div>
        )}

        {lastRun && (
          <pre className="n8n-last-run">{JSON.stringify(lastRun, null, 2)}</pre>
        )}
      </div>
    </Modal>
  );
}
