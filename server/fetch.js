const axios = require('axios');
const fetch = require('node-fetch')
const querystring = require('querystring');
const cheerio = require('cheerio');
const { getJson } = require("serpapi");
const serverConfig = require('./config');

const getTranslationUrl = endpoint => `https://babelfish.firewallcafe.com/${endpoint}`;

const fetchResponseJson = async (url, config = {}) => {
  const response = await fetch(url, config);
  const body = await response.json();
  return body;
}

const fetchResponseText = async (url, config = {}) => {
  const response = await fetch(url, config);
  const body = await response.text();
  return body;
}

const getDashboardData = async () => {
  const url = `${serverConfig.apiUrl}dashboard`;
  const { data } = await axios.get(url);
  return data;
}

const getGoogleImageSrcs = (results) => {
  console.log('getGoogleImageSrcs (SerpAPI)');
  // const html = cheerio.load(results);
  // const imgs = html('.DS1iW').toArray().slice(0, 9);
  // const imgs = html('div.H8Rx8c g-img img').toArray().slice(0, 9);
  // const imgs = html('div[jscontroller] a[jsname] img').toArray().slice(0, 9);
  return results.slice(0, 9).map((result) => result.original)
};

const getSerperImageSrcs = (results) => {
  console.log('getSerperImageSrcs (Serper.dev)');
  if (!results) return [];
  return results.slice(0, 9).map((result) => result.imageUrl);
};

const getBaiduImageSrcs = (results) => {
  console.log('getBaiduImageSrcs');
  const html = cheerio.load(results);
  const dataScript = html('#image-search-data script[type="application/json"]').html();
  if (!dataScript) return [];
  
  try {
    const { data: { images } } = JSON.parse(dataScript);
    return images
      .slice(0, 9)
      .map(img => img?.objURL || img?.thumburl);
  } catch (error) {
    console.error('Error parsing Baidu image data:', error);
    return [];
  }
}

/**
 * Fetches images from Google based on a provided query string
 * @param {string} query 
 * @returns array of image urls from Google
 */
const getGoogleImages = async (query) => {
  console.log('fetching google images for', query);
  console.log('using provider:', serverConfig.imageSearchProvider);
  
  // Use new provider system with fallback
  try {
    if (serverConfig.imageSearchProvider === 'serper') {
      return await getGoogleImagesSerper(query);
    } else {
      return await getGoogleImagesSerpApi(query);
    }
  } catch (error) {
    console.error('Primary image provider failed, trying fallback:', error);
    
    // Fallback to SerpAPI if Serper fails
    if (serverConfig.imageSearchProvider === 'serper') {
      console.log('Falling back to SerpAPI...');
      return await getGoogleImagesSerpApi(query);
    } else {
      // If SerpAPI was primary and failed, try Serper as fallback
      console.log('Falling back to Serper...');
      return await getGoogleImagesSerper(query);
    }
  }
};

/**
 * Fetches images using Serper.dev API
 * @param {string} query 
 * @returns array of image urls from Serper
 */
const getGoogleImagesSerper = async (query) => {
  console.log('fetching images via Serper.dev for', query);
  
  const response = await axios.post('https://google.serper.dev/images', {
    q: query,
    num: 10,
    gl: 'us',
    hl: 'en'
  }, {
    headers: {
      'X-API-KEY': serverConfig.serperApiKey,
      'Content-Type': 'application/json'
    }
  });
  
  return getSerperImageSrcs(response.data.images) || [];
};

/**
 * Fetches images using SerpAPI (original implementation)
 * @param {string} query 
 * @returns array of image urls from SerpAPI
 */
const getGoogleImagesSerpApi = async (query) => {
  console.log('fetching images via SerpAPI for', query);
  
  const params = {
    q: query,
    engine: "google_images",
    ijn: "0",
    api_key: serverConfig.serpApiKey,
  };

  const results = await getJson(params);
  return getGoogleImageSrcs(results["images_results"]) || [];
};

/**
 * Fetches images from Baidu based on a provided query string
 * @param {string} query
 * @returns array of image urls from Baidu
 */
