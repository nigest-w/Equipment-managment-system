const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json("Access Denied: No token provided");
    }

    // Format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json("Access Denied: Invalid token format");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();

  } catch (error) {
    return res.status(401).json("Invalid or expired token");
  }
};

module.exports = authMiddleware;