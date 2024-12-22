const householdService = require('../services/householdService');

exports.getHouseholds = (req, res) => {
  try {
    const households = householdService.getAllHouseholds();
    res.json(households);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createHousehold = (req, res) => {
  try {
    const { id, location, user_id } = req.body;
    const household = householdService.createHousehold(id, location, user_id);
    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHousehold = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const household = householdService.updateHousehold(id, updates);
    if (household) res.json(household);
    else res.status(404).json({ message: 'Household not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHousehold = (req, res) => {
  try {
    const { id } = req.params;
    householdService.deleteHousehold(id);
    res.json({ message: 'Household deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
