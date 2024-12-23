const express = require('express');
const authenticateToken = require('../middlewares/jwt.middleware');
const requestsController = require('../controllers/requests.controller');

const router = express.Router();

//TODO: only allow admin or technician to activate device - also move to a separate route
router.post('/activate-device', authenticateToken, requestsController.activateDevice);
router.get('/device-nonce/:id', authenticateToken, requestsController.getDeviceNonce);
router.post('/verify', requestsController.verifyAndCreateDevice);

module.exports = router;

// post: create device
// int: nonce + secret
// device Id: 
// if correct. I give 8 digit auth token
// store in sensors inside db



// publishData
// device id, auth token, value