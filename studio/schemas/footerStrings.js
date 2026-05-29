import {defineType} from 'sanity'

export default defineType({
  name: 'footerStrings',
  title: 'Footer Component',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'linkGroups',
      title: 'Link Groups (Columns)',
      type: 'array',
      description: 'Each group renders as a column of links. Drag to reorder columns.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              description: 'Links in this column. Drag to reorder.',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'localeString',
                      description: 'Display text for the link',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'path',
                      title: 'Path or URL',
                      type: 'string',
                      description: 'Internal path (e.g. /about) or external URL (e.g. https://...)',
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: { title: 'label.en', subtitle: 'path' },
                    prepare({ title, subtitle }) {
                      return { title: title || 'Untitled link', subtitle }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { links: 'links' },
            prepare({ links }) {
              const count = links?.length || 0
              const first = links?.[0]?.label?.en || '—'
              return { title: first, subtitle: `${count} link${count !== 1 ? 's' : ''}` }
            },
          },
        },
      ],
    },

    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Social media icons shown in the footer. Platform determines which icon is used.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'YouTube', value: 'youtube' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
            prepare({ title, subtitle }) {
              return { title: title || 'Social link', subtitle }
            },
          },
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Footer Component',
        subtitle: 'Manage footer link groups and social media links',
      }
    },
  },
})
