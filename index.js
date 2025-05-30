import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {createServer} from "http";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import logger from './config/logger.js';
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { createDefaultAdmin } from "./utils/seedAdmin.js";
import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('combined', {
  stream: {
    write: message => logger.info(message.trim())
  }
}));
app.use(
  session({
    secret: "google_auth_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

await connectDB().then(createDefaultAdmin).catch(console.error);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Travel Booking API with MongoDB is running...");
});

app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }
  });
});


initSocket(server);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
