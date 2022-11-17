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

const devices = require('node-persist');
devices.init();

exports.get = (deviceId) => {
    return new Promise((resolve, reject) => {
        let device = devices.get(deviceId);
        resolve(device);
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
}