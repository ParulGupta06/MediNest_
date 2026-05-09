import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API = "http://localhost:5000/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const ch = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (form.password !== form.confirm) {
      return setError("Passwords do not match!");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show error from backend (e.g. "Email already registered")
        setError(data.message || "Registration failed");
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
          <h1>Create Account</h1>
          <p>Join thousands of customers who trust MediNest</p>
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
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="Your full name"
              value={form.name}
              onChange={ch("name")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={ch("email")}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={ch("password")}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={ch("confirm")}
              required
            />
          </div>
          <p className="terms-text">
            By registering, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
          <button
            type="submit"
            className={"btn btn-primary btn-lg btn-block" + (loading ? " loading" : "")}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
