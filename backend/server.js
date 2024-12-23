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
const requestRoutes = require('./routes/requests.routes');
const path = require('path');
const fs = require('fs');

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
app.use('/requests', requestRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
