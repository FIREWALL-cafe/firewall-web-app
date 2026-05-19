import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Combobox } from '@headlessui/react';
import QueryList from './QueryList';
import useCookie from '../useCookie';
import FilterControls from './FilterControls';
import FilterChip from './FilterChip';
import Modal from './Modal';
import ApiContext from '../context/ApiContext';
import QuestionIcon from './icons/QuestionIcon';
import { useLanguage } from '../context/LanguageContext';
import { getSearchPageStrings, getArchivePageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import { formatLocationName } from '../utils/stringUtils';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useRotatingStatus } from '../hooks/useRotatingStatus';
import { buildProgressCaptions } from './searchProgressCaptions';

import GoogleLogoBlue from '../assets/icons/google-logo_blue.svg';
import BaiduLogoRed from '../assets/icons/baidu_logo_red.svg';
import SearchIcon from '../assets/icons/image_search.svg';
import ArchiveIcon from '../assets/icons/folder_open_search.svg';
import ArchiveGrayscale from '../assets/icons/Archive_grayscale.png';
import Archive from '../assets/icons/Archive.png';
import FilterIcon from './FilterIcon';
import ArrowRight from './icons/ArrowRight';
import SearchCompare from './SearchCompare';
import Spinner from '../assets/spinner.svg';
import CloseIcon from '../assets/icons/close_large.svg';
import TuneIcon from '../assets/icons/tune.svg';
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
  const [progress, setProgress] = useState(0);
  const progressStartedAt = useRef(null);
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [translation, setTranslation] = useState('');
  const [currentSearchId, setSearchId] = useState(null);

  // Autocomplete suggestions
  const { suggestions } = useAutocomplete(query, language);
  const setResults = useCallback(results => setImageResults(results), []);
  const [username] = useCookie('username');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [countryNameMap, setCountryNameMap] = useState({});
  const emptyFilters = {
    vote_ids: [],
    years: [],
    search_locations: [],
    us_states: [],
    countries: [],
    start_date: '',
    end_date: '',
    where: 'places',
  };
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [previewCount, setPreviewCount] = useState(null);
  const [isCountLoading, setIsCountLoading] = useState(false);
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

  const isSearchActive = isLoading || isTranslating;
  const progressCaptions = useMemo(() => buildProgressCaptions(uiStrings), [uiStrings]);
  const rotatingCaption = useRotatingStatus(isSearchActive, progressCaptions);

  useEffect(() => {
    if (!isSearchActive) {
      if (progressStartedAt.current) {
        setProgress(1);
        const t = setTimeout(() => {
          progressStartedAt.current = null;
          setProgress(0);
        }, 200);
        return () => clearTimeout(t);
      }
      return undefined;
    }
    if (!progressStartedAt.current) {
      progressStartedAt.current = performance.now();
      setProgress(0);
    }
    const ESTIMATED_MS = 15_000;
    const id = setInterval(() => {
      const elapsed = performance.now() - progressStartedAt.current;
      setProgress(Math.min(0.97, elapsed / ESTIMATED_MS));
    }, 100);
    return () => clearInterval(id);
  }, [isSearchActive]);

  // Compute placeholder value with useMemo to ensure it always has correct value
  // This prevents the input from disappearing during language switch
  const inputPlaceholder = useMemo(() => {
    if (isArchive) {
      return uiStrings.archiveInputPlaceholder || getDefault('archive', 'archiveInputPlaceholder', language);
    } else {
      return uiStrings.searchInputPlaceholder || getDefault('search', 'searchInputPlaceholder', language);
    }
  }, [isArchive, uiStrings.archiveInputPlaceholder, uiStrings.searchInputPlaceholder, language]);

  // Fetch country code → name map for chip labels
  useEffect(() => {
    fetch('/api/analytics/countries')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const map = {};
        data.forEach(c => { if (c.code && c.name) map[c.code] = c.name; });
        setCountryNameMap(map);
      })
      .catch(() => {});
  }, []);

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
        const [pageStrings, searchStrings] = await Promise.all([
          isArchive ? getArchivePageStrings(language) : getSearchPageStrings(language),
          isArchive ? getSearchPageStrings(language) : Promise.resolve(null),
        ]);
        // Merge Sanity strings with defaults (Sanity strings take precedence).
        // On Archive, also pull progress-bar captions from searchPageStrings.
        setUiStrings(prev => ({
          ...prev,
          ...pageStrings,
          ...(searchStrings && {
            progressTranslatingCaption: searchStrings.progressTranslatingCaption,
            progressSearchingGoogleCaption: searchStrings.progressSearchingGoogleCaption,
            progressSearchingBaiduCaption: searchStrings.progressSearchingBaiduCaption,
            progressFillerCaptions: searchStrings.progressFillerCaptions,
          }),
        }));
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
    const urlSearchLocations = searchParams.getAll('search_locations');
    const urlCountries = searchParams.getAll('countries');
    const urlUsStates = searchParams.getAll('us_states');
    const urlStartDate = searchParams.get('start_date');
    const urlEndDate = searchParams.get('end_date');

    // Check if any URL filters are present
    const hasUrlFilters =
      urlSearchLocations.length > 0 || urlCountries.length > 0 || urlUsStates.length > 0 ||
      urlStartDate || urlEndDate ||
      searchParams.getAll('vote_ids').length > 0 || searchParams.getAll('years').length > 0;

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
              setTranslation('');

              const urlVoteIds = searchParams.getAll('vote_ids').map(Number).filter(Boolean);
              const urlYears = searchParams.getAll('years');

              // Build filter params from URL
              const filterParams = {
                ...(urlQuery ? { query: urlQuery.trim() } : {}),
                page: 1,
                page_size: 10,
              };

              // Add URL filters if present
              if (urlSearchLocations.length > 0) {
                filterParams.search_locations = urlSearchLocations;
              }
              if (urlCountries.length > 0) {
                filterParams.countries = urlCountries;
              }
              if (urlUsStates.length > 0) {
                filterParams.us_states = urlUsStates;
              }
              if (urlStartDate) {
                filterParams.start_date = urlStartDate;
              }
              if (urlEndDate) {
                filterParams.end_date = urlEndDate;
              }
              if (urlVoteIds.length > 0) {
                filterParams.vote_ids = urlVoteIds;
              }
              if (urlYears.length > 0) {
                filterParams.years = urlYears;
              }

              // Fire translation independently — show results immediately, translation updates when ready
              if (urlQuery) {
                setIsLoadingTranslation(true);
                translateQuery(urlQuery.trim())
                  .then(result => { if (result?.translation) setTranslation(result.translation); })
                  .catch(() => {})
                  .finally(() => setIsLoadingTranslation(false));
              }

              const results = await searchArchive(filterParams);

              if (results?.error) {
                throw new Error(results.error);
              }

              setCurrentFilters({
                vote_ids: urlVoteIds,
                years: urlYears,
                search_locations: urlSearchLocations,
                us_states: urlUsStates,
                countries: urlCountries,
                start_date: urlStartDate || '',
                end_date: urlEndDate || '',
              });

              setSearchId('archived searches');
              setarchiveResults(results);
              setFilteredResults(results);
            } else {
              // Reset search ID so vote buttons don't carry stale state
              setSearchId(null);

              // Stage 1: Get translation
              setIsTranslating(true);

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

              const response = await searchImages({
                body: JSON.stringify(searchBody),
              });

              if (response.error) {
                // Handle "No images found" error specially
                if (response.error === 'No images found') {
                  setResults({ googleResults: [], baiduResults: [] });
                  setError(response.message || `No images found for "${urlQuery}"`);
                  setTranslation(response.translation || translationResult?.translation || '');
                  setLoading(false);
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
    translateQuery,
    searchArchive,
    searchImages,
    username,
    setResults,
    loadDefaultResults,
  ]);

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

  const handleOpenFilters = () => {
    setPreviewCount(null);
    setIsCountLoading(false);
    setDraftFilters({
      countries: searchParams.getAll('countries'),
      search_locations: searchParams.getAll('search_locations'),
      years: searchParams.getAll('years'),
      vote_ids: searchParams.getAll('vote_ids').map(Number),
      us_states: searchParams.getAll('us_states'),
      start_date: searchParams.get('start_date') || '',
      end_date: searchParams.get('end_date') || '',
      where: searchParams.get('where') || 'places',
    });
    setFilterOpen(true);
  };

  const handleApplyDraftFilters = () => {
    // Serialize active draft filters to URL params; useEffect watches searchParams and will trigger the search
    const nextParams = new URLSearchParams();
    const urlQuery = searchParams.get('q');
    if (urlQuery) nextParams.set('q', urlQuery);
    draftFilters.countries.forEach(v => nextParams.append('countries', v));
    draftFilters.us_states.forEach(v => nextParams.append('us_states', v));
    draftFilters.search_locations.forEach(v => nextParams.append('search_locations', v));
    draftFilters.years.forEach(v => nextParams.append('years', v));
    draftFilters.vote_ids.forEach(v => nextParams.append('vote_ids', String(v)));
    if (draftFilters.where === 'events') nextParams.set('where', 'events');
    setSearchParams(nextParams);
    setFilterOpen(false);
  };

  const handleClearDraftFilters = () => {
    setDraftFilters(emptyFilters);
  };

  const isDraftEmpty =
    draftFilters.countries.length === 0 &&
    draftFilters.us_states.length === 0 &&
    draftFilters.search_locations.length === 0 &&
    draftFilters.years.length === 0 &&
    draftFilters.vote_ids.length === 0;

  useEffect(() => {
    if (!filterOpen) return;
    const currentQuery = searchParams.get('q') || '';
    if (isDraftEmpty && !currentQuery) {
      setPreviewCount(null);
      setIsCountLoading(false);
      return;
    }
    setIsCountLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await searchArchive({ query: currentQuery, ...draftFilters });
        const total = result?.total ?? result?.pagination?.total;
        setPreviewCount(typeof total === 'number' ? total : null);
      } catch {
        setPreviewCount(null);
      } finally {
        setIsCountLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [draftFilters, filterOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseFilters = () => {
    setFilterOpen(false);
    setPreviewCount(null);
    setIsCountLoading(false);
  };

  const handleClearSearch = () => {
    setQuery('');
    setTranslation('');
    setIsLoadingTranslation(false);
    setCurrentFilters({
      vote_ids: [],
      years: [],
      search_locations: [],
      us_states: [],
      countries: [],
      start_date: '',
      end_date: '',
    });
    setSearchParams({});
    loadDefaultResults();
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) handleSubmit();
  };

  const VOTE_ID_TO_LABEL = {
    1: 'Censored', 2: 'Uncensored', 3: 'Bad Translation',
    4: 'Good Translation', 5: 'Lost in Translation',
  };

  function removeUrlFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key).filter(v => v !== String(value));
    next.delete(key);
    existing.forEach(v => next.append(key, v));
    setSearchParams(next);
    // useEffect watches searchParams and will re-run the search
  }

  const activeChips = isArchive ? [
    ...searchParams.getAll('countries').map(code => ({
      key: `countries:${code}`,
      label: countryNameMap[code] || code,
      onRemove: () => removeUrlFilter('countries', code),
    })),
    ...searchParams.getAll('us_states').map(s => ({
      key: `us_states:${s}`,
      label: s,
      onRemove: () => removeUrlFilter('us_states', s),
    })),
    ...searchParams.getAll('search_locations').map(loc => ({
      key: `search_locations:${loc}`,
      label: formatLocationName(loc),
      onRemove: () => removeUrlFilter('search_locations', loc),
    })),
    ...searchParams.getAll('years').map(y => ({
      key: `years:${y}`,
      label: y,
      onRemove: () => removeUrlFilter('years', y),
    })),
    ...searchParams.getAll('vote_ids').map(id => ({
      key: `vote_ids:${id}`,
      label: VOTE_ID_TO_LABEL[Number(id)] || `Vote ${id}`,
      onRemove: () => removeUrlFilter('vote_ids', id),
    })),
  ] : [];

  const showInlineTranslation = isArchive
    ? !!(translation || isLoadingTranslation) && query === searchParams.get('q')
    : !!(translation || isTranslating);

  const displaySearchIcon = !isArchive ? SearchIcon : ArchiveIcon;
  const displayTooltipContent = !isArchive
    ? `<span class="font-body-03">${uiStrings.searchModeTooltip || 'Your query will automatically translate into the other language. English queries will be searched in <b>Google</b>. Chinese queries will be searched in <b>Baidu</b>.'}</span>`
    : `<span class="font-body-03">${uiStrings.archiveModeTooltip || "Explore the archive to view past results from other users and see how they've changed over time."}</span>`;

  return (
    <>
      <div className="flex flex-col self-center mt-20 min-h-[200px] iphone:mt-10 iphone:max-w-full">
        <div className="flex flex-wrap self-center max-w-[720px] w-[720px] iphone:max-w-full">
          <div className="flex flex-wrap items-center w-full iphone:max-w-full">
            <div className="flex items-center gap-5 self-stretch my-auto min-w-[240px] relative iphone:min-w-[200px]">
              <div
                onClick={() => navigate(isArchive ? '/archive' : '/search')}
                className={`
                  relative z-10
                  flex items-center gap-2 px-4 py-2
                  rounded-t border-t border-l border-r border-solid border-red-600
                  cursor-pointer
                  bg-[#F5F7F9] border-b-0 mb-[-1px]
                `}
              >
                <div className="flex gap-2 items-center">
                  {isArchive ? (
                    <>
                      <img src={Archive} alt="Archive" className="w-10 h-10 iphone:w-8 iphone:h-8" />
                      <span className="font-bitmap-song text-[18px] font-semibold text-red-600 ml-2">
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
                      <span className="font-bitmap-song text-[18px] font-semibold text-red-600 ml-2">
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
                    <span className="font-bitmap-song text-[18px] inline-flex items-center gap-1">
                      {uiStrings.searchComparisonLink || getDefault('search', 'searchComparisonLink', language)}
                      <ArrowRight fill="currentColor" className="w-4 h-4" />
                    </span>
                  </>
                ) : (
                  <>
                    <img src={ArchiveGrayscale} alt="Archive" className="w-5 h-5" />
                    <span className="font-bitmap-song text-[18px] inline-flex items-center gap-1">
                      {uiStrings.searchArchiveLink || getDefault('archive', 'searchArchiveLink', language)}
                      <ArrowRight fill="currentColor" className="w-4 h-4" />
                    </span>
                  </>
                )}
              </div>
            </div>
            <Tooltip id="tooltip" border={'1px solid #e60011'} />
          </div>
          <div className="flex justify-center p-1.5 md:p-5 gap-4 w-full rounded-tr rounded-br rounded-bl border border-solid bg-[#F5F7F9] border-red-600 iphone:max-w-full">
            <Combobox value={query} onChange={setQuery}>
              <div className="relative flex w-full iphone:flex-1">
                <div className="flex w-full bg-white rounded border border-solid border-neutral-500 h-[56px] overflow-hidden">
                  <Combobox.Input
                    placeholder={inputPlaceholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
disabled={isLoading || isTranslating}
                    style={
                      showInlineTranslation
                        ? { width: `calc(${query.length}ch + 2rem)` }
                        : undefined
                    }
                    className={`px-4 font-body-02 border-none h-[56px] text-neutral-600 focus:text-black placeholder:text-neutral-600 focus:ring-0 focus:outline-none iphone:text-lg ${
                      showInlineTranslation ? 'flex-shrink-0' : 'flex-1'
                    }`}
                    aria-label="Search query"
                  />
                  {showInlineTranslation && (
                    <div className="flex items-center gap-1 flex-1 min-w-0 text-neutral-600 font-body-02 overflow-hidden pr-2">
                      <span className="flex-shrink-0">|</span>
                      <span className="truncate">{translation || '...'}</span>
                    </div>
                  )}
                  <div className="flex items-center bg-white">
                    {isArchive && searchParams.get('q') && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="flex items-center justify-center w-8 h-[56px] bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Clear search"
                      >
                        <img src={CloseIcon} alt="Clear" className="w-4 h-4 object-contain" />
                      </button>
                    )}
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
                onClick={handleOpenFilters}
                className={`hidden md:flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded ${
                  filterOpen ? 'bg-red-50' : ''
                } iphone:px-3 iphone:py-1.5 iphone:text-sm`}
              >
                <div className="font-body-02">
                  {uiStrings.archiveFiltersButton || getDefault('archive', 'archiveFiltersButton', language)}
                </div>
                {activeChips.length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs rounded px-1.5 py-0.5 min-w-[18px] text-center">
                    {activeChips.length}
                  </span>
                )}
                <FilterIcon
                  className="ml-2 w-6 h-6 [filter:invert(19%)_sepia(92%)_saturate(2352%)_hue-rotate(343deg)_brightness(94%)_contrast(97%)]"
                />
              </button>
            )}
          </div>

          {/* Progress Indicator for Search Stages - regular search only */}
          {!isArchive && (
            <SearchProgressIndicator
              isActive={isSearchActive || progress > 0}
              progress={progress}
              caption={rotatingCaption}
            />
          )}


          <div className="flex items-center gap-4 mt-4">
            {error && (
              <span className="p-1 leading-8 text-medium bg-red-50 border border-red-600 rounded text-red-600">
                <span className="font-bold">{uiStrings.errorLabel || 'Error:'}</span> {error}
              </span>
            )}
            {isArchive && (
              <button
                onClick={handleOpenFilters}
                className="md:hidden flex cursor-pointer justify-center items-center px-4 py-2 text-red-600 bg-white border border-red-600 hover:bg-red-50 transition-colors duration-200 rounded iphone:px-3 iphone:py-1.5 iphone:text-sm"
              >
                <div className="font-body-02">
                  {uiStrings.archiveFiltersButton || getDefault('archive', 'archiveFiltersButton', language)}
                </div>
                {activeChips.length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs rounded px-1.5 py-0.5 min-w-[18px] text-center">
                    {activeChips.length}
                  </span>
                )}
                <FilterIcon
                  className="ml-2 w-6 h-6 [filter:invert(19%)_sepia(92%)_saturate(2352%)_hue-rotate(343deg)_brightness(94%)_contrast(97%)]"
                />
              </button>
            )}
          </div>
          {isArchive && activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeChips.map(chip => (
                <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
              ))}
            </div>
          )}
        </div>
        {isArchive && (
          <Modal
            open={filterOpen}
            onClose={handleCloseFilters}
            onUpdate={handleApplyDraftFilters}
            onClear={handleClearDraftFilters}
            clearDisabled={isDraftEmpty}
            title="Filters"
            headerIcon={TuneIcon}
            updateButtonText={isCountLoading ? 'See Results…' : previewCount !== null ? `See ${previewCount.toLocaleString()} Results` : 'See Results'}
            clearButtonText="Clear all"
            allowOutsideClick={false}
          >
            <FilterControls
              filters={draftFilters}
              onChange={newFilters => { setPreviewCount(null); setDraftFilters(newFilters); }}
              isLoading={isLoading}
            />
          </Modal>
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
