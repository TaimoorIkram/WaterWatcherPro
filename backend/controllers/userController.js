const userService = require('../services/userService');

exports.getUsers = (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = userService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
