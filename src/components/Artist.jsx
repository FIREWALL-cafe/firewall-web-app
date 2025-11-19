import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAboutPageStrings, getSiteAssets, urlFor } from '../lib/sanity';

// Static import as fallback
import ArtistHeadshotFallback from '../assets/images/joyce-BW-450x450.jpg';

function Artist() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [artistHeadshot, setArtistHeadshot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch site assets from Sanity
  useEffect(() => {
    async function loadSiteAssets() {
      try {
        const assets = await getSiteAssets();
        if (assets && assets.artistHeadshot) {
          const headshotUrl = urlFor(assets.artistHeadshot).width(450).url();
          setArtistHeadshot(headshotUrl);
        }
      } catch (error) {
        console.error('Failed to load artist headshot from Sanity:', error);
      }
    }

    loadSiteAssets();
  }, []);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getAboutPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load about page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          aboutArtistSectionHeading: 'About Joyce',
          aboutArtistSectionHeadingZh: '关于乔伊斯',
          aboutArtistBioParagraph1: 'Motivated by a desire to challenge both state and corporate censorship, NYC-based artist Joyce Yu-Jean Lee founded the FIREWALL Cafe in 2013. This digital art project uses a participatory approach to examine internet visual culture, encouraging users to actively engage and see for themselves how censorship shapes their understanding of the world.',
          aboutArtistBioParagraph2: 'Lee\'s journey into this project was catalyzed by her experience abroad in 2011, when she coordinated an artist residency program in CaoChangDi, Beijing, China. There, she helped a dozen North American artists navigate the complexities of Chinese internet access, providing VPN software and advice on circumventing the "Great Firewall." This experience inspired her to creatively show online audiences how the internet manifests differently across various parts of the world demonstrate to netizens the varied appearances of the internet across different global regions. Through FIREWALL Internet Cafe, Lee aims to make these disparities visible and provoke thoughtful discussion on Internet freedom and censorship.',
          aboutArtistBioParagraph3: 'Lee\'s art practice spans video, glass, installation, and performance. She creates tech-based artwork that scrutinizes how visual culture and mass media influence our understanding of truth and shape perceptions of the "other." Her work has been showcased in the United States and internationally, and has attracted attention from major media outlets, including The New York Times, The Washington Post, Huffington Post, NPR, Hyperallergic, and ArtCritical.',
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
      <section className="flex overflow-hidden flex-col w-full bg-white py-16">
        <div className="container mx-auto px-2 md:px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex overflow-hidden flex-col w-full bg-white py-16">
      <div className="container mx-auto px-2 md:px-4">
        <div className="font-display-01 font-bitmap-song ipad-portrait:font-display-03 flex flex-col">
          <h2 className="leading-tight">
            {uiStrings.aboutArtistSectionHeading || 'About Joyce'}
          </h2>
          <div className="mt-2 leading-tight text-red-600 tracking-[2.16px]">
            {uiStrings.aboutArtistSectionHeadingZh || '关于乔伊斯'}
          </div>
          <p className="mt-2 text-xl sm:text-2xl text-zinc-400">Artist</p>
        </div>
        <div className="flex flex-col gap-10 mt-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full max-w-sm md:order-2 order-1">
              <Link to="http://www.joyceyujeanlee.com/">
                <img
                  src={artistHeadshot || ArtistHeadshotFallback}
                  alt="Joyce Yu-Jean Lee"
                  className="w-full h-auto object-cover"
                />
              </Link>
            </div>
            <div className="flex-1 mb-4 font-body-01 md:order-1 order-2">
              {uiStrings.aboutArtistBioParagraph1 || 'Motivated by a desire to challenge both state and corporate censorship, NYC-based artist Joyce Yu-Jean Lee founded the FIREWALL Cafe in 2013. This digital art project uses a participatory approach to examine internet visual culture, encouraging users to actively engage and see for themselves how censorship shapes their understanding of the world.'}
            </div>
          </div>
          <div className="w-full">
            <p className="mb-4 font-body-02">
              {uiStrings.aboutArtistBioParagraph2 || 'Lee\'s journey into this project was catalyzed by her experience abroad in 2011, when she coordinated an artist residency program in CaoChangDi, Beijing, China. There, she helped a dozen North American artists navigate the complexities of Chinese internet access, providing VPN software and advice on circumventing the "Great Firewall." This experience inspired her to creatively show online audiences how the internet manifests differently across various parts of the world demonstrate to netizens the varied appearances of the internet across different global regions. Through FIREWALL Internet Cafe, Lee aims to make these disparities visible and provoke thoughtful discussion on Internet freedom and censorship.'}
            </p>
            <p className="mb-4 font-body-02">
              {uiStrings.aboutArtistBioParagraph3 || 'Lee\'s art practice spans video, glass, installation, and performance. She creates tech-based artwork that scrutinizes how visual culture and mass media influence our understanding of truth and shape perceptions of the "other." Her work has been showcased in the United States and internationally, and has attracted attention from major media outlets, including The New York Times, The Washington Post, Huffington Post, NPR, Hyperallergic, and ArtCritical.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Artist;
