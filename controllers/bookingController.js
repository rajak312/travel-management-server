import Booking from "../models/Booking.js";
import TravelPackage from "../models/Package.js";

export const createBooking = async (req, res) => {
  const { packageId, selectedOptions } = req.body;

  try {
    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage)
      return res.status(404).json({ message: "Package not found" });

    // Calculate total price
    let totalPrice = travelPackage.basePrice;
    if (selectedOptions.food) totalPrice += 200;
    if (selectedOptions.accommodation) totalPrice += 500;

    const booking = await Booking.create({
      user: req.user._id,
      travelPackage: packageId,
      selectedOptions,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "travelPackage"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("travelPackage");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
