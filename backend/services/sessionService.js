const db = require('../config/db');

const SBOX = [0x9, 0x4, 0xA, 0xB, 0xD, 0x1, 0x8, 0x5, 0x6, 0x2, 0x0, 0x3, 0xC, 0xE, 0xF, 0x7];
const INV_SBOX = [0xA, 0x5, 0x9, 0xB, 0x1, 0x7, 0x8, 0xF, 0x6, 0x0, 0x2, 0x3, 0xC, 0x4, 0xD, 0xE];

const generateRandomNum = () => Math.floor(Math.random() * 50); // Random numbers below 50

const saesEncrypt = (plaintext, key) => {
  let state = plaintext;
  state ^= key;
  state = (SBOX[state >> 4] << 4) | SBOX[state & 0x0F];
  state ^= key;
  return state;
};

const saesDecrypt = (ciphertext, key) => {
  let state = ciphertext;
  state ^= key;
  state = (INV_SBOX[state >> 4] << 4) | INV_SBOX[state & 0x0F];
  state ^= key;
  return state;
};

const toHexString = (input) => {
  let hexString = '';
  for (let i = 0; i < input.length; i++) {
    let hex = input.charCodeAt(i).toString(16);
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

exports.initializeSession = (deviceId, encryptedMessage) => {
  try {
    const reqDevice = db.get('Requests').find({ deviceId: deviceId }).value();
    if (!reqDevice) {
      return { error_code: 404, error: 'Device not found' };
    } else if (!reqDevice.activated) {
      return { error_code: 403, error: 'Device not Activated' };
    }

    const device = db.get('Devices').find({ deviceId }).value();
    const secret = device.secret;

    // Decrypt the message to extract num1 and num2
    const encryptedMessageDecoded = fromHexString(encryptedMessage);
    let decryptedMessage = '';
    for (let i = 0; i < encryptedMessageDecoded.length; i++) {
      decryptedMessage += String.fromCharCode(saesDecrypt(encryptedMessageDecoded.charCodeAt(i), secret));
    }

    console.log("Decrypted Message String:", decryptedMessage);

    try {
      decryptedMessage = JSON.parse(decryptedMessage);
    } catch (err) {
      return { error_code: 400, error: 'Invalid encrypted message format' };
    }

    const num1 = decryptedMessage.num1;
    const num2 = decryptedMessage.num2;

    console.log("----------------");
    console.log("This is what we are receiving from the encrypted messages:");
    console.log("Num 1", num1);
    console.log("Num 2", num2);

    // Add num1 and num2
    const challengeRes = num1 + num2;

    // Generate random numbers num3 and num4
    const num3 = generateRandomNum();
    const num4 = generateRandomNum();

    // Store num3 and num4 in the device
    db.get('Devices').find({ deviceId }).assign({ num3, num4 }).write();

    // Create response message
    const responseMessage = JSON.stringify({ challengeRes, num3, num4 });
    let encryptedResponse = '';
    for (let i = 0; i < responseMessage.length; i++) {
      encryptedResponse += String.fromCharCode(saesEncrypt(responseMessage.charCodeAt(i), secret));
    }

    // Convert encrypted response to hexadecimal string
    encryptedResponse = toHexString(encryptedResponse);

    return { deviceId, encryptedResponse };
  } catch (err) {
    console.error("Error in initializeSession:", err);
    return { error_code: 500, error: 'Internal server error' };
  }
};

exports.validateSession = (deviceId, encryptedMessage) => {
  try {
    const device = db.get('Devices').find({ deviceId }).value();
    if (!device) {
      return { error_code: 404, error: 'Device not found' };
    }

    const secret = device.secret;

    // Decrypt the message
    const encryptedMessageDecoded = fromHexString(encryptedMessage);
    let decryptedMessage = '';
    for (let i = 0; i < encryptedMessageDecoded.length; i++) {
      decryptedMessage += String.fromCharCode(saesDecrypt(encryptedMessageDecoded.charCodeAt(i), secret));
    }

    console.log("Decrypted Message String:", decryptedMessage);

    try {
      decryptedMessage = JSON.parse(decryptedMessage);
    } catch (err) {
      return { error_code: 400, error: 'Invalid encrypted message format' };
    }

    const receivedChallengeRes = decryptedMessage.challengeRes;
    const Dkey = decryptedMessage.Dkey;

    console.log("----------------");
    console.log("This is what we are receiving from the encrypted messages:");
    console.log("Received Challenge Res", receivedChallengeRes);
    console.log("Dkey", Dkey);

    // Validate challengeRes
    if (receivedChallengeRes !== device.num3 + device.num4) {
      return { error_code: 400, error: 'Invalid Challenge Response' };
    }

    const nonce = generateRandomNum();
    const Skey = generateRandomNum(); // Generate Skey

    // Encrypt the response with hello, Skey, authToken, and nonce
    const responseMessage = JSON.stringify({ message: 'hello', Skey, authToken: device.authToken, nonce });
    let encryptedResponse = '';
    for (let i = 0; i < responseMessage.length; i++) {
      encryptedResponse += String.fromCharCode(saesEncrypt(responseMessage.charCodeAt(i), secret));
    }

    const sessionKey = Skey + Dkey;

    // Check if there is an entry for deviceId, then update its nonce, if no entry then create the entry with nonce
  const existingNonce = db.get('Nonces').find({ deviceId }).value();
  if (existingNonce) {
    db.get('Nonces').find({ deviceId }).assign({ nonce }).write();
  } else {
    db.get('Nonces').push({ deviceId, nonce }).write();
  }

  // Store the nonce and Skey
  db.get('Devices').find({ deviceId }).assign({ Skey }).write();
  db.get('Devices').find({ deviceId }).assign({ Dkey }).write();
  db.get('Devices').find({ deviceId }).assign({ sessionKey }).write();


    // Convert encrypted response to hexadecimal string
    encryptedResponse = toHexString(encryptedResponse);

    return { encryptedResponse };
  } catch (err) {
    console.error("Error in validateSession:", err);
    return { error_code: 500, error: 'Internal server error' };
  }
};
