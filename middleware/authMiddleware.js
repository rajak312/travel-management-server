import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../config/logger.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth protect error: ${error.message}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 👮‍♂️ Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  res.status(403).json({ message: "Access denied: Admins only" });
};
