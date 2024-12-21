const db = require('../config/db');

exports.getLatestReadings = (limit) => {
  return db.get('readings').takeRight(limit).value();
};

exports.addReading = (sensorId, waterLevel) => {
  const sensor = db.get('sensors').find({ sensorId }).value();
  if (!sensor) throw new Error('Sensor not found');

  const actionTaken = waterLevel > sensor.threshold;
  const reading = {
    sensorId,
    waterLevel: parseFloat(waterLevel),
    timestamp: new Date().toISOString(),
    actionTaken
  };

  db.get('readings').push(reading).write();
  return reading;
};
