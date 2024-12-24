const express = require('express');
const authenticateToken = require('../middlewares/jwt.middleware');
const requestsController = require('../controllers/requests.controller');

const router = express.Router();

//TODO: only allow admin or technician to activate device - also move to a separate route
router.get('/', requestsController.getAllRequests);
router.post('/activate-device', requestsController.activateDevice);

// used by esp32
router.get('/device-nonce/:id', requestsController.getDeviceNonce);
router.post('/verify', requestsController.verifyAndCreateDevice);
router.get('/mqtt-creds', requestsController.getMQTTCreds);

module.exports = router;

// post: create device
// int: nonce + secret
// device Id: 
// if correct. I give 8 digit auth token
// store in sensors inside db



// publishData
// device id, auth token, value