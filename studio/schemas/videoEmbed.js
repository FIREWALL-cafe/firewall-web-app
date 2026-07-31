import {defineType} from 'sanity'

// Repeatable video embed. Each document targets one page via `placement`,
// so editors can add multiple videos and choose where each one appears.
export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'document',
  description: 'A Vimeo video shown as a click-to-play section on a page',

  fields: [
    {
      name: 'internalTitle',
      title: 'Internal Title',
      type: 'string',
      description: 'Admin-only label to identify this video in the Studio list (not shown on the site)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Hide this video without deleting it',
      initialValue: true,
    },
    {
      name: 'placement',
      title: 'Placement',
      type: 'string',
      description: 'Which page this video appears on',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Expert Commentary (Editorial)', value: 'editorial'},
        ],
        layout: 'radio',
      },
      initialValue: 'home',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      description: 'Full Vimeo link, e.g. https://vimeo.com/1207538492',
      validation: (Rule) =>
        Rule.required().uri({scheme: ['http', 'https']}),
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      description: 'Optional bilingual heading shown above the video',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'Optional bilingual description shown below the heading',
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Optional. Overrides the Vimeo thumbnail used as the play poster.',
      options: {hotspot: true},
    },
    {
      name: 'posterAlt',
      title: 'Poster Alt Text',
      type: 'string',
      description: 'Accessibility description for the poster image',
    },
    {
      name: 'playButtonLabel',
      title: 'Play Button Label',
      type: 'localeString',
      description: 'Accessible label for the play button (e.g. "Play trailer")',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first when a page has multiple videos',
      initialValue: 0,
    },
  ],

  preview: {
    select: {
      title: 'internalTitle',
      placement: 'placement',
      enabled: 'enabled',
      media: 'posterImage',
    },
    prepare({title, placement, enabled, media}) {
      const page = placement === 'editorial' ? 'Expert Commentary' : 'Home'
      return {
        title: title || 'Untitled video',
        subtitle: `${page}${enabled === false ? ' · disabled' : ''}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
})
