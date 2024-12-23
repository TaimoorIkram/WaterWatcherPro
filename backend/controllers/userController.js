const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { v4: uuid } = require('uuid');

exports.getUsers = (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTechnicians = (req, res) => {
  try {
    const users = userService.getAllUsers();
    const technicians = users.filter(user => user.roleId === 4); // Filter to get only technicians
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    
    const existingUser = db.get('User').find({ email }).value();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { 
      id: uuid(), 
      name, 
      email, 
      password,
      roleId 
    };

    db.get('User').push(newUser).write();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roleId: newUser.roleId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.createSuperAdmin = async (req, res) => {
  req.body.roleId = 1;
  return exports.createUser(req, res);
};

exports.createAdmin = async (req, res) => {
  req.body.roleId = 2;
  return exports.createUser(req, res);
};

exports.createCustomer = async (req, res) => {
  req.body.roleId = 3;
  return exports.createUser(req, res);
};

exports.createTechnician = async (req, res) => {
  req.body.roleId = 4;
  return exports.createUser(req, res);
};

exports.updateUser = (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;
    const user = userService.updateUser(email, updates);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const { email } = req.params;
    userService.deleteUser(email);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const JWT_SECRET_KEY = 'iot-jsonwebtoken';
  const { email, password } = req.body;
  
  const user = userService.getUserByEmail(email);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  if (user.password !== password) { 
    return res.status(401).json({ message: 'Invalid credentials' });
  }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        roleId:user.roleId
      },
      JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );
  
  
  res.json({ 
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId:user.roleId
    }
  });
};

