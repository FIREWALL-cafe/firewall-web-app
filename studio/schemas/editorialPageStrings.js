import {defineType} from 'sanity'

export default defineType({
  name: 'editorialPageStrings',
  title: 'Editorial Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'editorialPageHeading',
      title: 'Editorial Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Editorial/Commentary page',
    },
    {
      name: 'editorialPageHeadingZh',
      title: 'Editorial Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Editorial page heading',
    },
    {
      name: 'editorialIntroText',
      title: 'Editorial Page - Introduction Text',
      type: 'localeText',
      description: 'Introduction text for the Editorial page',
    },
    {
      name: 'editorialReadMoreButton',
      title: 'Editorial Page - Read More Button',
      type: 'localeString',
      description: 'Text for "Read More" button on article cards',
    },
    {
      name: 'editorialListenButton',
      title: 'Editorial Page - Listen Button',
      type: 'localeString',
      description: 'Text for "Listen" button on article cards (if audio available)',
    },
    {
      name: 'editorialFilterLabel',
      title: 'Editorial Page - Filter Label',
      type: 'localeString',
      description: 'Label for filter/sort controls',
    },
    {
      name: 'editorialSortLabel',
      title: 'Editorial Page - Sort Label',
      type: 'localeString',
      description: 'Label for sort dropdown',
    },
    {
      name: 'editorialNoArticlesMessage',
      title: 'Editorial Page - No Articles Message',
      type: 'localeString',
      description: 'Message displayed when no articles are available',
    },
    {
      name: 'editorialFeaturedLabel',
      title: 'Editorial Page - Featured Label',
      type: 'localeString',
      description: 'Label text for the featured article section (e.g., "Featured" / "精选")',
    },
    {
      name: 'editorialFeaturedSectionBody',
      title: 'Editorial Page - Featured Section Body',
      type: 'localeText',
      description: 'Body copy for the featured editorial article section',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Editorial Page',
        subtitle: 'Manage editorial page UI text (9 fields)',
      }
    },
  },
})
