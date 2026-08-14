import {defineType} from 'sanity'

// Page-builder block: video player. An uploaded file plays with the native
// browser player; otherwise the Vimeo URL is embedded.
export default defineType({
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  icon: () => '🎬',
  fields: [
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      description:
        'Uploaded to Sanity and played with the native browser player. ' +
        'Note: playback is at full bitrate (no adaptive streaming) and large files count ' +
        'against the Sanity bandwidth quota.',
      options: {accept: 'video/*'},
    },
    {
      name: 'vimeoUrl',
      title: 'Vimeo URL (fallback)',
      type: 'url',
      description: 'Used only when no video file is uploaded above',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description:
        'Shown in the player before playback starts (uploaded file only). ' +
        'Recommended for uploaded files, which have no automatic thumbnail.',
      options: {hotspot: true},
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
      description: 'Optional bilingual caption shown below the video',
    },
  ],
  preview: {
    select: {
      captionEn: 'caption.en',
      vimeoUrl: 'vimeoUrl',
      media: 'posterImage',
    },
    prepare({captionEn, vimeoUrl, media}) {
      return {
        title: captionEn || vimeoUrl || 'Video',
        subtitle: 'Video',
        media,
      }
    },
  },
})
