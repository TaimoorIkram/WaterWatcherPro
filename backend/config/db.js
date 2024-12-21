const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../db.json');

if (!fs.existsSync(dbPath)) {
  console.log('Database file does not exist. Initializing with defaults...');
  fs.writeFileSync(dbPath, JSON.stringify({ sensors: [], users: [], readings: [] }, null, 2), 'utf-8');
} else {
  console.log('Database file already exists. Skipping initialization.');
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

module.exports = db;
