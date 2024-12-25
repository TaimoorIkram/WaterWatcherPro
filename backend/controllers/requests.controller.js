const requestsService = require("../services/requestsService");

const SBOX = [0x9, 0x4, 0xA, 0xB, 0xD, 0x1, 0x8, 0x5, 0x6, 0x2, 0x0, 0x3, 0xC, 0xE, 0xF, 0x7];
const INV_SBOX = [0xA, 0x5, 0x9, 0xB, 0x1, 0x7, 0x8, 0xF, 0x6, 0x0, 0x2, 0x3, 0xC, 0x4, 0xD, 0xE];

const saesEncrypt = (plaintext, key) => {
  // Convert plaintext to uint8 if it's a string
  const input = typeof plaintext === 'string' ? plaintext.charCodeAt(0) : plaintext;
  // Ensure key is uint8
  const k = key & 0xFF;
  
  let state = input & 0xFF; // Ensure 8-bit value
  state ^= k;
  state = (SBOX[(state >> 4) & 0x0F] << 4) | SBOX[state & 0x0F];
  state ^= k;
  return state & 0xFF;
};

const saesDecrypt = (ciphertext, key) => {
  // Convert ciphertext to uint8 if it's a string
  const input = typeof ciphertext === 'string' ? ciphertext.charCodeAt(0) : ciphertext;
  // Ensure key is uint8
  const k = key & 0xFF;
  
  let state = input & 0xFF; // Ensure 8-bit value
  state ^= k;
  state = (INV_SBOX[(state >> 4) & 0x0F] << 4) | INV_SBOX[state & 0x0F];
  state ^= k;
  return state & 0xFF;
};

const toHexString = (input) => {
  let hexString = '';
  for (let i = 0; i < input.length; i++) {
    let hex = input.charCodeAt(i).toString(16).toUpperCase();
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    hexString += hex;
  }
  return hexString;
};

const fromHexString = (hexString) => {
  let result = '';
  for (let i = 0; i < hexString.length; i += 2) {
    let byteString = hexString.substring(i, i + 2);
    let byte = parseInt(byteString, 16);
    result += String.fromCharCode(byte);
  }
  return result;
};

exports.activateDevice = (req, res) => {
  try {
    const { deviceId, secret, type } = req.body;

    let secretInt = 0;
    if (!isNaN(parseInt(secret))) {
      secretInt = parseInt(secret);
    } else {
      res.status(400).json({ message: "secret must be an integer" });
    }
    const intDeviceId = parseInt(deviceId);
    const nonce = Math.floor(Math.random() * 256);

    // Add nonce to the device activation data
    const sensor = requestsService.activateDevice({
      id: Math.floor(Math.random() * 10000),
      deviceId: intDeviceId,
      secret: secretInt,
      type,
      nonce,
      activated: false,
    });

    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRequests = (req, res) => {
  try {
    const requests = requestsService.getAllRequests();
    res.status(201).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyAndCreateDevice = (req, res) => {
  try {
    const { deviceId, key } = req.body;

    // Get the request
    const request = requestsService.getRequest(deviceId);

    if (!request) {
      return res.status(404).json({ error: "Device request not found" });
    }

    // Check if request is already approved
    if (request.activated) {
      return res.status(400).json({ error: "Device request already activated" });
    }

    // Calculate and verify key
    const expectedKey = request.nonce + request.secret;
    console.log('expectedKey:', expectedKey);
    console.log('key:', key);
    if (key != expectedKey) {
      return res.status(401).json({ error: "Invalid activation key" });
    }

    // Generate 8 digit auth token
    const authToken = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Create sensor in DB
    const sensor = {
      deviceId: request.deviceId,
      type: request.type,
      authToken,
      household_id: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      secret: request.secret,
      num3: null, 
      num4: null,
      Skey: null,
      Dkey: null,
      sessionKey: null
    };

    requestsService.createSensor(sensor);
    const nonce = requestsService.createSensorRequestNonce(deviceId);
    requestsService.updateRequestStatus(deviceId);

    res.status(201).json({
      message: "Device verified and activated successfully",
      authToken,
      nonce
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceNonce = (req, res) => {
  try {
    const { id } = req.params;

    // TODO: move to service
    const request = requestsService.getRequest(id);
    res.status(201).json(request.nonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyTempAuthToken = (deviceId, tempAuthToken) => {
  const device = requestsService.getDeviceById(deviceId);
  if (device) {
    const nonce = requestsService.getNonceByDeviceId(deviceId);    
    const sessionKey = device.sessionKey;

    // Decrypt the tempAuthToken using the sessionKey
    const tempAuthTokenDecoded = decryptString(fromHexString(tempAuthToken), sessionKey);
    const tempAuthTokenValue = JSON.parse(tempAuthTokenDecoded)['TAuthToken']
    
    // Extract authToken, nonce and calculate expected value
    const authToken = parseInt(device.authToken);
    const receivedNonce = nonce.nonce;
    const expectedTempAuthToken = authToken + receivedNonce + (1000 * receivedNonce);
    
    console.log("This is the decrypted message temp auth token valye")
    console.log(tempAuthTokenValue, expectedTempAuthToken)
    if (tempAuthTokenValue === expectedTempAuthToken) {
      return { verified: true };
    } else {
      return { verified: false, reason: "Invalid Temp Auth Token" };
    }
  } else {
    return { verified: false, reason: "Device not found." };
  }
};

// Helper functions for string encryption/decryption
function encryptString(str, key) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(saesEncrypt(str.charCodeAt(i), key));
  }
  return result;
}

function decryptString(str, key) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(saesDecrypt(str.charCodeAt(i), key));
  }
  return result;
}

exports.getMQTTCreds = (req, res) => {
  try {
    const deviceId = parseInt(req.get('DevID'));
    const tempAuthToken = req.get('TAuthToken');
    const isAuthTokenVerified = verifyTempAuthToken(deviceId, tempAuthToken);
    
    if (isAuthTokenVerified.verified) {
      const nonce = requestsService.createSensorRequestNonce(deviceId);
      const responsePayload = {
        mqttServer: "10.7.233.71",
        username: "sensor",
        password: "sensor123",
        nonce: nonce
      };

      // Get the sessionKey from the device
      const device = requestsService.getDeviceById(deviceId);
      const sessionKey = device.sessionKey;

      // Encrypt the responsePayload using sessionKey      
      const responseString = JSON.stringify(responsePayload);
      const encryptedResponse = toHexString(encryptString(responseString, sessionKey));

      console.log("CREDENTIALS ISSUED !!!!")
      res.status(200).json({ encryptedResponse: encryptedResponse });
    } else {
      res.status(403).json({
        reason: isAuthTokenVerified.reason,
        token: tempAuthToken
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};