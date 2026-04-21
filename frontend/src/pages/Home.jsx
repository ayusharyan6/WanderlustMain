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

        // DIRECT BACKEND CALL (no token check)
        const response = await api.get("/listings");

        const apiListings = (response.data || []).filter(
          (l) => Boolean(l.image)
        );

        setListings(apiListings);
        setError("");
      } catch (err) {
        console.error("Error fetching listings:", err);

        // fallback demo data
        const demoListings = getDemoListings().filter((l) =>
          Boolean(l.image)
        );

        setListings(demoListings);
        setError("Server down. Showing demo listings.");
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

      {error && (
        <p className="error" style={{ marginBottom: "20px" }}>
          {error}
        </p>
      )}

      {listings.length === 0 ? (
        <p className="empty-state">No listings available.</p>
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