import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingsForMyListings,
} from "../controllers/booking.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.get("/host", protect, getBookingsForMyListings);

export default router;
