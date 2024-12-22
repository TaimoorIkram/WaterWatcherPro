const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/', authenticateToken,userController.getUsers);
router.post('/',authenticateToken, authenticateToken,userController.createUser);
router.put('/:email', authenticateToken,userController.updateUser);
router.delete('/:email', authenticateToken,userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
