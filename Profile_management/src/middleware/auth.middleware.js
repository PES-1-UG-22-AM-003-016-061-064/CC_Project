const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Authorization header doesn\'t start with Bearer');
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
  
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token);
  
    try {
      console.log('JWT Secret being used:', JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      req.user = {
        _id: decoded.userId || decoded._id,
        role: decoded.role || decoded.userType
      };
      console.log('User object created:', req.user);
      
      next();
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };