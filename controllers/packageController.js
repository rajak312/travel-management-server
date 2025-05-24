import TravelPackage from "../models/Package.js";
import { getIO } from '../socket/socket.js';


export const createPackage = async (req, res) => {
  try {
    const newPackage = await TravelPackage.create(req.body);
    const socket=getIO();
    socket.emit("PackageCreated",newPackage)
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find(
      {
        expired:false
      }
    );
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const pkg = await TravelPackage.findById(req.params.id);
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const updated = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const socket=getIO();
    socket.emit("PackageUpdated",updated)
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    await TravelPackage.findByIdAndUpdate(req.params.id,{
      expired:true
    });

    const socket=getIO();
    socket.emit("PackageDeleted")
    res.json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
