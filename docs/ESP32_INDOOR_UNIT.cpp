// ESP32 Greenhouse - Indoor Unit
// Sensor Udara: Temperature, Humidity, Air Quality, Light

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include <time.h>

// WiFi Configuration
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "vhX4nUnNjhMbBAaCmEp8uewh438uuZi5034HShUr"

// Device Configuration
#define DEVICE_ID "indoor-01"
#define UNIT_TYPE "indoor"

// Pin Configuration
#define DHT_PIN 4
#define MQ135_PIN 34
#define LDR_PIN 35
#define RGB_R_PIN 25
#define RGB_G_PIN 26
#define RGB_B_PIN 27
#define BUZZER_PIN 32
#define FAN_RELAY_PIN 33

// DHT Configuration
#define DHT_TYPE DHT22

// Global Variables
WiFiClientSecure client;
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
DHT dht(DHT_PIN, DHT_TYPE);

// Timing Variables
unsigned long lastSensorUpload = 0;
unsigned long lastControlCheck = 0;
unsigned long lastStatusUpdate = 0;

const unsigned long SENSOR_INTERVAL = 10000;      // 10 seconds
const unsigned long CONTROL_INTERVAL = 5000;      // 5 seconds
const unsigned long STATUS_INTERVAL = 60000;      // 1 minute

// Sensor Data Structure
struct IndoorSensorData {
  float temperature;
  float humidity;
  int airQuality;
  int lightLevel;
  float heatIndex;
  String airQualityStatus;
} sensorData;

// Control State
struct ControlState {
  bool fan;
  bool alarm;
  String statusLED;
} controlState;

void setup() {
  Serial.begin(115200);
  Serial.println("=== GREENHOUSE INDOOR UNIT ===");
  
  // Initialize Pins
  initializePins();
  
  // Initialize Sensors
  initializeSensors();
  
  // Connect WiFi
  connectWiFi();
  
  // Setup Firebase
  setupFirebase();
  
  // Initialize Control State
  initializeControls();
  
  Serial.println("Indoor unit ready!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    // Read Sensors
    readSensors();
    
    // Upload Sensor Data
    uploadSensorData();
    
    // Check Controls
    checkControls();
    
    // Update Status
    updateDeviceStatus();
    
    // Process Alarms
    processAlarms();
    
    // Update Visual Indicators
    updateIndicators();
  }
  
  delay(1000);
}

void initializePins() {
  // RGB LED Pins
  pinMode(RGB_R_PIN, OUTPUT);
  pinMode(RGB_G_PIN, OUTPUT);
  pinMode(RGB_B_PIN, OUTPUT);
  
  // Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Fan Relay
  pinMode(FAN_RELAY_PIN, OUTPUT);
  
  // Sensor Pins
  pinMode(MQ135_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  
  // Initial State
  digitalWrite(RGB_R_PIN, LOW);
  digitalWrite(RGB_G_PIN, LOW);
  digitalWrite(RGB_B_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(FAN_RELAY_PIN, LOW);
  
  Serial.println("Pins initialized");
}

void initializeSensors() {
  // Initialize DHT
  dht.begin();
  
  // Warm up sensors
  delay(2000);
  
  Serial.println("Sensors initialized");
}

void initializeControls() {
  controlState.fan = false;
  controlState.alarm = false;
  controlState.statusLED = "green";
  
  Serial.println("Controls initialized");
}

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
  Serial.println("IP: " + WiFi.localIP().toString());
}

void setupFirebase() {
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  if (Firebase.ready()) {
    Serial.println("Firebase connected!");
  } else {
    Serial.println("Firebase connection failed!");
  }
}

void readSensors() {
  // Read DHT22
  sensorData.temperature = dht.readTemperature();
  sensorData.humidity = dht.readHumidity();
  
  // Calculate Heat Index
  sensorData.heatIndex = dht.computeHeatIndex(sensorData.temperature, sensorData.humidity, false);
  
  // Read MQ135 (Air Quality)
  int mq135Raw = analogRead(MQ135_PIN);
  sensorData.airQuality = map(mq135Raw, 0, 4095, 0, 100); // Convert to percentage
  
  // Determine Air Quality Status
  if (sensorData.airQuality < 30) {
    sensorData.airQualityStatus = "Good";
  } else if (sensorData.airQuality < 60) {
    sensorData.airQualityStatus = "Moderate";
  } else {
    sensorData.airQualityStatus = "Poor";
  }
  
  // Read LDR (Light Level)
  int ldrRaw = analogRead(LDR_PIN);
  sensorData.lightLevel = map(ldrRaw, 0, 4095, 0, 100); // Convert to percentage
  
  Serial.println("Sensors read successfully");
}

void uploadSensorData() {
  if (millis() - lastSensorUpload < SENSOR_INTERVAL) return;
  
  // Create JSON Data
  FirebaseJson json;
  json.set("temperature", sensorData.temperature);
  json.set("humidity", sensorData.humidity);
  json.set("heatIndex", sensorData.heatIndex);
  json.set("airQuality", sensorData.airQuality);
  json.set("airQualityStatus", sensorData.airQualityStatus);
  json.set("lightLevel", sensorData.lightLevel);
  json.set("timestamp", getTimestamp());
  json.set("unitType", UNIT_TYPE);
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Indoor sensor data uploaded!");
    lastSensorUpload = millis();
  } else {
    Serial.println("Upload failed: " + firebaseData.errorReason());
  }
}

