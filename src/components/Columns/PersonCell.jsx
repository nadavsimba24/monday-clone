import { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';

export default function PersonCell({ value, onChange }) {
  const { state } = useBoard();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const person = state.people.find((p) => p.id === value);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="cell-wrapper" ref={ref}>
      <div className="person-cell" onClick={() => setOpen(!open)}>
        {person ? (
          <div className="person-badge">
            <span className="person-avatar" style={{ backgroundColor: person.color }}>
              {person.name.charAt(0)}
            </span>
            <span className="person-name">{person.name}</span>
          </div>
        ) : (
          <span className="person-empty"></span>
        )}
      </div>
      {open && (
        <div className="cell-dropdown person-dropdown">
          {state.people.map((p) => (
            <div
              key={p.id}
              className={`dropdown-option ${value === p.id ? 'selected' : ''}`}
              onClick={() => { onChange(p.id); setOpen(false); }}
            >
              <span className="person-avatar small" style={{ backgroundColor: p.color }}>
                {p.name.charAt(0)}
              </span>
              {p.name}
            </div>
          ))}
          {value && (
            <div className="dropdown-option clear-option" onClick={() => { onChange(''); setOpen(false); }}>
              Clear
            </div>
          )}
        </div>
      )}
    </div>
  );
}
