const express = require('express');
const householdController = require('../controllers/householdController');
const authenticateToken = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/', authenticateToken,householdController.getHouseholds);
router.post('/', authenticateToken,householdController.createHousehold);
router.put('/:id', authenticateToken,householdController.updateHousehold);
router.delete('/:id',authenticateToken, householdController.deleteHousehold);

module.exports = router;