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
const routerConfigRoutes = require('./routes/routerConfigRoutes');
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
  host: 'mqtt.preprod.retailos.cowlar.com',
  port: 443,
  username: 'cdspreprodecommerce',
  password: 'fnc9CWKcHy1ss02'    ,
  endpoint: "/mqtt",
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  ssl: true,
};

const protocol = mqttOptions.ssl ? 'wss' : 'ws';
const mqttBrokerUrl = `${protocol}://${mqttOptions.host}:${mqttOptions.port}${mqttOptions.endpoint}`;
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Handle MQTT Events
mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');

    // Subscribe to topics
    mqttClient.subscribe('sensors/data/AR', (err) => {
        if (!err) {
            console.log('Subscribed to sensors/data/AR');
        } else {
            console.error('Error subscribing to sensors/data:', err);
        }
    });

    mqttClient.subscribe('alerts/notifications', (err) => {
        if (!err) {
            console.log('Subscribed to alerts/notifications');
        } else {
            console.error('Error subscribing to alerts/notifications:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    // Handle incoming messages here based on the topic
    if (topic === 'sensors/data/AR') {
        // Process sensor data
        const sensorData = JSON.parse(message.toString());
        console.log('Received sensor data:', sensorData);
        // TODO: save to db and perform actions based on sensor data
    }

    if (topic === 'alerts/notifications') {
        // Process alert notifications
        console.log('Received alert notification:', message.toString());
    }
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
