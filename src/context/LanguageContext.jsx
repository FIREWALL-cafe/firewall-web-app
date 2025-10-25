import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  EN: 'en',
  ZH: 'zh',
};

export const LANGUAGE_LABELS = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.ZH]: '中文',
};

export function LanguageProvider({ children }) {
  // Try to get language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || LANGUAGES.EN;
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === LANGUAGES.EN ? LANGUAGES.ZH : LANGUAGES.EN));
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isEnglish: language === LANGUAGES.EN,
    isChinese: language === LANGUAGES.ZH,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
