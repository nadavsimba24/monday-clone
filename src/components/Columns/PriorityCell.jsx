import { useState, useRef, useEffect } from 'react';
import { PRIORITY_OPTIONS } from '../../data/defaultData';
import { useSettings } from '../../context/SettingsContext';

export default function PriorityCell({ value, onChange }) {
  const { tPriority, t } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const current = PRIORITY_OPTIONS.find((o) => o.label === value) || PRIORITY_OPTIONS[PRIORITY_OPTIONS.length - 1];

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
        className="status-cell priority-cell"
        style={{ backgroundColor: current.color, color: current.label ? '#fff' : '#999' }}
        onClick={() => setOpen(!open)}
      >
        {tPriority(current.label) || ''}
      </div>
      {open && (
        <div className="cell-dropdown">
          {PRIORITY_OPTIONS.map((opt) => (
            <div
              key={opt.label || 'empty'}
              className="dropdown-option"
              onClick={() => { onChange(opt.label); setOpen(false); }}
            >
              <span className="option-color" style={{ backgroundColor: opt.color }} />
              {tPriority(opt.label) || t('empty')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
