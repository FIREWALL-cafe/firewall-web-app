import React, { useEffect, useRef, useState } from 'react';
import SearchInput from './SearchInput';
import Typed from 'typed.js';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';

function HeroSection() {
  const { language } = useLanguage();
  const el = useRef(null);
  const typed = useRef(null);
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getHomepageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load homepage strings:', error);
        // Language-aware fallback
        setUiStrings({
          heroTitleAnimated: getDefault('homepage', 'heroTitleAnimated', language),
        });
      } finally {
        setLoading(false);
      }
    }

    loadStrings();
  }, [language]);

  useEffect(() => {
    if (loading || !uiStrings.heroTitleAnimated) return;

    // Handle heroTitleAnimated as pipe-delimited string or array
    let titles;
    if (typeof uiStrings.heroTitleAnimated === 'string') {
      titles = uiStrings.heroTitleAnimated.split('|').map(s => s.trim());
    } else if (Array.isArray(uiStrings.heroTitleAnimated)) {
      titles = uiStrings.heroTitleAnimated;
    } else {
      // Language-aware fallback
      const fallbackString = getDefault('homepage', 'heroTitleAnimated', language);
      titles = fallbackString.split('|').map(s => s.trim());
    }

    const options = {
      strings: titles,
      typeSpeed: 75,
      loop: true,
    };
    typed.current = new Typed(el.current, options);
    return () => {
      typed.current.destroy();
    };
  }, [loading, uiStrings.heroTitleAnimated, language]);

  return (
    <section className="w-full flex flex-col items-center py-16">
      {loading ? (
        // Loading skeleton
        <div className="h-[72px] md:h-[120px] lg:h-[144px] mb-24 ipad-portrait:mb-0 w-full max-w-[720px] flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-12 w-3/4 rounded"></div>
        </div>
      ) : (
        <h1
          aria-live="polite"
          className="font-bitmap-song font-display-01 text-center h-[72px] md:h-[120px] lg:h-[144px] mb-24 ipad-portrait:mb-0"
        >
          <span ref={el} />
        </h1>
      )}
      <div className="w-full max-w-[720px] mx-auto mt-16 ipad-portrait:mt-0">
        <SearchInput searchMode="compare" />
      </div>
    </section>
  );
}

export default HeroSection;
