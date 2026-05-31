import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // Enable CDN for faster cached responses
})

// Export client as sanityClient for consistency with other imports
export const sanityClient = client

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
  return client.fetch(`*[_type == "event"] | order(sortOrder asc) {
    _id,
    slug,
    title,
    titleZh,
    date,
    exhibition,
    lecture,
    opening,
    hours,
    archiveLink,
    location,
    curators,
    description,
    descriptionZh,
    detail,
    detailZh,
    links,
    cardImageDefault {
      asset->,
      hotspot,
      crop,
      alt
    },
    cardImageHover {
      asset->,
      hotspot,
      crop,
      alt
    },
    images,
    sortOrder
  }`)
}

export async function getEventBySlug(slug) {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      _id,
      slug,
      title,
      titleZh,
      date,
      exhibition,
      lecture,
      opening,
      hours,
      archiveLink,
      location,
      curators,
      description,
      descriptionZh,
      detail,
      detailZh,
      links,
      cardImageDefault {
        asset->,
        hotspot,
        crop,
        alt
      },
      cardImageHover {
        asset->,
        hotspot,
        crop,
        alt
      },
      images
    }`,
    { slug }
  )
}

// Separate query for event detail page that expands images array
export async function getEventDetailBySlug(slug) {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      _id,
      slug,
      title,
      titleZh,
      date,
      exhibition,
      lecture,
      opening,
      hours,
      archiveLink,
      location,
      curators,
      description,
      descriptionZh,
      detail,
      detailZh,
      links,
      cardImageDefault {
        asset->,
        hotspot,
        crop,
        alt
      },
      cardImageHover {
        asset->,
        hotspot,
        crop,
        alt
      },
      images[] {
        asset->,
        hotspot,
        crop,
        alt,
        caption,
        src
      }
    }`,
    { slug }
  )
}

export async function getPressArticles(language = null) {
  const languageFilter = language
    ? `&& language == "${language}"`
    : ''

  return client.fetch(
    `*[_type == "pressArticle" ${languageFilter}] | order(sortOrder asc) {
      _id,
      title,
      url,
      date,
      source,
      language,
      note,
      image {
        asset->,
        hotspot,
        crop,
        alt
      },
      imageHover {
        asset->,
        hotspot,
        crop,
        alt
      },
      sortOrder
    }`
  )
}

export async function getPartners() {
  return client.fetch(`*[_type == "partner"] | order(sortOrder asc)`)
}

