#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include "MQ135.h"


// CAM BIEN DHT11
const int DHTPIN = 2;       //Đọc dữ liệu từ DHT11 ở chân 2 trên mạch Arduino
const int DHTTYPE = DHT11;  //Khai báo loại cảm biến, có 2 loại là DHT11 và DHT22

DHT dht(DHTPIN, DHTTYPE);

// CAM BIEN MQ135
#define PIN_MQ135 A0
MQ135 mq135_sensor = MQ135(PIN_MQ135);

// CAM BIEN MQ7
#define PIN_MQ7 A1
const int DPIN_MQ7 = 3;

SoftwareSerial espSerial(10, 11);  // RX, TX

void setup() {
  delay(1000);  // Wait for ESP8266 to initialize

  dht.begin();

  Serial.begin(115200);
  espSerial.begin(9600);

  pinMode(DPIN_MQ7, INPUT);
}

void loop() {

  // DO NHIET DO & DO AM
  float humidity = dht.readHumidity();        //Đọc độ ẩm
  float temperature = dht.readTemperature();  //Đọc nhiệt độ

  Serial.print("Nhiet do: ");
  Serial.println(temperature);  //Xuất nhiệt độ

  Serial.print("Do am: ");
  Serial.println(humidity);  //Xuất độ ẩm

  // DO PPM
  float ppm = mq135_sensor.getPPM();
  float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
  Serial.print("PPM: ");
  Serial.print(ppm);
  Serial.println("ppm");

  Serial.print("Corrected PPM: ");
  Serial.print(correctedPPM);
  Serial.println("ppm");

  // DO CO
  int d_co = digitalRead(DPIN_MQ7);

  if (d_co == LOW) {
    Serial.print("CO Digital: ");
    Serial.println(d_co);
  }

  float a_co = analogRead(PIN_MQ7);
  Serial.print("CO Analog: ");
  Serial.print(a_co);
  Serial.println(" ppm");

  Serial.println();  // Xuong dong

  // SERIAL JSON
  DynamicJsonDocument doc(1024);

  doc["humidity"] = humidity;
  doc["temp"] = temperature;
  doc["aqi"] = correctedPPM;
  doc["co"] = a_co;

  serializeJson(doc, espSerial);

  delay(300000);
}