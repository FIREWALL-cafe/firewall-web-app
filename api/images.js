// Vercel Function to handle image search requests
// Implements Google and Baidu search directly without Express server dependency

// Helper functions for search providers
async function getGoogleImagesSerper(query) {
  console.log('Fetching Google images via Serper.dev for:', query);

  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query,
      num: 10,
      gl: 'us',
      hl: 'en'
    })
  });

  console.log('Serper.dev response received, status:', response.status);

  const data = await response.json();

  if (!response.ok) {
    console.error('Serper.dev error response:', data);
    throw new Error(`Serper.dev API returned ${response.status}: ${JSON.stringify(data)}`);
  }

  // Extract image URLs from Serper response
  const images = data.images || [];
  const results = images
    .filter(img => img && img.imageUrl) // Filter out invalid images
    .slice(0, 9) // Limit to 9 images
    .map(img => img.imageUrl);

  console.log(`Successfully fetched ${results.length} Google images`);
  return results;
}

async function getBaiduImages(query) {
  console.log('Fetching Baidu images for:', query);

  const url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&word=${encodeURI(query)}&pn=0&rn=30`;

  try {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36 EdgA/46.1.2.5140',
        'Cookie': 'BAIDUID=DA3AF7E580B9999700832FE88F5B01DA:FG=1; BAIDUID_BFESS=DA3AF7E580B9999700832FE88F5B01DA:FG=1; H_WISE_SIDS=62325_62842_62967_62999;'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Baidu API returned ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);
    const images = data.data || [];

    const results = images
      .filter(img => img && img.thumbURL) // Filter out invalid images
      .slice(0, 9) // Limit to 9 images
      .map(img => img.thumbURL);

    console.log(`Successfully fetched ${results.length} Baidu images`);
    return results;

  } catch (error) {
    console.warn('Baidu image search failed:', error.message);

    // If it's a timeout/abort error, return error info along with empty results
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      return {
        images: [],
        timeout: true,
        url: url,
        error: 'Baidu request timeout'
      };
    }

    // Return empty array as fallback instead of throwing
    // This allows Google results to still be processed and saved
    return [];
  }
}

async function detectLanguage(query) {
  console.log('Detecting language for:', query);
  const url = `https://babelfish.firewallcafe.com/detect-language?query=${encodeURIComponent(query)}`;
  console.log('Language detection URL:', url);

  const response = await fetch(url);
  console.log('Language detection response status:', response.status);

  const data = await response.json();
  console.log('Language detection response data:', data);

  return data;
}

async function translateText(query, langFrom, langTo) {
  console.log('Translating from', langFrom, 'to', langTo);

  // Use the same format as the working local implementation
  const body = `query=${encodeURIComponent(query)}&searchEngine=google&secret=${process.env.SHARED_SECRET}&langFrom=${langFrom}&langTo=${langTo}`;
  console.log('Translation request body:', body);
  console.log('SHARED_SECRET exists:', !!process.env.SHARED_SECRET);

  const response = await fetch('https://babelfish.firewallcafe.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body
  });

  console.log('Translation response status:', response.status);

  const data = await response.json();
  console.log('Translation response data:', data);

  return data.translated;
}

