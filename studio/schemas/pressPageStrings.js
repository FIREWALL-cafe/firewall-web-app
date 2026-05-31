import {defineType} from 'sanity'

export default defineType({
  name: 'pressPageStrings',
  title: 'Press Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'pressPageHeading',
      title: 'Pixelated Header — English line (black)',
      type: 'localeString',
      description: 'The large black English line of the pixelated page header (e.g. "In the Press"). Fill in the English value — the Chinese value on this field is not used.',
    },
    {
      name: 'pressPageHeadingZh',
      title: 'Pixelated Header — Chinese line (red)',
      type: 'localeString',
      description: 'The red Chinese line shown directly below the English header (e.g. "媒体报道"). Fill in the Chinese value — this line is always shown in Chinese regardless of the language toggle.',
    },
    {
      name: 'pressIntroText',
      title: 'Description (under page header)',
      type: 'localeText',
      description: 'Introductory paragraph shown directly below the pixelated header. Provide both English and Chinese; it follows the language toggle.',
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
    {
      name: 'pressFilterAllButton',
      title: 'Article Filter - All Articles Button',
      type: 'localeString',
      description: 'Label for the "All articles" filter button above the press article grid',
    },
    {
      name: 'pressFilterEnglishButton',
      title: 'Article Filter - English Button',
      type: 'localeString',
      description: 'Label for the "English" filter button above the press article grid',
    },
    {
      name: 'pressFilterChineseButton',
      title: 'Article Filter - Chinese Button',
      type: 'localeString',
      description: 'Label for the "中文" (Chinese) filter button above the press article grid',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Press Page',
        subtitle: 'Manage press page UI text',
      }
    },
  },
})
