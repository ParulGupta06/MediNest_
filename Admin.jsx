import { useState } from "react";
import { medicines as initialMeds } from "../data/medicines";
import "./Admin.css";

const mockOrders = [
  { id:"ORD001", customer:"Priya Sharma", items:3, total:320, status:"Delivered", date:"2024-03-01" },
  { id:"ORD002", customer:"Rahul Verma", items:1, total:180, status:"Processing", date:"2024-03-05" },
  { id:"ORD003", customer:"Anjali Nair", items:5, total:750, status:"Shipped", date:"2024-03-06" },
  { id:"ORD004", customer:"Kunal Mehta", items:2, total:95, status:"Pending", date:"2024-03-08" },
];

const mockPrescriptions = [
  { id:"RX001", patient:"Ravi Kumar", email:"ravi@email.com", medicine:"Amoxicillin 250mg", date:"2024-03-08", status:"Pending", file:"prescription_ravi.jpg", notes:"Ear infection" },
  { id:"RX002", patient:"Sonal Mehta", email:"sonal@email.com", medicine:"Metformin 500mg", date:"2024-03-07", status:"Approved", file:"prescription_sonal.pdf", notes:"Diabetes management" },
  { id:"RX003", patient:"Arjun Das", email:"arjun@email.com", medicine:"Azithromycin 500mg", date:"2024-03-09", status:"Pending", file:"prescription_arjun.jpg", notes:"Chest infection" },
  { id:"RX004", patient:"Meena Rao", email:"meena@email.com", medicine:"Atorvastatin 10mg", date:"2024-03-06", status:"Rejected", file:"prescription_meena.pdf", notes:"Unclear prescription" },
];

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [meds, setMeds] = useState(initialMeds);
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [newMed, setNewMed] = useState({ name:"", brand:"", category:"Pain Relief", price:"", stock:"" });

  const deleteMed = (id) => { if(window.confirm("Delete this medicine?")) setMeds(meds.filter(m => m.id !== id)); };
  const addMed = (e) => {
    e.preventDefault();
    setMeds([...meds, { id: Date.now(), ...newMed, price: Number(newMed.price), stock: Number(newMed.stock), originalPrice: Number(newMed.price), rating: 4.0, reviews: 0, image: `https://placehold.co/280x200/dbeafe/1d4ed8?text=${encodeURIComponent(newMed.name)}`, prescription: false, substitutes: [], description: "", dosage: "", sideEffects: "", manufacturer: "Unknown", expiryDate: "2026-12" }]);
    setNewMed({ name:"", brand:"", category:"Pain Relief", price:"", stock:"" });
    alert("Medicine added!");
  };

  const updateRx = (id, status) => setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status } : rx));

  const totalStock = meds.reduce((a, m) => a + m.stock, 0);
  const lowStock = meds.filter(m => m.stock < 50).length;
  const pendingRx = prescriptions.filter(rx => rx.status === "Pending").length;

  const tabs = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "add", label: "➕ Add Medicine" },
    { key: "medicines", label: "💊 Manage Medicines" },
    { key: "orders", label: "📦 Orders" },
    { key: "prescriptions", label: "📋 Prescriptions" },
    { key: "stock", label: "📈 Stock" },
  ];

  const rxStatusColor = { Pending: "yellow", Approved: "green", Rejected: "red" };

  return (
    <div className="page-wrapper">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">🏥 MediNest<br /><small>Admin Panel</small></div>
          {tabs.map(t => (
            <button key={t.key} className={"admin-tab" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>
              {t.label}
              {t.key === "prescriptions" && pendingRx > 0 && <span className="tab-badge">{pendingRx}</span>}
            </button>
          ))}
        </aside>

        <main className="admin-main">
          {tab === "dashboard" && (
            <div>
              <h1 className="admin-page-title">Dashboard</h1>
              <div className="stats-grid">
                <div className="stat-card blue"><div className="stat-icon">💊</div><div><strong>{meds.length}</strong><p>Total Medicines</p></div></div>
                <div className="stat-card green"><div className="stat-icon">📦</div><div><strong>{mockOrders.length}</strong><p>Total Orders</p></div></div>
                <div className="stat-card yellow"><div className="stat-icon">⚠️</div><div><strong>{lowStock}</strong><p>Low Stock</p></div></div>
                <div className="stat-card purple"><div className="stat-icon">📋</div><div><strong>{pendingRx}</strong><p>Pending Rx</p></div></div>
              </div>
              <div className="recent-orders">
                <h2>Recent Orders</h2>
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {mockOrders.map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td><td>{o.customer}</td><td>{o.items}</td><td>₹{o.total}</td>
                        <td><span className={"status-badge status-" + o.status.toLowerCase()}>{o.status}</span></td>
                        <td>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "add" && (
            <div>
              <h1 className="admin-page-title">Add New Medicine</h1>
              <form className="admin-form" onSubmit={addMed}>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Medicine Name</label><input className="form-input" value={newMed.name} onChange={e => setNewMed({...newMed, name:e.target.value})} placeholder="e.g. Paracetamol 500mg" required /></div>
                  <div className="form-group"><label className="form-label">Brand</label><input className="form-input" value={newMed.brand} onChange={e => setNewMed({...newMed, brand:e.target.value})} placeholder="e.g. Calpol" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Category</label>
                    <select className="form-input" value={newMed.category} onChange={e => setNewMed({...newMed, category:e.target.value})}>
                      {["Pain Relief","Antibiotics","Allergy","Diabetes","Digestive","Vitamins","Cardiovascular"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={newMed.price} onChange={e => setNewMed({...newMed, price:e.target.value})} placeholder="e.g. 45" required /></div>
                </div>
                <div className="form-group"><label className="form-label">Stock Quantity</label><input className="form-input" type="number" value={newMed.stock} onChange={e => setNewMed({...newMed, stock:e.target.value})} placeholder="e.g. 100" required /></div>
                <button type="submit" className="btn btn-primary btn-lg">Add Medicine</button>
              </form>
            </div>
          )}

          {tab === "medicines" && (
            <div>
              <h1 className="admin-page-title">Manage Medicines ({meds.length})</h1>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
                <tbody>
                  {meds.map(m => (
                    <tr key={m.id}>
                      <td><strong>{m.name}</strong></td><td>{m.brand}</td>
                      <td><span className="badge badge-blue">{m.category}</span></td>
                      <td>₹{m.price}</td>
                      <td><span className={m.stock < 50 ? "low-stock-text" : ""}>{m.stock}</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteMed(m.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h1 className="admin-page-title">All Orders</h1>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {mockOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td><td>{o.customer}</td><td>{o.items}</td><td>₹{o.total}</td>
                      <td><span className={"status-badge status-" + o.status.toLowerCase()}>{o.status}</span></td>
                      <td>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "prescriptions" && (
            <div>
              <h1 className="admin-page-title">Prescription Verification</h1>
              <div className="rx-summary-row">
                <div className="rx-stat rx-pending"><strong>{prescriptions.filter(r=>r.status==="Pending").length}</strong><span>Pending</span></div>
                <div className="rx-stat rx-approved"><strong>{prescriptions.filter(r=>r.status==="Approved").length}</strong><span>Approved</span></div>
                <div className="rx-stat rx-rejected"><strong>{prescriptions.filter(r=>r.status==="Rejected").length}</strong><span>Rejected</span></div>
              </div>
              <div className="rx-cards">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="rx-admin-card">
                    <div className="rx-card-header">
                      <div>
                        <div className="rx-id">{rx.id}</div>
                        <div className="rx-patient"><strong>{rx.patient}</strong> · {rx.email}</div>
                        <div className="rx-medicine">💊 {rx.medicine}</div>
                        <div className="rx-date">📅 {rx.date}</div>
                        {rx.notes && <div className="rx-notes">📝 {rx.notes}</div>}
                      </div>
                      <span className={"status-badge status-" + rxStatusColor[rx.status]}>{rx.status}</span>
                    </div>
                    <div className="rx-file-preview">
                      <span>📄 {rx.file}</span>
                      <button className="btn btn-outline btn-sm">View File</button>
                    </div>
                    {rx.status === "Pending" && (
                      <div className="rx-action-row">
                        <button className="btn btn-secondary btn-sm" onClick={() => updateRx(rx.id, "Approved")}>✅ Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateRx(rx.id, "Rejected")}>❌ Reject</button>
                      </div>
                    )}
                    {rx.status !== "Pending" && (
                      <div className="rx-action-row">
                        <button className="btn btn-outline btn-sm" onClick={() => updateRx(rx.id, "Pending")}>↩ Reset to Pending</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "stock" && (
            <div>
              <h1 className="admin-page-title">Stock Management</h1>
              <table className="admin-table">
                <thead><tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Status</th></tr></thead>
                <tbody>
                  {meds.sort((a,b) => a.stock - b.stock).map(m => (
                    <tr key={m.id}>
                      <td><strong>{m.name}</strong></td><td>{m.category}</td><td>{m.stock}</td>
                      <td><span className={"status-badge " + (m.stock===0?"status-pending":m.stock<50?"status-processing":"status-delivered")}>
                        {m.stock===0?"Out of Stock":m.stock<50?"Low Stock":"In Stock"}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
