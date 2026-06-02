"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], removeItem, updateQuantity, clearCart, totalPrice = 0 } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [paying, setPaying] = useState(false);
  const [payData, setPayData] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "10-digit phone number required";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "6-digit PIN code required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch (e) {
      setPaying(false);
    }
  }

  async function payNow() {
    if (!payData) return;
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [
            {
              supportedMethods: "https://tez.google.com/pay",
              data: {
                pa: payData.upiId,
                tr: payData.orderId,
                am: String(payData.amount),
                cu: "INR",
              },
            },
          ],
          {
            total: {
              label: "Total",
              amount: { currency: "INR", value: String(payData.amount) },
            },
          }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleConfirm() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "men's grooming",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart?.();
    } catch (e) {
      setConfirming(false);
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    height: "52px",
    padding: "0 16px",
    background: "var(--surface)",
    border: errors[field] ? "1.5px solid #e05252" : "1.5px solid rgba(240,238,233,0.1)",
    borderRadius: "var(--radius-md)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "8px",
  };

  if (items.length === 0 && !paid) {
    return (
      <>
        <Navbar />
        <main
          style={{
            background: "var(--bg)",
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "420px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "var(--radius-lg)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Your cart is empty
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "var(--muted)",
                lineHeight: 1.7,
                marginBottom: "32px",
              }}
            >
              Add a product to your cart before checking out.
            </p>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "14px 36px",
                background: "var(--primary)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
            >
              Start Shopping
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "80px" }}>
        {/* Page Header */}
        <div
          className="reveal"
          style={{
            borderBottom: "1px solid rgba(240,238,233,0.07)",
            padding: "40px 24px 32px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "10px",
            }}
          >
            men's grooming
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Checkout
          </h1>
        </div>

        {/* Main Grid */}
        <div
          className="reveal"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 24px 80px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* LEFT — Form */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.01em",
                marginBottom: "28px",
              }}
            >
              Delivery Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  style={inputStyle("name")}
                />
                {errors.name && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  style={inputStyle("email")}
                />
                {errors.email && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, phone: "" })); }}
                  style={inputStyle("phone")}
                />
                {errors.phone && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>Delivery Address</label>
                <textarea
                  placeholder="Flat / House No., Street, Area"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                  rows={3}
                  style={{
                    ...inputStyle("address"),
                    height: "auto",
                    padding: "14px 16px",
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
                {errors.address && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.address}</p>
                )}
              </div>

              {/* City + State */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: "" })); }}
                    style={inputStyle("city")}
                  />
                  {errors.city && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.city}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => { setState(e.target.value); setErrors((p) => ({ ...p, state: "" })); }}
                    style={inputStyle("state")}
                  />
                  {errors.state && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.state}</p>
                  )}
                </div>
              </div>

              {/* PIN */}
              <div>
                <label style={labelStyle}>PIN Code</label>
                <input
                  type="text"
                  placeholder="400001"
                  value={pin}
                  maxLength={6}
                  onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, pin: "" })); }}
                  style={inputStyle("pin")}
                />
                {errors.pin && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e05252", marginTop: "6px" }}>{errors.pin}</p>
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div
              style={{
                marginTop: "32px",
                padding: "20px",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Secure Checkout" },
                { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", label: "Fast Delivery" },
                { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "UPI / All Cards" },
              ].map((t) => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.01em",
                marginBottom: "28px",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid rgba(240,238,233,0.06)",
              }}
            >
              {/* Items */}
              <div style={{ padding: "24px" }}>
                {items.length === 0 ? (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--muted)", textAlign: "center", padding: "16px 0" }}>
                    No items in cart
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "flex-start",
                          paddingBottom: "20px",
                          borderBottom: "1px solid rgba(240,238,233,0.06)",
                        }}
                      >
                        {/* Image */}
                        <div
                          style={{
                            width: "72px",
                            height: "72px",
                            minWidth: "72px",
                            borderRadius: "var(--radius-md)",
                            background: "#fff",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "var(--text)",
                              lineHeight: 1.4,
                              marginBottom: "6px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "var(--accent)",
                              marginBottom: "10px",
                            }}
                          >
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>

                          {/* Qty Stepper + Remove */}
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0",
                                border: "1px solid rgba(240,238,233,0.12)",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                onClick={() => updateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  background: "transparent",
                                  border: "none",
                                  color: "var(--text)",
                                  fontSize: "18px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "var(--font-body)",
                                  transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,238,233,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: "32px",
                                  textAlign: "center",
                                  fontFamily: "var(--font-body)",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "var(--text)",
                                  borderLeft: "1px solid rgba(240,238,233,0.12)",
                                  borderRight: "1px solid rgba(240,238,233,0.12)",
                                  lineHeight: "36px",
                                  display: "block",
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity?.(item.id, item.quantity + 1)}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  background: "transparent",
                                  border: "none",
                                  color: "var(--text)",
                                  fontSize: "18px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "var(--font-body)",
                                  transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,238,233,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem?.(item.id)}
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(240,238,233,0.12)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--muted)",
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                                fontWeight: 500,
                                padding: "0 12px",
                                height: "36px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                whiteSpace: "nowrap",
                                transition: "color 0.15s ease, border-color 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#e05252";
                                e.currentTarget.style.borderColor = "rgba(224,82,82,0.35)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--muted)";
                                e.currentTarget.style.borderColor = "rgba(240,238,233,0.12)";
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div
                          style={{
                            minWidth: "60px",
                            textAlign: "right",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "var(--text)",
                            }}
                          >
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid rgba(240,238,233,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--muted)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "#4caf7d" }}>FREE</span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                      ₹{shipping.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                {shipping > 0 && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free shipping
                  </p>
                )}
                <div
                  style={{
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(240,238,233,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: "0 24px 24px" }}>
                <button
                  onClick={handlePay}
                  disabled={paying || items.length === 0}
                  onMouseEnter={(e) => { if (!paying) e.currentTarget.style.transform = "scale(1.01)"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: "56px",
                    background: paying ? "var(--muted)" : "var(--primary)",
                    color: paying ? "var(--text)" : "var(--bg)",
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: paying ? "not-allowed" : "pointer",
                    transition: "transform 0.15s ease, background 0.2s ease",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    letterSpacing: "0.01em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {paying ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    `Proceed to Pay — ₹${total.toLocaleString("en-IN")}`
                  )}
                </button>
              </div>

              {/* Continue Shopping */}
              <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
                <button
                  onClick={() => router.push("/shop")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(107,111,114,0.4)",
                    padding: "4px 8px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Overlay */}
        {payData && !paid && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,10,12,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "24px",
            }}
          >
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "20px",
                padding: "28px",
                width: "100%",
                maxWidth: "400px",
                boxSizing: "border-box",
                border: "1px solid rgba(240,238,233,0.1)",
                position: "relative",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  men's grooming
                </span>
                <button
                  onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                  style={{
                    background: "rgba(240,238,233,0.08)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--muted)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,238,233,0.14)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(240,238,233,0.08)")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                  Amount Due
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2rem, 6vw, 2.8rem)",
                    fontWeight: 700,
                    color: "var(--primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  ₹{payData.amount?.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Mobile: Big Pay Button */}
              {isMobile ? (
                <div style={{ marginBottom: "24px" }}>
                  {!paymentLaunched ? (
                    <button
                      onClick={payNow}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      style={{
                        width: "100%",
                        height: "56px",
                        background: "var(--primary)",
                        color: "var(--bg)",
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        marginBottom: "8px",
                      }}
                    >
                      Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                    </button>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "rgba(61,196,242,0.08)",
                        border: "1px solid rgba(61,196,242,0.25)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                        marginBottom: "8px",
                        boxSizing: "border-box",
                      }}
                    >
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--primary)", fontWeight: 600 }}>
                        Payment app opened — confirm below
                      </p>
                    </div>
                  )}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>
                    Opens Google Pay · PhonePe · Paytm
                  </p>
                </div>
              ) : (
                /* Desktop: QR Code */
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  {payData.qrBase64 ? (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "12px",
                        background: "#fff",
                        borderRadius: "var(--radius-md)",
                        marginBottom: "12px",
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${payData.qrBase64}`}
                        alt="UPI QR Code"
                        width={180}
                        height={180}
                        style={{ display: "block" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "180px",
                        height: "180px",
                        background: "rgba(240,238,233,0.05)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        border: "1px dashed rgba(240,238,233,0.15)",
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        <path d="M14 14h.01M14 17h3v3M17 14h3" />
                      </svg>
                    </div>
                  )}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)" }}>
                    Scan with any UPI app
                  </p>
                </div>
              )}

              {/* Confirm Section */}
              <div
                style={{
                  borderTop: "1px solid rgba(240,238,233,0.08)",
                  paddingTop: "20px",
                }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                  Confirm Payment
                </p>
                <input
                  type="text"
                  placeholder="UPI Transaction ID (optional)"
                  value={upiTxnId}
                  onChange={(e) => setUpiTxnId(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: "48px",
                    padding: "0 14px",
                    background: "rgba(240,238,233,0.06)",
                    border: "1.5px solid rgba(240,238,233,0.1)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    outline: "none",
                    marginBottom: "12px",
                  }}
                />
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  onMouseEnter={(e) => { if (!confirming) e.currentTarget.style.transform = "scale(1.01)"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  style={{
                    width: "100%",
                    height: "52px",
                    background: confirming ? "var(--muted)" : "var(--accent)",
                    color: "var(--bg)",
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: confirming ? "not-allowed" : "pointer",
                    transition: "transform 0.15s ease, background 0.2s ease",
                  }}
                >
                  {confirming ? "Confirming…" : "I've Paid — Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {paid && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "24px",
            }}
          >
            <div style={{ textAlign: "center", maxWidth: "400px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(76,175,125,0.12)",
                  border: "2px solid rgba(76,175,125,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 28px",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4caf7d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.025em",
                  marginBottom: "10px",
                }}
              >
                Order Confirmed!
              </h2>
              {payData?.orderId && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Order #{payData.orderId.slice(-8)}
                </p>
              )}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                We'll ship your order soon. A confirmation will be sent to your email.
              </p>
              <button
                onClick={() => router.push("/")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  padding: "14px 40px",
                  background: "var(--primary)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  marginRight: "12px",
                }}
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push("/shop")}
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "1px solid rgba(240,238,233,0.12)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "color 0.15s ease",
                  marginTop: "12px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .visible { opacity: 1; transform: translateY(0); }
        input::placeholder { color: var(--muted); font-style: italic; }
        textarea::placeholder { color: var(--muted); font-style: italic; }
        input:focus, textarea:focus { border-color: var(--primary) !important; }
      `}</style>

      <Footer />
    </>
  );
}