import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    price: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUrlChange = (e) => {
    const imageUrl = e.target.value;
    setData((prev) => ({ ...prev, image: imageUrl }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!data.image) {
      setError("Please provide an image URL");
      return;
    }
    setLoading(true);
    const payload = {
      ...data,
      price: Number(data.price) || 0,
    };
    try {
      const response = await api.post("/listings/createListing", payload);
      if (response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please log in to create a listing");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to create listing. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <form className="form" onSubmit={submit}>
        <h2>Create Listing</h2>
        <label>Title</label>
        <input
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          required
        />
        <label>Description</label>
        <textarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          required
        />
        <label>Location</label>
        <input
          placeholder="e.g. Paris"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          required
        />
        <label>Country</label>
        <input
          placeholder="e.g. France"
          value={data.country}
          onChange={(e) => setData({ ...data, country: e.target.value })}
          required
        />
        <label>Price per night</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={data.price}
          onChange={(e) => setData({ ...data, price: e.target.value })}
          required
        />
        <label>Image URL</label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={data.image}
          onChange={handleImageUrlChange}
          required
        />
        {data.image && (
          <div className="image-preview">
            <img src={data.image} alt="Preview" />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
      </form>
    </div>
  );
}
