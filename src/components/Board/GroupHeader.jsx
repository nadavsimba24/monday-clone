import { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import { FiChevronDown, FiChevronRight, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import ColorPicker from '../Common/ColorPicker';

export default function GroupHeader({ group, boardId, itemCount, columns }) {
  const { dispatch } = useBoard();
  const { t } = useSettings();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(group.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTitle]);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  function saveTitle() {
    if (title.trim()) {
      dispatch({ type: 'RENAME_GROUP', boardId, groupId: group.id, title: title.trim() });
    } else {
      setTitle(group.title);
    }
    setEditingTitle(false);
  }

  return (
    <div className="group-header-row">
      <div className="group-header-left">
        <button
          className="collapse-group-btn"
          style={{ color: group.color }}
          onClick={() => dispatch({ type: 'TOGGLE_GROUP_COLLAPSE', boardId, groupId: group.id })}
        >
          {group.collapsed ? <FiChevronRight /> : <FiChevronDown />}
        </button>

        {editingTitle ? (
          <input
            ref={inputRef}
            className="group-title-input"
            style={{ color: group.color }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') { setTitle(group.title); setEditingTitle(false); }
            }}
          />
        ) : (
          <span
            className="group-title"
            style={{ color: group.color }}
            onClick={() => { setTitle(group.title); setEditingTitle(true); }}
          >
            {group.title}
          </span>
        )}

        <span className="group-count">{itemCount} {t('items')}</span>

        <div className="group-menu-wrapper" ref={menuRef}>
          <button className="group-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <FiMoreHorizontal size={14} />
          </button>
          {showMenu && (
            <div className="group-menu-dropdown">
              <div className="dropdown-option" onClick={() => { setShowColorPicker(true); setShowMenu(false); }}>
                <span className="option-color" style={{ backgroundColor: group.color }} />
                {t('changeColor')}
              </div>
              <div
                className="dropdown-option"
                style={{ color: '#e2445c' }}
                onClick={() => {
                  dispatch({ type: 'DELETE_GROUP', boardId, groupId: group.id });
                  setShowMenu(false);
                }}
              >
                <FiTrash2 size={14} />
                {t('deleteGroup')}
              </div>
            </div>
          )}
        </div>

        {showColorPicker && (
          <ColorPicker
            currentColor={group.color}
            onSelect={(color) => dispatch({ type: 'SET_GROUP_COLOR', boardId, groupId: group.id, color })}
            onClose={() => setShowColorPicker(false)}
          />
        )}
      </div>

      {!group.collapsed && (
        <div className="group-column-headers">
          {columns.map((col) => (
            <div key={col.id} className="column-header" style={{ width: col.width, minWidth: col.width }}>
              {col.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
