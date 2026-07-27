// Vercel Function to handle image search requests
// Implements Google and Baidu search directly without Express server dependency

async function withRetry(fn, delay = 1000) {
  try {
    return await fn();
  } catch (firstErr) {
    console.warn('Translation attempt failed, retrying in 1s:', firstErr.message);
    await new Promise(r => setTimeout(r, delay));
    return await fn();
  }
}

import { fetchWithFallback } from './lib/proxy.js';
import { waitUntil } from '@vercel/functions';

// Helper functions for search providers
async function getGoogleImagesSerper(query) {
  console.log('Fetching Google images via Serper.dev for:', query);

  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 9,
      gl: 'us',
      hl: 'en',
    }),
  });

  console.log('Serper.dev response received, status:', response.status);

  const data = await response.json();

  if (!response.ok) {
    console.error('Serper.dev error response:', data);
    throw new Error(`Serper.dev API returned ${response.status}: ${JSON.stringify(data)}`);
  }

  // Extract image + source page URLs from Serper response.
  // `imageUrl` is the image file; `link` is the web page it was found on.
  const images = data.images || [];
  const results = images
    .filter(img => img && img.imageUrl) // Filter out invalid images
    .slice(0, 9) // Limit to 9 images
    .map(img => ({ image: img.imageUrl, source: img.link || null }));

  console.log(`Successfully fetched ${results.length} Google images`);
  return results;
}

// Emits one structured, greppable log line capturing the raw shape of a Baidu
// response. Purpose: collect ground-truth data (benign vs. sensitive terms) so we
// can later distinguish genuine censorship (opaque zero results / state-media-only
// results) from bot-blocks (`antiFlag`) and technical failures. Observability only
// — this does NOT change what getBaiduImages returns. Grep Vercel logs for
// "[BAIDU_PROBE]" to collect the dataset.
function logBaiduProbe(fields) {
  try {
    console.log('[BAIDU_PROBE]', JSON.stringify({ ts: Date.now(), ...fields }));
  } catch (e) {
    console.warn('[BAIDU_PROBE] failed to serialize probe log:', e.message);
  }
}

// Pulls the source-page hostname for each image. Used to spot "soft censorship",
// where Baidu returns results but only from authorized/state-media domains.
function extractSourceDomains(images) {
  return images.slice(0, 9).map(img => {
    const src =
      (img.replaceUrl && img.replaceUrl[0] && img.replaceUrl[0].FromURL) || img.fromURL || '';
    const m = /^https?:\/\/([^/]+)/.exec(src);
    return m ? m[1] : null;
  });
}

// Selected response headers worth recording: censorship-relevant Baidu headers and
// Bright Data proxy error signals.
function baiduHeaderSubset(response) {
  return {
    search_result: response.headers.get('Search_result'),
    bdqid: response.headers.get('Bdqid'),
    content_type: response.headers.get('Content-Type'),
    content_length: response.headers.get('Content-Length'),
    x_brd_err_code: response.headers.get('x-brd-err-code'),
    x_brd_err_msg: response.headers.get('x-brd-err-msg'),
    proxy_status: response.headers.get('Proxy-Status'),
  };
}

