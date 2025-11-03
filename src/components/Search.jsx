import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import FeatureCards from './FeatureCards';
import { useLanguage } from '../context/LanguageContext';
import { getFeatureCards } from '../lib/sanity';

// Import all possible icons
import Archive from '../assets/icons/Archive_grayscale.png';
import ArchiveHover from '../assets/icons/Archive.png';
import SearchIcon from '../assets/icons/search-color.png';
import Commentary from '../assets/icons/expert-commentary_grayscale.png';
import CommentaryHover from '../assets/icons/expert-commentary.png';

// Map icon paths from Sanity to actual imports
const iconMap = {
  Archive: Archive,
  Archive_grayscale: Archive,
  ArchiveHover: ArchiveHover,
  'expert-commentary_grayscale': Commentary,
  'expert-commentary': CommentaryHover,
  'search-color': SearchIcon,
};

function Search() {
  const { language } = useLanguage();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatureCards() {
      try {
        setLoading(true);
        const cards = await getFeatureCards(language, 'search');

        // Map Sanity data to component format
        const mappedCards = cards.map(card => ({
          title: card.title,
          url: card.url,
          chineseTitle: {
            text: card.title, // Use same localized title
            color: card.textColor || 'text-black',
          },
          description: card.description,
          iconSrc: iconMap[card.iconSrc] || Archive,
          iconSrcHover: iconMap[card.iconSrcHover] || ArchiveHover,
          bgColor: card.bgColor,
          textColor: card.textColor,
          borderColor: card.borderColor,
        }));

        setFeatures(mappedCards);
      } catch (error) {
        console.error('Failed to load feature cards:', error);
        // Fallback to hardcoded cards
        setFeatures([
          {
            title: 'Archive',
            url: '/archive',
            chineseTitle: { text: '档案', color: 'text-black border-black' },
            description: 'Explore what other users have searched and vote on results.',
            iconSrc: Archive,
            iconSrcHover: ArchiveHover,
            bgColor: 'bg-red-600',
            textColor: 'text-white',
            borderColor: 'border-red-600',
          },
          {
            title: 'Expert commentary',
            url: '/editorial',
            chineseTitle: { text: '专家点评', color: 'text-red-600 border-red-600' },
            description: 'Read and listen to in-depth commentary from experts.',
            iconSrc: Commentary,
            iconSrcHover: CommentaryHover,
            bgColor: 'bg-white',
            textColor: 'text-black',
            borderColor: 'border-red-600',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadFeatureCards();
  }, [language]);

  if (loading) {
    return null; // Or a loading skeleton
  }
  return (
    <main className="min-h-screen">
      <section className="flex flex-col justify-center w-full py-8 md:py-16 bg-white">
        <div className="flex flex-col justify-center w-full max-w-screen-xl mx-auto text-center">
          <div className="chinese flex flex-col gap-2 items-center text-4xl md:text-7xl font-medium leading-tight tracking-[2.16px]">
            <div className="flex items-center gap-4">
              <img
                src={SearchIcon}
                alt=""
                className="w-8 h-8 md:w-[52px] md:h-[52px] object-contain"
              />
              <div className="text-black">Search Session</div>
            </div>
            <div className="text-red-600 border-red-600">搜索结果</div>
          </div>
        </div>
        <SearchInput searchMode="compare" />
        <FeatureCards features={features} />
      </section>
    </main>
  );
}

export default Search;
