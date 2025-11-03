import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import ArrowRight from './icons/ArrowRight';

function InfoSection() {
  const { language } = useLanguage();
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
          infoCtaHeading: getDefault('homepage', 'infoCtaHeading', language),
          infoCtaHeadingZh: getDefault('homepage', 'infoCtaHeadingZh', language),
          infoCtaParagraph1: getDefault('homepage', 'infoCtaParagraph1', language),
          infoCtaParagraph2: getDefault('homepage', 'infoCtaParagraph2', language),
          infoCtaButton: getDefault('homepage', 'infoCtaButton', language),
          infoCtaButtonAriaLabel: getDefault('homepage', 'infoCtaButtonAriaLabel', language),
        });
      } finally {
        setLoading(false);
      }
    }

    loadStrings();
  }, [language]);

  if (loading) {
    // Loading skeleton
    return (
      <section className="w-full flex flex-col py-16">
        <div className="flex flex-col items-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col py-16">
      <div className="flex flex-col items-center">
        <div className="chinese text-center">
          <h2 className="font-display-04 font-medium leading-tight mb-2">
            <Link to="/search" className="hover:text-gray-800">
              {uiStrings.infoCtaHeading || getDefault('homepage', 'infoCtaHeading', language)}
            </Link>
          </h2>
          <div className="font-display-04 font-medium leading-tight text-red-600">
            {uiStrings.infoCtaHeadingZh || getDefault('homepage', 'infoCtaHeadingZh', language)}
          </div>
        </div>
        <div className="mt-8 space-y-6 font-body-01 text-center">
          <p>
            {uiStrings.infoCtaParagraph1 || getDefault('homepage', 'infoCtaParagraph1', language)}
          </p>
          <p>
            {uiStrings.infoCtaParagraph2 || getDefault('homepage', 'infoCtaParagraph2', language)}
          </p>
        </div>
        <Link
          to="/search"
          className="mt-8 inline-flex items-center px-6 py-3 text-lg text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
          aria-label={uiStrings.infoCtaButtonAriaLabel || getDefault('homepage', 'infoCtaButtonAriaLabel', language)}
        >
          {uiStrings.infoCtaButton || getDefault('homepage', 'infoCtaButton', language)}
          <ArrowRight fill="#DC2626" className="ml-2 w-6 h-6" />
        </Link>
      </div>
    </section>
  );
}

export default InfoSection;
