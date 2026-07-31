import { parseVimeoId, buildVimeoEmbedSrc } from './vimeo';

describe('parseVimeoId', () => {
  test('returns null for empty input', () => {
    expect(parseVimeoId()).toBeNull();
    expect(parseVimeoId('')).toBeNull();
    expect(parseVimeoId(null)).toBeNull();
  });

  test('accepts a bare numeric id', () => {
    expect(parseVimeoId('1207538492')).toBe('1207538492');
  });

  test('parses a standard vimeo url', () => {
    expect(parseVimeoId('https://vimeo.com/1207538492')).toBe('1207538492');
  });

  test('parses a player url', () => {
    expect(parseVimeoId('https://player.vimeo.com/video/1207538492')).toBe('1207538492');
  });

  test('strips query junk from shared links', () => {
    expect(parseVimeoId('https://vimeo.com/1207538492?fl=pl&fe=sh')).toBe('1207538492');
  });

  test('parses unlisted hash links', () => {
    expect(parseVimeoId('https://vimeo.com/1207538492/abc123def')).toBe('1207538492');
  });

  test('returns null for a non-vimeo url', () => {
    expect(parseVimeoId('https://example.com/not-a-video')).toBeNull();
  });
});

describe('buildVimeoEmbedSrc', () => {
  test('returns null without an id', () => {
    expect(buildVimeoEmbedSrc(null)).toBeNull();
  });

  test('builds an autoplay embed src with privacy params', () => {
    const src = buildVimeoEmbedSrc('1207538492');
    expect(src).toContain('https://player.vimeo.com/video/1207538492?');
    expect(src).toContain('autoplay=1');
    expect(src).toContain('dnt=1');
    expect(src).toContain('title=0');
  });
});
