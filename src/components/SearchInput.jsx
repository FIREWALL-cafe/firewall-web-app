import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import QueryList from './QueryList';
import useCookie from '../useCookie';
import FilterControls from './FilterControls';
import ApiContext from '../context/ApiContext';
import QuestionIcon from './icons/QuestionIcon';

import GoogleLogoBlue from '../assets/icons/google-logo_blue.svg';
import BaiduLogoRed from '../assets/icons/baidu_logo_red.svg';
import SearchIcon from '../assets/icons/image_search.svg';
import ArchiveIcon from '../assets/icons/folder_open_search.svg';
import ArchiveGrayscale from '../assets/icons/Archive_grayscale.png';
import Archive from '../assets/icons/Archive.png';
import FilterIcon from './FilterIcon';
import SearchCompare from './SearchCompare';
import Spinner from '../assets/spinner.svg';

function SearchInput({ searchMode }) {
  const { searchImages, searchArchive } = useContext(ApiContext);
  const [isLoading, setLoading] = useState(false);
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
  const setResults = useCallback(results => setImageResults(results), []);
  const [username] = useCookie('username');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isArchive] = useState(searchMode === 'archive');
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
    const hasUrlFilters = urlSearchLocations || urlCountries || urlUsStates || urlStartDate || urlEndDate;

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
              console.log('Calling searchImages API for query:', urlQuery.trim());
              const response = await searchImages({
                body: JSON.stringify({
                  query: urlQuery.trim(),
                  search_client_name: username,
                })
              });

              console.log('searchImages response received:', {
                hasError: !!response.error,
                hasGoogleResults: !!response.googleResults,
                hasBaiduResults: !!response.baiduResults,
                googleCount: response.googleResults?.length,
                baiduCount: response.baiduResults?.length,
                hasSearchId: !!response.searchId,
                hasTranslation: !!response.translation
              });

              if (response.error) {
                // Handle "No images found" error specially
                if (response.error === 'No images found') {
                  setResults({ googleResults: [], baiduResults: [] });
                  setError(response.message || `No images found for "${urlQuery}"`);
                  setTranslation(response.translation || '');
                  setLoading(false);
                  searchInProgress.current = false;
                  return;
                }
                throw new Error(response.error);
              }

              const { googleResults, baiduResults, translation, searchId } = response;
              console.log('Setting results - Google:', googleResults?.length, 'Baidu:', baiduResults?.length);
              setSearchId(searchId);
              setResults({
                googleResults: googleResults || [],
                baiduResults: baiduResults || [],
              });
              setTranslation(translation || '');
              console.log('Results set successfully');
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
    ? '<span class="font-body-03">Your query will automatically translate into the other language. English queries will be searched in <b>Google</b>. Chinese queries will be searched in <b>Baidu</b>.</span>'
    : '<span class="font-body-03">Explore the archive to view past results from other users and see how they\'ve changed over time.</span>';

  return (
    <>
      <div className="flex overflow-hidden flex-col self-center mt-20 min-h-[200px] iphone:mt-10 iphone:max-w-full">
        <div className="flex flex-wrap self-center max-w-[720px] w-[720px] iphone:max-w-full">
          <div className="flex flex-wrap items-center w-full border-b border-solid border-red-600 iphone:max-w-full">
            <div className="flex items-center self-stretch my-auto min-w-[240px] relative iphone:min-w-[200px]">
              <div
                onClick={() => navigate(isArchive ? '/archive' : '/search')}
                className={`
                  relative z-10
                  flex items-center gap-2 px-8 md:py-3 py-2
                  rounded-t border-t border-l border-r border-solid border-red-600 
                  cursor-pointer
                  bg-slate-100 border-b-0 mb-[-2px]
                  iphone:px-4
                `}
              >
                <div className="flex gap-1 items-center">
                  {isArchive ? (
                    <>
                      <img src={Archive} alt="Archive" className="w-6 h-6" />
                      <span className="font-semibold text-red-600 ml-2">Archive</span>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2.5 justify-center items-center w-8 h-8 iphone:w-6 iphone:h-6">
                        <img
                          src={GoogleLogoBlue}
                          alt="Google logo blue"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="font-semibold text-red-600">vs.</span>
                      <div className="flex gap-2.5 justify-center items-center w-8 h-8 iphone:w-6 iphone:h-6">
                        <img
                          src={BaiduLogoRed}
                          alt="Baidu logo red"
                          className="object-contain w-full h-full"
                        />
                      </div>
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
                    <div className="flex gap-0.5 items-center">
                      <img
                        src={GoogleLogoBlue}
                        alt="Google"
                        className="w-4 h-4 grayscale opacity-60"
                      />
                      <span className="font-semibold text-red-600  grayscale opacity-60">vs.</span>
                      <img
                        src={BaiduLogoRed}
                        alt="Baidu"
                        className="w-4 h-4 grayscale opacity-60"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <img src={ArchiveGrayscale} alt="Archive" className="w-4 h-4" />
                    <span>Archive</span>
                  </>
                )}
              </div>
            </div>
            <Tooltip id="tooltip" border={'1px solid #e60011'} />
          </div>
          <div className="flex justify-center p-1.5 md:p-5 gap-4 w-full rounded border-r border-b border-l border-solid bg-slate-100 border-red-600 iphone:max-w-full">
            <div className="flex w-full bg-white rounded border border-solid border-neutral-500 h-[56px] iphone:flex-1 overflow-hidden">
              <input
                placeholder={isArchive ? 'Search the query archive' : 'Search Google & Baidu'}
                value={query}
                type="text"
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!!isLoading}
                className="flex-1 px-4 font-body-02 border-none h-[56px] text-neutral-600 focus:text-black placeholder:text-neutral-600 focus:ring-0 focus:outline-none iphone:text-lg"
                aria-label="Search query"
              />
              <div className="flex items-center bg-white">
                <button
                  onClick={handleSubmit}
                  disabled={!!isLoading}
                  className="flex items-center justify-center w-14 h-[56px] bg-white hover:bg-gray-50 transition-colors iphone:w-12"
                >
                  <img
                    src={isLoading ? Spinner : displaySearchIcon}
                    alt="Search icon"
                    className="w-6 h-6 object-contain aspect-square min-w-[28px] min-h-[28px] iphone:w-5 iphone:h-5"
                  />
                </button>
              </div>
            </div>
            {isArchive && (
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`hidden md:flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded ${
                  filterOpen ? 'bg-red-50' : ''
                } iphone:px-3 iphone:py-1.5 iphone:text-sm`}
              >
                <div className="font-body-02">filters</div>
                <FilterIcon
                  className={`ml-2 w-6 h-6 transition-transform duration-200 [filter:invert(19%)_sepia(92%)_saturate(2352%)_hue-rotate(343deg)_brightness(94%)_contrast(97%)] ${
                    filterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span
              className={`p-1 leading-8 text-medium bg-slate-50 border border-black rounded ${
                translation ? '' : 'hidden'
              }`}
            >
              <span className="font-bold">Translation:</span> {translation}
            </span>
            {error && (
              <span className="p-1 leading-8 text-medium bg-red-50 border border-red-600 rounded text-red-600">
                <span className="font-bold">Error:</span> {error}
              </span>
            )}
            {isArchive && (
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`md:hidden flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded ${
                  filterOpen ? 'bg-red-50' : ''
                } iphone:px-3 iphone:py-1.5 iphone:text-sm`}
              >
                <div className="font-body-02">filters</div>
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
        {!isArchive && (isLoading || (currentSearchId && imageResults?.googleResults.length > 0)) && (
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
