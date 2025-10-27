import event from './event'
import pressArticle from './pressArticle'
import partner from './partner'
import {localeString, localeText, localeBlockContent} from './localeTypes'
import eventLocalized from './eventLocalized'
import partnerLocalized from './partnerLocalized'
import navigationSettings from './navigationSettings'

export const schemaTypes = [
  // Locale types (must be registered first)
  localeString,
  localeText,
  localeBlockContent,

  // Original schemas
  event,
  pressArticle,
  partner,

  // Localized schemas
  eventLocalized,
  partnerLocalized,

  // Settings/Singletons
  navigationSettings,
]
