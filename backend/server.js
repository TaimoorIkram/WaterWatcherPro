const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');
const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/sensors', sensorRoutes);
app.use('/users', userRoutes);
app.use('/readings', readingRoutes);

const PORT = process.env.PORT || 3001;

// No need to initialize db here anymore since it's handled in config/db.js

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
