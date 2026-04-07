// ESP32 Firebase Greenhouse Controller - PRODUCTION READY
// Optimized for real-world deployment with partners
// Features: Auto-reconnect, fail-safe, data validation, quota optimization

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <time.h>

// WiFi Configuration
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Firebase Configuration (use database secret for IoT)
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET_HERE"  // Get from Firebase Settings > Service Accounts

// Device Configuration
#define DEVICE_ID "indoor-01"

// Pin Configuration
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define FAN_RELAY 26
#define PUMP_RELAY 27
#define LED_RELAY 25
#define SOIL_SENSOR 34
#define LIGHT_SENSOR 35

// Timing variables (optimized for free tier)
unsigned long lastSensorUpload = 0;
unsigned long lastControlCheck = 0;
unsigned long lastStatusUpdate = 0;
unsigned long lastReconnectAttempt = 0;
unsigned long lastCommandTime = 0;

const unsigned long SENSOR_INTERVAL = 180000;        // 3 menit (hemat quota)
const unsigned long CONTROL_CHECK_INTERVAL = 60000;   // 1 menit
const unsigned long STATUS_INTERVAL = 300000;         // 5 menit
const unsigned long RECONNECT_INTERVAL = 30000;       // 30 detik
const unsigned long SAFETY_TIMEOUT = 300000;          // 5 menit auto-off

// Global variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
DHT dht(DHT_PIN, DHT_TYPE);

// System state
bool systemOnline = false;
bool pumpAutoMode = true;
float soilMoistureThreshold = 40.0;

// Control state for fail-safe
struct ControlState {
  bool fan;
  bool pump;
  bool led;
  unsigned long lastUpdate;
} controlState;

void setup() {
  Serial.begin(115200);
  Serial.println("=== VERDANIST GREENHOUSE CONTROLLER ===");
  
  // Initialize pins
  initializePins();
  
  // Initialize sensors
  dht.begin();
  
  // Initialize control state
  initializeControlState();
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup Firebase
  setupFirebase();
  
  // Setup control listener
  setupControlListener();
  
  // Initialize system time
  configTime(0, 0, "pool.ntp.org");
  
  Serial.println("System ready!");
  
  // Initial status update
  updateDeviceStatus();
}

void loop() {
  // Handle reconnections
  handleReconnections();
  
  // Only run when online
  if (systemOnline) {
    // Upload sensor data
    uploadSensorData();
    
    // Check controls (fallback)
    checkControlsFallback();
    
    // Update device status
    updateDeviceStatus();
    
    // Safety check (critical for pumps)
    safetyCheck();
    
    // Handle Firebase stream
    Firebase.handleStream(firebaseData);
  }
  
  // Local auto-mode logic (works even without internet)
  runLocalAutoMode();
  
  delay(1000);
}

void initializePins() {
  pinMode(FAN_RELAY, OUTPUT);
  pinMode(PUMP_RELAY, OUTPUT);
  pinMode(LED_RELAY, OUTPUT);
  
  // Start with all OFF (safe state)
  digitalWrite(FAN_RELAY, LOW);
  digitalWrite(PUMP_RELAY, LOW);
  digitalWrite(LED_RELAY, LOW);
  
  Serial.println("Pins initialized - all systems OFF");
}

void initializeControlState() {
  controlState.fan = false;
  controlState.pump = false;
  controlState.led = false;
  controlState.lastUpdate = millis();
}

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.println("IP: " + WiFi.localIP().toString());
    systemOnline = true;
  } else {
    Serial.println("\nWiFi connection failed!");
    systemOnline = false;
  }
}

void setupFirebase() {
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  // Test connection
  if (Firebase.ready()) {
    Serial.println("Firebase connected!");
  } else {
    Serial.println("Firebase connection failed!");
    systemOnline = false;
  }
}

void setupControlListener() {
  if (!systemOnline) return;
  
  Firebase.setStreamCallback(firebaseData, streamCallback, streamTimeoutCallback);
  
  String path = "/devices/" + String(DEVICE_ID) + "/controls";
  if (Firebase.beginStream(firebaseData, path.c_str())) {
    Serial.println("Control listener started!");
  } else {
    Serial.println("Failed to start control listener: " + firebaseData.errorReason());
  }
}

