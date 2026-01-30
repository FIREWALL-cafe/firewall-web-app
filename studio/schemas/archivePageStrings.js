import {defineType} from 'sanity'

export default defineType({
  name: 'archivePageStrings',
  title: 'Archive Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'archiveInputPlaceholder',
      title: 'Archive Input - Placeholder Text',
      type: 'localeString',
      description: 'Placeholder text for the archive search input field',
    },
    {
      name: 'archiveButton',
      title: 'Archive Input - Archive Button',
      type: 'localeString',
      description: 'Text for the Archive tab/button',
    },
    {
      name: 'archiveModeTooltip',
      title: 'Archive Mode - Tooltip Content',
      type: 'localeText',
      description:
        'Tooltip text explaining archive mode functionality (HTML formatting done in code)',
    },
    {
      name: 'queryListHeaderVotes',
      title: 'Query List - Votes Column Header',
      type: 'localeString',
      description: 'Column header for votes count',
    },
    {
      name: 'queryListHeaderQueryEn',
      title: 'Query List - English Query Column Header',
      type: 'localeString',
      description: 'Column header for English query text',
    },
    {
      name: 'queryListHeaderQueryZh',
      title: 'Query List - Chinese Query Column Header',
      type: 'localeString',
      description: 'Column header for Chinese query text',
    },
    {
      name: 'queryListHeaderLocation',
      title: 'Query List - Location Column Header',
      type: 'localeString',
      description: 'Column header for search location',
    },
    {
      name: 'queryListHeaderDate',
      title: 'Query List - Date Column Header',
      type: 'localeString',
      description: 'Column header for search date',
    },
    {
      name: 'queryListTotalResults',
      title: 'Query List - Total Results Text',
      type: 'localeString',
      description: 'Label for total results count (supports {count} placeholder)',
    },
    {
      name: 'queryListNoResults',
      title: 'Query List - No Results Message',
      type: 'localeString',
      description: 'Message displayed when no search results found',
    },
    {
      name: 'queryListLoadingText',
      title: 'Query List - Loading Text',
      type: 'localeString',
      description: 'Text displayed while loading query results',
    },
    {
      name: 'queryListLoadMoreButton',
      title: 'Query List - Load More Button',
      type: 'localeString',
      description: 'Text for the "Load More" button',
    },
    {
      name: 'archiveFiltersButton',
      title: 'Archive - Filters Button',
      type: 'localeString',
      description: 'Text for the Filters button in archive mode',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Archive Page',
        subtitle: 'Manage archive page UI text (13 fields)',
      }
    },
  },
})
