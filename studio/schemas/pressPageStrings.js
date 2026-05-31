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
      type: 'string',
      description: 'Chinese heading displayed below the English heading (always shown in Chinese, not language-toggled)',
    },
    {
      name: 'pressIntroText',
      title: 'Press Page - Introduction Text',
      type: 'localeText',
      description: 'Introduction text for press coverage section',
    },
    {
      name: 'pressFeaturedSectionBody',
      title: 'Press Page - Featured Section Body',
      type: 'localeText',
      description: 'Body copy for the featured press article section. Both English and Chinese fields are controlled by the language toggle.',
    },
    {
      name: 'pressReadArticleButton',
      title: 'Press Page - Read Article Button',
      type: 'localeString',
      description: 'Text for the "Read Article" button on the featured article (e.g., "Read article" / "阅读文章")',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Press Page',
        subtitle: 'Manage press page UI text (4 fields)',
      }
    },
  },
})
