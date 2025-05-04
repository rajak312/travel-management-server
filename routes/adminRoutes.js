import express from "express";
import {
  getUsersWithBookings,
  getPackageStatusReport,
  getBookingCountPerPackage,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users-bookings", protect, adminOnly, getUsersWithBookings);
router.get("/package-status", protect, adminOnly, getPackageStatusReport);
router.get("/booking-count", protect, adminOnly, getBookingCountPerPackage);

export default router;
