const db = require('../config/db');

// Fetch the household configuration by sensor ID
exports.getHouseholdConfig = (actuatorId) => {
  const household_id = db.get('Devices').find({ deviceId: actuatorId }).value().household_id;
  console.log(`Fetching household configuration for actuator ID: ${actuatorId}`);
  console.log(`Household ID: ${household_id}`);
  const config = db.get('HouseholdConfig').find({ household_id }).value();
  console.log(`Household configuration: ${JSON.stringify(config)}`);
  return config;
};

// Fetch the latest sensor data for a given sensor ID
exports.getLatestSensorData = (sensor_id) => {
  const sensorDataList = db.get('SensorData').filter({ deviceId: sensor_id }).value();
  if (!sensorDataList || sensorDataList.length === 0) return null;
    
  // Sort data by year, month, day, and time (descending) to get the latest entry
  return sensorDataList.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1, a.day, ...a.time.split(':'));
    const dateB = new Date(b.year, b.month - 1, b.day, ...b.time.split(':'));
    return dateB - dateA;
  })[0];
};

// Check if the current time falls within the peak usage hours
exports.isPeakTime = (currentTime, peakHours) => {
    // Split the peakHours string into start and end times
    const [start, end] = peakHours.split('-');
  
    if (!start || !end) {
      throw new Error(`Invalid peakHours format: ${peakHours}`);
    }
  
    // Parse currentTime, start, and end into comparable time values
    const current = new Date(`1970-01-01T${currentTime}Z`).getTime();
    const startTime = new Date(`1970-01-01T${start}:00:00Z`).getTime();
    const endTime = new Date(`1970-01-01T${end}:00:00Z`).getTime();
  
    // Check if current time is within the peak range
    return current >= startTime && current <= endTime;
  };
  
  

// Evaluate whether action should be taken
exports.evaluateAction = (config, sensorData) => {
  const isPeak = exports.isPeakTime(sensorData.time, config.peak_usage_hours);
  const threshold = isPeak ? config.min_threshold_peak_hours : config.min_threshold_normal_hours;

  // Compare water level with the threshold
  const takeAction = sensorData.waterLevel < threshold;

  console.log(`Evaluating action for sensor data: ${JSON.stringify(sensorData)}`);
  console.log(`Peak time: ${isPeak}`);
  console.log(`Threshold: ${threshold}`);
  console.log(`Take action: ${takeAction}`);

  return { take_action: takeAction };
};
