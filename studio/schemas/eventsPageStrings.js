import {defineType} from 'sanity'

export default defineType({
  name: 'eventsPageStrings',
  title: 'Events Page',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'eventsPageHeading',
      title: 'Pixelated Header — English line (black)',
      type: 'localeString',
      description: 'The large black English line of the Events page pixelated header (e.g. "Events"). Fill in the English value — the Chinese value on this field is not used.',
    },
    {
      name: 'eventsPageHeadingZh',
      title: 'Pixelated Header — Chinese line (red)',
      type: 'localeString',
      description: 'The red Chinese line shown directly below the English header (e.g. "活动"). Fill in the Chinese value — this line is always shown in Chinese regardless of the language toggle.',
    },
    {
      name: 'eventsIntroText',
      title: 'Description (under page header)',
      type: 'localeText',
      description: 'Introductory paragraph shown directly below the pixelated header. Provide both English and Chinese; it follows the language toggle.',
    },
    {
      name: 'pastEventsPageHeading',
      title: 'Past Events — Header English line (black)',
      type: 'localeString',
      description: 'The black English line of the Past Events section header. Fill in the English value.',
    },
    {
      name: 'pastEventsPageHeadingZh',
      title: 'Past Events — Header Chinese line (red)',
      type: 'localeString',
      description: 'The red Chinese line of the Past Events section header. Fill in the Chinese value.',
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
