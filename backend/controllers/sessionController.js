const sessionService = require('../services/sessionService');

exports.initializeSession = async (req, res) => {
  try {
    const { deviceId, encryptedMessage } = req.body;
    const response = await sessionService.initializeSession(deviceId, encryptedMessage);

    if (response.error_code) {
      return res.status(response.error_code).json({ error: response.error });
    }
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.validateSession = async (req, res) => {
  try {
    const { deviceId, encryptedMessage } = req.body;
    const response = await sessionService.validateSession(deviceId, encryptedMessage);
    
    if (response.error_code) {
      return res.status(response.error_code).json({ error: response.error });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};