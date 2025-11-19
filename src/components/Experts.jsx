import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getEditorialPageStrings, getSiteAssets, urlFor } from '../lib/sanity';
import FeaturedEditorial from './FeaturedEditorial';
import ExpertArticles from './ExpertArticles';
import NewsletterSection from './NewsletterSection';

// Static import as fallback
import Commentary from '../assets/icons/expert-commentary.png';

function Experts() {
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
        const strings = await getEditorialPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load editorial page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          editorialPageHeading: 'Expert commentary',
          editorialPageHeadingZh: '专家点评',
          editorialIntroText: 'We\'ve invited journalists, scholars, and social activists from around the world to provide insights on local news censorship, internet censorship practices, and related legislation, exploring how these issues shape cultural phenomena worldwide.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadStrings();
  }, [language]);

  const image = 'subscribeC';
  const newsletterTitle = 'Want to be notified when we release new articles?';

  if (loading) {
    // Loading skeleton
    return (
      <main className="flex overflow-hidden flex-col bg-white min-h-[200px]">
        <div className="container mx-auto px-2 md:px-4 py-32">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex overflow-hidden flex-col bg-white min-h-[200px]">
        <section className="flex flex-col justify-center items-center py-32 w-full max-md:py-24 is-medium-width-content">
          <div className="flex flex-col items-center w-full max-w-[1080px]">
            <div className="font-bitmap-song items-center gap-2">
              <h1 className="flex flex-row items-center gap-5 my-auto font-display-04 md:font-display-05">
                <img
                  src={siteAssets?.expertCommentaryIcon ? urlFor(siteAssets.expertCommentaryIcon).width(52).url() : Commentary}
                  alt=""
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[52px]"
                />
                {uiStrings.editorialPageHeading || 'Expert commentary'}
              </h1>
              <div className="text-red-600 font-display-04 md:font-display-05 text-center mt-2">
                {uiStrings.editorialPageHeadingZh || '专家点评'}
              </div>
            </div>
            <p className="mt-5 text-xl leading-9 text-center max-md:max-w-full">
              {uiStrings.editorialIntroText || 'We\'ve invited journalists, scholars, and social activists from around the world to provide insights on local news censorship, internet censorship practices, and related legislation, exploring how these issues shape cultural phenomena worldwide.'}
            </p>
          </div>
        </section>
        <FeaturedEditorial />
        <ExpertArticles />
      </main>
      <NewsletterSection image={image} title={newsletterTitle} />
    </>
  );
}

export default Experts;
