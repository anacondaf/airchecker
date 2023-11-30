# AIR CHECKER MONITORING AND PREDICTING APPLICATION

## Introduction

This is my graduation thesis project which covers the application from IoT, Web Development, Deployment and Data Mining knowledge. I've tried my best to complete and do what is best for the project. During conducting this project, I am not only have a general perception about air quality field but also have opportunies to hands-on coding and building the whole application from scratch. I feel very satisfied and proud of for what I have achieved and accomplished.


## Technologies

1. IoT micro-controllers and sensors:
    - Arduino Uno
    - ESP8266 Wifi Kit: WeMos D1 R1
    - Sensors for measuring air concentration: MQ135, MQ7, DHT11, Sharp GP2Y1010AU0F dust sensor, CCS811 CJMCU, MQ131

2. Backend technologies:
    - NodeJS and ExpressJS framework

3. Communication Protocol:
    - MQTT with MQTT Broker provided by EMQX
    - RESTFul API
    - Websocket using Socket.IO

4. Database:
    - MongoDB

5. UI:
    - HTML, CSS and vanilla JS
    - ChartJS. Library website: https://www.chartjs.org/
    - i18n for english and vietnamese translation. Library website: https://www.i18next.com/
    - PWA
    - PDFjs for viewing guide book. Library website: https://mozilla.github.io/pdf.js/
    - Shepherd for user app tour. Library website: https://shepherdjs.dev/

6. Deployment:
    - Server Provider: Vultr, Google Cloud Compute Engine
    - Docker
  
7. Prediction:
    - Python
    - Flask
    - LSTM model

## About docker compose port

- All internal services: backend, client is running on port with pattern 808[order]. While order is the order of each docker container and are freely to customize

- All support containers such as grafana, portainer or health check, etc. is following the pattern of 900[order]. Order has the same logic as internal services and is defined above ☝️