void checkControls() {
  if (millis() - lastControlCheck < CONTROL_INTERVAL) return;
  
  String basePath = "/devices/" + String(DEVICE_ID) + "/controls";
  
  // Check Fan Control
  if (Firebase.getString(firebaseData, (basePath + "/fan").c_str())) {
    bool newFanState = (firebaseData.stringData() == "on");
    if (newFanState != controlState.fan) {
      controlState.fan = newFanState;
      digitalWrite(FAN_RELAY_PIN, controlState.fan ? HIGH : LOW);
      Serial.println("Fan: " + String(controlState.fan ? "ON" : "OFF"));
    }
  }
  
  // Check Alarm Control
  if (Firebase.getString(firebaseData, (basePath + "/alarm").c_str())) {
    bool newAlarmState = (firebaseData.stringData() == "on");
    if (newAlarmState != controlState.alarm) {
      controlState.alarm = newAlarmState;
      Serial.println("Alarm: " + String(controlState.alarm ? "ON" : "OFF"));
    }
  }
  
  // Check LED Status
  if (Firebase.getString(firebaseData, (basePath + "/statusLED").c_str())) {
    String newLEDStatus = firebaseData.stringData();
    if (newLEDStatus != controlState.statusLED) {
      controlState.statusLED = newLEDStatus;
      Serial.println("Status LED: " + controlState.statusLED);
    }
  }
  
  lastControlCheck = millis();
}

void updateDeviceStatus() {
  if (millis() - lastStatusUpdate < STATUS_INTERVAL) return;
  
  FirebaseJson json;
  json.set("status", WiFi.status() == WL_CONNECTED ? "online" : "offline");
  json.set("lastSeen", getTimestamp());
  json.set("wifiSignal", WiFi.RSSI());
  json.set("freeHeap", ESP.getFreeHeap());
  json.set("uptime", millis() / 1000);
  json.set("unitType", UNIT_TYPE);
  json.set("deviceModel", "ESP32-Indoor");
  
  String path = "/devices/" + String(DEVICE_ID) + "/meta";
  if (Firebase.updateNode(firebaseData, path.c_str(), json)) {
    Serial.println("Indoor status updated!");
    lastStatusUpdate = millis();
  }
}

void processAlarms() {
  // Temperature Alarm
  if (sensorData.temperature > 35.0 || sensorData.temperature < 15.0) {
    if (controlState.alarm) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(200);
      digitalWrite(BUZZER_PIN, LOW);
      delay(200);
    }
  }
  
  // Humidity Alarm
  if (sensorData.humidity > 80.0 || sensorData.humidity < 30.0) {
    if (controlState.alarm) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(100);
      digitalWrite(BUZZER_PIN, LOW);
      delay(100);
    }
  }
  
  // Air Quality Alarm
  if (sensorData.airQuality > 70) {
    if (controlState.alarm) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(300);
      digitalWrite(BUZZER_PIN, LOW);
      delay(300);
    }
  }
}

void updateIndicators() {
  // Update RGB LED based on status
  if (controlState.statusLED == "green") {
    digitalWrite(RGB_R_PIN, LOW);
    digitalWrite(RGB_G_PIN, HIGH);
    digitalWrite(RGB_B_PIN, LOW);
  } else if (controlState.statusLED == "red") {
    digitalWrite(RGB_R_PIN, HIGH);
    digitalWrite(RGB_G_PIN, LOW);
    digitalWrite(RGB_B_PIN, LOW);
  } else if (controlState.statusLED == "blue") {
    digitalWrite(RGB_R_PIN, LOW);
    digitalWrite(RGB_G_PIN, LOW);
    digitalWrite(RGB_B_PIN, HIGH);
  } else {
    digitalWrite(RGB_R_PIN, LOW);
    digitalWrite(RGB_G_PIN, LOW);
    digitalWrite(RGB_B_PIN, LOW);
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
