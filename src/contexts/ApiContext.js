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
    const queryParams = options.query
      ? { query: encodeURIComponent(options.query.trim()) }
      : { ...options };

    const url = `/searches?${querystring.stringify(queryParams)}`;

    const response = await fetch(url, defaultConfig);

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
