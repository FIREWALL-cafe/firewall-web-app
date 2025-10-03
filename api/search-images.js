// Vercel Function to handle search images requests
// Handles /searches/:search_id/images

export default async function handler(req, res) {
  // Get backend API URL from environment variable or use default
  const backendUrl = process.env.BACKEND_API_URL;

  // Extract search_id from the URL path
  // The URL pattern is /searches/[search_id]/images
  const urlParts = req.url.split('/');
  const searchIdIndex = urlParts.indexOf('searches') + 1;
  const searchId = urlParts[searchIdIndex];

  if (!searchId || searchId === 'images') {
    return res.status(400).json({ error: 'Search ID is required' });
  }

  console.log('Fetching images for search ID:', searchId);

  try {
    // Make request to backend
    const url = `${backendUrl}images/search_id/${searchId}`;
    console.log('Backend URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching search images:', error);
    res.status(500).json({
      error: 'Failed to fetch search images',
      message: error.message
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