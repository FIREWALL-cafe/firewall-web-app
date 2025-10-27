// Test endpoint to confirm proxy connectivity and Baidu access
import { fetchWithProxy, fetchWithFallback } from './lib/proxy.js';

export default async function handler(req, res) {
  const testType = req.query.type || 'baidu'; // 'proxy' or 'baidu'

  // Test 1: Bright Data proxy connectivity (recommended by Bright Data docs)
  if (testType === 'proxy') {
    console.log('Testing Bright Data proxy connectivity...');
    const proxyTestUrl = 'https://geo.brdtest.com/welcome.txt';

    try {
      const response = await fetchWithProxy(proxyTestUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      console.log('Proxy test response status:', response.status);

      // Check for Bright Data error headers
      const brdErrorCode = response.headers.get('x-brd-err-code');
      const brdErrorMsg = response.headers.get('x-brd-err-msg');
      const proxyStatus = response.headers.get('Proxy-Status');

      const text = await response.text();
      const headers = Object.fromEntries(response.headers.entries());

      console.log('Response headers:', headers);
      console.log('Response text:', text);

      return res.status(200).json({
        success: !brdErrorCode,
        testType: 'proxy',
        proxyConfigured: !!process.env.BRIGHTDATA_USERNAME,
        responseStatus: response.status,
        responseText: text,
        brightDataError: brdErrorCode ? {
          code: brdErrorCode,
          message: brdErrorMsg,
          proxyStatus: proxyStatus
        } : null,
        headers
      });
    } catch (error) {
      console.error('Proxy test failed:', error);
      return res.status(500).json({
        success: false,
        testType: 'proxy',
        error: error.message,
        errorName: error.name,
        errorCode: error.code,
        errorCause: error.cause
      });
    }
  }

  // Test 2: Baidu image search with fallback
  const testQuery = req.query.q || '测试';
  const url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&word=${encodeURI(testQuery)}&pn=0&rn=5`;

  console.log('Testing Baidu connection to:', url);

  try {
    const startTime = Date.now();

    // Configure fetch options
    // Note: fetchWithFallback handles timeouts internally (2s direct, 18s proxy)
    const fetchOptions = {
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36 EdgA/46.1.2.5140',
        'Cookie': 'BAIDUID=DA3AF7E580B9999700832FE88F5B01DA:FG=1; BAIDUID_BFESS=DA3AF7E580B9999700832FE88F5B01DA:FG=1; H_WISE_SIDS=62325_62842_62967_62999;'
      }
    };

    console.log('Initiating fetch to Baidu (direct first, fallback to proxy)...');
    const fetchStartTime = Date.now();
    // Use fetchWithFallback which tries direct first, then proxy
    const response = await fetchWithFallback(url, fetchOptions);
    const fetchTime = Date.now() - fetchStartTime;
    const responseTime = Date.now() - startTime;

    console.log(`Fetch completed in ${fetchTime}ms`);
    console.log(`Total response time: ${responseTime}ms`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Check for Bright Data proxy errors (even on 200 responses)
    const brdErrorCode = response.headers.get('x-brd-err-code');
    const brdErrorMsg = response.headers.get('x-brd-err-msg');
    const proxyStatus = response.headers.get('Proxy-Status');

    if (brdErrorCode || proxyStatus) {
      console.warn('========== BRIGHT DATA PROXY ERROR ==========');
      console.warn('BrightData Error Code:', brdErrorCode);
      console.warn('BrightData Error Message:', brdErrorMsg);
      console.warn('Proxy-Status Header:', proxyStatus);
      console.warn('============================================');

      return res.status(200).json({
        success: false,
        message: 'Bright Data proxy error detected',
        strategy: 'direct-first-with-proxy-fallback',
        brightDataError: {
          code: brdErrorCode,
          message: brdErrorMsg,
          proxyStatus: proxyStatus
        },
        timing: {
          total: responseTime,
          fetch: fetchTime,
        },
        environment: process.env.VERCEL_ENV || 'development',
        proxyAvailable: !!(process.env.BRIGHTDATA_USERNAME && process.env.BRIGHTDATA_PASSWORD)
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('Reading response body...');
    const bodyStartTime = Date.now();
    const text = await response.text();
    const bodyTime = Date.now() - bodyStartTime;
    console.log(`Response body read in ${bodyTime}ms, length: ${text.length}`);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
      console.log('Successfully parsed JSON response');
    } catch (parseError) {
      console.log('Failed to parse as JSON:', parseError.message);
      console.log('Response text (first 500 chars):', text.substring(0, 500));
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    const images = data.data || [];
    console.log(`Successfully fetched ${images.length} Baidu images`);
    console.log(`\n=== TIMING BREAKDOWN ===`);
    console.log(`Strategy: Direct first (2s timeout), fallback to proxy (18s timeout)`);
    console.log(`Fetch time: ${fetchTime}ms`);
    console.log(`Body read time: ${bodyTime}ms`);
    console.log(`Total time: ${responseTime}ms`);
    console.log(`Note: Check logs above for whether direct succeeded or fell back to proxy`);

    res.status(200).json({
      success: true,
      message: `Successfully connected to Baidu and retrieved ${images.length} images`,
      strategy: 'direct-first-with-proxy-fallback',
      timing: {
        total: responseTime,
        fetch: fetchTime,
        bodyRead: bodyTime,
      },
      environment: process.env.VERCEL_ENV || 'development',
      proxyAvailable: !!(process.env.BRIGHTDATA_USERNAME && process.env.BRIGHTDATA_PASSWORD),
      imageCount: images.length,
      sampleImages: images.slice(0, 2).map(img => ({
        imageUrl: img.thumbURL,
        title: img.fromPageTitleEnc,
      }))
    });

  } catch (error) {
    console.error('Baidu connection test failed:', error);

    // Detailed error analysis
    let errorType = 'Unknown';
    let errorDetails = error.message;

    if (error.name === 'AbortError') {
      errorType = 'Timeout';
      errorDetails = 'Request timed out after 10 seconds';
    } else if (error.code === 'UND_ERR_SOCKET') {
      errorType = 'Socket Error';
      errorDetails = 'Socket connection failed - likely network restriction';
    } else if (error.message.includes('ConnectTimeoutError')) {
      errorType = 'Connect Timeout';
      errorDetails = 'Failed to establish connection to image.baidu.com';
    } else if (error.message.includes('ENOTFOUND')) {
      errorType = 'DNS Resolution';
      errorDetails = 'Could not resolve image.baidu.com';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorType = 'Connection Refused';
      errorDetails = 'Connection refused by image.baidu.com';
    }

    res.status(500).json({
      success: false,
      error: errorType,
      message: errorDetails,
      fullError: error.toString(),
      environment: process.env.VERCEL_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};