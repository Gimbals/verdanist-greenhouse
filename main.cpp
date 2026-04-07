// ESP32 Firebase Test - Main File for Wokwi
// Copy this to main.cpp in your Wokwi project

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>

// WiFi Configuration (Wokwi built-in)
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

void setup() {
  Serial.begin(115200);
  Serial.println("=== ESP32 FIREBASE TEST ===");
  
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
  
  // Test connection
  if (Firebase.ready()) {
    Serial.println("Firebase connected!");
    
    // Test upload
    testFirebaseUpload();
  } else {
    Serial.println("Firebase connection failed!");
  }
}

void loop() {
  // Test upload every 10 seconds
  if (Firebase.ready()) {
    testFirebaseUpload();
  }
  delay(10000);
}

void testFirebaseUpload() {
  // Create simple JSON
  FirebaseJson json;
  json.set("test", "hello from esp32");
  json.set("timestamp", millis());
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/test";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Upload successful!");
    Serial.println("Path: " + path);
    Serial.println("Data: " + String("test=hello from esp32"));
  } else {
    Serial.println("Upload failed: " + firebaseData.errorReason());
  }
}
