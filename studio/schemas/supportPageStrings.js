import {defineType} from 'sanity'

export default defineType({
  name: 'supportPageStrings',
  title: 'Support Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'supportPageHeading',
      title: 'Support Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Support page',
    },
    {
      name: 'supportPageHeadingZh',
      title: 'Support Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Support page heading',
    },
    {
      name: 'supportIntroText',
      title: 'Support Page - Introduction Text',
      type: 'localeText',
      description: 'Introduction text for the Support page',
    },
    {
      name: 'supportOption1Heading',
      title: 'Support Page - Option 1 Heading',
      type: 'localeString',
      description: 'Heading for first support option',
    },
    {
      name: 'supportOption1Description',
      title: 'Support Page - Option 1 Description',
      type: 'localeText',
      description: 'Description for first support option',
    },
    {
      name: 'supportOption2Heading',
      title: 'Support Page - Option 2 Heading',
      type: 'localeString',
      description: 'Heading for second support option',
    },
    {
      name: 'supportOption2Description',
      title: 'Support Page - Option 2 Description',
      type: 'localeText',
      description: 'Description for second support option',
    },
    {
      name: 'supportOption3Heading',
      title: 'Support Page - Option 3 Heading',
      type: 'localeString',
      description: 'Heading for third support option',
    },
    {
      name: 'supportOption3Description',
      title: 'Support Page - Option 3 Description',
      type: 'localeText',
      description: 'Description for third support option',
    },
    {
      name: 'supportDonationButton',
      title: 'Support Page - Donation Button',
      type: 'localeString',
      description: 'Text for donation button',
    },
    {
      name: 'supportThankYouMessage',
      title: 'Support Page - Thank You Message',
      type: 'localeString',
      description: 'Thank you message after support action',
    },
    {
      name: 'supportLearnMoreButton',
      title: 'Support Page - Learn More Button',
      type: 'localeString',
      description: 'Text for "Learn More" button',
    },
    {
      name: 'supportDonateText',
      title: 'Support Page - Donation Callout Text',
      type: 'localeText',
      description: 'Text for the NYFA donation callout below the intro paragraph (e.g., "Donate to our cause through NYFA, a 501(c)3 supporting the arts in NY.")',
    },
    {
      name: 'supportersHeading',
      title: 'Supporters Section - Main Heading (English)',
      type: 'localeString',
      description: 'Heading for the Supporters section',
    },
    {
      name: 'supportersHeadingZh',
      title: 'Supporters Section - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Supporters section heading',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Support Page',
        subtitle: 'Manage support page UI text (14 fields)',
      }
    },
  },
})
