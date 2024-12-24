const db = require('../config/db');

exports.getAllSensors = () => db.get('sensors').value();

exports.createSensor = (id, household_id) => {
  const newSensor = { id, household_id };
  db.get('sensors').push(newSensor).write();
  return newSensor;
};

exports.updateSensor = (id, updates) => {
  const sensor = db.get('sensors').find({ id }).assign(updates).write();
  return sensor || null;
};

exports.deleteSensor = id => db.get('sensors').remove({ id }).write();

exports.handleSensorData = (message) => {
  console.log("------------------");
  console.log(`Device ID: ${message.id}`);
  console.log(`Water Level: ${message.waterLevel}`);

  // Check if device ID exists in the Devices table
  const deviceExists = db.get('Devices').find({ deviceId: message.id }).value();

  if (!deviceExists) {
    console.log("Device not found with provided ID:", message.id);
    return { message: "Device not found with provided ID" };
  }

  const sensorData = {
    deviceId: message.id,
    water_level: message.waterLevel,
    createdAt: new Date().toISOString() // Store current date and time
  };

  db.get('SensorData').push(sensorData).write();
  console.log("Sensor data saved successfully.");
  return { message: "Sensor data saved successfully" };
};