import {defineType} from 'sanity'

export default defineType({
  name: 'eventLocalized',
  title: 'Event (Localized)',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "oslo-freedom-forum-2022")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
      description: 'Event title in multiple languages',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'string',
      description: 'Display date (e.g., "Nov. 3, 2022" or "Feb. 8 - Mar. 6, 2016")',
    },
    {
      name: 'exhibition',
      title: 'Exhibition Period',
      type: 'string',
      description: 'Optional exhibition dates',
    },
    {
      name: 'lecture',
      title: 'Lecture Time',
      type: 'string',
      description: 'Optional lecture time',
    },
    {
      name: 'opening',
      title: 'Opening Reception',
      type: 'string',
      description: 'Optional opening reception time',
    },
    {
      name: 'hours',
      title: 'Hours',
      type: 'string',
      description: 'Gallery/venue hours',
    },
    {
      name: 'archiveLink',
      title: 'Archive Link',
      type: 'string',
      description: 'Link to search archive (e.g., "/archive?search_locations=oslo_freedom_taiwan")',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Venue Name',
          type: 'localeString',
          description: 'Venue name in multiple languages',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'mapLink',
          title: 'Map Link',
          type: 'url',
        },
      ],
    },
    {
      name: 'curators',
      title: 'Curators',
      type: 'localeString',
      description: 'Curator information in multiple languages',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      description: 'Event description in multiple languages',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{type: 'text'}],
        },
        {
          name: 'zh',
          title: '中文 (Chinese)',
          type: 'array',
          of: [{type: 'text'}],
        },
      ],
    },
    {
      name: 'links',
      title: 'Related Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Link Text'},
            {name: 'url', type: 'url', title: 'URL'},
            {name: 'publication', type: 'string', title: 'Publication'},
          ],
        },
      ],
    },
    {
      name: 'images',
      title: 'Event Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'src',
              type: 'url',
              title: 'Image URL',
              description: 'External image URL (e.g., from Digital Ocean Spaces)',
            },
            {
              name: 'alt',
              type: 'localeString',
              title: 'Alt Text',
              description: 'Image alt text in multiple languages',
            },
            {
              name: 'caption',
              type: 'localeString',
              title: 'Caption',
              description: 'Image caption in multiple languages',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titleZh: 'title.zh',
      subtitle: 'date',
    },
    prepare({titleEn, titleZh, subtitle}) {
      return {
        title: titleEn || titleZh || 'Untitled',
        subtitle: subtitle || 'No date',
      }
    },
  },
})
