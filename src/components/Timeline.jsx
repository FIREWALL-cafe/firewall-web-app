import React, { useState, useEffect } from 'react';
import { getTimelineEvents, urlFor } from '../lib/sanity';
import { useLanguage } from '../context/LanguageContext';

function Timeline() {
  const { language } = useLanguage();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const events = await getTimelineEvents(language);
        setTimelineEvents(events);
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [language]);

  if (loading) {
    return (
      <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
        <p className="text-gray-500">No timeline events found.</p>
      </div>
    );
  }

  const years = timelineEvents.map(event => event.year);

  // Unified navigation handler with animation delay
  const navigateToIndex = (newIndex) => {
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < years.length) {
      setCurrentIndex(newIndex);
      // Delay the visual selection change until animation completes
      setTimeout(() => {
        setDisplayIndex(newIndex);
      }, 300);
    }
  };

  const handleNext = () => navigateToIndex(currentIndex + 1);
  const handlePrevious = () => navigateToIndex(currentIndex - 1);
  const handleYearClick = (index) => navigateToIndex(index);

  // Calculate transform offset: each year + gap = 54px (36px height + 18px gap)
  const transformOffset = -(currentIndex * 54);

  return (
    <div className="relative w-full h-[600px] bg-white pt-[40px]">
      {/* Timeline container - vertically centered */}
      <div className="relative w-full h-[520px]">
        {/* Vertical timeline line */}
        <div
          className="absolute left-[84px] w-px bg-neutral-400"
          style={{
            top: '50px',
            height: '420px'
          }}
        />

        {/* Red dot at halfway point */}
        <div
          className="absolute left-[76px] w-4 h-4 z-10"
          style={{
            top: '252px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" fill="#E81717"/>
          </svg>
        </div>

        {/* Clipping container - hides years outside arrow boundaries */}
        <div
          className="absolute left-0 w-[105px] overflow-hidden"
          style={{
            top: '76px',
            bottom: '76px'
          }}
        >
          {/* Years column */}
          <div
            className="absolute left-0 w-[105px]"
            style={{
              top: '166px',
              transform: `translateY(${transformOffset}px)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
        <div className="flex flex-col gap-[18px]">
          {years.map((year, index) => {
            const isSelected = index === displayIndex;
            return (
              <div
                key={year}
                className={`relative flex items-center h-[36px] year-item ${isSelected ? 'active' : 'inactive'}`}
              >
                <span
                  onClick={() => handleYearClick(index)}
                  className={`font-bitmap-song leading-[1.5] absolute right-[45px] cursor-pointer transition-colors ${
                    isSelected
                      ? 'text-[32px] font-bold text-neutral-900'
                      : 'text-[24px] text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {year}
                </span>
              </div>
            );
          })}
        </div>
        </div>
      </div>

        {/* Top navigation arrow */}
        <button
          className="absolute left-[72px] top-[50px] w-6 h-6 rounded-full bg-white border border-neutral-400 hover:border-red-600 flex items-center justify-center z-30 transition-colors group"
          style={{ transform: 'rotate(180deg)' }}
          aria-label="Previous event"
          onClick={handlePrevious}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-neutral-600 group-hover:stroke-red-600"
            />
          </svg>
        </button>

        {/* Bottom navigation arrow */}
        <button
          className="absolute left-[72px] top-[470px] w-6 h-6 rounded-full bg-white border border-neutral-400 hover:border-red-600 flex items-center justify-center z-30 transition-colors group"
          aria-label="Next event"
          onClick={handleNext}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-neutral-600 group-hover:stroke-red-600"
            />
          </svg>
        </button>

        {/* Content card */}
        <div className="absolute left-[145px] top-[50px] w-[480px]">
        <div className="border-2 border-red-600 rounded-lg p-6 bg-neutral-50">
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            {timelineEvents[displayIndex].title}
          </h3>
          <p className="text-base leading-relaxed text-neutral-700">
            {timelineEvents[displayIndex].description}
          </p>
        </div>

        {/* Image cards */}
        <div className="flex gap-4 mt-6">
          {/* Google image card */}
          <div className="flex-1 border-2 border-blue-500 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-center overflow-hidden aspect-[4/3]">
              {timelineEvents[displayIndex].googleImage?.image ? (
                <img
                  src={urlFor(timelineEvents[displayIndex].googleImage.image).width(400).url()}
                  alt={timelineEvents[displayIndex].googleImage.alt || 'Google search result'}
                  className="w-full h-full object-cover"
                />
              ) : timelineEvents[displayIndex].googleImage?.externalUrl ? (
                <img
                  src={timelineEvents[displayIndex].googleImage.externalUrl}
                  alt={timelineEvents[displayIndex].googleImage.alt || 'Google search result'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">
                  {timelineEvents[displayIndex].googleImage?.placeholder || 'No image'}
                </span>
              )}
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="text-blue-500 font-bold text-sm">G</div>
              <div className="text-xs text-gray-500">
                {timelineEvents[displayIndex].googleImage?.date || ''}
              </div>
            </div>
          </div>

          {/* Baidu image card */}
          <div className="flex-1 border-2 border-pink-400 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-center overflow-hidden aspect-[4/3]">
              {timelineEvents[displayIndex].baiduImage?.image ? (
                <img
                  src={urlFor(timelineEvents[displayIndex].baiduImage.image).width(400).url()}
                  alt={timelineEvents[displayIndex].baiduImage.alt || 'Baidu search result'}
                  className="w-full h-full object-cover"
                />
              ) : timelineEvents[displayIndex].baiduImage?.externalUrl ? (
                <img
                  src={timelineEvents[displayIndex].baiduImage.externalUrl}
                  alt={timelineEvents[displayIndex].baiduImage.alt || 'Baidu search result'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">
                  {timelineEvents[displayIndex].baiduImage?.placeholder || 'No image'}
                </span>
              )}
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="text-red-600 font-bold text-sm">百</div>
              <div className="text-xs text-gray-500">
                {timelineEvents[displayIndex].baiduImage?.date || ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Timeline;