void streamCallback(StreamData data) {
  String path = data.path();
  String value = data.stringData();
  
  Serial.println("Control changed: " + path + " = " + value);
  
  // Update last command time for safety
  lastCommandTime = millis();
  
  // Process control commands
  if (path.indexOf("fan") >= 0) {
    bool newState = (value == "on");
    digitalWrite(FAN_RELAY, newState ? HIGH : LOW);
    controlState.fan = newState;
    controlState.lastUpdate = millis();
    
  } else if (path.indexOf("pump") >= 0) {
    bool newState = (value == "on");
    digitalWrite(PUMP_RELAY, newState ? HIGH : LOW);
    controlState.pump = newState;
    controlState.lastUpdate = millis();
    
  } else if (path.indexOf("led") >= 0) {
    bool newState = (value == "on");
    digitalWrite(LED_RELAY, newState ? HIGH : LOW);
    controlState.led = newState;
    controlState.lastUpdate = millis();
    
  } else if (path.indexOf("autoMode") >= 0) {
    pumpAutoMode = (value == "true");
    
  } else if (path.indexOf("soilThreshold") >= 0) {
    soilMoistureThreshold = value.toFloat();
  }
}

void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Stream timeout, will retry...");
    // Try to restart stream
    setupControlListener();
  }
}

void uploadSensorData() {
  if (!systemOnline) return;
  if (millis() - lastSensorUpload < SENSOR_INTERVAL) return;
  
  // Read sensors with validation
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soilMoisture = readSoilMoisture();
  int lightLevel = readLightLevel();
  
  // Validate sensor data
  bool validData = true;
  if (isnan(temperature) || temperature < -10 || temperature > 60) {
    Serial.println("Invalid temperature reading!");
    validData = false;
  }
  
  if (isnan(humidity) || humidity < 0 || humidity > 100) {
    Serial.println("Invalid humidity reading!");
    validData = false;
  }
  
  if (!validData) {
    Serial.println("Skipping upload due to invalid sensor data");
    return;
  }
  
  // Create optimized JSON (rounded values)
  FirebaseJson json;
  json.set("temperature", round(temperature * 10) / 10.0);  // 1 decimal
  json.set("humidity", round(humidity * 10) / 10.0);
  json.set("soilMoisture", soilMoisture);
  json.set("lightLevel", lightLevel);
  json.set("lastUpdate", getTimestamp());
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Sensor data uploaded successfully!");
    lastSensorUpload = millis();
  } else {
    Serial.println("Failed to upload sensor data: " + firebaseData.errorReason());
    // Mark as offline for retry
    systemOnline = false;
  }
}

void checkControlsFallback() {
  if (!systemOnline) return;
  if (millis() - lastControlCheck < CONTROL_CHECK_INTERVAL) return;
  
  String basePath = "/devices/" + String(DEVICE_ID) + "/controls";
  
  // Check fan control
  if (Firebase.getString(firebaseData, (basePath + "/fan").c_str())) {
    bool fanState = (firebaseData.stringData() == "on");
    digitalWrite(FAN_RELAY, fanState ? HIGH : LOW);
    controlState.fan = fanState;
  }
  
  // Check pump control
  if (Firebase.getString(firebaseData, (basePath + "/pump").c_str())) {
    bool pumpState = (firebaseData.stringData() == "on");
    digitalWrite(PUMP_RELAY, pumpState ? HIGH : LOW);
    controlState.pump = pumpState;
  }
  
  // Check LED control
  if (Firebase.getString(firebaseData, (basePath + "/led").c_str())) {
    bool ledState = (firebaseData.stringData() == "on");
    digitalWrite(LED_RELAY, ledState ? HIGH : LOW);
    controlState.led = ledState;
  }
  
  // Check auto mode
  if (Firebase.getString(firebaseData, (basePath + "/autoMode").c_str())) {
    pumpAutoMode = (firebaseData.stringData() == "true");
  }
  
  // Check soil threshold
  if (Firebase.getString(firebaseData, (basePath + "/soilThreshold").c_str())) {
    soilMoistureThreshold = firebaseData.stringData().toFloat();
  }
  
  lastControlCheck = millis();
}

