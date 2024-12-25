const express = require('express');
const { initializeSession, validateSession } = require('../controllers/sessionController');
const router = express.Router();

// Route to initialize session and exchange numbers
router.post('/init', initializeSession);

// Route to validate and respond
router.post('/validate', validateSession);

module.exports = router;
