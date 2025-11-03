import {defineType} from 'sanity'

export default defineType({
  name: 'contactPageStrings',
  title: 'Contact Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'contactPageHeading',
      title: 'Contact Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Contact page',
    },
    {
      name: 'contactPageHeadingZh',
      title: 'Contact Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Contact page heading',
    },
    {
      name: 'contactFormNameLabel',
      title: 'Contact Page - Name Field Label',
      type: 'localeString',
      description: 'Label for name input field',
    },
    {
      name: 'contactFormEmailLabel',
      title: 'Contact Page - Email Field Label',
      type: 'localeString',
      description: 'Label for email input field',
    },
    {
      name: 'contactFormMessageLabel',
      title: 'Contact Page - Message Field Label',
      type: 'localeString',
      description: 'Label for message textarea field',
    },
    {
      name: 'contactFormSubmitButton',
      title: 'Contact Page - Submit Button',
      type: 'localeString',
      description: 'Text for form submit button',
    },
    {
      name: 'contactFormSuccessMessage',
      title: 'Contact Page - Success Message',
      type: 'localeString',
      description: 'Success message after form submission',
    },
    {
      name: 'contactFormErrorMessage',
      title: 'Contact Page - Error Message',
      type: 'localeString',
      description: 'Error message if form submission fails',
    },
    {
      name: 'contactPrivacyNotice',
      title: 'Contact Page - Privacy Notice',
      type: 'localeText',
      description: 'Privacy notice text below contact form',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Manage contact page UI text (9 fields)',
      }
    },
  },
})
