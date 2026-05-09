import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API = "http://localhost:5000/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show error message from backend (e.g. "Invalid email or password")
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token & user info to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/"); // Redirect to Home
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper auth-wrapper">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">🏥 MediNest</Link>
          <h1>Welcome back</h1>
          <p>Sign in to access your account and order history</p>
        </div>

        {/* Show error if any */}
        {error && (
          <div style={{
            background: "#fee2e2", color: "#b91c1c",
            padding: "10px 14px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "14px"
          }}>
            ❌ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          <button
            type="submit"
            className={"btn btn-primary btn-lg btn-block" + (loading ? " loading" : "")}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