async function saveSearchResults({ query, google, baidu, langTo, langFrom, search_client_name, search_ip_address, translation }) {
  console.log('Saving search results for:', query);

  const backendUrl = process.env.BACKEND_API_URL;
  console.log('Backend URL for save:', backendUrl);

  const imageData = {
    timestamp: Date.now(),
    location: process.env.LOCATION,
    search_client_name: search_client_name,
    search_ip_address: search_ip_address,
    secret: process.env.API_SECRET,
    search_engine: 'google',
    search: query,
    translation,
    lang_from: langFrom,
    lang_to: langTo,
    lang_confidence: '1.0',
    lang_alternate: null,
    lang_name: langFrom === 'en' ? 'English' : langFrom,
    google_images: google.slice(0, 9),
    baidu_images: baidu.slice(0, 9)
  };

  const response = await fetch(`${backendUrl}saveSearchAndImages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData)
  });
  console.log('Save response status:', response.status);

  const result = await response.json();
  return { searchId: result.searchId };
}

// Main handler function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { query, search_client_name } = req.body;

    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    console.log('Processing search for:', query);

    // 1. Detect language using the same API as local
    let langFrom, langTo;
    try {
      const detectedLang = await detectLanguage(query);
      langFrom = detectedLang.language === 'zh-CN' ? 'zh-CN' : 'en';
      langTo = langFrom === 'en' ? 'zh-CN' : 'en';
      console.log('Language detection successful:', detectedLang.language, '->', langFrom, 'to', langTo);
    } catch (error) {
      console.warn('Language detection failed, using fallback:', error.message);
      // Fallback to regex detection like before
      langFrom = /[\u4e00-\u9fff]/.test(query) ? 'zh-CN' : 'en';
      langTo = langFrom === 'en' ? 'zh-CN' : 'en';
      console.log('Fallback language detection:', langFrom, 'to', langTo);
    }

    // 2. Translate query
    let translatedQuery;
    try {
      translatedQuery = await translateText(query, langFrom, langTo);
      console.log('Translation successful:', query, '->', translatedQuery);
    } catch (error) {
      console.warn('Translation failed, using fallback:', error.message);
      // Fallback to mock translation if translation service fails
      translatedQuery = langFrom === 'en' ? '测试' : 'test';
    }

    const enQuery = langFrom === 'en' ? query : translatedQuery;
    const cnQuery = langTo === 'zh-CN' ? translatedQuery : query;
    console.log('Search queries - English:', enQuery, 'Chinese:', cnQuery);

    // 3. Search both engines in parallel with fallback handling
    console.log('Starting parallel search for Google and Baidu...');
    const [googleResults, baiduResults] = await Promise.allSettled([
      getGoogleImagesSerper(enQuery),
      getBaiduImages(cnQuery),
    ]);
    console.log('Parallel search completed');

    const finalGoogleResults = googleResults.status === 'fulfilled' ? googleResults.value : [];
    let finalBaiduResults = [];
    let baiduTimeoutInfo = null;

    if (baiduResults.status === 'fulfilled') {
      const baiduResponse = baiduResults.value;

      // Check if it's a timeout response object or regular array
      if (baiduResponse && baiduResponse.timeout) {
        finalBaiduResults = baiduResponse.images || [];
        baiduTimeoutInfo = {
          url: baiduResponse.url,
          error: baiduResponse.error
        };
      } else if (Array.isArray(baiduResponse)) {
        finalBaiduResults = baiduResponse;
      }
    }

    if (googleResults.status === 'rejected') {
      console.error('Google search failed:', googleResults.reason);
    }
    if (baiduResults.status === 'rejected') {
      console.error('Baidu search failed:', baiduResults.reason);
    }

    // Log timeout URL for debugging
    if (baiduTimeoutInfo) {
      console.warn('Baidu search timed out. URL:', baiduTimeoutInfo.url);
    }

    console.log('Search results - Google:', finalGoogleResults.length, 'Baidu:', finalBaiduResults.length);

    // Check if we have any results at all
    if (finalGoogleResults.length === 0 && finalBaiduResults.length === 0) {
      console.warn('No images found for query:', query);
      return res.status(404).json({
        error: 'No images found',
        message: `No images found for "${query}"`,
        query: query,
        translation: translatedQuery
      });
    }

    // Don't create placeholder objects - just use the empty array
    // The backend will handle missing Baidu results
    let processedBaiduResults = finalBaiduResults;

    // 4. Extract client IP (Vercel provides this in headers)
    const clientIp = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     req.connection?.remoteAddress ||
                     '127.0.0.1';

    // 5. Save results to database (with fallback)
    let searchId = null;
    try {
      const saveResult = await saveSearchResults({
        query,
        google: finalGoogleResults,
        baidu: processedBaiduResults,
        langTo,
        langFrom,
        search_client_name,
        search_ip_address: clientIp,
        translation: translatedQuery
      });
      searchId = saveResult.searchId;
      console.log('Search saved with ID:', searchId, 'and IP:', clientIp);
    } catch (saveError) {
      console.warn('Failed to save search results:', saveError.message);
      console.log('Continuing with search results despite save failure');
      // Continue without searchId - still return results to user
    }

    // 6. Return results (always return results, even if save failed)
    const response = {
      searchId,
      googleResults: finalGoogleResults,
      baiduResults: processedBaiduResults,
      translation: translatedQuery,
      ...(baiduTimeoutInfo ? { baiduTimeout: baiduTimeoutInfo } : {})
    };

    const resultCount = finalGoogleResults.length + processedBaiduResults.length;
    console.log(`Search completed successfully, ${finalGoogleResults.length} Google + ${processedBaiduResults.length} Baidu = ${resultCount} total results`);
    console.log('Returning response:', JSON.stringify({
      searchId: response.searchId,
      googleCount: response.googleResults.length,
      baiduCount: response.baiduResults.length,
      hasTranslation: !!response.translation,
      hasBaiduTimeout: !!response.baiduTimeout
    }));
    res.status(200).json(response);

  } catch (error) {
    console.error('Image search error:', error);
    res.status(400).json({
      error: error.message || 'Failed to process search request',
      details: error.toString()
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
