const requestsService = require("../services/requestsService");
exports.activateDevice = (req, res) => {
  try {
    const { deviceId, secret, type } = req.body;

    let secretInt = 0;
    if (!isNaN(parseInt(secret))) {
      secretInt = parseInt(secret);
    } else {
      res.status(400).json({ message: "secret must be an integer" });
    }
    const intDeviceId = parseInt(deviceId)
    const nonce = Math.floor(Math.random() * 256);

    // Add nonce to the device activation data
    const sensor = requestsService.activateDevice({
      id: Math.floor(Math.random() * 10000),
      deviceId:intDeviceId,
      secret:secretInt,
      type,
      nonce,
      activated: false,
    });

    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllRequests = (req, res) => {
  try {
    const requests = requestsService.getAllRequests();
    res.status(201).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.verifyAndCreateDevice = (req, res) => {
    try {
        const { deviceId, key } = req.body;
        
        // Get the request
        const request = requestsService.getRequest(deviceId);
        
        if (!request) {
            return res.status(404).json({ error: "Device request not found" });
        }

        // Check if request is already approved
        if (request.activated) {
            return res.status(400).json({ error: "Device request already activated" });
        }

        // Calculate and verify key
        const expectedKey = request.nonce + request.secret;
        console.log('expectedKey:', expectedKey);
        console.log('key:', key);
        if (key != expectedKey) {
            return res.status(401).json({ error: "Invalid activation key" });
        }

        // Generate 8 digit auth token
        const authToken = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Create sensor in DB
        const sensor = {
            deviceId: request.deviceId,
            type: request.type,
            authToken,
            household_id: 1,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        requestsService.createSensor(sensor);
        requestsService.updateRequestStatus(deviceId);

        res.status(201).json({
            message: "Device verified and activated successfully",
            authToken
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  


exports.getDeviceNonce = (req, res) => {
  try {
    const { id } = req.params;

    // TODO: move to service
    const request = requestsService.getRequest(id);
    res.status(201).json(request.nonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


