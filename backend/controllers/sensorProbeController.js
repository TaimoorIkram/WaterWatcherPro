const householdService = require('../services/sensorProbeService');

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
