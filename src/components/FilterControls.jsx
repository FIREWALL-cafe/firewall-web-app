import React, { useState, useEffect } from 'react';
import VoteButton from './VoteButton';
import { locationMapping } from '../constants/locations';
import { formatLocationName } from '../utils/stringUtils';
import { useLanguage } from '../context/LanguageContext';
import { getFilterStrings } from '../lib/sanity';

function FilterControls({ onUpdate, isOpen, isLoading }) {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [shouldResetVotes, setShouldResetVotes] = useState(false);
  const [usStatesData, setUsStatesData] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    country: null,
    usState: null,
    source: null,
    startDate: null,
    endDate: null,
  });

  // Load filter strings from Sanity
  useEffect(() => {
    async function loadStrings() {
      try {
        const strings = await getFilterStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load filter strings:', error);
        // Fallback to hardcoded English
        setUiStrings({
          filterCountryLabel: 'Country',
          filterStateLabel: 'US State',
          filterSourceLabel: 'Search Source',
          filterStartDateLabel: 'Start Date',
          filterEndDateLabel: 'End Date',
          filterAllCountries: 'All Countries',
          filterAllSources: 'All Sources',
          filterAllStates: 'All States',
          filterPrimaryLabel: 'Primary',
          filterSecondaryLabel: 'Secondary',
          filterActiveFiltersLabel: 'Active Filters:',
          filterCountActiveText: 'filter(s) active',
          filterLoadingStatesText: 'Loading states...',
          filterClearAllButton: 'Clear All',
          filterBadgeCountry: 'Country:',
          filterBadgeState: 'State:',
          filterBadgeSource: 'Source:',
          filterBadgeStartDate: 'Start:',
          filterBadgeEndDate: 'End:',
        });
      }
    }
    loadStrings();
  }, [language]);

  // Dynamic country list from database
  const [countries, setCountries] = useState([]);

  // Dynamic search locations from database
  const [searchLocations, setSearchLocations] = useState([]);

  const vote_categories = [
    'votes_censored',
    'votes_uncensored',
    'votes_bad_translation',
    'votes_good_translation',
    'votes_lost_in_translation',
  ];

  // Fetch countries and search locations data when component mounts
  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const response = await fetch('/api/analytics/countries');
        if (response.ok) {
          const data = await response.json();
          // Filter out entries without country codes and format for dropdown
          const formattedCountries = data
            .filter(country => country.code && country.name)
            .map(country => ({
              code: country.code,
              name: country.name,
              search_count: country.search_count,
            }))
            .sort((a, b) => b.search_count - a.search_count); // Sort by search count descending
          setCountries(formattedCountries);
        }
      } catch (error) {
        console.error('Error fetching countries data:', error);
      }
    };

    const fetchSearchLocationsData = async () => {
      try {
        const response = await fetch('/searches/search-locations');
        if (response.ok) {
          const data = await response.json();
          // Filter out automated scrapers and format for dropdown
          const formattedLocations = data
            .filter(
              location =>
                location.search_location &&
                location.search_location !== 'automated_scraper' &&
                location.search_location !== 'nyc3'
            )
            .map(location => ({
              value: location.search_location,
              label: formatLocationName(location.search_location),
              search_count: location.search_count,
            }))
            .sort((a, b) => b.search_count - a.search_count); // Sort by search count descending
          setSearchLocations(formattedLocations);
        }
      } catch (error) {
        console.error('Error fetching search locations data:', error);
      }
    };

    const fetchUSStatesData = async () => {
      try {
        setLoadingStates(true);
        const response = await fetch('/api/analytics/us-states');
        if (response.ok) {
          const data = await response.json();
          setUsStatesData(data);
        }
      } catch (error) {
        console.error('Error fetching US states data:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    // Fetch countries and search locations once when component mounts
    if (countries.length === 0) {
      fetchCountriesData();
    }
    if (searchLocations.length === 0) {
      fetchSearchLocationsData();
    }

    if (isOpen) {
      fetchUSStatesData();

      // Check current form values when opening
      const form = document.getElementById('filter-options-form');
      if (form) {
        const countriesSelect = form.querySelector('select[name="countries"]');
        const citiesSelect = form.querySelector('select[name="cities"]');
        const usStatesSelect = form.querySelector('select[name="us_states"]');

        const newActiveFilters = {
          country: null,
          usState: null,
          source: null,
          startDate: startDate || null,
          endDate: endDate || null,
        };

        if (countriesSelect && countriesSelect.value) {
          const country = countries.find(c => c.code === countriesSelect.value);
          newActiveFilters.country = country ? country.name : null;
          setSelectedCountry(countriesSelect.value);
        }

        if (citiesSelect && citiesSelect.value) {
          // Check if it's an old locationMapping key or a direct search_location value
          const matchedLocation = searchLocations.find(loc => loc.value === citiesSelect.value);
          newActiveFilters.source = matchedLocation
            ? matchedLocation.label
            : locationMapping[citiesSelect.value] || formatLocationName(citiesSelect.value);
        }

        if (usStatesSelect && usStatesSelect.value) {
          newActiveFilters.usState = usStatesSelect.value;
        }

        setActiveFilters(newActiveFilters);
      }
    }
  }, [isOpen, countries, searchLocations, startDate, endDate]);

  const metaKeyToId = {
    votes_censored: 1,
    votes_uncensored: 2,
    votes_bad_translation: 3,
    votes_good_translation: 4,
    votes_lost_in_translation: 5,
    votes_bad_result: 6,
    votes_nsfw: 7,
  };

  const voteHandler = voteCategory => {
    let votebtn = document.getElementById(voteCategory);
    votebtn.value = votebtn.value === metaKeyToId[voteCategory] ? '' : metaKeyToId[voteCategory];
    handleFilterChange();
  };

  const handleDateChange = event => {
    const { name, value } = event.target;

    if (name === 'start_date') {
      // Validate that start date is not after end date
      if (endDate && value && new Date(value) > new Date(endDate)) {
        // Clear end date if start date is after it
        setEndDate('');
        setActiveFilters(prev => ({ ...prev, startDate: value || null, endDate: null }));
      } else {
        setActiveFilters(prev => ({ ...prev, startDate: value || null }));
      }
      setStartDate(value);
    } else if (name === 'end_date') {
      // Validate that end date is not before start date
      if (startDate && value && new Date(value) < new Date(startDate)) {
        // Clear start date if end date is before it
        setStartDate('');
        setActiveFilters(prev => ({ ...prev, endDate: value || null, startDate: null }));
      } else {
        setActiveFilters(prev => ({ ...prev, endDate: value || null }));
      }
      setEndDate(value);
    }
  };

  const handleDateBlur = () => {
    // Trigger filter update when user finishes entering date
    setTimeout(() => handleFilterChange(), 0);
  };

  const handleFilterChange = event => {
    const form = document.getElementById('filter-options-form');
    if (!form) return;

    const formData = new FormData(form);
    const filterOptions = {
      vote_ids: [],
      years: [],
      search_locations: [],
      us_states: [],
      countries: [],
      start_date: '',
      end_date: '',
      page: 1,
      page_size: 10,
    };

    // Reset other dropdowns based on which one changed
    // IMPORTANT: search_location (cities) and geographic filters are mutually exclusive
    const countriesSelect = form.querySelector('select[name="countries"]');
    const citiesSelect = form.querySelector('select[name="cities"]');
    const usStatesSelect = form.querySelector('select[name="us_states"]');

    // Handle Country selection - clears search_location (cities)
    if (event && event.target && event.target.name === 'countries') {
      citiesSelect.value = ''; // Clear search_location - mutually exclusive
      if (usStatesSelect) {
        usStatesSelect.value = ''; // Reset US States dropdown only if it exists
      }

      if (countriesSelect.value) {
        filterOptions.countries = [countriesSelect.value];
        setSelectedCountry(countriesSelect.value);
        const country = countries.find(c => c.code === countriesSelect.value);
        setActiveFilters(prev => ({
          ...prev,
          country: country ? country.name : null,
          usState: null,
          source: null, // Clear search_location filter
        }));

        // If not US, clear states data
        if (countriesSelect.value !== 'US') {
          filterOptions.us_states = [];
        }
      } else {
        setSelectedCountry('');
        setActiveFilters(prev => ({ ...prev, country: null, usState: null }));
      }
    }
    // Handle search_location (cities) selection - clears ALL geographic filters
    else if (event && event.target && event.target.name === 'cities') {
      // Clear ALL geographic filters - mutually exclusive with search_location
      countriesSelect.value = '';
      if (usStatesSelect) {
        usStatesSelect.value = '';
      }
      setSelectedCountry('');

      if (citiesSelect.value) {
        // Only allow ONE search_location at a time
        filterOptions.search_locations = [citiesSelect.value];

        // Handle both old location mapping keys and direct search_location values
        const matchedLocation = searchLocations.find(loc => loc.value === citiesSelect.value);
        const sourceLabel = matchedLocation
          ? matchedLocation.label
          : locationMapping[citiesSelect.value] || formatLocationName(citiesSelect.value);
        setActiveFilters(prev => ({
          ...prev,
          source: sourceLabel,
          country: null, // Clear geographic filters
          usState: null  // Clear geographic filters
        }));
      } else {
        setActiveFilters(prev => ({ ...prev, source: null }));
      }
    }
    // Handle US State selection - clears search_location (cities)
    else if (event && event.target && event.target.name === 'us_states') {
      citiesSelect.value = ''; // Clear search_location - mutually exclusive

      if (usStatesSelect && usStatesSelect.value) {
        filterOptions.us_states = [usStatesSelect.value];
        filterOptions.countries = ['US']; // Ensure US is selected
        setActiveFilters(prev => ({
          ...prev,
          usState: usStatesSelect.value,
          source: null // Clear search_location filter
        }));
      } else {
        setActiveFilters(prev => ({ ...prev, usState: null }));
      }
    }

    // Get current values from all form fields if no specific event triggered this
    // Ensure search_location and geographic filters remain mutually exclusive
    if (!event || !event.target) {
      // Check if search_location (cities) is selected
      if (citiesSelect && citiesSelect.value) {
        // If search_location is selected, only use that (ignore geographic filters)
        filterOptions.search_locations = [citiesSelect.value];
        // Clear geographic filters to ensure mutual exclusivity
        filterOptions.countries = [];
        filterOptions.us_states = [];
      } else {
        // If no search_location, then geographic filters can be used
        if (countriesSelect && countriesSelect.value) {
          filterOptions.countries = [countriesSelect.value];
        }
        if (usStatesSelect && usStatesSelect.value) {
          filterOptions.us_states = [usStatesSelect.value];
        }
      }

      // Include current date values in filter options
      if (startDate) {
        filterOptions.start_date = startDate;
      }
      if (endDate) {
        filterOptions.end_date = endDate;
      }

      // Update active filters based on current form state
      const newActiveFilters = {
        country: null,
        usState: null,
        source: null,
        startDate: null,
        endDate: null,
      };
      if (countriesSelect && countriesSelect.value) {
        const country = countries.find(c => c.code === countriesSelect.value);
        newActiveFilters.country = country ? country.name : null;
      }
      if (citiesSelect && citiesSelect.value) {
        // Handle both old location mapping keys and direct search_location values
        const matchedLocation = searchLocations.find(loc => loc.value === citiesSelect.value);
        newActiveFilters.source = matchedLocation
          ? matchedLocation.label
          : locationMapping[citiesSelect.value] || formatLocationName(citiesSelect.value);
      }
      if (usStatesSelect && usStatesSelect.value) {
        newActiveFilters.usState = usStatesSelect.value;
      }
      // Include current date values in active filters
      newActiveFilters.startDate = startDate || null;
      newActiveFilters.endDate = endDate || null;
      setActiveFilters(newActiveFilters);
    }

    // Get date values from state
    if (startDate) {
      filterOptions.start_date = startDate;
    }

    if (endDate) {
      filterOptions.end_date = endDate;
    }

    // Get vote values
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('votes') && value) {
        filterOptions.vote_ids.push(value);
      }
    }

    // Pass false as second argument to prevent closing
    onUpdate(filterOptions, false);
  };

  const handleReset = () => {
    const form = document.getElementById('filter-options-form');
    form.reset();

    setShouldResetVotes(true);
    setSelectedCountry(''); // Reset selected country
    setStartDate(''); // Reset start date
    setEndDate(''); // Reset end date
    setActiveFilters({
      country: null,
      usState: null,
      source: null,
      startDate: null,
      endDate: null,
    }); // Reset active filters
    setTimeout(() => {
      setShouldResetVotes(false);
      // Pass false as second argument to prevent closing
      onUpdate(
        {
          vote_ids: [],
          years: [],
          search_locations: [],
          us_states: [],
          countries: [],
          start_date: '',
          end_date: '',
          page: 1,
          page_size: 10,
        },
        false,
        true
      );
    }, 100);
  };

  return (
    <div
      className={`
      mx-auto w-full max-w-[720px] bg-white border border-red-600 rounded-md overflow-hidden transition-all duration-300 ease-in-out
      ${isOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 border-0'}
    `}
    >
      <div className="p-4">
        {/* Active Filters Section */}
        {(activeFilters.country ||
          activeFilters.source ||
          activeFilters.usState ||
          activeFilters.startDate ||
          activeFilters.endDate) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-semibold mb-2">
              {uiStrings.filterActiveFiltersLabel || 'Active Filters:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.country && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  {uiStrings.filterBadgeCountry || 'Country:'} {activeFilters.country}
                  <button
                    onClick={() => {
                      const countriesSelect = document.querySelector('select[name="countries"]');
                      if (countriesSelect) {
                        countriesSelect.value = '';
                        handleFilterChange({ target: { name: 'countries', value: '' } });
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeFilters.usState && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  {uiStrings.filterBadgeState || 'State:'} {activeFilters.usState}
                  <button
                    onClick={() => {
                      const usStatesSelect = document.querySelector('select[name="us_states"]');
                      if (usStatesSelect) {
                        usStatesSelect.value = '';
                        handleFilterChange({ target: { name: 'us_states', value: '' } });
                      }
                    }}
                    className="text-green-600 hover:text-green-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeFilters.source && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  {uiStrings.filterBadgeSource || 'Source:'} {activeFilters.source}
                  <button
                    onClick={() => {
                      const citiesSelect = document.querySelector('select[name="cities"]');
                      if (citiesSelect) {
                        citiesSelect.value = '';
                        handleFilterChange({ target: { name: 'cities', value: '' } });
                      }
                    }}
                    className="text-purple-600 hover:text-purple-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeFilters.startDate && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  {uiStrings.filterBadgeStartDate || 'Start:'} {activeFilters.startDate}
                  <button
                    onClick={() => {
                      setStartDate('');
                      setActiveFilters(prev => ({ ...prev, startDate: null }));
                      setTimeout(() => handleFilterChange(), 0);
                    }}
                    className="text-orange-600 hover:text-orange-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeFilters.endDate && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  {uiStrings.filterBadgeEndDate || 'End:'} {activeFilters.endDate}
                  <button
                    onClick={() => {
                      setEndDate('');
                      setActiveFilters(prev => ({ ...prev, endDate: null }));
                      setTimeout(() => handleFilterChange(), 0);
                    }}
                    className="text-orange-600 hover:text-orange-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        <form id="filter-options-form" className="grow flex flex-col text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Country and US States Section */}
            <div className="flex flex-col">
              <label
                htmlFor="countries"
                className="text-lg font-black mb-2 flex items-center gap-2"
              >
                {uiStrings.filterCountryLabel || 'Country'}
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-normal">
                  {uiStrings.filterPrimaryLabel || 'Primary'}
                </span>
              </label>
              <select
                name="countries"
                className="w-full border border-zinc-400 rounded p-2"
                onChange={e => handleFilterChange(e)}
                disabled={isLoading}
              >
                <option value="">{uiStrings.filterAllCountries || 'All Countries'}</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.search_count})
                  </option>
                ))}
              </select>

              {/* US States Section - Slides down when US is selected */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  selectedCountry === 'US' ? 'max-h-40 mt-3' : 'max-h-0'
                }`}
              >
                <div className="bg-blue-50/30 p-3 rounded border-l-4 border-blue-200">
                  <label
                    htmlFor="us_states"
                    className="text-lg font-black mb-2 flex items-center gap-2"
                  >
                    <span className="text-blue-600">↳</span> {uiStrings.filterStateLabel || 'US State'}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-normal">
                      {uiStrings.filterSecondaryLabel || 'Secondary'}
                    </span>
                  </label>
                  <select
                    name="us_states"
                    className="w-full border border-zinc-400 rounded p-2"
                    onChange={e => handleFilterChange(e)}
                    disabled={isLoading || loadingStates}
                  >
                    <option value="">{uiStrings.filterAllStates || 'All States'}</option>
                    {usStatesData.map(stateData => (
                      <option key={stateData.state} value={stateData.state}>
                        {stateData.state} ({stateData.search_count})
                      </option>
                    ))}
                  </select>
                  {loadingStates && (
                    <div className="text-xs text-gray-500 mt-1">
                      {uiStrings.filterLoadingStatesText || 'Loading states...'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sources Section */}
            <div className="flex flex-col">
              <label htmlFor="cities" className="text-lg font-black mb-2">
                {uiStrings.filterSourceLabel || 'Search Source'}
              </label>
              <select
                name="cities"
                className="w-full border border-zinc-400 rounded p-2"
                onChange={e => handleFilterChange(e)}
                disabled={isLoading}
              >
                <option value="">{uiStrings.filterAllSources || 'All Sources'}</option>
                {searchLocations.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label} ({location.search_count})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Section */}
            <div className="flex flex-col">
              <label htmlFor="start_date" className="text-lg font-black mb-2">
                {uiStrings.filterStartDateLabel || 'Start Date'}
              </label>
              <input
                type="date"
                name="start_date"
                className="w-full border border-zinc-400 rounded p-2"
                onChange={handleDateChange}
                onBlur={handleDateBlur}
                value={startDate}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end_date" className="text-lg font-black mb-2">
                {uiStrings.filterEndDateLabel || 'End Date'}
              </label>
              <input
                type="date"
                name="end_date"
                className="w-full border border-zinc-400 rounded p-2"
                onChange={handleDateChange}
                onBlur={handleDateBlur}
                value={endDate}
                disabled={isLoading}
              />
            </div>

            {/* Vote Results Section */}
            <div className="border-t border-gray-200 pt-3 hidden">
              <label htmlFor="vote" className="text-lg font-black block mb-3">
                Vote Result
              </label>
              <div className="flex gap-2 flex-wrap mb-4">
                {vote_categories.map((category, index) => (
                  <VoteButton
                    key={index}
                    voteCategory={category}
                    voteHandler={voteHandler}
                    isDisabled={false}
                    setDisabled={() => {}}
                    shouldReset={shouldResetVotes}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Close/Clear buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {(activeFilters.country ||
                activeFilters.source ||
                activeFilters.usState ||
                activeFilters.startDate ||
                activeFilters.endDate) && (
                <span className="text-sm text-gray-600">
                  {Object.values(activeFilters).filter(Boolean).length}{' '}
                  {uiStrings.filterCountActiveText || 'filter(s) active'}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {uiStrings.filterClearAllButton || 'Clear All'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilterControls;
