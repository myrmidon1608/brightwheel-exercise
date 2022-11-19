let DeviceRepository = require('../repository/DeviceRepository');
let DeviceValidationService = require('./DeviceValidationService');

exports.getDeviceById = (req, res) => {
    if (!DeviceValidationService.validId(req.params.deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    DeviceRepository.get(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getDeviceCountById = (req, res) => {
    if (!DeviceValidationService.validId(req.params.deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    DeviceRepository.getCount(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getDeviceLatestById = (req, res) => {
    if (!DeviceValidationService.validId(req.params.deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    DeviceRepository.getLatest(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getAllDevices = (req, res) => {
    DeviceRepository.getAll().then((result) => {
        res.status(200).send(result);
    });
};

exports.setDevice = async (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "Invalid request" });
    }

    let deviceId = req.body.id;
    if (!DeviceValidationService.validId(deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    
    let deviceReadings = req.body.readings;
    if (!DeviceValidationService.validReadings(deviceReadings)) {
        return res.status(400).send({ error: "Invalid readings" });
    }

    if (!await DeviceValidationService.validRequest(req.body)) {
        return res.status(400).send({ error: "Duplicate request" });
    }

    DeviceRepository.set(deviceId, deviceReadings).then((result) => {
        res.status(200).send(result);
    });
};