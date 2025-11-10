import {defineType} from 'sanity'

export default defineType({
  name: 'homepageImages',
  title: 'Homepage Images',
  type: 'document',
  description: 'Manages images for the homepage (AboutSection)',

  // Singleton: only one document allowed
  __experimental_actions: ['update', 'publish'],

  fields: [
    // About Section Images (3 sets with default/hover states)
    {
      name: 'aboutSectionImage1',
      title: 'About Section Image 1',
      type: 'object',
      fields: [
        {
          name: 'default',
          title: 'Default State',
          type: 'image',
          description: 'Default image state',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'hover',
          title: 'Hover State',
          type: 'image',
          description: 'Image shown on hover',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility description for the image',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'aboutSectionImage2',
      title: 'About Section Image 2',
      type: 'object',
      fields: [
        {
          name: 'default',
          title: 'Default State',
          type: 'image',
          description: 'Default image state',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'hover',
          title: 'Hover State',
          type: 'image',
          description: 'Image shown on hover',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility description for the image',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'aboutSectionImage3',
      title: 'About Section Image 3',
      type: 'object',
      fields: [
        {
          name: 'default',
          title: 'Default State',
          type: 'image',
          description: 'Default image state',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'hover',
          title: 'Hover State',
          type: 'image',
          description: 'Image shown on hover',
          options: {
            hotspot: true
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility description for the image',
          validation: (Rule) => Rule.required(),
        }
      ]
    },

    // Search Trends Section Image
    {
      name: 'searchTrendsCollage',
      title: 'Search Trends Collage Image',
      type: 'image',
      description: 'Collage image shown in the Search Trends section',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required(),
    },

    // Newsletter Section Images (5 sets with desktop/mobile variants)
    {
      name: 'newsletterImageA',
      title: 'Newsletter Image A',
      type: 'object',
      fields: [
        {
          name: 'desktop',
          title: 'Desktop Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'mobile',
          title: 'Mobile Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'newsletterImageB',
      title: 'Newsletter Image B',
      type: 'object',
      fields: [
        {
          name: 'desktop',
          title: 'Desktop Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'mobile',
          title: 'Mobile Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'newsletterImageC',
      title: 'Newsletter Image C',
      type: 'object',
      fields: [
        {
          name: 'desktop',
          title: 'Desktop Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'mobile',
          title: 'Mobile Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'newsletterImageD',
      title: 'Newsletter Image D (US Headlines)',
      type: 'object',
      fields: [
        {
          name: 'desktop',
          title: 'Desktop Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'mobile',
          title: 'Mobile Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }
      ]
    },
    {
      name: 'newsletterImageE',
      title: 'Newsletter Image E',
      type: 'object',
      fields: [
        {
          name: 'desktop',
          title: 'Desktop Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'mobile',
          title: 'Mobile Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }
      ]
    }
  ],

  preview: {
    prepare() {
      return {
        title: 'Homepage Images',
        subtitle: 'About, Search Trends, and Newsletter sections'
      }
    }
  }
})
