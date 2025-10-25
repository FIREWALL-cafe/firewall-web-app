import React from 'react';
import { useLanguage, LANGUAGES, LANGUAGE_LABELS } from '../context/LanguageContext';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <div className="flex gap-1">
        {Object.entries(LANGUAGES).map(([_key, lang]) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              language === lang
                ? 'bg-red-600 text-white font-medium'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            aria-label={`Switch to ${LANGUAGE_LABELS[lang]}`}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
