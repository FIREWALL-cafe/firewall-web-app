import {defineType} from 'sanity'

export default defineType({
  name: 'filterStrings',
  title: 'Filter Component',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'filterButton',
      title: 'Filter Controls - Filter Button',
      type: 'localeString',
      description: 'Text for the Filter toggle button',
    },
    {
      name: 'filterCountryLabel',
      title: 'Filter Controls - Country Label',
      type: 'localeString',
      description: 'Label for the country filter dropdown',
    },
    {
      name: 'filterAllCountries',
      title: 'Filter Controls - All Countries Option',
      type: 'localeString',
      description: 'Option text for "All Countries" in dropdown',
    },
    {
      name: 'filterStateLabel',
      title: 'Filter Controls - US State Label',
      type: 'localeString',
      description: 'Label for the US state filter dropdown',
    },
    {
      name: 'filterAllStates',
      title: 'Filter Controls - All States Option',
      type: 'localeString',
      description: 'Option text for "All States" in dropdown',
    },
    {
      name: 'filterSourceLabel',
      title: 'Filter Controls - Search Source Label',
      type: 'localeString',
      description: 'Label for the search source/engine filter',
    },
    {
      name: 'filterAllSources',
      title: 'Filter Controls - All Sources Option',
      type: 'localeString',
      description: 'Option text for "All Sources" in dropdown',
    },
    {
      name: 'filterStartDateLabel',
      title: 'Filter Controls - Start Date Label',
      type: 'localeString',
      description: 'Label for the start date picker',
    },
    {
      name: 'filterEndDateLabel',
      title: 'Filter Controls - End Date Label',
      type: 'localeString',
      description: 'Label for the end date picker',
    },
    {
      name: 'filterActiveFiltersLabel',
      title: 'Filter Controls - Active Filters Label',
      type: 'localeString',
      description: 'Label for the active filters section (e.g., "Active Filters:")',
    },
    {
      name: 'filterClearAllButton',
      title: 'Filter Controls - Clear All Button',
      type: 'localeString',
      description: 'Text for the "Clear All" filters button',
    },
    {
      name: 'filterBadgeCountry',
      title: 'Filter Controls - Country Badge Prefix',
      type: 'localeString',
      description: 'Prefix for country filter badge (e.g., "Country:")',
    },
    {
      name: 'filterBadgeState',
      title: 'Filter Controls - State Badge Prefix',
      type: 'localeString',
      description: 'Prefix for state filter badge (e.g., "State:")',
    },
    {
      name: 'filterBadgeSource',
      title: 'Filter Controls - Source Badge Prefix',
      type: 'localeString',
      description: 'Prefix for source filter badge (e.g., "Source:")',
    },
    {
      name: 'filterBadgeStartDate',
      title: 'Filter Controls - Start Date Badge Prefix',
      type: 'localeString',
      description: 'Prefix for start date filter badge (e.g., "Start:")',
    },
    {
      name: 'filterBadgeEndDate',
      title: 'Filter Controls - End Date Badge Prefix',
      type: 'localeString',
      description: 'Prefix for end date filter badge (e.g., "End:")',
    },
    {
      name: 'filterCountActiveText',
      title: 'Filter Controls - Count Active Text',
      type: 'localeString',
      description: 'Text showing number of active filters (supports {count} and {s} placeholders)',
    },
    {
      name: 'filterPrimaryLabel',
      title: 'Filter Controls - Primary Badge Label',
      type: 'localeString',
      description: 'Badge label for primary filters',
    },
    {
      name: 'filterSecondaryLabel',
      title: 'Filter Controls - Secondary Badge Label',
      type: 'localeString',
      description: 'Badge label for secondary filters',
    },
    {
      name: 'filterLoadingStatesText',
      title: 'Filter Controls - Loading States Text',
      type: 'localeString',
      description: 'Text displayed while loading US states data',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Filter Component',
        subtitle: 'Manage filter controls UI text (20 fields)',
      }
    },
  },
})
