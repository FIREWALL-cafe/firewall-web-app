export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card', description: 'Fields shown on the event card'},
    {name: 'detail', title: 'Detail', description: 'Fields shown on the event detail page'},
    {name: 'media', title: 'Media', description: 'Images and gallery'},
  ],
  fields: [
    // --- Card fields (EventCard) ---
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "oslo-freedom-forum-2022")',
      validation: Rule => Rule.required(),
      group: 'card',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      group: 'card',
    },
    {
      name: 'titleZh',
      title: 'Title (Chinese)',
      type: 'string',
      description: '中文标题',
      group: 'card',
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'string',
      description: 'Display date (e.g., "Nov. 3, 2022" or "Feb. 8 - Mar. 6, 2016")',
      group: 'card',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'card',
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
      name: 'cardImageDefault',
      title: 'Card Image (Default State)',
      type: 'image',
      description: 'Event card thumbnail - default state',
      options: {
        hotspot: true,
      },
      group: 'card',
    },
    {
      name: 'cardImageHover',
      title: 'Card Image (Hover State)',
      type: 'image',
      description: 'Event card thumbnail - hover state',
      options: {
        hotspot: true,
      },
      group: 'card',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      group: 'card',
    },

    // --- Detail fields (ShowEvent / EventDetail) ---
    {
      name: 'exhibition',
      title: 'Exhibition Period',
      type: 'string',
      description: 'Optional exhibition dates',
      group: 'detail',
    },
    {
      name: 'lecture',
      title: 'Lecture Time',
      type: 'string',
      description: 'Optional lecture time',
      group: 'detail',
    },
    {
      name: 'opening',
      title: 'Opening Reception',
      type: 'string',
      description: 'Optional opening reception time',
      group: 'detail',
    },
    {
      name: 'hours',
      title: 'Hours',
      type: 'string',
      description: 'Gallery/venue hours',
      group: 'detail',
    },
    {
      name: 'archiveLink',
      title: 'Archive Link',
      type: 'string',
      description: 'Link to search archive (e.g., "/archive?search_locations=oslo_freedom_taiwan")',
      group: 'detail',
    },
    {
      name: 'curators',
      title: 'Curators',
      type: 'string',
      description: 'Curator information',
      group: 'detail',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'text'}],
      description: 'Event description paragraphs',
      group: 'detail',
    },
    {
      name: 'descriptionZh',
      title: 'Description (Chinese)',
      type: 'array',
      of: [{type: 'text'}],
      description: '中文活动描述段落',
      group: 'detail',
    },
    {
      name: 'detail',
      title: 'Detail',
      type: 'text',
      description: 'Additional event details',
      group: 'detail',
    },
    {
      name: 'detailZh',
      title: 'Detail (Chinese)',
      type: 'text',
      description: '中文活动详情',
      group: 'detail',
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
      group: 'detail',
    },

    // --- Media ---
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
      group: 'media',
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
