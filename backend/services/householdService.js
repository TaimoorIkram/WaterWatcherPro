const db = require('../config/db');

// Load the latest id from the database
let currentId = db.get('currentId').value() || 1; // Default to 1 if not available

// Get all households
exports.getAllHouseholds = () => db.get('Household').value();

// Get households by user_id
exports.getHouseholdsByUserId = (user_id) => {
  return db.get('Household').filter({ user_id }).value(); // Filter by user_id
};

// Create a new household with a unique integer ID
exports.createHousehold = (location, user_id) => {
  const newHousehold = {
    id: currentId++,    // Increment currentId for a new ID
    location: location, // Ensure location is correctly assigned
    user_id: user_id    // Ensure user_id is correctly assigned
  };
  
  db.get('Household').push(newHousehold).write();
  db.set('currentId', currentId).write(); // Save the updated currentId to the db
  return newHousehold;
};

// Update an existing household by ID
exports.updateHousehold = (id, updates) => {
  const household = db.get('Household').find({ id }).assign(updates).write();
  return household || null;
};

// Delete a household by ID
exports.deleteHousehold = id => db.get('Household').remove({ id }).write();
