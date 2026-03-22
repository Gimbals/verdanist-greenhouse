-- Verdanist IoT Smart Greenhouse - PostgreSQL Schema
-- Based on architecture: devices, sensor_data, history_log, device_control

-- Enable UUID extension (optional, for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- DEVICES
-- ESP32 nodes (indoor/outdoor) and their metadata
-- =============================================================================
CREATE TABLE IF NOT EXISTS devices (
  device_id       VARCHAR(64) PRIMARY KEY,
  device_name     VARCHAR(128) NOT NULL,
  location        VARCHAR(32) NOT NULL CHECK (location IN ('indoor', 'outdoor')),
  type            VARCHAR(64) NOT NULL DEFAULT 'esp32',
  status          VARCHAR(32) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'maintenance')),
  last_seen_at    TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_location ON devices(location);
CREATE INDEX idx_devices_status ON devices(status);

-- =============================================================================
-- SENSOR_DATA
-- Historical readings from MQTT sensor topics
-- Topics: greenhouse/indoor/sensor/temperature, humidity; greenhouse/outdoor/sensor/soil_moisture
-- =============================================================================
CREATE TABLE IF NOT EXISTS sensor_data (
  data_id         BIGSERIAL PRIMARY KEY,
  device_id       VARCHAR(64) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  sensor_type     VARCHAR(64) NOT NULL,  -- 'temperature' | 'humidity' | 'soil_moisture'
  value           DECIMAL(12, 4) NOT NULL,
  unit            VARCHAR(16),           -- '°C' | '%' etc.
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sensor_data_device_id ON sensor_data(device_id);
CREATE INDEX idx_sensor_data_sensor_type ON sensor_data(sensor_type);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp DESC);
CREATE INDEX idx_sensor_data_device_timestamp ON sensor_data(device_id, timestamp DESC);

-- =============================================================================
-- DEVICE_CONTROL
-- Control state and pending commands for fan, pump, etc.
-- Maps to: greenhouse/indoor/control/fan, greenhouse/outdoor/control/pump
-- =============================================================================
CREATE TABLE IF NOT EXISTS device_control (
  control_id      BIGSERIAL PRIMARY KEY,
  device_id       VARCHAR(64) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  control_type    VARCHAR(64) NOT NULL,   -- 'fan' | 'pump'
  command        VARCHAR(32) NOT NULL,    -- 'on' | 'off' | 'auto'
  status         VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'failed')),
  value          DECIMAL(12, 4),         -- optional numeric value (e.g. duty %)
  sent_at        TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_control_device_id ON device_control(device_id);
CREATE INDEX idx_device_control_status ON device_control(status);
CREATE INDEX idx_device_control_created_at ON device_control(created_at DESC);

-- =============================================================================
-- HISTORY_LOG
-- Audit log for actions, alerts, and system events
-- =============================================================================
CREATE TABLE IF NOT EXISTS history_log (
  log_id          BIGSERIAL PRIMARY KEY,
  device_id       VARCHAR(64) REFERENCES devices(device_id) ON DELETE SET NULL,
  action          VARCHAR(128) NOT NULL,  -- 'control_sent', 'sensor_alert', 'device_online', etc.
  details         JSONB DEFAULT '{}',
  severity        VARCHAR(16) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_log_device_id ON history_log(device_id);
CREATE INDEX idx_history_log_timestamp ON history_log(timestamp DESC);
CREATE INDEX idx_history_log_action ON history_log(action);

-- =============================================================================
-- TRIGGERS
-- Auto-update updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS devices_updated_at ON devices;
CREATE TRIGGER devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS device_control_updated_at ON device_control;
CREATE TRIGGER device_control_updated_at
  BEFORE UPDATE ON device_control
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- =============================================================================
-- SEED: Default devices (Indoor + Outdoor nodes)
-- =============================================================================
INSERT INTO devices (device_id, device_name, location, type) VALUES
  ('indoor-01', 'ESP32 Indoor Node', 'indoor', 'esp32'),
  ('outdoor-01', 'ESP32 Outdoor Node', 'outdoor', 'esp32')
ON CONFLICT (device_id) DO NOTHING;
