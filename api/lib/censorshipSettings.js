// Server-side fetch of the Sanity censorshipSettings singleton, cached in
// module scope so classification never adds per-search latency: the first
// search after a cold start pays one small GROQ request, everything else is
// served from cache for CACHE_TTL_MS.
//
// A non-empty list REPLACES the built-in defaults in src/lib/stateMedia.js;
// an empty list (or a failed fetch) means callers fall back to the defaults.

const CACHE_TTL_MS = 10 * 60 * 1000;
const FAILURE_TTL_MS = 60 * 1000; // retry sooner after a failed fetch

let cache = { domains: [], fetchedAt: 0, ttl: 0 };

export async function getStateMediaDomains() {
  const now = Date.now();
  if (now - cache.fetchedAt < cache.ttl) return cache.domains;

  const projectId = process.env.REACT_APP_SANITY_PROJECT_ID || '6i3e0mnh';
  const dataset = process.env.REACT_APP_SANITY_DATASET || 'production';
  const query = encodeURIComponent('*[_type == "censorshipSettings"][0].stateMediaDomains');
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
    const json = await res.json();
    const domains = (Array.isArray(json.result) ? json.result : [])
      .filter((d) => typeof d === 'string' && d.trim())
      .map((d) => d.trim().toLowerCase());
    cache = { domains, fetchedAt: now, ttl: CACHE_TTL_MS };
  } catch (error) {
    console.warn('censorshipSettings fetch failed, using cached/default domains:', error.message);
    cache = { domains: cache.domains, fetchedAt: now, ttl: FAILURE_TTL_MS };
  }
  return cache.domains;
}
