const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const fs = require("fs");

// Set the correct path to db.json
const dbPath = path.join(__dirname, "db.json");

// Initialize the database file only once
if (!fs.existsSync(dbPath)) {
  console.log("Database file does not exist. Initializing with defaults...");
  const initialData = {
    User: [
      { id: 3, name: "admin", email: "admin@gmail.com", password: "admin", roleId: 2},
      { id: 4, name: "user", email: "user@gmail.com", password: "user", roleId: 3}
    ],
    Roles: [
      { id: 1, name: "super_admin" },
      { id: 2, name: "admin" },
      { id: 3, name: "customer" },
      { id: 4, name: "technician" }
    ],
    Requests: [
      {
        id: 1842,
        deviceId: 123,
        secret: 1,
        type: "SENSOR",
        nonce: 0,
        activated: true
      }
    ],
    Devices: [
      {
        deviceId: 123,
        type: "SENSOR",
        authToken: "73868942",
        household_id: 1,
        status: "active",
        createdAt: "2024-12-24T13:19:03.316Z",
        secret: 123,
        num3: null,
        num4: null,
        Skey: null,
        Dkey: null,
        sessionKey: null
      }
    ],
    SensorData: [
      { deviceId: 123, water_level: 20, createdAt: "2024-12-24T13:19:03.316Z" },
      { deviceId: 123, water_level: 30, createdAt: "2024-12-24T13:20:03.316Z" },
      { deviceId: 123, water_level: 40, createdAt: "2024-12-24T13:21:03.316Z" }
    ],
    Nonces: [],
    RequestNonce: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");
} else {
  console.log("Database file already exists. Skipping initialization.");
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

// Ensure the database structure is updated even if the database already exists
db.defaults({
  User: [],
  Roles: [],
  Requests: [],
  Devices: [],
  SensorData: [],
  Nounces: [],
  RequestNonce: []
}).write();

module.exports = db;