async function getBaiduImages(query) {
  console.log('Fetching Baidu images for:', query);

  const url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&word=${encodeURI(query)}&pn=0&rn=9`;

  try {
    // Configure fetch options with realistic browser headers
    // Note: fetchWithFallback handles timeouts internally (2s direct, 18s proxy)
    const fetchOptions = {
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: 'https://image.baidu.com/',
        Origin: 'https://image.baidu.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    console.log('Initiating fetch to Baidu (direct first, fallback to proxy)...');
    // Use fetchWithFallback which tries direct first, then proxy
    const response = await fetchWithFallback(url, fetchOptions);
    console.log('Baidu fetch completed, status:', response.status);

    const fetchPath = response.fwFetchPath || 'unknown';
    const headers = baiduHeaderSubset(response);

    // Check for Bright Data proxy errors (even on 200 responses)
    const brdErrorCode = response.headers.get('x-brd-err-code');
    const brdErrorMsg = response.headers.get('x-brd-err-msg');
    const proxyStatus = response.headers.get('Proxy-Status');

    if (brdErrorCode || proxyStatus) {
      logBaiduProbe({
        query,
        fetchPath,
        httpStatus: response.status,
        classification: 'proxy_error',
        headers,
      });
      console.warn('========== BRIGHT DATA PROXY ERROR ==========');
      console.warn('BrightData Error Code:', brdErrorCode);
      console.warn('BrightData Error Message:', brdErrorMsg);
      console.warn('Proxy-Status Header:', proxyStatus);
      console.warn('============================================');

      return { images: [], probe: { classification: 'proxy_error', listNum: null } };
    }

    if (!response.ok) {
      logBaiduProbe({
        query,
        fetchPath,
        httpStatus: response.status,
        classification: 'http_error',
        headers,
      });
      return { images: [], probe: { classification: 'http_error', listNum: null } };
    }

    console.log('Reading response body...');
    const text = await response.text();
    console.log('Response body length:', text.length);

    // Parse defensively so we can still log the raw body shape on malformed responses.
    let data = null;
    let parseOk = false;
    try {
      data = JSON.parse(text);
      parseOk = true;
    } catch {
      /* handled below via probe log */
    }

    if (!parseOk) {
      logBaiduProbe({
        query,
        fetchPath,
        httpStatus: response.status,
        classification: 'parse_error',
        headers,
        bodyBytes: text.length,
        bodyPrefix: text.slice(0, 800),
      });
      // Preserve prior behavior: unparseable body yields no Baidu results.
      return { images: [], probe: { classification: 'parse_error', listNum: null } };
    }

    // Bot-block: HTTP 200 + valid JSON, but an anti-scraper payload
    // (e.g. {"antiFlag":1,"message":"Forbid spider access"}) with no `data` array.
    // This is indistinguishable from real censorship unless detected explicitly.
    const isBotBlock =
      data.antiFlag !== undefined ||
      (typeof data.message === 'string' && !Array.isArray(data.data));

    const rawImages = Array.isArray(data.data) ? data.data : [];
    const withThumb = rawImages.filter(img => img && img.thumbURL);
    const classification = isBotBlock
      ? 'bot_block'
      : withThumb.length === 0
        ? 'empty_results'
        : 'has_results';

    logBaiduProbe({
      query,
      fetchPath,
      httpStatus: response.status,
      classification,
      headers,
      bodyBytes: text.length,
      antiFlag: data.antiFlag ?? null,
      message: data.message ?? null,
      // Baidu's own reported result counts — more reliable than the sliced array.
      listNum: data.listNum ?? null,
      displayNum: data.displayNum ?? null,
      bdFmtDispNum: data.bdFmtDispNum ?? null,
      dataLen: rawImages.length,
      withThumb: withThumb.length,
      sourceDomains: extractSourceDomains(withThumb),
      ...(isBotBlock ? { bodyPrefix: text.slice(0, 800) } : {}),
    });

    // `thumbURL` is the image file; the source page it was found on lives in
    // `replaceUrl[].FromURL` (falling back to `fromURL`), and is sometimes absent.
    const results = withThumb
      .slice(0, 9) // Limit to 9 images
      .map(img => ({
        image: img.thumbURL,
        source: (img.replaceUrl && img.replaceUrl[0] && img.replaceUrl[0].FromURL) || img.fromURL || null,
      }));

    console.log(`Successfully fetched ${results.length} Baidu images`);
    // `probe` carries the raw response signal (classification + Baidu's own total)
    // so the handler can persist it for later censorship analysis.
    return { images: results, probe: { classification, listNum: data.listNum ?? null } };
  } catch (error) {
    console.error('========== BAIDU SEARCH ERROR ==========');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error cause:', error.cause);
    console.error('Request URL:', url);
    console.error(
      'Full error object:',
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    console.error('Error stack:', error.stack);
    console.error('========================================');

    const isTimeout = error.name === 'AbortError' || error.message.includes('aborted');
    logBaiduProbe({
      query,
      classification: isTimeout ? 'timeout' : 'fetch_error',
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorCauseCode: error.cause && error.cause.code,
    });

    // If it's a timeout/abort error, note it so the handler can surface it
    if (isTimeout) {
      console.warn('Baidu request timed out (tried direct + proxy fallback)');
      return { images: [], probe: { classification: 'timeout', listNum: null } };
    }

    // Check if it's a network/proxy error
    if (error.cause && error.cause.code === 'ECONNRESET') {
      console.warn(
        'Baidu proxy connection failed (ECONNRESET) - this may indicate proxy credentials are not configured'
      );
    }

    // Return empty results as fallback instead of throwing
    // This allows Google results to still be processed and saved
    return { images: [], probe: { classification: 'fetch_error', listNum: null } };
  }
}

async function detectLanguage(query) {
  console.log('Detecting language for:', query);
  const translationApiUrl = process.env.TRANSLATION_API_URL || 'https://babelfish.firewallcafe.com/api';
  const url = `${translationApiUrl}/detect-language?query=${encodeURIComponent(query)}`;
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

  const translationApiUrl = process.env.TRANSLATION_API_URL || 'https://babelfish.firewallcafe.com/api';
  const response = await fetch(`${translationApiUrl}/translate`, {
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

/**
 * Creates search record in database (fast, synchronous)
 * Returns searchId immediately
 */
async function createSearchRecord({
  query,
  langTo,
  langFrom,
  search_client_name,
  search_ip_address,
  translation,
  baidu_response_class,
  baidu_list_num,
}) {
  console.log('Creating search record for:', query);

  const backendUrl = process.env.BACKEND_API_URL;
  const searchData = {
    timestamp: Date.now(),
    location: process.env.LOCATION,
    search_client_name: search_client_name,
    search_ip_address: search_ip_address,
    search_engine: 'google',
    search: query,
    translation,
    lang_from: langFrom,
    search_term_translation_language_code: langTo,
    search_term_initial_language_confidence: '1.0',
    search_term_initial_language_alternate_code: null,
    // Raw Baidu response signal for later censorship analysis.
    baidu_response_class: baidu_response_class ?? null,
    baidu_list_num: baidu_list_num ?? null,
  };

  const createResponse = await fetch(`${backendUrl}/create-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': process.env.API_SECRET,
    },
    body: JSON.stringify(searchData),
  });

  console.log('Create search response status:', createResponse.status);

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Failed to create search: ${createResponse.status} ${errorText}`);
  }

  const createResult = await createResponse.json();
  console.log('Search created with ID:', createResult.searchId);

  return createResult.searchId;
}

/**
 * Processes images asynchronously (slow, background)
 * Should be called with waitUntil() to not block response
 */
async function processImagesAsync({ searchId, google, baidu }) {
  console.log('Processing images for search ID:', searchId);

  const backendUrl = process.env.BACKEND_API_URL;
  // Forward image file URL + source page URL so the backend can persist both.
  const toEntries = arr => arr.slice(0, 9).map(r => ({ url: r.image, source: r.source || null }));
  const imageData = {
    searchId,
    google_images: toEntries(google),
    baidu_images: toEntries(baidu),
  };

  try {
    const processResponse = await fetch(`${backendUrl}/process-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': process.env.API_SECRET,
      },
      body: JSON.stringify(imageData),
    });

    console.log('Process images response status:', processResponse.status);

    if (!processResponse.ok) {
      console.warn('Image processing failed for search ID:', searchId);
    } else {
      console.log('Successfully processed images for search ID:', searchId);
    }
  } catch (error) {
    console.error('Error processing images for search ID:', searchId, error);
    // Don't throw - this is background processing
  }
}

