const db = require('../config/db');

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


  