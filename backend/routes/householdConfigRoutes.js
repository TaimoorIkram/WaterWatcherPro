const express = require('express');
const householdConfigController = require('../controllers/householdConfigController');

const router = express.Router();

router.get('/', householdConfigController.getConfigs);
router.post('/', householdConfigController.createConfig);
router.put('/:household_id', householdConfigController.updateConfig);
router.delete('/:household_id', householdConfigController.deleteConfig);

module.exports = router;
