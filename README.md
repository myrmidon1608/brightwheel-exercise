# Brightwheel

### Dependencies

- cd brightwheel-exercise
- npm -v
- node -v
- npm install

### Run server

http://localhost:3000/api/

> node app.js

### Run tests

> npm test

### Endpoints

GET /api/devices

Lists reading information for all devices

GET /api/devices/:deviceId

Gets reading information for specified device

POST /api/devices

Update reading information for specified device

GET /api/devices/:deviceId/count

Gets cumulative count for specified device

GET /api/devices/:deviceId/latest

Gets latest reading for specified device