import { Link, useNavigate } from "react-router-dom";

const HomeIcon = () => (
  <svg className="nav-brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L2 10h2v10h6v-6h4v6h6V10h2L12 2z" />
  </svg>
);

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <HomeIcon />
        <span>WanderLust</span>
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/listings/new">Create</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/host-bookings">Host Bookings</Link>
            <button type="button" onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
