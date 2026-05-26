import React, { useState, useEffect } from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import VoteButton from './VoteButton';
import FilterChip from './FilterChip';
import { formatLocationName } from '../utils/stringUtils';
import ArrowDown from '../assets/icons/keyboard_arrow_down.svg';
import ArrowUp from '../assets/icons/keyboard_arrow_up.svg';

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
  const [countries, setCountries] = useState([]);
  const [searchLocations, setSearchLocations] = useState([]);
  const [usStatesData, setUsStatesData] = useState([]);
  const [years, setYears] = useState(FALLBACK_YEARS);
  const [loadingStates, setLoadingStates] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);

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
            .sort((a, b) => Number(b.search_count) - Number(a.search_count))
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
              year: l.year,
            }))
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
        if (r.ok) {
          const data = await r.json();
          setUsStatesData(data.sort((a, b) => Number(b.search_count) - Number(a.search_count)));
        }
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

  const visibleCountries = showAllCountries ? countries : countries.slice(0, 3);
  const visibleLocations = showAllLocations ? searchLocations : searchLocations.slice(0, 3);

  const VOTE_ID_TO_LABEL = {
    1: 'Censored', 2: 'Uncensored', 3: 'Bad Translation',
    4: 'Good Translation', 5: 'Lost in Translation',
  };

  const countryNameMap = Object.fromEntries(countries.map(c => [c.code, c.name]));

  const draftChips = [
    ...filters.countries.map(code => ({
      key: `countries:${code}`, label: countryNameMap[code] || code,
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

  const COMPACT_VOTE_LABELS = {
    votes_uncensored: 'Not Censored',
  };

  return (
    <div className="px-8 py-3 text-black flex flex-col gap-6">

      {/* Active chips inside modal */}
      {draftChips.length > 0 && (
        <div>
          <div className="font-bitmap-song font-header-02 mb-2">Active</div>
          <div className="flex flex-wrap gap-2">
            {draftChips.map(chip => (
              <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
          </div>
        </div>
      )}

      {/* WHERE */}
      <div className="flex flex-col gap-3">
        <div className="font-bitmap-song font-header-02">Where</div>
        <TabGroup selectedIndex={tabIndex} onChange={handleTabChange}>
          <TabList className="flex bg-[#fbfbfc] border border-[#b9c0c7] rounded h-12 mb-4">
            {['All places', 'Live events'].map(label => (
              <Tab
                key={label}
                className={({ selected }) =>
                  `flex-1 flex items-center justify-center text-[17px] font-medium rounded transition-colors focus:outline-none ${
                    selected
                      ? 'bg-[#eff2f5] border border-black text-black'
                      : 'text-[#484e55] hover:text-black'
                  }`
                }
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="w-full">
            {/* All places */}
            <TabPanel className="w-full">
              <div className="flex flex-col gap-1 mb-3">
                {visibleCountries.map(c => (
                  <React.Fragment key={c.code}>
                    <label className="flex items-center justify-between cursor-pointer py-0.5">
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 border rounded flex items-center justify-center shrink-0 ${filters.countries.includes(c.code) ? 'bg-[#eff2f5] border-black' : 'border-[#8d969e]'}`}>
                          {filters.countries.includes(c.code) && (
                            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={filters.countries.includes(c.code)}
                          onChange={() => toggleCountry(c.code)}
                          disabled={isLoading}
                        />
                        <span className="text-[17px] leading-[1.5]">{c.name}</span>
                      </div>
                      {c.search_count != null && (
                        <span className="text-[17px] text-black">{c.search_count.toLocaleString()}</span>
                      )}
                    </label>

                    {/* US States inline, directly under United States */}
                    {c.code === 'US' && filters.countries.includes('US') && (
                      <div className="pl-10 flex flex-col gap-1 mb-1">
                        {loadingStates ? (
                          <span className="text-sm text-gray-400">Loading states…</span>
                        ) : (
                          <>
                            {(showAllStates ? usStatesData : usStatesData.slice(0, 3)).map(s => (
                              <label key={s.state} className="flex items-center justify-between cursor-pointer py-0.5">
                                <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 border rounded flex items-center justify-center shrink-0 ${filters.us_states.includes(s.state) ? 'bg-[#eff2f5] border-black' : 'border-[#8d969e]'}`}>
                                    {filters.us_states.includes(s.state) && (
                                      <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={filters.us_states.includes(s.state)}
                                    onChange={() => toggleUsState(s.state)}
                                    disabled={isLoading}
                                  />
                                  <span className="text-[17px] leading-[1.5]">{s.state}</span>
                                </div>
                                <span className="text-[17px] text-black">{s.search_count?.toLocaleString()}</span>
                              </label>
                            ))}
                            {usStatesData.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setShowAllStates(v => !v)}
                                className="flex items-center gap-1 text-[#2e3238] text-[17px] mt-1 self-start"
                              >
                                {showAllStates ? 'Show less' : 'Show All'}
                                <img src={showAllStates ? ArrowUp : ArrowDown} className="w-6 h-6" alt="" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {countries.length > 3 && (
                <div className="flex justify-center pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAllCountries(v => !v)}
                    className="flex items-center gap-1 text-[#2e3238] text-[20px]"
                  >
                    {showAllCountries ? 'Show less' : 'Show All'}
                    <img src={showAllCountries ? ArrowUp : ArrowDown} className="w-6 h-6" alt="" />
                  </button>
                </div>
              )}
            </TabPanel>

            {/* Live events */}
            <TabPanel className="w-full">
              <div className="flex flex-col gap-1 mb-3">
                {visibleLocations.map(loc => (
                  <label key={loc.value} className="flex items-center justify-between cursor-pointer py-0.5">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 border rounded flex items-center justify-center shrink-0 ${filters.search_locations.includes(loc.value) ? 'bg-[#eff2f5] border-black' : 'border-[#8d969e]'}`}>
                        {filters.search_locations.includes(loc.value) && (
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={filters.search_locations.includes(loc.value)}
                        onChange={() => toggleLocation(loc.value)}
                        disabled={isLoading}
                      />
                      <span className="text-[17px] leading-[1.5]">
                        {loc.label}
                        {loc.year && <span className="text-[#8d969e]"> ({loc.year})</span>}
                      </span>
                    </div>
                    {loc.search_count != null && (
                      <span className="text-[17px] text-black">{loc.search_count.toLocaleString()}</span>
                    )}
                  </label>
                ))}
              </div>
              {searchLocations.length > 3 && (
                <div className="flex justify-center pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAllLocations(v => !v)}
                    className="flex items-center gap-1 text-[#2e3238] text-[20px]"
                  >
                    {showAllLocations ? 'Show less' : 'Show All'}
                    <img src={showAllLocations ? ArrowUp : ArrowDown} className="w-6 h-6" alt="" />
                  </button>
                </div>
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* WHEN — only in All places mode */}
      {whereTab === 'places' && (
        <div className="border-t border-[#b9c0c7] pt-6 flex flex-col gap-3">
          <div className="font-bitmap-song font-header-02">When</div>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {years.map(({ year }) => {
                const y = String(year);
                const active = filters.years.includes(y);
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleYear(year)}
                    disabled={isLoading}
                    className={`h-8 px-3 border rounded shrink-0 text-[17px] leading-[1.5] transition-colors ${
                      active
                        ? 'bg-[#eff2f5] text-black border-black'
                        : 'bg-white text-[#2e3238] border-[#b9c0c7] hover:border-black'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      )}

      {/* CENSORSHIP */}
      <div className="border-t border-[#b9c0c7] pt-6 flex flex-col gap-3">
        <div className="font-bitmap-song font-header-02">Censorship</div>
        <div className="flex flex-wrap gap-3">
          {CENSORSHIP_VOTES.map(metaKey => (
            <VoteButton
              key={metaKey}
              voteCategory={metaKey}
              nameOverride={COMPACT_VOTE_LABELS[metaKey]}
              voteHandler={toggleVote}
              toggle
              compact
              isSelected={filters.vote_ids.includes(metaKeyToId[metaKey])}
            />
          ))}
        </div>
      </div>

      {/* TRANSLATION QUALITY */}
      <div className="border-t border-[#b9c0c7] pt-6 flex flex-col gap-3">
        <div className="font-bitmap-song font-header-02">Translation Quality</div>
        <div className="flex flex-wrap gap-3">
          {TRANSLATION_VOTES.map(metaKey => (
            <VoteButton
              key={metaKey}
              voteCategory={metaKey}
              nameOverride={COMPACT_VOTE_LABELS[metaKey]}
              voteHandler={toggleVote}
              toggle
              compact
              isSelected={filters.vote_ids.includes(metaKeyToId[metaKey])}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default FilterControls;
