// communityAnalyticsRoutes.js
const express = require('express');
const { getAverageDailyWaterUsageController, getCommunityMotorUsageController, getUserRankingsController } = require('../controllers/communityAnalyticsController');

const router = express.Router();

// Route for average daily water usage
router.get('/average-daily-water-usage', getAverageDailyWaterUsageController);

// Route for community motor usage patterns
router.get('/motor-usage', getCommunityMotorUsageController);

// Route for user rankings by water consumption
router.get('/user-rankings', getUserRankingsController);

module.exports = router;
