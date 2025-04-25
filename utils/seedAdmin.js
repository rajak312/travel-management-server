import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "❌ Missing DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD in .env"
    );
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`✅ Default admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("ℹ️ Admin already exists");
  }
};
