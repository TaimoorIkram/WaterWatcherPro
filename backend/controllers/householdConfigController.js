const householdConfigService = require('../services/householdConfigService');

exports.getAllConfigs = (req, res) => {
  try {
    const configs = householdConfigService.getAllConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getConfigById = (req, res) => {
  try {
    const { id } = req.params;
    const config = householdConfigService.getConfigById(parseInt(id));
    if (config) {
      res.json(config);
    } else {
      res.status(404).json({ message: 'Configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createConfig = (req, res) => {
  try {
    const { household_id, tank_height, tank_capacity, peak_usage_hours, min_threshold_normal_hours, min_threshold_peak_hours, water_availability_hours } = req.body;
    const config = householdConfigService.createConfig(
      household_id,
      tank_height,
      tank_capacity,
      peak_usage_hours,
      min_threshold_normal_hours,
      min_threshold_peak_hours,
      water_availability_hours,
    );
    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConfig = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedConfig = householdConfigService.updateConfig(parseInt(id), updates);
    if (updatedConfig) {
      res.json(updatedConfig);
    } else {
      res.status(404).json({ message: 'Configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteConfig = (req, res) => {
  try {
    const { id } = req.params;
    householdConfigService.deleteConfig(parseInt(id));
    res.json({ message: 'Configuration deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
