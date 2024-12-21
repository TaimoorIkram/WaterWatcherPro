const sensorService = require('../services/sensorService');

exports.getSensors = (req, res) => {
  try {
    const sensors = sensorService.getAllSensors();
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addSensor = (req, res) => {
  try {
    const { sensorId, threshold } = req.body;
    if (!sensorId || threshold === undefined) {
      return res.status(400).json({ error: 'sensorId and threshold are required' });
    }
    const newSensor = sensorService.addSensor(sensorId, threshold);
    res.status(201).json(newSensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
