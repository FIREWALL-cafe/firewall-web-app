// Chinese state-media / government hostnames, shared by the server-side
// censorship classifier (api/lib/censorship.js) and the frontend soft-censorship
// warning icons. Lives under src/ because CRA cannot import from api/.

// Matched by suffix: hostname === d || endsWith('.' + d).
// Note: `gov.cn` therefore matches any *.gov.cn. Extend as new outlets appear.
export const STATE_MEDIA_DOMAINS = [
  'cctv.com', 'cctv.cn', 'people.com.cn', 'xinhuanet.com', 'news.cn',
  'chinadaily.com.cn', 'chinanews.com', 'chinanews.com.cn', 'cyol.com',
  'youth.cn', 'globaltimes.cn', 'huanqiu.com', 'gmw.cn', 'qstheory.cn',
  'china.com.cn', 'cri.cn', 'ce.cn', '81.cn', 'chinamil.com.cn',
  '12371.cn', 'gov.cn', 'cntv.cn', 'cnr.cn',
];

// True if a hostname belongs to (or is a subdomain of) a state-media domain.
export function isStateMedia(hostname) {
  if (!hostname) return false;
  const host = String(hostname).toLowerCase();
  return STATE_MEDIA_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
}
