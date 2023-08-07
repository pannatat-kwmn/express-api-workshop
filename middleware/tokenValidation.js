const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
      req.user = decoded.users; // Note the change here
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

module.exports = validateToken;
