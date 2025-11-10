/**
 * Translation API configuration utilities
 * Provides base URL and request handling for translation API endpoints
 */

/**
 * Gets the base URL for the translation API
 * Reads from TRANSLATION_API_URL environment variable
 * Falls back to default URL if not set
 * @returns {string} Base URL for translation API
 */
function getTranslationApiUrl() {
  return process.env.TRANSLATION_API_URL;
}

/**
 * Detects the language of a query string
 * @param {string} query - Query string to detect language for
 * @returns {Promise<Object>} Language detection result with language property
 */
export async function detectLanguage(query) {
  console.log('Detecting language for:', query);
  const baseUrl = getTranslationApiUrl();
  const url = `${baseUrl}/detect-language?query=${encodeURIComponent(query)}`;
  console.log('Language detection URL:', url);

  const response = await fetch(url);
  console.log('Language detection response status:', response.status);

  const data = await response.json();
  console.log('Language detection response data:', data);

  return data;
}

/**
 * Translates text from one language to another
 * @param {string} query - Text to translate
 * @param {string} langFrom - Source language code (e.g., 'en', 'zh-CN')
 * @param {string} langTo - Target language code (e.g., 'en', 'zh-CN')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(query, langFrom, langTo) {
  console.log('Translating from', langFrom, 'to', langTo);

  const baseUrl = getTranslationApiUrl();
  const body = `query=${encodeURIComponent(query)}&searchEngine=google&secret=${process.env.SHARED_SECRET}&langFrom=${langFrom}&langTo=${langTo}`;
  console.log('Translation request body:', body);
  console.log('SHARED_SECRET exists:', !!process.env.SHARED_SECRET);

  const response = await fetch(`${baseUrl}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  });

  console.log('Translation response status:', response.status);

  const data = await response.json();
  console.log('Translation response data:', data);

  return data.translated;
}

