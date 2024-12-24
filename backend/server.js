const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const userAnalyticsRoutes = require('./routes/userAnalyticsRoutes');
const communityAnalyticsRoutes = require('./routes/communityAnalyticsRoutes');
const householdConfigRoutes = require('./routes/householdConfigRoutes');
const householdRoutes = require('./routes/householdRoutes');
const sensorProbeRoutes = require('./routes/sensorProbeRouters');
const requestRoutes = require('./routes/requests.routes');
const routerConfigRoutes = require('./routes/routerConfigRoutes');
const sensorService = require('./services/sensorService');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'iot-jsonwebtoken';

const mqtt = require('mqtt');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// MQTT Client Setup
const mqttOptions = {
  host: '10.7.233.71',       // MQTT Broker IP
  port: 1883,                // Default MQTT port
  username: 'server',        // MQTT username
  password: 'server123',     // MQTT password
  clean: true,               // Clean session
  connectTimeout: 4000,      // Connection timeout in ms
  reconnectPeriod: 4000,     // Reconnection period in ms
};

// Construct MQTT Broker URL
const mqttBrokerUrl = `mqtt://${mqttOptions.host}:${mqttOptions.port}`;

// Initialize MQTT client
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Handle MQTT Events
mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');

  // Subscribe to the "dev/waterlevel" topic
  mqttClient.subscribe('dev/waterlevel', (err) => {
    if (!err) {
      console.log('Subscribed to dev/waterlevel');
    } else {
      console.error('Error subscribing to dev/waterlevel:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  // Handle incoming messages
  if (topic === 'dev/waterlevel') {
    const waterLevelData = message.toString(); // Decode message as string
    message = JSON.parse(message.toString())
    return sensorService.handleSensorData(message)
  }
  else{
    console.log(topic)
    console.log(message.toString())
  }
});

// Error handling
mqttClient.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

// Reconnection handling
mqttClient.on('reconnect', () => {
  console.log('Reconnecting to MQTT Broker...');
});


mqttClient.on('error', (error) => {
    console.error('MQTT Client Error:', error);
});

// Function to Publish MQTT Messages
const publishMessage = (topic, payload) => {
    mqttClient.publish(topic, JSON.stringify(payload), (err) => {
        if (err) {

        } else {

        }
    });
};

// Example Route to Publish Messages
app.post('/publish', (req, res) =>     {
    const { topic, message } = req.body;
    publishMessage(topic, message)     ;
    res.status(200).send('Message published');
});


// Routes
app.use('/sensors', sensorRoutes);
app.use('/devices', deviceRoutes);
app.use('/users', userRoutes);
app.use('/configs', householdConfigRoutes);
app.use('/households', householdRoutes);
app.use('/readings', readingRoutes);
app.use('/eval', sensorProbeRoutes);
app.use('/routerconfigs', routerConfigRoutes);
app.use('/api/user/analytics', userAnalyticsRoutes);
app.use('/api/community/analytics', communityAnalyticsRoutes);
app.use('/requests', requestRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
