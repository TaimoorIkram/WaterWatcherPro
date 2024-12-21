const readingService = require('../services/readingService');

exports.getReadings = (req, res) => {
  try {
    const readings = readingService.getLatestReadings(100);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addReading = (req, res) => {
  try {
    const { sensorId, waterLevel } = req.body;
    const newReading = readingService.addReading(sensorId, waterLevel);
    res.status(201).json(newReading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
