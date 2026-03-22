import { config } from '../config.js';

/**
 * Optional API key auth. If API_KEY is not set, skips validation.
 */
export function apiKeyAuth(req, res, next) {
  if (!config.apiKey) {
    return next();
  }
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (key !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}