// Contributors
export async function getContributors() {
  return client.fetch(`*[_type == "contributor"] | order(sortOrder asc) {
    _id,
    name,
    role,
    url,
    bio,
    headshot {
      asset->,
      hotspot,
      crop
    },
    sortOrder
  }`)
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
      "newsletterTitle": ${localizeField('newsletterTitle', 'en')},
      "newsletterSubtitle": ${localizeField('newsletterSubtitle', 'zh')}
    }`,
    { lang }
  )
}

// Translations - Autocomplete
// Search translations by query prefix for autocomplete functionality
export async function searchTranslations(searchTerm, language = 'en', limit = 10) {
  try {
    // Match queries starting with search term (case-insensitive)
    // Filter by source language and order alphabetically
    const result = await client.fetch(
      `*[_type == "translation"
         && langFrom == $language
         && query match $searchPattern
      ] | order(query asc) [0...$limit] {
        query,
        translation,
        langFrom,
        langTo,
        source,
        sensitive
      }`,
      {
        language,
        searchPattern: `${searchTerm.toLowerCase()}*`,
        limit
      }
    )
    return result || []
  } catch (error) {
    console.error('Error searching translations:', error)
    return []
  }
}

// UI String Queries (Refactored into 11 singleton documents)

// Helper function to build localized field query
function buildLocalizedQuery(fields, lang = 'en') {
  return fields.map(field => `"${field}": ${localizeField(field, lang)}`).join(',\n        ')
}

// Helper for bilingual page headings — always EN for the primary heading,
// always ZH for the sub-heading, regardless of the language toggle.
function buildBilingualHeadingQuery(enFields, zhFields) {
  const en = enFields.map(f => `"${f}": ${localizeField(f, 'en')}`).join(',\n        ')
  const zh = zhFields.map(f => `"${f}": ${localizeField(f, 'zh')}`).join(',\n        ')
  return [en, zh].filter(Boolean).join(',\n        ')
}

// Homepage Strings
export async function getHomepageStrings(lang = 'en') {
  try {
    const fields = [
      'heroTitleAnimated', 'heroSubtitle',
      'aboutIntroParagraph1', 'aboutIntroParagraph2',
      'aboutButtonText', 'aboutButtonAriaLabel',
      'infoCtaParagraph1', 'infoCtaParagraph2',
      'infoCtaButton', 'infoCtaButtonAriaLabel',
      'searchTrendsDescription', 'searchTrendsViewArchiveCta',
      'newsletterHeading', 'newsletterSubheading', 'newsletterEmailPlaceholder', 'newsletterSubscribeButton'
    ]

    const result = await client.fetch(
      `*[_type == "homepageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(
          ['aboutMainHeading', 'infoCtaHeading', 'searchTrendsSectionHeading'],
          ['aboutMainHeadingZh', 'infoCtaHeadingZh', 'searchTrendsSectionHeadingZh']
        )}
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
      'searchInputPlaceholder', 'searchButton', 'compareButton', 'searchComparisonLink',
      'searchModeTooltip',
      'searchErrorEmptyQuery', 'searchErrorNetwork', 'searchErrorGeneric',
      'searchLoadingText', 'translatingText', 'translationLabel', 'errorLabel',
      'progressTranslatingCaption', 'progressSearchingGoogleCaption', 'progressSearchingBaiduCaption'
    ]

    const result = await client.fetch(
      `*[_type == "searchPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(['searchSessionHeading'], ['searchHeadingZh'])},
        "progressFillerCaptions": progressFillerCaptions[]{ "value": coalesce(@.${lang}, @.en) }.value
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
      'archiveBodyText',
      'archiveInputPlaceholder', 'archiveButton', 'searchArchiveLink', 'archiveModeTooltip',
      'queryListHeaderVotes', 'queryListHeaderQueryEn', 'queryListHeaderQueryZh',
      'queryListHeaderLocation', 'queryListHeaderDate',
      'queryListTotalResults', 'queryListNoResults', 'queryListLoadingText', 'queryListLoadMoreButton',
      'archiveFiltersButton'
    ]

    const result = await client.fetch(
      `*[_type == "archivePageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(['archivePageHeading'], ['archivePageHeadingZh'])}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching archive page strings from Sanity:', error)
    return {}
  }
}

