// Bright Data proxy configuration utilities
// Provides proxy agent setup for requests that need geographic routing

import { ProxyAgent, fetch as undiciFetch } from 'undici';

/**
 * Creates a ProxyAgent configured for Bright Data proxy service
 * @returns {ProxyAgent|null} Configured proxy agent or null if credentials not available
 */
export function createBrightDataProxyAgent() {
  if (!process.env.BRIGHTDATA_USERNAME || !process.env.BRIGHTDATA_PASSWORD) {
    console.log('Bright Data credentials not found, proxy not available');
    return null;
  }

  try {
    const proxyHost = process.env.BRIGHTDATA_PROXY_HOST || 'brd.superproxy.io';
    const proxyPort = process.env.BRIGHTDATA_PROXY_PORT || '33335';

    // URL-encode credentials to handle special characters
    const username = encodeURIComponent(process.env.BRIGHTDATA_USERNAME);
    const password = encodeURIComponent(process.env.BRIGHTDATA_PASSWORD);
    const proxyUrl = `http://${username}:${password}@${proxyHost}:${proxyPort}`;

    console.log(`Creating Bright Data proxy agent: ${proxyHost}:${proxyPort}`);

    // Create proxy agent with TLS configuration to accept self-signed certificates
    const agent = new ProxyAgent({
      uri: proxyUrl,
      requestTls: {
        rejectUnauthorized: false,
      },
    });

    return agent;
  } catch (error) {
    console.warn('Failed to create proxy agent:', error.message);
    return null;
  }
}

/**
 * Attempts direct connection first, falls back to proxy on failure
 * Uses 500ms timeout for direct, 12-second for proxy
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options (excluding signal)
 * @returns {Promise<Response>} Fetch response
 */
export async function fetchWithFallback(url, options = {}) {
  // Attempt 1: Direct connection with 500ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('✓ Direct connection successful');
    return response;
  } catch (directError) {
    // Log fallback event
    console.warn('⚠ Direct connection failed, falling back to proxy');
    console.warn('  Direct error:', directError.name, '-', directError.message);

    // Attempt 2: Proxy connection with 12-second timeout
    const agent = createBrightDataProxyAgent();
    if (!agent) {
      console.error('  No proxy available, cannot retry');
      throw directError;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await undiciFetch(url, {
        ...options,
        signal: controller.signal,
        dispatcher: agent,
      });

      clearTimeout(timeoutId);
      console.log('✓ Proxy connection successful (fallback)');
      return response;
    } catch (proxyError) {
      console.error('✗ Both direct and proxy connections failed');
      console.error('  Proxy error:', proxyError.name, '-', proxyError.message);
      throw proxyError;
    }
  }
}

/**
 * Performs a fetch request with Bright Data proxy if available
 * Uses undici's fetch with dispatcher support instead of global fetch
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function fetchWithProxy(url, options = {}) {
  const agent = createBrightDataProxyAgent();

  if (agent) {
    console.log('Using Bright Data proxy for fetch request');
    // Use undici's fetch which supports the dispatcher property
    return undiciFetch(url, {
      ...options,
      dispatcher: agent,
    });
  }

  console.log('No proxy configured, using direct connection');
  // Fall back to global fetch for direct connection
  return fetch(url, options);
}

/**
 * @deprecated Use fetchWithProxy instead
 * Adds Bright Data proxy configuration to fetch options
 * @param {Object} fetchOptions - Fetch options object to modify
 * @returns {boolean} True if proxy was configured, false otherwise
 */
export function configureFetchWithProxy(fetchOptions) {
  const agent = createBrightDataProxyAgent();

  if (agent) {
    fetchOptions.dispatcher = agent;
    console.log('Proxy configured for fetch request');
    return true;
  }

  console.log('No proxy configured, using direct connection');
  return false;
}
