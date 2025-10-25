import event from './event'
import pressArticle from './pressArticle'
import partner from './partner'
import {localeString, localeText, localeBlockContent} from './localeTypes'
import eventLocalized from './eventLocalized'
import partnerLocalized from './partnerLocalized'

export const schemaTypes = [
  // Locale types (must be registered first)
  localeString,
  localeText,
  localeBlockContent,

  // Original schemas
  event,
  pressArticle,
  partner,

  // Localized schemas (proof of concept)
  eventLocalized,
  partnerLocalized,
]
