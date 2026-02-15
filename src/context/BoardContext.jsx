import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { loadState, saveState } from '../utils/storage';
import { createDefaultData } from '../data/defaultData';

const BoardContext = createContext();

function boardReducer(state, action) {
  switch (action.type) {
    // Board actions
    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoardId: action.boardId };

    case 'ADD_BOARD': {
      const newBoard = {
        id: uuid(),
        name: action.name || 'New Board',
        favorite: false,
        columns: [
          { id: uuid(), type: 'status', title: 'Status', width: 140 },
          { id: uuid(), type: 'person', title: 'Owner', width: 140 },
          { id: uuid(), type: 'date', title: 'Due Date', width: 140 },
          { id: uuid(), type: 'priority', title: 'Priority', width: 140 },
        ],
        groups: [
          {
            id: uuid(),
            title: 'Group 1',
            color: '#579bfc',
            collapsed: false,
            items: [],
          },
        ],
      };
      return {
        ...state,
        boards: [...state.boards, newBoard],
        activeBoardId: newBoard.id,
      };
    }

    case 'DELETE_BOARD': {
      const filtered = state.boards.filter((b) => b.id !== action.boardId);
      return {
        ...state,
        boards: filtered,
        activeBoardId:
          state.activeBoardId === action.boardId
            ? filtered[0]?.id || null
            : state.activeBoardId,
      };
    }

    case 'RENAME_BOARD':
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId ? { ...b, name: action.name } : b
        ),
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId ? { ...b, favorite: !b.favorite } : b
        ),
      };

    case 'DUPLICATE_BOARD': {
      const source = state.boards.find((b) => b.id === action.boardId);
      if (!source) return state;
      const dup = JSON.parse(JSON.stringify(source));
      dup.id = uuid();
      dup.name = source.name + ' (copy)';
      dup.groups.forEach((g) => {
        g.id = uuid();
        g.items.forEach((i) => (i.id = uuid()));
      });
      dup.columns.forEach((c) => (c.id = uuid()));
      return {
        ...state,
        boards: [...state.boards, dup],
        activeBoardId: dup.id,
      };
    }

    // Group actions
    case 'ADD_GROUP': {
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: [
          ...board.groups,
          {
            id: uuid(),
            title: action.title || 'New Group',
            color: action.color || '#579bfc',
            collapsed: false,
            items: [],
          },
        ],
      }));
    }

    case 'DELETE_GROUP':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: board.groups.filter((g) => g.id !== action.groupId),
      }));

    case 'RENAME_GROUP':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: board.groups.map((g) =>
          g.id === action.groupId ? { ...g, title: action.title } : g
        ),
      }));

    case 'SET_GROUP_COLOR':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: board.groups.map((g) =>
          g.id === action.groupId ? { ...g, color: action.color } : g
        ),
      }));

    case 'TOGGLE_GROUP_COLLAPSE':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: board.groups.map((g) =>
          g.id === action.groupId ? { ...g, collapsed: !g.collapsed } : g
        ),
      }));

    case 'MOVE_GROUP': {
      return updateBoard(state, action.boardId, (board) => {
        const groups = [...board.groups];
        const [moved] = groups.splice(action.fromIndex, 1);
        groups.splice(action.toIndex, 0, moved);
        return { ...board, groups };
      });
    }

    // Item actions
    case 'ADD_ITEM':
      return updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: [
          ...group.items,
          { id: uuid(), name: action.name || 'New Item', values: {} },
        ],
      }));

    case 'DELETE_ITEM':
      return updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: group.items.filter((i) => i.id !== action.itemId),
      }));

    case 'DELETE_ITEMS': {
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: board.groups.map((g) => ({
          ...g,
          items: g.items.filter((i) => !action.itemIds.includes(i.id)),
        })),
      }));
    }

    case 'RENAME_ITEM':
      return updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: group.items.map((i) =>
          i.id === action.itemId ? { ...i, name: action.name } : i
        ),
      }));

    case 'UPDATE_ITEM_VALUE':
      return updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: group.items.map((i) =>
          i.id === action.itemId
            ? { ...i, values: { ...i.values, [action.columnId]: action.value } }
            : i
        ),
      }));

    case 'DUPLICATE_ITEM':
      return updateGroup(state, action.boardId, action.groupId, (group) => {
        const source = group.items.find((i) => i.id === action.itemId);
        if (!source) return group;
        const dup = { ...JSON.parse(JSON.stringify(source)), id: uuid() };
        const idx = group.items.findIndex((i) => i.id === action.itemId);
        const items = [...group.items];
        items.splice(idx + 1, 0, dup);
        return { ...group, items };
      });

    case 'MOVE_ITEM': {
      let movedItem = null;
      const stateAfterRemove = updateGroup(
        state,
        action.boardId,
        action.fromGroupId,
        (group) => {
          movedItem = group.items.find((i) => i.id === action.itemId);
          return {
            ...group,
            items: group.items.filter((i) => i.id !== action.itemId),
          };
        }
      );
      if (!movedItem) return state;
      return updateGroup(
        stateAfterRemove,
        action.boardId,
        action.toGroupId,
        (group) => ({
          ...group,
          items: [...group.items, movedItem],
        })
      );
    }

    case 'REORDER_ITEM': {
      return updateGroup(state, action.boardId, action.groupId, (group) => {
        const items = [...group.items];
        const [moved] = items.splice(action.fromIndex, 1);
        items.splice(action.toIndex, 0, moved);
        return { ...group, items };
      });
    }

    // Column actions
    case 'ADD_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: [
          ...board.columns,
          {
            id: uuid(),
            type: action.columnType,
            title: action.title || action.columnType.charAt(0).toUpperCase() + action.columnType.slice(1),
            width: action.width || 140,
          },
        ],
      }));

    case 'DELETE_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns.filter((c) => c.id !== action.columnId),
      }));

    case 'RENAME_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, title: action.title } : c
        ),
      }));

    case 'RESIZE_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, width: action.width } : c
        ),
      }));

    // Item updates (comments)
    case 'ADD_COMMENT':
      return updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: group.items.map((i) =>
          i.id === action.itemId
            ? {
                ...i,
                comments: [
                  ...(i.comments || []),
                  { id: uuid(), text: action.text, date: new Date().toISOString() },
                ],
              }
            : i
        ),
      }));

    default:
      return state;
  }
}

function updateBoard(state, boardId, updater) {
  return {
    ...state,
    boards: state.boards.map((b) => (b.id === boardId ? updater(b) : b)),
  };
}

function updateGroup(state, boardId, groupId, updater) {
  return updateBoard(state, boardId, (board) => ({
    ...board,
    groups: board.groups.map((g) => (g.id === groupId ? updater(g) : g)),
  }));
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(
    boardReducer,
    null,
    () => loadState() || createDefaultData()
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be inside BoardProvider');
  return ctx;
}
