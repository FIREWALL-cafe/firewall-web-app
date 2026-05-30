import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import FeatureCards from './FeatureCards';
import { useLanguage } from '../context/LanguageContext';
import { getFeatureCards, getSearchPageStrings } from '../lib/sanity';

import Archive from '../assets/icons/Archive_grayscale.png';
import ArchiveHover from '../assets/icons/Archive.png';
import SearchIcon from '../assets/icons/search-color.png';
import Commentary from '../assets/icons/expert-commentary_grayscale.png';
import CommentaryHover from '../assets/icons/expert-commentary.png';
import Timeline from '../assets/icons/Timeline_grayscale.png';
import TimelineHover from '../assets/icons/Timeline.png';

const iconMap = {
  Archive: Archive,
  Archive_grayscale: Archive,
  ArchiveHover: ArchiveHover,
  'expert-commentary_grayscale': Commentary,
  'expert-commentary': CommentaryHover,
  'search-color': SearchIcon,
  Timeline_grayscale: Timeline,
  Timeline: TimelineHover,
};

function Search() {
  const { language } = useLanguage();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  // Headings use bilingual pattern: always show EN + ZH regardless of language toggle
  const [uiStrings, setUiStrings] = useState({
    searchSessionHeading: 'Search Session',
    searchHeadingZh: '搜索结果',
  });

  useEffect(() => {
    async function loadStrings() {
      try {
        const strings = await getSearchPageStrings(language);
        setUiStrings(prev => ({ ...prev, ...strings }));
      } catch (error) {
        console.error('Failed to load search page strings:', error);
      }
    }
    loadStrings();
  }, [language]);

  useEffect(() => {
    async function loadFeatureCards() {
      try {
        setLoading(true);
        const cards = await getFeatureCards(language, 'search');

        const mappedCards = cards.map(card => ({
          title: card.titleEn || card.title,
          url: card.url,
          chineseTitle: {
            text: card.titleZh || card.title,
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
      } finally {
        setLoading(false);
      }
    }
    loadFeatureCards();
  }, [language]);

  return (
    <main className="min-h-screen is-large-width-content">
      <section className="flex flex-col justify-center w-full py-8 md:py-16 bg-white">
        <div className="flex flex-col justify-center w-full max-w-screen-xl mx-auto text-center">
          <div className="chinese flex flex-col gap-2 items-center text-4xl md:text-7xl font-medium leading-tight tracking-[2.16px]">
            <div className="flex items-center gap-4">
              <img
                src={SearchIcon}
                alt=""
                className="w-8 h-8 md:w-[52px] md:h-[52px] object-contain"
              />
              <div className="text-black">{uiStrings.searchSessionHeading || 'Search Session'}</div>
            </div>
            <div className="text-red-600 border-red-600">{uiStrings.searchHeadingZh || '搜索结果'}</div>
          </div>
        </div>
        <SearchInput searchMode="compare" />
        {!loading && <FeatureCards features={features} />}
      </section>
    </main>
  );
}

export default Search;
