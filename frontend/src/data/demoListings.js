const demoListings = [
  {
    _id: "demo-1",
    title: "Luxury Beachside Villa",
    description: "A beautiful villa with sea view and private pool. Perfect for a relaxing getaway.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    price: 4200,
    location: "Goa",
    country: "India",
  },
  {
    _id: "demo-2",
    title: "Modern City Apartment",
    description: "Stay in the heart of the city with skyline views. Walking distance to restaurants and shops.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 2500,
    location: "Mumbai",
    country: "India",
  },
  {
    _id: "demo-3",
    title: "Mountain View Cottage",
    description: "Peaceful cottage surrounded by mountains. Ideal for nature lovers.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    price: 1800,
    location: "Manali",
    country: "India",
  },
  {
    _id: "demo-4",
    title: "Desert Camp Stay",
    description: "Experience luxury camping in the desert. Stargazing and camel rides included.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    price: 2200,
    location: "Jaisalmer",
    country: "India",
  },
  {
    _id: "demo-5",
    title: "Lakefront Wooden Cabin",
    description: "Relax in a cozy cabin near the lake. Kayaks and bonfire setup available.",
    image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=800&q=80",
    price: 2000,
    location: "Udaipur",
    country: "India",
  },
  {
    _id: "demo-6",
    title: "Hilltop Resort Room",
    description: "Resort room with panoramic hill views. Breakfast and spa access included.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    price: 3200,
    location: "Ooty",
    country: "India",
  },
  {
    _id: "demo-7",
    title: "Rustic Village Homestay",
    description: "Authentic village experience with local food. Cultural tours and cooking classes.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    price: 1500,
    location: "Kerala",
    country: "India",
  },
  {
    _id: "demo-8",
    title: "Premium Studio Apartment",
    description: "Perfect for business travelers. Fast wifi, workspace, and gym access.",
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
    price: 2700,
    location: "Bangalore",
    country: "India",
  },
  {
    _id: "demo-9",
    title: "Heritage Haveli Stay",
    description: "Restored haveli with traditional decor. Rooftop dining and heritage walk tours.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 3500,
    location: "Jaipur",
    country: "India",
  },
  {
    _id: "demo-10",
    title: "Treehouse Retreat",
    description: "Unique treehouse in the woods. Birdwatching and nature trails nearby.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    price: 1900,
    location: "Wayanad",
    country: "India",
  },
];

export function getDemoListings() {
  return demoListings;
}

export function getDemoListingById(id) {
  return demoListings.find((l) => l._id === id) || null;
}

export function isDemoId(id) {
  return typeof id === "string" && id.startsWith("demo-");
}
