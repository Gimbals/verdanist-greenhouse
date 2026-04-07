// ESP32 Greenhouse - Outdoor Unit
// Sensor Tanah: Soil Moisture, Rain, Water Level, Irrigation

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <time.h>
#include <Servo.h>
#include <Adafruit_NeoPixel.h>

// WiFi Configuration
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "vhX4nUnNjhMbBAaCmEp8uewh438uuZi5034HShUr"

// Device Configuration
#define DEVICE_ID "outdoor-01"
#define UNIT_TYPE "outdoor"

// Pin Configuration
#define SOIL_MOISTURE_PIN 34
#define RAIN_DIGITAL_PIN 35
#define RAIN_ANALOG_PIN 36
#define ULTRASONIC_TRIG_PIN 25
#define ULTRASONIC_ECHO_PIN 26
#define PUMP_RELAY_PIN 27
#define SERVO_PIN 32
#define LED_PIN 33
#define LED_COUNT 8

// Global Variables
WiFiClientSecure client;
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
Servo valveServo;
Adafruit_NeoPixel ledStrip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Timing Variables
unsigned long lastSensorUpload = 0;
unsigned long lastControlCheck = 0;
unsigned long lastStatusUpdate = 0;

const unsigned long SENSOR_INTERVAL = 15000;      // 15 seconds
const unsigned long CONTROL_INTERVAL = 5000;      // 5 seconds
const unsigned long STATUS_INTERVAL = 60000;      // 1 minute

// Sensor Data Structure
struct OutdoorSensorData {
  int soilMoisture;
  int rainLevel;
  bool isRaining;
  int waterLevel;
  float waterDistance;
  int tankPercentage;
  String irrigationStatus;
} sensorData;

// Control State
struct ControlState {
  bool waterPump;
  int valvePosition;
  String ledStatus;
  bool autoMode;
} controlState;

void setup() {
  Serial.begin(115200);
  Serial.println("=== GREENHOUSE OUTDOOR UNIT ===");
  
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
  
  Serial.println("Outdoor unit ready!");
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
    
    // Process Auto Irrigation
    processAutoIrrigation();
    
    // Update Visual Indicators
    updateIndicators();
  }
  
  delay(1000);
}

void initializePins() {
  // Soil Moisture Sensor
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  
  // Rain Sensor
  pinMode(RAIN_DIGITAL_PIN, INPUT);
  pinMode(RAIN_ANALOG_PIN, INPUT);
  
  // Ultrasonic Sensor
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  
  // Pump Relay
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  
  // Servo
  valveServo.attach(SERVO_PIN);
  
  // LED Strip
  ledStrip.begin();
  ledStrip.show();
  
  // Initial States
  digitalWrite(PUMP_RELAY_PIN, LOW);
  valveServo.write(0); // Valve closed
  
  Serial.println("Pins initialized");
}

void initializeSensors() {
  // Warm up sensors
  delay(2000);
  
  // Initialize LED strip
  ledStrip.setBrightness(50);
  
  Serial.println("Sensors initialized");
}

void initializeControls() {
  controlState.waterPump = false;
  controlState.valvePosition = 0;
  controlState.ledStatus = "green";
  controlState.autoMode = true;
  
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
  // Read Soil Moisture
  int soilRaw = analogRead(SOIL_MOISTURE_PIN);
  sensorData.soilMoisture = map(soilRaw, 0, 4095, 100, 0); // Invert: 0 = dry, 100 = wet
  
  // Read Rain Sensor
  int rainAnalog = analogRead(RAIN_ANALOG_PIN);
  sensorData.rainLevel = map(rainAnalog, 0, 4095, 100, 0); // Invert: 0 = no rain, 100 = heavy rain
  sensorData.isRaining = (digitalRead(RAIN_DIGITAL_PIN) == LOW); // Rain detected when LOW
  
  // Read Water Level with Ultrasonic
  sensorData.waterDistance = readUltrasonicDistance();
  sensorData.waterLevel = map(sensorData.waterDistance, 5, 30, 100, 0); // Convert to percentage
  sensorData.tankPercentage = sensorData.waterLevel;
  
  // Determine Irrigation Status
  if (sensorData.soilMoisture < 30) {
    sensorData.irrigationStatus = "Needed";
  } else if (sensorData.soilMoisture < 60) {
    sensorData.irrigationStatus = "Moderate";
  } else {
    sensorData.irrigationStatus = "Good";
  }
  
  Serial.println("Sensors read successfully");
}

float readUltrasonicDistance() {
  // Send pulse
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  
  // Read echo
  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2; // Convert to cm
  
  return distance;
}

void uploadSensorData() {
  if (millis() - lastSensorUpload < SENSOR_INTERVAL) return;
  
  // Create JSON Data
  FirebaseJson json;
  json.set("soilMoisture", sensorData.soilMoisture);
  json.set("rainLevel", sensorData.rainLevel);
  json.set("isRaining", sensorData.isRaining);
  json.set("waterLevel", sensorData.waterLevel);
  json.set("waterDistance", sensorData.waterDistance);
  json.set("tankPercentage", sensorData.tankPercentage);
  json.set("irrigationStatus", sensorData.irrigationStatus);
  json.set("timestamp", getTimestamp());
  json.set("unitType", UNIT_TYPE);
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Outdoor sensor data uploaded!");
    lastSensorUpload = millis();
  } else {
    Serial.println("Upload failed: " + firebaseData.errorReason());
  }
}

