import {defineType} from 'sanity'

export default defineType({
  name: 'eventsPageStrings',
  title: 'Events Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'eventsPageHeading',
      title: 'Events Page - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Events page',
    },
    {
      name: 'eventsPageHeadingZh',
      title: 'Events Page - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Events page heading',
    },
    {
      name: 'eventsIntroText',
      title: 'Events Page - Introduction Text',
      type: 'localeText',
      description: 'Introductory paragraph below the events heading',
    },
    {
      name: 'pastEventsPageHeading',
      title: 'Past Events Section - Main Heading (English)',
      type: 'localeString',
      description: 'Main heading for the Past Events section',
    },
    {
      name: 'pastEventsPageHeadingZh',
      title: 'Past Events Section - Main Heading (Chinese)',
      type: 'localeString',
      description: 'Chinese version of the Past Events section heading',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Events Page',
        subtitle: 'Manage events page UI text (5 fields)',
      }
    },
  },
})
