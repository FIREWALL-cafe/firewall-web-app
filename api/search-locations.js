// Vercel Function to handle search locations requests
// Simple proxy to backend API for search locations

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    console.error('BACKEND_API_URL environment variable is not set');
    return res.status(500).json({
      error: 'Backend API URL not configured',
      message: 'BACKEND_API_URL environment variable is missing'
    });
  }

  // Remove trailing slash to avoid double slashes
  const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  if (req.method === 'GET') {
    try {
      const url = `${baseUrl}/searches/search-locations`;
      console.log('Fetching search locations from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Backend response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend responded with status: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Search locations error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        error: 'Failed to fetch search locations',
        message: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
