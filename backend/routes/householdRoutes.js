const express = require('express');
const householdController = require('../controllers/householdController');

const router = express.Router();

// Get all households
router.get('/', householdController.getAllHouseholds);

// Get households by user_id
router.get('/user/:user_id', householdController.getHouseholdsByUserId); // Route to get households by user_id

// Create a new household
router.post('/', householdController.createHousehold);

// Update an existing household by ID
router.put('/:id', householdController.updateHousehold);

// Delete a household by ID
router.delete('/:id', householdController.deleteHousehold);

module.exports = router;
