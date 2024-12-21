const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const cors = require('cors'); 

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize LowDB
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default data structure
db.defaults({
  sensors: [],
  actuatorMappings: [],
  readings: []
}).write();

// API Endpoints

// Get all sensors
app.get('/sensors', (req, res) => {
  const sensors = db.get('sensors').value();
  res.json(sensors);
});

// Get all mappings
app.get('/mappings', (req, res) => {
  const sensors = db.get('actuatorMappings').value();
  res.json(sensors);
});

// Get all sensor readings (latest 100)
app.get('/readings', (req, res) => {
  const readings = db.get('readings')
    .takeRight(100)
    .value();
  res.json(readings);
});

// Get readings for specific sensor (latest 50)
app.get('/readings/:sensorId', (req, res) => {
  const readings = db.get('readings')
    .filter({ sensorId: req.params.sensorId })
    .takeRight(50)
    .value();
  res.json(readings);
});

// Get analytics
app.get('/analytics', (req, res) => {
  const readings = db.get('readings').value();
  const analytics = {};

  readings.forEach(reading => {
    if (!analytics[reading.sensorId]) {
      analytics[reading.sensorId] = {
        totalReadings: 0,
        avgLevel: 0,
        maxLevel: -Infinity,
        actionsTaken: 0,
        totalLevel: 0
      };
    }

    const stats = analytics[reading.sensorId];
    stats.totalReadings++;
    stats.totalLevel += reading.waterLevel;
    stats.maxLevel = Math.max(stats.maxLevel, reading.waterLevel);
    if (reading.actionTaken) stats.actionsTaken++;
  });

  Object.values(analytics).forEach(stats => {
    stats.avgLevel = stats.totalLevel / stats.totalReadings;
    delete stats.totalLevel;
  });

  res.json(analytics);
});

// Add sensor
// app.post('/sensors', (req, res) => {
//   try {
//     const { sensorId, threshold } = req.body;
    
//     if (!sensorId || threshold === undefined) {
//       return res.status(400).json({ error: 'sensorId and threshold are required' });
//     }

//     const existingSensor = db.get('sensors')
//       .find({ sensorId })
//       .value();

//     if (existingSensor) {
//       return res.status(409).json({ error: 'Sensor already exists' });
//     }

//     db.get('sensors')
//       .push({ sensorId, threshold })
//       .write();

