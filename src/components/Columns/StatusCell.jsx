import { useState, useRef, useEffect } from 'react';
import { STATUS_OPTIONS } from '../../data/defaultData';

export default function StatusCell({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const current = STATUS_OPTIONS.find((o) => o.label === value) || STATUS_OPTIONS[STATUS_OPTIONS.length - 1];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="cell-wrapper" ref={ref}>
      <div
        className="status-cell"
        style={{ backgroundColor: current.color, color: current.label ? '#fff' : '#999' }}
        onClick={() => setOpen(!open)}
      >
        {current.label || ''}
      </div>
      {open && (
        <div className="cell-dropdown status-dropdown">
          {STATUS_OPTIONS.map((opt) => (
            <div
              key={opt.label || 'empty'}
              className="dropdown-option"
              onClick={() => { onChange(opt.label); setOpen(false); }}
            >
              <span className="option-color" style={{ backgroundColor: opt.color }} />
              {opt.label || '(empty)'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
