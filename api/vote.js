// Vercel Function to handle vote submissions
// Translates frontend vote format to backend API format

const metaKeyToVoteId = {
  votes_censored: 1,
  votes_uncensored: 2,
  votes_bad_translation: 3,
  votes_good_translation: 4,
  votes_lost_in_translation: 5,
  votes_bad_result: 6,
  votes_nsfw: 7,
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    console.error('BACKEND_API_URL environment variable is not set');
    return res.status(500).json({ error: 'Backend API URL not configured' });
  }

  const { meta_key, previous_meta_key, search_id, vote_client_name } = req.body;

  if (!meta_key || !search_id) {
    return res.status(400).json({ error: 'meta_key and search_id are required' });
  }

  const vote_id = metaKeyToVoteId[meta_key];
  if (!vote_id) {
    return res.status(400).json({ error: `Unknown vote category: ${meta_key}` });
  }

  const previous_vote_id = previous_meta_key ? metaKeyToVoteId[previous_meta_key] : null;

  // Extract client IP from Vercel headers
  const vote_ip_address =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown';

  const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  try {
    const isUpdate = req.method === 'PUT';
    const isDelete = req.method === 'DELETE';
    const backendEndpoint = isDelete ? 'delete-vote' : isUpdate ? 'update-vote' : 'create-vote';

    const response = await fetch(`${baseUrl}/${backendEndpoint}`, {
      method: isDelete ? 'DELETE' : isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': process.env.API_SECRET,
      },
      body: JSON.stringify({
        vote_id,
        ...(isUpdate && previous_vote_id ? { previous_vote_id } : {}),
        search_id,
        vote_timestamp: Date.now(),
        vote_client_name: vote_client_name || 'anonymous',
        vote_ip_address,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend vote error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Vote failed', detail: errorText });
    }

    const data = await response.json();
    res.status(isDelete || isUpdate ? 200 : 201).json(data);
  } catch (error) {
    console.error('Vote proxy error:', error);
    res.status(500).json({ error: 'Failed to submit vote', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
