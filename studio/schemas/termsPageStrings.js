import {defineType} from 'sanity'

export default defineType({
  name: 'termsPageStrings',
  title: 'Terms & Conditions Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'pageHeading',
      title: 'Page Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Terms & Conditions page',
    },
    {
      name: 'pageHeadingZh',
      title: 'Page Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the page heading',
    },
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      description: 'Ordered list of content sections (e.g. Explicit Content Disclaimer, Privacy Policy)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionHeading',
              title: 'Section Heading',
              type: 'localeString',
              description: 'Bold heading for this section',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sectionBody',
              title: 'Section Body',
              type: 'localeText',
              description: 'Body text for this section',
            },
          ],
          preview: {
            select: { title: 'sectionHeading.en' },
            prepare({ title }) {
              return { title: title || 'Untitled section' }
            },
          },
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Terms & Conditions Page',
        subtitle: 'Manage terms page heading and content sections',
      }
    },
  },
})
