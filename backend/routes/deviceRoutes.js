const express = require('express');
const { getDeviceData, getAllDevices} = require('../controllers/deviceController');
const authorizeRoles = require('../middlewares/rbac.middleware');

const router = express.Router();

// todo: move to shared file
const SUPER_ADMIN = 1;
const ADMIN = 2;
const CUSTOMER = 3;
const TECHNICIAN = 4;



// Route for daily water usage
router.get('/:id', authorizeRoles(SUPER_ADMIN, ADMIN), getDeviceData);

// Route to get all devices 
router.get('/', authorizeRoles(SUPER_ADMIN, ADMIN), getAllDevices);

module.exports = router;
