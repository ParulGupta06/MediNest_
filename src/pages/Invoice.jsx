import { useParams, Link } from "react-router-dom";
import "./Invoice.css";

const mockOrders = {
  "MN-20240301-001": {
    id: "MN-20240301-001", date: "2024-03-01", deliveredOn: "2024-03-02",
    customer: { name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", address: "Flat 4B, Sunrise Apartments, Bandra West, Mumbai – 400050" },
    items: [{ name: "Paracetamol 500mg", brand: "Calpol", qty: 2, price: 45 }, { name: "Vitamin D3 60000 IU", brand: "D-Rise", qty: 1, price: 140 }],
    payment: "UPI – 9876543210@ybl",
  },
  "MN-20240305-002": {
    id: "MN-20240305-002", date: "2024-03-05", deliveredOn: null,
    customer: { name: "Rahul Verma", email: "rahul@email.com", phone: "+91 87654 32109", address: "12, Green Park Colony, Pune – 411001" },
    items: [{ name: "Azithromycin 500mg", brand: "Zithromax", qty: 1, price: 180 }],
    payment: "Credit Card – **** 4321",
  },
};

export default function Invoice() {
  const { id } = useParams();
  const rawId = id || "MN-20240301-001";
  const order = mockOrders[rawId] || mockOrders["MN-20240301-001"];

  const subtotal = order.items.reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const handlePrint = () => window.print();

  return (
    <div className="page-wrapper">
      <div className="container invoice-container">
        <div className="invoice-toolbar no-print">
          <Link to="/orders" className="btn btn-outline">← Back to Orders</Link>
          <button className="btn btn-primary" onClick={handlePrint}>🖨️ Download / Print Invoice</button>
        </div>

        <div className="invoice-box" id="invoice">
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-logo">🏥 MediNest</div>
              <p>123 Health Street, Bandra, Mumbai – 400050</p>
              <p>support@medinest.in · +91 98765 43210</p>
              <p>GSTIN: 27AABCM1234Z1Z5</p>
            </div>
            <div className="invoice-meta">
              <div className="invoice-title">TAX INVOICE</div>
              <div className="invoice-number">#{order.id}</div>
              <div className="invoice-date">Date: {order.date}</div>
              {order.deliveredOn && <div className="invoice-date">Delivered: {order.deliveredOn}</div>}
            </div>
          </div>

          <div className="invoice-parties">
            <div className="party-block">
              <h4>Bill To:</h4>
              <strong>{order.customer.name}</strong>
              <p>{order.customer.address}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
            <div className="party-block">
              <h4>Payment Method:</h4>
              <p>{order.payment}</p>
              <div className="invoice-status">✅ PAID</div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-totals">
            <div className="totals-spacer"></div>
            <div className="totals-block">
              <div className="total-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="total-row"><span>Delivery</span><span>{delivery === 0 ? "FREE" : "₹"+delivery}</span></div>
              <div className="total-row"><span>GST (5%)</span><span>₹{tax}</span></div>
              <div className="total-row grand"><span>Total Paid</span><span>₹{total}</span></div>
            </div>
          </div>

          <div className="invoice-footer">
            <div className="invoice-note">
              <strong>Note:</strong> This is a computer-generated invoice. No signature required. For queries, contact support@medinest.in
            </div>
            <div className="invoice-thanks">Thank you for choosing MediNest – Your Health, Our Priority 🏥</div>
          </div>
        </div>
      </div>
    </div>
  );
}
