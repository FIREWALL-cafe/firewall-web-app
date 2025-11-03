import React, { useState, useEffect } from 'react';
import HeroArchive from './HeroArchive';
import FeatureCards from './FeatureCards';
import { useLanguage } from '../context/LanguageContext';
import { getFeatureCards } from '../lib/sanity';

import Commentary from '../assets/icons/expert-commentary_grayscale.png';
import CommentaryHover from '../assets/icons/expert-commentary.png';
import Search from '../assets/icons/search-grayscale.png';
import SearchHover from '../assets/icons/search-color.png';

// Map icon paths from Sanity to actual imports
const iconMap = {
  'search-grayscale': Search,
  'search-color': SearchHover,
  'expert-commentary_grayscale': Commentary,
  'expert-commentary': CommentaryHover,
};

const SearchArchive = () => {
  const { language } = useLanguage();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatureCards() {
      try {
        setLoading(true);
        const cards = await getFeatureCards(language, 'archive');

        // Map Sanity data to component format
        const mappedCards = cards.map(card => ({
          title: card.title,
          url: card.url,
          chineseTitle: {
            text: card.title, // Use same localized title
            color: card.textColor || 'text-black',
          },
          description: card.description,
          iconSrc: iconMap[card.iconSrc] || Search,
          iconSrcHover: iconMap[card.iconSrcHover] || SearchHover,
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
            title: 'Search',
            url: '/search',
            chineseTitle: { text: '专家点评', color: 'border-red-600' },
            description: 'Search Google and Baidu and compare the results.',
            iconSrc: Search,
            iconSrcHover: SearchHover,
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
    <main id="search-archive" className="is-large-width-content max-w-[1280px]">
      <section className="flex overflow-hidden flex-col justify-center w-full bg-white max-md:max-w-full">
        <HeroArchive />
        <FeatureCards features={features} />
      </section>
    </main>
  );
};

export default SearchArchive;
