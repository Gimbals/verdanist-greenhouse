import express from 'express';

import cors from 'cors';

import { config } from './config.js';

import { healthCheck } from './db/client.js';

import routes from './routes/index.js';

import { createSubscriber } from './mqtt/subscriber.js';

import { createPublisher } from './mqtt/publisher.js';

import { runMigrations } from './db/migrate.js';



const app = express();



app.use(cors({ origin: true }));

app.use(express.json());



app.get('/', (req, res) => {
  res.send('Verdanist IoT Greenhouse Backend is running 🚀');
});

app.get('/health', async (req, res) => {

  const dbOk = await healthCheck();

  res.status(dbOk ? 200 : 503).json({

    status: dbOk ? 'ok' : 'degraded',

    database: dbOk ? 'connected' : 'disconnected',

  });

});



app.use('/api', routes);



const server = app.listen(config.port, "0.0.0.0", async () => {

  console.log(`[Server] Verdanist backend listening on http://0.0.0.0:${config.port}`);

  // Run database migrations on startup
  try {
    await runMigrations();
    console.log('[Database] Migrations completed successfully');
  } catch (err) {
    console.error('[Database] Migration failed:', err.message);
  }

});



// MQTT: subscribe to sensor + status (store in DB)

const mqttSubscriber = createSubscriber();

app.locals.mqttSubscriber = mqttSubscriber;



// MQTT: publish control commands (from API)

const mqttPublisher = createPublisher();

app.locals.mqttPublisher = mqttPublisher;



process.on('SIGINT', () => {

  mqttSubscriber?.end();

  mqttPublisher?.end();

  server.close(() => process.exit(0));

});



process.on('SIGTERM', () => {

  mqttSubscriber?.end();

  mqttPublisher?.end();

  server.close(() => process.exit(0));

});

