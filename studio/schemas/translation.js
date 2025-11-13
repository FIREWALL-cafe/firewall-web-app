import {defineType} from 'sanity'

export default defineType({
  name: 'translation',
  title: 'Translation',
  type: 'document',
  fields: [
    {
      name: 'query',
      title: 'Query',
      type: 'string',
      description: 'The normalized search query (lowercase, trimmed)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'translation',
      title: 'Translation',
      type: 'string',
      description: 'The translated text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Translation source',
      options: {
        list: [
          {title: 'Sensitive (Manual)', value: 'sensitive'},
          {title: 'Google Translate', value: 'google'},
          {title: 'Override (Manual)', value: 'override'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sensitive',
      title: 'Sensitive Term',
      type: 'boolean',
      description: 'Whether this is a sensitive term requiring manual translation',
      initialValue: false,
    },
    {
      name: 'langFrom',
      title: 'Source Language',
      type: 'string',
      description: 'Source language code',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: '中文', value: 'zh'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'langTo',
      title: 'Target Language',
      type: 'string',
      description: 'Target language code',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: '中文', value: 'zh'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'langConfidence',
      title: 'Language Detection Confidence',
      type: 'number',
      description: 'Confidence score from language detection (0-1)',
      validation: (Rule) => Rule.min(0).max(1),
    },
    {
      name: 'langAlternate',
      title: 'Alternate Language',
      type: 'string',
      description: 'Alternate language suggestion if confidence < 1',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: '中文', value: 'zh'},
        ],
      },
    },
    {
      name: 'langName',
      title: 'Language Name',
      type: 'string',
      description: 'Human-readable language name',
    },
  ],
  preview: {
    select: {
      query: 'query',
      translation: 'translation',
      source: 'source',
      langFrom: 'langFrom',
      langTo: 'langTo',
    },
    prepare({query, translation, source, langFrom, langTo}) {
      return {
        title: query,
        subtitle: `${translation} (${langFrom} → ${langTo})`,
        description: `Source: ${source}`,
      }
    },
  },
})
