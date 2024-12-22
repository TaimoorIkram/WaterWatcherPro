const db = require('../config/db'); // Assuming this is your database access file

// Service logic for daily water usage
const getDailyWaterUsage = async (userId, month) => {
  const sensor = db.get('Sensor').find({ household_id: userId }).value();
  if (!sensor) throw new Error('Sensor not found for the given user');

  const sensorData = db.get('SensorData')
    .filter({ sensor_id: sensor.id, month })
    .value();

  const dailyUsage = {};
  sensorData.forEach((entry) => {
    const day = entry.day;
    dailyUsage[day] = (dailyUsage[day] || 0) + entry.water_level;
  });

  const xAxis = Object.keys(dailyUsage).map(Number);
  const yAxis = Object.values(dailyUsage);

  return { xAxis, yAxis };
};

// Service logic for motor usage comparison
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

  let peakUsage = 0;
  let normalUsage = 0;

  sensorData.forEach((entry) => {
    const hour = parseInt(entry.time.split(':')[0], 10);
    const waterUsed = entry.water_level;

    if (hour >= peakStart && hour <= peakEnd) {
      peakUsage += waterUsed;
    } else {
      normalUsage += waterUsed;
    }
  });

  return { xAxis: ['Peak Hours', 'Normal Hours'], yAxis: [peakUsage, normalUsage] };
};

module.exports = { getDailyWaterUsage, getMotorUsage };
