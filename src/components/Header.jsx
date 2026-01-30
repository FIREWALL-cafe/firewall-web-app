import React, { useState, useEffect } from 'react';
import TimeDisplay from './TimeDisplay';
import useCookie from '../useCookie';
import { useLanguage } from '../context/LanguageContext';
import { getGlobalStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';

function Header() {
  const [username] = useCookie('username');
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});

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
          headerUsernameLabel: getDefault('global', 'headerUsernameLabel', language),
        });
      }
    }

    loadStrings();
  }, [language]);

  const usernameLabel = uiStrings.headerUsernameLabel || getDefault('global', 'headerUsernameLabel', language);

  return (
    <header className="bg-red-600 min-h-[56px] is-full-width-content">
      <div className=" mx-auto entry-content">
        <div className="flex justify-between items-center font-body-03-medium is-large-width-content">
          <TimeDisplay />
          <div className="hidden md:flex text-white items-center">
            <span className="font-bold mr-1">{usernameLabel}</span> {username}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
