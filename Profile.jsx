import { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const mockUser = {
  name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210",
  dob: "1992-06-15", gender: "Female",
  addresses: [
    { id: 1, label: "Home", line: "Flat 4B, Sunrise Apartments, Bandra West, Mumbai – 400050", default: true },
    { id: 2, label: "Work", line: "MediCorp Pvt Ltd, BKC, Mumbai – 400051", default: false },
  ],
  joinedDate: "January 2024",
  totalOrders: 4,
  totalSpent: 980,
};

const TABS = ["Profile", "Addresses", "Security"];

export default function Profile() {
  const [tab, setTab] = useState("Profile");
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone, dob: user.dob, gender: user.gender });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-wrapper">
      <div className="profile-hero">
        <div className="container profile-hero-inner">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <div>
            <h1>{user.name}</h1>
            <p>{user.email} · Member since {user.joinedDate}</p>
          </div>
        </div>
      </div>

      <div className="container profile-container">
        <div className="profile-stats">
          <div className="pstat"><strong>{user.totalOrders}</strong><span>Orders</span></div>
          <div className="pstat-divider"></div>
          <div className="pstat"><strong>₹{user.totalSpent}</strong><span>Total Spent</span></div>
          <div className="pstat-divider"></div>
          <div className="pstat"><strong>2</strong><span>Reminders</span></div>
          <div className="pstat-divider"></div>
          <div className="pstat"><strong>4.8 ★</strong><span>Rating</span></div>
        </div>

        <div className="profile-quick-links">
          <Link to="/orders" className="quick-link">📦 My Orders</Link>
          <Link to="/reminders" className="quick-link">⏰ Reminders</Link>
          <Link to="/prescription" className="quick-link">📋 Prescriptions</Link>
          <Link to="/cart" className="quick-link">🛒 Cart</Link>
        </div>

        <div className="profile-tabs">
          {TABS.map(t => (
            <button key={t} className={"ptab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {saved && <div className="save-toast">✅ Profile updated successfully!</div>}

        {tab === "Profile" && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>
            {editing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input className="form-input" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      {["Male","Female","Other","Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : (
              <div className="profile-details">
                {[
                  { label: "Full Name", val: user.name, icon: "👤" },
                  { label: "Email", val: user.email, icon: "✉️" },
                  { label: "Phone", val: user.phone, icon: "📞" },
                  { label: "Date of Birth", val: user.dob, icon: "🎂" },
                  { label: "Gender", val: user.gender, icon: "⚧" },
                  { label: "Member Since", val: user.joinedDate, icon: "📅" },
                ].map(d => (
                  <div className="detail-row" key={d.label}>
                    <span className="detail-icon">{d.icon}</span>
                    <div>
                      <div className="detail-label">{d.label}</div>
                      <div className="detail-val">{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Addresses" && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Saved Addresses</h3>
              <button className="btn btn-primary btn-sm">+ Add Address</button>
            </div>
            <div className="address-list">
              {user.addresses.map(addr => (
                <div key={addr.id} className={"address-card" + (addr.default ? " default" : "")}>
                  <div className="address-icon">📍</div>
                  <div className="address-info">
                    <div className="address-label">{addr.label} {addr.default && <span className="default-badge">Default</span>}</div>
                    <p>{addr.line}</p>
                  </div>
                  <div className="address-actions">
                    <button className="btn btn-outline btn-sm">Edit</button>
                    {!addr.default && <button className="btn btn-sm" style={{color:"var(--red)",background:"#fee2e2",border:"none"}}>Remove</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Security" && (
          <div className="profile-card">
            <h3>Change Password</h3>
            <form className="profile-form" onSubmit={e => { e.preventDefault(); alert("Password changed!"); }}>
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" required /></div>
              <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" minLength={8} required /></div>
              <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" required /></div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
            <div className="security-options">
              <div className="security-row">
                <div><strong>Two-Factor Authentication</strong><p>Add an extra layer of security</p></div>
                <button className="btn btn-outline btn-sm">Enable</button>
              </div>
              <div className="security-row danger">
                <div><strong>Delete Account</strong><p>Permanently remove your account and data</p></div>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
