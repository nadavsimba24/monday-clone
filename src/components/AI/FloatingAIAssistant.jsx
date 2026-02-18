import { useEffect, useMemo, useRef, useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import './FloatingAIAssistant.css';

function useBeep() {
  const ctxRef = useRef(null);

  function beep({ freq = 880, durationMs = 60, type = 'sine', gain = 0.05 } = {}) {
    try {
      // Lazy init (must be triggered by user gesture in many browsers)
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();

      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;

      osc.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch {
      // ignore
    }
  }

  return beep;
}

function TypingText({ text, speedMs = 12, onDone }) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');
    if (!text) return;

    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        onDone?.();
      }
    }, speedMs);

    return () => clearInterval(t);
  }, [text, speedMs, onDone]);

  return <div className="aiw-msg-text" style={{ whiteSpace: 'pre-wrap' }}>{shown}</div>;
}

function WorkflowWorking() {
  return (
    <div className="aiw-working">
      <div className="aiw-working-row">
        <div className="aiw-pulse" />
        <div className="aiw-pulse" />
        <div className="aiw-pulse" />
      </div>
      <div className="aiw-flow">
        <div className="aiw-flow-node" />
        <div className="aiw-flow-line" />
        <div className="aiw-flow-node" />
        <div className="aiw-flow-line" />
        <div className="aiw-flow-node" />
      </div>
    </div>
  );
}

export default function FloatingAIAssistant() {
  const { state, dispatch } = useBoard();
  const { t, isRTL } = useSettings();
  const beep = useBeep();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [actions, setActions] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 'intro',
      role: 'assistant',
      text: t('aiAssistantHello'),
      typing: false,
    },
  ]);

  // Update intro translation when language changes
  useEffect(() => {
    setMessages((prev) => prev.map((m) => m.id === 'intro' ? { ...m, text: t('aiAssistantHello') } : m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  const canApply = useMemo(() => Array.isArray(actions) && actions.length > 0, [actions]);

  const listRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, loading]);

  async function run() {
    const prompt = input.trim();
    if (!prompt) return;

    setError('');
    setActions([]);
    setLoading(true);

    beep({ freq: 740, durationMs: 40, gain: 0.04 });

    const userMsg = { id: String(Date.now()) + ':u', role: 'user', text: prompt, typing: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const resp = await fetch('/api/ai/meshkal-weave-46', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, state }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);

      const msgText = json?.message || '';
      const assistantMsg = { id: String(Date.now()) + ':a', role: 'assistant', text: msgText, typing: true };
      setMessages((prev) => [...prev, assistantMsg]);
      setActions(json?.actions || []);

      beep({ freq: 1040, durationMs: 60, gain: 0.04 });
    } catch (e) {
      setError(String(e.message || e));
      beep({ freq: 220, durationMs: 90, gain: 0.04, type: 'square' });
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    try {
      (actions || []).forEach((a) => dispatch(a));
      setActions([]);
      beep({ freq: 880, durationMs: 70, gain: 0.05 });
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  return (
    <>
      <button
        className={`aiw-bubble ${open ? 'open' : ''}`}
        onClick={() => {
          setOpen((v) => !v);
          beep({ freq: 520, durationMs: 30, gain: 0.03 });
        }}
        title={t('aiAssistantTitle')}
      >
        <span className="aiw-icons" aria-hidden>
          <span className="aiw-icon">🦞</span>
          <span className="aiw-icon">🤖</span>
        </span>
      </button>

      {open && (
        <div className="aiw-panel" role="dialog" aria-label={t('aiAssistantTitle')}>
          <div className="aiw-header">
            <div className="aiw-title">{t('aiAssistantTitle')}</div>
            <button className="aiw-close" onClick={() => setOpen(false)} aria-label={t('close')}>×</button>
          </div>

          <div className="aiw-body" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`aiw-msg ${m.role}`}>
                <div className="aiw-msg-bubble">
                  {m.typing ? (
                    <TypingText
                      text={m.text}
                      speedMs={10}
                      onDone={() => {
                        setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, typing: false } : x));
                      }}
                    />
                  ) : (
                    <div className="aiw-msg-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="aiw-msg assistant">
                <div className="aiw-msg-bubble">
                  <WorkflowWorking />
                </div>
              </div>
            )}

            {error && (
              <div className="aiw-error">{error}</div>
            )}

            {canApply && (
              <div className="aiw-apply-row">
                <button className="aiw-apply" onClick={apply}>{t('apply')}</button>
                <details className="aiw-actions-preview">
                  <summary>{t('previewActions')} ({actions.length})</summary>
                  <pre>{JSON.stringify(actions, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>

          <div className="aiw-input-row">
            <textarea
              className="aiw-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiPromptPlaceholder')}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) run();
                }
              }}
            />
            <button className="aiw-send" onClick={run} disabled={loading || !input.trim()}>
              {loading ? t('running') : t('send')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
