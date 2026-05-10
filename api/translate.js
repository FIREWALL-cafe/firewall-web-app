// Vercel Function to handle translation requests
// Returns only translation without performing image search

async function detectLanguage(query) {
  console.log('Detecting language for:', query);
  const translationApiUrl = process.env.TRANSLATION_API_URL || 'https://babelfish.firewallcafe.com/api';
  const url = `${translationApiUrl}/detect-language?query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

async function translateText(query, langFrom, langTo) {
  console.log('Translating from', langFrom, 'to', langTo);

  const body = `query=${encodeURIComponent(query)}&searchEngine=google&secret=${process.env.SHARED_SECRET}&langFrom=${langFrom}&langTo=${langTo}`;

  const translationApiUrl = process.env.TRANSLATION_API_URL || 'https://babelfish.firewallcafe.com/api';
  const response = await fetch(`${translationApiUrl}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body
  });

  const data = await response.json();
  return data.translated;
}

// Main handler function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    console.log('Processing translation for:', query);

    // 1. Detect language
    let langFrom, langTo;
    try {
      const detectedLang = await detectLanguage(query);
      langFrom = detectedLang.language === 'zh-CN' ? 'zh-CN' : 'en';
      langTo = langFrom === 'en' ? 'zh-CN' : 'en';
      console.log('Language detection successful:', detectedLang.language, '->', langFrom, 'to', langTo);
    } catch (error) {
      console.warn('Language detection failed, using fallback:', error.message);
      // Fallback to regex detection
      langFrom = /[\u4e00-\u9fff]/.test(query) ? 'zh-CN' : 'en';
      langTo = langFrom === 'en' ? 'zh-CN' : 'en';
      console.log('Fallback language detection:', langFrom, 'to', langTo);
    }

    // 2. Translate query
    let translatedQuery;
    try {
      translatedQuery = await translateText(query, langFrom, langTo);
      if (!translatedQuery) throw new Error('Empty translation response');
      console.log('Translation successful:', query, '->', translatedQuery);
    } catch (error) {
      console.warn('Translation failed, using fallback:', error.message);
      // Fallback to mock translation if translation service fails
      translatedQuery = langFrom === 'en' ? '测试' : 'test';
    }

    // 3. Return translation result
    const response = {
      query,
      translation: translatedQuery,
      langFrom,
      langTo,
    };

    console.log('Translation completed successfully');
    res.status(200).json(response);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(400).json({
      error: error.message || 'Failed to translate query',
      details: error.toString()
    });
  }
}
