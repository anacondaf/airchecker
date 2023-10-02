// #include "DHT.h"
// #include "MQ135.h"

// const int DHTPIN = 2;       //Đọc dữ liệu từ DHT11 ở chân 2 trên mạch Arduino
// const int DHTTYPE = DHT11;  //Khai báo loại cảm biến, có 2 loại là DHT11 và DHT22

// DHT dht(DHTPIN, DHTTYPE);

// #define PIN_MQ135 A2
// MQ135 mq135_sensor = MQ135(PIN_MQ135);

// void setup() {
//   Serial.begin(9600);
//   dht.begin();  // Khởi động cảm biến
// }

// void loop() {
//   float humidity = dht.readHumidity();        //Đọc độ ẩm
//   float temperature = dht.readTemperature();  //Đọc nhiệt độ

//   Serial.print("Nhiet do: ");
//   Serial.println(temperature);  //Xuất nhiệt độ
//   Serial.print("Do am: ");
//   Serial.println(humidity);  //Xuất độ ẩm
//   Serial.println();          //Xuống hàng

//   float ppm = mq135_sensor.getPPM();
//   float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
//   Serial.print("PPM: ");
//   Serial.print(ppm);

//   Serial.println();  //Xuống hàng

//   Serial.print("Corrected PPM: ");
//   Serial.print(correctedPPM);
//   Serial.println("ppm");
//   delay(120000); //2 min
// }