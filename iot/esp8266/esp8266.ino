#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <DNSServer.h>
#include "WiFiManager.h"
#include "ccs811.h"
#include <Wire.h>

const char *ssid = "ANHKIET";         // Enter SSID
const char *password = "family@123";  // Enter Password

#define mqtt_host "66.42.63.123"
#define mqtt_topic "/airchecker"
#define mqtt_topic_noti "/airchecker/noti"
#define mqtt_user "admin"
#define mqtt_pwd "Pa$$word!"
const uint16_t mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Wiring for ESP8266 NodeMCU boards: VDD to 3V3, GND to GND, SDA to D2, SCL to D1, nWAKE to D3 (or GND)
CCS811 ccs811(D3);  // nWAKE on D3

float co2 = 0;
float tvoc = 0;

void ccs811_init() {
  Serial.print("Setup: ccs811 lib version: ");
  Serial.println(CCS811_VERSION);

  // Enable CCS811
  ccs811.set_i2cdelay(50);  // Needed for ESP8266 because it doesn't handle I2C clock stretch correctly

  if (!ccs811.begin()) {
    Serial.println("Failed to start sensor! Please check your wiring.");
    while (1)
      ;
  }

  // Print CCS811 versions
  Serial.print("setup: hardware_version: ");
  Serial.println(ccs811.hardware_version(), HEX);
  Serial.print("setup: bootloader_version: ");
  Serial.println(ccs811.bootloader_version(), HEX);
  Serial.print("setup: application_version: ");
  Serial.println(ccs811.application_version(), HEX);

  // Start measuring
  while (!ccs811.start(CCS811_MODE_1SEC)) {
    Serial.println("setup: CCS811 start FAILED");
  }
}

void ccs811_read() {
  // Read
  uint16_t eco2, etvoc, errstat, raw;
  ccs811.read(&eco2, &etvoc, &errstat, &raw);

  if (errstat == CCS811_ERRSTAT_OK) {
    co2 = eco2;
    tvoc = etvoc;

    Serial.print("CO2: ");
    Serial.print(co2);
    Serial.println("ppm");

    Serial.print("TVOC: ");
    Serial.print(tvoc);
    Serial.println("ppb");

  } else {
    Serial.print("CCS811: errstat=");
    Serial.print(errstat, HEX);
    Serial.print("=");
    Serial.println(ccs811.errstat_str(errstat));
  }
}

void configModeCallback(WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void connectWifi() {
  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);

  if (!wifiManager.autoConnect()) {
    Serial.println("Failed to connect and hit timeout");
    ESP.reset();
    delay(1000);
  }
}

void connectMQTT() {
  client.setServer(mqtt_host, mqtt_port);
  client.setCallback(callback);
}

// Hàm call back để nhận dữ liệu
void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }

  Serial.println();
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect() {
  // Chờ tới khi kết nối
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Thực hiện kết nối với mqtt user và pass
    if (client.connect("ESP8266Client", mqtt_user, mqtt_pwd)) {
      Serial.println("connected");
      client.publish(mqtt_topic_noti, "ESP_reconnected");
      client.subscribe(mqtt_topic_noti);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}

void setup() {
  delay(1000);  // Wait for Arduino to initialize
  Serial.begin(9600);

  // Enable I2C
  Wire.begin();

  connectWifi();
  connectMQTT();

  ccs811_init();

  while (!Serial) {
    continue;
  }
}

void loop() {
  // Kiểm tra kết nối
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  if (Serial.available()) {
    DynamicJsonDocument doc(1024);

    // Deserialize the JSON document
    DeserializationError error = deserializeJson(doc, Serial);

    // Test if parsing succeeds.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    float humidity = doc["humidity"];
    Serial.print("Humidity = ");
    Serial.println(humidity);

    float temperature = doc["temp"];
    Serial.print("Temperature = ");
    Serial.println(temperature);

    float aqi = doc["aqi"];
    Serial.print("AQI = ");
    Serial.println(aqi);

    float co = doc["co"];
    Serial.print("CO = ");
    Serial.println(co);

    float o3 = doc["o3"];
    Serial.print("O3 = ");
    Serial.println(o3);

    float pm25 = doc["pm25"];
    Serial.print("PM25 = ");
    Serial.println(pm25);

    ccs811_read();

    doc["co2"] = co2;
    doc["tvoc"] = tvoc;

    char buffer[256];
    serializeJson(doc, buffer);
    bool result = client.publish(mqtt_topic, buffer);  // client.publish_P(topic, payload, payload_size, retain)

    if (result) {
      Serial.println("Publish message to MQTT broker success: ");
    } else {
      Serial.println("Failed to publish message to MQTT broker success: ");
    }

    Serial.println();  // Xuong dong
  }
}