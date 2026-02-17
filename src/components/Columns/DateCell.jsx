import { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function DateCell({ value, onChange }) {
  const { t, lang } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function formatDate(d) {
    if (!d) return '';
    const date = new Date(d);
    const locale = lang === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  function isOverdue(d) {
    if (!d) return false;
    return new Date(d) < new Date(new Date().toDateString());
  }

  return (
    <div className="cell-wrapper" ref={ref}>
      <div
        className={`date-cell ${isOverdue(value) ? 'overdue' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {formatDate(value) || ''}
      </div>
      {open && (
        <div className="cell-dropdown date-dropdown">
          <input
            type="date"
            value={value || ''}
            onChange={(e) => { onChange(e.target.value); setOpen(false); }}
            autoFocus
          />
          {value && (
            <button className="clear-date" onClick={() => { onChange(''); setOpen(false); }}>
              {t('clearDate')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
