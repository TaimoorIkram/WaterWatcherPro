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
  const roles = [
    { id: 1, name: "super_admin" },
    { id: 2, name: "admin" },
    { id: 3, name: "customer" },
    { id: 4, name: "technician" }
  ];

  // Generate Users and Households
  for (let i = 2; i < numUsers + 2; i++) {
    const userId = i + 1; // Use `userId` equal to `household.id` and `sensor.id`

    let roleId;
    if (i === 2) {
      roleId = 1; // First user is super admin
    } else if (i === 3) {
      roleId = 4; // Second user is technician
    } else {
      roleId = 3; // Rest are customers
    }

    // Add user to the User table
    const user = {
      id: userId, // Ensure user_id matches household.id and sensor.id
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roleId: roleId // Add roleId to user
    };
    db.get('User').push(user).write();

    // Create Household for each User
    const household = {
      id: userId, // Household ID matches user ID and sensor ID
      location: faker.location.city(), // Updated to faker.location
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
    const sensor = { id: userId, household_id: household.id }; // Sensor ID matches household ID
    db.get('Sensor').push(sensor).write();

    // Generate SensorData for all months
    const months = Array.from({ length: 12 }, (_, index) => index + 1); // All 12 months

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    months.forEach(month => {
      const daysInMonth = month === currentMonth ? currentDay : 30; // Up to current date if current month, otherwise 30 days

      for (let day = 1; day <= daysInMonth; day++) {
        const sensorData = [];
        let motorOnCount = 0;
        const totalReadings = 3;
        const targetMotorOn = Math.ceil(totalReadings * 0.1); // 10% motor on

        for (let j = 0; j < totalReadings; j++) {
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
            year: currentDate.getFullYear(),
            sensor_id: sensor.id // Sensor ID matches household ID
          });
        }
        db.get('SensorData').push(...sensorData).write();
      }
    });
  }

  console.log(`Mock data generated for ${numUsers} users and all months!`);
};

// Run the function with a specified number of users (e.g., 5 users)
const numUsers = process.argv[2] ? parseInt(process.argv[2], 10) : 3; // Default to 3 if no argument is passed
generateMockData(numUsers);
