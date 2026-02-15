import { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ title, onClose, children }) {
  const overlayRef = useRef();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
