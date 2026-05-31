import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getPressPageStrings, getSiteAssets, urlFor } from '../lib/sanity';

// Static import as fallback
import Press from '../assets/icons/press.png';

function HeroPress() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [siteAssets, setSiteAssets] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch site assets from Sanity
  useEffect(() => {
    async function loadSiteAssets() {
      try {
        const assets = await getSiteAssets();
        if (assets) {
          setSiteAssets(assets);
        }
      } catch (error) {
        console.error('Failed to load site assets:', error);
      }
    }

    loadSiteAssets();
  }, []);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getPressPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load press page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          pressPageHeading: 'In the press',
          pressPageHeadingZh: '在新闻界',
          pressIntroText: 'Since its inception, FIREWALL Cafe has garnered media attention, including coverage by major outlets like the BBC and The Washington Post.',
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
      <section className="flex flex-col justify-center items-center pb-16 py-32 w-full is-medium-width-content">
        <div className="flex flex-col items-center w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center pb-16 py-32 w-full is-medium-width-content">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-full font-display-04 md:font-display-05 font-bitmap-song leading-tight tracking-[2.16px]">
          <h2 className="flex flex-wrap gap-5 items-center text-black">
            <img
              src={siteAssets?.pressIcon ? urlFor(siteAssets.pressIcon).width(52).url() : Press}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[52px]"
            />
            <div className="self-stretch my-auto">
              {uiStrings.pressPageHeading || 'In the press'}
            </div>
          </h2>
          <div className="mt-2 text-red-600 ">
            {uiStrings.pressPageHeadingZh || '在新闻界'}
          </div>
        </div>
        <div className="mt-5 font-body-01 leading-8 text-black">
          {uiStrings.pressIntroText || 'Since its inception, FIREWALL Cafe has garnered media attention, including coverage by major outlets like the BBC and The Washington Post.'}
        </div>
      </div>
    </section>
  );
}

export default HeroPress;
