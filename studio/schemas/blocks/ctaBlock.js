import {defineType} from 'sanity'

// Page-builder block: call-to-action banner. `variant` is a semantic option —
// the frontend decides what each variant looks like.
export default defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  icon: () => '📣',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body Text',
      type: 'localeText',
    },
    {
      name: 'buttonText',
      title: 'Button Label',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Button URL',
      type: 'string',
      description: 'Internal path (e.g. "/contact") or full external URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      initialValue: 'standard',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Highlight (red banner)', value: 'highlight'},
        ],
        layout: 'radio',
      },
    },
  ],
  preview: {
    select: {
      titleEn: 'heading.en',
      url: 'url',
    },
    prepare({titleEn, url}) {
      return {
        title: titleEn || 'Untitled CTA',
        subtitle: `Call to Action → ${url || '?'}`,
      }
    },
  },
})
