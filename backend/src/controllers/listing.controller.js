import Listing from "../models/Listing.js";

// CREATE LISTING (only logged-in users)

export const createListing = async (req, res) => {
  try {
    const { title, description, location, country, price, image } = req.body;

    if (!title || !description || !location || !country || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Image URL is required",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const listing = await Listing.create({
      title,
      description,
      location,
      country,
      price: Number(price),
      image,
      host: req.user._id, 
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ 
      message: "Failed to create listing",
      error: error.message 
    });
  }
};

// DELETE LISTING (only host/owner)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    if (String(listing.host) !== String(req.user._id)) {
      return res.status(403).json({ message: "You are not allowed to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL LISTINGS (PUBLIC)

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("host", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE LISTING BY ID (PUBLIC)

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.status(200).json({ listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
