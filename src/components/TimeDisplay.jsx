import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getGlobalStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';

function timeInShanghai() {
  return new Date().toLocaleTimeString('en-us', {
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  });
}

function TimeDisplay() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-us', { timeStyle: 'short' })
  );
  const [beijingTime, setBeijingTime] = useState(timeInShanghai());

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        const strings = await getGlobalStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load global strings:', error);
        // Language-aware fallback
        setUiStrings({
          timeDisplayYourTime: getDefault('global', 'timeDisplayYourTime', language),
          timeDisplayBeijing: getDefault('global', 'timeDisplayBeijing', language),
        });
      }
    }

    loadStrings();
  }, [language]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-us', { timeStyle: 'short' }));
      setBeijingTime(timeInShanghai());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const yourTimeLabel = uiStrings.timeDisplayYourTime || getDefault('global', 'timeDisplayYourTime', language);
  const beijingLabel = uiStrings.timeDisplayBeijing || getDefault('global', 'timeDisplayBeijing', language);

  return (
    <div className="flex items-center font-medium text-center h-[56px] min-w-[240px] text-slate-100">
      <div className="flex gap-5 items-center self-stretch my-auto min-w-[240px]">
        <div className="self-stretch my-auto max-md:min-w-0 max-md:hidden">
          {yourTimeLabel} {currentTime}
        </div>
        <div className="self-stretch my-auto">{beijingLabel} {beijingTime}</div>
      </div>
    </div>
  );
}

export default TimeDisplay;
