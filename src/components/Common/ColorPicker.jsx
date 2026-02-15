import { useRef, useEffect } from 'react';

const COLORS = [
  '#4caf82', '#81c784', '#a5d6a7', '#00c875', '#2e7d5a',
  '#fdab3d', '#e2445c', '#ff642e', '#00d2d2', '#037f4c',
  '#66bb6a', '#43a047', '#c8e6c9', '#bb3354', '#175a63',
  '#cab641', '#9cd326', '#4eccc6', '#7f5347', '#c4c4c4',
];

export default function ColorPicker({ currentColor, onSelect, onClose }) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="color-picker-popup">
      {COLORS.map((c) => (
        <div
          key={c}
          className={`color-swatch ${c === currentColor ? 'active' : ''}`}
          style={{ backgroundColor: c }}
          onClick={() => { onSelect(c); onClose(); }}
        />
      ))}
    </div>
  );
}