const getBaiduImages = async (query) => {
  // const url = `https://image.baidu.com/search/index?tn=baiduimage&word=${encodeURI(query)}`;
  const json_url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&word=${encodeURI(query)}&pn=0&rn=30`

  const config = {
    cache: 'no-cache',
    mode: 'cors',
    timeout: 3000, // Add 10 second timeout
    headers: {
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36 EdgA/46.1.2.5140',
      // Occasionally this Cookie needs to be set.
      // Regenerate a new one by making the request in Postman (don't forget to set the custom headers above).
      // Copy and paste the auto-populated Cookie value from the Headers tab here:
      'Cookie': 'BAIDUID=DA3AF7E580B9999700832FE88F5B01DA:FG=1; BAIDUID_BFESS=DA3AF7E580B9999700832FE88F5B01DA:FG=1; H_WISE_SIDS=62325_62842_62967_62999;'
    },
  };

  console.log('fetching baidu images for', query, json_url);

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Baidu request timeout')), 10000)
    );

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(json_url, config),
      timeoutPromise
    ]);

    if (!response.ok) {
      throw new Error(`Baidu API returned status ${response.status}`);
    }

    // Get response as text first to handle potential JSON parsing issues
    const responseText = await response.text();

    // First, try direct extraction of image URLs which is more reliable
    try {
      const urls = [];
      // Match thumbURL, middleURL, or objURL fields
      const urlPattern = /"(thumbURL|middleURL|objURL)"\s*:\s*"(https?:\/\/[^"]*)"/g;
      let match;
      const seenUrls = new Set(); // Avoid duplicates

      while ((match = urlPattern.exec(responseText)) !== null) {
        const url = match[2];
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          urls.push(url);

          // Stop after collecting 9 unique URLs
          if (urls.length >= 9) {
            break;
          }
        }
      }

      if (urls.length > 0) {
        console.log(`Successfully extracted ${urls.length} Baidu images`);
        return urls;
      }
    } catch (extractError) {
      console.error('URL extraction failed:', extractError.message);
    }

    // Fallback: try to parse as JSON (in case Baidu fixes their API)
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      // Try with some basic cleanup
      try {
        const cleanedText = responseText
          .replace(/^\uFEFF/, '') // Remove BOM
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove most control chars except \t \n \r

        json = JSON.parse(cleanedText);
      } catch (cleanupParseError) {
        console.error('Failed to parse Baidu response as JSON');
        return [];
      }
    }

    if (!json || !json.data || !Array.isArray(json.data)) {
      console.error('Unexpected Baidu response structure');
      return [];
    }

    console.log('Successfully fetched', json.data.length, 'Baidu images');
    return json.data.map(item => item.thumbURL || item.middleURL || item.objURL).filter(Boolean).slice(0, 9) || [];
  } catch (error) {
    console.error('Error fetching baidu images:', error.message);

    // If it's a timeout error, return error info along with empty results
    if (error.message === 'Baidu request timeout') {
      return {
        images: [],
        timeout: true,
        url: json_url,
        error: 'Baidu request timeout'
      };
    }

    // Return empty array on any other error to allow the app to continue functioning
    return [];
  }
};

const getDetectedLanguage = async (query) => {
  return await fetchResponseJson(getTranslationUrl(`detect-language?query=${query}`));
}

const getTranslation = async (query, langFrom, langTo) => {
  const config = {
    method: 'POST',
    url: getTranslationUrl('translate'),
    // write data as a query string because that's what babelfish expects
    data: `query=${query}&searchEngine=google&secret=${serverConfig.sharedSecret}&langFrom=${langFrom}&langTo=${langTo}`,
  };

  // use axios because bablefish expects the data key to be present
  const response = await axios(config);
  const { translated } = response.data;
  return translated;
}

const postVote = async ({ meta_key, search_id, vote_client_name, vote_ip_address }) => {
  const url = `${serverConfig.apiUrl}vote`;
  const metaKeyToId = {
    votes_censored: 1,
    votes_uncensored: 2,
    votes_bad_translation: 3,
    votes_good_translation: 4,
    votes_lost_in_translation: 5,
    votes_bad_result: 6,
    votes_nsfw: 7,
  }

  const voteData = {
    vote_id: metaKeyToId[meta_key],
    search_id,
    vote_timestamp: Date.now(),
    vote_client_name: vote_client_name,
    secret: serverConfig.apiSecret,
    vote_ip_address: vote_ip_address,
  }

  console.log('vote data', url, voteData);
  const { data } = await axios.post(url, voteData);

  console.log('vote successful', data);

  return data;
}

const transformImgData = imgArray => JSON.stringify(imgArray.map(img => ({ href: img, src: img })));

const getSearchImages = async (search_id) => {
  console.log('search images for', search_id);

  const url = `${serverConfig.apiUrl}images/search_id/${search_id}`;
  const { data } = await axios.get(url);

  return data;
}

const getSearchesByTerm = async (query, options = {}) => {
  // Ensure pagination parameters are present
  const page = parseInt(options.page) || 1;
  const page_size = parseInt(options.page_size) || 25;
  
  const { language } = await getDetectedLanguage(query);
  // we only support zh-CN and en right now
  const lang = language === 'zh-CN' ? 'zh-CN' : 'en';
  
  // Add pagination, query, and language to parameters
  const queryParams = {
    term: query,
    page,
    page_size,
    lang,
    ...options
  };
  
  const url = `${serverConfig.apiUrl}searches/terms?${querystring.stringify(queryParams)}`;
  const response = await axios.get(url);


  return response.data;
}

const getSearchesFilter = async (filterOptions) => {
  
  // Ensure pagination parameters are present
  const page = parseInt(filterOptions.page) || 1;
  const page_size = parseInt(filterOptions.page_size) || 25;
  
  // Add pagination to query string
  const queryParams = {
    ...filterOptions,
    page,
    page_size
  };
  
  const url = `${serverConfig.apiUrl}searches/filter?${querystring.stringify(queryParams)}`;

  const { data } = await axios.get(url);

  // If the API doesn't return paginated data, we'll handle pagination here
  if (!data.total && Array.isArray(data)) {
    const total = data.length;
    const start = (page - 1) * page_size;
    const end = start + page_size;
    
    return {
      total,
      page,
      page_size,
      data: data.slice(start, end)
    };
  }

  return data;
}

const saveImages = async ({ query, google, baidu, langTo, langFrom, search_client_name, search_ip_address, translation }) => {
  
  const url = `${serverConfig.apiUrl}saveSearchAndImages`;
  const imageData = {
    timestamp: Date.now(),
    location: serverConfig.location,
    search_client_name: search_client_name,
    search_ip_address: search_ip_address,
    secret: serverConfig.apiSecret,
    search_engine: 'google',
    search: query,
    translation,
    lang_from: langFrom,
    lang_to: langTo,
    lang_confidence: '1.0',
    lang_alternate: null,
    lang_name: langFrom === 'en' ? 'English' : langFrom,
    banned: baidu.length === 0, // TODO: find a better way to identify banned terms
    sensitive: false,
    google_images: google, // transform array of url strings to objects
    baidu_images: baidu,
  };

  const { data } = await axios.post(
    url,
    imageData,
    {
      headers: {
        'Content-Type': 'application/json',
      }
  });

  
  return data;
}

const getSearchVoteCounts = async (search_id) => {
  const url = `${serverConfig.apiUrl}searches/votes/counts/${search_id}`;
  const { data } = await axios.get(url);
  return data;
}

const getUSStatesAnalytics = async () => {
  const url = `${serverConfig.apiUrl}analytics/geographic/us-states`;
  const { data } = await axios.get(url);
  return data;
}

const getSearchLocations = async () => {
  const url = `${serverConfig.apiUrl}search-locations`;
  const { data } = await axios.get(url);
  return data;
}

module.exports = {
  getDashboardData,
  getGoogleImages,
  getBaiduImages,
  getDetectedLanguage,
  getSearchImages,
  getSearchesByTerm,
  getSearchesFilter,
  getTranslation,
  postVote,
  saveImages,
  getSearchVoteCounts,
  getUSStatesAnalytics,
  getSearchLocations,
};
