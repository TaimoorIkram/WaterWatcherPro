const db = require('../config/db'); // Assuming this is your database access file

// Service logic for daily water usage
const getDailyWaterUsage = async (userId, month) => {
    // Find the household linked to the user
    const household = db.get('Household').find({ user_id: parseInt(userId, 10) }).value();
    if (!household) throw new Error('Household not found for the given user');
  
    // Find the sensor linked to the household
    const sensor = db.get('Sensor').find({ household_id: household.id }).value();
    if (!sensor) throw new Error('Sensor not found for the given user');
  
    // Find the configuration for the household
    const config = db.get('HouseholdConfig').find({ household_id: household.id }).value();
    if (!config) throw new Error('Configuration not found for the household');
  
    // Fetch the sensor data for the given month
    const sensorData = db.get('SensorData')
      .filter({ sensor_id: sensor.id, month })
      .value();
  
    // Calculate daily water usage in gallons
    const dailyUsage = {};
    const tankHeightToCapacityRatio = config.tank_capacity / config.tank_height; // Gallons per meter
  
    sensorData.forEach((entry) => {
      const day = entry.day;
  
      // Convert water level to gallons used (assume readings measure usage, not remaining volume)
      const gallonsUsed = entry.water_level * tankHeightToCapacityRatio;
      dailyUsage[day] = (dailyUsage[day] || 0) + gallonsUsed;
    });
  
    // Prepare xAxis and yAxis for visualization
    const xAxis = Object.keys(dailyUsage).map(Number);
    const yAxis = Object.values(dailyUsage);
  
    return { xAxis, yAxis };
  };



// Service logic for motor usage comparison by day for normal and peak hours
const getMotorUsage = async (userId, month) => {
    const householdConfig = db.get('HouseholdConfig').find({ household_id: userId }).value();
    if (!householdConfig) throw new Error('Household configuration not found for the given user');
  
    const peakHoursRange = householdConfig.peak_usage_hours.split('-').map(Number);
    const [peakStart, peakEnd] = peakHoursRange;
  
    const sensor = db.get('Sensor').find({ household_id: userId }).value();
    if (!sensor) throw new Error('Sensor not found for the given user');
  
    const sensorData = db.get('SensorData')
      .filter({ sensor_id: sensor.id, month })
      .value();
  
    // Initialize objects to track motor usage (in terms of time) for each day
    const dailyUsage = {};
  
    sensorData.forEach((entry) => {
      const day = entry.day;
      const hour = parseInt(entry.time.split(':')[0], 10);
      const waterUsed = entry.water_level;
  
      // Determine whether motor is on or off
      const isMotorOn = waterUsed < (householdConfig.tank_height * (hour >= peakStart && hour <= peakEnd ? householdConfig.min_threshold_peak_hours : householdConfig.min_threshold_normal_hours));
  
      if (!dailyUsage[day]) {
        dailyUsage[day] = { peak: 0, normal: 0 };
      }
  
      // Check if the current hour is within peak or normal hours
      if (hour >= peakStart && hour <= peakEnd) {
        // Motor is on during peak hours
        if (isMotorOn) {
          dailyUsage[day].peak += 1; // Increment by 1 hour if motor is on
        }
      } else {
        // Motor is on during normal hours
        if (isMotorOn) {
          dailyUsage[day].normal += 1; // Increment by 1 hour if motor is on
        }
      }
    });
  
    // Prepare data for plotting
    const xAxis = Object.keys(dailyUsage).map(Number);  // Days of the month
    const peakYAxis = Object.values(dailyUsage).map((usage) => usage.peak); // Time motor was on during peak hours
    const normalYAxis = Object.values(dailyUsage).map((usage) => usage.normal); // Time motor was on during normal hours
  
    return { xAxis, peakYAxis, normalYAxis };
  };


// Service logic getting All Users
const getAllUsers = async () => {
    // Find all Users
    const users = db.get('User');
    return { users };
  };

module.exports = {getAllUsers, getDailyWaterUsage, getMotorUsage };
