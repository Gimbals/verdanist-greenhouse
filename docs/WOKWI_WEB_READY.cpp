// ESP32 Greenhouse Simulator - Web Wokwi Ready
// Copy this to web Wokwi ESP32 project

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>

// WiFi Configuration
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Configuration
#define FIREBASE_HOST "verdanist-greenhouse-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "vhX4nUnNjhMbBAaCmEp8uewh438uuZi5034HShUr"

// Device Configuration
#define DEVICE_ID "indoor-01"

// Pin Configuration
#define DHT_PIN 4
#define LED_R_PIN 25
#define LED_G_PIN 26
#define LED_B_PIN 27
#define PUMP_PIN 32
#define FAN_PIN 33

// Global variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  Serial.println("=== GREENHOUSE SIMULATOR ===");
  
  // Initialize pins
  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  
  // Start with all OFF
  digitalWrite(LED_R_PIN, LOW);
  digitalWrite(LED_G_PIN, LOW);
  digitalWrite(LED_B_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
  
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
    Serial.println("Greenhouse simulator ready!");
    
    // Upload initial data
    uploadSensorData();
  } else {
    Serial.println("Firebase connection failed!");
  }
}

void loop() {
  if (Firebase.ready()) {
    // Upload sensor data
    uploadSensorData();
    
    // Check controls
    checkControls();
  }
  
  delay(10000); // Update every 10 seconds
}

void uploadSensorData() {
  // Simulate sensor data
  float temperature = 25.0 + random(-5, 6);
  float humidity = 65.0 + random(-10, 11);
  int soilMoisture = 50 + random(-20, 21);
  int lightLevel = 75 + random(-25, 26);
  
  // Create JSON
  FirebaseJson json;
  json.set("temperature", temperature);
  json.set("humidity", humidity);
  json.set("soilMoisture", soilMoisture);
  json.set("lightLevel", lightLevel);
  
  // Upload to Firebase
  String path = "/devices/" + String(DEVICE_ID) + "/sensors";
  if (Firebase.setJSON(firebaseData, path.c_str(), json)) {
    Serial.println("Sensor data uploaded!");
    Serial.print("T="); Serial.print(temperature); Serial.print("°C");
    Serial.print(", H="); Serial.print(humidity); Serial.print("%");
    Serial.print(", S="); Serial.print(soilMoisture); Serial.print("%");
    Serial.print(", L="); Serial.print(lightLevel); Serial.println("%");
  } else {
    Serial.println("Upload failed: " + firebaseData.errorReason());
  }
}

void checkControls() {
  String basePath = "/devices/" + String(DEVICE_ID) + "/controls";
  
  // Check pump control
  if (Firebase.getString(firebaseData, (basePath + "/pump").c_str())) {
    bool pumpState = (firebaseData.stringData() == "on");
    digitalWrite(PUMP_PIN, pumpState ? HIGH : LOW);
    Serial.println("PUMP: " + String(pumpState ? "ON" : "OFF"));
  }
  
  // Check fan control
  if (Firebase.getString(firebaseData, (basePath + "/fan").c_str())) {
    bool fanState = (firebaseData.stringData() == "on");
    digitalWrite(FAN_PIN, fanState ? HIGH : LOW);
    Serial.println("FAN: " + String(fanState ? "ON" : "OFF"));
  }
  
  // Check LED control
  if (Firebase.getString(firebaseData, (basePath + "/led").c_str())) {
    String ledState = firebaseData.stringData();
    if (ledState == "on") {
      digitalWrite(LED_R_PIN, HIGH);
      digitalWrite(LED_G_PIN, LOW);
      digitalWrite(LED_B_PIN, LOW);
      Serial.println("LED: ON (Red)");
    } else {
      digitalWrite(LED_R_PIN, LOW);
      digitalWrite(LED_G_PIN, LOW);
      digitalWrite(LED_B_PIN, LOW);
      Serial.println("LED: OFF");
    }
  }
}
