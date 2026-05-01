const DEFAULT_TRANSLATING = 'Translating...';
const DEFAULT_SEARCHING_GOOGLE = 'Searching Google...';
const DEFAULT_SEARCHING_BAIDU = 'Searching Baidu...';

const DEFAULT_TOPICAL_POOL = [
  'Begging Telecom for the images...',
  'Pretending to be a human...',
  'Saving images to archive...',
  'Rollerblading through VPNs...',
  'China is very far away...',
  'Connecting to a server across the globe...',
  'Swimming across the Pacific ocean...',
  'Texting Xi Jinping...',
  "Resurrecting George Orwell's ghost...",
  '(ಠ_ಠ) Watching you...',
  '未经允许就看...',
  '爬墙... 太热了.',
];

const DEFAULT_NOT_TOPICAL_POOL = [
  'Summoning a computer demon...',
  'uUHMMmmmm........ XD',
  'Performing a pixelated exorcism...',
  'Cleansing with sage...',
  'Processing...',
  'Beep-Boop...',
  '¯\\_(ツ)_/¯ Just another sec...',
  'Fighting the server...',
  "WARNING! Just kidding, we're good.",
  '向陌生人问路...',
];

export const DEFAULT_PROGRESS_CAPTIONS = {
  translating: DEFAULT_TRANSLATING,
  searchingGoogle: DEFAULT_SEARCHING_GOOGLE,
  searchingBaidu: DEFAULT_SEARCHING_BAIDU,
  fillers: [...DEFAULT_TOPICAL_POOL, ...DEFAULT_NOT_TOPICAL_POOL],
};

export function buildProgressCaptions(uiStrings = {}) {
  const filler = Array.isArray(uiStrings.progressFillerCaptions)
    ? uiStrings.progressFillerCaptions.filter(Boolean)
    : [];
  return {
    translating: uiStrings.progressTranslatingCaption || DEFAULT_PROGRESS_CAPTIONS.translating,
    searchingGoogle:
      uiStrings.progressSearchingGoogleCaption || DEFAULT_PROGRESS_CAPTIONS.searchingGoogle,
    searchingBaidu:
      uiStrings.progressSearchingBaiduCaption || DEFAULT_PROGRESS_CAPTIONS.searchingBaidu,
    fillers: filler.length > 0 ? filler : DEFAULT_PROGRESS_CAPTIONS.fillers,
  };
}

export function pickRandomCaption(pool, previous) {
  if (!pool || pool.length === 0) return previous || '';
  if (pool.length === 1) return pool[0];
  let pick;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
  } while (pick === previous);
  return pick;
}
