import { useEffect, useState } from "react";
import { createMedicine, deleteMedicine, getMedicines } from "../services/medicineApi";
import { getPrescriptions, updatePrescriptionStatus } from "../services/prescriptionApi";
import { getOrders } from "../services/orderApi";
import "./Admin.css";

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [meds, setMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newMed, setNewMed] = useState({ name:"", brand:"", category:"Pain Relief", price:"", stock:"" });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [allMeds, allPrescriptions, allOrders] = await Promise.all([
        getMedicines(),
        getPrescriptions().catch(() => []), // Admin-only: ignore error if regular user loaded
        getOrders().catch(() => [])         // Admin-only/User orders
      ]);
      
      setMeds(allMeds);
      setPrescriptions(allPrescriptions);
      setOrders(allOrders);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMed = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      setMeds((prev) => prev.filter((m) => (m._id || m.id) !== id));
      alert("Medicine deleted successfully!");
    } catch (err) {
      console.error("Failed to delete medicine:", err);
      alert("Could not delete medicine.");
    }
  };

  const addMed = async (e) => {
    e.preventDefault();
    try {
      const created = await createMedicine(newMed);
      setMeds((prev) => [created, ...prev]);
      setNewMed({ name:"", brand:"", category:"Pain Relief", price:"", stock:"" });
      alert("Medicine added!");
    } catch (err) {
      console.error("Failed to add medicine:", err);
      alert("Could not add medicine.");
    }
  };

  const updateRx = async (id, status) => {
    try {
      await updatePrescriptionStatus(id, status);
      setPrescriptions(prev => prev.map(rx => (rx._id || rx.id) === id ? { ...rx, status } : rx));
      alert(`Prescription status set to ${status}!`);
    } catch (err) {
      console.error("Failed to update prescription status:", err);
      alert("Failed to update status.");
    }
  };

  const totalStock = meds.reduce((a, m) => a + Number(m.stock || 0), 0);
  const lowStock = meds.filter(m => Number(m.stock || 0) < 50).length;
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

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: "120px" }}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

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
                <div className="stat-card green"><div className="stat-icon">📦</div><div><strong>{orders.length}</strong><p>Total Orders</p></div></div>
                <div className="stat-card yellow"><div className="stat-icon">⚠️</div><div><strong>{lowStock}</strong><p>Low Stock</p></div></div>
                <div className="stat-card purple"><div className="stat-icon">📋</div><div><strong>{pendingRx}</strong><p>Pending Rx</p></div></div>
              </div>
              <div className="recent-orders">
                <h2>Recent Orders</h2>
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => {
                      const orderId = o._id || o.id;
                      const orderDate = new Date(o.createdAt).toLocaleDateString();
                      return (
                        <tr key={orderId}>
                          <td><strong>#{orderId}</strong></td>
                          <td>{o.items.length} item(s)</td>
                          <td>₹{o.total}</td>
                          <td><span className={"status-badge status-" + o.status.toLowerCase()}>{o.status}</span></td>
                          <td>{orderDate}</td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} style={{textAlign: "center", fontStyle: "italic"}}>No orders registered in the system yet.</td></tr>
                    )}
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
                      {["Pain Relief","Antibiotics","Allergy","Diabetes","Digestive","Vitamins","Cardiovascular"].map(c => <option key={c} value={c}>{c}</option>)}
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
                  {meds.map(m => {
                    const currentId = m._id || m.id;
                    return (
                      <tr key={currentId}>
                        <td><strong>{m.name}</strong></td><td>{m.brand}</td>
                        <td><span className="badge badge-blue">{m.category}</span></td>
                        <td>₹{m.price}</td>
                        <td><span className={m.stock < 50 ? "low-stock-text" : ""}>{m.stock}</span></td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => deleteMed(currentId)}>Delete</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h1 className="admin-page-title">All Orders ({orders.length})</h1>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(o => {
                    const orderId = o._id || o.id;
                    const orderDate = new Date(o.createdAt).toLocaleDateString();
                    return (
                      <tr key={orderId}>
                        <td><strong>#{orderId}</strong></td>
                        <td>{o.items.length} item(s)</td>
                        <td>₹{o.total}</td>
                        <td><span className={"status-badge status-" + o.status.toLowerCase()}>{o.status}</span></td>
                        <td>{orderDate}</td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign:"center", fontStyle:"italic"}}>No orders registered in the system.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "prescriptions" && (
            <div>
              <h1 className="admin-page-title">Prescription Verification ({prescriptions.length})</h1>
              <div className="rx-summary-row">
                <div className="rx-stat rx-pending"><strong>{prescriptions.filter(r=>r.status==="Pending").length}</strong><span>Pending</span></div>
                <div className="rx-stat rx-approved"><strong>{prescriptions.filter(r=>r.status==="Approved").length}</strong><span>Approved</span></div>
                <div className="rx-stat rx-rejected"><strong>{prescriptions.filter(r=>r.status==="Rejected").length}</strong><span>Rejected</span></div>
              </div>
              <div className="rx-cards">
                {prescriptions.map(rx => {
                  const rxId = rx._id || rx.id;
                  const rxDate = new Date(rx.createdAt).toLocaleDateString();
                  // Point download/view file links to backend static address
                  const fileUrl = rx.filePath.startsWith("http") ? rx.filePath : `http://localhost:7000${rx.filePath}`;
                  
                  return (
                    <div key={rxId} className="rx-admin-card">
                      <div className="rx-card-header">
                        <div>
                          <div className="rx-id">Prescription ID: #{rxId}</div>
                          <div className="rx-patient"><strong>{rx.name}</strong> · {rx.email}</div>
                          {rx.phone && <div className="rx-patient">📞 {rx.phone}</div>}
                          <div className="rx-date">📅 Uploaded: {rxDate}</div>
                          {rx.notes && <div className="rx-notes">📝 Notes: {rx.notes}</div>}
                        </div>
                        <span className={"status-badge status-" + rxStatusColor[rx.status]}>{rx.status}</span>
                      </div>
                      <div className="rx-file-preview">
                        <span>📄 {rx.fileName}</span>
                        <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{textDecoration:"none", display:"inline-block", textAlign:"center"}}>View File</a>
                      </div>
                      {rx.status === "Pending" && (
                        <div className="rx-action-row">
                          <button className="btn btn-secondary btn-sm" onClick={() => updateRx(rxId, "Approved")}>✅ Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateRx(rxId, "Rejected")}>❌ Reject</button>
                        </div>
                      )}
                      {rx.status !== "Pending" && (
                        <div className="rx-action-row">
                          <button className="btn btn-outline btn-sm" onClick={() => updateRx(rxId, "Pending")}>↩ Reset to Pending</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {prescriptions.length === 0 && (
                  <p style={{textAlign:"center", fontStyle:"italic", color:"#64748b", width:"100%"}}>No prescriptions uploaded yet.</p>
                )}
              </div>
            </div>
          )}

          {tab === "stock" && (
            <div>
              <h1 className="admin-page-title">Stock Management</h1>
              <table className="admin-table">
                <thead><tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Status</th></tr></thead>
                <tbody>
                  {meds.sort((a,b) => a.stock - b.stock).map(m => {
                    const currentId = m._id || m.id;
                    return (
                      <tr key={currentId}>
                        <td><strong>{m.name}</strong></td><td>{m.category}</td><td>{m.stock}</td>
                        <td><span className={"status-badge " + (m.stock===0?"status-pending":m.stock<50?"status-processing":"status-delivered")}>
                          {m.stock===0?"Out of Stock":m.stock<50?"Low Stock":"In Stock"}
                        </span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
