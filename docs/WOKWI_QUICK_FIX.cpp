// ESP32 Firebase IoT Greenhouse - Wokwi Simulator
// Copy this code to Wokwi ESP32 project

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <time.h>

// WiFi Configuration (Wokwi has built-in WiFi)
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"

// Device Configuration
#define DEVICE_ID "indoor-01"

// Global variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Timing variables
unsigned long lastUpload = 0;
const unsigned long UPLOAD_INTERVAL = 10000; // 10 seconds

void setup() {
  Serial.begin(115200);
  Serial.println("=== WOKWI FIREBASE SIMULATOR ===");
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  
  // Setup Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  
  if (Firebase.ready()) {
    Serial.println("Firebase connected!");
  } else {
    Serial.println("Firebase connection failed!");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    uploadData();
  }
  delay(1000);
}

void uploadData() {
  if (millis() - lastUpload < UPLOAD_INTERVAL) return;
  
  // Simple sensor data
  FirebaseJson json;
  json.set("temperature", 25.0 + random(-5, 6));
  json.set("humidity", 65.0 + random(-10, 11));
  json.set("soilMoisture", 50 + random(-20, 21));
  json.set("lightLevel", 75 + random(-25, 26));
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Data uploaded successfully!");
    lastUpload = millis();
  } else {
    Serial.println("Upload failed: " + firebaseData.errorReason());
  }
}
