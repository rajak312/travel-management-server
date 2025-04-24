import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking); // User books a package
router.get("/my-bookings", protect, getUserBookings); // User's own bookings
router.get("/all", protect, getAllBookings); // Admin route to view all

export default router;
