// ESP32 Firebase Greenhouse Controller
// Optimized for free tier usage

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <ArduinoJson.h>

// WiFi Configuration
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_AUTH_TOKEN"

// Device Configuration
#define DEVICE_ID "indoor-01"
#define SECRET_TOKEN "esp32-secret-token-123"

// Pin Configuration
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define FAN_RELAY 26
#define PUMP_RELAY 27
#define LED_RELAY 25
#define SOIL_SENSOR 34
#define LIGHT_SENSOR 35

// Global variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
DHT dht(DHT_PIN, DHT_TYPE);

// Timing variables
unsigned long lastSensorUpload = 0;
unsigned long lastControlCheck = 0;
unsigned long lastStatusUpdate = 0;

const unsigned long SENSOR_INTERVAL = 120000;  // 2 menit
const unsigned long CONTROL_CHECK_INTERVAL = 60000;  // 1 menit
const unsigned long STATUS_INTERVAL = 300000;  // 5 menit

bool deviceAuthenticated = false;

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(FAN_RELAY, OUTPUT);
  pinMode(PUMP_RELAY, OUTPUT);
  pinMode(LED_RELAY, OUTPUT);
  
  // Initialize sensors
  dht.begin();
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup Firebase
  setupFirebase();
  
  // Authenticate device
  authenticateDevice();
  
  // Setup control listener
  setupControlListener();
  
  Serial.println("System ready!");
}

void loop() {
  if (!deviceAuthenticated) {
    Serial.println("Device not authenticated!");
    delay(5000);
    return;
  }
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }
  
  // Upload sensor data
  uploadSensorData();
  
  // Check controls (fallback)
  checkControlsFallback();
  
  // Update status
  updateDeviceStatus();
  
  // Handle Firebase stream
  Firebase.handleStream(firebaseData);
  
  delay(1000);
}

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
}

void setupFirebase() {
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void authenticateDevice() {
  if (Firebase.getString(firebaseData, "/authorizedDevices/" + String(DEVICE_ID))) {
    if (firebaseData.stringData() == SECRET_TOKEN) {
      deviceAuthenticated = true;
      Serial.println("Device authenticated successfully!");
    } else {
      Serial.println("Invalid device token!");
    }
  } else {
    Serial.println("Authentication failed!");
  }
}

void setupControlListener() {
  Firebase.setStreamCallback(firebaseData, streamCallback, streamTimeoutCallback);
  
  if (Firebase.beginStream(firebaseData, "/devices/" + String(DEVICE_ID) + "/controls")) {
    Serial.println("Control listener started!");
  } else {
    Serial.println("Failed to start control listener");
  }
}

void streamCallback(StreamData data) {
  String path = data.path();
  String value = data.stringData();
  
  Serial.println("Control changed: " + path + " = " + value);
  
  if (path.indexOf("fan") >= 0) {
    digitalWrite(FAN_RELAY, value == "on" ? HIGH : LOW);
  } else if (path.indexOf("pump") >= 0) {
    digitalWrite(PUMP_RELAY, value == "on" ? HIGH : LOW);
  } else if (path.indexOf("led") >= 0) {
    digitalWrite(LED_RELAY, value == "on" ? HIGH : LOW);
  }
}

void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Stream timeout, will retry...");
  }
}

void uploadSensorData() {
  if (millis() - lastSensorUpload < SENSOR_INTERVAL) {
    return;
  }
  
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soilMoisture = map(analogRead(SOIL_SENSOR), 0, 4095, 0, 100);
  int lightLevel = map(analogRead(LIGHT_SENSOR), 0, 4095, 0, 100);
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read DHT sensor!");
    return;
  }
  
  FirebaseJson json;
  json.set("temperature", round(temperature * 10) / 10.0);  // Round to 1 decimal
  json.set("humidity", round(humidity * 10) / 10.0);
  json.set("soilMoisture", soilMoisture);
  json.set("lightLevel", lightLevel);
  json.set("lastUpdate", getTimestamp());
  
  if (Firebase.setJSON(firebaseData, "/devices/" + String(DEVICE_ID) + "/sensors", json)) {
    Serial.println("Sensor data uploaded successfully!");
    lastSensorUpload = millis();
  } else {
    Serial.println("Failed to upload sensor data: " + firebaseData.errorReason());
  }
}

void checkControlsFallback() {
  if (millis() - lastControlCheck < CONTROL_CHECK_INTERVAL) {
    return;
  }
  
  // Check fan control
  if (Firebase.getString(firebaseData, "/devices/" + String(DEVICE_ID) + "/controls/fan")) {
    String fanState = firebaseData.stringData();
    digitalWrite(FAN_RELAY, fanState == "on" ? HIGH : LOW);
  }
  
  // Check pump control
  if (Firebase.getString(firebaseData, "/devices/" + String(DEVICE_ID) + "/controls/pump")) {
    String pumpState = firebaseData.stringData();
    digitalWrite(PUMP_RELAY, pumpState == "on" ? HIGH : LOW);
  }
  
  // Check LED control
  if (Firebase.getString(firebaseData, "/devices/" + String(DEVICE_ID) + "/controls/led")) {
    String ledState = firebaseData.stringData();
    digitalWrite(LED_RELAY, ledState == "on" ? HIGH : LOW);
  }
  
  lastControlCheck = millis();
}

void updateDeviceStatus() {
  if (millis() - lastStatusUpdate < STATUS_INTERVAL) {
    return;
  }
  
  FirebaseJson json;
  json.set("status", WiFi.status() == WL_CONNECTED ? "online" : "offline");
  json.set("lastSeen", getTimestamp());
  
  if (Firebase.updateNode(firebaseData, "/devices/" + String(DEVICE_ID) + "/meta", json)) {
    Serial.println("Device status updated!");
    lastStatusUpdate = millis();
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
