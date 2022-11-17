let express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    routes = require('./routes');
api = require('./routes/api');
port = process.env.PORT || 3000;

// imports
let DeviceService = require('./services/DeviceService');

app.use(bodyParser.json());

// Page Routes
app.get('/', routes.index);

// API Routes
app.get('/api/devices', [
    DeviceService.getAllDevices
]);

app.post('/api/devices', [
    DeviceService.setDevice
]);

app.get('/api/devices/:deviceId', [
    DeviceService.getDeviceById
]);

app.get('/api/devices/:deviceId/count', [
    DeviceService.getDeviceCountById
]);

app.get('/api/devices/:deviceId/latest', [
    DeviceService.getDeviceLatestById
]);

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app;