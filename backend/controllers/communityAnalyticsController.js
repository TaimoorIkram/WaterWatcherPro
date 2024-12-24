// communityAnalyticsController.js
const { getAverageDailyWaterUsage, getCommunityMotorUsage, getUserRankings } = require('../services/communityAnalyticsService');

// Controller for average daily water usage
const getAverageDailyWaterUsageController = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    console.log('Calling getAverageDailyWaterUsage with month:', month);
    const data = await getAverageDailyWaterUsage(Number(month.value));
    console.log('Received data from getAverageDailyWaterUsage:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in getAverageDailyWaterUsageController:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for community motor usage patterns
const getCommunityMotorUsageController = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const data = await getCommunityMotorUsage(Number(month.value));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for user rankings by water consumption
const getUserRankingsController = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const data = await getUserRankings(Number(month.value));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAverageDailyWaterUsageController, getCommunityMotorUsageController, getUserRankingsController };
