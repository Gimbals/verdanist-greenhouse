# 🌱 SISTEM IOT GREENHOUSE VERDANIST
## Panduan Lengkap Implementasi ESP32 dan Koneksi Sensor

---

## 📋 DAFTAR ISI

1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Komponen Hardware yang Dibutuhkan](#komponen-hardware-yang-dibutuhkan)
3. [Setup ESP32/ESP8266](#setup-esp32esp8266)
4. [Koneksi MQTT](#koneksi-mqtt)
5. [Integrasi Backend](#integrasi-backend)
6. [Menghapus Data Dummy](#menghapus-data-dummy)
7. [Biaya Estimasi](#biaya-estimasi)
8. [Step-by-Step Implementasi](#step-by-step-implementasi)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARSITEKTUR SISTEM

### Flow Data Lengkap:
```
🌡️ SENSOR ESP32 → 📡 WIFI → 🌐 MQTT BROKER → ⚙️ BACKEND API → 🖥️ FRONTEND REACT
     ↓               ↓           ↓              ↓              ↓
  DHT22,          ESP32       Mosquitto      Node.js        React App
  Soil Moist.,   WiFi        Port 1883      Port 3000      Port 5174
  Light, etc.     Client      Messages       REST API       WebSocket
```

### Komponen Sistem:
1. **Hardware Layer**: ESP32 + Sensor
2. **Network Layer**: WiFi + MQTT
3. **Backend Layer**: Node.js + Express + MQTT
4. **Frontend Layer**: React + WebSocket
5. **Database Layer**: PostgreSQL

---

## 🔧 KOMPONEN HARDWARE YANG DIBUTUHKAN

### 1. ESP32/ESP8266 Development Board
- **ESP32 DevKit V1** (Recommended: Rp50.000 - Rp80.000)
- Atau **ESP8266 NodeMCU** (Budget: Rp30.000 - Rp50.000)
- **Spesifikasi minimum**:
  - WiFi built-in
  - Minimal 4MB flash
  - Multiple GPIO pins
  - 3.3V logic level

### 2. Sensor-Sensor Greenhouse
| Sensor | Fungsi | Harga | Pin ESP32 |
|--------|--------|-------|-----------|
| DHT22 | Suhu & Kelembaban | Rp25.000 | Digital Pin |
| Soil Moisture | Kelembaban Tanah | Rp15.000 | Analog Pin |
| Light Sensor LDR | Intensitas Cahaya | Rp5.000 | Analog Pin |
| pH Sensor | pH Air/Tanah | Rp120.000 | Analog Pin |
| Ultrasonic HC-SR04 | Ketinggian Air | Rp20.000 | Trigger/Echo |
| Relay Module | Kontrol Pompa/Lampu | Rp15.000 | Digital Pin |

### 3. Komponen Pendukung
- **Breadboard**: Rp15.000
- **Jumper Wires**: Rp10.000
- **Power Supply 5V**: Rp30.000
- **Waterproof Casing**: Rp50.000

### 4. Total Estimasi Biaya Hardware
```
ESP32 DevKit      : Rp 70.000
Sensor Set (5pcs): Rp175.000
Komponen Pendukung: Rp105.000
TOTAL ESTIMASI   : Rp350.000
```

---

## 💻 SETUP ESP32/ESP8266

### 1. Install Arduino IDE
1. Download dari https://www.arduino.cc/en/software
2. Install ESP32 Board Manager:
   - File → Preferences → Additional Boards Manager URLs
   - Tambahkan: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install

### 2. Library yang Dibutuhkan
Install melalui Sketch → Include Library → Manage Libraries:
- **WiFi.h** (built-in)
- **PubSubClient.h** (untuk MQTT)
- **DHT.h** (untuk sensor DHT22)
- **ArduinoJson.h** (untuk format data)

### 3. Koneksi Pin ESP32
```
ESP32 Pin Layout:
┌─────────────┬─────────┬─────────────┐
│ SENSOR      │ PIN ESP │ KETERANGAN  │
├─────────────┼─────────┼─────────────┤
│ DHT22       │ GPIO4   │ Suhu/Udara │
│ Soil Moist  │ GPIO34   │ ADC1_CH6   │
│ LDR Light   │ GPIO35   │ ADC1_CH7   │
│ pH Sensor   │ GPIO32   │ ADC1_CH4   │
│ Ultrasonic  │ GPIO22/23│ Trig/Echo  │
│ Relay 1     │ GPIO25   │ Pompa Air  │
│ Relay 2     │ GPIO26   │ Lampu LED  │
│ LED Status  │ GPIO2    │ Built-in   │
└─────────────┴─────────┴─────────────┘
```

---

## 📡 KONEKSI MQTT

### 1. Setup MQTT Broker (Local)
Install Mosquitto:
```bash
# Windows (Chocolatey)
choco install mosquitto

# Linux/Mac
sudo apt-get install mosquitto mosquitto-clients
# atau
brew install mosquitto
```

### 2. Konfigurasi MQTT
Edit file `mosquitto.conf`:
```conf
# Port listener
port 1883

# Allow anonymous connections (untuk development)
allow_anonymous true

# Persistence
persistence true
persistence_location /mosquitto/data/

# Log
log_dest file /mosquitto/log/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information
```

### 3. Topic Structure untuk Greenhouse
```
verdanist/greenhouse/{device_id}/sensors/temperature
verdanist/greenhouse/{device_id}/sensors/humidity
verdanist/greenhouse/{device_id}/sensors/soil_moisture
verdanist/greenhouse/{device_id}/sensors/light_level
verdanist/greenhouse/{device_id}/sensors/ph_level
verdanist/greenhouse/{device_id}/sensors/water_level
verdanist/greenhouse/{device_id}/controls/relay1
verdanist/greenhouse/{device_id}/controls/relay2
verdanist/greenhouse/{device_id}/status/online
```

---

## ⚙️ INTEGRASI BACKEND

### 1. MQTT Client di Backend
Backend sudah memiliki MQTT integration. Check file:
- `backend/src/services/mqttService.js`
- `backend/src/controllers/sensorController.js`

### 2. Database Schema
Table untuk sensor data:
```sql
CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50),
    sensor_type VARCHAR(50),
    value DECIMAL(10,2),
    unit VARCHAR(10),
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'offline',
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. API Endpoints
```
GET  /api/sensors/latest          - Data sensor terbaru
GET  /api/sensors/history/:type   - Histori sensor
POST /api/devices/register        - Register device baru
GET  /api/devices/status          - Status semua device
POST /api/controls/:device_id     - Kirim control command
```

---

## 🗑️ MENGHAPUS DATA DUMMY

### 1. Lokasi File Mock Data
Cari file-file berikut di frontend:
- `src/app/context/GreenhouseContext.tsx`
- `src/app/data/mockSensorData.ts`
- `src/app/data/mockDevices.ts`

### 2. Cara Menghapus Dummy Data

#### Step 1: Comment/Remove Mock Data Generator
Di `GreenhouseContext.tsx`:
```typescript
// HILANGKAN bagian ini:
const generateMockData = () => {
  return {
    indoorTemperature: 25 + Math.random() * 10,
    indoorHumidity: 60 + Math.random() * 20,
    // ... data dummy lainnya
  };
};
```

#### Step 2: Update Context untuk Real API
```typescript
// GANTI dengan real API call:
const fetchSensorData = async () => {
  try {
    const response = await fetch('/api/sensors/latest');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return null;
  }
};
```

#### Step 3: Update useEffect
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetchSensorData();
    if (data) {
      setSensorData(data);
    }
  }, 5000); // Update setiap 5 detik

  return () => clearInterval(interval);
}, []);
```

### 3. Fallback untuk Offline Mode
```typescript
// Tambahkan fallback jika API tidak available:
const getFallbackData = () => ({
  indoorTemperature: 25,
  indoorHumidity: 65,
  soilMoisture: 50,
  waterTankLevel: 75,
  lightLevel: 80,
  ph: 6.5,
  conductivity: 1.2
});
```

---

## 💰 BIAYA ESTIMASI LENGKAP

### 1. Hardware (One-time)
| Item | Qty | Harga/Unit | Total |
|------|-----|------------|-------|
| ESP32 DevKit | 1 | Rp70.000 | Rp70.000 |
| DHT22 | 1 | Rp25.000 | Rp25.000 |
| Soil Moisture | 1 | Rp15.000 | Rp15.000 |
| LDR Light | 1 | Rp5.000 | Rp5.000 |
| pH Sensor | 1 | Rp120.000 | Rp120.000 |
| Ultrasonic | 1 | Rp20.000 | Rp20.000 |
| Relay 2CH | 1 | Rp15.000 | Rp15.000 |
| Breadboard | 1 | Rp15.000 | Rp15.000 |
| Jumper Wires | 1 | Rp10.000 | Rp10.000 |
| Power Supply | 1 | Rp30.000 | Rp30.000 |
| Casing | 1 | Rp50.000 | Rp50.000 |
| **SUBTOTAL** | | | **Rp375.000** |

### 2. Software/Cloud (Monthly)
| Service | Harga | Keterangan |
|---------|-------|------------|
| VPS DigitalOcean | $5/bulan | Untuk backend & MQTT |
| Domain Name | $10/tahun | Optional |
| SSL Certificate | Free | Let's Encrypt |
| **SUBTOTAL** | **$5/bulan** | **Rp75.000/bulan** |

### 3. Total Investment
- **Hardware**: Rp375.000 (one-time)
- **Monthly**: Rp75.000
- **First Month**: Rp450.000

---

## 📝 STEP-BY-STEP IMPLEMENTASI

### Phase 1: Persiapan Hardware (1-2 hari)
1. **Beli semua komponen**
2. **Setup Arduino IDE**
3. **Test ESP32 basic connection**
4. **Install semua library**

### Phase 2: Koneksi Sensor (2-3 hari)
1. **Rangkai semua sensor ke ESP32**
2. **Test setiap sensor individually**
3. **Upload test code untuk setiap sensor**
4. **Kalibrasi sensor (pH, soil moisture)**

### Phase 3: MQTT Integration (1-2 hari)
1. **Install Mosquitto MQTT broker**
2. **Setup MQTT di laptop/server**
3. **Test MQTT connection dengan ESP32**
4. **Implement publish/subscribe**

### Phase 4: Backend Integration (2-3 hari)
1. **Setup Node.js backend**
2. **Implement MQTT client di backend**
3. **Create API endpoints**
4. **Setup database PostgreSQL**

### Phase 5: Frontend Integration (1-2 hari)
1. **Remove mock data dari frontend**
2. **Connect ke real API endpoints**
3. **Implement WebSocket untuk real-time**
4. **Test end-to-end integration**

### Phase 6: Deployment (1 hari)
1. **Deploy backend ke VPS**
2. **Setup MQTT broker di cloud**
3. **Deploy frontend ke Netlify/Vercel**
4. **Test production environment**

### Total Timeline: **7-13 hari**

---

## 🔧 TROUBLESHOOTING

### 1. ESP32 Tidak Connect WiFi
```cpp
// Debug WiFi connection
Serial.println("Connecting to WiFi...");
WiFi.begin("SSID", "PASSWORD");
while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
}
Serial.println("WiFi connected!");
Serial.println("IP address: ");
Serial.println(WiFi.localIP());
```

### 2. MQTT Connection Failed
```cpp
// Check MQTT connection
if (!client.connected()) {
  Serial.println("MQTT not connected!");
  Serial.println("Attempting MQTT connection...");
  if (client.connect("ESP32Client")) {
    Serial.println("MQTT connected");
  } else {
    Serial.print("failed, rc=");
    Serial.print(client.state());
    Serial.println(" try again in 5 seconds");
    delay(5000);
  }
}
```

### 3. Sensor Reading Error
```cpp
// Debug sensor reading
float temp = dht.readTemperature();
if (isnan(temp)) {
  Serial.println("Failed to read from DHT sensor!");
  return;
}
Serial.print("Temperature: ");
Serial.println(temp);
```

### 4. Backend Not Receiving Data
1. **Check MQTT broker status**: `mosquitto_sub -h localhost -t "#"`
2. **Check backend logs**: `npm run dev`
3. **Verify topic structure**: Match exactly with backend subscription
4. **Check firewall**: Port 1883 harus open

### 5. Frontend Not Updating
1. **Check API endpoint**: `curl http://localhost:3000/api/sensors/latest`
2. **Check WebSocket connection**: Browser console
3. **Verify CORS settings**: Backend harus allow frontend origin
4. **Check network tab**: Request/response status

---

## 📞 SUPPORT & RESOURCES

### 1. Documentation Links
- ESP32 Documentation: https://docs.espressif.com/projects/esp-idf/en/latest/
- MQTT Documentation: https://mqtt.org/documentation
- Arduino ESP32: https://github.com/espressif/arduino-esp32

### 2. Video Tutorials (Recommended)
- ESP32 Beginner Tutorial: YouTube "Paul McWhorter"
- MQTT Basics: YouTube "ExplainingComputers"
- Node.js API: YouTube "Traversy Media"

### 3. Community Support
- ESP32 Forum: https://www.esp32.com/viewforum.php?f=19
- MQTT Forum: https://www.eclipse.org/forums/
- Stack Overflow: Tags esp32, mqtt, nodejs

---

## 🎯 NEXT STEPS

### Immediate Actions (Hari ini):
1. **Beli komponen hardware** yang dibutuhkan
2. **Install Arduino IDE** dan ESP32 board manager
3. **Setup development environment**

### This Week:
1. **Test ESP32 basic connection**
2. **Rangkai sensor-sensor**
3. **Implement MQTT connection**

### Next Week:
1. **Integrate dengan backend**
2. **Remove mock data**
3. **Test end-to-end system**

---

## 📞 KONTAK SUPPORT

Jika ada pertanyaan atau kendala teknis:
- **WhatsApp**: [Nomor Anda]
- **Email**: [Email Anda]
- **Telegram**: [Username Anda]

---

*Document Version: 1.0*
*Last Updated: 22 Maret 2026*
*Author: Verdanist IoT Team*

---

## 🚀 SELAMAT IMPLEMENTASI!

Sistem IoT Greenhouse Verdanist siap untuk diimplementasikan. 
Dengan panduan ini, Anda dapat membangun sistem monitoring 
dan kontrol greenhouse yang lengkap dengan biaya terjangkau 
dan performa yang reliable.

**Happy Coding & Happy Gardening!** 🌱💚
