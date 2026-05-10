import React, { useState, useEffect } from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import VoteButton from './VoteButton';
import FilterChip from './FilterChip';
import { formatLocationName } from '../utils/stringUtils';
import { useLanguage } from '../context/LanguageContext';

const CURRENT_YEAR = new Date().getFullYear();
const FALLBACK_YEARS = Array.from({ length: CURRENT_YEAR - 2014 }, (_, i) => ({
  year: CURRENT_YEAR - i,
  search_count: null,
}));

const metaKeyToId = {
  votes_censored: 1,
  votes_uncensored: 2,
  votes_bad_translation: 3,
  votes_good_translation: 4,
  votes_lost_in_translation: 5,
};

const CENSORSHIP_VOTES = ['votes_censored', 'votes_uncensored', 'votes_lost_in_translation'];
const TRANSLATION_VOTES = ['votes_bad_translation', 'votes_good_translation'];

function FilterControls({ filters, onChange, isLoading }) {
  const { language } = useLanguage();
  const [countries, setCountries] = useState([]);
  const [searchLocations, setSearchLocations] = useState([]);
  const [usStatesData, setUsStatesData] = useState([]);
  const [years, setYears] = useState(FALLBACK_YEARS);
  const [loadingStates, setLoadingStates] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const whereTab = filters.where || 'places';
  const tabIndex = whereTab === 'events' ? 1 : 0;

  useEffect(() => {
    async function fetchCountries() {
      try {
        const r = await fetch('/api/analytics/countries');
        if (!r.ok) return;
        const data = await r.json();
        setCountries(
          data
            .filter(c => c.code && c.name)
            .sort((a, b) => b.search_count - a.search_count)
        );
      } catch {}
    }

    async function fetchLocations() {
      try {
        const r = await fetch('/searches/search-locations');
        if (!r.ok) return;
        const data = await r.json();
        setSearchLocations(
          data
            .filter(
              l =>
                l.search_location &&
                l.search_location !== 'automated_scraper' &&
                l.search_location !== 'nyc3'
            )
            .map(l => ({
              value: l.search_location,
              label: formatLocationName(l.search_location),
              search_count: l.search_count,
            }))
            .sort((a, b) => b.search_count - a.search_count)
        );
      } catch {}
    }

    async function fetchYears() {
      try {
        const r = await fetch('/api/analytics/years');
        if (!r.ok) return;
        const data = await r.json();
        if (data.length) setYears(data);
      } catch {}
    }

    fetchCountries();
    fetchLocations();
    fetchYears();
  }, []);

  useEffect(() => {
    if (!filters.countries.includes('US')) {
      setUsStatesData([]);
      return;
    }
    async function fetchUSStates() {
      setLoadingStates(true);
      try {
        const r = await fetch('/api/analytics/us-states');
        if (r.ok) setUsStatesData(await r.json());
      } catch {}
      finally { setLoadingStates(false); }
    }
    fetchUSStates();
  }, [filters.countries]);

  function handleTabChange(index) {
    if (index === 0) {
      onChange({ ...filters, where: 'places', search_locations: [] });
    } else {
      onChange({ ...filters, where: 'events', countries: [], us_states: [], years: [] });
    }
  }

  function toggleCountry(code) {
    const next = filters.countries.includes(code)
      ? filters.countries.filter(c => c !== code)
      : [...filters.countries, code];
    const nextStates = next.includes('US') ? filters.us_states : [];
    onChange({ ...filters, countries: next, us_states: nextStates });
  }

  function toggleUsState(state) {
    const next = filters.us_states.includes(state)
      ? filters.us_states.filter(s => s !== state)
      : [...filters.us_states, state];
    onChange({ ...filters, us_states: next });
  }

  function toggleLocation(value) {
    const next = filters.search_locations.includes(value)
      ? filters.search_locations.filter(l => l !== value)
      : [...filters.search_locations, value];
    onChange({ ...filters, search_locations: next });
  }

  function toggleYear(year) {
    const y = String(year);
    const next = filters.years.includes(y)
      ? filters.years.filter(v => v !== y)
      : [...filters.years, y];
    onChange({ ...filters, years: next });
  }

  function toggleVote(metaKey) {
    const id = metaKeyToId[metaKey];
    const next = filters.vote_ids.includes(id)
      ? filters.vote_ids.filter(v => v !== id)
      : [...filters.vote_ids, id];
    onChange({ ...filters, vote_ids: next });
  }

  const visibleCountries = showAllCountries ? countries : countries.slice(0, 5);
  const visibleLocations = showAllLocations ? searchLocations : searchLocations.slice(0, 5);

  const VOTE_ID_TO_LABEL = {
    1: 'Censored', 2: 'Uncensored', 3: 'Bad Translation',
    4: 'Good Translation', 5: 'Lost in Translation',
  };

  const draftChips = [
    ...filters.countries.map(code => ({
      key: `countries:${code}`, label: code,
      onRemove: () => onChange({ ...filters, countries: filters.countries.filter(c => c !== code), us_states: code === 'US' ? [] : filters.us_states }),
    })),
    ...filters.us_states.map(s => ({
      key: `us_states:${s}`, label: s,
      onRemove: () => onChange({ ...filters, us_states: filters.us_states.filter(v => v !== s) }),
    })),
    ...filters.search_locations.map(loc => ({
      key: `search_locations:${loc}`, label: formatLocationName(loc),
      onRemove: () => onChange({ ...filters, search_locations: filters.search_locations.filter(v => v !== loc) }),
    })),
    ...filters.years.map(y => ({
      key: `years:${y}`, label: y,
      onRemove: () => onChange({ ...filters, years: filters.years.filter(v => v !== y) }),
    })),
    ...filters.vote_ids.map(id => ({
      key: `vote_ids:${id}`, label: VOTE_ID_TO_LABEL[id] || `Vote ${id}`,
      onRemove: () => onChange({ ...filters, vote_ids: filters.vote_ids.filter(v => v !== id) }),
    })),
  ];

  return (
    <div className="p-4 text-black">

      {/* Active chips inside modal */}
      {draftChips.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Active</div>
          <div className="flex flex-wrap gap-2">
            {draftChips.map(chip => (
              <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
          </div>
        </div>
      )}

      {/* WHERE */}
      <div className="mb-5">
        <div className="text-lg font-black mb-3">Where</div>
        <TabGroup selectedIndex={tabIndex} onChange={handleTabChange}>
          <TabList className="flex gap-2 border-b border-gray-200 mb-3">
            {['All places', 'Live events'].map(label => (
              <Tab
                key={label}
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none ${
                    selected
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {/* All places */}
            <TabPanel>
              <div className="space-y-1 mb-3">
                {visibleCountries.map(c => (
                  <label key={c.code} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      className="accent-red-600"
                      checked={filters.countries.includes(c.code)}
                      onChange={() => toggleCountry(c.code)}
                      disabled={isLoading}
                    />
                    <span className="text-sm flex-1">{c.name}</span>
                    {c.search_count != null && (
                      <span className="text-xs text-gray-400">{c.search_count.toLocaleString()}</span>
                    )}
                  </label>
                ))}
                {countries.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCountries(v => !v)}
                    className="text-xs text-red-600 hover:underline mt-1"
                  >
                    {showAllCountries ? 'Show less' : `Show all ${countries.length}`}
                  </button>
                )}
              </div>

              {/* US States sub-list */}
              {filters.countries.includes('US') && (
                <div className="pl-4 border-l-2 border-blue-200 mb-3">
                  <div className="text-sm font-semibold mb-2 text-blue-600">↳ US State</div>
                  {loadingStates ? (
                    <span className="text-xs text-gray-400">Loading states…</span>
                  ) : (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {usStatesData.map(s => (
                        <label key={s.state} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            className="accent-red-600"
                            checked={filters.us_states.includes(s.state)}
                            onChange={() => toggleUsState(s.state)}
                            disabled={isLoading}
                          />
                          <span className="text-sm flex-1">{s.state}</span>
                          <span className="text-xs text-gray-400">{s.search_count?.toLocaleString()}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabPanel>

            {/* Live events */}
            <TabPanel>
              <div className="space-y-1">
                {visibleLocations.map(loc => (
                  <label key={loc.value} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      className="accent-red-600"
                      checked={filters.search_locations.includes(loc.value)}
                      onChange={() => toggleLocation(loc.value)}
                      disabled={isLoading}
                    />
                    <span className="text-sm flex-1">{loc.label}</span>
                    {loc.search_count != null && (
                      <span className="text-xs text-gray-400">{loc.search_count.toLocaleString()}</span>
                    )}
                  </label>
                ))}
                {searchLocations.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllLocations(v => !v)}
                    className="text-xs text-red-600 hover:underline mt-1"
                  >
                    {showAllLocations ? 'Show less' : `Show all ${searchLocations.length}`}
                  </button>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* WHEN — only in All places mode */}
      {whereTab === 'places' && (
        <div className="mb-5 border-t border-gray-200 pt-4">
          <div className="text-lg font-black mb-3">When</div>
          <div className="flex flex-wrap gap-2">
            {years.map(({ year, search_count }) => {
              const y = String(year);
              const active = filters.years.includes(y);
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => toggleYear(year)}
                  disabled={isLoading}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    active
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                  }`}
                >
                  {year}
                  {search_count != null && (
                    <span className="ml-1 text-xs opacity-70">({search_count.toLocaleString()})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VOTE */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-lg font-black mb-3">Vote</div>

        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Censorship</div>
          <div className="flex gap-2 flex-wrap">
            {CENSORSHIP_VOTES.map(metaKey => (
              <VoteButton
                key={metaKey}
                voteCategory={metaKey}
                voteHandler={toggleVote}
                toggle
                isSelected={filters.vote_ids.includes(metaKeyToId[metaKey])}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Translation Quality</div>
          <div className="flex gap-2 flex-wrap">
            {TRANSLATION_VOTES.map(metaKey => (
              <VoteButton
                key={metaKey}
                voteCategory={metaKey}
                voteHandler={toggleVote}
                toggle
                isSelected={filters.vote_ids.includes(metaKeyToId[metaKey])}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterControls;
