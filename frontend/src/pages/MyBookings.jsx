import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data.bookings || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2 className="page-title">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="empty-state">No bookings yet. Book a stay from a listing.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((b) => (
            <li key={b._id} className="booking-card">
              {b.listing?.image && (
                <img src={b.listing.image} alt="" className="booking-img" />
              )}
              <div className="booking-body">
                <Link to={`/listings/${b.listing?._id}`}>
                  <strong>{b.listing?.title || "Listing"}</strong>
                </Link>
                <p className="location">{b.listing?.location}</p>
                <p>
                  {b.checkIn && new Date(b.checkIn).toLocaleDateString()} –{" "}
                  {b.checkOut && new Date(b.checkOut).toLocaleDateString()}
                </p>
                <p className="price">Total: ₹{b.totalPrice}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
