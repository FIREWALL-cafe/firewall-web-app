import {defineType} from 'sanity'

export default defineType({
  name: 'homepageStrings',
  title: 'Homepage',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    // HeroSection (2 fields)
    {
      name: 'heroTitleAnimated',
      title: 'Hero Section - Animated Title Text',
      type: 'localeString',
      description:
        'Text for the animated typing effect in hero section. For multiple phrases, separate with pipe "|" in each language.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Section - Subtitle',
      type: 'localeString',
      description: 'Subtitle text below the animated hero title',
    },

    // AboutSection (6 fields)
    {
      name: 'aboutMainHeading',
      title: 'About Section - Main Heading (English)',
      type: 'localeString',
      description: 'Primary heading for the About section on homepage',
    },
    {
      name: 'aboutMainHeadingZh',
      title: 'About Section - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the About section heading (displayed prominently)',
    },
    {
      name: 'aboutIntroParagraph1',
      title: 'About Section - Introduction Paragraph 1',
      type: 'localeText',
      description: 'First paragraph of the About section introduction',
    },
    {
      name: 'aboutIntroParagraph2',
      title: 'About Section - Introduction Paragraph 2',
      type: 'localeText',
      description: 'Second paragraph of the About section introduction',
    },
    {
      name: 'aboutButtonText',
      title: 'About Section - Button Text',
      type: 'localeString',
      description: 'Text for the "About" call-to-action button',
    },
    {
      name: 'aboutButtonAriaLabel',
      title: 'About Section - Button Aria Label',
      type: 'localeString',
      description: 'Accessibility label for the About button',
    },

    // InfoSection (6 fields)
    {
      name: 'infoCtaHeading',
      title: 'Info Section - CTA Heading (English)',
      type: 'localeString',
      description: 'Call-to-action heading in the Info section',
    },
    {
      name: 'infoCtaHeadingZh',
      title: 'Info Section - CTA Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Info section CTA heading',
    },
    {
      name: 'infoCtaParagraph1',
      title: 'Info Section - Paragraph 1',
      type: 'localeText',
      description: 'First paragraph in the Info section',
    },
    {
      name: 'infoCtaParagraph2',
      title: 'Info Section - Paragraph 2',
      type: 'localeText',
      description: 'Second paragraph in the Info section',
    },
    {
      name: 'infoCtaButton',
      title: 'Info Section - Button Text',
      type: 'localeString',
      description: 'Text for the "Start Searching" call-to-action button',
    },
    {
      name: 'infoCtaButtonAriaLabel',
      title: 'Info Section - Button Aria Label',
      type: 'localeString',
      description: 'Accessibility label for the CTA button',
    },

    // SearchTrendsSection (3 fields)
    {
      name: 'searchTrendsSectionHeading',
      title: 'Search Trends Section - Heading',
      type: 'localeString',
      description: 'Heading for the search trends section',
    },
    {
      name: 'searchTrendsDescription',
      title: 'Search Trends Section - Description',
      type: 'localeText',
      description: 'Description text for the search trends section',
    },
    {
      name: 'searchTrendsViewArchiveCta',
      title: 'Search Trends Section - View Archive Button',
      type: 'localeString',
      description: 'Text for the "View Archive" call-to-action button',
    },

    // NewsletterSection (4 fields)
    {
      name: 'newsletterHeading',
      title: 'Newsletter Section - Heading',
      type: 'localeString',
      description: 'Heading for the newsletter subscription section',
    },
    {
      name: 'newsletterSubheading',
      title: 'Newsletter Section - Subheading',
      type: 'localeString',
      description: 'Subheading or description for newsletter subscription',
    },
    {
      name: 'newsletterEmailPlaceholder',
      title: 'Newsletter Section - Email Placeholder',
      type: 'localeString',
      description: 'Placeholder text for the email input field',
    },
    {
      name: 'newsletterSubscribeButton',
      title: 'Newsletter Section - Subscribe Button',
      type: 'localeString',
      description: 'Text for the newsletter subscribe button',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Manage homepage UI text (20 fields)',
      }
    },
  },
})
