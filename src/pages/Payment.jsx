import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

const METHODS = [
  { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when delivered" },
];

export default function Payment({ cart }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("SBI");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const subtotal = (cart || []).reduce((a, i) => a + i.price * i.qty, 0) || 846;
  const delivery = subtotal >= 499 ? 0 : 50;
  const total = subtotal + delivery;

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 2200);
  };

  if (done) return (
    <div className="page-wrapper">
      <div className="payment-success">
        <div className="success-circle">✅</div>
        <h2>Payment Successful!</h2>
        <p>Your order <strong>MN-{Date.now().toString().slice(-6)}</strong> has been placed.</p>
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
              <button type="submit" className={"btn btn-primary btn-lg btn-block pay-btn" + (processing ? " loading" : "")}>
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
                <div className="summary-item" key={item.id}>
                  <span>{item.name} ×{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              )) : (
                <>
                  <div className="summary-item"><span>Paracetamol 500mg ×2</span><span>₹90</span></div>
                  <div className="summary-item"><span>Vitamin D3 60000 IU ×1</span><span>₹140</span></div>
                  <div className="summary-item"><span>Cetirizine 10mg ×1</span><span>₹35</span></div>
                </>
              )}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="summary-row"><span>Delivery</span><span className={delivery===0?"free":""}>{delivery===0?"FREE":"₹"+delivery}</span></div>
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
