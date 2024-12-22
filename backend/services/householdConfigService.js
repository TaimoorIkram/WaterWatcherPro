const db = require('../config/db');

exports.getAllConfigs = () => db.get('HouseholdConfig').value();

exports.getConfigById = id => db.get('HouseholdConfig').find({ household_id: id }).value();

exports.createConfig = (household_id, tank_height, tank_capacity, peak_usage_hours, water_availability_hours, min_threshold_normal_hours, min_threshold_peak_hours) => {
  // Find the current highest ID in the collection
  const lastId = db.get('HouseholdConfig').map('id').max().value() || 0;

  // Increment ID for the new entry
  const newId = lastId + 1;

  const newConfig = {
    id: newId,
    household_id,
    tank_height,
    tank_capacity,
    peak_usage_hours,
    water_availability_hours,
    min_threshold_normal_hours,
    min_threshold_peak_hours,
  };

  db.get('HouseholdConfig').push(newConfig).write();
  return newConfig;
};

exports.updateConfig = (id, updates) => {
  const config = db.get('HouseholdConfig').find({ household_id: id }).assign(updates).write();
  return config || null;
};

exports.deleteConfig = id =>
  db.get('HouseholdConfig').remove({ household_id: id }).write();
