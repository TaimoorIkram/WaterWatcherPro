const db = require('../config/db');

exports.getAllData = (id) => {
  const numericId = parseInt(id, 10); // Convert id to a number

  const data = db.get('SensorData')
                 .filter({ deviceId: numericId })
                 .orderBy('createdAt', 'desc') // Sort by createdAt in descending order
                 .value();
  return data;
};


exports.getAllDevices = () => {
  return db.get('Devices')
    .map(device => ({
      id: device.deviceId,
      ...device // Include other device properties
    }))
    .value();
};
