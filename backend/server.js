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

const PORT = process.env.PORT || 3000;


// Initialize the database file only once
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  const initialData = {
    sensors: [],
    users: [],
    readings: [],
  };

  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('Database initialized with initial data.');
} else {
  console.log('Database already exists. Skipping initialization.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;