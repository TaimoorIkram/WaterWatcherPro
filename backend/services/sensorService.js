const db = require('../config/db');

exports.getAllSensors = () => db.get('sensors').value();

exports.addSensor = (sensorId, threshold) => {
  const existingSensor = db.get('sensors').find({ sensorId }).value();
  if (existingSensor) throw new Error('Sensor already exists');
  
  const newSensor = { sensorId, threshold };
  db.get('sensors').push(newSensor).write();
  return newSensor;
};
