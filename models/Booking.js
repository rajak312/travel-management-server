import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    travelPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelPackage",
      required: true,
    },
    selectedOptions: {
      food: { type: Boolean, default: false },
      accommodation: { type: Boolean, default: false },
    },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Accepted"], default: "Accepted" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
