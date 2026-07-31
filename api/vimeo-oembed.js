// Vercel Function: returns the Vimeo thumbnail URL for a given video.
// Used as the poster fallback when no posterImage is set in Sanity.
// Server-side avoids browser CORS issues and lets the response be cached.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, url } = req.query;

  // Accept either a numeric id or a full Vimeo url
  const videoUrl = url
    ? url
    : id && /^\d+$/.test(String(id))
      ? `https://vimeo.com/${id}`
      : null;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing or invalid "id" or "url" parameter' });
  }

  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}&width=1280`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error(`Vimeo oEmbed responded with status ${response.status}`);
    }

    const data = await response.json();

    // Cache at the edge for a day; poster art rarely changes.
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

    return res.status(200).json({
      thumbnailUrl: data.thumbnail_url || null,
      width: data.thumbnail_width || null,
      height: data.thumbnail_height || null,
      title: data.title || null,
    });
  } catch (error) {
    console.error('Error fetching Vimeo oEmbed:', error);
    return res.status(502).json({ error: 'Failed to fetch Vimeo thumbnail' });
  }
}
