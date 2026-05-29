import {defineType} from 'sanity'

export default defineType({
  name: 'featuredPressArticle',
  title: 'Featured Press Article',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'featuredLabel',
      title: 'Featured Label',
      type: 'localeString',
      description: 'Label shown above the article (e.g., "Featured")',
    },
    {
      name: 'articleTitle',
      title: 'Article Title (English)',
      type: 'localeString',
      description: 'Main title of the featured article in English',
    },
    {
      name: 'articleTitleZh',
      title: 'Article Title (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the article title',
    },
    {
      name: 'excerpt',
      title: 'Article Excerpt',
      type: 'localeText',
      description: 'Short excerpt or summary from the article',
    },
    {
      name: 'externalUrl',
      title: 'Article URL',
      type: 'url',
      description: 'Link to the full article on the external publication',
    },
    {
      name: 'publication',
      title: 'Publication Name',
      type: 'string',
      description: 'Name of the publication (e.g., "Washington Post")',
    },
    {
      name: 'readArticleLabel',
      title: 'Read Article Button Label',
      type: 'localeString',
      description: 'Text for the "Read article" button',
    },
    {
      name: 'image',
      title: 'Article Image',
      type: 'image',
      description: 'Featured image for the article',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'articleTitle',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title?.en || 'Featured Press Article',
        subtitle: 'Singleton — featured article shown on the Press page',
        media,
      }
    },
  },
})
