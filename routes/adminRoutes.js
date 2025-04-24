import express from "express";
import {
  getUsersWithBookings,
  getPackageStatusReport,
  getBookingCountPerPackage,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users-bookings", protect, getUsersWithBookings);
router.get("/package-status", protect, getPackageStatusReport);
router.get("/booking-count", protect, getBookingCountPerPackage);

export default router;
