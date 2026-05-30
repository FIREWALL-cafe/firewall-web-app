import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getSupportPageStrings, getSiteAssets, urlFor } from '../lib/sanity';

// Static import as fallback
import SupportHero from '../assets/images/support-hero.png';

function HeroSupport() {
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
        const strings = await getSupportPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load support page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          supportPageHeading: 'Support the frontline of internet freedom advocates',
          supportPageHeadingZh: '支持互联网自由战士的前线。',
          supportIntroText: 'FIREWALL Cafe is sustained through individual donations, corporate sponsorships, and foundation grants. Your contributions help maintain our dual-image browser and enable us to continue our growth internationally.',
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
      <section className="flex flex-col items-center w-full py-8 md:py-16">
        <div className="animate-pulse space-y-6 max-w-[720px] w-full">
          <div className="h-16 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center w-full py-8 md:py-16">
      <div className="ipad-landscape:font-display-02 font-bitmap-song font-display-03 flex flex-col items-center text-center max-w-[720px]">
        <h1 className="leading-tight text-center">
          {uiStrings.supportPageHeading?.split('internet')[0] || 'Support the frontline of'}
          <br className="hidden md:block" />
          {uiStrings.supportPageHeading?.includes('internet') ?
            `internet${uiStrings.supportPageHeading.split('internet')[1]}` :
            'internet freedom advocates'}
        </h1>
        <div className="mt-2 leading-tight text-red-600 tracking-[2.16px] text-center">
          {uiStrings.supportPageHeadingZh || '支持互联网自由战士的前线。'}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-12 md:mt-24 w-full font-body-01">
        <div className="flex flex-col leading-relaxed md:leading-9 w-1/2">
          <p className="w-full">
            {uiStrings.supportIntroText || 'FIREWALL Cafe is sustained through individual donations, corporate sponsorships, and foundation grants. Your contributions help maintain our dual-image browser and enable us to continue our growth internationally.'}
          </p>
          {uiStrings.supportDonateText && (
            <p className="mt-5">{uiStrings.supportDonateText}</p>
          )}
          {!uiStrings.supportDonateText && (
            <p className="mt-5">
              Donate to our cause through{' '}
              <a
                href="https://www.nyfa.org/#button=45138"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                NYFA
              </a>
              , a 501(c)3 supporting the arts in NY.
            </p>
          )}
        </div>
        <div className="flex justify-center items-center w-1/2">
          <img
            src={siteAssets?.supportHero ? urlFor(siteAssets.supportHero).width(500).quality(90).url() : SupportHero}
            className="object-contain w-full max-w-[500px]"
            alt="Donation illustration"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSupport;
