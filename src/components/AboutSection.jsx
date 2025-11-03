import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import ArrowRight from './icons/ArrowRight';
import censoreda from '../assets/images/homepage-section_1-image_a-default.jpg';
import censoredb from '../assets/images/homepage-section_1-image_b-default.jpg';
import censoredc from '../assets/images/homepage-section_1-image_c-default.jpg';

import hovera from '../assets/images/homepage-section_1-image_a-hover.jpg';
import hoverb from '../assets/images/homepage-section_1-image_b-hover.jpg';
import hoverc from '../assets/images/homepage-section_1-image_c-hover.jpg';

function AboutSection() {
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
          aboutMainHeading: getDefault('homepage', 'aboutMainHeading', language),
          aboutMainHeadingZh: getDefault('homepage', 'aboutMainHeadingZh', language),
          aboutIntroParagraph1: getDefault('homepage', 'aboutIntroParagraph1', language),
          aboutIntroParagraph2: getDefault('homepage', 'aboutIntroParagraph2', language),
          aboutButtonText: getDefault('homepage', 'aboutButtonText', language),
          aboutButtonAriaLabel: getDefault('homepage', 'aboutButtonAriaLabel', language),
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
      <section className="w-full flex flex-col py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          <div className="w-full md:w-[55%] order-2 md:order-1">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="w-full md:w-[40%] space-y-4 order-1 md:order-2">
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col py-8 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 justify-between">
        <div className="w-full md:w-[55%] order-2 md:order-1">
          <div className="font-bitmap-song">
            <h2 className="font-display-04 mb-2">
              <Link to="/about" className="hover:text-neutral-800">
                {uiStrings.aboutMainHeading || getDefault('homepage', 'aboutMainHeading', language)}
              </Link>
            </h2>
            <div className="font-display-04 text-red-600">
              {uiStrings.aboutMainHeadingZh || getDefault('homepage', 'aboutMainHeadingZh', language)}
            </div>
          </div>
          <div className="mt-8 space-y-6 font-body-01">
            <p>
              {uiStrings.aboutIntroParagraph1 || getDefault('homepage', 'aboutIntroParagraph1', language)}
            </p>
            <p>
              {uiStrings.aboutIntroParagraph2 || getDefault('homepage', 'aboutIntroParagraph2', language)}
            </p>
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center px-6 py-3 font-body-03-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
            aria-label={uiStrings.aboutButtonAriaLabel || getDefault('homepage', 'aboutButtonAriaLabel', language)}
          >
            {uiStrings.aboutButtonText || getDefault('homepage', 'aboutButtonText', language)}
            <ArrowRight fill="#DC2626" className="ml-2 w-6 h-6" />
          </Link>
        </div>

        <div className="w-full md:w-[40%] space-y-4 order-1 md:order-2">
          <div className="w-full overflow-hidden">
            <img
              src={censoreda}
              onMouseOver={e => (e.currentTarget.src = hovera)}
              onMouseOut={e => (e.currentTarget.src = censoreda)}
              alt="Illustration 1"
              className="w-full object-cover aspect-[2]"
            />
          </div>
          <div className="w-full overflow-hidden">
            <img
              src={censoredb}
              onMouseOver={e => (e.currentTarget.src = hoverb)}
              onMouseOut={e => (e.currentTarget.src = censoredb)}
              alt="Illustration 2"
              className="w-full object-cover aspect-[2]"
            />
          </div>
          <div className="w-full overflow-hidden">
            <img
              src={censoredc}
              onMouseOver={e => (e.currentTarget.src = hoverc)}
              onMouseOut={e => (e.currentTarget.src = censoredc)}
              alt="Illustration 3"
              className="w-full object-cover aspect-[2]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
