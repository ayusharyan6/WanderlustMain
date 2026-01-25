import { getDemoListings } from "../data/demoListings";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const listings = getDemoListings();

  return (
    <div className="container">
      <h2 className="page-title">Explore stays</h2>
      <div className="listing-grid">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
