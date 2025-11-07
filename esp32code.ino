#include <WiFi.h>
#include <WebSocketsClient.h>
#include <TinyGPSPlus.h>

// =========================
// WiFi Config
// =========================
const char* ssid = "ssid";
const char* password = "password";

// =========================
// WebSocket Config
// =========================
const char* ws_host = "bot-controll.onrender.com";
const uint16_t ws_port = 443;
const char* ws_path = "/ws";

WebSocketsClient webSocket;

// =========================
// Motor Pins
// =========================
#define IN1 14
#define IN2 12
#define IN3 27
#define IN4 26
#define ENA 25
#define ENB 33

// =========================
// GPS Config (Neo-6M)
// =========================
HardwareSerial gpsSerial(2); // UART2 -> GPIO16 (RX), GPIO17 (TX)
TinyGPSPlus gps;
unsigned long lastGPSSend = 0; // To control update interval

// =========================
// Motor Functions
// =========================
void setupMotors() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  analogWrite(ENA, 255);
  analogWrite(ENB, 255);
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnLeft() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

// =========================
// WebSocket Event Handler
// =========================
void onWebSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println(" Connected to WebSocket server");
    webSocket.sendTXT("{\"type\":\"register\",\"role\":\"car\"}");
  } 
  else if (type == WStype_TEXT) {
    Serial.printf(" Received: %s\n", payload);
    String msg = String((char*)payload);

    if (msg.indexOf("\"type\":\"command\"") != -1) {
      if (msg.indexOf("\"action\":\"forward\"") != -1) {
        moveForward();
        webSocket.sendTXT("{\"type\":\"status\",\"state\":\"moving forward\"}");
      } else if (msg.indexOf("\"action\":\"backward\"") != -1) {
        moveBackward();
        webSocket.sendTXT("{\"type\":\"status\",\"state\":\"moving backward\"}");
      } else if (msg.indexOf("\"action\":\"left\"") != -1) {
        turnLeft();
        webSocket.sendTXT("{\"type\":\"status\",\"state\":\"turning left\"}");
      } else if (msg.indexOf("\"action\":\"right\"") != -1) {
        turnRight();
        webSocket.sendTXT("{\"type\":\"status\",\"state\":\"turning right\"}");
      } else if (msg.indexOf("\"action\":\"stop\"") != -1) {
        stopMotors();
        webSocket.sendTXT("{\"type\":\"status\",\"state\":\"stopped\"}");
      }
    }
  } 
  else if (type == WStype_DISCONNECTED) {
    Serial.println("⚠️ WebSocket disconnected");
  }
}

// =========================
// GPS Reading and Sending
// =========================
void readGPS() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated() && millis() - lastGPSSend > 5000) { // every 5 sec
    double lat = gps.location.lat();
    double lng = gps.location.lng();
    double alt = gps.altitude.meters();

    char gpsMsg[128];
    snprintf(gpsMsg, sizeof(gpsMsg),
      "{\"type\":\"gps\",\"lat\":%.6f,\"lng\":%.6f,\"alt\":%.2f}", lat, lng, alt);

    webSocket.sendTXT(gpsMsg);
    Serial.printf("📡 Sent GPS: Lat: %.6f, Lng: %.6f, Alt: %.2f\n", lat, lng, alt);

    lastGPSSend = millis();
  }
}

// =========================
// Setup
// =========================
void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17); // RX, TX

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n WiFi connected!");

  setupMotors();
  stopMotors();

  // Connect to WebSocket server
  webSocket.beginSSL(ws_host, ws_port, ws_path);
  webSocket.onEvent(onWebSocketEvent);
  webSocket.setReconnectInterval(5000);
}

// =========================
// Main Loop
// =========================
void loop() {
  webSocket.loop();
  readGPS();
}
