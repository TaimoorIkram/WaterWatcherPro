const db = require('../config/db');

exports.getLatestReadings = (limit) => {
  return db.get('readings').takeRight(limit).value();
};

exports.verifyDeviceToken = (deviceId, providedToken) => {
  const sensor = db.get('Devices').find({ deviceId }).value();
  if (!sensor) {
    throw new Error('Sensor not found');
  }

  const expectedToken = deviceId + sensor.authToken;
  return providedToken == expectedToken;
};

exports.addReading = (deviceId, waterLevel) => {
  const sensor = db.get('Devices').find({ deviceId }).value();
  if (!sensor) {
    throw new Error('Sensor not found');
  }

  const reading = {
    deviceId,
    waterLevel: parseFloat(waterLevel),
    timestamp: new Date().toISOString()
  };

  db.get('SensorData').push(reading).write();
  return reading;
};



exports.addActuatorReading = (deviceId, motor_status,result) => {
  const actuator = db.get('Devices').find({ deviceId }).value();
  if (!actuator) {
    throw new Error('Sensor not found');
  }

  const reading = {
    deviceId,
    motor_status: motor_status,
    take_action:result,
    timestamp: new Date().toISOString()
  };

  db.get('ActuatorData').push(reading).write();
  return reading;
};
