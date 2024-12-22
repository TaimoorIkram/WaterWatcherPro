const {
    fetchRouterConfig,
    saveRouterConfig,
    modifyRouterConfig,
    removeRouterConfig,
  } = require("../services/routerConfigService");
  
  // Get router configuration by sensor ID
  exports.getRouterConfig = (req, res) => {
    const { sensor_id } = req.params;
    const config = fetchRouterConfig(parseInt(sensor_id));
    if (config) {
      res.status(200).json(config);
    } else {
      res.status(404).json({ message: "Router configuration not found." });
    }
  };
  
  // Create a new router configuration
  exports.createRouterConfig = (req, res) => {
    const newConfig = req.body;
    const result = saveRouterConfig(newConfig);
    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(400).json({ message: result.message });
    }
  };
  
  // Update an existing router configuration
  exports.updateRouterConfig = (req, res) => {
    const { sensor_id } = req.params;
    const updatedData = req.body;
    const result = modifyRouterConfig(parseInt(sensor_id), updatedData);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: result.message });
    }
  };
  
  // Delete a router configuration
  exports.deleteRouterConfig = (req, res) => {
    const { sensor_id } = req.params;
    const result = removeRouterConfig(parseInt(sensor_id));
    if (result.success) {
      res.status(200).json({ message: "Router configuration deleted." });
    } else {
      res.status(404).json({ message: result.message });
    }
  };
  