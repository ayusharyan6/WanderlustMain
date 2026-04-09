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
  const [deleteError, setDeleteError] = useState("");

  const [booking, setBooking] = useState({ checkIn: "", checkOut: "", guests: 1 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [bookingError, setBookingError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isDemo = isDemoId(id);
  const demoListing = isDemo ? getDemoListingById(id) : null;
  const effectiveListing = isDemo ? demoListing : listing;
  const effectiveLoading = isDemo ? false : loading;
  const effectiveError = isDemo && !demoListing ? "Listing not found" : error;
  
  // Check if current user is the owner
  const isOwner = !isDemo && user && effectiveListing?.host && (
    String(effectiveListing.host._id) === String(user.id) || 
    String(effectiveListing.host) === String(user.id)
  );

  useEffect(() => {
    if (isDemoId(id)) return;
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

  const requireAuth = () => {
    if (!token) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleBook = (e) => {
    e.preventDefault();
    setBookingError("");
    if (requireAuth()) return;
    if (isOwner) {
      setBookingError("You cannot book your own listing.");
      return;
    }
    if (isDemo) {
      setBookingError("Demo listings cannot be booked. Please book real listings.");
      return;
    }
    api
      .post("/bookings", {
        listingId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
      })
      .then((res) => {
        if (res.status === 201) {
          navigate("/my-bookings");
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Booking failed. Please try again.";
        setBookingError(errorMsg);
      });
  };

  const submitReview = (e) => {
    e.preventDefault();
    setReviewError("");
    if (requireAuth()) return;
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

  const handleDeleteListing = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (isDemo) return;
    if (!isOwner) return;

    const ok = window.confirm("Delete this listing? This action cannot be undone.");
    if (!ok) return;

    setDeleteError("");
    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (effectiveLoading) return <div className="container"><p>Loading...</p></div>;
  if (effectiveError || !effectiveListing) {
    return <div className="container"><p className="error">{effectiveError || "Not found"}</p></div>;
  }

  const locationText = [effectiveListing.location, effectiveListing.country].filter(Boolean).join(", ");

  const renderBookingSection = () => {
    // If user is the owner, don't show booking form
    if (isOwner) {
      return (
        <div className="auth-cta auth-cta-muted">
          <p className="auth-cta-text">This is your listing. You cannot book your own property.</p>
        </div>
      );
    }
    
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
          <p className="auth-cta-text">This is a demo listing. You can only book real listings created by other users.</p>
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
    
    // Show booking form for real listings that user doesn't own
    return (
      <form onSubmit={handleBook} className="form">
        <label>Check-in</label>
        <input
          type="date"
          value={booking.checkIn}
          onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
          required
          min={new Date().toISOString().split('T')[0]}
        />
        <label>Check-out</label>
        <input
          type="date"
          value={booking.checkOut}
          onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
          required
          min={booking.checkIn || new Date().toISOString().split('T')[0]}
        />
        <label>Guests</label>
        <input
          type="number"
          min="1"
          value={booking.guests}
          onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) || 1 })}
        />
        {bookingError && <p className="error">{bookingError}</p>}
        <button type="submit">Book Now</button>
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
          src={effectiveListing.image || "https://via.placeholder.com/800x400?text=No+Image"}
          alt={effectiveListing.title}
          className="detail-img"
        />
        <h2>{effectiveListing.title}</h2>
        <p className="location">{locationText}</p>
        <p className="detail-desc">{effectiveListing.description}</p>
        <p className="price">₹{effectiveListing.price} / night</p>
        {effectiveListing.host && <p className="host">Host: {effectiveListing.host.name}</p>}

        {!isDemo && isOwner && (
          <div style={{ marginTop: 12 }}>
            {deleteError && <p className="error" style={{ marginBottom: 10 }}>{deleteError}</p>}
            <button type="button" className="btn-delete" onClick={handleDeleteListing}>
              Delete listing
            </button>
          </div>
        )}
      </div>

      <div className="detail-map">
        <h3>Location</h3>
        <ListingMap location={effectiveListing.location} country={effectiveListing.country} />
      </div>

      <div className="detail-booking">
        <h3>Book this place</h3>
        {renderBookingSection()}
      </div>

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
