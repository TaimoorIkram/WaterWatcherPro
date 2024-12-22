
const db = require('../config/db');
// Helper function to calculate gallons used from water level
const calculateGallonsUsed = (previousWaterLevel, currentWaterLevel, tankHeight, tankCapacity) => {
    const gallonsUsed = (previousWaterLevel - currentWaterLevel) * (tankCapacity / tankHeight);
    return gallonsUsed;
  };
  
const getAverageDailyWaterUsage = async (month) => {
    /*
    **********************************************************************************************************************
    Retrieve sensor data for the specified month.
    Initialize an empty object to store average water usage per day.
  
    For each entry in the sensor data:
        Find the corresponding sensor, household, and configuration details.
        Calculate the water usage in gallons based on the difference between consecutive water levels.
        If an entry for the day already exists in the usage data, update it. Otherwise, initialize it.
        Only add consumed water (i.e., where the water level has decreased) to the usage.
  
    After processing all entries:
        Prepare xAxis and yAxis for visualization by mapping the days of the month and the corresponding average water usage.
    **********************************************************************************************************************
    */
    
    const sensorData = db.get('SensorData')
      .filter({ month })
      .sortBy('time') // Ensure data is sorted by time
      .value();
  
    const dailyUsage = {};
  
    if (sensorData.length === 0) return { xAxis: [], yAxis: [] };
  
    sensorData.forEach((entry, index) => {
      const sensor = db.get('Sensor').find({ id: entry.sensor_id }).value();
      if (!sensor) {
        console.error(`Sensor not found for sensor_id: ${entry.sensor_id}`);
        return;
      }
  
      const household = db.get('Household').find({ id: sensor.household_id }).value();
      if (!household) {
        console.error(`Household not found for household_id: ${sensor.household_id}`);
        return;
      }
  
      const config = db.get('HouseholdConfig').find({ household_id: household.id }).value();
      if (!config) {
        console.error(`Configuration not found for household_id: ${household.id}`);
        return;
      }
  
      const day = entry.day;
  
      // Calculate gallons used based on differences in water levels
      if (index > 0 && sensorData[index - 1].sensor_id === entry.sensor_id) {
        const previousEntry = sensorData[index - 1];
        const gallonsUsed = calculateGallonsUsed(previousEntry.water_level, entry.water_level, config.tank_height, config.tank_capacity);
  
        if (gallonsUsed > 0) { // Ensure we only add consumed water, not refilled water
          if (!dailyUsage[day]) {
            dailyUsage[day] = { total: 0, count: 0 };
          }
  
          dailyUsage[day].total += gallonsUsed;
          dailyUsage[day].count += 1;
        }
      }
    });
  
    const xAxis = Object.keys(dailyUsage).map(Number);
    const yAxis = Object.values(dailyUsage).map(entry => entry.total / entry.count);
  
    return { xAxis, yAxis };
};

const getCommunityMotorUsage = async (month) => {
      /*
    **********************************************************************************************************************
    Retrieve sensor data for the specified month.
    Initialize an empty object to store motor usage during peak and normal hours for each day.
  
    For each entry in the sensor data:
        Find the corresponding sensor, household configuration.
        Calculate the water usage in gallons based on the tank height and capacity.
        Check if an entry for the day already exists in the usage data. If not, initialize it.
  
        Determine if the current hour falls within the peak hours range.
        Compare the current water level with the threshold to determine if the motor is on.
        If the motor is on during peak hours, increment the peak usage count for the day.
        If the motor is on during normal hours, increment the normal usage count for the day.
  
    After processing all entries:
        Prepare xAxis and yAxis for visualization by mapping the days of the month and the corresponding motor usage counts for peak and normal hours.
    **********************************************************************************************************************
    */
    const sensorData = db.get('SensorData')
      .filter({ month })
      .value();
  
    const usageData = {};
  
    sensorData.forEach((entry) => {
      const sensor = db.get('Sensor').find({ id: entry.sensor_id }).value();
      if (!sensor) {
        console.error(`Sensor not found for sensor_id: ${entry.sensor_id}`);
        return;
      }
  
      const householdConfig = db.get('HouseholdConfig').find({ household_id: sensor.household_id }).value();
      if (!householdConfig) {
        console.error(`HouseholdConfig not found for household_id: ${sensor.household_id}`);
        return;
      }
  
      const day = entry.day;
      const hour = parseInt(entry.time.split(':')[0], 10);
      const waterUsed = calculateGallonsUsed(entry.water_level, householdConfig.tank_height, householdConfig.tank_capacity);
  
      if (!usageData[day]) {
        usageData[day] = { peak: 0, normal: 0 };
      }
  
      const isPeakHour = (hour >= parseInt(householdConfig.peak_usage_hours.split('-')[0], 10) &&
                          hour < parseInt(householdConfig.peak_usage_hours.split('-')[1], 10));
      const isMotorOn = entry.water_level < (householdConfig.tank_height * (isPeakHour ? householdConfig.min_threshold_peak_hours : householdConfig.min_threshold_normal_hours));
  
      if (isPeakHour) {
        if (isMotorOn) {
          usageData[day].peak += 1;
        }
      } else {
        if (isMotorOn) {
          usageData[day].normal += 1;
        }
      }
    });
  
    const xAxis = Object.keys(usageData).map(Number);
    const peakYAxis = Object.values(usageData).map(entry => entry.peak);
    const normalYAxis = Object.values(usageData).map(entry => entry.normal);
  
    return { xAxis, peakYAxis, normalYAxis };
  };
  
