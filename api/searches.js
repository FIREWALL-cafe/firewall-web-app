// Vercel Function to handle search requests
// Simple proxy to backend API for searches

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_API_URL;

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
        ...(query && { term: query }),
        ...finalFilters,
      });

      const endpoint = query ? 'searches/terms' : 'searches/filter';
      const url = `${backendUrl}/${endpoint}?${params.toString()}`;
      console.log('Search URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