// Main handler function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      query,
      search_client_name,
      translation,
      langFrom: providedLangFrom,
      langTo: providedLangTo,
    } = req.body;

    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    console.log('Processing search for:', query);

    let langFrom, langTo, translatedQuery;

    // Check if translation was already provided (from separate /api/translate call)
    if (translation && providedLangFrom && providedLangTo) {
      console.log('Using pre-translated query:', translation);
      langFrom = providedLangFrom;
      langTo = providedLangTo;
      translatedQuery = translation;
    } else {
      // 1. Detect language using the same API as local
      try {
        const detectedLang = await detectLanguage(query);
        langFrom = detectedLang.language === 'zh-CN' ? 'zh-CN' : 'en';
        langTo = langFrom === 'en' ? 'zh-CN' : 'en';
        console.log(
          'Language detection successful:',
          detectedLang.language,
          '->',
          langFrom,
          'to',
          langTo
        );
      } catch (error) {
        console.warn('Language detection failed, using fallback:', error.message);
        // Fallback to regex detection like before
        langFrom = /[\u4e00-\u9fff]/.test(query) ? 'zh-CN' : 'en';
        langTo = langFrom === 'en' ? 'zh-CN' : 'en';
        console.log('Fallback language detection:', langFrom, 'to', langTo);
      }

      // 2. Translate query — retry once, then surface the error
      translatedQuery = await withRetry(async () => {
        const result = await translateText(query, langFrom, langTo);
        if (!result) throw new Error('Empty translation response');
        return result;
      });
      console.log('Translation successful:', query, '->', translatedQuery);
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
    let baiduProbe = null;
    let baiduTimeoutInfo = null;

    if (baiduResults.status === 'fulfilled') {
      // getBaiduImages always resolves to { images, probe }.
      const baiduResponse = baiduResults.value || {};
      finalBaiduResults = baiduResponse.images || [];
      baiduProbe = baiduResponse.probe || null;
      if (baiduProbe && baiduProbe.classification === 'timeout') {
        baiduTimeoutInfo = { error: 'Baidu request timeout after fallback attempts' };
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

    console.log(
      'Search results - Google:',
      finalGoogleResults.length,
      'Baidu:',
      finalBaiduResults.length
    );

    // Check if we have any results at all
    if (finalGoogleResults.length === 0 && finalBaiduResults.length === 0) {
      console.warn('No images found for query:', query);
      return res.status(404).json({
        error: 'No images found',
        message: `No images found for "${query}"`,
        query: query,
        translation: translatedQuery,
      });
    }

    // Don't create placeholder objects - just use the empty array
    // The backend will handle missing Baidu results
    let processedBaiduResults = finalBaiduResults;

    // 4. Extract client IP (Vercel provides this in headers)
    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      '127.0.0.1';

    // 5. Create search record (fast - wait for this)
    let searchId = null;
    try {
      searchId = await createSearchRecord({
        query,
        langTo,
        langFrom,
        search_client_name,
        search_ip_address: clientIp,
        translation: translatedQuery,
        baidu_response_class: baiduProbe?.classification ?? null,
        baidu_list_num: baiduProbe?.listNum ?? null,
      });
      console.log('Search created with ID:', searchId, 'and IP:', clientIp);

      // 5b. Process images in background (don't wait)
      // Check if waitUntil is available (production) or fallback (dev)
      if (typeof waitUntil === 'function') {
        waitUntil(
          processImagesAsync({
            searchId,
            google: finalGoogleResults,
            baidu: processedBaiduResults,
          })
        );
        console.log('Image processing queued for background execution');
      } else {
        // In dev/local, just fire and forget
        processImagesAsync({
          searchId,
          google: finalGoogleResults,
          baidu: processedBaiduResults,
        }).catch(err => console.error('Background image processing failed:', err));
        console.log('Image processing started (dev mode, no waitUntil available)');
      }
    } catch (saveError) {
      console.warn('Failed to create search record:', saveError.message);
      console.log('Continuing with search results despite save failure');
      // Note: if createSearchRecord fails, we don't queue image processing
    }

    // 6. Return results immediately (don't wait for image processing)
    const response = {
      searchId,
      googleResults: finalGoogleResults,
      baiduResults: processedBaiduResults,
      translation: translatedQuery,
      ...(baiduTimeoutInfo ? { baiduTimeout: baiduTimeoutInfo } : {}),
    };

    const resultCount = finalGoogleResults.length + processedBaiduResults.length;
    console.log(
      `Search completed successfully, ${finalGoogleResults.length} Google + ${processedBaiduResults.length} Baidu = ${resultCount} total results`
    );
    console.log(
      'Returning response:',
      JSON.stringify({
        searchId: response.searchId,
        googleCount: response.googleResults.length,
        baiduCount: response.baiduResults.length,
        hasTranslation: !!response.translation,
        hasBaiduTimeout: !!response.baiduTimeout,
      })
    );
    res.status(200).json(response);
  } catch (error) {
    console.error('Image search error:', error);
    res.status(400).json({
      error: error.message || 'Failed to process search request',
      details: error.toString(),
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
