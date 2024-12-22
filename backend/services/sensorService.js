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
