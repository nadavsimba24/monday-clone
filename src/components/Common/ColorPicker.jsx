import { useState, useRef, useEffect } from 'react';

const COLORS = [
  '#579bfc', '#00c875', '#fdab3d', '#e2445c', '#a25ddc',
  '#ff642e', '#00d2d2', '#037f4c', '#bb3354', '#175a63',
  '#ff158a', '#784bd1', '#66ccff', '#7f5347', '#ff5ac4',
  '#cab641', '#9cd326', '#225091', '#4eccc6', '#c4c4c4',
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
