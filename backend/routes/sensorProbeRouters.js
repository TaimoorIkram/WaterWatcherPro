const express = require('express');
const { evaluateAction } = require('../controllers/sensorProbeController');

const router = express.Router();

// Route to evaluate action for a sensor
router.post('/evaluate_action', evaluateAction);

module.exports = router;
