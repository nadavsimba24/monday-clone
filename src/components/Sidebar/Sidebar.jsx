import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import { FiPlus, FiStar, FiTrash2, FiCopy, FiChevronLeft, FiChevronRight, FiSearch, FiGrid, FiLayers, FiSettings, FiDownload, FiUpload, FiActivity } from 'react-icons/fi';
import WorkflowManager from '../Workflow/WorkflowManager';
import ActivityLogModal from '../Activity/ActivityLogModal';
import N8nWorkflowsModal from '../N8n/N8nWorkflowsModal';
import './Sidebar.css';

export default function Sidebar() {
  const { state, dispatch } = useBoard();
  const { t, lang, setLang, theme, setTheme, isRTL } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showN8n, setShowN8n] = useState(false);

  const favorites = state.boards.filter((b) => b.favorite);
  const filtered = state.boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddBoard() {
    dispatch({ type: 'ADD_BOARD', name: lang === 'he' ? 'לוח חדש' : 'New Board' });
  }

  function handleContextMenu(e, board) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, board });
  }

  function downloadJson() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `monday-clone-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function importJsonFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      dispatch({ type: 'IMPORT_STATE', state: parsed });
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
  }

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && (
          <>
            <div className="sidebar-header">
              <div className="workspace-name">
                <div className="workspace-icon">M</div>
                <span>{t('myWorkspace')}</span>
              </div>
            </div>

            <div className="sidebar-search">
              <FiSearch />
              <input
                placeholder={t('searchBoards')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="sidebar-workflow-btn-wrapper">
              <button className="sidebar-workflow-btn" onClick={() => setShowWorkflows(true)}>
                <FiLayers size={15} />
                <span>{t('workflowManager')}</span>
              </button>
            </div>

            {favorites.length > 0 && !search && (
              <div className="sidebar-section">
                <div className="section-title">
                  <FiStar size={12} /> {t('favorites')}
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
                <span className="section-title">{t('boards')}</span>
                <button className="add-board-btn" onClick={handleAddBoard} title={t('addBoard')}>
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

            <div className="sidebar-spacer" />

            <div className="settings-panel">
              <button
                className="settings-toggle-btn"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FiSettings size={14} />
                <span>{t('settings')}</span>
              </button>

              {showSettings && (
                <div className="settings-content">
                  <div className="settings-row">
                    <label>{t('language')}</label>
                    <div className="settings-btn-group">
                      <button
                        className={`settings-toggle ${lang === 'en' ? 'active' : ''}`}
                        onClick={() => setLang('en')}
                      >
                        {t('english')}
                      </button>
                      <button
                        className={`settings-toggle ${lang === 'he' ? 'active' : ''}`}
                        onClick={() => setLang('he')}
                      >
                        {t('hebrew')}
                      </button>
                    </div>
                  </div>
                  <div className="settings-row">
                    <label>{t('theme')}</label>
                    <div className="settings-btn-group">
                      <button
                        className={`settings-toggle ${theme === 'default' ? 'active' : ''}`}
                        onClick={() => setTheme('default')}
                      >
                        {t('defaultTheme')}
                      </button>
                      <button
                        className={`settings-toggle ${theme === 'bloomberg' ? 'active' : ''}`}
                        onClick={() => setTheme('bloomberg')}
                      >
                        {t('bloomberg')}
                      </button>
                    </div>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-row">
                    <label>{t('activityLog')}</label>
                    <button className="settings-action-btn" onClick={() => setShowActivity(true)}>
                      <FiActivity size={14} />
                      {t('activityLog')}
                    </button>
                  </div>

                  <div className="settings-row">
                    <label>{t('n8n')}</label>
                    <button className="settings-action-btn" onClick={() => setShowN8n(true)}>
                      {t('n8nWorkflows')}
                    </button>
                  </div>

                  <div className="settings-row">
                    <label>{t('exportData')}</label>
                    <button className="settings-action-btn" onClick={downloadJson}>
                      <FiDownload size={14} />
                      {t('exportJson')}
                    </button>
                  </div>

                  <div className="settings-row">
                    <label>{t('importData')}</label>
                    <label className="settings-action-btn" style={{ cursor: 'pointer' }}>
                      <FiUpload size={14} />
                      {t('importJson')}
                      <input
                        type="file"
                        accept="application/json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          importJsonFile(file);
                        }}
                      />
                    </label>
                  </div>

                  <div className="settings-row">
                    <label>{t('resetDb')}</label>
                    <button
                      className="settings-action-btn"
                      onClick={async () => {
                        try {
                          const resp = await fetch('/api/state/reset?seed=1', { method: 'POST' });
                          const json = await resp.json().catch(() => ({}));
                          if (resp.ok && json?.state) {
                            dispatch({ type: 'IMPORT_STATE', state: json.state });
                          }
                        } catch (e) {
                          console.error('Reset failed', e);
                        }
                      }}
                    >
                      {t('seedDemoData')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed
            ? (isRTL ? <FiChevronLeft /> : <FiChevronRight />)
            : (isRTL ? <FiChevronRight /> : <FiChevronLeft />)
          }
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
              {contextMenu.board.favorite ? t('removeFromFavorites') : t('addToFavorites')}
            </div>
            <div
              className="context-item"
              onClick={() => {
                dispatch({ type: 'DUPLICATE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiCopy size={14} />
              {t('duplicateBoard')}
            </div>
            <div
              className="context-item danger"
              onClick={() => {
                dispatch({ type: 'DELETE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiTrash2 size={14} />
              {t('deleteBoard')}
            </div>
          </div>
        </div>
      )}

      {showWorkflows && (
        <WorkflowManager onClose={() => setShowWorkflows(false)} />
      )}

      {showActivity && (
        <ActivityLogModal
          activity={state.activity}
          onClose={() => setShowActivity(false)}
          onClear={() => dispatch({ type: 'CLEAR_ACTIVITY' })}
        />
      )}

      {showN8n && (
        <N8nWorkflowsModal onClose={() => setShowN8n(false)} />
      )}
    </>
  );
}
