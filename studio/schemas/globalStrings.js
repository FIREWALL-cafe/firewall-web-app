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
    {
      name: 'timeDisplayYourTime',
      title: 'Time Display - Your Time Label',
      type: 'localeString',
      description: 'Label for local time display (e.g., "Your time:")',
    },
    {
      name: 'timeDisplayBeijing',
      title: 'Time Display - Beijing Label',
      type: 'localeString',
      description: 'Label for Beijing time display (e.g., "Beijing:")',
    },
    {
      name: 'headerUsernameLabel',
      title: 'Header - Username Label',
      type: 'localeString',
      description: 'Label for username display in header (e.g., "Username:")',
    },
    {
      "name": "commonError",
      "title": "Common - Error Message",
      "type": "localeString",
      "description": "Generic error message",
    },
    {
      "name": "commonLoading",
      "title": "Common - Loading Message",
      "type": "localeString",
      "description": "Generic loading message",
    },
    {
      "name": "commonTryAgain",
      "title": "Common - Try Again Message",
      "type": "localeString",
      "description": "Generic try again message",
    }
  ],

  preview: {
    prepare() {
      return {
        title: 'Global Strings',
        subtitle: 'Manage common UI text (9 fields)',
      }
    },
  },
})
