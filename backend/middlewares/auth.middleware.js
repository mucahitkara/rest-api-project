const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user and check if they still exist
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.userId = decoded.userId;
    req.user = user; // Attach full user object for role/verification checks
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    res.status(403).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const verifiedMiddleware = (req, res, next) => {
  if (!req.user || !req.user.emailVerified) {
    return res.status(403).json({ message: "Please verify your email to access this feature" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, verifiedMiddleware };
