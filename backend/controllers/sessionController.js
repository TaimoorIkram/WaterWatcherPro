const sessionService = require('../services/sessionService');

exports.initializeSession = async (req, res) => {
  try {
    const { deviceId, encryptedMessage } = req.body;
    const response = await sessionService.initializeSession(deviceId, encryptedMessage);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.validateSession = async (req, res) => {
  try {
    const { deviceId, encryptedMessage } = req.body;
    const response = await sessionService.validateSession(deviceId, encryptedMessage);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
