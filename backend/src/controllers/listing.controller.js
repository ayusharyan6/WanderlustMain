import Listing from "../models/Listing.js";

// CREATE LISTING (only logged-in users)

export const createListing = async (req, res) => {
  try {
    console.log("hii");
    console.log(req.body);

    const { title, description, location, country, price, image } = req.body;

    if (!title || !description || !location || !country || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    console.log("hello")

    const listing = await Listing.create({
      title,
      description,
      location,
      country,
      price,
      image,
      host: req.user._id, 
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
