// communityAnalyticsService.js
const db = require('../config/db');

// Helper function to calculate gallons used from water level
const calculateGallonsUsed = (waterLevel, tankHeight, tankCapacity) => {
  const remainingHeight = tankHeight - waterLevel;
  return remainingHeight * (tankCapacity / tankHeight);
};

// Service logic for average daily water usage
const getAverageDailyWaterUsage = async (month) => {
  const sensorData = db.get('SensorData')
    .filter({ month })
    .value();

  const dailyUsage = {};

  sensorData.forEach((entry) => {
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
    const tankHeightToCapacityRatio = config.tank_capacity / config.tank_height;
    const gallonsUsed = entry.water_level * tankHeightToCapacityRatio;

    if (!dailyUsage[day]) {
      dailyUsage[day] = { total: 0, count: 0 };
    }

    dailyUsage[day].total += gallonsUsed;
    dailyUsage[day].count += 1;
  });

  const xAxis = Object.keys(dailyUsage).map(Number);
  const yAxis = Object.values(dailyUsage).map(entry => entry.total / entry.count);

  return { xAxis, yAxis };
};

const getCommunityMotorUsage = async (month) => {
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
  

const getUserRankings = async (month) => {
    const sensorData = db.get('SensorData')
      .filter({ month })
      .value();
  
    const userWaterUsage = {};
  
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
  
      const userId = sensor.household_id; // Assuming household ID is the same as user ID
      const waterUsed = calculateGallonsUsed(entry.water_level, householdConfig.tank_height, householdConfig.tank_capacity);
  
      if (!userWaterUsage[userId]) {
        userWaterUsage[userId] = 0;
      }
  
      userWaterUsage[userId] += waterUsed;
    });
  
    const sortedUsers = Object.keys(userWaterUsage)
      .sort((a, b) => userWaterUsage[b] - userWaterUsage[a])
      .map(userId => ({ userId, total: userWaterUsage[userId] }));
  
    const xAxis = sortedUsers.map(entry => entry.userId);
    const yAxis = sortedUsers.map(entry => entry.total);
  
    return { xAxis, yAxis };
  };
  
module.exports = { getAverageDailyWaterUsage, getCommunityMotorUsage, getUserRankings };
  