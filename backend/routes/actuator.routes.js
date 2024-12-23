const express = require('express');
const authenticateToken = require('../middlewares/jwt.middleware');
const sensorController = require('../controllers/sensorController');

const router = express.Router();


router.get('/',sensorController.getSensors);
router.post('/', authenticateToken, sensorController.createSensor);
router.put('/:id', authenticateToken,sensorController.updateSensor);
router.delete('/:id',authenticateToken,sensorController.deleteSensor);

module.exports = router;
