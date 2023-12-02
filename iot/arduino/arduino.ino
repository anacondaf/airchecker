#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include "MQ135.h"
#include "MQ131.h"
#include "Adafruit_CCS811.h"
#include "SharpGP2Y10.h"
#include <math.h>
#include "MQ7.h"

// CAM BIEN DHT11
const int DHTPIN = 2;       //Đọc dữ liệu từ DHT11 ở chân 2 trên mạch Arduino
const int DHTTYPE = DHT11;  //Khai báo loại cảm biến, có 2 loại là DHT11 và DHT22

DHT dht(DHTPIN, DHTTYPE);

// CAM BIEN MQ135
#define PIN_MQ135 A0

#define RLOAD 1.0
#define RZERO 76.63
MQ135 mq135_sensor = MQ135(PIN_MQ135, RZERO, RLOAD);

// CAM BIEN OZONE MQ131
#define PIN_MQ131 A2

// CAM BIEN MQ7
#define PIN_MQ7 A1
#define VOLTAGE 5

// init MQ7 device
MQ7 mq7(PIN_MQ7);

// ESP Serial
SoftwareSerial espSerial(10, 11);  // RX, TX

// Optical Dust Sensor (Sharp GP2Y10)
int voPin = A5;
int dustSensorLedPin = 13;

int samplingTime = 280;
int deltaTime = 40;
int sleepTime = 9680;
float voMeasured = 0;
float voltage = 0;

float pm25 = 0;

// SharpGP2Y10 dustSensor(voPin, ledPin);
void measureOpticalDustSensor() {
  digitalWrite(dustSensorLedPin,LOW); // Bật IR LED

  delayMicroseconds(samplingTime); //Delay 0.28ms

  voMeasured = analogRead(voPin); // Đọc giá trị ADC V0

  delayMicroseconds(deltaTime); //Delay 0.04ms

  digitalWrite(dustSensorLedPin,HIGH); // Tắt LED

  delayMicroseconds(sleepTime); //Delay 9.68ms

  // Tính điện áp từ giá trị ADC Vo
  voltage = voMeasured * (5.0 / 1024.0);
  Serial.print("PM2.5 voltage: ");
  Serial.println(voltage);

  pm25 = 170 * voltage - 0.1; // unit: ug/m3

  Serial.print("PM2.5: ");
  Serial.print(pm25);
  Serial.println(" ug/m3");
}

void warmUpSensor() {
  Serial.println(".....Warm up.....");
  
  digitalWrite(6, HIGH);  // Ozone sensor
  delay(1 * 30 * 1000);   // 1 min for warm heater
  digitalWrite(6, LOW);
}

void MQ131Calibrate() {
  Serial.println("Calibration in progress...");

  MQ131.calibrate();

  Serial.println("Calibration done!");
  Serial.print("R0 = ");
  Serial.print(MQ131.getR0());
  Serial.println(" Ohms");
  Serial.print("Time to heat = ");
  Serial.print(MQ131.getTimeToRead());
  Serial.println(" s");
}

void setupMQ131() {
  MQ131.begin(6, PIN_MQ131, LOW_CONCENTRATION, 1000000, (Stream *)&Serial);
  MQ131.setTimeToRead(1);
  MQ131.setR0(7000000);

  // MQ131Calibrate();
}

void calibrateMQ7() {
  Serial.println("Calibrating MQ7");
	mq7.calibrate();		// calculates R0
	Serial.println("Calibration done!");
}

void setup() {
  Serial.begin(115200);
  espSerial.begin(9600);

  // dust sensor
  pinMode(dustSensorLedPin, OUTPUT);

  pinMode(6, OUTPUT);
  dht.begin();

  warmUpSensor();

  // run setup code for sensors
  setupMQ131();

  // calibrate MQ7
  calibrateMQ7();
}

void loop() {
  // ĐO NHIET DO & DO AM
  float humidity = dht.readHumidity();        //Đọc độ ẩm
  float temperature = dht.readTemperature();  //Đọc nhiệt độ

  Serial.print("Nhiet do: ");
  Serial.println(temperature);  //Xuất nhiệt độ

  Serial.print("Do am: ");
  Serial.println(humidity);  //Xuất độ ẩm

  // ĐO CO
  float co = mq7.readPpm();
  Serial.print("CO: ");
  Serial.print(co);
  Serial.println(" ppm");

  // ĐO O3
  MQ131.setEnv(temperature, humidity);
  MQ131.sample();
  float o3 = MQ131.getO3(PPB);
  Serial.print("O3: ");
  Serial.print(o3);
  Serial.println(" ppm");

  // Đo PM2.5
  measureOpticalDustSensor();

  Serial.println("=============================");  // Xuong dong

  // SERIAL JSON
  DynamicJsonDocument doc(1024);

  doc["humidity"] = humidity;
  doc["temp"] = temperature;
  doc["co"] = co;
  doc["o3"] = o3;
  doc["pm25"] = round(pm25 * 10.0) / 10.0; // round to 2 decimal places

  serializeJson(doc, espSerial);

  Serial.println("Send serial json data to esp8266");

  delay(3600000);
}