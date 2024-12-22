const express = require('express');
const sensorController = require('../controllers/sensorController');

const router = express.Router();

router.get('/', sensorController.getSensors);
router.post('/', sensorController.createSensor);
router.put('/:id', sensorController.updateSensor);
router.delete('/:id', sensorController.deleteSensor);

module.exports = router;
