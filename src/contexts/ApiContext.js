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

    // Encode query parameter if present
    if (queryParams.query) {
      queryParams.query = encodeURIComponent(queryParams.query.trim());
    }

    // Use /searches/filter endpoint when filters are present, otherwise use /searches
    const hasFilters = queryParams.vote_ids || queryParams.search_locations ||
                      queryParams.us_states || queryParams.countries ||
                      queryParams.years || queryParams.start_date || queryParams.end_date;

    const endpoint = hasFilters ? '/searches/filter' : '/searches';
    const url = `${endpoint}?${querystring.stringify(queryParams)}`;

    const response = await fetch(url, { method: 'GET', headers: defaultConfig.headers });

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

    const results = await response.json();

    // Handle 404 - No images found
    if (response.status === 404 || results.error === 'No images found') {
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
  searchImages,
  searchArchive,
  getDashboard,
});

export default ApiContext;
