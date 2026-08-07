import {defineType} from 'sanity'

// Page-builder block: bilingual rich text. Portable text is itself an array,
// and Sanity arrays cannot nest directly, so the localeBlockContent object
// wrapper is required — do not flatten this into a bare block array.
export default defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  icon: () => '📝',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'localeBlockContent',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      blocks: 'content.en',
    },
    prepare({blocks}) {
      const firstText = (blocks || [])
        .filter((block) => block._type === 'block')
        .map((block) => (block.children || []).map((child) => child.text).join(''))
        .find(Boolean)
      return {
        title: firstText || 'Empty rich text',
        subtitle: 'Rich Text',
      }
    },
  },
})
