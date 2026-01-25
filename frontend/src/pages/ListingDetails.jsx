import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ListingMap from "../components/ListingMap";
import { getDemoListingById, isDemoId } from "../data/demoListings";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [booking, setBooking] = useState({ checkIn: "", checkOut: "", guests: 1 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [bookingError, setBookingError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isDemo = isDemoId(id);
  const isOwner = !isDemo && user && listing?.host && String(listing.host._id) === String(user.id);

  useEffect(() => {
    if (isDemoId(id)) {
      const demo = getDemoListingById(id);
      if (demo) {
        setListing(demo);
        setReviews([]);
      } else {
        setError("Listing not found");
      }
      setLoading(false);
      return;
    }
    api
      .get(`/listings/${id}`)
      .then((res) => setListing(res.data.listing))
      .catch((err) => setError(err.response?.data?.message || "Listing not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || isDemoId(id)) return;
    api
      .get(`/reviews/${id}`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => setReviews([]));
  }, [id]);

  const requireAuth = (action) => {
    if (!token) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleBook = (e) => {
    e.preventDefault();
    setBookingError("");
    if (requireAuth("book")) return;
    if (isOwner) return;
    if (isDemo) return;
    api
      .post("/bookings", {
        listingId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      })
      .then(() => navigate("/my-bookings"))
      .catch((err) => setBookingError(err.response?.data?.message || "Booking failed"));
  };

  const submitReview = (e) => {
    e.preventDefault();
    setReviewError("");
    if (requireAuth("review")) return;
    if (isOwner) return;
    if (isDemo) return;
    api
      .post(`/reviews/${id}`, { rating: reviewForm.rating, comment: reviewForm.comment })
      .then(() => {
        setReviewForm({ rating: 5, comment: "" });
        return api.get(`/reviews/${id}`);
      })
      .then((res) => setReviews(res.data.reviews || []))
      .catch((err) => setReviewError(err.response?.data?.message || "Failed to add review"));
  };

  const deleteReview = (reviewId) => {
    api
      .delete(`/reviews/${reviewId}`)
      .then(() => setReviews((prev) => prev.filter((r) => r._id !== reviewId)))
      .catch(() => {});
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error || !listing) return <div className="container"><p className="error">{error || "Not found"}</p></div>;

  const locationText = [listing.location, listing.country].filter(Boolean).join(", ");

  const renderBookingSection = () => {
    if (isDemo) {
      if (!token) {
        return (
          <div className="auth-cta">
            <p className="auth-cta-text">Sign in to book this stay</p>
            <button type="button" className="auth-cta-btn" onClick={() => navigate("/login")}>
              Log in to book
            </button>
          </div>
        );
      }
      return (
        <div className="auth-cta auth-cta-muted">
          <p className="auth-cta-text">This is a demo listing. Sign up and create real listings, or book from real stays.</p>
        </div>
      );
    }
    if (!token) {
      return (
        <div className="auth-cta">
          <p className="auth-cta-text">Sign in to book this stay</p>
          <button type="button" className="auth-cta-btn" onClick={() => navigate("/login")}>
            Log in to book
          </button>
        </div>
      );
    }
    return (
      <form onSubmit={handleBook} className="form">
        <label>Check-in</label>
        <input
          type="date"
          value={booking.checkIn}
          onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
          required
        />
        <label>Check-out</label>
        <input
          type="date"
          value={booking.checkOut}
          onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
          required
        />
        <label>Guests</label>
        <input
          type="number"
          min="1"
          value={booking.guests}
          onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) || 1 })}
        />
        {bookingError && <p className="error">{bookingError}</p>}
        <button type="submit">Book</button>
      </form>
    );
  };

  const renderReviewSection = () => {
    if (isOwner) return null;
    if (isDemo) {
      if (!token) {
        return (
          <div className="auth-cta">
            <p className="auth-cta-text">Sign in to leave a review</p>
            <button type="button" className="auth-cta-btn" onClick={() => navigate("/login")}>
              Log in to add a review
            </button>
          </div>
        );
      }
      return (
        <div className="auth-cta auth-cta-muted">
          <p className="auth-cta-text">This is a demo listing. No reviews.</p>
        </div>
      );
    }
    if (!token) {
      return (
        <div className="auth-cta">
          <p className="auth-cta-text">Sign in to leave a review</p>
          <button type="button" className="auth-cta-btn" onClick={() => navigate("/login")}>
            Log in to add a review
          </button>
        </div>
      );
    }
    return (
      <form onSubmit={submitReview} className="form form-inline">
        <label>Rating (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={reviewForm.rating}
          onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) || 5 })}
        />
        <label>Comment</label>
        <textarea
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          required
          placeholder="Your review..."
        />
        {reviewError && <p className="error">{reviewError}</p>}
        <button type="submit">Add Review</button>
      </form>
    );
  };

  return (
    <div className="container">
      <div className="listing-detail">
        <img
          src={listing.image || "https://via.placeholder.com/800x400?text=No+Image"}
          alt={listing.title}
          className="detail-img"
        />
        <h2>{listing.title}</h2>
        <p className="location">{locationText}</p>
        <p className="detail-desc">{listing.description}</p>
        <p className="price">₹{listing.price} / night</p>
        {listing.host && <p className="host">Host: {listing.host.name}</p>}
      </div>

      <div className="detail-map">
        <h3>Location</h3>
        <ListingMap location={listing.location} country={listing.country} />
      </div>

      {!isOwner && (
        <div className="detail-booking">
          <h3>Book this place</h3>
          {renderBookingSection()}
        </div>
      )}

      <div className="detail-reviews">
        <h3>Reviews</h3>
        {renderReviewSection()}
        {!isDemo && (
          <>
            {reviews.length === 0 && <p>No reviews yet.</p>}
            <ul className="review-list">
              {reviews.map((r) => (
                <li key={r._id} className="review-item">
                  <div>
                    <strong>{r.user?.name || "User"}</strong> — {r.rating}/5
                  </div>
                  <p>{r.comment}</p>
                  {user && r.user && String(r.user._id) === String(user.id) && (
                    <button type="button" className="btn-delete" onClick={() => deleteReview(r._id)}>
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
