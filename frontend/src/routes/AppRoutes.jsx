import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ListingDetails from "../pages/ListingDetails";
import CreateListing from "../pages/CreateListing";
import MyBookings from "../pages/MyBookings";
import HostBookings from "../pages/HostBookings";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings/:id" element={<ListingDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/listings/new" element={<CreateListing />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/host-bookings" element={<HostBookings />} />
      </Route>
    </Routes>
  );
}
