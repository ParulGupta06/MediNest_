import { useState } from "react";
import "./Prescription.css";

export default function Prescription() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a prescription file.");
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="page-wrapper">
      <div className="container success-state">
        <div className="success-icon">✅</div>
        <h2>Prescription Submitted!</h2>
        <p>Our pharmacist will review your prescription within 30 minutes and contact you at <strong>{form.email}</strong></p>
        <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",notes:"" }); setFile(null); }}>Submit Another</button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="rx-hero">
        <div className="container">
          <h1>Upload Prescription</h1>
          <p>Share your doctor's prescription and we'll prepare your order</p>
        </div>
      </div>
      <div className="container rx-container">
        <div className="rx-steps">
          {["Upload Prescription","We Review It","Medicine Ready","Doorstep Delivery"].map((s, i) => (
            <div className="rx-step" key={s}>
              <div className="step-num">{i+1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="rx-layout">
          <form className="rx-form card" onSubmit={handleSubmit}>
            <h2>Patient Details</h2>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Prescription *</label>
              <div className={"file-drop" + (file ? " has-file" : "")} onClick={() => document.getElementById("rxfile").click()}>
                <input type="file" id="rxfile" accept=".jpg,.jpeg,.png,.pdf" hidden onChange={(e) => setFile(e.target.files[0])} />
                <div className="file-drop-inner">
                  <span>{file ? "📄" : "📤"}</span>
                  <p>{file ? file.name : "Click to upload or drag & drop"}</p>
                  <small>{file ? `${(file.size/1024).toFixed(1)} KB` : "JPG, PNG, PDF up to 10MB"}</small>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-input" name="notes" value={form.notes} onChange={handleChange} placeholder="Any specific requirements or allergies..." rows={3} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">Submit Prescription →</button>
          </form>
          <div className="rx-info">
            <div className="rx-info-card">
              <h3>📋 How It Works</h3>
              <ul>
                <li>Upload a clear photo or PDF of your prescription</li>
                <li>Our certified pharmacist reviews it within 30 mins</li>
                <li>We confirm the medicines and pricing</li>
                <li>Order is delivered to your doorstep</li>
              </ul>
            </div>
            <div className="rx-info-card">
              <h3>✅ Accepted Formats</h3>
              <ul>
                <li>JPG / PNG (clear photo)</li>
                <li>PDF document</li>
                <li>Max file size: 10 MB</li>
                <li>Prescription must be valid and legible</li>
              </ul>
            </div>
            <div className="rx-info-card highlight">
              <h3>🔒 Your Data is Safe</h3>
              <p>All prescription data is handled with strict confidentiality and deleted after order fulfillment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
