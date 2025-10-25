import {defineType} from 'sanity'

// Supported languages configuration
export const supportedLanguages = [
  {id: 'en', title: 'English', isDefault: true},
  {id: 'zh', title: '中文 (Chinese)'},
]

// Locale String - for short text fields like titles
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'string',
  })),
  preview: {
    select: {
      en: 'en',
      zh: 'zh',
    },
    prepare({en, zh}) {
      return {
        title: en || zh || 'No translation',
        subtitle: zh ? `中文: ${zh}` : 'No Chinese translation',
      }
    },
  },
})

// Locale Text - for longer text fields with paragraphs
export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'text',
    rows: 4,
  })),
  preview: {
    select: {
      en: 'en',
      zh: 'zh',
    },
    prepare({en, zh}) {
      return {
        title: en || zh || 'No translation',
        subtitle: zh ? `中文: ${zh}` : 'No Chinese translation',
      }
    },
  },
})

// Locale Block Content - for rich text with formatting
export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized Block Content',
  type: 'object',
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'array',
    of: [{type: 'block'}],
  })),
})

// Helper function to get localized value with fallback
export function getLocalizedValue(localizedField, language = 'en') {
  if (!localizedField) return null
  return localizedField[language] || localizedField.en || Object.values(localizedField)[0]
}
