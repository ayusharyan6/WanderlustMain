import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const signupRes = await api.post("/auth/signup", form);
      
      // Only proceed to login if signup was successful
      if (signupRes.status === 201) {
        try {
          const loginRes = await api.post("/auth/login", {
            email: form.email,
            password: form.password,
          });
          localStorage.setItem("token", loginRes.data.token);
          if (loginRes.data.user) {
            localStorage.setItem("user", JSON.stringify({
              id: loginRes.data.user.id,
              name: loginRes.data.user.name,
              email: loginRes.data.user.email,
            }));
          }
          navigate("/");
        } catch (loginErr) {
          setError(loginErr.response?.data?.message || "Account created but login failed. Please try logging in.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <form className="form" onSubmit={submit}>
        <h2>Sign up</h2>
        <label>Name</label>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
        <p className="form-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
