import { useState, useEffect } from "react";
import { getDemoListings } from "../data/demoListings";
import ListingCard from "../components/ListingCard";
import api from "../api/axios";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // If user is not logged in, only show demo listings (with images)
        if (!token) {
          const demoListings = getDemoListings().filter((l) => Boolean(l.image));
          setListings(demoListings);
          setError("");
          return;
        }

        const response = await api.get("/listings/");
        const apiListings = (response.data || []).filter((l) => Boolean(l.image));

        // Logged-in users see real listings only (with images)
        setListings(apiListings);
        setError("");
      } catch (err) {
        console.error("Error fetching listings:", err);
        // If API fails, show demo listings as fallback (with images)
        setListings(getDemoListings().filter((l) => Boolean(l.image)));
        setError("Could not load listings from server. Showing demo listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Explore stays</h2>
        <p>Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Explore stays</h2>
      {error && <p className="error" style={{ marginBottom: "20px" }}>{error}</p>}
      {listings.length === 0 ? (
        <p className="empty-state">No listings available at the moment.</p>
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
