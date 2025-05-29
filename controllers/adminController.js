import Booking from "../models/Booking.js";
import TravelPackage from "../models/Package.js";
import User from "../models/User.js";
import logger from "../config/logger.js";

export const getUsersWithBookings = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("travelPackage", "from to startDate endDate");

    const userBookingMap = users.map((user) => {
      const userBookings = bookings.filter(
        (b) => b.user._id.toString() === user._id.toString()
      );
      return {
        user,
        bookings: userBookings,
      };
    });

    res.json(userBookingMap);
  } catch (error) {
    logger.error(`getUsersWithBookings error: ${error.message}`);
    next(error);
  }
};

export const getPackageStatusReport = async (req, res, next) => {
  try {
    const today = new Date();
    const allPackages = await TravelPackage.find();

    const result = {
      completed: [],
      active: [],
      upcoming: [],
    };

    allPackages.forEach((pkg) => {
      const start = new Date(pkg.startDate);
      const end = new Date(pkg.endDate);

      if (end < today) {
        result.completed.push(pkg);
      } else if (start > today) {
        result.upcoming.push(pkg);
      } else {
        result.active.push(pkg);
      }
    });

    res.json(result);
  } catch (error) {
    logger.error(`getPackageStatusReport error: ${error.message}`);
    next(error);
  }
};

export const getBookingCountPerPackage = async (req, res, next) => {
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
      { $unwind: "$packageInfo" },
      {
        $project: {
          _id: 0,
          packageId: "$packageInfo._id",
          from: "$packageInfo.from",
          to: "$packageInfo.to",
          startDate: "$packageInfo.startDate",
          endDate: "$packageInfo.endDate",
          bookingCount: 1,
        },
      },
    ]);

    res.json(counts);
  } catch (error) {
    logger.error(`getBookingCountPerPackage error: ${error.message}`);
    next(error);
  }
};
