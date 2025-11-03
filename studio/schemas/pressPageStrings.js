import {defineType} from 'sanity'

export default defineType({
  name: 'pressPageStrings',
  title: 'Press Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'pressPageHeading',
      title: 'Press Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Press page',
    },
    {
      name: 'pressPageHeadingZh',
      title: 'Press Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Press page heading',
    },
    {
      name: 'pressIntroText',
      title: 'Press Page - Introduction Text',
      type: 'localeText',
      description: 'Introduction text for press coverage section',
    },
    {
      name: 'pressPublishedLabel',
      title: 'Press Page - Published Label',
      type: 'localeString',
      description: 'Label for published date (e.g., "Published:")',
    },
    {
      name: 'pressSourceLabel',
      title: 'Press Page - Source Label',
      type: 'localeString',
      description: 'Label for source/publication (e.g., "Source:")',
    },
    {
      name: 'pressReadArticleButton',
      title: 'Press Page - Read Article Button',
      type: 'localeString',
      description: 'Text for "Read Article" external link button',
    },
    {
      name: 'pressExternalLinkLabel',
      title: 'Press Page - External Link Label',
      type: 'localeString',
      description: 'Label for external links (e.g., "View on [source]")',
    },
    {
      name: 'pressNoArticlesMessage',
      title: 'Press Page - No Articles Message',
      type: 'localeString',
      description: 'Message displayed when no press articles available',
    },
    {
      name: 'pressFilterLanguageLabel',
      title: 'Press Page - Filter Language Label',
      type: 'localeString',
      description: 'Label for language filter dropdown',
    },
    {
      name: 'pressAllLanguagesOption',
      title: 'Press Page - All Languages Option',
      type: 'localeString',
      description: 'Option text for "All Languages" filter',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Press Page',
        subtitle: 'Manage press page UI text (10 fields)',
      }
    },
  },
})
