const express = require('express');
const householdConfigController = require('../controllers/householdConfigController');

const router = express.Router();

router.get('/', householdConfigController.getAllConfigs);
router.get('/:id', householdConfigController.getConfigById);
router.post('/', householdConfigController.createConfig);
router.put('/:id', householdConfigController.updateConfig);
router.delete('/:id', householdConfigController.deleteConfig);

module.exports = router;
