// Vimeo helpers shared by the video embed feature.

// Extract the numeric Vimeo ID from a variety of Vimeo URL shapes.
// Handles plain IDs, standard links, player links, unlisted hash links,
// and shared links carrying query junk (e.g. ?fl=pl&fe=sh).
// Returns the ID string, or null if none can be found.
export function parseVimeoId(url) {
  if (!url) return null;

  const value = String(url).trim();

  // Already a bare numeric ID
  if (/^\d+$/.test(value)) return value;

  // Match the first numeric path segment in any vimeo.com / player.vimeo.com URL
  const match = value.match(
    /(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)/i,
  );
  if (match) return match[1];

  // Fallback: last resort, grab a trailing numeric segment
  const fallback = value.match(/\/(\d+)(?:[/?#]|$)/);
  return fallback ? fallback[1] : null;
}

// Build the embed iframe src for a Vimeo ID. Autoplay is enabled because the
// iframe is only injected after an explicit user click (lightbox facade).
export function buildVimeoEmbedSrc(id) {
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '1',
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}
