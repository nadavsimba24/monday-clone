import { useRef, useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useSettings } from '../../context/SettingsContext';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiGrid,
  FiLayers,
  FiPlus,
  FiSearch,
  FiSettings,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import WorkflowManager from '../Workflow/WorkflowManager';
import ActivityLogModal from '../Activity/ActivityLogModal';
import N8nWorkflowsModal from '../N8n/N8nWorkflowsModal';

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

  const fileInputRef = useRef(null);

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
      <div
        className={`relative h-screen ${collapsed ? 'w-16' : 'w-[280px]'} shrink-0 bg-white border-r border-cu-border flex flex-col`}
      >
        {!collapsed && (
          <>
            <div className="px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cu-primary to-cu-primary2 text-white flex items-center justify-center font-bold">
                  M
                </div>
                <div className="font-semibold text-sm text-cu-text">{t('myWorkspace')}</div>
              </div>

              <div className="mt-3 flex items-center gap-2 px-3 py-2 border border-cu-border rounded-cu bg-white">
                <FiSearch className="text-cu-muted" />
                <input
                  className="w-full outline-none text-sm"
                  placeholder={t('searchBoards')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-cu bg-cu-primary text-white text-sm font-semibold hover:opacity-95"
                onClick={() => setShowWorkflows(true)}
              >
                <FiLayers size={15} />
                {t('workflowManager')}
              </button>
            </div>

            {favorites.length > 0 && !search && (
              <div className="px-2 pb-2">
                <div className="px-2 py-2 text-[11px] uppercase tracking-wide text-cu-muted flex items-center gap-2">
                  <FiStar size={12} /> {t('favorites')}
                </div>
                {favorites.map((board) => (
                  <div
                    key={board.id}
                    className={`mx-1 px-2 py-2 rounded-cu cursor-pointer flex items-center gap-2 text-sm ${state.activeBoardId === board.id ? 'bg-cu-bg' : 'hover:bg-cu-bg'}`}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_BOARD', boardId: board.id })}
                    onContextMenu={(e) => handleContextMenu(e, board)}
                  >
                    <FiGrid size={14} className="text-cu-muted" />
                    <span className="flex-1 truncate">{board.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="px-2 pb-2">
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wide text-cu-muted">{t('boards')}</div>
                <button
                  className="h-8 w-8 inline-flex items-center justify-center rounded-cu border border-cu-border hover:bg-cu-bg"
                  onClick={handleAddBoard}
                  title={t('addBoard')}
                >
                  <FiPlus size={15} />
                </button>
              </div>

              {filtered.map((board) => (
                <div
                  key={board.id}
                  className={`mx-1 px-2 py-2 rounded-cu cursor-pointer flex items-center gap-2 text-sm ${state.activeBoardId === board.id ? 'bg-cu-bg' : 'hover:bg-cu-bg'}`}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_BOARD', boardId: board.id })}
                  onContextMenu={(e) => handleContextMenu(e, board)}
                >
                  <FiGrid size={14} className="text-cu-muted" />
                  <span className="flex-1 truncate">{board.name}</span>
                  {board.favorite && <FiStar size={12} className="text-yellow-500" />}
                </div>
              ))}
            </div>

            <div className="flex-1" />

            <div className="px-4 pb-4 border-t border-cu-border">
              <button
                className="mt-3 w-full inline-flex items-center gap-2 px-3 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
                onClick={() => setShowSettings((v) => !v)}
              >
                <FiSettings size={14} className="text-cu-muted" />
                <span>{t('settings')}</span>
              </button>

              {showSettings && (
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-cu-muted mb-1">{t('language')}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className={`px-2 py-2 rounded-cu border text-sm ${lang === 'en' ? 'border-cu-primary text-cu-primary' : 'border-cu-border hover:bg-cu-bg'}`}
                        onClick={() => setLang('en')}
                      >
                        {t('english')}
                      </button>
                      <button
                        className={`px-2 py-2 rounded-cu border text-sm ${lang === 'he' ? 'border-cu-primary text-cu-primary' : 'border-cu-border hover:bg-cu-bg'}`}
                        onClick={() => setLang('he')}
                      >
                        {t('hebrew')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-cu-muted mb-1">{t('theme')}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className={`px-2 py-2 rounded-cu border text-sm ${theme === 'default' ? 'border-cu-primary text-cu-primary' : 'border-cu-border hover:bg-cu-bg'}`}
                        onClick={() => setTheme('default')}
                      >
                        {t('defaultTheme')}
                      </button>
                      <button
                        className={`px-2 py-2 rounded-cu border text-sm ${theme === 'bloomberg' ? 'border-cu-primary text-cu-primary' : 'border-cu-border hover:bg-cu-bg'}`}
                        onClick={() => setTheme('bloomberg')}
                      >
                        {t('bloomberg')}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-cu-border" />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-2 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
                      onClick={() => setShowActivity(true)}
                    >
                      {t('activityLog')}
                    </button>
                    <button
                      className="px-2 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
                      onClick={() => setShowN8n(true)}
                    >
                      {t('n8nWorkflows')}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-2 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
                      onClick={downloadJson}
                    >
                      {t('exportJson')}
                    </button>
                    <button
                      className="px-2 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('importJson')}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        importJsonFile(file);
                      }}
                    />
                  </div>

                  <button
                    className="w-full px-3 py-2 rounded-cu border border-cu-border hover:bg-cu-bg text-sm"
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
              )}
            </div>
          </>
        )}

        <button
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-cu-border shadow-cu flex items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed
            ? (isRTL ? <FiChevronLeft /> : <FiChevronRight />)
            : (isRTL ? <FiChevronRight /> : <FiChevronLeft />)}
        </button>
      </div>

      {contextMenu && (
        <div className="fixed inset-0 z-[1300]" onClick={() => setContextMenu(null)}>
          <div
            className="fixed z-[1301] bg-white border border-cu-border rounded-cu shadow-cu py-1 min-w-[210px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-cu-bg flex items-center gap-2"
              onClick={() => {
                dispatch({ type: 'TOGGLE_FAVORITE', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiStar size={14} />
              {contextMenu.board.favorite ? t('removeFromFavorites') : t('addToFavorites')}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-cu-bg flex items-center gap-2"
              onClick={() => {
                dispatch({ type: 'DUPLICATE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiCopy size={14} />
              {t('duplicateBoard')}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-cu-bg flex items-center gap-2 text-red-600"
              onClick={() => {
                dispatch({ type: 'DELETE_BOARD', boardId: contextMenu.board.id });
                setContextMenu(null);
              }}
            >
              <FiTrash2 size={14} />
              {t('deleteBoard')}
            </button>
          </div>
        </div>
      )}

      {showWorkflows && <WorkflowManager onClose={() => setShowWorkflows(false)} />}

      {showActivity && (
        <ActivityLogModal
          activity={state.activity}
          onClose={() => setShowActivity(false)}
          onClear={() => dispatch({ type: 'CLEAR_ACTIVITY' })}
        />
      )}

      {showN8n && <N8nWorkflowsModal onClose={() => setShowN8n(false)} />}
    </>
  );
}
