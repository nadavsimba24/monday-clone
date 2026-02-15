import { useState, useRef, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

export default function AddItem({ groupColor, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  function handleAdd() {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
    setAdding(false);
  }

  if (adding) {
    return (
      <div className="add-item-row">
        <div className="group-color-bar" style={{ backgroundColor: groupColor }} />
        <div className="item-checkbox-area" />
        <input
          ref={inputRef}
          className="add-item-input"
          value={name}
          placeholder="Enter item name..."
          onChange={(e) => setName(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') { setName(''); setAdding(false); }
          }}
        />
      </div>
    );
  }

  return (
    <div className="add-item-row add-item-trigger" onClick={() => setAdding(true)}>
      <div className="group-color-bar" style={{ backgroundColor: groupColor, opacity: 0.4 }} />
      <div className="item-checkbox-area" />
      <span className="add-item-text"><FiPlus size={12} /> Add item</span>
    </div>
  );
}
