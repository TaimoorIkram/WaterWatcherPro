const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'iot-jsonwebtoken';

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      if (!decoded.roleId) {
        return res.status(403).json({ message: 'No role specified in token' });
      }

      if (allowedRoles.includes(decoded.roleId)) {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: 'Insufficient permissions' });
      }
    });
  };
};

module.exports = authorizeRoles;