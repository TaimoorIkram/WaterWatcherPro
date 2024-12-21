const db = require('../config/db');
const { v4: uuid } = require('uuid');

exports.createUser = (name, email, password) => {
  const newUser = { userId: uuid(), name, email, password };
  db.get('users').push(newUser).write();
  return newUser;
};

exports.getAllUsers = () => db.get('users').value();
