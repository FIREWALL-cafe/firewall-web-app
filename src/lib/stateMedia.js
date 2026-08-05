// Chinese state-media / government hostnames, shared by the server-side
// censorship classifier (api/lib/censorship.js) and the frontend soft-censorship
// warning icons. Lives under src/ because CRA cannot import from api/.

// Built-in DEFAULTS only: when the Sanity censorshipSettings document has a
// non-empty list, that list replaces this one entirely (editors have control).
// Matched by suffix: hostname === d || endsWith('.' + d).
// Note: `gov.cn` therefore matches any *.gov.cn.
export const STATE_MEDIA_DOMAINS = [
  'cctv.com', 'cctv.cn', 'people.com.cn', 'xinhuanet.com', 'news.cn',
  'chinadaily.com.cn', 'chinanews.com', 'chinanews.com.cn', 'cyol.com',
  'youth.cn', 'globaltimes.cn', 'huanqiu.com', 'gmw.cn', 'qstheory.cn',
  'china.com.cn', 'cri.cn', 'ce.cn', '81.cn', 'chinamil.com.cn',
  '12371.cn', 'gov.cn', 'cntv.cn', 'cnr.cn',
];

// True if a hostname belongs to (or is a subdomain of) a state-media domain.
// A non-empty `domains` list (from the Sanity censorshipSettings singleton)
// REPLACES the built-in defaults; empty/missing falls back to the defaults so
// a cleared document or failed fetch can never silently disable detection.
export function isStateMedia(hostname, domains = []) {
  if (!hostname) return false;
  const host = String(hostname).toLowerCase();
  const list = domains.length ? domains : STATE_MEDIA_DOMAINS;
  return list.some((d) => host === d || host.endsWith('.' + d));
}
