import { Router } from 'express';
import { createControlCommand } from '../db/device-control.js';
import { publishControlNow } from '../mqtt/publisher.js';

/**
 * Control router. Requires mqttPublisherClient to be attached to req.app.locals by main app.
 */
function getPublisher(req) {
  return req.app.locals.mqttPublisher;
}

/**
 * POST /api/control
 * Send control command to device (fan or pump).
 * Body: { device_id, control_type, command [, value] }
 * - device_id: 'indoor-01' | 'outdoor-01'
 * - control_type: 'fan' | 'pump'
 * - command: 'on' | 'off' | 'auto'
 * - value: optional number (e.g. duty %)
 */
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { device_id: deviceId, control_type: controlType, command, value } = req.body || {};
    if (!deviceId || !controlType || !command) {
      return res.status(400).json({
        error: 'Missing required fields: device_id, control_type, command',
      });
    }
    const allowedDevices = ['indoor-01', 'outdoor-01'];
    const allowedTypes = { 'indoor-01': ['fan'], 'outdoor-01': ['pump'] };
    if (!allowedDevices.includes(deviceId) || !allowedTypes[deviceId]?.includes(controlType)) {
      return res.status(400).json({ error: 'Invalid device_id or control_type' });
    }

    const row = await createControlCommand({
      deviceId,
      controlType,
      command: String(command).toLowerCase(),
      value: value != null ? parseFloat(value) : null,
    });

    const client = getPublisher(req);
    if (client && client.connected) {
      const published = await publishControlNow(client, {
        deviceId,
        controlType,
        command: row.command,
        value: row.value,
      });
      return res.status(201).json({ ...row, published });
    }

    res.status(201).json({ ...row, published: false, message: 'Queued; will be sent when MQTT is connected' });
  } catch (err) {
    console.error('[API] POST /control', err);
    res.status(500).json({ error: 'Failed to create control command' });
  }
});

export default router;
