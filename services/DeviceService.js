let DeviceRepository = require('../repository/DeviceRepository');

exports.getDeviceById = (req, res) => {
    if (!validId(req.params.deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    DeviceRepository.get(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getDeviceCountById = (req, res) => {
    if (!validId(req.params.deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    DeviceRepository.getCount(req.params.deviceId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getDeviceLatestById = (req, res) => {
    if (!validId(req.params.deviceId)) {
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
    if (!validId(deviceId)) {
        return res.status(400).send({ error: "Invalid id" });
    }
    let deviceReadings = req.body.readings;
    // TODO: check for malformed readings

    if (!await DeviceRepository.validateRequest(req.body)) {
        return res.status(400).send({ error: "Duplicate request" });
    }

    DeviceRepository.set(deviceId, deviceReadings).then((result) => {
        res.status(200).send(result);
    });
};

const isHEX = (ch) => "0123456789abcdef".includes(ch.toLowerCase());
function validId(guid) {
    if (!guid) {
        return false;
    }
    guid = guid.replaceAll("-", "");
    return guid.length === 32 && [...guid].every(isHEX);
}