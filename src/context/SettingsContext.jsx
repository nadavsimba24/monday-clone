import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, STATUS_LABELS, PRIORITY_LABELS, COLUMN_TYPE_LABELS } from '../i18n/translations';

const SettingsContext = createContext();

const SETTINGS_KEY = 'monday_clone_settings';

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function SettingsProvider({ children }) {
  const saved = loadSettings();
  const [lang, setLang] = useState(saved?.lang || 'en');
  const [theme, setTheme] = useState(saved?.theme || 'default');

  useEffect(() => {
    saveSettings({ lang, theme });
  }, [lang, theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  const tStatus = useCallback((label) => {
    if (!label) return '';
    return STATUS_LABELS[lang]?.[label] || label;
  }, [lang]);

  const tPriority = useCallback((label) => {
    if (!label) return '';
    return PRIORITY_LABELS[lang]?.[label] || label;
  }, [lang]);

  const tColumnType = useCallback((type) => {
    return COLUMN_TYPE_LABELS[lang]?.[type] || type;
  }, [lang]);

  const isRTL = lang === 'he';

  return (
    <SettingsContext.Provider value={{ lang, setLang, theme, setTheme, t, tStatus, tPriority, tColumnType, isRTL }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
