import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getContactPageStrings } from '../lib/sanity';
import Facebook from '../assets/icons/Facebook_Logo.png';
import Youtube from '../assets/icons/youtube_social_circle_red.png';
import Instagram from '../assets/icons/Instagram_Logo.png';

const SocialFollow = () => {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getContactPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load contact page strings:', error);
        // Fallback to hardcoded strings
        setUiStrings({
          contactFollowHeading: 'Follow',
          contactFollowHeadingZh: '跟踪',
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
      <section className="flex flex-col w-full md:w-1/2 p-8 md:p-20 bg-rose-100 justify-between border-l border-red-600 border-t md:border-t-0">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full md:w-1/2 p-8 md:p-20 bg-rose-100 justify-between border-l border-red-600 border-t md:border-t-0">
      <div className="flex flex-col">
        <h2 className="flex flex-col font-medium leading-tight whitespace-nowrap max-md:font-display-02 font-display-04 font-bitmap-song">
          <span className="text-black max-md:text-4xl">
            {uiStrings.contactFollowHeading || 'Follow'}
          </span>
          <span className="text-red-500 max-md:text-4xl">
            {uiStrings.contactFollowHeadingZh || '跟踪'}
          </span>
        </h2>
      </div>
      <div className="flex justify-center md:justify-end mt-8 md:mt-4">
        <div className="flex flex-row md:flex-col gap-4 md:gap-6 items-center md:items-end">
          <a href="http://instagram.com/firewallcafe" aria-label="Follow us on Instagram">
            <img
              src={Instagram}
              className="object-contain aspect-square w-[48px] hover:opacity-80 transition-opacity"
              alt=""
            />
          </a>
          <a href="https://www.facebook.com/firewallcafe" aria-label="Follow us on Facebook">
            <img
              src={Facebook}
              className="object-contain aspect-square w-[48px] hover:opacity-80 transition-opacity"
              alt=""
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCMTAKSSmI9iKD7a3GB1JIrA"
            aria-label="Follow us on Youtube"
          >
            <img
              src={Youtube}
              className="object-contain aspect-square w-[48px] hover:opacity-80 transition-opacity"
              alt=""
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialFollow;
