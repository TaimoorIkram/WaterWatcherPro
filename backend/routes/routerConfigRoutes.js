const express = require("express");
const router = express.Router();
const {
  getRouterConfig,
  createRouterConfig,
  updateRouterConfig,
  deleteRouterConfig,
} = require("../controllers/routerConfigController");

// Get a router config by sensor ID
router.get("/:sensor_id", getRouterConfig);

// Create a new router config
router.post("/", createRouterConfig);

// Update an existing router config by sensor ID
router.put("/:sensor_id", updateRouterConfig);

// Delete a router config by sensor ID
router.delete("/:sensor_id", deleteRouterConfig);

module.exports = router;
