import {defineType} from 'sanity'

// Singleton — the full-video page (/film). The trailer stays an inline preview
// on Home/Editorial (videoEmbed documents); this page is where the complete
// film can be watched. Prefer uploading the video file directly (served from
// Sanity's CDN via the native player); the Vimeo URL is a fallback used only
// when no file is uploaded.
export default defineType({
  name: 'videoPage',
  title: 'Film Page',
  type: 'document',

  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      description: 'Bilingual page heading (e.g. the film title)',
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
      description: 'Used only when no video file is uploaded above',
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Shown in the player before playback starts (uploaded file only)',
      options: {hotspot: true},
    },
    {
      name: 'posterAlt',
      title: 'Poster Alt Text',
      type: 'string',
      description: 'Accessibility description for the poster image',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
      description: 'Optional bilingual caption shown directly below the player',
    },
    {
      name: 'bodyText',
      title: 'Text Below Video',
      type: 'localeBlockContent',
      description: 'Optional bilingual rich text shown below the caption',
    },
  ],

  preview: {
    prepare() {
      return {title: 'Film Page'}
    },
  },
})
