const householdConfigService = require('../services/householdConfigService');

exports.getConfigs = (req, res) => {
  try {
    const configs = householdConfigService.getAllConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createConfig = (req, res) => {
  try {
    const { household_id, tank_height, tank_capacity, peak_usage_hours, water_availability_hours } = req.body;
    const config = householdConfigService.createConfig(
      household_id,
      tank_height,
      tank_capacity,
      peak_usage_hours,
      water_availability_hours
    );
    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConfig = (req, res) => {
  try {
    const { household_id } = req.params;
    const updates = req.body;
    const config = householdConfigService.updateConfig(household_id, updates);
    if (config) res.json(config);
    else res.status(404).json({ message: 'Configuration not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConfig = (req, res) => {
  try {
    const { household_id } = req.params;
    householdConfigService.deleteConfig(household_id);
    res.json({ message: 'Configuration deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
