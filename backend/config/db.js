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
    Requests:[],
    RequestNonce:[],
    Devices: [],
    SensorData: [],
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");
} else {
  console.log("Database file already exists. Skipping initialization.");
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

module.exports = db;
