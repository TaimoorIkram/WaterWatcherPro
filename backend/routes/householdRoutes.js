const express = require('express');
const householdController = require('../controllers/householdController');

const router = express.Router();

router.get('/', householdController.getHouseholds);
router.post('/', householdController.createHousehold);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

module.exports = router;
