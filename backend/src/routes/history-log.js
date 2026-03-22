import { Router } from 'express';
import { getHistoryLogs } from '../db/history-log.js';

const router = Router();

/**
 * GET /api/logs
 * Audit/event logs for dashboard.
 * Query: device_id, action, from, to, limit (default 200)
 */
router.get('/', async (req, res) => {
  try {
    const { device_id: deviceId, action, from, to, limit } = req.query;
    const rows = await getHistoryLogs({
      deviceId: deviceId || null,
      action: action || null,
      from: from || null,
      to: to || null,
      limit: limit ? parseInt(limit, 10) : 200,
    });
    res.json(rows);
  } catch (err) {
    console.error('[API] GET /logs', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
