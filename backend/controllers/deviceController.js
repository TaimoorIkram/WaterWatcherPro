const deviceService = require('../services/deviceService');

exports.getDeviceData = (req, res) => {
  try {
    const { id } = req.params;
    const deviceData = deviceService.getAllData(id);
    res.json(deviceData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllDevices = (req, res) => {
  try {
    const devices = deviceService.getAllDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
