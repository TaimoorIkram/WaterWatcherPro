const express = require('express');
const { getRecentTankLevelController, getAllUsersController, getDailyWaterUsageController, getMotorUsageController } = require('../controllers/userAnalyticsController');
const authorizeRoles = require('../middlewares/rbac.middleware');

const router = express.Router();

// todo: move to shared file
const SUPER_ADMIN = 1;
const ADMIN = 2;
const CUSTOMER = 3;
const TECHNICIAN = 4;



// Route for daily water usage
router.get('/daily-water-usage',authorizeRoles(SUPER_ADMIN, ADMIN), getDailyWaterUsageController);

// Route for motor usage comparison
router.get('/motor-usage',authorizeRoles(SUPER_ADMIN, ADMIN), getMotorUsageController);

// Route for recent water tank level
// router.get('/recent-tank-level',authorizeRoles(SUPER_ADMIN, ADMIN), getRecentTankLevelController);

//Route to get all users
router.get('/users',authorizeRoles(SUPER_ADMIN, ADMIN), getAllUsersController);

module.exports = router;
