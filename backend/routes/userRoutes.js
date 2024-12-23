const express = require('express');
const userController = require('../controllers/userController');
const authorizeRoles = require('../middlewares/rbac.middleware');

const router = express.Router();


// todo: move to shared file
const SUPER_ADMIN = 1;
const ADMIN = 2;
const CUSTOMER = 3;
const TECHNICIAN = 4;


router.get('/', authorizeRoles(SUPER_ADMIN, ADMIN), userController.getUsers);
router.get('/technicians', authorizeRoles(SUPER_ADMIN, ADMIN), userController.getTechnicians);
router.post('/super-admin', authorizeRoles(SUPER_ADMIN), userController.createSuperAdmin);
router.post('/admin', authorizeRoles(SUPER_ADMIN), userController.createAdmin);
router.post('/customer', authorizeRoles(SUPER_ADMIN, ADMIN), userController.createCustomer);
router.post('/technician', authorizeRoles(SUPER_ADMIN, ADMIN), userController.createTechnician);
router.put('/:email', authorizeRoles(SUPER_ADMIN, ADMIN), userController.updateUser);
router.delete('/:email', authorizeRoles(SUPER_ADMIN), userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
