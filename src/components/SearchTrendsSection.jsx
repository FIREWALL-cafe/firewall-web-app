import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings, getHomepageImages } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import SanityImage from './common/SanityImage';
// Fallback image
import imageCollage from '../assets/images/homepage-section_2-image_collage.png';

function SearchTrendsSection() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch UI strings and images from Sanity on mount and language change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load strings and images in parallel
        const [strings, homepageImages] = await Promise.all([
          getHomepageStrings(language),
          getHomepageImages()
        ]);

        setUiStrings(strings);
        setImages(homepageImages);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
        // Language-aware fallback
        setUiStrings({
          searchTrendsSectionHeading: getDefault('homepage', 'searchTrendsSectionHeading', language),
          searchTrendsSectionHeadingZh: getDefault('homepage', 'searchTrendsSectionHeadingZh', language),
        });
        setImages(null); // Will fallback to static image
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language]);

  const trendingSearches = [
    { id: 1, text: 'tank man', isEnglish: true },
    { id: 2, text: 'june 4', isEnglish: true },
    { id: 3, text: '天安门广场', isEnglish: false },
    { id: 4, text: '小熊维尼 xi', isEnglish: false },
    { id: 5, text: 'uyghur', isEnglish: true },
  ];

  if (loading) {
    // Loading skeleton
    return (
      <section className="w-full flex flex-col py-16">
        <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="flex flex-wrap gap-4 mt-8">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col py-16">
      <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <div className="font-bitmap-song">
            <h2 className="font-display-04 mb-2">
              {uiStrings.searchTrendsSectionHeading || getDefault('homepage', 'searchTrendsSectionHeading', language)}
            </h2>
            <div className="font-display-04 text-red-600">
              {uiStrings.searchTrendsSectionHeadingZh || getDefault('homepage', 'searchTrendsSectionHeadingZh', language)}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            {trendingSearches.map(search => (
              <Link
                key={search.id}
                to={`/archive?q=${encodeURIComponent(search.text)}`}
                className={`px-4 py-2.5 rounded-full border font-body-03 ${
                  search.isEnglish
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-red-600 text-red-600'
                } hover:bg-neutral-50 transition-colors`}
              >
                {search.text}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          {images?.searchTrendsCollage ? (
            <SanityImage
              image={images.searchTrendsCollage}
              alt={images.searchTrendsCollage.alt || 'Search trends visualization'}
              width={800}
              height={696}
              quality={90}
              className="w-full object-contain aspect-[1.15]"
            />
          ) : (
            <img
              src={imageCollage}
              alt="Search trends visualization"
              className="w-full object-contain aspect-[1.15]"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchTrendsSection;
