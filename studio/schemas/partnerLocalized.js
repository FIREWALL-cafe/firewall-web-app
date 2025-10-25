import {defineType} from 'sanity'

export default defineType({
  name: 'partnerLocalized',
  title: 'Partner (Localized)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      description: 'Partner name (usually not translated - proper noun)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'Partner description in multiple languages',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order on the partners page (lower numbers appear first)',
    },
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
      media: 'logo',
    },
  },
})