//     res.status(201).json({ message: 'Sensor added', sensorId, threshold });
//   } catch (error) {
//     console.error('Error adding sensor:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Add actuator mapping
app.post('/mappings', (req, res) => {
  try {
    const { sensorId, actuatorId } = req.body;
    
    if (!sensorId || !actuatorId) {
      return res.status(400).json({ error: 'sensorId and actuatorId are required' });
    }

    const existingMapping = db.get('actuatorMappings')
      .find({ sensorId, actuatorId })
      .value();

    if (existingMapping) {
      return res.status(409).json({ error: 'Mapping already exists' });
    }

    db.get('actuatorMappings')
      .push({ sensorId, actuatorId })
      .write();

    res.status(201).json({ message: 'Mapping added', sensorId, actuatorId });
  } catch (error) {
    console.error('Error adding mapping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const generateReading = (sensorId, threshold) => {
  // Generate a water level that occasionally goes above threshold
  const baseLevel = threshold * 0.8; // Base level at 80% of threshold
  const variation = threshold * 0.4; // Variation of ±40% of threshold
  const waterLevel = baseLevel + (Math.random() - 0.5) * variation;
  
  return {
    sensorId,
    waterLevel: parseFloat(waterLevel.toFixed(1)),
    timestamp: new Date().toISOString(),
    actionTaken: waterLevel > threshold
  };
};

// Add this after your server initialization
const startDataGeneration = () => {
  // Get all sensors
  const sensors = db.get('sensors').value();
  
  setInterval(() => {
    sensors.forEach(sensor => {
      // Generate and add new reading
      const reading = generateReading(sensor.sensorId, sensor.threshold);
      
      db.get('readings')
        .push(reading)
        .write();
        
      // Keep only latest 1000 readings
      const allReadings = db.get('readings').value();
      if (allReadings.length > 1000) {
        db.set('readings', allReadings.slice(-1000)).write();
      }
    });
    
    console.log('Generated new readings:', new Date().toLocaleTimeString());
  }, 10000); // Every 60 seconds
};

// Add reading
app.post('/readings', (req, res) => {
  try {
    const { sensorId, waterLevel } = req.body;
    
    if (!sensorId || waterLevel === undefined) {
      return res.status(400).json({ error: 'sensorId and waterLevel are required' });
    }

    const reading = {
      sensorId,
      waterLevel: parseFloat(waterLevel),
      timestamp: new Date().toISOString(),
      actionTaken: false
    };

    // Check if water level exceeds threshold
    const sensor = db.get('sensors')
      .find({ sensorId })
      .value();

    if (sensor && waterLevel > sensor.threshold) {
      reading.actionTaken = true;
    }

    db.get('readings')
      .push(reading)
      .write();

    res.status(201).json(reading);
  } catch (error) {
    console.error('Error adding reading:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------
// Users Endpoints
// ---------------------------------------------------

// Create User
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = { userId: uuid(), name, email, password };
  db.data.users.push(newUser);
  await db.write();
  res.status(201).json(newUser);
});

// Read Users
app.get('/users', (req, res) => {
  res.json(db.data.users);
});

// Update User
app.put('/users/:id', async (req, res) => {
  const user = db.data.users.find((u) => u.userId === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  await db.write();
  res.json(user);
});

// Delete User
app.delete('/users/:id', async (req, res) => {
  db.data.users = db.data.users.filter((u) => u.userId !== req.params.id);
  await db.write();
  res.status(204).send();
});

// ---------------------------------------------------
// Sensors Endpoints
// ---------------------------------------------------

// Create Sensor
app.post('/sensors', async (req, res) => {
  const { userId } = req.body;
  const newSensor = { sensorId: uuid(), userId };
  db.data.sensors.push(newSensor);
  await db.write();
  res.status(201).json(newSensor);
});

// Read Sensors
app.get('/sensors', (req, res) => {
  res.json(db.data.sensors);
});

// Update Sensor
app.put('/sensors/:id', async (req, res) => {
  const sensor = db.data.sensors.find((s) => s.sensorId === req.params.id);
  if (!sensor) return res.status(404).json({ error: 'Sensor not found' });
  Object.assign(sensor, req.body);
  await db.write();
  res.json(sensor);
});

// Delete Sensor
app.delete('/sensors/:id', async (req, res) => {
  db.data.sensors = db.data.sensors.filter((s) => s.sensorId !== req.params.id);
  await db.write();
  res.status(204).send();
});

// ---------------------------------------------------
// Sensor Data Endpoints
// ---------------------------------------------------

// Create Sensor Data
app.post('/sensor-data', async (req, res) => {
  const { sensorId, waterLevel } = req.body;
  const newData = { dataId: uuid(), sensorId, waterLevel, timestamp: new Date().toISOString() };
  db.data.sensorData.push(newData);
  await db.write();
  res.status(201).json(newData);
});

// Read Sensor Data
app.get('/sensor-data', (req, res) => {
  res.json(db.data.sensorData);
});

// Update Sensor Data
app.put('/sensor-data/:id', async (req, res) => {
  const data = db.data.sensorData.find((d) => d.dataId === req.params.id);
  if (!data) return res.status(404).json({ error: 'Data not found' });
  Object.assign(data, req.body);
  await db.write();
  res.json(data);
});

// Delete Sensor Data
app.delete('/sensor-data/:id', async (req, res) => {
  db.data.sensorData = db.data.sensorData.filter((d) => d.dataId !== req.params.id);
  await db.write();
  res.status(204).send();
});

// ---------------------------------------------------
// User Config Endpoints
// ---------------------------------------------------

// Create Configuration
app.post('/user-configurations', async (req, res) => {
  const { userId, peakLowThreshold, normalLowThreshold, highThreshold, peakHours, waterSupplyHours } = req.body;
  const newConfig = { configId: uuid(), userId, peakLowThreshold, normalLowThreshold, highThreshold, peakHours, waterSupplyHours };
  db.data.userConfigurations.push(newConfig);
  await db.write();
  res.status(201).json(newConfig);
});

// Read Configurations
app.get('/user-configurations', (req, res) => {
  res.json(db.data.userConfigurations);
});

// Update Configuration
app.put('/user-configurations/:id', async (req, res) => {
  const config = db.data.userConfigurations.find((c) => c.configId === req.params.id);
  if (!config) return res.status(404).json({ error: 'Configuration not found' });
  Object.assign(config, req.body);
  await db.write();
  res.json(config);
});

// Delete Configuration
app.delete('/user-configurations/:id', async (req, res) => {
  db.data.userConfigurations = db.data.userConfigurations.filter((c) => c.configId !== req.params.id);
  await db.write();
  res.status(204).send();
});

// ---------------------------------------------------
// Motor State Endpoints
// ---------------------------------------------------

// Create Motor State
app.post('/motor-state', async (req, res) => {
  const { sensorId, motorState } = req.body;
  const newMotorState = { motorId: uuid(), sensorId, motorState, timestamp: new Date().toISOString() };
  db.data.motorState.push(newMotorState);
  await db.write();
  res.status(201).json(newMotorState);
});

// Read Motor States
app.get('/motor-state', (req, res) => {
  res.json(db.data.motorState);
});

// Update Motor State
app.put('/motor-state/:id', async (req, res) => {
  const motor = db.data.motorState.find((m) => m.motorId === req.params.id);
  if (!motor) return res.status(404).json({ error: 'Motor state not found' });
  Object.assign(motor, req.body);
  await db.write();
  res.json(motor);
});

// Delete Motor State
app.delete('/motor-state/:id', async (req, res) => {
  db.data.motorState = db.data.motorState.filter((m) => m.motorId !== req.params.id);
  await db.write();
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startDataGeneration(); 
});