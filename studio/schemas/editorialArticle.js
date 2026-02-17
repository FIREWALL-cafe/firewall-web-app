import {defineType} from 'sanity'

export default defineType({
  name: 'editorialArticle',
  title: 'Editorial Articles',
  type: 'document',
  description: 'Expert commentary articles for the Editorial page',

  fields: [
    // ========== BASIC INFO ==========
    {
      name: 'title',
      title: 'Article Title (English)',
      type: 'string',
      description: 'Main article title in English',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'titleZh',
      title: 'Article Title (Chinese)',
      type: 'string',
      description: 'Main article title in Chinese',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for the article (e.g., "lan-yu")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this article was published',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'readTime',
      title: 'Reading Time',
      type: 'string',
      description: 'Estimated reading time (e.g., "30min read")',
      placeholder: '30min read',
    },
    {
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Mark as featured to show on homepage or top of editorial page',
      initialValue: false,
    },

    // ========== CONTENT ==========
    {
      name: 'excerpt',
      title: 'Excerpt/Summary (English)',
      type: 'text',
      description: 'Short summary or opening paragraph in English (shown in article listings)',
      rows: 3,
    },
    {
      name: 'excerptZh',
      title: 'Excerpt/Summary (Chinese)',
      type: 'text',
      description: 'Short summary or opening paragraph in Chinese (shown in article listings)',
      rows: 3,
    },
    {
      name: 'body',
      title: 'Article Body (English)',
      type: 'array',
      description: 'Main article content in English',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for accessibility and SEO',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image',
            },
            {
              name: 'attribution',
              type: 'string',
              title: 'Photo Credit',
              description: 'Photo credit or attribution text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bodyZh',
      title: 'Article Body (Chinese)',
      type: 'array',
      description: 'Main article content in Chinese (optional)',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for accessibility and SEO',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image',
            },
            {
              name: 'attribution',
              type: 'string',
              title: 'Photo Credit',
              description: 'Photo credit or attribution text',
            },
          ],
        },
      ],
    },

    // ========== CATEGORIZATION ==========
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Topics and keywords for this article',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },

    // ========== AUTHOR INFO ==========
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Full name of the author',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authorBio',
      title: 'Author Bio (English)',
      type: 'text',
      description: 'Short bio about the author in English',
      rows: 3,
    },
    {
      name: 'authorBioZh',
      title: 'Author Bio (Chinese)',
      type: 'text',
      description: 'Short bio about the author in Chinese (optional)',
      rows: 3,
    },
    {
      name: 'authorImage',
      title: 'Author Photo',
      type: 'image',
      description: 'Profile photo of the author',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'authorSocial',
      title: 'Author Social Media',
      type: 'array',
      description: 'Social media links for the author',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Pinterest', value: 'pinterest'},
                  {title: 'Website', value: 'website'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({platform, url}) {
              return {
                title: platform.charAt(0).toUpperCase() + platform.slice(1),
                subtitle: url,
              }
            },
          },
        },
      ],
    },

    // ========== NAVIGATION ==========
    {
      name: 'nextArticleSlug',
      title: 'Next Article',
      type: 'string',
      description: 'Slug of the next article to display in navigation (optional)',
    },
    {
      name: 'previousArticleSlug',
      title: 'Previous Article',
      type: 'string',
      description: 'Slug of the previous article to display in navigation (optional)',
    },

    // ========== SEO ==========
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'SEO description (shown in search results)',
      rows: 2,
      validation: (Rule) => Rule.max(160).warning('Should be under 160 characters'),
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'authorName',
      date: 'publishedDate',
      image: 'authorImage',
    },
    prepare({title, author, date, image}) {
      return {
        title: title,
        subtitle: `By ${author || 'Unknown'} - ${
          date ? new Date(date).toLocaleDateString() : 'No date'
        }`,
        media: image,
      }
    },
  },

  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedDateDesc',
      by: [{field: 'publishedDate', direction: 'desc'}],
    },
    {
      title: 'Published Date (Oldest)',
      name: 'publishedDateAsc',
      by: [{field: 'publishedDate', direction: 'asc'}],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
