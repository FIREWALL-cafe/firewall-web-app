// Vercel Function to handle search-by-term requests
// Proxies to backend API /searches/terms endpoint

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

  if (req.method === 'GET') {
    try {
      const { term, page, page_size } = req.query;

      if (!term) {
        return res.status(400).json({ error: 'term parameter is required' });
      }

      const params = new URLSearchParams({
        term,
        page: page || 1,
        page_size: page_size || 25,
      });

      const url = `${baseUrl}/searches/terms?${params.toString()}`;
      console.log('Fetching searches by term from:', url);

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
      console.error('Search terms error:', error);
      res.status(500).json({
        error: 'Failed to fetch searches by term',
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
