import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("Logged in successfully! 🎉"); navigate("/"); }, 1200);
  };

  return (
    <div className="page-wrapper auth-wrapper">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">🏥 MediNest</Link>
          <h1>Welcome back</h1>
          <p>Sign in to access your account and order history</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="auth-options">
            <label className="remember-me"><input type="checkbox" /> Remember me</label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          <button type="submit" className={"btn btn-primary btn-lg btn-block" + (loading ? " loading" : "")}>
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
