const express = require('express');
const householdConfigController = require('../controllers/householdConfigController');
const authenticateToken = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/', authenticateToken, householdConfigController.getAllConfigs);
router.get('/my', authenticateToken, householdConfigController.getUserConfigs);
router.get('/:id', authenticateToken, householdConfigController.getConfigById);
router.post('/', authenticateToken, householdConfigController.createConfig);
router.put('/:id', authenticateToken, householdConfigController.updateConfig);
router.delete('/:id', authenticateToken, householdConfigController.deleteConfig);

module.exports = router;
