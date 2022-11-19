const checksum = require('checksum');
const db = require('node-persist');
const isHEX = (ch) => "0123456789abcdef".includes(ch.toLowerCase());

const checksumStorage = db.create({dir: 'checksum'});
checksumStorage.init();

exports.validId = (guid) => {
    if (!guid) {
        return false;
    }
    guid = guid.replaceAll("-", "");
    return guid.length === 32 && [...guid].every(isHEX);
}

exports.validRequest = async (body) => {
    let curChecksum = checksum(JSON.stringify(body));
    if (await checksumStorage.get(curChecksum)) {
        return false;
    }
    await checksumStorage.set(curChecksum, JSON.stringify(body));
    return true;
}

exports.validReadings = (readings) => {
    if (!readings) {
        return false;
    }
    
    return !!readings.length;
}

// Internal
exports.clear = () => {
    checksumStorage.clear();
}