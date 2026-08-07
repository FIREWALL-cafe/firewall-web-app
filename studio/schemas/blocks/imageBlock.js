import {defineType} from 'sanity'

// Page-builder block: inline image with optional caption.
export default defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: () => '🏞️',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describes the image for screen readers',
        },
      ],
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
    },
  ],
  preview: {
    select: {
      captionEn: 'caption.en',
      alt: 'image.alt',
      media: 'image',
    },
    prepare({captionEn, alt, media}) {
      return {
        title: captionEn || alt || 'Image',
        subtitle: 'Image',
        media,
      }
    },
  },
})
