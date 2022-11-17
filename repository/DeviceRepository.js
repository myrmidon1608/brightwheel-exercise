/**
 * MODEL
 * 
 * Device
    {
        id: UUID,
        count: number,
        latestReading: Reading
        readings: Reading[]
    }
 * 
 * Reading
    {
        "timestamp": DateTime,
        "count": number
    }
 */

const cs = require('checksum');
const db = require('node-persist');
const devices = db.create({dir: 'devices'});
devices.init();
const checksum = db.create({dir: 'checksum'});
checksum.init();

exports.get = (deviceId) => {
    return new Promise(async (resolve, reject) => {
        let device = await devices.get(deviceId);
        resolve(device);
    });
};

exports.getCount = (deviceId) => {
    return new Promise(async (resolve, reject) => {
        let device = await devices.get(deviceId);
        resolve({ count: device.count });
    });
};

exports.getLatest = (deviceId) => {
    return new Promise(async (resolve, reject) => {
        let device = await devices.get(deviceId);
        resolve(device.latestReading);
    });
};

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        resolve(devices.values());
    });
};

exports.set = (deviceId, deviceReadings) => {
    return new Promise(async (resolve, reject) => {
        let newReadingCount = 0;
        let latestReading;
        deviceReadings.forEach(element => {
            newReadingCount += element.count;
            if (!latestReading) {
                latestReading = element;
            } else {
                if (element.timestamp > latestReading.timestamp) {
                    latestReading = element;
                }
            }
        });

        let device = await devices.get(deviceId);
        if (device) {
            Array.prototype.push.apply(deviceReadings, device.readings);
            device.count += newReadingCount;
            if (latestReading.timestamp > device.latestReading.timestamp) {
                device.latestReading = latestReading;
            }
        } else {
            device = {
                id: deviceId,
                count: newReadingCount,
                latestReading: latestReading,
                readings: deviceReadings
            };
        }

        await devices.set(deviceId, device);
        resolve(await devices.get(deviceId));
    });
};

// Internal
exports.clear = () => {
    devices.clear();
    checksum.clear();
}

exports.validateRequest = async (body) => {
    let curChecksum = cs(JSON.stringify(body));
    if (await checksum.get(curChecksum)) {
        return false;
    }
    await checksum.set(curChecksum, JSON.stringify(body));
    return true;
}