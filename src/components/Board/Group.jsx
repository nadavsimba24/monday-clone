import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import GroupHeader from './GroupHeader';
import ItemRow from './ItemRow';
import AddItem from './AddItem';
import SummaryRow from './SummaryRow';

export default function Group({ group, boardId, columns, searchTerm, selectedItems, onSelectItem, onOpenDetail }) {
  const { dispatch } = useBoard();
  const [dragItemId, setDragItemId] = useState(null);

  const filteredItems = searchTerm
    ? group.items.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : group.items;

  function handleDragStart(e, item) {
    setDragItemId(item.id);
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, fromGroupId: group.id }));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDropOnGroup(e) {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.fromGroupId !== group.id) {
        dispatch({
          type: 'MOVE_ITEM',
          boardId,
          itemId: data.itemId,
          fromGroupId: data.fromGroupId,
          toGroupId: group.id,
        });
      }
    } catch {}
    setDragItemId(null);
  }

  function handleDropOnItem(e, targetIndex) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.fromGroupId === group.id) {
        const fromIndex = group.items.findIndex((i) => i.id === data.itemId);
        if (fromIndex !== targetIndex) {
          dispatch({ type: 'REORDER_ITEM', boardId, groupId: group.id, fromIndex, toIndex: targetIndex });
        }
      } else {
        dispatch({
          type: 'MOVE_ITEM',
          boardId,
          itemId: data.itemId,
          fromGroupId: data.fromGroupId,
          toGroupId: group.id,
        });
      }
    } catch {}
    setDragItemId(null);
  }

  return (
    <div
      className="group"
      onDragOver={handleDragOver}
      onDrop={handleDropOnGroup}
    >
      <GroupHeader
        group={group}
        boardId={boardId}
        itemCount={group.items.length}
        columns={columns}
      />

      {!group.collapsed && (
        <>
          {filteredItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              boardId={boardId}
              groupId={group.id}
              columns={columns}
              groupColor={group.color}
              selected={selectedItems.has(item.id)}
              onSelect={onSelectItem}
              onOpenDetail={onOpenDetail}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnItem(e, idx)}
            />
          ))}
          <AddItem
            groupColor={group.color}
            onAdd={(name) => dispatch({ type: 'ADD_ITEM', boardId, groupId: group.id, name })}
          />
          {group.items.length > 0 && (
            <SummaryRow items={group.items} columns={columns} groupColor={group.color} />
          )}
        </>
      )}
    </div>
  );
}
