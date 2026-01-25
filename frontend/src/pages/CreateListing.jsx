import { useState } from "react";
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
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setData((prev) => ({ ...prev, image: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!data.image) {
      setError("Please select an image");
      return;
    }
    setLoading(true);
    const payload = {
      ...data,
      price: Number(data.price) || 0,
    };
    try {
      await api.post("/listings/createListing", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
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
        <label>Image (file)</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        {!preview && data.image && (
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
