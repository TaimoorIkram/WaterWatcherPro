const householdService = require('../services/householdService');

// Get all households
exports.getAllHouseholds = (req, res) => {
  try {
    const households = householdService.getAllHouseholds();
    res.json(households);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get households by user_id
exports.getHouseholdsByUserId = (req, res) => {
  const { user_id } = req.params; // Get user_id from URL params
  try {
    const households = householdService.getHouseholdsByUserId(user_id);
    if (households.length === 0) {
      return res.status(404).json({ message: 'No households found for this user_id' });
    }
    res.json(households);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new household
exports.createHousehold = (req, res) => {
  const { location, user_id } = req.body;
  try {
    const newHousehold = householdService.createHousehold(location, user_id);
    res.status(201).json(newHousehold);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing household by ID
exports.updateHousehold = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedHousehold = householdService.updateHousehold(id, updates);
    if (!updatedHousehold) {
      return res.status(404).json({ message: 'Household not found' });
    }
    res.json(updatedHousehold);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a household by ID
exports.deleteHousehold = (req, res) => {
  const { id } = req.params;
  try {
    householdService.deleteHousehold(id);
    res.json({ message: 'Household deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
