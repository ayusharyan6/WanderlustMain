import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../models/listing.model.js";

dotenv.config();

const demoListings = [
  {
    title: "Luxury Beachside Villa",
    description: "A beautiful villa with sea view and private pool",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    price: 4200,
    location: "Goa"
  },
  {
    title: "Modern City Apartment",
    description: "Stay in the heart of the city with skyline views",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    price: 2500,
    location: "Mumbai"
  },
  {
    title: "Mountain View Cottage",
    description: "Peaceful cottage surrounded by mountains",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    price: 1800,
    location: "Manali"
  },
  {
    title: "Desert Camp Stay",
    description: "Experience luxury camping in the desert",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    price: 2200,
    location: "Jaisalmer"
  },
  {
    title: "Lakefront Wooden Cabin",
    description: "Relax in a cozy cabin near the lake",
    image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1",
    price: 2000,
    location: "Udaipur"
  },
  {
    title: "Hilltop Resort Room",
    description: "Resort room with panoramic hill views",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    price: 3200,
    location: "Ooty"
  },
  {
    title: "Rustic Village Homestay",
    description: "Authentic village experience with local food",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    price: 1500,
    location: "Kerala"
  },
  {
    title: "Premium Studio Apartment",
    description: "Perfect for business travelers",
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41",
    price: 2700,
    location: "Bangalore"
  }
];

async function seedListings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Listing.deleteMany();
    await Listing.insertMany(demoListings);
    console.log("Demo listings added successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedListings();
