// Vercel Function to proxy API requests to the backend server
// Handles all /api/:path* requests as defined in vercel.json rewrites

export default async function handler(req, res) {
  // Extract the API path from the URL
  // Remove /api/ prefix to get the actual endpoint path
  const urlPath = req.url.replace(/^\/api\//, '');

  // Get backend API URL from environment variable or use default
  const backendUrl = process.env.BACKEND_API_URL;

  // Construct full URL for the backend request
  // Handle both with and without trailing slash in backendUrl
  const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const targetUrl = `${baseUrl}/${urlPath}`;

  console.log(`Proxying ${req.method} request to: ${targetUrl}`);

  try {
    // Prepare request options
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        // Remove Vercel-specific headers
        host: undefined,
        'x-vercel-id': undefined,
        'x-vercel-forwarded-for': undefined,
        'x-vercel-deployment-url': undefined,
      },
    };

    // Add body for POST, PUT, PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    // Make the request to the backend
    const response = await fetch(targetUrl, options);

    // Get the response data
    const data = await response.text();

    // Try to parse as JSON, otherwise return as text
    let responseData;
    try {
      responseData = JSON.parse(data);
    } catch {
      responseData = data;
    }

    // Return the response with the same status code
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
      path: urlPath
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};