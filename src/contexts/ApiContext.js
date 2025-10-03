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
    const response = await fetch('/images', { ...defaultConfig, ...options });

    const results = await response.json();
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
