export default async function handler(req, res) {
  const { targetUrl } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing targetUrl parameter' });
  }

  // Validate the URL is one of our trusted APIs to prevent open proxy abuse
  if (
    !targetUrl.startsWith('https://newsapi.org/') &&
    !targetUrl.startsWith('https://gnews.io/')
  ) {
    return res.status(403).json({ error: 'Forbidden target URL' });
  }

  try {
    const response = await fetch(targetUrl);
    
    // We only care about JSON responses for our app
    const data = await response.json();
    
    // Set permissive CORS headers so the web frontend can read the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from target URL' });
  }
}
