import event from './event'
import timelineEvent from './timelineEvent'
import pressArticle from './pressArticle'
import editorialArticle from './editorialArticle'
import partner from './partner'
import translation from './translation'
import {localeString, localeText, localeBlockContent} from './localeTypes'
import navigationSettings from './navigationSettings'
import featureCard from './featureCard'

// UI String Singletons (refactored from single uiStrings schema)
import homepageStrings from './homepageStrings'
import searchPageStrings from './searchPageStrings'
import archivePageStrings from './archivePageStrings'
import aboutPageStrings from './aboutPageStrings'
import editorialPageStrings from './editorialPageStrings'
import pressPageStrings from './pressPageStrings'
import supportPageStrings from './supportPageStrings'
import contactPageStrings from './contactPageStrings'
import filterStrings from './filterStrings'
import voteStrings from './voteStrings'
import globalStrings from './globalStrings'
import footerStrings from './footerStrings'
import termsStrings from './termsStrings'
import homepageImages from './homepageImages'
import siteAssets from './siteAssets'

export const schemaTypes = [
  // Locale types (must be registered first)
  localeString,
  localeText,
  localeBlockContent,

  // Original schemas
  event,
  timelineEvent,
  pressArticle,
  editorialArticle,
  partner,
  translation,

  // Settings/Singletons
  navigationSettings,

  // UI String Singletons (13 documents)
  homepageStrings,
  searchPageStrings,
  archivePageStrings,
  aboutPageStrings,
  editorialPageStrings,
  pressPageStrings,
  supportPageStrings,
  contactPageStrings,
  filterStrings,
  voteStrings,
  globalStrings,
  footerStrings,
  termsStrings,

  // Reusable components
  featureCard,

  // Image assets
  homepageImages,
  siteAssets,
]
