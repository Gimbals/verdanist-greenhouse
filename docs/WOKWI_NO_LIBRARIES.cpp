// ESP32 Firebase Simulator - No External Libraries
// For Wokwi when library installation fails

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>

// WiFi Configuration
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"
#define FIREBASE_URL "https://verdanist-greenhouse-default-rtdb.firebaseio.com"

// Device Configuration
#define DEVICE_ID "indoor-01"

// Global variables
WiFiClientSecure client;
HTTPClient http;
String lastData = "";

// Timing variables
unsigned long lastUpload = 0;
const unsigned long UPLOAD_INTERVAL = 10000; // 10 seconds

void setup() {
  Serial.begin(115200);
  Serial.println("=== WOKWI FIREBASE SIMULATOR (NO LIBRARIES) ===");
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println("IP: " + WiFi.localIP().toString());
  
  // Test Firebase connection
  testFirebaseConnection();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    uploadData();
  }
  delay(1000);
}

void testFirebaseConnection() {
  String url = FIREBASE_URL + "/devices/" + DEVICE_ID + "/controls.json?auth=" + FIREBASE_AUTH;
  
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.GET();
  
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    Serial.println("Firebase connection successful!");
    Serial.println("Controls: " + payload);
  } else {
    Serial.println("Firebase connection failed!");
    Serial.println("HTTP Code: " + String(httpCode));
  }
  
  http.end();
}

void uploadData() {
  if (millis() - lastUpload < UPLOAD_INTERVAL) return;
  
  // Create JSON data manually
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(25.0 + random(-5, 6)) + ",";
  jsonData += "\"humidity\":" + String(65.0 + random(-10, 11)) + ",";
  jsonData += "\"soilMoisture\":" + String(50 + random(-20, 21)) + ",";
  jsonData += "\"lightLevel\":" + String(75 + random(-25, 26));
  jsonData += "}";
  
  // Upload to Firebase
  String url = FIREBASE_URL + "/devices/" + DEVICE_ID + "/sensors.json?auth=" + FIREBASE_AUTH;
  
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.PUT(jsonData);
  
  if (httpCode == HTTP_CODE_OK) {
    Serial.println("Data uploaded successfully!");
    Serial.println("Data: " + jsonData);
    lastUpload = millis();
  } else {
    Serial.println("Upload failed!");
    Serial.println("HTTP Code: " + String(httpCode));
    Serial.println("Error: " + http.errorToString(httpCode));
  }
  
  http.end();
}

void checkControls() {
  String url = FIREBASE_URL + "/devices/" + DEVICE_ID + "/controls.json?auth=" + FIREBASE_AUTH;
  
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.GET();
  
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    
    if (payload != lastData) {
      Serial.println("Controls changed: " + payload);
      lastData = payload;
      
      // Parse simple JSON (manual parsing)
      if (payload.indexOf("\"pump\":\"on\"") >= 0) {
        Serial.println("PUMP: ON");
      } else {
        Serial.println("PUMP: OFF");
      }
      
      if (payload.indexOf("\"fan\":\"on\"") >= 0) {
        Serial.println("FAN: ON");
      } else {
        Serial.println("FAN: OFF");
      }
    }
  }
  
  http.end();
}
