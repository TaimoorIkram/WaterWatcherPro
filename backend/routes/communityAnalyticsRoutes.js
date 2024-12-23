// communityAnalyticsRoutes.js
const express = require('express');
const { getAverageDailyWaterUsageController, getCommunityMotorUsageController, getUserRankingsController } = require('../controllers/communityAnalyticsController');
const authorizeRoles = require('../middlewares/rbac.middleware');

const router = express.Router();


// todo: move to shared file
const SUPER_ADMIN = 1;
const ADMIN = 2;
const CUSTOMER = 3;
const TECHNICIAN = 4;

// Route for average daily water usage
router.get('/average-daily-water-usage',authorizeRoles(SUPER_ADMIN, ADMIN), getAverageDailyWaterUsageController);

// Route for community motor usage patterns
router.get('/motor-usage',authorizeRoles(SUPER_ADMIN, ADMIN), getCommunityMotorUsageController);

// Route for user rankings by water consumption
router.get('/user-rankings',authorizeRoles(SUPER_ADMIN, ADMIN), getUserRankingsController);

module.exports = router;
