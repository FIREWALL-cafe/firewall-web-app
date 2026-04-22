import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Combobox } from '@headlessui/react';
import QueryList from './QueryList';
import useCookie from '../useCookie';
import FilterControls from './FilterControls';
import ApiContext from '../context/ApiContext';
import QuestionIcon from './icons/QuestionIcon';
import { useLanguage } from '../context/LanguageContext';
import { getSearchPageStrings, getArchivePageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import { useAutocomplete } from '../hooks/useAutocomplete';

import GoogleLogoBlue from '../assets/icons/google-logo_blue.svg';
import BaiduLogoRed from '../assets/icons/baidu_logo_red.svg';
import SearchIcon from '../assets/icons/image_search.svg';
import ArchiveIcon from '../assets/icons/folder_open_search.svg';
import ArchiveGrayscale from '../assets/icons/Archive_grayscale.png';
import Archive from '../assets/icons/Archive.png';
import FilterIcon from './FilterIcon';
import SearchCompare from './SearchCompare';
import Spinner from '../assets/spinner.svg';
import SearchProgressIndicator from './SearchProgressIndicator';

function SearchInput({ searchMode }) {
  const { language } = useLanguage();
  const { translateQuery, searchImages, searchArchive } = useContext(ApiContext);
  const [isArchive] = useState(searchMode === 'archive');
  
  // Initialize uiStrings with defaults immediately to prevent layout shift
  const [uiStrings, setUiStrings] = useState(() => {
    if (isArchive) {
      return {
        archiveInputPlaceholder: getDefault('archive', 'archiveInputPlaceholder', language),
        archiveButton: getDefault('archive', 'archiveButton', language),
        archiveModeTooltip: getDefault('archive', 'archiveModeTooltip', language),
        translatingText: getDefault('search', 'translatingText', language),
        translationLabel: getDefault('search', 'translationLabel', language),
        errorLabel: getDefault('search', 'errorLabel', language),
      };
    } else {
      return {
        searchInputPlaceholder: getDefault('search', 'searchInputPlaceholder', language),
        searchModeTooltip: getDefault('search', 'searchModeTooltip', language),
        translatingText: getDefault('search', 'translatingText', language),
        translationLabel: getDefault('search', 'translationLabel', language),
        errorLabel: getDefault('search', 'errorLabel', language),
      };
    }
  });
  
  const [isLoading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchStage, setSearchStage] = useState(null); // Track current search stage
  const [estimatedTime, setEstimatedTime] = useState(null); // Estimated time remaining
  const [imageResults, setImageResults] = useState({});
  const [archiveResults, setarchiveResults] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    data: [],
  });
  const [filteredResults, setFilteredResults] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    data: [],
  });
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [translation, setTranslation] = useState('');
  const [currentSearchId, setSearchId] = useState(null);

  // Autocomplete suggestions
  const { suggestions } = useAutocomplete(query, language);
  const setResults = useCallback(results => setImageResults(results), []);
  const [username] = useCookie('username');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    vote_ids: [],
    years: [],
    search_locations: [],
    us_states: [],
    countries: [],
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const ranonce = useRef(false);
  const searchInProgress = useRef(false);

  // Compute placeholder value with useMemo to ensure it always has correct value
  // This prevents the input from disappearing during language switch
  const inputPlaceholder = useMemo(() => {
    if (isArchive) {
      return uiStrings.archiveInputPlaceholder || getDefault('archive', 'archiveInputPlaceholder', language);
    } else {
      return uiStrings.searchInputPlaceholder || getDefault('search', 'searchInputPlaceholder', language);
    }
  }, [isArchive, uiStrings.archiveInputPlaceholder, uiStrings.searchInputPlaceholder, language]);

  // Load UI strings from Sanity based on search mode
  // Update defaults immediately when language/archive mode changes to prevent layout shift
  useEffect(() => {
    // Immediately update with defaults for current language to prevent layout shift
    const defaults = isArchive
        ? {
            archiveInputPlaceholder: getDefault('archive', 'archiveInputPlaceholder', language),
            archiveButton: getDefault('archive', 'archiveButton', language),
            archiveModeTooltip: getDefault('archive', 'archiveModeTooltip', language),
            archiveFiltersButton: getDefault('archive', 'archiveFiltersButton', language),
            translatingText: getDefault('search', 'translatingText', language),
            translationLabel: getDefault('search', 'translationLabel', language),
            errorLabel: getDefault('search', 'errorLabel', language),
          }
      : {
          searchInputPlaceholder: getDefault('search', 'searchInputPlaceholder', language),
          searchModeTooltip: getDefault('search', 'searchModeTooltip', language),
          translatingText: getDefault('search', 'translatingText', language),
          translationLabel: getDefault('search', 'translationLabel', language),
          errorLabel: getDefault('search', 'errorLabel', language),
        };
    
    // Set defaults immediately
    setUiStrings(defaults);

    // Then fetch from Sanity and merge
    async function loadStrings() {
      try {
        const strings = isArchive
          ? await getArchivePageStrings(language)
          : await getSearchPageStrings(language);
        // Merge Sanity strings with defaults (Sanity strings take precedence)
        setUiStrings(prev => ({ ...prev, ...strings }));
      } catch (error) {
        console.error('Failed to load UI strings:', error);
        // Already have defaults set above, so no need to set again
      }
    }
    loadStrings();
  }, [language, isArchive]);

  const loadDefaultResults = useCallback(async () => {
    const filterOptions = { page: 1, page_size: 10 };
    const results = await searchArchive({ ...filterOptions });
    setSearchId('archived searches');
    setarchiveResults(results);
    setFilteredResults(results);
  }, [searchArchive]);

  const handleSubmit = useCallback(() => {
    if (!query || query.trim() === '') {
      setTranslation('Please enter a search query');
      return;
    }
    setError('');

    // Always update the URL query parameter - this will trigger the useEffect to perform the search
    if (location.pathname === '/') {
      navigate('/search?q=' + encodeURIComponent(query.trim()));
    } else {
      // Update URL on current page (search or archive)
      navigate(`${location.pathname}?q=${encodeURIComponent(query.trim())}`, { replace: true });
    }
  }, [query, location.pathname, navigate]);

  useEffect(() => {
    // Update the input field when query params change and perform search
    const urlQuery = searchParams.get('q');
    const urlSearchLocations = searchParams.get('search_locations');
    const urlCountries = searchParams.get('countries');
    const urlUsStates = searchParams.get('us_states');
    const urlStartDate = searchParams.get('start_date');
    const urlEndDate = searchParams.get('end_date');

    // Check if any URL filters are present
    const hasUrlFilters =
      urlSearchLocations || urlCountries || urlUsStates || urlStartDate || urlEndDate;

    if (urlQuery || (isArchive && hasUrlFilters)) {
      if (urlQuery) {
        setQuery(urlQuery);
      }

      // Always perform search when URL query changes - inline to avoid dependency issues
      if (!searchInProgress.current) {
        searchInProgress.current = true;
        setLoading(true);

        const doSearch = async () => {
          try {
            if (isArchive) {
              setarchiveResults({ total: 0, page: 1, page_size: 10, data: [] });
              setFilteredResults({ total: 0, page: 1, page_size: 10, data: [] });

              // Build filter params from URL
              const filterParams = {
                ...(urlQuery ? { query: urlQuery.trim() } : {}),
                page: 1,
                page_size: 10,
              };

              // Add URL filters if present
              if (urlSearchLocations) {
                filterParams.search_locations = [urlSearchLocations];
                setCurrentFilters(prev => ({ ...prev, search_locations: [urlSearchLocations] }));
              }
              if (urlCountries) {
                filterParams.countries = [urlCountries];
                setCurrentFilters(prev => ({ ...prev, countries: [urlCountries] }));
              }
              if (urlUsStates) {
                filterParams.us_states = [urlUsStates];
                setCurrentFilters(prev => ({ ...prev, us_states: [urlUsStates] }));
              }
              if (urlStartDate) {
                filterParams.start_date = urlStartDate;
                setCurrentFilters(prev => ({ ...prev, start_date: urlStartDate }));
              }
              if (urlEndDate) {
                filterParams.end_date = urlEndDate;
                setCurrentFilters(prev => ({ ...prev, end_date: urlEndDate }));
              }

              const results = await searchArchive(filterParams);

              if (results.error) {
                throw new Error(results.error);
              }

              setSearchId('archived searches');
              setarchiveResults(results);
              setFilteredResults(results);
            } else {
              // Reset search ID so vote buttons don't carry stale state
              setSearchId(null);

              // Stage 1: Get translation
              setIsTranslating(true);
              setSearchStage('translating');
              setEstimatedTime(8);

              let translationResult;
              try {
                translationResult = await translateQuery(urlQuery.trim());
                setTranslation(translationResult.translation || '');

                // Small delay to ensure translation UI is visible before moving to loading state
                await new Promise(resolve => setTimeout(resolve, 300));
              } catch (translationError) {
                console.warn('Translation failed:', translationError);
                // Continue with search even if translation fails
                setTranslation('');
              }

              // Stage 2: Search for images (show skeletons during this phase)
              setIsTranslating(false);
              setSearchStage('searching-google');
              setEstimatedTime(6);
              setLoading(true);

              // Pass translation data to avoid duplicate translation
              const searchBody = {
                query: urlQuery.trim(),
                search_client_name: username,
              };

              // If we got translation, pass it along to skip re-translating
              if (translationResult) {
                searchBody.translation = translationResult.translation;
                searchBody.langFrom = translationResult.langFrom;
                searchBody.langTo = translationResult.langTo;
              }

              // Update stage to indicate both searches are happening
              setSearchStage('searching-baidu');
              setEstimatedTime(4);

              const response = await searchImages({
                body: JSON.stringify(searchBody),
              });

              // Stage 3: Processing results
              setSearchStage('saving');
              setEstimatedTime(1);

              if (response.error) {
                // Handle "No images found" error specially
                if (response.error === 'No images found') {
                  setResults({ googleResults: [], baiduResults: [] });
                  setError(response.message || `No images found for "${urlQuery}"`);
                  setTranslation(response.translation || translationResult?.translation || '');
                  setLoading(false);
                  setSearchStage('complete');
                  setEstimatedTime(null);
                  searchInProgress.current = false;
                  return;
                }
                throw new Error(response.error);
              }

              const { googleResults, baiduResults, translation, searchId } = response;
              setSearchId(searchId);
              setResults({
                googleResults: googleResults || [],
                baiduResults: baiduResults || [],
              });
              // Use translation from response if available, otherwise use the one we got earlier
              setTranslation(translation || translationResult?.translation || '');

              // Complete
              setSearchStage('complete');
              setEstimatedTime(null);
            }
          } catch (e) {
            console.error('Search error:', e);
            if (!isArchive) {
              setResults({ googleResults: [], baiduResults: [] });
              setError(e.message || String(e));
              setTranslation('');
            } else {
              setarchiveResults({ total: 0, page: 1, page_size: 10, data: [] });
              setFilteredResults({ total: 0, page: 1, page_size: 10, data: [] });
              setError(e.message || 'Failed to search archives');
              setTranslation('');
            }
          } finally {
            setLoading(false);
            setSearchStage(null);
            setEstimatedTime(null);
            searchInProgress.current = false;
          }
        };

        doSearch();
      }
    } else if (isArchive && location.pathname === '/archive' && !ranonce.current) {
      ranonce.current = true;
      loadDefaultResults();
    }
  }, [
    searchParams,
    isArchive,
    location.pathname,
    translateQuery,
    searchArchive,
    searchImages,
    username,
    setResults,
    loadDefaultResults,
  ]);

  const applyFilters = async (filterOptions, shouldClose = true, isReset = false) => {
    setLoading(true);
    setCurrentFilters(filterOptions);

    if (shouldClose) {
      setFilterOpen(false);
    }

    try {
      // If this is a reset operation, fetch fresh results
      if (isReset) {
        const results = await searchArchive({
          ...(query ? { query: query.trim() } : {}),
          page: 1,
          page_size: archiveResults.page_size,
        });
        setarchiveResults(results);
        setFilteredResults(results);
        return;
      }

      // Fetch new results with filters applied (always start from page 1 when filtering)
      const searchParams = {
        ...(query ? { query: query.trim() } : {}),
        page: 1,
        page_size: filterOptions.page_size || archiveResults.page_size,
        years: filterOptions.years,
        search_locations: filterOptions.search_locations,
        us_states: filterOptions.us_states,
        countries: filterOptions.countries,
        vote_ids: filterOptions.vote_ids,
        start_date: filterOptions.start_date,
        end_date: filterOptions.end_date,
      };

      const results = await searchArchive(searchParams);
      setarchiveResults(results);
      setFilteredResults(results);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const nextPage = archiveResults.page + 1;

      // Fetch next page data with all current filters
      const searchParams = {
        ...(query ? { query: query.trim() } : {}),
        page: nextPage,
        page_size: archiveResults.page_size,
        years: currentFilters.years,
        search_locations: currentFilters.search_locations,
        us_states: currentFilters.us_states,
        countries: currentFilters.countries,
        vote_ids: currentFilters.vote_ids,
        start_date: currentFilters.start_date,
        end_date: currentFilters.end_date,
      };

      const results = await searchArchive(searchParams);

      // Append new data to existing results
      const updatedResults = {
        ...results,
        page: nextPage,
        data: [...archiveResults.data, ...results.data],
      };

      setarchiveResults(updatedResults);
      setFilteredResults(updatedResults);
    } catch (error) {
      console.error('Error loading more results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) handleSubmit();
  };

  const displaySearchIcon = !isArchive ? SearchIcon : ArchiveIcon;
  const displayTooltipContent = !isArchive
    ? `<span class="font-body-03">${uiStrings.searchModeTooltip || 'Your query will automatically translate into the other language. English queries will be searched in <b>Google</b>. Chinese queries will be searched in <b>Baidu</b>.'}</span>`
    : `<span class="font-body-03">${uiStrings.archiveModeTooltip || "Explore the archive to view past results from other users and see how they've changed over time."}</span>`;

  return (
    <>
      <div className="flex flex-col self-center mt-20 min-h-[200px] iphone:mt-10 iphone:max-w-full">
        <div className="flex flex-wrap self-center max-w-[720px] w-[720px] iphone:max-w-full">
          <div className="flex flex-wrap items-center w-full border-b border-solid border-red-600 iphone:max-w-full">
            <div className="flex items-center gap-5 self-stretch my-auto min-w-[240px] relative iphone:min-w-[200px]">
              <div
                onClick={() => navigate(isArchive ? '/archive' : '/search')}
                className={`
                  relative z-10
                  flex items-center gap-2 px-4 py-2
                  rounded-t border-t border-l border-r border-solid border-red-600
                  cursor-pointer
                  bg-slate-100 border-b-0 mb-[-2px]
                `}
              >
                <div className="flex gap-2 items-center">
                  {isArchive ? (
                    <>
                      <img src={Archive} alt="Archive" className="w-10 h-10 iphone:w-8 iphone:h-8" />
                      <span className="font-semibold text-red-600 ml-2">
                        {uiStrings.archiveButton || getDefault('archive', 'archiveButton', language)}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2.5 justify-center items-center w-10 h-10 iphone:w-8 iphone:h-8">
                        <img
                          src={GoogleLogoBlue}
                          alt="Google logo blue"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex gap-2.5 justify-center items-center w-10 h-10 iphone:w-8 iphone:h-8">
                        <img
                          src={BaiduLogoRed}
                          alt="Baidu logo red"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="font-semibold text-red-600 ml-2">
                        {uiStrings.compareButton || getDefault('search', 'compareButton', language)}
                      </span>
                    </>
                  )}
                </div>
                <QuestionIcon
                  fill="#ef4444"
                  className="w-6 h-6"
                  data-tooltip-id="tooltip"
                  data-tooltip-html={displayTooltipContent}
                  data-tooltip-place="right"
                />
              </div>
              <div
                onClick={() => navigate(isArchive ? '/search' : '/archive')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer text-sm"
              >
                {isArchive ? (
                  <>
                    <div className="flex gap-1 items-center">
                      <img
                        src={GoogleLogoBlue}
                        alt="Google"
                        className="w-5 h-5 grayscale opacity-60"
                      />
                      <img
                        src={BaiduLogoRed}
                        alt="Baidu"
                        className="w-5 h-5 grayscale opacity-60"
                      />
                    </div>
                    <span>
                      {uiStrings.searchComparisonLink || getDefault('search', 'searchComparisonLink', language)} →
                    </span>
                  </>
                ) : (
                  <>
                    <img src={ArchiveGrayscale} alt="Archive" className="w-5 h-5" />
                    <span>
                      {uiStrings.searchArchiveLink || getDefault('archive', 'searchArchiveLink', language)} →
                    </span>
                  </>
                )}
              </div>
            </div>
            <Tooltip id="tooltip" border={'1px solid #e60011'} />
          </div>
          <div className="flex justify-center p-1.5 md:p-5 gap-4 w-full rounded-tr rounded-br rounded-bl border-r border-b border-l border-solid bg-slate-100 border-red-600 iphone:max-w-full">
            <Combobox value={query} onChange={setQuery}>
              <div className="relative flex w-full iphone:flex-1">
                <div className="flex w-full bg-white rounded border border-solid border-neutral-500 h-[56px] overflow-hidden">
                  <Combobox.Input
                    placeholder={inputPlaceholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isTranslating}
                    className="flex-1 px-4 font-body-02 border-none h-[56px] text-neutral-600 focus:text-black placeholder:text-neutral-600 focus:ring-0 focus:outline-none iphone:text-lg"
                    aria-label="Search query"
                  />
                  <div className="flex items-center bg-white">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || isTranslating}
                      className="flex items-center justify-center w-14 h-[56px] bg-white hover:bg-gray-50 transition-colors iphone:w-12"
                    >
                      <img
                        src={isLoading || isTranslating ? Spinner : displaySearchIcon}
                        alt="Search icon"
                        className="w-6 h-6 object-contain aspect-square min-w-[28px] min-h-[28px] iphone:w-5 iphone:h-5"
                      />
                    </button>
                  </div>
                </div>
                {!isArchive && suggestions.length > 0 && !isLoading && !isTranslating && (
                  <Combobox.Options className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-500 rounded shadow-lg max-h-[400px] overflow-y-auto z-50">
                    {suggestions.map(suggestion => (
                      <Combobox.Option
                        key={suggestion.query}
                        value={suggestion.query}
                        className={({ active }) =>
                          `px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${
                            active ? 'bg-red-50' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        {({ active }) => (
                          <>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${active ? 'text-red-600' : 'text-gray-900'}`}>
                                {suggestion.query}
                              </span>
                              {suggestion.sensitive && (
                                <span className="text-xs" title="Sensitive term">
                                  🔒
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">→ {suggestion.translation}</span>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
            {isArchive && (
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`hidden md:flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded ${
                  filterOpen ? 'bg-red-50' : ''
                } iphone:px-3 iphone:py-1.5 iphone:text-sm`}
              >
                <div className="font-body-02">
                  {uiStrings.archiveFiltersButton || getDefault('archive', 'archiveFiltersButton', language)}
                </div>
                <FilterIcon
                  className={`ml-2 w-6 h-6 transition-transform duration-200 [filter:invert(19%)_sepia(92%)_saturate(2352%)_hue-rotate(343deg)_brightness(94%)_contrast(97%)] ${
                    filterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Progress Indicator for Search Stages */}
          {!isArchive && searchStage && searchStage !== 'complete' && (
            <SearchProgressIndicator stage={searchStage} estimatedTimeRemaining={estimatedTime} />
          )}

          <div className="flex items-center gap-4 mt-4">
            {isTranslating && !translation && (
              <span className="p-1 leading-8 text-medium bg-blue-50 border border-blue-600 rounded text-blue-600 flex items-center gap-2">
                <img src={Spinner} alt="Translating" className="w-4 h-4" />
                <span className="font-bold">{uiStrings.translatingText || 'Translating...'}</span>
              </span>
            )}
            {translation && (
              <span
                className={`p-1 leading-8 text-medium rounded flex items-center gap-2 ${
                  isTranslating
                    ? 'bg-blue-50 border border-blue-600 text-blue-600'
                    : 'bg-slate-50 border border-black'
                }`}
              >
                {isTranslating && <img src={Spinner} alt="Loading" className="w-4 h-4" />}
                <span className="font-bold">{uiStrings.translationLabel || 'Translation:'}</span>{' '}
                {translation}
              </span>
            )}
            {error && (
              <span className="p-1 leading-8 text-medium bg-red-50 border border-red-600 rounded text-red-600">
                <span className="font-bold">{uiStrings.errorLabel || 'Error:'}</span> {error}
              </span>
            )}
            {isArchive && (
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`md:hidden flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded ${
                  filterOpen ? 'bg-red-50' : ''
                } iphone:px-3 iphone:py-1.5 iphone:text-sm`}
              >
                <div className="font-body-02">
                  {uiStrings.archiveFiltersButton || getDefault('archive', 'archiveFiltersButton', language)}
                </div>
                <FilterIcon
                  className={`ml-2 w-6 h-6 transition-transform duration-200 [filter:invert(19%)_sepia(92%)_saturate(2352%)_hue-rotate(343deg)_brightness(94%)_contrast(97%)] ${
                    filterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>
        {isArchive && (
          <FilterControls onUpdate={applyFilters} isOpen={filterOpen} isLoading={isLoading} />
        )}
        {!isArchive &&
          (isLoading || (imageResults?.googleResults?.length > 0 || imageResults?.baiduResults?.length > 0)) && (
            <SearchCompare
              images={imageResults || { googleResults: [], baiduResults: [] }}
              query={query}
              searchId={currentSearchId || ''}
              isLoading={isLoading}
            />
          )}
      </div>
      {/* Default most recent archive results */}
      {currentSearchId && isArchive && (
        <QueryList
          results={filteredResults}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          filterOptions={currentFilters}
        />
      )}
    </>
  );
}

export default SearchInput;
