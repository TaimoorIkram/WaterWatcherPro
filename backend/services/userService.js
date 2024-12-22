const db = require('../config/db');
const { v4: uuid } = require('uuid');

exports.getAllUsers = () => db.get('users').value();

exports.createUser = (name, email, password) => {
  const newUser = { id: uuid(), name, email, password };
  db.get('users').push(newUser).write();
  return newUser;
};

exports.updateUser = (email, updates) => {
  const user = db.get('users').find({ email }).assign(updates).write();
  return user || null;
};

exports.deleteUser = email => db.get('users').remove({ email }).write();

exports.getUserByEmail = email => {
  const user = db.get('User').find({ email }).value();
  return user;
};