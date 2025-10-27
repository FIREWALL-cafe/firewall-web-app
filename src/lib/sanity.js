import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
// You'll need to create a Sanity project at sanity.io and add these values to .env.local
export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
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

// Localized event queries
export async function getLocalizedEvents(lang = 'en') {
  return client.fetch(
    `*[_type == "eventLocalized"] | order(_createdAt desc) {
      _id,
      _type,
      slug,
      "title": ${localizeField('title', lang)},
      date,
      exhibition,
      lecture,
      archiveLink,
      location {
        "name": ${localizeField('name', lang)},
        address,
        mapLink
      },
      "description": description.${lang},
      images[] {
        src,
        "alt": ${localizeField('alt', lang)},
        "caption": ${localizeField('caption', lang)}
      }
    }`,
    { lang }
  )
}

export async function getLocalizedEventBySlug(slug, lang = 'en') {
  return client.fetch(
    `*[_type == "eventLocalized" && slug.current == $slug][0] {
      _id,
      _type,
      slug,
      "title": ${localizeField('title', lang)},
      date,
      exhibition,
      lecture,
      opening,
      hours,
      archiveLink,
      location {
        "name": ${localizeField('name', lang)},
        address,
        mapLink
      },
      "curators": ${localizeField('curators', lang)},
      "description": description.${lang},
      links,
      images[] {
        src,
        "alt": ${localizeField('alt', lang)},
        "caption": ${localizeField('caption', lang)}
      }
    }`,
    { slug, lang }
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

// Localized partner queries
export async function getLocalizedPartners(lang = 'en') {
  return client.fetch(
    `*[_type == "partnerLocalized"] | order(sortOrder asc) {
      _id,
      name,
      url,
      "description": ${localizeField('description', lang)},
      logo,
      sortOrder
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
