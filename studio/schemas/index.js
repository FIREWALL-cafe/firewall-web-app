import event from './event'
import timelineEvent from './timelineEvent'
import pressArticle from './pressArticle'
import editorialArticle from './editorialArticle'
import contributor from './contributor'
import partner from './partner'
import translation from './translation'
import {localeString, localeText, localeBlockContent} from './localeTypes'
import navigationSettings from './navigationSettings'
import censorshipSettings from './censorshipSettings'
import videoPage from './videoPage'
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
import eventsPageStrings from './eventsPageStrings'
import partnersPageStrings from './partnersPageStrings'
import termsPageStrings from './termsPageStrings'
import featuredPressArticle from './featuredPressArticle'
import homepageImages from './homepageImages'
import siteAssets from './siteAssets'
import videoEmbed from './videoEmbed'

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
  contributor,
  partner,
  translation,

  // Settings/Singletons
  navigationSettings,
  censorshipSettings,
  videoPage,

  // UI String Singletons (14 documents)
  homepageStrings,
  searchPageStrings,
  archivePageStrings,
  eventsPageStrings,
  partnersPageStrings,
  termsPageStrings,
  aboutPageStrings,
  editorialPageStrings,
  pressPageStrings,
  supportPageStrings,
  contactPageStrings,
  filterStrings,
  voteStrings,
  globalStrings,
  footerStrings,

  // Content Singletons
  featuredPressArticle,

  // Reusable components
  featureCard,
  videoEmbed,

  // Image assets
  homepageImages,
  siteAssets,
]
