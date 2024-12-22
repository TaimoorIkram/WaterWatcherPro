const db = require('../config/db'); // Assuming this is your database access file

/*
**********************************************************************************************************************
Start with the first sensor reading of the month to set your initial water level.
For each subsequent reading:
    Compare it with the previous reading to determine if the water level has increased or decreased.
    If the level decreased, it means water was consumed. Calculate the consumed water and add it to the total usage.
    If the level increased, it means the tank was refilled and should not be added to the consumption.
**********************************************************************************************************************
*/

const getDailyWaterUsage = async (userId, month) => {
    const household = db.get('Household').find({ user_id: parseInt(userId, 10) }).value();
    if (!household) throw new Error('Household not found for the given user');
  
    const sensor = db.get('Sensor').find({ household_id: household.id }).value();
    if (!sensor) throw new Error('Sensor not found for the given user');
  
    const config = db.get('HouseholdConfig').find({ household_id: household.id }).value();
    if (!config) throw new Error('Configuration not found for the household');
  
    const sensorData = db.get('SensorData')
      .filter({ sensor_id: sensor.id, month })
      .sortBy('time') // Ensure data is sorted by time
      .value();
  
    if (sensorData.length === 0) return { xAxis: [], yAxis: [] };
  
    const dailyUsage = {};
    const tankHeightToCapacityRatio = config.tank_capacity / config.tank_height; // Gallons per meter
    let previousWaterLevel = sensorData[0].water_level;
  
    sensorData.forEach((entry) => {
      const day = entry.day;
      const currentWaterLevel = entry.water_level;
  
      if (currentWaterLevel < previousWaterLevel) {
        const gallonsUsed = (previousWaterLevel - currentWaterLevel) * tankHeightToCapacityRatio;
        dailyUsage[day] = (dailyUsage[day] || 0) + gallonsUsed;
      }
  
      previousWaterLevel = currentWaterLevel; // Update previous water level for next comparison
    });
  
    const xAxis = Object.keys(dailyUsage).map(Number);
    const yAxis = Object.values(dailyUsage);
  
    return { xAxis, yAxis };
  };  


/*
**********************************************************************************************************************
For each entry in the sensorData:
    It extracts the day and hour from the entry.
    It determines if the motor is on by checking if the water_level is below a threshold value calculated based on the tank
    height and the corresponding threshold for the given hour (peak or normal hours).
    If the motor is on during peak hours, the function increments the peak count for that day.
    If the motor is on during normal hours, it increments the normal count for that day.
**********************************************************************************************************************
*/ 

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
