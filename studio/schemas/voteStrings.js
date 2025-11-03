import {defineType} from 'sanity'

export default defineType({
  name: 'voteStrings',
  title: 'Vote buttons',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'voteButtonCensored',
      title: 'Vote Button - Censored',
      type: 'localeString',
      description: 'Display name for "Censored" vote category (ID: 1)',
    },
    {
      name: 'voteButtonUncensored',
      title: 'Vote Button - Uncensored',
      type: 'localeString',
      description: 'Display name for "Uncensored" vote category (ID: 2)',
    },
    {
      name: 'voteButtonBadTranslation',
      title: 'Vote Button - Bad Translation',
      type: 'localeString',
      description: 'Display name for "Bad Translation" vote category (ID: 3)',
    },
    {
      name: 'voteButtonGoodTranslation',
      title: 'Vote Button - Good Translation',
      type: 'localeString',
      description: 'Display name for "Good Translation" vote category (ID: 4)',
    },
    {
      name: 'voteButtonLostInTranslation',
      title: 'Vote Button - Lost in Translation',
      type: 'localeString',
      description: 'Display name for "Lost in Translation" vote category (ID: 5)',
    },
    {
      name: 'voteButtonNsfw',
      title: 'Vote Button - NSFW',
      type: 'localeString',
      description: 'Display name for "NSFW" vote category (ID: 6)',
    },
    {
      name: 'voteButtonWtf',
      title: 'Vote Button - WTF',
      type: 'localeString',
      description: 'Display name for "WTF" vote category (ID: 7)',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Vote buttons',
        subtitle: 'Manage vote button labels (7 fields)',
      }
    },
  },
})
