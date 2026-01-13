'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language } from '../types/language';
import { translations } from '../i18n';

interface LanguageContextData {
  readonly language: Language;
  readonly t: typeof translations.pt;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextData | null>(null);

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }

  const value = useMemo(
  () => ({
    language,
    t: translations[language],
    toggleLanguage,
  }),
  [language]
);

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
