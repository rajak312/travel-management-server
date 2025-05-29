import TravelPackage from "../models/Package.js";
import { getIO } from '../socket/socket.js';
import logger from "../config/logger.js";

export const createPackage = async (req, res, next) => {
  try {
    const newPackage = await TravelPackage.create(req.body);
    const socket = getIO();
    socket.emit("PackageCreated", newPackage);
    res.status(201).json(newPackage);
  } catch (error) {
    logger.error(`createPackage error: ${error.message}`);
    next(error);
  }
};

export const getAllPackages = async (req, res, next) => {
  try {
    const packages = await TravelPackage.find({ expired: false });
    res.json(packages);
  } catch (error) {
    logger.error(`getAllPackages error: ${error.message}`);
    next(error);
  }
};

export const getPackageById = async (req, res, next) => {
  try {
    const pkg = await TravelPackage.findById(req.params.id);
    res.json(pkg);
  } catch (error) {
    logger.error(`getPackageById error: ${error.message}`);
    next(error);
  }
};

export const updatePackage = async (req, res, next) => {
  try {
    const updated = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const socket = getIO();
    socket.emit("PackageUpdated", updated);
    res.json(updated);
  } catch (error) {
    logger.error(`updatePackage error: ${error.message}`);
    next(error);
  }
};

export const deletePackage = async (req, res, next) => {
  try {
    await TravelPackage.findByIdAndUpdate(req.params.id, { expired: true });
    const socket = getIO();
    socket.emit("PackageDeleted");
    res.json({ message: "Package deleted" });
  } catch (error) {
    logger.error(`deletePackage error: ${error.message}`);
    next(error);
  }
};
