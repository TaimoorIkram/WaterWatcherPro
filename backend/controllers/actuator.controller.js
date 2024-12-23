const sensorService = require('../services/sensorService');

exports.getSensors = (req, res) => {
  try {
    const sensors = sensorService.getAllSensors();
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSensor = (req, res) => {
  try {
    const { id, household_id } = req.body;
    const sensor = sensorService.createSensor(id, household_id);
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSensor = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const sensor = sensorService.updateSensor(id, updates);
    if (sensor) res.json(sensor);
    else res.status(404).json({ message: 'Sensor not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSensor = (req, res) => {
  try {
    const { id } = req.params;
    sensorService.deleteSensor(id);
    res.json({ message: 'Sensor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
