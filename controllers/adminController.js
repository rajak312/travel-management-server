import Booking from "../models/Booking.js";
import TravelPackage from "../models/Package.js";
import User from "../models/User.js";

// View all users and their bookings
export const getUsersWithBookings = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const bookings = await Booking.find()
      .populate("user")
      .populate("travelPackage");
    res.json({ users, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get package status: Completed / Active / Upcoming
export const getPackageStatusReport = async (req, res) => {
  try {
    const today = new Date();

    const allPackages = await TravelPackage.find();
    const result = {
      completed: [],
      active: [],
      upcoming: [],
    };

    allPackages.forEach((pkg) => {
      if (new Date(pkg.endDate) < today) result.completed.push(pkg);
      else if (
        new Date(pkg.startDate) <= today &&
        today <= new Date(pkg.endDate)
      )
        result.active.push(pkg);
      else if (new Date(pkg.startDate) > today) result.upcoming.push(pkg);
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking count per package
export const getBookingCountPerPackage = async (req, res) => {
  try {
    const counts = await Booking.aggregate([
      {
        $group: {
          _id: "$travelPackage",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "travelpackages",
          localField: "_id",
          foreignField: "_id",
          as: "packageInfo",
        },
      },
      {
        $unwind: "$packageInfo",
      },
    ]);

    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
