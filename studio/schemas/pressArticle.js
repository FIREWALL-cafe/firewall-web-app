export default {
  name: 'pressArticle',
  title: 'Press Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'url',
      title: 'Article URL',
      type: 'url',
      validation: Rule => Rule.required(),
    },
    {
      name: 'date',
      title: 'Publication Date',
      type: 'string',
      description: 'Display date (e.g., "Feb 13, 2020")',
      validation: Rule => Rule.required(),
    },
    {
      name: 'source',
      title: 'Publication Source',
      type: 'string',
      description: 'Name of the publication',
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'English', value: 'English'},
          {title: 'Chinese', value: 'Chinese'},
        ],
      },
    },
    {
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'Optional note (e.g., "cue 35:06")',
    },
    {
      name: 'image',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'imageHover',
      title: 'Hover Image',
      type: 'image',
      description: 'Image shown on hover',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in the grid (lower numbers appear first)',
    },
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'source',
      media: 'image',
    },
  },
}
