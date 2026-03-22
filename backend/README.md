# Verdanist Backend – IoT Smart Greenhouse

Node.js Express backend + MQTT bridge for the Verdanist IoT Smart Greenhouse (per architecture diagram).

## Components

- **PostgreSQL** – Stores devices, sensor_data, history_log, device_control
- **MQTT Subscriber** – Subscribes to sensor/status topics, writes to DB
- **MQTT Publisher** – Publishes control commands (fan, pump) to devices
- **REST API** – Used by the web dashboard

## Setup

### 1. PostgreSQL

Create a database and run the schema:

```bash
createdb verdanist
cp .env.example .env
# Edit .env: set DATABASE_URL and MQTT_BROKER_URL
npm run db:migrate
```

### 2. MQTT Broker

Use a local broker (e.g. Mosquitto) or cloud (Holo Smart). Set `MQTT_BROKER_URL` in `.env` (e.g. `mqtt://localhost:1883` or `mqtts://broker:8883` for TLS).

### 3. Install & run

```bash
npm install
npm run dev
```

Server: `http://localhost:3001`

## API Endpoints (for dashboard)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices` | List devices (`?location=indoor\|outdoor`) |
| GET | `/api/devices/:deviceId` | Get one device |
| GET | `/api/sensor-data/latest` | Latest reading per sensor (`?device_id=optional`) |
| GET | `/api/sensor-data/history` | History for charts (`device_id`, `sensor_type`, `from`, `to`, `limit`) |
| POST | `/api/control` | Send control: `{ device_id, control_type, command [, value] }` |
| GET | `/api/control/history` | Control command history (`?device_id`, `limit`) |
| GET | `/api/logs` | Event/audit logs (`?device_id`, `action`, `from`, `to`, `limit`) |
| GET | `/health` | Health check (DB status) |

Optional: set `API_KEY` in `.env` and send `X-Api-Key` (or `?api_key=`) on API requests.

## MQTT Topics

- **Sensor (subscribed):**  
  `greenhouse/indoor/sensor/temperature`, `greenhouse/indoor/sensor/humidity`,  
  `greenhouse/outdoor/sensor/soil_moisture`
- **Status (subscribed):**  
  `greenhouse/indoor/status`, `greenhouse/outdoor/status`
- **Control (published):**  
  `greenhouse/indoor/control/fan`, `greenhouse/outdoor/control/pump`

Payloads: sensor/status can be JSON or number string; control is `"on"` / `"off"` or JSON `{ "command", "value" }`.
