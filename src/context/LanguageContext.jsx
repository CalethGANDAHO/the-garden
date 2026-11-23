import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext({
  language: 'fr',
  setLanguage: () => {},
  t: translations.fr
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('garden_lang');
      return (saved && ['fr', 'en', 'yo'].includes(saved)) ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('garden_lang', language);
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const t = translations[language] || translations.fr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
