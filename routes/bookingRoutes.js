import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.get("/all", protect, getAllBookings);

export default router;
