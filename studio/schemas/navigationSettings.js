import {defineType} from 'sanity'

export default defineType({
  name: 'navigationSettings',
  title: 'Navigation Menu',
  type: 'document',

  // Singleton - only one document can exist
  // Note: This is a convention, enforcement should be done in Studio config or desk structure
  fields: [
    {
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      description: 'Navigation menu links (drag to reorder)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Internal ID',
              type: 'string',
              description: 'Unique identifier (e.g., "archive", "events")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'path',
              title: 'URL Path',
              type: 'string',
              description: 'Route path (e.g., "/archive", "/events")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Menu Label',
              type: 'localeString',
              description: 'Display text in multiple languages',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Icon identifier for the menu item',
              options: {
                list: [
                  {title: 'Search', value: 'Search'},
                  {title: 'Archive', value: 'Archive'},
                  {title: 'Commentary', value: 'Commentary'},
                  {title: 'Events', value: 'Events'},
                  {title: 'Press', value: 'Press'},
                  {title: 'About', value: 'About'},
                  {title: 'Support', value: 'Support'},
                  { title: 'Contact', value: 'Contact' },
                  {title: 'Timeline', value: 'Timeline'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              description: 'Show/hide this menu item',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              labelEn: 'label.en',
              labelZh: 'label.zh',
              path: 'path',
              visible: 'visible',
            },
            prepare({labelEn, labelZh, path, visible}) {
              return {
                title: `${labelEn || '?'} / ${labelZh || '?'}`,
                subtitle: `${path}${visible ? '' : ' (hidden)'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: 'searchPlaceholder',
      title: 'Search Placeholder Text',
      type: 'localeString',
      description: 'Placeholder text for search input in the navigation drawer',
    },

    {
      name: 'newsletterTitle',
      title: 'Newsletter Section Title',
      type: 'localeString',
      description: 'Title for newsletter subscription section in navigation drawer',
    },

    {
      name: 'newsletterSubtitle',
      title: 'Newsletter Section Subtitle',
      type: 'localeString',
      description: 'Subtitle for newsletter subscription (Chinese translation)',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Navigation Menu',
        subtitle: 'Manage menu items and labels',
      }
    },
  },
})
