import {defineType} from 'sanity'

export default defineType({
  name: 'globalStrings',
  title: 'Global Strings',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'commonLoadingText',
      title: 'Common - Loading Text',
      type: 'localeString',
      description: 'Generic loading text (e.g., "Loading...")',
    },
    {
      name: 'commonPleaseWaitText',
      title: 'Common - Please Wait Text',
      type: 'localeString',
      description: 'Text displayed during longer loading operations',
    },
    {
      name: 'commonErrorSomethingWrong',
      title: 'Common - Something Went Wrong Error',
      type: 'localeString',
      description: 'Generic error message',
    },
    {
      name: 'commonErrorTryAgain',
      title: 'Common - Please Try Again Message',
      type: 'localeString',
      description: 'Message prompting user to retry after error',
    },
    {
      name: 'commonSuccessSaved',
      title: 'Common - Saved Success Message',
      type: 'localeString',
      description: 'Success message after saving (e.g., "Saved!")',
    },
    {
      name: 'commonSuccessThankYou',
      title: 'Common - Thank You Message',
      type: 'localeString',
      description: 'Generic thank you message',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Global Strings',
        subtitle: 'Manage common UI text (6 fields)',
      }
    },
  },
})
