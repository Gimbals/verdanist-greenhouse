import { Router } from 'express';
import { getLatestSensorData, getSensorDataHistory } from '../db/sensor-data.js';

const router = Router();

/**
 * GET /api/sensor-data/latest
 * Latest reading per device/sensor (for dashboard current values).
 * Query: ?device_id=indoor-01 (optional)
 */
router.get('/latest', async (req, res) => {
  try {
    const { device_id: deviceId } = req.query;
    const rows = await getLatestSensorData(deviceId || null);
    res.json(rows);
  } catch (err) {
    console.error('[API] GET /sensor-data/latest', err);
    res.status(500).json({ error: 'Failed to fetch latest sensor data' });
  }
});

/**
 * GET /api/sensor-data/history
 * Historical sensor data for charts.
 * Query: device_id, sensor_type, from (ISO date), to (ISO date), limit (default 500)
 */
router.get('/history', async (req, res) => {
  try {
    const { device_id: deviceId, sensor_type: sensorType, from, to, limit } = req.query;
    const rows = await getSensorDataHistory({
      deviceId: deviceId || null,
      sensorType: sensorType || null,
      from: from || null,
      to: to || null,
      limit: limit ? parseInt(limit, 10) : 500,
    });
    res.json(rows);
  } catch (err) {
    console.error('[API] GET /sensor-data/history', err);
    res.status(500).json({ error: 'Failed to fetch sensor history' });
  }
});

export default router;
