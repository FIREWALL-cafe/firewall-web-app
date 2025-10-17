// Test endpoint to confirm Baidu connectivity in Vercel environment
import { configureFetchWithProxy } from './lib/proxy.js';

export default async function handler(req, res) {
  const testQuery = '测试';
  const url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&word=${encodeURI(testQuery)}&pn=0&rn=5`;

  console.log('Testing Baidu connection to:', url);

  try {
    // Test 1: Basic fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const startTime = Date.now();

    // Configure fetch options
    const fetchOptions = {
      signal: controller.signal,
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36 EdgA/46.1.2.5140',
        'Cookie': 'BAIDUID=DA3AF7E580B9999700832FE88F5B01DA:FG=1; BAIDUID_BFESS=DA3AF7E580B9999700832FE88F5B01DA:FG=1; H_WISE_SIDS=62325_62842_62967_62999;'
      }
    };

    // Add Bright Data proxy configuration
    const proxyStartTime = Date.now();
    const usingProxy = configureFetchWithProxy(fetchOptions);
    const proxyConfigTime = Date.now() - proxyStartTime;
    console.log(`Proxy configuration completed in ${proxyConfigTime}ms`);

    console.log('Initiating fetch to Baidu...');
    const fetchStartTime = Date.now();
    const response = await fetch(url, fetchOptions);
    const fetchTime = Date.now() - fetchStartTime;

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    console.log(`Fetch completed in ${fetchTime}ms`);
    console.log(`Total response time: ${responseTime}ms`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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
    console.log(`Proxy setup: ${usingProxy ? 'enabled' : 'disabled'}`);
    console.log(`Fetch time: ${fetchTime}ms`);
    console.log(`Body read time: ${bodyTime}ms`);
    console.log(`Total time: ${responseTime}ms`);

    res.status(200).json({
      success: true,
      message: `Successfully connected to Baidu and retrieved ${images.length} images`,
      timing: {
        total: responseTime,
        fetch: fetchTime,
        bodyRead: bodyTime,
      },
      environment: process.env.VERCEL_ENV || 'development',
      usingProxy: usingProxy,
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