import {defineType} from 'sanity'

// Page-builder block: grid of existing Feature Card documents
// (studio/schemas/featureCard.js) — the same cards shown on the search,
// archive, and other fixed pages. Order in the array controls display order
// (the cards' own displayOrder/visibleOn fields are ignored here).
export default defineType({
  name: 'featureCardsBlock',
  title: 'Feature Cards',
  type: 'object',
  icon: () => '🃏',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      description: 'Optional heading shown above the cards',
    },
    {
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description: 'Pick existing Feature Cards; drag to set their order on this page',
      validation: (Rule) => Rule.min(1),
      of: [
        {
          type: 'reference',
          to: [{type: 'featureCard'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      headingEn: 'heading.en',
      cards: 'cards',
      card0: 'cards.0.title.en',
      card1: 'cards.1.title.en',
    },
    prepare({headingEn, cards, card0, card1}) {
      const count = cards?.length ?? 0
      const names = [card0, card1].filter(Boolean).join(', ')
      return {
        title: headingEn || names || 'Feature Cards',
        subtitle: `Feature Cards · ${count} card${count === 1 ? '' : 's'}`,
      }
    },
  },
})
