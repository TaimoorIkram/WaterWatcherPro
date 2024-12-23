const readingService = require('../services/readingService');
const householdService = require('../services/sensorProbeService');

exports.getReadings = (req, res) => {
  try {
    const readings = readingService.getLatestReadings(100);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.postReading = (req, res) => {
  try {
    const { deviceId, value, token } = req.body;
    

    const isValidToken = readingService.verifyDeviceToken(deviceId, token);
    if (!isValidToken) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const newReading = readingService.addReading(deviceId, value);
    res.status(201).json(newReading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postActuatorReading = (req, res) => {
  try {
    const { deviceId, motor_status, token } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: "Device ID is required" });
    }
    

    const isValidToken = readingService.verifyDeviceToken(deviceId, token);
    if (!isValidToken) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const config = householdService.getHouseholdConfig(deviceId);
    console.log(config.sensor_id);
    if (config.sensor_id === null) {
      return res.status(404).json({ error: "Household configuration not found" });
    }
    const sensorData = householdService.getLatestSensorData(config.sensor_id);


    if (!config || !sensorData) {
      return res.status(404).json({ error: "Household configuration or sensor data not found" });
    }

    const action = householdService.evaluateAction(config, sensorData);

    // check what command to send, send command in response and store in db in actuator Data.
    const newReading = readingService.addActuatorReading(deviceId, motor_status,action.take_action);
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// publishData
// device id, auth token, value










// Controller to evaluate action for a given sensor
exports.evaluateAction = async (req, res) => {
  try {
    const { sensor_id } = req.body;

    if (!sensor_id) {
      return res.status(400).json({ error: "Sensor ID is required" });
    }

    // Fetch household configuration and sensor data
    const config = householdService.getHouseholdConfig(sensor_id);
    const sensorData = householdService.getLatestSensorData(sensor_id);
    console.log(config);
    console.log(sensorData);
    

    if (!config || !sensorData) {
      return res.status(404).json({ error: "Household configuration or sensor data not found" });
    }

    // Evaluate the action to take
    const result = householdService.evaluateAction(config, sensorData);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error evaluating action:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};






