import { useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

const mockOrders = [
  {
    id: "MN-20240301-001", date: "2024-03-01", status: "Delivered",
    items: [{ name: "Paracetamol 500mg", qty: 2, price: 45 }, { name: "Vitamin D3 60000 IU", qty: 1, price: 140 }],
    total: 280, address: "123 Health St, Mumbai", deliveredOn: "2024-03-02",
  },
  {
    id: "MN-20240305-002", date: "2024-03-05", status: "Shipped",
    items: [{ name: "Azithromycin 500mg", qty: 1, price: 180 }],
    total: 230, address: "123 Health St, Mumbai", deliveredOn: null,
  },
  {
    id: "MN-20240308-003", date: "2024-03-08", status: "Processing",
    items: [{ name: "Cetirizine 10mg", qty: 3, price: 35 }, { name: "Omeprazole 20mg", qty: 1, price: 75 }],
    total: 230, address: "123 Health St, Mumbai", deliveredOn: null,
  },
  {
    id: "MN-20240309-004", date: "2024-03-09", status: "Pending",
    items: [{ name: "Metformin 500mg", qty: 2, price: 95 }],
    total: 240, address: "123 Health St, Mumbai", deliveredOn: null,
  },
];

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const statusColor = { Delivered: "green", Shipped: "blue", Processing: "yellow", Pending: "red" };

export default function Orders() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const order = mockOrders.find(o => o.id === selected);
    const stepIdx = STEPS.indexOf(order.status);
    return (
      <div className="page-wrapper">
        <div className="container orders-container">
          <button className="back-btn" onClick={() => setSelected(null)}>← Back to Orders</button>
          <div className="order-detail-card">
            <div className="order-detail-header">
              <div>
                <h2>{order.id}</h2>
                <p className="order-meta">Placed on {order.date} · {order.items.length} item(s)</p>
              </div>
              <span className={"status-pill status-" + statusColor[order.status]}>{order.status}</span>
            </div>

            <div className="tracker">
              <div className="tracker-bar">
                {STEPS.map((step, i) => (
                  <div key={step} className={"tracker-step" + (i <= stepIdx ? " done" : "")}>
                    <div className="tracker-dot">{i <= stepIdx ? "✓" : i + 1}</div>
                    <span>{step}</span>
                    {i < STEPS.length - 1 && <div className={"tracker-line" + (i < stepIdx ? " done" : "")}></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-detail-body">
              <div className="order-items-section">
                <h3>Items Ordered</h3>
                {order.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <div className="order-item-icon">💊</div>
                    <div className="order-item-info">
                      <strong>{item.name}</strong>
                      <span>Qty: {item.qty}</span>
                    </div>
                    <div className="order-item-price">₹{item.price * item.qty}</div>
                  </div>
                ))}
                <div className="order-total-row">
                  <span>Delivery</span><span className="free">FREE</span>
                </div>
                <div className="order-total-row grand">
                  <span>Total Paid</span><span>₹{order.total}</span>
                </div>
              </div>
              <div className="order-info-section">
                <div className="info-block">
                  <h4>📍 Delivery Address</h4>
                  <p>{order.address}</p>
                </div>
                {order.deliveredOn && (
                  <div className="info-block">
                    <h4>✅ Delivered On</h4>
                    <p>{order.deliveredOn}</p>
                  </div>
                )}
                <div className="info-block">
                  <h4>💳 Payment</h4>
                  <p>Paid online · ₹{order.total}</p>
                </div>
                <Link
                  to={"/invoice/" + order.id}
                  className="btn btn-outline btn-block"
                  style={{marginTop: "16px"}}
                >
                  📄 Download Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="orders-hero">
        <div className="container"><h1>My Orders</h1><p>Track and manage all your medicine orders</p></div>
      </div>
      <div className="container orders-container">
        {mockOrders.length === 0 ? (
          <div className="empty-orders">
            <span>📦</span>
            <h3>No orders yet</h3>
            <Link to="/medicines" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {mockOrders.map(order => (
              <div className="order-card" key={order.id} onClick={() => setSelected(order.id)}>
                <div className="order-card-top">
                  <div>
                    <div className="order-id">{order.id}</div>
                    <div className="order-date">Placed: {order.date}</div>
                  </div>
                  <span className={"status-pill status-" + statusColor[order.status]}>{order.status}</span>
                </div>
                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <span key={i} className="order-item-tag">💊 {item.name} ×{item.qty}</span>
                  ))}
                </div>
                <div className="order-card-footer">
                  <span className="order-total-label">Total: <strong>₹{order.total}</strong></span>
                  <span className="view-details-link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
