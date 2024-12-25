const db = require('../config/db');

exports.getDeviceById = (deviceId) => db.get('Devices').find({ deviceId }).value()

exports.activateDevice = (newRequest) => {
    db.get('Requests').push(newRequest).write();
    return newRequest;
};

exports.getRequest = (id) => {
    console.log('Looking for request with device id:', id);
    const request = db.get('Requests').find({ deviceId: parseInt(id) }).value();
    console.log('Found request:', request);
    return request;
};

exports.getAllRequests = (id) => {
    console.log('Looking for request with device id:', id);
    const request = db.get('Requests').value();
    console.log('Found request:', request);
    return request;
};

exports.createSensor = (sensor) => {
    db.get('Devices').push(sensor).write();
    return sensor;
};

exports.updateRequestStatus = (deviceId) => {
    const updatedRequest = db.get('Requests')
        .find({ deviceId: parseInt(deviceId) })
        .assign({ activated: true })
        .write();
    return updatedRequest;
};

exports.createSensorRequestNonce = (deviceId) => {
    const nonce = Math.floor(Math.random() * 127);
    
    const existingNonce = db.get('Nonces').find({ deviceId: deviceId }).value();
    if (existingNonce) {
        db.get('Nonces').find({ deviceId: deviceId }).assign({ nonce: nonce }).write();
    } else {
        db.get('Nonces').push({ deviceId: deviceId, nonce: nonce }).write();
    }
    return nonce;
}

exports.getNonceByDeviceId = (deviceId) => {
    const nonce = db.get('Nonces').find({ deviceId: deviceId }).value();
    return nonce;
}


  