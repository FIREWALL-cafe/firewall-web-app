import {defineType} from 'sanity'

// Repeatable video embed. Each document targets one page via `placement`,
// so editors can add multiple videos and choose where each one appears.
export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'document',
  description: 'A video shown as a click-to-play section on a page (uploaded file or Vimeo)',

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
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      description:
        'The full video, uploaded to Sanity and played with the native browser player. ' +
        'Note: playback is at full bitrate (no adaptive streaming) and large files count ' +
        'against the Sanity bandwidth quota.',
      options: {accept: 'video/*'},
    },
    {
      name: 'vimeoUrl',
      title: 'Vimeo URL (fallback)',
      type: 'url',
      description:
        'Used only when no video file is uploaded above. Full Vimeo link, e.g. https://vimeo.com/1207538492',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
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
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
      description: 'Optional bilingual caption shown directly below the video poster (like an image caption)',
    },
    {
      name: 'bodyText',
      title: 'Text Below Video',
      type: 'localeBlockContent',
      description: 'Optional bilingual rich text shown below the video preview',
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description:
        'Optional for Vimeo (overrides the Vimeo thumbnail used as the play poster). ' +
        'Recommended for uploaded video files, which have no automatic thumbnail.',
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
