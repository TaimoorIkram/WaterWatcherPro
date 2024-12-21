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
    HouseholdConfig: [],
    SensorData: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
} else {
  console.log('Database file already exists. Skipping initialization.');
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

module.exports = db;
