const express = require('express');
const { getDailyWaterUsageController, getMotorUsageController } = require('../controllers/userAnalyticsController');

const router = express.Router();

// Route for daily water usage
router.get('/daily-water-usage', getDailyWaterUsageController);

// Route for motor usage comparison
router.get('/motor-usage', getMotorUsageController);

module.exports = router;