// Events Page Strings
export async function getEventsPageStrings(lang = 'en') {
  try {
    const result = await client.fetch(
      `*[_type == "eventsPageStrings"][0] {
        "eventsIntroText": ${localizeField('eventsIntroText', lang)},
        ${buildBilingualHeadingQuery(
          ['eventsPageHeading', 'pastEventsPageHeading'],
          ['eventsPageHeadingZh', 'pastEventsPageHeadingZh']
        )}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching events page strings from Sanity:', error)
    return {}
  }
}

// Terms & Conditions Page Strings
export async function getTermsPageStrings(lang = 'en') {
  try {
    const result = await client.fetch(
      `*[_type == "termsPageStrings"][0] {
        ${buildBilingualHeadingQuery(['pageHeading'], ['pageHeadingZh'])},
        "sections": sections[]{
          "sectionHeading": coalesce(sectionHeading.${lang}, sectionHeading.en),
          "sectionBody": coalesce(sectionBody.${lang}, sectionBody.en)
        }
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching terms page strings from Sanity:', error)
    return {}
  }
}

// Partners Page Strings
export async function getPartnersPageStrings(lang = 'en') {
  try {
    const result = await client.fetch(
      `*[_type == "partnersPageStrings"][0] {
        "partnersIntroText": ${localizeField('partnersIntroText', lang)},
        ${buildBilingualHeadingQuery(['partnersPageHeading'], ['partnersPageHeadingZh'])}
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching partners page strings from Sanity:', error)
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
      'commonSuccessSaved', 'commonSuccessThankYou',
      'timeDisplayYourTime', 'timeDisplayBeijing',
      'headerUsernameLabel'
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
      'aboutPageIntro',
      'aboutRedSectionBody',
      'aboutArtistBioParagraph1', 'aboutArtistBioParagraph2', 'aboutArtistBioParagraph3',
      'aboutContributorsSectionHeading', 'aboutContributorsBody',
      'aboutCtaSectionBody', 'aboutCtaButtonText',
      'aboutLearnMoreButton', 'aboutBackToTopButton'
    ]

    const result = await client.fetch(
      `*[_type == "aboutPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(
          ['aboutPageHeading', 'aboutRedSectionHeading', 'aboutArtistSectionHeading'],
          ['aboutPageHeadingZh', 'aboutRedSectionHeadingZh', 'aboutArtistSectionHeadingZh']
        )},
        "aboutCtaSectionHeadingEn": coalesce(aboutCtaSectionHeading.en, aboutCtaSectionHeading.en),
        "aboutCtaSectionHeadingZh": coalesce(aboutCtaSectionHeading.zh, aboutCtaSectionHeading.en)
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
      'editorialIntroText',
      'editorialReadMoreButton', 'editorialListenButton', 'editorialFilterLabel',
      'editorialSortLabel', 'editorialNoArticlesMessage', 'editorialFeaturedLabel',
      'editorialFeaturedSectionBody', 'editorialArticlesHeading'
    ]

    const result = await client.fetch(
      `*[_type == "editorialPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(['editorialPageHeading'], ['editorialPageHeadingZh'])}
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
    const result = await client.fetch(
      `*[_type == "pressPageStrings"][0] {
        "pressPageHeading": coalesce(pressPageHeading.en, pressPageHeading.en),
        "pressPageHeadingZh": coalesce(pressPageHeadingZh.zh, pressPageHeadingZh.en),
        ${buildLocalizedQuery(['pressIntroText', 'pressFeaturedSectionBody', 'pressReadArticleButton', 'pressFilterAllButton', 'pressFilterEnglishButton', 'pressFilterChineseButton'], lang)}
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
      'supportIntroText', 'supportDonateText',
      'supportOption1Description',
      'supportOption2Description',
      'supportOption3Description',
      'supportDonationButton', 'supportThankYouMessage', 'supportLearnMoreButton'
    ]

    const result = await client.fetch(
      `*[_type == "supportPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(
          ['supportPageHeading', 'supportersHeading'],
          ['supportPageHeadingZh', 'supportersHeadingZh']
        )},
        "supportOption1HeadingEn": coalesce(supportOption1Heading.en, supportOption1Heading.en),
        "supportOption1HeadingZh": coalesce(supportOption1Heading.zh, supportOption1Heading.en),
        "supportOption2HeadingEn": coalesce(supportOption2Heading.en, supportOption2Heading.en),
        "supportOption2HeadingZh": coalesce(supportOption2Heading.zh, supportOption2Heading.en),
        "supportOption3HeadingEn": coalesce(supportOption3Heading.en, supportOption3Heading.en),
        "supportOption3HeadingZh": coalesce(supportOption3Heading.zh, supportOption3Heading.en)
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
      'contactFormNameLabel', 'contactFormEmailLabel', 'contactFormMessageLabel',
      'contactFormSubmitButton', 'contactFormSuccessMessage', 'contactFormErrorMessage',
      'contactPrivacyNotice'
    ]

    const result = await client.fetch(
      `*[_type == "contactPageStrings"][0] {
        ${buildLocalizedQuery(fields, lang)},
        ${buildBilingualHeadingQuery(['contactPageHeading'], ['contactPageHeadingZh'])}
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
    const result = await client.fetch(
      `*[_type == "footerStrings"][0] {
        "linkGroups": linkGroups[]{
          "links": links[]{
            "label": coalesce(label[$lang], label.en),
            path
          }
        },
        "socialLinks": socialLinks[]{ platform, url }
      }`,
      { lang }
    )
    return result || {}
  } catch (error) {
    console.error('Error fetching footer strings from Sanity:', error)
    return {}
  }
}

// Composite function: Get all UI strings (backward compatible)
// Fetches all 12 documents in parallel and combines into single flat object
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
      footer
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
      getFooterStrings(lang)
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
      ...footer
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
        "titleEn": ${localizeField('title', 'en')},
        "titleZh": ${localizeField('title', 'zh')},
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

// Homepage Images (Singleton)
// Returns all images for the homepage sections
export async function getHomepageImages() {
  try {
    const result = await client.fetch(
      `*[_type == "homepageImages"][0] {
        aboutSectionImage1 {
          default {
            asset->,
            alt,
            hotspot,
            crop
          },
          hover {
            asset->,
            alt,
            hotspot,
            crop
          },
          alt
        },
        aboutSectionImage2 {
          default {
            asset->,
            alt,
            hotspot,
            crop
          },
          hover {
            asset->,
            alt,
            hotspot,
            crop
          },
          alt
        },
        aboutSectionImage3 {
          default {
            asset->,
            alt,
            hotspot,
            crop
          },
          hover {
            asset->,
            alt,
            hotspot,
            crop
          },
          alt
        },
        searchTrendsCollage {
          asset->,
          alt,
          hotspot,
          crop
        },
        newsletterImageA {
          desktop {
            asset->,
            hotspot,
            crop
          },
          mobile {
            asset->,
            hotspot,
            crop
          },
          alt
        },
        newsletterImageB {
          desktop {
            asset->,
            hotspot,
            crop
          },
          mobile {
            asset->,
            hotspot,
            crop
          },
          alt
        },
        newsletterImageC {
          desktop {
            asset->,
            hotspot,
            crop
          },
          mobile {
            asset->,
            hotspot,
            crop
          },
          alt
        },
        newsletterImageD {
          desktop {
            asset->,
            hotspot,
            crop
          },
          mobile {
            asset->,
            hotspot,
            crop
          },
          alt
        },
        newsletterImageE {
          desktop {
            asset->,
            hotspot,
            crop
          },
          mobile {
            asset->,
            hotspot,
            crop
          },
          alt
        }
      }`
    )

    return result || null
  } catch (error) {
    console.error('Error fetching homepage images from Sanity:', error)
    return null
  }
}

// Site Assets (Singleton)
// Returns all site-wide images, logos, icons, and UI assets
export async function getSiteAssets() {
  try {
    const result = await client.fetch(
      `*[_type == "siteAssets"][0] {
        logoFull { asset->, hotspot, crop },
        logoIcon { asset->, hotspot, crop },
        facebookIcon { asset-> },
        instagramIcon { asset-> },
        youtubeIcon { asset-> },
        menuIcon { asset-> },
        closeIcon { asset-> },
        closeLargeIcon { asset-> },
        searchIcon { asset-> },
        locationIcon { asset-> },
        envelopeIcon { asset-> },
        aboutHero { asset->, hotspot, crop },
        supportHero { asset->, hotspot, crop },
        pressIcon { asset->, hotspot, crop },
        expertCommentaryIcon { asset->, hotspot, crop },
        artistHeadshot { asset->, hotspot, crop },
        archiveIcon { asset-> },
        archiveIconGrayscale { asset-> },
        eventsIcon { asset-> },
        eventsIconGrayscale { asset-> },
        pressIconNav { asset-> },
        pressIconNavGrayscale { asset-> },
        supportIconNav { asset-> },
        supportIconNavGrayscale { asset-> },
        donationIcon { asset-> },
        donationIconGrayscale { asset-> },
        sponsorIcon { asset-> },
        sponsorIconGrayscale { asset-> },
        statsIcon { asset-> },
        statsIconGrayscale { asset-> },
        timelineIcon { asset-> },
        timelineIconGrayscale { asset-> },
        searchIconColor { asset-> },
        searchIconGrayscale { asset-> },
        carouselLeftIcon { asset-> },
        carouselRightIcon { asset-> },
        arrowForwardIcon { asset-> },
        arrowLeftAltIcon { asset-> },
        arrowRightAltIcon { asset-> },
        keyboardArrowDownIcon { asset-> },
        keyboardArrowUpIcon { asset-> },
        expandCircleDownIcon { asset-> },
        expandCircleUpIcon { asset-> },
        toggleActiveIcon { asset-> },
        toggleDefaultIcon { asset-> },
        showMoreDefaultIcon { asset-> },
        showMoreActiveIcon { asset-> },
        tuneIcon { asset-> },
        cancelIcon { asset-> },
        calendarMonthIcon { asset-> },
        scheduleIcon { asset-> },
        folderOpenIcon { asset-> },
        folderOpenSearchIcon { asset-> },
        checkIcon { asset-> },
        check2CircleIcon { asset-> },
        thumbUpIcon { asset-> },
        thumbDownIcon { asset-> },
        visibilityIcon { asset-> },
        visibilityOffIcon { asset-> },
        howToVoteIcon { asset-> },
        lostInTranslationIcon { asset-> },
        questionIcon { asset-> },
        questionRedIcon { asset-> },
        brightness2Icon { asset-> },
        priorityIcon { asset-> },
        imageSearchIcon { asset-> },
        imagesModeIcon { asset-> },
        fullscreenExitIcon { asset-> },
        disabledByDefaultIcon { asset-> },
        brokenImagePlaceholder { asset-> },
        brokenImagePlaceholderPadding { asset-> },
        brokenImageGrayscale { asset-> },
        censoredImagePlaceholder { asset-> },
        censoredImagePlaceholderPadding { asset-> },
        censoredBrokenImage { asset-> },
        noImageAvailable { asset-> },
        googleLogoLong { asset-> },
        googleLogoBlue { asset-> },
        googleLogoRed { asset-> },
        baiduLogoLong { asset-> },
        baiduLogoRed { asset-> },
        translateIcon { asset-> },
        translateIconBlack { asset-> },
        spinnerIcon { asset-> }
      }`
    )

    return result || null
  } catch (error) {
    console.error('Error fetching site assets from Sanity:', error)
    return null
  }
}

// ========== EDITORIAL ARTICLES ==========

/**
 * Fetch all editorial articles
 * @param {Object} options - Query options
 * @param {boolean} options.featuredOnly - Only return featured articles
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} Array of editorial articles
 */
export async function getEditorialArticles({ featuredOnly = false, limit = null } = {}) {
  try {
    const featuredFilter = featuredOnly ? '&& featured == true' : ''
    const limitClause = limit ? `[0...${limit}]` : ''

    const query = `*[_type == "editorialArticle" ${featuredFilter}] | order(publishedDate desc) ${limitClause} {
      _id,
      title,
      titleZh,
      slug,
      publishedDate,
      readTime,
      featured,
      excerpt,
      excerptZh,
      tags,
      authorName,
      authorBio,
      authorImage {
        asset->,
        hotspot,
        crop
      },
      metaDescription
    }`

    return client.fetch(query)
  } catch (error) {
    console.error('Error fetching editorial articles:', error)
    return []
  }
}

/**
 * Fetch a single editorial article by slug
 * @param {string} slug - Article slug
 * @returns {Promise<Object|null>} Editorial article or null
 */
export async function getEditorialArticleBySlug(slug) {
  try {
    const query = `*[_type == "editorialArticle" && slug.current == $slug][0] {
      _id,
      title,
      titleZh,
      slug,
      publishedDate,
      readTime,
      featured,
      excerpt,
      excerptZh,
      body,
      bodyZh,
      tags,
      authorName,
      authorBio,
      authorBioZh,
      authorImage {
        asset->,
        hotspot,
        crop
      },
      authorSocial[] {
        platform,
        url
      },
      nextArticleSlug,
      previousArticleSlug,
      metaDescription
    }`

    return client.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching editorial article:', error)
    return null
  }
}

// ========== FEATURED PRESS ARTICLE ==========

export async function getFeaturedPressArticle(lang = 'en') {
  try {
    const result = await client.fetch(
      `*[_type == "featuredPressArticle"][0] {
        "featuredLabel": ${localizeField('featuredLabel', lang)},
        "articleTitle": ${localizeField('articleTitle', 'en')},
        "articleTitleZh": ${localizeField('articleTitleZh', 'zh')},
        "excerpt": ${localizeField('excerpt', lang)},
        externalUrl,
        publication,
        "readArticleLabel": ${localizeField('readArticleLabel', lang)},
        image {
          asset->,
          hotspot,
          crop,
          alt
        }
      }`,
      { lang }
    )
    return result || null
  } catch (error) {
    console.error('Error fetching featured press article from Sanity:', error)
    return null
  }
}

/**
 * Fetch the featured editorial article
 * @returns {Promise<Object|null>} Featured editorial article or null
 */
export async function getFeaturedEditorialArticle() {
  try {
    const articles = await getEditorialArticles({ featuredOnly: true, limit: 1 })
    return articles.length > 0 ? articles[0] : null
  } catch (error) {
    console.error('Error fetching featured editorial article:', error)
    return null
  }
}
