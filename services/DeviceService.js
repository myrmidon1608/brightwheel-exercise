let DeviceRepository = require('../repository/DeviceRepository');

exports.getDeviceById = (req, res) => {
    DeviceRepository.get(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getAllDevices = (req, res) => {
    DeviceRepository.getAll().then((result) => {
        res.status(200).send(result);
    });
};

exports.setDevice = (req, res) => {
    let deviceId = req.body.id;
    let deviceReadings = req.body.readings;

    DeviceRepository.set(deviceId, deviceReadings).then((result) => {
        res.status(200).send(result);
    });
};