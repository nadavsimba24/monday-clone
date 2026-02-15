import { useState, useRef, useEffect } from 'react';

export default function TextCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const inputRef = useRef();

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  function handleSave() {
    onChange(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="text-cell-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') { setDraft(value || ''); setEditing(false); }
        }}
      />
    );
  }

  return (
    <div className="text-cell" onClick={() => { setDraft(value || ''); setEditing(true); }}>
      {value || ''}
    </div>
  );
}
