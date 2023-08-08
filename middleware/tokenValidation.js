const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
      req.user = decoded.users;
      next();
    } catch (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
};

const userRoleCheck = (requiredRoles) => (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
      
      const userRole = decoded.userRole;
      if (requiredRoles.includes(userRole)) {
          next();
      } else {
          return res.status(403).json({ message: 'Unauthorized' });
      }
  });
};


module.exports = validateToken, userRoleCheck;
