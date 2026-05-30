import {defineType} from 'sanity'

export default defineType({
  name: 'searchPageStrings',
  title: 'Search Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'searchInputPlaceholder',
      title: 'Search Input - Placeholder Text',
      type: 'localeString',
      description: 'Placeholder text for the main search input field',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'searchButton',
      title: 'Search Input - Search Button',
      type: 'localeString',
      description: 'Text for the Search button',
    },
    {
      name: 'compareButton',
      title: 'Search Input - Compare Tab Label',
      type: 'localeString',
      description: 'Label for the Compare tab (short, shown on mobile)',
    },
    {
      name: 'searchComparisonLink',
      title: 'Search Input - Search Comparison Tab Label',
      type: 'localeString',
      description: 'Label for the Compare tab (long, shown on desktop)',
    },
    {
      name: 'searchModeTooltip',
      title: 'Search Mode - Tooltip Content',
      type: 'localeText',
      description:
        'Tooltip text explaining search mode functionality (HTML formatting done in code)',
    },
    {
      name: 'searchErrorEmptyQuery',
      title: 'Search Input - Empty Query Error',
      type: 'localeString',
      description: 'Error message when search submitted with empty query',
    },
    {
      name: 'searchErrorNetwork',
      title: 'Search Input - Network Error',
      type: 'localeString',
      description: 'Error message when network request fails',
    },
    {
      name: 'searchErrorGeneric',
      title: 'Search Input - Generic Error',
      type: 'localeString',
      description: 'Generic error message for unknown errors',
    },
    {
      name: 'searchLoadingText',
      title: 'Search Input - Loading Text',
      type: 'localeString',
      description: 'Text displayed while search is processing',
    },
    {
      name: 'translatingText',
      title: 'Search Input - Translating Text',
      type: 'localeString',
      description: 'Text displayed while translation is in progress',
    },
    {
      name: 'translationLabel',
      title: 'Search Input - Translation Label',
      type: 'localeString',
      description: 'Label prefix for displaying translation results',
    },
    {
      name: 'errorLabel',
      title: 'Search Input - Error Label',
      type: 'localeString',
      description: 'Label prefix for displaying error messages',
    },
    {
      name: 'searchSessionHeading',
      title: 'Search Page - Heading (English)',
      type: 'localeString',
      description: 'Main heading for the search page — always displayed in English (e.g., "Search Session")',
    },
    {
      name: 'searchHeadingZh',
      title: 'Search Page - Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese subtitle shown below the English heading — always displayed regardless of language toggle (e.g., "搜索结果")',
    },
    {
      name: 'progressTranslatingCaption',
      title: 'Progress Bar - Step 1 (Translating)',
      type: 'localeString',
      description: 'First caption shown under the search progress bar (e.g., "Translating...").',
    },
    {
      name: 'progressSearchingGoogleCaption',
      title: 'Progress Bar - Step 2 (Searching Google)',
      type: 'localeString',
      description: 'Second caption shown under the search progress bar (e.g., "Searching Google...").',
    },
    {
      name: 'progressSearchingBaiduCaption',
      title: 'Progress Bar - Step 3 (Searching Baidu)',
      type: 'localeString',
      description: 'Third caption shown under the search progress bar (e.g., "Searching Baidu...").',
    },
    {
      name: 'progressFillerCaptions',
      title: 'Progress Bar - Filler Captions',
      type: 'array',
      of: [{type: 'localeString'}],
      description:
        'Random rotating captions shown after the first three steps while the search continues. Cycles every 2.5s.',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Search Page',
        subtitle: 'Manage search page UI text (17 fields)',
      }
    },
  },
})
