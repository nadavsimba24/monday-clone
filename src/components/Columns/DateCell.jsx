import { useState, useRef, useEffect } from 'react';

export default function DateCell({ value, onChange }) {
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
