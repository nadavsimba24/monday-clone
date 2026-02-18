import Modal from '../Common/Modal';
import { useSettings } from '../../context/SettingsContext';
import './ActivityLogModal.css';

function formatTime(ts, lang) {
  try {
    return new Date(ts).toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return ts;
  }
}

function kindToLabel(kind, t) {
  return t(kind) || kind;
}

export default function ActivityLogModal({ activity, onClose, onClear }) {
  const { t, lang } = useSettings();

  return (
    <Modal title={t('activityLog')} onClose={onClose}>
      <div className="activity-modal">
        <div className="activity-actions">
          <button className="btn-secondary" onClick={onClear}>
            {t('clearActivity')}
          </button>
        </div>

        {(!activity || activity.length === 0) ? (
          <div className="activity-empty">{t('noActivityYet')}</div>
        ) : (
          <div className="activity-list">
            {activity.map((e) => (
              <div key={e.id} className="activity-item">
                <div className="activity-line">
                  <span className="activity-kind">{kindToLabel(e.kind, t)}</span>
                  {e.meta?.name && <span className="activity-meta">· {e.meta.name}</span>}
                </div>
                <div className="activity-time">{formatTime(e.ts, lang)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
