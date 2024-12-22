const db = require('./db');
const { faker } = require('@faker-js/faker');

// Helper function to generate random water readings
const generateRandomReading = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Helper function to generate random time in HH:mm:ss format
const generateRandomTime = () => {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Function to determine whether a given time falls within a time range
const isWithinTimeRange = (time, range) => {
  const [start, end] = range.split('-').map(h => parseInt(h, 10));
  const hour = parseInt(time.split(':')[0], 10);
  return hour >= start && hour < end;
};

// Function to create mock data for a specified number of users and populate the database
const generateMockData = (numUsers) => {
  let sensorIdCounter = 1; // Unique sensor ID for each household

  // Generate Users and Households
  for (let i = 0; i < numUsers; i++) {
    const userId = i + 1; // Use `userId` equal to `household.id`

    // Add user to the User table
    const user = {
      id: userId, // Ensure user_id matches household.id
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    db.get('User').push(user).write();

    // Create Household for each User
    const household = {
      id: userId, // Household ID matches user ID
      location: faker.address.city(),
      user_id: userId // Link household to user
    };
    db.get('Household').push(household).write();

    // Create HouseholdConfig
    const tankHeights = [1, 1.5, 2]; // meters
    const tankCapacities = [200, 300, 400]; // gallons
    const config = {
      household_id: household.id,
      tank_height: tankHeights[Math.floor(Math.random() * tankHeights.length)],
      tank_capacity: tankCapacities[Math.floor(Math.random() * tankCapacities.length)],
      peak_usage_hours: '15-16', // Example of peak usage range
      water_availability_hours: '5-7', // Example of water availability
      min_threshold_normal_hours: 0.15, // 15% threshold for normal hours
      min_threshold_peak_hours: 0.25  // 25% threshold for peak hours
    };
    db.get('HouseholdConfig').push(config).write();

    // Assign a unique sensor to the Household
    const sensor = { id: sensorIdCounter++, household_id: household.id };
    db.get('Sensor').push(sensor).write();

    // Generate SensorData for the first 6 months
    const months = [1, 2, 3, 4, 5, 6]; // Numeric months (1 to 6)
    months.forEach(month => {
      for (let day = 1; day <= 30; day++) { // Generate for 30 days each month
        const sensorData = [];
        let motorOnCount = 0;
        const totalReadings = 3;
        const targetMotorOn = Math.ceil(totalReadings * 0.1); // 10% motor on

        for (let i = 0; i < totalReadings; i++) {
          const time = generateRandomTime();
          const isPeak = isWithinTimeRange(time, config.peak_usage_hours);
          const threshold = isPeak ? config.min_threshold_peak_hours : config.min_threshold_normal_hours;

          // Determine water level
          let waterLevel = generateRandomReading(
            config.tank_height * threshold - 0.1,
            config.tank_height * threshold + 0.1
          );

          let motorPowerState = false;

          // Force motor on for some cases
          if (motorOnCount < targetMotorOn && Math.random() < 0.5) {
            waterLevel = generateRandomReading(0, config.tank_height * threshold - 0.1);
            motorPowerState = true;
            motorOnCount++;
          }

          sensorData.push({
            time,
            water_level: parseFloat(waterLevel.toFixed(2)),
            motor_power_state: motorPowerState,
            day,
            month,
            year: 2024,
            sensor_id: sensor.id // Unique sensor ID for this household
          });
        }
        db.get('SensorData').push(...sensorData).write();
      }
    });
  }

  console.log(`Mock data generated for ${numUsers} users and 6 months!`);
};

// Run the function with a specified number of users (e.g., 5 users)
const numUsers = process.argv[2] ? parseInt(process.argv[2], 10) : 3; // Default to 3 if no argument is passed
generateMockData(numUsers);
