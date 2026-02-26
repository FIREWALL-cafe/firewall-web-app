export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "oslo-freedom-forum-2022")',
      validation: Rule => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'titleZh',
      title: 'Title (Chinese)',
      type: 'string',
      description: '中文标题',
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
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'addressZh',
          title: 'Address (Chinese)',
          type: 'array',
          of: [{type: 'string'}],
          description: '中文地址',
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
      type: 'string',
      description: 'Curator information',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'text'}],
      description: 'Event description paragraphs',
    },
    {
      name: 'descriptionZh',
      title: 'Description (Chinese)',
      type: 'array',
      of: [{type: 'text'}],
      description: '中文活动描述段落',
    },
    {
      name: 'detail',
      title: 'Detail',
      type: 'text',
      description: 'Additional event details',
    },
    {
      name: 'detailZh',
      title: 'Detail (Chinese)',
      type: 'text',
      description: '中文活动详情',
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
      name: 'cardImageDefault',
      title: 'Card Image (Default State)',
      type: 'image',
      description: 'Event card thumbnail - default state',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'cardImageHover',
      title: 'Card Image (Hover State)',
      type: 'image',
      description: 'Event card thumbnail - hover state',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
    {
      name: 'images',
      title: 'Event Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Alternative text for accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'cardImageDefault',
    },
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
}
