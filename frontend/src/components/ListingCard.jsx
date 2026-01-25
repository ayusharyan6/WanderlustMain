import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const locationText = [listing.location, listing.country].filter(Boolean).join(", ");
  return (
    <Link to={`/listings/${listing._id}`} className="listing-card">
      <img
        src={listing.image || "https://via.placeholder.com/400x200?text=No+Image"}
        alt={listing.title}
        className="listing-img"
      />
      <div className="listing-body">
        <h3>{listing.title}</h3>
        <p className="location">{locationText || "—"}</p>
        <p className="price">₹{listing.price} / night</p>
      </div>
    </Link>
  );
}
