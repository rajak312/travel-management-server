import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "google_auth_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Travel Booking API with MongoDB is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
