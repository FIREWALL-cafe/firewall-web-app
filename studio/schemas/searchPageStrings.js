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
      title: 'Search Page - Session Heading',
      type: 'localeString',
      description: 'Main heading text for the search page (e.g., "Search Session")',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Search Page',
        subtitle: 'Manage search page UI text (11 fields)',
      }
    },
  },
})
