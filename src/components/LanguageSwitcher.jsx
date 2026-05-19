import React from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const isEN = language === LANGUAGES.EN;

  return (
    <button
      onClick={() => setLanguage(isEN ? LANGUAGES.ZH : LANGUAGES.EN)}
      className="flex gap-[6px] items-center justify-center px-[6px] py-[4px] rounded-[10000px]"
      aria-label={isEN ? 'Switch to Chinese' : 'Switch to English'}
    >
      <span
        className={`font-bold leading-[1.5] text-[15px] text-white whitespace-nowrap transition-opacity ${isEN ? 'opacity-100' : 'opacity-70'}`}
      >
        EN
      </span>
      <div className="flex items-center justify-center shrink-0">
        <div
          className="bg-[#f55b5b] border border-[#ad1a1a] flex h-[16px] items-center overflow-hidden p-[2.667px] rounded-[1000px] w-[32px] transition-all"
          style={{ justifyContent: isEN ? 'flex-start' : 'flex-end' }}
        >
          <div className="bg-white rounded-full shrink-0 size-[10.667px]" />
        </div>
      </div>
      <span
        className={`font-medium leading-[1.5] text-[15px] text-white whitespace-nowrap transition-opacity ${isEN ? 'opacity-70' : 'opacity-100'}`}
      >
        中文
      </span>
    </button>
  );
}

export default LanguageSwitcher;
