import { createContext } from 'react';
import querystring from 'querystring';

const defaultConfig = {
  method: 'post',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const searchArchive = async options => {
  try {
    const queryParams = { ...options };

    if (queryParams.query) {
      queryParams.query = queryParams.query.trim();
    }

    // Determine which filters are active (excluding keyword)
    // Note: empty arrays are truthy in JS, so check .length for array params
    const hasOtherFilters =
      (queryParams.vote_ids && queryParams.vote_ids.length > 0) ||
      (queryParams.search_locations && queryParams.search_locations.length > 0) ||
      (queryParams.us_states && queryParams.us_states.length > 0) ||
      (queryParams.countries && queryParams.countries.length > 0) ||
      (queryParams.years && queryParams.years.length > 0) ||
      queryParams.start_date || queryParams.end_date;

    let endpoint;
    let params;

    if (queryParams.query && !hasOtherFilters) {
      // Keyword-only search → /searches/terms (language-aware full-text search)
      endpoint = '/searches/terms';
      params = {
        term: queryParams.query,
        page: queryParams.page,
        page_size: queryParams.page_size,
      };
    } else if (queryParams.query || hasOtherFilters) {
      // Keyword + filters, or filters only → /searches/filter
      endpoint = '/searches/filter';
      params = queryParams;
    } else {
      // No keyword, no filters → /searches (default pagination)
      endpoint = '/searches';
      params = queryParams;
    }

    const url = `${endpoint}?${querystring.stringify(params)}`;

    const response = await fetch(url, { method: 'GET', headers: defaultConfig.headers });

    const results = await response.json();
    return results;
  } catch (error) {
    // Handle error silently
    throw error;
  }
};

const translateQuery = async query => {
  try {
    const response = await fetch('/api/translate', {
      ...defaultConfig,
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Translation failed with status ${response.status}`);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    // Handle error silently
    throw error;
  }
};

const searchImages = async options => {
  try {
    const response = await fetch('/api/images', { ...defaultConfig, ...options });

    // Handle 404 - No images found
    if (response.status === 404) {
      return {
        error: 'No images found',
        message: 'No images found for this search',
        query: '',
        translation: ''
      };
    }

    const results = await response.json();

    // Handle error responses
    if (results.error === 'No images found') {
      return {
        error: results.error || 'No images found',
        message: results.message,
        query: results.query,
        translation: results.translation
      };
    }

    // Log Baidu timeout URL to browser console for debugging
    if (results.baiduTimeout) {
      console.error('Baidu search timeout detected. URL:', results.baiduTimeout.url);
      console.error('Error:', results.baiduTimeout.error);
    }

    return results;
  } catch (error) {
    // Handle error silently
    throw error;
  }
};

const getDashboard = async () => {
  try {
    const response = await fetch('/dashboardData', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error silently
    throw error;
  }
};

const ApiContext = createContext({
  translateQuery,
  searchImages,
  searchArchive,
  getDashboard,
});

export default ApiContext;
