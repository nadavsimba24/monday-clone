import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { loadState, saveState } from '../utils/storage';
import { createDefaultData } from '../data/defaultData';

const BoardContext = createContext();

function appendActivity(state, entry) {
  const next = [entry, ...(state.activity || [])];
  // keep the log small so we don't bloat localStorage
  if (next.length > 200) next.length = 200;
  return { ...state, activity: next };
}

function boardReducer(state, action) {
  switch (action.type) {
    // Board actions
    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoardId: action.boardId };

    case 'IMPORT_STATE': {
      const imported = action.state;
      if (!imported || typeof imported !== 'object') return state;
      const boards = Array.isArray(imported.boards) ? imported.boards : [];
      const activeBoardId = imported.activeBoardId && boards.some((b) => b.id === imported.activeBoardId)
        ? imported.activeBoardId
        : (boards[0]?.id || null);

      return {
        ...imported,
        boards,
        activeBoardId,
        people: Array.isArray(imported.people) ? imported.people : [],
        activity: Array.isArray(imported.activity) ? imported.activity : [],
      };
    }

    case 'CLEAR_ACTIVITY':
      return { ...state, activity: [] };

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
            color: '#4caf82',
            collapsed: false,
            items: [],
          },
        ],
      };
      return appendActivity(
        {
          ...state,
          boards: [...state.boards, newBoard],
          activeBoardId: newBoard.id,
        },
        { id: uuid(), ts: new Date().toISOString(), kind: 'activity.boardCreated', meta: { name: newBoard.name } }
      );
    }

    case 'ADD_BOARD_DIRECT': {
      return {
        ...state,
        boards: [...state.boards, action.board],
        activeBoardId: action.board.id,
      };
    }

    case 'DELETE_BOARD': {
      const board = state.boards.find((b) => b.id === action.boardId);
      const filtered = state.boards.filter((b) => b.id !== action.boardId);
      return appendActivity(
        {
          ...state,
          boards: filtered,
          activeBoardId:
            state.activeBoardId === action.boardId
              ? filtered[0]?.id || null
              : state.activeBoardId,
        },
        { id: uuid(), ts: new Date().toISOString(), kind: 'activity.boardDeleted', meta: { name: board?.name } }
      );
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
      const title = action.title || 'New Group';
      const next = updateBoard(state, action.boardId, (board) => ({
        ...board,
        groups: [
          ...board.groups,
          {
            id: uuid(),
            title,
            color: action.color || '#4caf82',
            collapsed: false,
            items: [],
          },
        ],
      }));
      return appendActivity(next, { id: uuid(), ts: new Date().toISOString(), kind: 'activity.groupCreated', meta: { name: title } });
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
    case 'ADD_ITEM': {
      const name = action.name || 'New Item';
      const next = updateGroup(state, action.boardId, action.groupId, (group) => ({
        ...group,
        items: [
          ...group.items,
          { id: uuid(), name, values: {} },
        ],
      }));
      return appendActivity(next, { id: uuid(), ts: new Date().toISOString(), kind: 'activity.itemCreated', meta: { name } });
    }

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
    case 'ADD_COMMENT': {
      const next = updateGroup(state, action.boardId, action.groupId, (group) => ({
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
      return appendActivity(next, { id: uuid(), ts: new Date().toISOString(), kind: 'activity.commentAdded' });
    }

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
    () => {
      const loaded = loadState();
      const base = loaded || createDefaultData();
      // lightweight migrations for older saved states
      return {
        ...base,
        activity: Array.isArray(base.activity) ? base.activity : [],
      };
    }
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
