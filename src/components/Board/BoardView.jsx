import { useState, useCallback } from 'react';
import { useBoard } from '../../context/BoardContext';
import BoardHeader from './BoardHeader';
import Group from './Group';
import { FiPlus, FiTrash2, FiCopy, FiArrowRight } from 'react-icons/fi';
import { COLUMN_TYPES } from '../../data/defaultData';
import './Board.css';

export default function BoardView({ onOpenDetail }) {
  const { state, dispatch } = useBoard();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const board = state.boards.find((b) => b.id === state.activeBoardId);

  const handleSelectItem = useCallback((itemId, checked) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (checked) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  }, []);

  if (!board) {
    return (
      <div className="board-empty-state">
        <h2>No board selected</h2>
        <p>Create a new board or select one from the sidebar.</p>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'ADD_BOARD', name: 'New Board' })}
        >
          <FiPlus /> Create Board
        </button>
      </div>
    );
  }

  function handleBulkDelete() {
    if (selectedItems.size === 0) return;
    dispatch({ type: 'DELETE_ITEMS', boardId: board.id, itemIds: [...selectedItems] });
    setSelectedItems(new Set());
  }

  function handleBulkDuplicate() {
    selectedItems.forEach((itemId) => {
      for (const group of board.groups) {
        const item = group.items.find((i) => i.id === itemId);
        if (item) {
          dispatch({ type: 'DUPLICATE_ITEM', boardId: board.id, groupId: group.id, itemId });
          break;
        }
      }
    });
    setSelectedItems(new Set());
  }

  function handleBulkMove(toGroupId) {
    selectedItems.forEach((itemId) => {
      for (const group of board.groups) {
        const item = group.items.find((i) => i.id === itemId);
        if (item && group.id !== toGroupId) {
          dispatch({ type: 'MOVE_ITEM', boardId: board.id, itemId, fromGroupId: group.id, toGroupId });
          break;
        }
      }
    });
    setSelectedItems(new Set());
    setShowMoveMenu(false);
  }

  function handleAddColumn(type) {
    dispatch({
      type: 'ADD_COLUMN',
      boardId: board.id,
      columnType: type,
      title: COLUMN_TYPES[type].label,
      width: COLUMN_TYPES[type].width,
    });
    setShowAddColumn(false);
  }

  return (
    <div className="board-view">
      <BoardHeader board={board} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {selectedItems.size > 0 && (
        <div className="bulk-actions-bar">
          <span className="bulk-count">{selectedItems.size} selected</span>
          <button className="bulk-btn" onClick={handleBulkDuplicate}>
            <FiCopy size={14} /> Duplicate
          </button>
          <div className="bulk-move-wrapper">
            <button className="bulk-btn" onClick={() => setShowMoveMenu(!showMoveMenu)}>
              <FiArrowRight size={14} /> Move to
            </button>
            {showMoveMenu && (
              <div className="bulk-move-dropdown">
                {board.groups.map((g) => (
                  <div key={g.id} className="dropdown-option" onClick={() => handleBulkMove(g.id)}>
                    <span className="option-color" style={{ backgroundColor: g.color }} />
                    {g.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="bulk-btn danger" onClick={handleBulkDelete}>
            <FiTrash2 size={14} /> Delete
          </button>
          <button className="bulk-btn" onClick={() => setSelectedItems(new Set())}>
            Clear
          </button>
        </div>
      )}

      <div className="board-body">
        {board.groups.map((group) => (
          <Group
            key={group.id}
            group={group}
            boardId={board.id}
            columns={board.columns}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenDetail={onOpenDetail}
          />
        ))}

        <button
          className="add-group-btn"
          onClick={() => dispatch({ type: 'ADD_GROUP', boardId: board.id })}
        >
          <FiPlus size={14} /> Add new group
        </button>
      </div>

      <div className="add-column-area">
        <button className="add-column-btn" onClick={() => setShowAddColumn(!showAddColumn)}>
          <FiPlus size={14} />
        </button>
        {showAddColumn && (
          <div className="add-column-dropdown">
            {Object.entries(COLUMN_TYPES).map(([type, info]) => (
              <div key={type} className="dropdown-option" onClick={() => handleAddColumn(type)}>
                {info.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
