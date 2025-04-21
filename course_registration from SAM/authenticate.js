const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = '8a996f2e079256fd951bb18e1ad206f673a97542574552367ca7228c91bddc63ad1b28002777f6f48e48b00824e1a27e077f68af22ff571d54ab93a739b6c240c7acb9d76e8a567acf0747686357a9db2af087b1df54ade40e480097392cfe060e25e55a831a8579408b0a0c149462a2c6c45fde43f64cacc02f3b65d360cc09843c95c6e0badc604488bbfb6dddeec5a1592c4ed472db38c90f15cc7bc271332fed62771f9154624a1d803f4dd2854e5ac29538097249688a6776aede35e0070ae2b742841729f7893b015dc118c1f06a05dca935f8b8df96f8012361e0c94ab0112999feecb7b71702011ceca222ebddca97c172fa7429c2db2b9188329d67';

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

module.exports = authenticateUser;
