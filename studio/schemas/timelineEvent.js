import {defineType} from 'sanity'

export default defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of the event (4-digit year, e.g., 1989, 2003)',
      validation: (Rule) =>
        Rule.required()
          .min(1900)
          .max(2100)
          .integer()
          .custom((year) => {
            if (!year) return true
            const yearStr = String(year)
            if (yearStr.length !== 4) {
              return 'Year must be a 4-digit number'
            }
            return true
          }),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
      description: 'Short event title (localized)',
      validation: (Rule) =>
        Rule.custom((localeString) => {
          if (!localeString?.en && !localeString?.zh) {
            return 'At least one localized title (English or Chinese) is required'
          }
          return true
        }),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'Longer event description (localized)',
    },
    {
      name: 'googleImage',
      title: 'Google Image',
      type: 'object',
      description: 'Google search result image with metadata',
      fields: [
        {
          name: 'image',
          title: 'Sanity Image',
          type: 'image',
          description: 'Upload image to Sanity (preferred method)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'externalUrl',
          title: 'External Image URL',
          type: 'url',
          description: 'Alternative: use external image URL instead of Sanity upload',
        },
        {
          name: 'date',
          title: 'Display Date',
          type: 'string',
          description: 'Date label to show below image (e.g., "06/04/1989")',
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility alt text for image',
        },
        {
          name: 'placeholder',
          title: 'Placeholder Text',
          type: 'string',
          description: 'Fallback text when image is unavailable',
        },
      ],
    },
    {
      name: 'baiduImage',
      title: 'Baidu Image',
      type: 'object',
      description: 'Baidu search result image with metadata',
      fields: [
        {
          name: 'image',
          title: 'Sanity Image',
          type: 'image',
          description: 'Upload image to Sanity (preferred method)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'externalUrl',
          title: 'External Image URL',
          type: 'url',
          description: 'Alternative: use external image URL instead of Sanity upload',
        },
        {
          name: 'date',
          title: 'Display Date',
          type: 'string',
          description: 'Date label to show below image (e.g., "06/04/1989")',
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility alt text for image',
        },
        {
          name: 'placeholder',
          title: 'Placeholder Text',
          type: 'string',
          description: 'Fallback text when image is unavailable',
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Manual sort override (optional - defaults to year ordering)',
    },
  ],
  orderings: [
    {
      title: 'Year (Ascending)',
      name: 'yearAsc',
      by: [{field: 'year', direction: 'asc'}],
    },
    {
      title: 'Year (Descending)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      year: 'year',
      titleEn: 'title.en',
      titleZh: 'title.zh',
    },
    prepare({year, titleEn, titleZh}) {
      return {
        title: `${year}: ${titleEn || titleZh || 'Untitled'}`,
        subtitle: titleZh ? `中文: ${titleZh}` : 'No Chinese translation',
      }
    },
  },
})
