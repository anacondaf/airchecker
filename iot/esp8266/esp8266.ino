#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <DNSServer.h>
#include "WiFiManager.h"

const char *ssid = "ANHKIET";        // Enter SSID
const char *password = "family@123"; // Enter Password

#define mqtt_host "airchecker.online"
#define mqtt_topic "/airchecker"
#define mqtt_topic_noti "/airchecker/noti"
#define mqtt_user "admin"
#define mqtt_pwd "Pa$$word!"
const uint16_t mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void configModeCallback(WiFiManager *myWiFiManager)
{
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void connectWifi()
{
  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);

  if (!wifiManager.autoConnect())
  {
    Serial.println("Failed to connect and hit timeout");
    ESP.reset();
    delay(1000);
  }
}

void connectMQTT()
{
  client.setServer(mqtt_host, mqtt_port);
  client.setCallback(callback);
}

// Hàm call back để nhận dữ liệu
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }

  Serial.println();
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect()
{
  // Chờ tới khi kết nối
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");

    // Thực hiện kết nối với mqtt user và pass
    if (client.connect("ESP8266Client", mqtt_user, mqtt_pwd))
    {
      Serial.println("connected");
      client.publish(mqtt_topic_noti, "ESP_reconnected");
      client.subscribe(mqtt_topic_noti);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}

void setup()
{
  delay(1000); // Wait for Arduino to initialize
  Serial.begin(9600);

  connectWifi();
  connectMQTT();

  while (!Serial)
  {
    continue;
  }

  Serial.println();
}

void loop()
{
  // Kiểm tra kết nối
  if (!client.connected())
  {
    reconnect();
  }

  client.loop();

  if (Serial.available())
  {
    DynamicJsonDocument doc(1024);

    // Deserialize the JSON document
    DeserializationError error = deserializeJson(doc, Serial);

    // Test if parsing succeeds.
    if (error)
    {
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

    char buffer[256];
    serializeJson(doc, buffer);
    bool result = client.publish(mqtt_topic, buffer); // client.publish_P(topic, payload, payload_size, retain)

    if (result)
    {
      Serial.println("Publish message to MQTT broker success: ");
    }
    else
    {
      Serial.println("Failed to publish message to MQTT broker success: ");
    }

    Serial.println(); // Xuong dong
  }
}