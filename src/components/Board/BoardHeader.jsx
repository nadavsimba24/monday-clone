import { useRef, useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import { FiPlus, FiSearch, FiStar, FiX } from 'react-icons/fi';

export default function BoardHeader({ board, searchTerm, onSearchChange }) {
  const { dispatch } = useBoard();
  const { t } = useSettings();

  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const inputRef = useRef(null);

  function startEdit() {
    setDraftName(board.name);
    setEditingName(true);
    // focus next tick
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }

  function saveName() {
    const next = draftName.trim();
    if (next) {
      dispatch({ type: 'RENAME_BOARD', boardId: board.id, name: next });
    }
    setEditingName(false);
  }

  return (
    <div className="px-6 pt-5 pb-3 border-b border-cu-border bg-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {editingName ? (
            <input
              ref={inputRef}
              className="text-xl font-bold px-2 py-1 rounded-cu border border-cu-border focus:outline-none focus:ring-2 focus:ring-cu-primary/30 focus:border-cu-primary w-[min(520px,60vw)]"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') setEditingName(false);
              }}
            />
          ) : (
            <h1
              className="text-xl font-bold truncate cursor-pointer hover:text-cu-primary"
              onClick={startEdit}
              title={board.name}
            >
              {board.name}
            </h1>
          )}

          <button
            className={`h-9 w-9 inline-flex items-center justify-center rounded-cu border border-cu-border hover:bg-cu-bg ${board.favorite ? 'text-yellow-500' : 'text-cu-muted'}`}
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', boardId: board.id })}
            title={board.favorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <FiStar />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-cu bg-cu-primary text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
            onClick={() => dispatch({ type: 'ADD_ITEM', boardId: board.id, groupId: board.groups[0]?.id, name: t('newItem') })}
            disabled={!board.groups.length}
          >
            <FiPlus size={14} /> {t('newItem')}
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 border border-cu-border rounded-cu bg-white w-[320px]">
            <FiSearch className="text-cu-muted" />
            <input
              className="w-full outline-none text-sm"
              placeholder={t('searchItems')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="text-cu-muted hover:text-cu-text"
                onClick={() => onSearchChange('')}
                title={t('clear')}
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* mobile search */}
      <div className="mt-3 md:hidden flex items-center gap-2 px-3 py-2 border border-cu-border rounded-cu bg-white">
        <FiSearch className="text-cu-muted" />
        <input
          className="w-full outline-none text-sm"
          placeholder={t('searchItems')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="text-cu-muted hover:text-cu-text"
            onClick={() => onSearchChange('')}
            title={t('clear')}
          >
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
}

