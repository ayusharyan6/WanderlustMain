import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListingById,
} from "../controllers/listing.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL LISTINGS (PUBLIC)
router.get("/", getAllListings);

// GET SINGLE LISTING BY ID (PUBLIC)
router.get("/:id", getListingById);

// CREATE LISTING (ONLY logged-in users)
router.post("/createListing", protect, createListing);

// DELETE LISTING (ONLY host/owner)
router.delete("/:id", protect, deleteListing);

export default router;
