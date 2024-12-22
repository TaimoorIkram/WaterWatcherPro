const db = require('../config/db');
const { v4: uuid } = require('uuid');

exports.getAllUsers = () => db.get('User').value();

exports.createUser = (name, email, password) => {
  const newUser = { id: uuid(), name, email, password };
  db.get('User').push(newUser).write();
  return newUser;
};

exports.updateUser = (email, updates) => {
  const user = db.get('User').find({ email }).assign(updates).write();
  return user || null;
};

exports.deleteUser = email => db.get('User').remove({ email }).write();
