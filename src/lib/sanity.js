import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // Enable CDN for faster cached responses
})

// Helper to generate image URLs with Sanity's image pipeline
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Helper function to localize fields in GROQ queries
// Returns the localized value with fallback to English
function localizeField(field, lang = 'en') {
  return `coalesce(${field}.${lang}, ${field}.en)`
}

// Query helpers
export async function getEvents() {
  return client.fetch(`*[_type == "event"] | order(_createdAt desc)`)
}

export async function getEventBySlug(slug) {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getPressArticles(language = null) {
  const languageFilter = language
    ? `&& language == "${language}"`
    : ''

  return client.fetch(
    `*[_type == "pressArticle" ${languageFilter}] | order(sortOrder asc)`
  )
}

export async function getPartners() {
  return client.fetch(`*[_type == "partner"] | order(sortOrder asc)`)
}

// Timeline Events
export async function getTimelineEvents(lang = 'en') {
  return client.fetch(
    `*[_type == "timelineEvent"] | order(year asc) {
      _id,
      year,
      "title": ${localizeField('title', lang)},
      "description": ${localizeField('description', lang)},
      googleImage {
        image,
        externalUrl,
        date,
        alt,
        placeholder
      },
      baiduImage {
        image,
        externalUrl,
        date,
        alt,
        placeholder
      }
    }`,
    { lang }
  )
}

// Navigation settings (singleton)
export async function getNavigationSettings(lang = 'en') {
  return client.fetch(
    `*[_type == "navigationSettings"][0] {
      menuItems[] {
        id,
        path,
        "label": ${localizeField('label', lang)},
        icon,
        visible
      },
      "searchPlaceholder": ${localizeField('searchPlaceholder', lang)},
      "newsletterTitle": ${localizeField('newsletterTitle', lang)},
      "newsletterSubtitle": ${localizeField('newsletterSubtitle', lang)}
    }`,
    { lang }
  )
}

// UI String Queries (Refactored into 11 singleton documents)

// Helper function to build localized field query
function buildLocalizedQuery(fields, lang = 'en') {
  return fields.map(field => `"${field}": ${localizeField(field, lang)}`).join(',\n        ')
}

// Homepage Strings
export async function getHomepageStrings(lang = 'en') {
  try {
    const fields = [
      'heroTitleAnimated', 'heroSubtitle',
      'aboutMainHeading', 'aboutMainHeadingZh', 'aboutIntroParagraph1', 'aboutIntroParagraph2',
      'aboutButtonText', 'aboutButtonAriaLabel',
      'infoCtaHeading', 'infoCtaHeadingZh', 'infoCtaParagraph1', 'infoCtaParagraph2',
      'infoCtaButton', 'infoCtaButtonAriaLabel',
      'searchTrendsSectionHeading', 'searchTrendsDescription', 'searchTrendsViewArchiveCta',
      'newsletterHeading', 'newsletterSubheading', 'newsletterEmailPlaceholder', 'newsletterSubscribeButton'
    ]

    const result = await client.fetch(
      `*[_type == "homepageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching homepage strings from Sanity:', error)
    return {}
  }
}

// Search Page Strings
export async function getSearchPageStrings(lang = 'en') {
  try {
    const fields = [
      'searchInputPlaceholder', 'searchButton', 'searchModeTooltip',
      'searchErrorEmptyQuery', 'searchErrorNetwork', 'searchErrorGeneric',
      'searchLoadingText', 'translatingText', 'translationLabel', 'errorLabel'
    ]

    const result = await client.fetch(
      `*[_type == "searchPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching search page strings from Sanity:', error)
    return {}
  }
}

// Archive Page Strings
export async function getArchivePageStrings(lang = 'en') {
  try {
    const fields = [
      'archiveInputPlaceholder', 'archiveButton', 'archiveModeTooltip',
      'queryListHeaderVotes', 'queryListHeaderQueryEn', 'queryListHeaderQueryZh',
      'queryListHeaderLocation', 'queryListHeaderDate',
      'queryListTotalResults', 'queryListNoResults', 'queryListLoadingText', 'queryListLoadMoreButton'
    ]

    const result = await client.fetch(
      `*[_type == "archivePageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching archive page strings from Sanity:', error)
    return {}
  }
}

// Filter Strings
export async function getFilterStrings(lang = 'en') {
  try {
    const fields = [
      'filterButton', 'filterCountryLabel', 'filterAllCountries',
      'filterStateLabel', 'filterAllStates', 'filterSourceLabel', 'filterAllSources',
      'filterStartDateLabel', 'filterEndDateLabel', 'filterActiveFiltersLabel', 'filterClearAllButton',
      'filterBadgeCountry', 'filterBadgeState', 'filterBadgeSource',
      'filterBadgeStartDate', 'filterBadgeEndDate',
      'filterCountActiveText', 'filterPrimaryLabel', 'filterSecondaryLabel', 'filterLoadingStatesText'
    ]

    const result = await client.fetch(
      `*[_type == "filterStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching filter strings from Sanity:', error)
    return {}
  }
}

// Vote Strings
export async function getVoteStrings(lang = 'en') {
  try {
    const fields = [
      'voteButtonCensored', 'voteButtonUncensored', 'voteButtonBadTranslation',
      'voteButtonGoodTranslation', 'voteButtonLostInTranslation', 'voteButtonNsfw', 'voteButtonWtf'
    ]

    const result = await client.fetch(
      `*[_type == "voteStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching vote strings from Sanity:', error)
    return {}
  }
}

// Global Strings
export async function getGlobalStrings(lang = 'en') {
  try {
    const fields = [
      'commonLoadingText', 'commonPleaseWaitText',
      'commonErrorSomethingWrong', 'commonErrorTryAgain',
      'commonSuccessSaved', 'commonSuccessThankYou'
    ]

    const result = await client.fetch(
      `*[_type == "globalStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching global strings from Sanity:', error)
    return {}
  }
}

// About Page Strings
export async function getAboutPageStrings(lang = 'en') {
  try {
    const fields = [
      'aboutPageHeading', 'aboutPageHeadingZh', 'aboutPageIntro',
      'aboutRedSectionHeading', 'aboutRedSectionHeadingZh', 'aboutRedSectionBody',
      'aboutArtistSectionHeading', 'aboutArtistSectionHeadingZh',
      'aboutArtistBioParagraph1', 'aboutArtistBioParagraph2', 'aboutArtistBioParagraph3',
      'aboutContributorsSectionHeading', 'aboutContributorsBody',
      'aboutCtaSectionHeading', 'aboutCtaSectionBody', 'aboutCtaButtonText',
      'aboutLearnMoreButton', 'aboutBackToTopButton'
    ]

    const result = await client.fetch(
      `*[_type == "aboutPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching about page strings from Sanity:', error)
    return {}
  }
}

// Editorial Page Strings
export async function getEditorialPageStrings(lang = 'en') {
  try {
    const fields = [
      'editorialPageHeading', 'editorialPageHeadingZh', 'editorialIntroText',
      'editorialReadMoreButton', 'editorialListenButton', 'editorialFilterLabel',
      'editorialSortLabel', 'editorialNoArticlesMessage'
    ]

    const result = await client.fetch(
      `*[_type == "editorialPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching editorial page strings from Sanity:', error)
    return {}
  }
}

// Press Page Strings
export async function getPressPageStrings(lang = 'en') {
  try {
    const fields = [
      'pressPageHeading', 'pressPageHeadingZh', 'pressIntroText',
      'pressPublishedLabel', 'pressSourceLabel', 'pressReadArticleButton',
      'pressExternalLinkLabel', 'pressNoArticlesMessage',
      'pressFilterLanguageLabel', 'pressAllLanguagesOption'
    ]

    const result = await client.fetch(
      `*[_type == "pressPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching press page strings from Sanity:', error)
    return {}
  }
}

// Support Page Strings
export async function getSupportPageStrings(lang = 'en') {
  try {
    const fields = [
      'supportPageHeading', 'supportPageHeadingZh', 'supportIntroText',
      'supportOption1Heading', 'supportOption1Description',
      'supportOption2Heading', 'supportOption2Description',
      'supportOption3Heading', 'supportOption3Description',
      'supportDonationButton', 'supportThankYouMessage', 'supportLearnMoreButton'
    ]

    const result = await client.fetch(
      `*[_type == "supportPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching support page strings from Sanity:', error)
    return {}
  }
}

// Contact Page Strings
export async function getContactPageStrings(lang = 'en') {
  try {
    const fields = [
      'contactPageHeading', 'contactPageHeadingZh',
      'contactFormNameLabel', 'contactFormEmailLabel', 'contactFormMessageLabel',
      'contactFormSubmitButton', 'contactFormSuccessMessage', 'contactFormErrorMessage',
      'contactPrivacyNotice'
    ]

    const result = await client.fetch(
      `*[_type == "contactPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching contact page strings from Sanity:', error)
    return {}
  }
}

// Footer Strings
export async function getFooterStrings(lang = 'en') {
  try {
    const fields = [
      'navLinkAbout', 'navLinkPress', 'navLinkEvents', 'navLinkSearch',
      'navLinkArchive', 'navLinkEditorial', 'navLinkPartner', 'navLinkContact'
    ]

    const result = await client.fetch(
      `*[_type == "footerStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching footer strings from Sanity:', error)
    return {}
  }
}

// Terms and Conditions Strings
export async function getTermsStrings(lang = 'en') {
  try {
    const fields = [
      'modalTitle', 'buttonAccept', 'buttonReject', 'buttonAccessFirewall',
      'errorMustAccept', 'errorUsernameTooLong', 'errorUsernameInvalidChars',
      'usernamePrompt', 'usernamePlaceholder',
      'termsParagraph1Bold', 'termsParagraph1',
      'termsParagraph2Bold', 'termsParagraph2',
      'termsParagraph3', 'termsParagraph4'
    ]

    const result = await client.fetch(
      `*[_type == "termsStrings"][0] {
        ${buildLocalizedQuery(fields, lang)}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching terms strings from Sanity:', error)
    return {}
  }
}

// Composite function: Get all UI strings (backward compatible)
// Fetches all 13 documents in parallel and combines into single flat object
export async function getAllUIStrings(lang = 'en') {
  try {
    const [
      homepage,
      searchPage,
      archivePage,
      filter,
      vote,
      global,
      about,
      editorial,
      press,
      support,
      contact,
      footer,
      terms
    ] = await Promise.all([
      getHomepageStrings(lang),
      getSearchPageStrings(lang),
      getArchivePageStrings(lang),
      getFilterStrings(lang),
      getVoteStrings(lang),
      getGlobalStrings(lang),
      getAboutPageStrings(lang),
      getEditorialPageStrings(lang),
      getPressPageStrings(lang),
      getSupportPageStrings(lang),
      getContactPageStrings(lang),
      getFooterStrings(lang),
      getTermsStrings(lang)
    ])

    // Combine all into single flat object
    return {
      ...homepage,
      ...searchPage,
      ...archivePage,
      ...filter,
      ...vote,
      ...global,
      ...about,
      ...editorial,
      ...press,
      ...support,
      ...contact,
      ...footer,
      ...terms
    }
  } catch (error) {
    console.error('Error fetching all UI strings from Sanity:', error)
    return {}
  }
}

// Feature Cards
// Returns feature cards filtered by page and sorted by displayOrder
export async function getFeatureCards(lang = 'en', visibleOn = null) {
  try {
    const visibleOnFilter = visibleOn
      ? `&& $visibleOn in visibleOn`
      : ''

    const result = await client.fetch(
      `*[_type == "featureCard" ${visibleOnFilter}] | order(displayOrder asc) {
        _id,
        "title": ${localizeField('title', lang)},
        "description": ${localizeField('description', lang)},
        url,
        iconSrc,
        iconSrcHover,
        bgColor,
        textColor,
        borderColor,
        displayOrder,
        visibleOn
      }`,
      { lang, visibleOn }
    )

    return result || []
  } catch (error) {
    console.error('Error fetching feature cards from Sanity:', error)
    return []
  }
}
