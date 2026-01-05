'use client';

import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded border text-sm"
    >
      {language === 'pt' ? 'EN' : 'PT'}
    </button>
  );
}