void checkControls() {
  if (millis() - lastControlCheck < CONTROL_INTERVAL) return;
  
  String basePath = "/devices/" + String(DEVICE_ID) + "/controls";
  
  // Check Water Pump Control
  if (Firebase.getString(firebaseData, (basePath + "/waterPump").c_str())) {
    bool newPumpState = (firebaseData.stringData() == "on");
    if (newPumpState != controlState.waterPump) {
      controlState.waterPump = newPumpState;
      digitalWrite(PUMP_RELAY_PIN, controlState.waterPump ? HIGH : LOW);
      Serial.println("Water Pump: " + String(controlState.waterPump ? "ON" : "OFF"));
    }
  }
  
  // Check Valve Position Control
  if (Firebase.getString(firebaseData, (basePath + "/valvePosition").c_str())) {
    int newPosition = firebaseData.stringData().toInt();
    if (newPosition != controlState.valvePosition) {
      controlState.valvePosition = newPosition;
      valveServo.write(controlState.valvePosition);
      Serial.println("Valve Position: " + String(controlState.valvePosition));
    }
  }
  
  // Check LED Status
  if (Firebase.getString(firebaseData, (basePath + "/ledStatus").c_str())) {
    String newLEDStatus = firebaseData.stringData();
    if (newLEDStatus != controlState.ledStatus) {
      controlState.ledStatus = newLEDStatus;
      Serial.println("LED Status: " + controlState.ledStatus);
    }
  }
  
  // Check Auto Mode
  if (Firebase.getString(firebaseData, (basePath + "/autoMode").c_str())) {
    bool newAutoMode = (firebaseData.stringData() == "on");
    if (newAutoMode != controlState.autoMode) {
      controlState.autoMode = newAutoMode;
      Serial.println("Auto Mode: " + String(controlState.autoMode ? "ON" : "OFF"));
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
  json.set("deviceModel", "ESP32-Outdoor");
  
  String path = "/devices/" + String(DEVICE_ID) + "/meta";
  if (Firebase.updateNode(firebaseData, path.c_str(), json)) {
    Serial.println("Outdoor status updated!");
    lastStatusUpdate = millis();
  }
}

void processAutoIrrigation() {
  if (!controlState.autoMode) return;
  
  // Auto irrigation based on soil moisture
  if (sensorData.soilMoisture < 30 && sensorData.waterLevel > 20) {
    // Turn on pump
    if (!controlState.waterPump) {
      controlState.waterPump = true;
      digitalWrite(PUMP_RELAY_PIN, HIGH);
      
      // Open valve
      controlState.valvePosition = 90; // Open valve
      valveServo.write(controlState.valvePosition);
      
      Serial.println("Auto irrigation started!");
      
      // Upload control state
      uploadControlState();
    }
  } else if (sensorData.soilMoisture > 70 || sensorData.waterLevel < 10) {
    // Turn off pump
    if (controlState.waterPump) {
      controlState.waterPump = false;
      digitalWrite(PUMP_RELAY_PIN, LOW);
      
      // Close valve
      controlState.valvePosition = 0; // Close valve
      valveServo.write(controlState.valvePosition);
      
      Serial.println("Auto irrigation stopped!");
      
      // Upload control state
      uploadControlState();
    }
  }
}

void uploadControlState() {
  FirebaseJson json;
  json.set("waterPump", controlState.waterPump ? "on" : "off");
  json.set("valvePosition", String(controlState.valvePosition));
  json.set("ledStatus", controlState.ledStatus);
  json.set("autoMode", controlState.autoMode ? "on" : "off");
  
  String path = "/devices/" + String(DEVICE_ID) + "/controls";
  Firebase.updateNode(firebaseData, path.c_str(), json);
}

void updateIndicators() {
  // Update LED strip based on status
  if (controlState.ledStatus == "green") {
    // All LEDs green
    for (int i = 0; i < LED_COUNT; i++) {
      ledStrip.setPixelColor(i, ledStrip.Color(0, 255, 0));
    }
  } else if (controlState.ledStatus == "red") {
    // All LEDs red
    for (int i = 0; i < LED_COUNT; i++) {
      ledStrip.setPixelColor(i, ledStrip.Color(255, 0, 0));
    }
  } else if (controlState.ledStatus == "blue") {
    // All LEDs blue
    for (int i = 0; i < LED_COUNT; i++) {
      ledStrip.setPixelColor(i, ledStrip.Color(0, 0, 255));
    }
  } else if (controlState.ledStatus == "rainbow") {
    // Rainbow effect
    for (int i = 0; i < LED_COUNT; i++) {
      int hue = (millis() / 10 + i * 30) % 360;
      ledStrip.setPixelColor(i, ledStrip.ColorHSV(hue, 255, 128));
    }
  } else {
    // Turn off all LEDs
    for (int i = 0; i < LED_COUNT; i++) {
      ledStrip.setPixelColor(i, ledStrip.Color(0, 0, 0));
    }
  }
  
  ledStrip.show();
}

String getTimestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);
  
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}
