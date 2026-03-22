import { Router } from 'express';
import devices from './devices.js';
import sensorData from './sensor-data.js';
import control from './control.js';
import controlHistory from './control-history.js';
import historyLog from './history-log.js';
import { apiKeyAuth } from '../middleware/apiKey.js';

const router = Router();

router.use(apiKeyAuth);

router.use('/devices', devices);
router.use('/sensor-data', sensorData);
router.use('/control', control);           // POST /api/control
router.use('/control/history', controlHistory); // GET /api/control/history
router.use('/logs', historyLog);

export default router;
