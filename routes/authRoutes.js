import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res, next) => {
    try {
      if (req.user.email === process.env.ADMIN_EMAIL) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=AdminCannotUseGoogle`
        );
      }

      const token = jwt.sign({ id: req.user._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "7d",
      });

      res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    } catch (err) {
      logger.error(`Google OAuth error: ${err.message}`);
      res.redirect(`${process.env.CLIENT_URL}/login?error=OAuthFailed`);
    }
  }
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, getMe);

export default router;
