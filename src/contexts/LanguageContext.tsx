'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types/language';
import { translations } from '../i18n';

interface LanguageContextData {
  language: Language;
  t: typeof translations.pt;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextData | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        toggleLanguage,
      }}
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
