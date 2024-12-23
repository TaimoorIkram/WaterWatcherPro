const express = require('express');
const readingController = require('../controllers/readingController');

const router = express.Router();

router.get('/', readingController.getReadings);
router.post('/sensor', readingController.postReading);
router.post('/actuator', readingController.postActuatorReading);
// router.post('/sensor', readingController.postReading);
// acturots
// deviceId, token, value, 
// command in response turn on or off

module.exports = router;
