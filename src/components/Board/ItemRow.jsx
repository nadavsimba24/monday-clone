import { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import StatusCell from '../Columns/StatusCell';
import PriorityCell from '../Columns/PriorityCell';
import DateCell from '../Columns/DateCell';
import PersonCell from '../Columns/PersonCell';
import TextCell from '../Columns/TextCell';
import NumberCell from '../Columns/NumberCell';

const CELL_MAP = {
  status: StatusCell,
  priority: PriorityCell,
  date: DateCell,
  person: PersonCell,
  text: TextCell,
  numbers: NumberCell,
};

export default function ItemRow({
  item, boardId, groupId, columns, groupColor,
  selected, onSelect, onOpenDetail,
  draggable, onDragStart, onDragOver, onDrop,
}) {
  const { dispatch } = useBoard();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const inputRef = useRef();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function saveName() {
    if (name.trim()) {
      dispatch({ type: 'RENAME_ITEM', boardId, groupId, itemId: item.id, name: name.trim() });
    } else {
      setName(item.name);
    }
    setEditing(false);
  }

  function handleCellChange(columnId, value) {
    dispatch({ type: 'UPDATE_ITEM_VALUE', boardId, groupId, itemId: item.id, columnId, value });
  }

  return (
    <div
      className={`item-row ${selected ? 'selected' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="group-color-bar" style={{ backgroundColor: groupColor }} />
      <div className="item-checkbox-area">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
        />
      </div>
      <div className="item-name-cell" onClick={() => onOpenDetail(item, groupId)}>
        {editing ? (
          <input
            ref={inputRef}
            className="item-name-input"
            value={name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName();
              if (e.key === 'Escape') { setName(item.name); setEditing(false); }
            }}
          />
        ) : (
          <span
            className="item-name"
            onDoubleClick={(e) => { e.stopPropagation(); setName(item.name); setEditing(true); }}
          >
            {item.name}
          </span>
        )}
      </div>
      {columns.map((col) => {
        const CellComponent = CELL_MAP[col.type];
        if (!CellComponent) return <div key={col.id} className="item-cell" style={{ width: col.width }} />;
        return (
          <div key={col.id} className="item-cell" style={{ width: col.width, minWidth: col.width }}>
            <CellComponent
              value={item.values[col.id]}
              onChange={(v) => handleCellChange(col.id, v)}
            />
          </div>
        );
      })}
    </div>
  );
}
