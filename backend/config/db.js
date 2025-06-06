const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

// Set the correct path to db.json
const dbPath = path.join(__dirname, 'db.json');

// Initialize the database file only once
if (!fs.existsSync(dbPath)) {
  console.log('Database file does not exist. Initializing with defaults...');
  const initialData = {
    Household: [],
    User: [],
    Sensor: [],
    HouseholdConfig: [
      {
        "id": 1,
        "household_id": 1,
        "user_id": "5dd82a87-ad2e-42ce-8218-86f9313ef009",
        "tank_height": 2,
        "tank_capacity": 400,
        "peak_usage_hours": "12-13",
        "water_availability_hours": "12-20",
        "min_threshold_normal_hours": 20,
        "min_threshold_peak_hours": 10,
        "max_threshold_normal_hours": 100,
        "max_threshold_peak_hours": 7,
        "sensor_id": 1,
        "actuator_id": 2
      }
    ],
    SensorData: [],
    Roles: [
      { id: 1, name: "super_admin" },
      { id: 2, name: "admin" },
      { id: 3, name: "customer" },
      { id: 4, name: "technician" }
    ],
    Requests:[],
    Devices: [],
    ActuatorData:[],

  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
} else {
  console.log('Database file already exists. Skipping initialization.');
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

module.exports = db;
