import Booking from "../models/Booking.js";
import TravelPackage from "../models/Package.js";
import { getIO } from '../socket/socket.js';
import logger from "../config/logger.js";

export const createBooking = async (req, res, next) => {
  const { packageId, selectedOptions } = req.body;

  try {
    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage)
      return res.status(404).json({ message: "Package not found" });

    let totalPrice = travelPackage.basePrice;
    if (selectedOptions.food) totalPrice += 200;
    if (selectedOptions.accommodation) totalPrice += 500;

    const booking = await Booking.create({
      user: req.user._id,
      travelPackage: packageId,
      selectedOptions,
      totalPrice,
    });

    const socket = getIO();
    socket.to(req.user._id.toString()).emit("PackageBooked", booking);
    socket.to('admins').emit("PackageBooked", booking);

    res.status(201).json(booking);
  } catch (error) {
    logger.error(`createBooking error: ${error.message}`);
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "travelPackage"
    );
    res.json(bookings);
  } catch (error) {
    logger.error(`getUserBookings error: ${error.message}`);
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("travelPackage");
    res.json(bookings);
  } catch (error) {
    logger.error(`getAllBookings error: ${error.message}`);
    next(error);
  }
};
