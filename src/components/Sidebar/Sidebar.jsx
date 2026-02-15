import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { FiPlus, FiStar, FiTrash2, FiCopy, FiChevronLeft, FiChevronRight, FiSearch, FiGrid, FiLayers } from 'react-icons/fi';
import WorkflowManager from '../Workflow/WorkflowManager';
import './Sidebar.css';

export default function Sidebar() {
  const { state, dispatch } = useBoard();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showWorkflows, setShowWorkflows] = useState(false);

  const favorites = state.boards.filter((b) => b.favorite);
  const filtered = state.boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddBoard() {
    dispatch({ type: 'ADD_BOARD', name: 'New Board' });
  }

  function handleContextMenu(e, board) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, board });
  }

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && (
          <>
            <div className="sidebar-header">
              <div className="workspace-name">
                <div className="workspace-icon">M</div>
                <span>My Workspace</span>
              </div>
            </div>

            <div className="sidebar-search">
              <FiSearch />
              <input
                placeholder="Search boards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="sidebar-workflow-btn-wrapper">
              <button className="sidebar-workflow-btn" onClick={() => setShowWorkflows(true)}>
                <FiLayers size={15} />
                <span>Workflow Manager</span>
              </button>
            </div>

            {favorites.length > 0 && !search && (
              <div className="sidebar-section">
                <div className="section-title">
                  <FiStar size={12} /> Favorites
                </div>
                {favorites.map((board) => (
                  <div
                    key={board.id}
                    className={`board-item ${state.activeBoardId === board.id ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_BOARD', boardId: board.id })}
                    onContextMenu={(e) => handleContextMenu(e, board)}
                  >
                    <FiGrid size={14} />
                    <span>{board.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="sidebar-section">
              <div className="section-title-row">
                <span className="section-title">Boards</span>
                <button className="add-board-btn" onClick={handleAddBoard} title="Add board">
                  <FiPlus size={14} />
                </button>
              </div>
              {filtered.map((board) => (
                <div
                  key={board.id}
                  className={`board-item ${state.activeBoardId === board.id ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_BOARD', boardId: board.id })}
                  onContextMenu={(e) => handleContextMenu(e, board)}
                >
                  <FiGrid size={14} />
                  <span>{board.name}</span>
                  {board.favorite && <FiStar size={12} className="fav-icon" />}
                </div>
              ))}
            </div>
          </>
        )}

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {contextMenu && (
        <div
          className="context-menu-overlay"
          onClick={() => setContextMenu(null)}
        >
          <div
            className="context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="context-item"
              onClick={() => {
                dispatch({ type: 'TOGGLE_FAVORITE', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiStar size={14} />
              {contextMenu.board.favorite ? 'Remove from favorites' : 'Add to favorites'}
            </div>
            <div
              className="context-item"
              onClick={() => {
                dispatch({ type: 'DUPLICATE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiCopy size={14} />
              Duplicate board
            </div>
            <div
              className="context-item danger"
              onClick={() => {
                dispatch({ type: 'DELETE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiTrash2 size={14} />
              Delete board
            </div>
          </div>
        </div>
      )}

      {showWorkflows && (
        <WorkflowManager onClose={() => setShowWorkflows(false)} />
      )}
    </>
  );
}
