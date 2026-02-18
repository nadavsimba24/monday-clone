import { useMemo, useState } from 'react';
import Modal from '../Common/Modal';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import './AIAssistantModal.css';

function safeStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function AIAssistantModal({ onClose }) {
  const { state, dispatch } = useBoard();
  const { t } = useSettings();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentMessage, setAgentMessage] = useState('');
  const [actions, setActions] = useState([]);

  const canApply = useMemo(() => Array.isArray(actions) && actions.length > 0, [actions]);

  async function run() {
    setLoading(true);
    setError('');
    setAgentMessage('');
    setActions([]);
    try {
      const resp = await fetch('/api/ai/meshkal-weave-46', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, state }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);

      setAgentMessage(json?.message || '');
      setActions(json?.actions || []);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    try {
      (actions || []).forEach((a) => dispatch(a));
      onClose();
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  return (
    <Modal title={t('aiAssistantTitle')} onClose={onClose}>
      <div className="ai-modal">
        <div className="ai-hint">{t('aiAssistantHint')}</div>

        <textarea
          className="ai-input"
          placeholder={t('aiPromptPlaceholder')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <div className="ai-actions">
          <button className="ai-btn" onClick={run} disabled={loading || !prompt.trim()}>
            {loading ? t('running') : t('run')}
          </button>
          <button className="ai-btn primary" onClick={apply} disabled={!canApply}>
            {t('apply')}
          </button>
        </div>

        {error && <div className="ai-error">{error}</div>}

        {agentMessage && (
          <div className="ai-message">
            <div className="ai-message-title">{t('assistant')}:</div>
            <div className="ai-message-body">{agentMessage}</div>
          </div>
        )}

        {actions?.length > 0 && (
          <details className="ai-preview" open>
            <summary>{t('previewActions')} ({actions.length})</summary>
            <pre>{safeStringify(actions)}</pre>
          </details>
        )}
      </div>
    </Modal>
  );
}
