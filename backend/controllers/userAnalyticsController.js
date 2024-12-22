const { getAllUsers, getDailyWaterUsage, getMotorUsage } = require('../services/userAnalyticsService');

// Controller for daily water usage
const getDailyWaterUsageController = async (req, res) => {
  try {
    const { userId, month } = req.query;

    if (!userId || !month) {
      return res.status(400).json({ error: 'User ID and month are required' });
    }

    const data = await getDailyWaterUsage(Number(userId), Number(month));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for motor usage comparison
const getMotorUsageController = async (req, res) => {
  try {
    const { userId, month } = req.query;

    if (!userId || !month) {
      return res.status(400).json({ error: 'User ID and month are required' });
    }

    const data = await getMotorUsage(Number(userId), Number(month));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for daily water usage
const getAllUsersController = async (req, res) => {
    try {
      const data = await getAllUsers();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { getAllUsersController, getDailyWaterUsageController, getMotorUsageController };
