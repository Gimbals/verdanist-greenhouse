// ESP32 Firebase Simulator - Compatible Version
// Fixed for Wokwi library compatibility

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <time.h>

// WiFi Configuration (Wokwi has built-in WiFi)
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "vhX4nUnNjhMbBAaCmEp8uewh438uuZi5034HShUr"

// Device Configuration
#define DEVICE_ID "indoor-01"

// Global variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Timing variables
unsigned long lastUpload = 0;
unsigned long lastControlCheck = 0;
const unsigned long UPLOAD_INTERVAL = 10000;        // 10 detik
const unsigned long CONTROL_CHECK_INTERVAL = 30000;   // 30 detik

// Simulated sensor values
struct SimulatedSensors {
  float temperature;
  float humidity;
  int soilMoisture;
  int lightLevel;
} sensors;

// Control state
struct ControlState {
  bool fan;
  bool pump;
  bool led;
} controlState;

void setup() {
  Serial.begin(115200);
  Serial.println("=== WOKWI FIREBASE SIMULATOR (COMPATIBLE) ===");
  
  // Initialize simulated sensors
  initializeSensors();
  
  // Initialize control state
  initializeControls();
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup Firebase
  setupFirebase();
  
  // Initialize system time
  configTime(0, 0, "pool.ntp.org");
  
  Serial.println("Wokwi simulator ready!");
}

void loop() {
  // Only run when online
  if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    // Upload simulated sensor data
    uploadSensorData();
    
    // Check controls (polling instead of streaming)
    checkControlsFallback();
    
    // Update device status
    updateDeviceStatus();
    
    // Simulate sensor changes
    simulateSensorChanges();
  }
  
  delay(1000);
}

void initializeSensors() {
  sensors.temperature = 25.0;
  sensors.humidity = 65.0;
  sensors.soilMoisture = 50;
  sensors.lightLevel = 75;
  
  Serial.println("Simulated sensors initialized");
}

void initializeControls() {
  controlState.fan = false;
  controlState.pump = false;
  controlState.led = true;
  
  Serial.println("Control state initialized");
}

void connectWiFi() {
  Serial.println("Connecting to Wokwi WiFi...");
  
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
  } else {
    Serial.println("\nWiFi connection failed!");
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
  }
}

void uploadSensorData() {
  if (millis() - lastUpload < UPLOAD_INTERVAL) return;
  
  // Create simulated JSON data
  FirebaseJson json;
  json.set("temperature", sensors.temperature);
  json.set("humidity", sensors.humidity);
  json.set("soilMoisture", sensors.soilMoisture);
  json.set("lightLevel", sensors.lightLevel);
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Sensor data uploaded successfully!");
    Serial.print("Temp: "); Serial.print(sensors.temperature); Serial.print("°C, ");
    Serial.print("Humidity: "); Serial.print(sensors.humidity); Serial.print("%, ");
    Serial.print("Soil: "); Serial.print(sensors.soilMoisture); Serial.print("%, ");
    Serial.print("Light: "); Serial.print(sensors.lightLevel); Serial.println("%");
    
    lastUpload = millis();
  } else {
    Serial.println("Failed to upload sensor data: " + firebaseData.errorReason());
  }
}

void checkControlsFallback() {
  if (millis() - lastControlCheck < CONTROL_CHECK_INTERVAL) return;
  
  String basePath = "/devices/" + String(DEVICE_ID) + "/controls";
  
  // Check fan control
  if (Firebase.getString(firebaseData, (basePath + "/fan").c_str())) {
    bool newFanState = (firebaseData.stringData() == "on");
    if (newFanState != controlState.fan) {
      controlState.fan = newFanState;
      Serial.println("FAN: " + String(controlState.fan ? "ON" : "OFF"));
    }
  }
  
  // Check pump control
  if (Firebase.getString(firebaseData, (basePath + "/pump").c_str())) {
    bool newPumpState = (firebaseData.stringData() == "on");
    if (newPumpState != controlState.pump) {
      controlState.pump = newPumpState;
      Serial.println("PUMP: " + String(controlState.pump ? "ON" : "OFF"));
    }
  }
  
  // Check LED control
  if (Firebase.getString(firebaseData, (basePath + "/not").c_str())) {
    bool newLedState = (firebaseData.stringData() == "on");
    if (newLedState != controlState.led) {
      controlState.led = newLedState;
      Serial.println("LED: " + String(controlState.led ? "ON" : "OFF"));
    }
  }
  
  lastControlCheck = millis();
}

void updateDeviceStatus() {
  FirebaseJson json;
  json.set("status", WiFi.status() == WL_CONNECTED ? "online" : "offline");
  json.set("lastSeen", getTimestamp());
  json.set("wifiSignal", WiFi.RSSI());
  json.set("freeHeap", ESP.getFreeHeap());
  json.set("uptime", millis() / 1000);
  
  String path = "/devices/" + String(DEVICE_ID) + "/meta";
  if (Firebase.updateNode(firebaseData, path.c_str(), json)) {
    Serial.println("Device status updated!");
  } else {
    Serial.println("Failed to update status: " + firebaseData.errorReason());
  }
}

void simulateSensorChanges() {
  // Simulate realistic sensor changes
  static unsigned long lastChange = 0;
  
  if (millis() - lastChange > 5000) { // Every 5 seconds
    // Temperature: +/- 0.5°C
    sensors.temperature += (random(-5, 6) / 10.0);
    sensors.temperature = constrain(sensors.temperature, 20.0, 35.0);
    
    // Humidity: +/- 2%
    sensors.humidity += (random(-20, 21) / 10.0);
    sensors.humidity = constrain(sensors.humidity, 40.0, 80.0);
    
    // Soil Moisture: +/- 1%
    sensors.soilMoisture += (random(-10, 11) / 10.0);
    sensors.soilMoisture = constrain(sensors.soilMoisture, 20, 80);
    
    // Light Level: +/- 5%
    sensors.lightLevel += (random(-50, 51) / 10.0);
    sensors.lightLevel = constrain(sensors.lightLevel, 0, 100);
    
    lastChange = millis();
  }
}

String getTimestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);
  
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}
