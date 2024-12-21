const express = require('express');
const readingController = require('../controllers/readingController');

const router = express.Router();

router.get('/', readingController.getReadings);
router.post('/', readingController.addReading);

module.exports = router;
