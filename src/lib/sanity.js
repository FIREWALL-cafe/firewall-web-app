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
