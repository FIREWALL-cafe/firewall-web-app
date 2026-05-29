import {defineType} from 'sanity'

export default defineType({
  name: 'partnersPageStrings',
  title: 'Partners Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'partnersPageHeading',
      title: 'Partners Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Partners page',
    },
    {
      name: 'partnersPageHeadingZh',
      title: 'Partners Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Partners page heading',
    },
    {
      name: 'partnersIntroText',
      title: 'Partners Page - Introduction Text',
      type: 'localeText',
      description: 'Introductory paragraph below the partners heading',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Partners Page',
        subtitle: 'Manage partners page UI text (3 fields)',
      }
    },
  },
})
