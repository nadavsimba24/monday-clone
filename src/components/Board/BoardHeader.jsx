import { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { FiStar, FiSearch, FiPlus, FiMoreHorizontal } from 'react-icons/fi';
import SearchBar from '../Common/SearchBar';

export default function BoardHeader({ board, searchTerm, onSearchChange }) {
  const { dispatch } = useBoard();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(board.name);
  const inputRef = useRef();

  useEffect(() => {
    setName(board.name);
  }, [board.name]);

  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingName]);

  function saveName() {
    if (name.trim()) {
      dispatch({ type: 'RENAME_BOARD', boardId: board.id, name: name.trim() });
    } else {
      setName(board.name);
    }
    setEditingName(false);
  }

  return (
    <div className="board-header">
      <div className="board-header-top">
        <div className="board-title-area">
          {editingName ? (
            <input
              ref={inputRef}
              className="board-title-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') { setName(board.name); setEditingName(false); }
              }}
            />
          ) : (
            <h1 className="board-title" onClick={() => setEditingName(true)}>
              {board.name}
            </h1>
          )}
          <button
            className={`fav-btn ${board.favorite ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', boardId: board.id })}
          >
            <FiStar />
          </button>
        </div>
      </div>
      <div className="board-header-actions">
        <button
          className="header-action-btn primary"
          onClick={() => dispatch({ type: 'ADD_ITEM', boardId: board.id, groupId: board.groups[0]?.id, name: 'New Item' })}
          disabled={!board.groups.length}
        >
          <FiPlus size={14} /> New Item
        </button>
        <div className="header-search">
          <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search items..." />
        </div>
      </div>
    </div>
  );
}
