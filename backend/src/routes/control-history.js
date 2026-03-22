import { Router } from 'express';
import { getControlHistory } from '../db/device-control.js';

const router = Router();

/**
 * GET /api/control/history
 * List control commands (for dashboard logs).
 * Query: device_id (optional), limit (default 100)
 */
router.get('/', async (req, res) => {
  try {
    const { device_id: deviceId, limit } = req.query;
    const rows = await getControlHistory(deviceId || null, limit ? parseInt(limit, 10) : 100);
    res.json(rows);
  } catch (err) {
    console.error('[API] GET /control/history', err);
    res.status(500).json({ error: 'Failed to fetch control history' });
  }
});

export default router;
