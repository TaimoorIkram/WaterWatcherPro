const db = require('../config/db');

exports.getAllConfigs = () => db.get('householdConfigs').value();

exports.createConfig = (household_id, tank_height, tank_capacity, peak_usage_hours, water_availability_hours) => {
  const newConfig = { household_id, tank_height, tank_capacity, peak_usage_hours, water_availability_hours };
  db.get('householdConfigs').push(newConfig).write();
  return newConfig;
};

exports.updateConfig = (household_id, updates) => {
  const config = db.get('householdConfigs').find({ household_id }).assign(updates).write();
  return config || null;
};

exports.deleteConfig = household_id =>
  db.get('householdConfigs').remove({ household_id }).write();
