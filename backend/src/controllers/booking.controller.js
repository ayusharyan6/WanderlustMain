import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;
    const userId = req.user._id;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // user cannot book own listing
    if (listing.host.toString() === userId.toString()) {
      return res.status(403).json({
        message: "You cannot book your own listing. Please book listings created by other hosts.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "Invalid booking dates" });
    }

    const days =
      (end - start) / (1000 * 60 * 60 * 24);

    const totalPrice = days * listing.price;

    const booking = await Booking.create({
      listing: listingId,
      user: userId,
      checkIn: start,
      checkOut: end,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY BOOKINGS (USER)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing", "title location price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BOOKINGS FOR MY LISTINGS (HOST)
export const getBookingsForMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).select("_id");

    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate("listing", "title location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
