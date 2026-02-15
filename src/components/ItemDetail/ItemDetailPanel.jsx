import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { FiX, FiTrash2, FiCopy, FiSend } from 'react-icons/fi';
import StatusCell from '../Columns/StatusCell';
import PriorityCell from '../Columns/PriorityCell';
import DateCell from '../Columns/DateCell';
import PersonCell from '../Columns/PersonCell';
import TextCell from '../Columns/TextCell';
import NumberCell from '../Columns/NumberCell';
import './ItemDetail.css';

const CELL_MAP = {
  status: StatusCell,
  priority: PriorityCell,
  date: DateCell,
  person: PersonCell,
  text: TextCell,
  numbers: NumberCell,
};

export default function ItemDetailPanel({ item, groupId, boardId, onClose }) {
  const { state, dispatch } = useBoard();
  const [commentText, setCommentText] = useState('');
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return null;

  const group = board.groups.find((g) => g.id === groupId);
  const currentItem = group?.items.find((i) => i.id === item.id);
  if (!currentItem) return null;

  function handleValueChange(columnId, value) {
    dispatch({ type: 'UPDATE_ITEM_VALUE', boardId, groupId, itemId: item.id, columnId, value });
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    dispatch({ type: 'ADD_COMMENT', boardId, groupId, itemId: item.id, text: commentText.trim() });
    setCommentText('');
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_ITEM', boardId, groupId, itemId: item.id });
    onClose();
  }

  function handleDuplicate() {
    dispatch({ type: 'DUPLICATE_ITEM', boardId, groupId, itemId: item.id });
    onClose();
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <h2 className="detail-title">{currentItem.name}</h2>
          <div className="detail-actions">
            <button className="detail-action-btn" onClick={handleDuplicate} title="Duplicate">
              <FiCopy />
            </button>
            <button className="detail-action-btn danger" onClick={handleDelete} title="Delete">
              <FiTrash2 />
            </button>
            <button className="detail-close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="detail-group-badge" style={{ backgroundColor: group?.color }}>
          {group?.title}
        </div>

        <div className="detail-fields">
          {board.columns.map((col) => {
            const CellComponent = CELL_MAP[col.type];
            if (!CellComponent) return null;
            return (
              <div key={col.id} className="detail-field">
                <label className="detail-field-label">{col.title}</label>
                <div className="detail-field-value">
                  <CellComponent
                    value={currentItem.values[col.id]}
                    onChange={(v) => handleValueChange(col.id, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="detail-updates">
          <h3>Updates</h3>
          <div className="comment-input-area">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write an update..."
              rows={3}
            />
            <button
              className="send-comment-btn"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              <FiSend /> Send
            </button>
          </div>
          <div className="comments-list">
            {(currentItem.comments || []).slice().reverse().map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-date">
                  {new Date(comment.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
