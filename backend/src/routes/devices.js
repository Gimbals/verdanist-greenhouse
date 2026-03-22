import { Router } from 'express';
import { getDevices, getDeviceById } from '../db/devices.js';

const router = Router();

/**
 * GET /api/devices
 * List all devices (indoor/outdoor nodes).
 * Query: ?location=indoor|outdoor
 */
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const devices = await getDevices(location || null);
    res.json(devices);
  } catch (err) {
    console.error('[API] GET /devices', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

/**
 * GET /api/devices/:deviceId
 * Get single device by id.
 */
router.get('/:deviceId', async (req, res) => {
  try {
    const device = await getDeviceById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    console.error('[API] GET /devices/:id', err);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

export default router;
