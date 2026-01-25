import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/bookings/host")
      .then((res) => setBookings(res.data.bookings || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2 className="page-title">Host Bookings</h2>
      <p className="muted">Bookings made by guests on your listings.</p>
      {bookings.length === 0 ? (
        <p className="empty-state">No bookings on your listings yet.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((b) => (
            <li key={b._id} className="booking-card">
              <div className="booking-body">
                <Link to={`/listings/${b.listing?._id}`}>
                  <strong>{b.listing?.title || "Listing"}</strong>
                </Link>
                <p className="location">{b.listing?.location}</p>
                <p>Guest: {b.user?.name} ({b.user?.email})</p>
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
