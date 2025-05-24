import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    basePrice: { type: Number, required: true },
    includedServices: {
      food: { type: Boolean, default: false },
      accommodation: { type: Boolean, default: false },
    },
    expired:{type:Boolean, default:false}
  },
  { timestamps: true }
);

const TravelPackage = mongoose.model("TravelPackage", packageSchema);
export default TravelPackage;
