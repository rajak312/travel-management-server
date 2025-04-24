import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only could have separate check later
router.post("/", protect, createPackage);
router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.put("/:id", protect, updatePackage);
router.delete("/:id", protect, deletePackage);

export default router;