/*
    **********************************************************************************************************************
    Sort the sensor data chronologically by time to ensure accurate calculation of water usage over the month.
    Initialize an empty object to store total water usage for each user.
  
    For each entry in the sensor data:
        Find the corresponding sensor, household configuration, and user details.
        If the sensor ID matches the previous entry's sensor ID, calculate the difference in water levels.
        If the current water level is less than the previous one, compute the gallons consumed and add it to the user's total water usage.
        Ensure that only consumed water (not refilled water) is added to the usage.
  
    After processing all entries:
        Sort users based on their total water usage in descending order.
        Prepare xAxis and yAxis for visualization by mapping sorted user names and their total water usage respectively.
    **********************************************************************************************************************
    */
const getUserRankings = async (month) => {
    const sensorData = db.get('SensorData')
      .filter({ month })
      .sortBy('time') // Ensure data is sorted by time
      .value();
  
    const userWaterUsage = {};
  
    sensorData.forEach((entry, index) => {
      const sensor = db.get('Sensor').find({ id: entry.sensor_id }).value();
      if (!sensor) {
        console.error(`Sensor not found for sensor_id: ${entry.sensor_id}`);
        return;
      }
  
      const householdConfig = db.get('HouseholdConfig').find({ household_id: sensor.household_id }).value();
      if (!householdConfig) {
        console.error(`HouseholdConfig not found for household_id: ${sensor.household_id}`);
        return;
      }
  
      const user = db.get('User').find({ id: sensor.household_id }).value();
      if (!user) {
        console.error(`User not found for user_id: ${sensor.household_id}`);
        return;
      }
  
      const userId = sensor.household_id; // Assuming household ID is the same as user ID
      const tankHeightToCapacityRatio = householdConfig.tank_capacity / householdConfig.tank_height; // Gallons per meter
  
      // Calculate gallons used based on differences in water levels
      if (index > 0 && sensorData[index - 1].sensor_id === entry.sensor_id) {
        const previousEntry = sensorData[index - 1];
        const gallonsUsed = (previousEntry.water_level - entry.water_level) * tankHeightToCapacityRatio;
  
        if (gallonsUsed > 0) { // Ensure we only add consumed water, not refilled water
          if (!userWaterUsage[user.name]) {
            userWaterUsage[user.name] = 0;
          }
          userWaterUsage[user.name] += gallonsUsed;
        }
      }
    });
  
    // Sort users by total water usage and prepare data for plotting
    const sortedUsers = Object.keys(userWaterUsage)
      .sort((a, b) => userWaterUsage[b] - userWaterUsage[a])
      .map(userName => ({ userName, total: userWaterUsage[userName] }));
  
    const xAxis = sortedUsers.map(entry => entry.userName);
    const yAxis = sortedUsers.map(entry => entry.total);
  
    return { xAxis, yAxis };
};  

module.exports = { getAverageDailyWaterUsage, getCommunityMotorUsage, getUserRankings };