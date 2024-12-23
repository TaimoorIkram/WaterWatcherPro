const db = require('../config/db');

// Fetch router configuration by sensor ID
exports.fetchRouterConfig = (sensor_id) => {
  return db.get("Router").find({ sensor_id }).value();
};

// Save a new router configuration
exports.saveRouterConfig = (newConfig) => {
  const existing = db.get("Router").find({ sensor_id: newConfig.sensor_id }).value();
  if (existing) {
    return { success: false, message: "Configuration for this sensor ID already exists." };
  }

  db.get("Router").push(newConfig).write();
  return { success: true, data: newConfig };
};

// Update an existing router configuration
exports.modifyRouterConfig = (sensor_id, updatedData) => {
  const existing = db.get("Router").find({ sensor_id }).value();
  if (!existing) {
    return { success: false, message: "Configuration not found." };
  }

  const updatedConfig = db.get("Router").find({ sensor_id }).assign(updatedData).write();
  return { success: true, data: updatedConfig };
};

// Remove a router configuration
exports.removeRouterConfig = (sensor_id) => {
  const existing = db.get("Router").find({ sensor_id }).value();
  if (!existing) {
    return { success: false, message: "Configuration not found." };
  }

  db.get("Router").remove({ sensor_id }).write();
  return { success: true };
};
