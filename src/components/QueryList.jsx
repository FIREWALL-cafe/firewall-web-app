import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getArchivePageStrings, getGlobalStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import QueryItem from './QueryItem';

const QueryListHeader = ({ strings }) => {
  const [screenSize, setScreenSize] = useState(() => {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (screenSize === 'mobile') return null;

  if (screenSize === 'tablet') {
    return (
      <div className="grid grid-cols-[60px_1fr_1fr_120px_40px] gap-2 py-2 px-4 w-full text-base font-medium border-b border-solid border-b-neutral-300 min-h-[32px]">
        <div className="whitespace-nowrap">{strings.queryListHeaderVotes || 'Votes'}</div>
        <div className="truncate whitespace-nowrap">{strings.queryListHeaderQueryEn || 'Query EN'}</div>
        <div className="font-sc-sans truncate whitespace-nowrap">{strings.queryListHeaderQueryZh || '搜索结果 中文'}</div>
        <div className="text-right whitespace-nowrap">{strings.queryListHeaderDate || 'Date'}</div>
        <div />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="grid grid-cols-[80px_1fr_1fr_1fr_160px_40px] gap-1 py-1 px-4 w-full text-[20px] border-b border-solid border-b-neutral-300 min-h-[32px]">
      <div className="whitespace-nowrap">{strings.queryListHeaderVotes || 'Votes'}</div>
      <div className="truncate whitespace-nowrap">{strings.queryListHeaderQueryEn || 'Query EN'}</div>
      <div className="font-sc-sans truncate whitespace-nowrap">{strings.queryListHeaderQueryZh || '搜索结果 中文'}</div>
      <div className="truncate whitespace-nowrap">{strings.queryListHeaderLocation || 'Search Location'}</div>
      <div className="text-right whitespace-nowrap">{strings.queryListHeaderDate || 'Date'}</div>
      <div />
    </div>
  );
};

const LoadMore = ({ page, totalPages, onLoadMore, isLoading, strings }) => {
  if (totalPages <= 1 || page >= totalPages) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="flex flex-col items-center gap-3 text-black hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-2xl font-normal">{strings.queryListLoadMoreButton || 'load more'}</span>
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

const EmptyState = ({ strings }) => (
  <section className="flex overflow-hidden flex-col pb-8 w-full bg-white max-md:pb-12">
    <div className="flex flex-col items-center px-2 md:px-4 w-full">
      <div className="flex flex-col w-full max-w-[1280px]">
        <QueryListHeader strings={strings} />
        <div className="flex justify-center items-center py-8 text-gray-500">
          {strings.queryListNoResults || 'No results found with the current filters'}
        </div>
      </div>
    </div>
  </section>
);

const QueryList = ({ results, onLoadMore, isLoading, filterOptions }) => {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);
  const { total, page, page_size, data } = results;
  const totalPages = Math.ceil(total / page_size);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const [archiveStrings, globalStrings] = await Promise.all([
          getArchivePageStrings(language),
          getGlobalStrings(language),
        ]);
        setUiStrings({ ...archiveStrings, ...globalStrings });
      } catch (error) {
        console.error('Failed to load archive page strings:', error);
        // Language-aware fallback
        setUiStrings({
          queryListHeaderVotes: getDefault('archive', 'queryListHeaderVotes', language),
          queryListHeaderQueryEn: getDefault('archive', 'queryListHeaderQueryEn', language),
          queryListHeaderQueryZh: getDefault('archive', 'queryListHeaderQueryZh', language),
          queryListHeaderLocation: getDefault('archive', 'queryListHeaderLocation', language),
          queryListHeaderDate: getDefault('archive', 'queryListHeaderDate', language),
          queryListTotalResults: getDefault('archive', 'queryListTotalResults', language),
          queryListNoResults: getDefault('archive', 'queryListNoResults', language),
          queryListLoadingText: getDefault('archive', 'queryListLoadingText', language),
          queryListLoadMoreButton: getDefault('archive', 'queryListLoadMoreButton', language),
          commonLoadingText: getDefault('global', 'commonLoadingText', language),
        });
      } finally {
        setLoading(false);
      }
    }

    loadStrings();
  }, [language]);

  // Auto-open first row when initial results load
  useEffect(() => {
    if (data && data.length > 0 && !hasAutoExpanded) {
      setExpandedItems(new Set([data[0].search_id]));
      setHasAutoExpanded(true);
    }
  }, [data, hasAutoExpanded]);

  if (loading) {
    return (
      <section className="mt-[120px] min-h-[70px] flex overflow-hidden flex-col pb-8 w-full bg-white max-md:pb-12">
        <div className="flex flex-col items-center px-2 md:px-4 w-full">
          <div className="flex flex-col w-full max-w-[1280px]">
            <div className="flex justify-center items-center py-8 text-gray-600">
              Loading...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && (!data || data.length === 0)) {
    return <EmptyState strings={uiStrings} />;
  }

  const currentResultCount = data ? data.length : 0;

  const handleToggle = searchId => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(searchId)) {
        newSet.delete(searchId);
      } else {
        newSet.add(searchId);
      }
      return newSet;
    });
  };

  // Format total results text
  const totalResultsText = (uiStrings.queryListTotalResults || '{count} related queries').replace(
    '{count}',
    currentResultCount
  );

  return (
    <section
      id="query-list"
      className="mt-[120px] min-h-[70px] flex overflow-hidden flex-col pb-8 w-full bg-white max-md:pb-12"
    >
      <div className="flex flex-col items-center px-2 md:px-4 w-full">
        <div className="flex flex-col w-full max-w-[1280px]">
          {currentResultCount > 0 && (
            <div className="text-lg mb-4">{totalResultsText}</div>
          )}
          <QueryListHeader strings={uiStrings} />

          <div className="flex flex-col w-full mt-6 md:mt-6">
            <div className="relative mb-6">
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                  <div className="text-gray-600">{uiStrings.commonLoadingText || 'Loading...'}</div>
                </div>
              )}
              {data?.map(item => (
                <QueryItem
                  key={item.search_id}
                  {...item}
                  filterOptions={filterOptions}
                  isExpanded={expandedItems.has(item.search_id)}
                  onToggle={() => handleToggle(item.search_id)}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col w-full min-h-[24px]">
            <div className="w-full border border-solid bg-zinc-400 border-zinc-400 min-h-[1px]" />
          </div>
        </div>

        <LoadMore
          page={page}
          totalPages={totalPages}
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          strings={uiStrings}
        />
      </div>
    </section>
  );
};

export default QueryList;
