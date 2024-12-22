const db = require('../config/db');

exports.getAllHouseholds = () => db.get('households').value();

exports.createHousehold = (id, location, user_id) => {
  const newHousehold = { id, location, user_id };
  db.get('households').push(newHousehold).write();
  return newHousehold;
};

exports.updateHousehold = (id, updates) => {
  const household = db.get('households').find({ id }).assign(updates).write();
  return household || null;
};

exports.deleteHousehold = id => db.get('households').remove({ id }).write();