void updateDeviceStatus() {
  if (!systemOnline) return;
  if (millis() - lastStatusUpdate < STATUS_INTERVAL) return;
  
  FirebaseJson json;
  json.set("status", WiFi.status() == WL_CONNECTED ? "online" : "offline");
  json.set("lastSeen", getTimestamp());
  json.set("wifiSignal", WiFi.RSSI());
  json.set("freeHeap", ESP.getFreeHeap());
  json.set("uptime", millis() / 1000);
  
  String path = "/devices/" + String(DEVICE_ID) + "/meta";
  if (Firebase.updateNode(firebaseData, path.c_str(), json)) {
    Serial.println("Device status updated!");
    lastStatusUpdate = millis();
  } else {
    Serial.println("Failed to update status: " + firebaseData.errorReason());
  }
}

void safetyCheck() {
  // Critical safety check for pumps
  if (millis() - lastCommandTime > SAFETY_TIMEOUT) {
    if (controlState.pump) {
      Serial.println("SAFETY: Auto-off pump after timeout!");
      digitalWrite(PUMP_RELAY, LOW);
      controlState.pump = false;
      
      // Update Firebase
      if (systemOnline) {
        String path = "/devices/" + String(DEVICE_ID) + "/controls/pump";
        Firebase.setString(firebaseData, path.c_str(), "off");
      }
    }
  }
}

void runLocalAutoMode() {
  // This works even without internet connection
  if (!pumpAutoMode) return;
  
  int soilMoisture = readSoilMoisture();
  
  // Simple auto-irrigation logic
  if (soilMoisture < soilMoistureThreshold) {
    if (!controlState.pump) {
      Serial.println("AUTO: Starting irrigation (soil: " + String(soilMoisture) + "%)");
      digitalWrite(PUMP_RELAY, HIGH);
      controlState.pump = true;
      controlState.lastUpdate = millis();
    }
  } else {
    if (controlState.pump) {
      Serial.println("AUTO: Stopping irrigation (soil: " + String(soilMoisture) + "%)");
      digitalWrite(PUMP_RELAY, LOW);
      controlState.pump = false;
      controlState.lastUpdate = millis();
    }
  }
}

void handleReconnections() {
  // WiFi reconnection
  if (WiFi.status() != WL_CONNECTED) {
    if (millis() - lastReconnectAttempt > RECONNECT_INTERVAL) {
      Serial.println("Attempting WiFi reconnection...");
      connectWiFi();
      lastReconnectAttempt = millis();
    }
  } else {
    // Firebase reconnection
    if (!Firebase.ready() && systemOnline) {
      if (millis() - lastReconnectAttempt > RECONNECT_INTERVAL) {
        Serial.println("Attempting Firebase reconnection...");
        setupFirebase();
        setupControlListener();
        lastReconnectAttempt = millis();
      }
    }
  }
}

// Sensor reading functions with validation
int readSoilMoisture() {
  int raw = analogRead(SOIL_SENSOR);
  int mapped = map(raw, 0, 4095, 0, 100);
  return constrain(mapped, 0, 100);
}

int readLightLevel() {
  int raw = analogRead(LIGHT_SENSOR);
  int mapped = map(raw, 0, 4095, 0, 100);
  return constrain(mapped, 0, 100);
}

String getTimestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);
  
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

// Error handling and monitoring
void printSystemInfo() {
  Serial.println("=== SYSTEM INFO ===");
  Serial.println("WiFi: " + String(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected"));
  Serial.println("RSSI: " + String(WiFi.RSSI()) + " dBm");
  Serial.println("Free Heap: " + String(ESP.getFreeHeap()) + " bytes");
  Serial.println("Uptime: " + String(millis() / 1000) + " seconds");
  Serial.println("Controls - Fan: " + String(controlState.fan ? "ON" : "OFF"));
  Serial.println("Controls - Pump: " + String(controlState.pump ? "ON" : "OFF"));
  Serial.println("Controls - LED: " + String(controlState.led ? "ON" : "OFF"));
  Serial.println("Auto Mode: " + String(pumpAutoMode ? "ON" : "OFF"));
  Serial.println("==================");
}
