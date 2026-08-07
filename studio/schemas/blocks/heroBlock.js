import {defineType} from 'sanity'

// Page-builder block: full-width hero with heading, tagline, and image.
// Blocks store semantic content only — presentation lives in the frontend
// (src/components/pageBuilder/).
export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: () => '🖼️',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'localeText',
      description: 'Short supporting text shown under the heading',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describes the image for screen readers',
        },
      ],
    },
  ],
  preview: {
    select: {
      titleEn: 'heading.en',
      titleZh: 'heading.zh',
      media: 'image',
    },
    prepare({titleEn, titleZh, media}) {
      return {
        title: titleEn || titleZh || 'Untitled hero',
        subtitle: 'Hero',
        media,
      }
    },
  },
})
