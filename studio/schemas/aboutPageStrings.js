import {defineType} from 'sanity'

export default defineType({
  name: 'aboutPageStrings',
  title: 'About Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'aboutPageHeading',
      title: 'About Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the About page',
    },
    {
      name: 'aboutPageHeadingZh',
      title: 'About Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the About page main heading',
    },
    {
      name: 'aboutPageIntro',
      title: 'About Page - Introduction',
      type: 'localeText',
      description: 'Introduction paragraph for the About page',
    },
    {
      name: 'aboutRedSectionHeading',
      title: 'About Page - Red Section Heading (English)',
      type: 'localeString',
      description: 'Heading for the red section on About page',
    },
    {
      name: 'aboutRedSectionHeadingZh',
      title: 'About Page - Red Section Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the red section heading',
    },
    {
      name: 'aboutRedSectionBody',
      title: 'About Page - Red Section Body',
      type: 'localeText',
      description: 'Body text for the red section on About page',
    },
    {
      name: 'aboutArtistSectionHeading',
      title: 'About Page - Artist Section Heading (English)',
      type: 'localeString',
      description: 'Heading for the artist section on About page',
    },
    {
      name: 'aboutArtistSectionHeadingZh',
      title: 'About Page - Artist Section Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the artist section heading',
    },
    {
      name: 'aboutArtistBioParagraph1',
      title: 'About Page - Artist Bio Paragraph 1',
      type: 'localeText',
      description: 'First paragraph of artist biography',
    },
    {
      name: 'aboutArtistBioParagraph2',
      title: 'About Page - Artist Bio Paragraph 2',
      type: 'localeText',
      description: 'Second paragraph of artist biography',
    },
    {
      name: 'aboutArtistBioParagraph3',
      title: 'About Page - Artist Bio Paragraph 3',
      type: 'localeText',
      description: 'Third paragraph of artist biography',
    },
    {
      name: 'aboutContributorsSectionHeading',
      title: 'About Page - Contributors Section Heading',
      type: 'localeString',
      description: 'Heading for the contributors section',
    },
    {
      name: 'aboutContributorsBody',
      title: 'About Page - Contributors Body Text',
      type: 'localeText',
      description: 'Body text for the contributors section',
    },
    {
      name: 'aboutCtaSectionHeading',
      title: 'About Page - CTA Section Heading',
      type: 'localeString',
      description: 'Heading for the call-to-action section',
    },
    {
      name: 'aboutCtaSectionBody',
      title: 'About Page - CTA Section Body',
      type: 'localeText',
      description: 'Body text for the call-to-action section',
    },
    {
      name: 'aboutCtaButtonText',
      title: 'About Page - CTA Button Text',
      type: 'localeString',
      description: 'Text for the CTA button on About page',
    },
    {
      name: 'aboutLearnMoreButton',
      title: 'About Page - Learn More Button',
      type: 'localeString',
      description: 'Text for "Learn More" button',
    },
    {
      name: 'aboutBackToTopButton',
      title: 'About Page - Back to Top Button',
      type: 'localeString',
      description: 'Text for "Back to Top" button',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'Manage about page UI text (18 fields)',
      }
    },
  },
})
