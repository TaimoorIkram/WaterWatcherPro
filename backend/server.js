const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');
const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const userAnalyticsRoutes = require('./routes/userAnalyticsRoutes');
const communityAnalyticsRoutes = require('./routes/communityAnalyticsRoutes');
const householdConfigRoutes = require('./routes/householdConfigRoutes');
const householdRoutes = require('./routes/householdRoutes');
const sensorProbeRoutes = require('./routes/sensorProbeRouters');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'iot-jsonwebtoken';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/sensors', sensorRoutes);
app.use('/users', userRoutes);
app.use('/configs', householdConfigRoutes);
app.use('/households', householdRoutes);
app.use('/readings', readingRoutes);
app.use('/eval', sensorProbeRoutes);
app.use('/api/user/analytics', userAnalyticsRoutes);
app.use('/api/community/analytics', communityAnalyticsRoutes);

const PORT = process.env.PORT || 3001;
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiSnVzdGljZS5MZWZmbGVyMzlAeWFob28uY29tIiwicm9sZUlkIjo0LCJpYXQiOjE3MzQ4OTkzODEsImV4cCI6MTczNDk4NTc4MX0.jffzIva7wn8AhTgXr1idmctTOIGk_M52HWYsikcu3nw';
app.listen(PORT, () => {
 console.log(jwt.decode(token))
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
