import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ch = (k) => (e) => setForm({...form, [k]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match!");
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("Account created! Welcome to MediNest 🎉"); navigate("/"); }, 1200);
  };

  return (
    <div className="page-wrapper auth-wrapper">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">🏥 MediNest</Link>
          <h1>Create Account</h1>
          <p>Join thousands of customers who trust MediNest</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your full name" value={form.name} onChange={ch("name")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={ch("email")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={ch("password")} required minLength={8} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat your password" value={form.confirm} onChange={ch("confirm")} required />
          </div>
          <p className="terms-text">By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
          <button type="submit" className={"btn btn-primary btn-lg btn-block" + (loading ? " loading" : "")}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
