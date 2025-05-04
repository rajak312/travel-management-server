import Booking from "../models/Booking.js";
import TravelPackage from "../models/Package.js";
import User from "../models/User.js";

// ✅ View all users and their bookings
export const getUsersWithBookings = async (req, res) => {
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
    res.status(500).json({ message: "Failed to get user bookings", error });
  }
};

// ✅ Get package status: Completed / Active / Upcoming
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
    res.status(500).json({ message: "Failed to get package status", error });
  }
};

// ✅ Booking count per package
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
    res.status(500).json({ message: "Failed to count bookings", error });
  }
};
