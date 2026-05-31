import {defineType} from 'sanity'

export default defineType({
  name: 'supportPageStrings',
  title: 'Support Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'supportPageHeading',
      title: 'Pixelated Header — English line (black)',
      type: 'localeString',
      description: 'The large black English line of the Support page pixelated header (e.g. "Support the frontline of internet freedom advocates"). Fill in the English value — the Chinese value on this field is not used.',
    },
    {
      name: 'supportPageHeadingZh',
      title: 'Pixelated Header — Chinese line (red)',
      type: 'localeString',
      description: 'The red Chinese line shown directly below the English header. Fill in the Chinese value — this line is always shown in Chinese regardless of the language toggle.',
    },
    {
      name: 'supportIntroText',
      title: 'Description (under page header)',
      type: 'localeText',
      description: 'Introductory paragraph shown directly below the pixelated header. Provide both English and Chinese; it follows the language toggle.',
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
