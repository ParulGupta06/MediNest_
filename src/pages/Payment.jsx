import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderApi";
import "./Payment.css";

const METHODS = [
  { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when delivered" },
];

export default function Payment({ cart, onSuccess, onClearCart }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("SBI");
  const [shippingAddress, setShippingAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  // Load user profile default address if logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Pre-fill email or check addresses if stored in local user
        if (user.addresses && user.addresses.length > 0) {
          const defaultAddr = user.addresses.find(a => a.default) || user.addresses[0];
          if (defaultAddr) setShippingAddress(defaultAddr.line);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const subtotal = (cart || []).reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      return alert("Please enter a shipping address.");
    }
    
    setProcessing(true);
    setError("");

    try {
      const itemsPayload = (cart || []).map(item => ({
        name: item.name,
        brand: item.brand || "Generic",
        qty: item.qty,
        price: item.price,
        image: item.image
      }));

      // Fallback items if cart is empty (mock checkout prevention)
      if (itemsPayload.length === 0) {
        setProcessing(false);
        return alert("Your cart is empty!");
      }

      let paymentDetails = "Cash on Delivery";
      if (method === "upi") {
        paymentDetails = `UPI – ${upiId}`;
      } else if (method === "card") {
        paymentDetails = `Credit Card – **** ${card.number.replace(/\s/g,'').slice(-4)}`;
      } else if (method === "netbanking") {
        paymentDetails = `Net Banking – ${bank}`;
      }

      const orderData = {
        items: itemsPayload,
        subtotal,
        delivery,
        tax,
        total,
        paymentMethod: paymentDetails,
        shippingAddress
      };

      const res = await createOrder(orderData);
      setOrderId(res._id || res.id);
      setProcessing(false);
      setDone(true);
      
      // Clear Cart Callbacks
      if (onSuccess) onSuccess();
      if (onClearCart) onClearCart();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  if (done) return (
    <div className="page-wrapper">
      <div className="payment-success">
        <div className="success-circle">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order ID is <strong>#{orderId}</strong></p>
        <p className="success-sub">You will receive a confirmation shortly. Track your order in My Orders.</p>
        <div className="success-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/orders")}>Track My Order</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="payment-hero">
        <div className="container"><h1>Secure Checkout</h1><p>Your payment information is encrypted and safe</p></div>
      </div>
      <div className="container payment-container">
        <div className="payment-layout">
          <div className="payment-form-section">
            {error && (
              <div style={{
                background: "#fee2e2", color: "#b91c1c",
                padding: "10px 14px", borderRadius: "8px",
                marginBottom: "16px", fontSize: "14px"
              }}>
                ❌ {error}
              </div>
            )}

            <h2>Delivery Details</h2>
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Shipping Address *</label>
              <textarea 
                className="form-input" 
                placeholder="Enter your complete home or work shipping address..." 
                value={shippingAddress} 
                onChange={e => setShippingAddress(e.target.value)} 
                rows={3}
                required 
              />
            </div>

            <h2>Select Payment Method</h2>
            <div className="method-list">
              {METHODS.map(m => (
                <div key={m.id} className={"method-card" + (method === m.id ? " selected" : "")} onClick={() => setMethod(m.id)}>
                  <div className="method-radio">{method === m.id ? "🔵" : "⚪"}</div>
                  <span className="method-icon">{m.icon}</span>
                  <div className="method-info"><strong>{m.label}</strong><span>{m.desc}</span></div>
                </div>
              ))}
            </div>

            <form className="payment-details" onSubmit={handlePay}>
              {method === "upi" && (
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input className="form-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                  <p className="field-hint">e.g. 9876543210@ybl or name@okicici</p>
                </div>
              )}
              {method === "card" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={card.number.replace(/\s/g,'').replace(/(.{4})/g,'$1 ').trim()}
                      onChange={e => setCard({...card, number: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input className="form-input" placeholder="As on card" value={card.name} onChange={e => setCard({...card, name: e.target.value})} required />
                  </div>
                  <div className="card-row">
                    <div className="form-group">
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input className="form-input" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} required />
                    </div>
                  </div>
                </>
              )}
              {method === "netbanking" && (
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-input" value={bank} onChange={e => setBank(e.target.value)}>
                    {["SBI","HDFC","ICICI","Axis","Kotak","Punjab National Bank","Bank of Baroda"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {method === "cod" && (
                <div className="cod-note">
                  <span>💵</span>
                  <p>Pay ₹{total} in cash when your order is delivered. No extra charges for COD.</p>
                </div>
              )}
              <button type="submit" className={"btn btn-primary btn-lg btn-block pay-btn" + (processing ? " loading" : "")} disabled={processing}>
                {processing ? (
                  <span className="processing-text">🔒 Processing Payment...</span>
                ) : (
                  <span>🔒 Pay ₹{total}</span>
                )}
              </button>
              <p className="secure-note">🔐 256-bit SSL encrypted · PCI DSS compliant</p>
            </form>
          </div>

          <div className="payment-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {(cart || []).length > 0 ? cart.map(item => (
                <div className="summary-item" key={item.medicineId || item.id}>
                  <span>{item.name} ×{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              )) : (
                <div className="empty-summary">No items in cart</div>
              )}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="summary-row"><span>Delivery</span><span className={delivery===0?"free":""}>{delivery===0?"FREE":"₹"+delivery}</span></div>
            <div className="summary-row"><span>GST (5%)</span><span>₹{tax}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
            <div className="payment-trust">
              <span>🔒 Secure</span>
              <span>✅ Genuine</span>
              <span>🚚 Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
