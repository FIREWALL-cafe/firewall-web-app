// Vercel Function to handle search requests
// Simple proxy to backend API for searches

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    console.error('BACKEND_API_URL environment variable is not set');
    return res.status(500).json({
      error: 'Backend API URL not configured',
      message: 'BACKEND_API_URL environment variable is missing'
    });
  }

  const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  // Handle both GET and POST (app uses POST, backend expects GET)
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      const { query, page, page_size, search_locations, ...otherFilters } = req.query;

      const paginationParams = {
        page: page || 1,
        page_size: page_size || 25
      };
      const finalFilters = { ...otherFilters, ...paginationParams };

      if (search_locations) {
        finalFilters.search_locations = search_locations;
      }

      const params = new URLSearchParams({
        ...(query && { keyword: query }),
        ...finalFilters,
      });

      const endpoint = 'searches/filter';
      const url = `${baseUrl}/${endpoint}?${params.toString()}`;
      console.log('Fetching searches from:', url);

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
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();

      res.status(response.status).json(data);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        error: 'Failed to fetch searches',
        message: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
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
