export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mask API key for security
  const maskKey = (val) => {
    if (!val || typeof val !== 'string') return '';
    if (val.length <= 8) return '*'.repeat(val.length);
    return `${val.slice(0, 4)}...${val.slice(-4)}`;
  };

  res.status(200).json({
    envExists: Boolean(process.env.OPENROUTER_API_KEY),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
    openRouterKeyPreview: maskKey(process.env.OPENROUTER_API_KEY),
    openRouterApiUrl: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
}