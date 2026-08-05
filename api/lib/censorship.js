// Baidu censorship classifier.
//
// Pure function that turns the per-search Baidu probe signals into a *candidate*
// censorship verdict. This is a signal that feeds human review — NOT an
// authoritative label. Thresholds/confidence here are seed values, calibrated
// against the batch dataset; they live in this one module so tuning is trivial.
//
// Grounded in real data (2026-07-27):
//   咖啡 coffee      → has_results, listNum 1675, UGC domains          → uncensored
//   法轮功 Falun Gong → has_results, listNum 71,  all state media       → soft_censored
//   习明泽 Xi Mingze  → empty_results, listNum 0                        → hard_censored

// The domain list + matcher live in src/lib/stateMedia.js so the frontend can
// use them too (CRA cannot import from api/); re-exported here so this module
// remains the classifier's single public surface.
import { STATE_MEDIA_DOMAINS, isStateMedia } from '../../src/lib/stateMedia.js';

export { STATE_MEDIA_DOMAINS, isStateMedia };

// Baidu response classes that are technical failures, never censorship.
const FAILURE_CLASSES = new Set([
  'bot_block', 'proxy_error', 'http_error', 'parse_error', 'timeout', 'fetch_error',
]);

// Classify a single search's Baidu outcome relative to its Google control.
// Returns { verdict, confidence } where verdict is one of:
//   'uncensored' | 'hard_censored' | 'soft_censored' | 'inconclusive'
export function classifyCensorship({
  baiduClass,
  baiduListNum,
  baiduCount,
  baiduDomains,
  googleCount,
  extraDomains = [],
} = {}) {
  // 1. Technical failures are NEVER censorship — removes the dominant
  //    false-positive class without any retry.
  if (FAILURE_CLASSES.has(baiduClass)) {
    return { verdict: 'inconclusive', confidence: 0 };
  }

  // 2. No Google control → nothing to compare against.
  if (!googleCount || googleCount === 0) {
    return { verdict: 'inconclusive', confidence: 0 };
  }

  // 3. Clean 200 with a Google control present.
  if (!baiduCount || baiduCount === 0) {
    // Hard censorship: opaque zero results. An explicit listNum:0 is a stronger
    // signal than an array that merely happened to come back empty.
    const confidence = baiduListNum === 0 ? 0.85 : 0.6;
    return { verdict: 'hard_censored', confidence };
  }

  // Soft censorship: results present but scrubbed to authorized domains.
  const domains = Array.isArray(baiduDomains) ? baiduDomains.filter(Boolean) : [];
  const stateRatio = domains.length
    ? domains.filter((d) => isStateMedia(d, extraDomains)).length / domains.length
    : 0;
  if (stateRatio >= 0.7) {
    const confidence = stateRatio >= 0.99 ? 0.8 : 0.6;
    return { verdict: 'soft_censored', confidence };
  }

  return { verdict: 'uncensored', confidence: 0.9 };
}
