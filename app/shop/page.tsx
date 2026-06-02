"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Philips Series 3000/5000 Beard Trimmer", description: "Sleek charcoal black electric beard trimmer with matte finish and adjustable comb.", price: 499, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Matte Black Nose Trimmer", description: "Sleek matte black electric nose and ear hair trimmer for discreet personal grooming.", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Braun Series 5 Shaver", description: "Sleek, modern electric foil shaver for efficient and comfortable daily grooming.", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Professional Electric Wax Heater Kit (generic/unbranded)", description: "Compact electric wax warmer with melted wax for convenient at-home hair removal.", price: 99, badge: "" }
];

const filters = ["All", "Trimmers", "Shavers", "Accessories"];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };
  const [activeFilter, setActiveFilter] = useState("All");
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  function handleAddToCart(p: typeof products[0]) {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  }

  const filtered = activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);

  async function handleSubscribe() {
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── PAGE HERO BAND ─────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid rgba(240,238,233,0.07)",
          paddingTop: "100px",
          paddingBottom: "48px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "12px",
            }}
          >
            Full Collection
          </p>

          {/* Headline + subtitle row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: 0,
              }}
            >
              The Full Arsenal.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.6,
                maxWidth: "360px",
                margin: 0,
              }}
            >
              Every tool engineered for precision. Trimmers, shavers, and grooming essentials — one curated range.
            </p>
          </div>

          {/* Trust bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
              fontSize: "0.8rem",
              color: "var(--muted)",
              paddingBottom: "32px",
              borderBottom: "1px solid rgba(240,238,233,0.07)",
              marginBottom: "32px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              4.8 · 4,800+ verified buyers
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Free delivery above ₹499
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              1-year warranty on all products
            </span>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  padding: "7px 18px",
                  borderRadius: "999px",
                  border: activeFilter === f ? "none" : "1px solid rgba(240,238,233,0.15)",
                  background: activeFilter === f ? "var(--primary)" : "transparent",
                  color: activeFilter === f ? "var(--bg)" : "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  whiteSpace: "nowrap",
                  minHeight: "36px",
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== f) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(240,238,233,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== f) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(240,238,233,0.15)";
                  }
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ───────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          paddingTop: "64px",
          paddingBottom: "80px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Section label */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "32px",
            }}
          >
            {activeFilter === "All" ? "All Products" : activeFilter} — {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "24px",
            }}
          >
            {filtered.map((p) => (
              <article
                key={p.id}
                style={{
                  background: "var(--surface)",
                  borderRadius: "8px",
                  border: "1px solid rgba(240,238,233,0.06)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.32)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.18)";
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--text)",
                    aspectRatio: "4/5",
                  }}
                  onClick={() =>
                    router.push(
                      `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                    )
                  }
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.6s ease",
                      display: "block",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  {/* Badge */}
                  {p.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "var(--accent)",
                        color: "var(--bg)",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "4px 10px",
                        borderRadius: "2px",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  {/* Quick View overlay button */}
                  <div
                    className="quick-view-btn"
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.92)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      );
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>

                {/* Card content */}
                <div
                  style={{
                    padding: "20px 20px 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      margin: "0 0 6px",
                    }}
                  >
                    {p.category}
                  </p>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      color: "var(--text)",
                      margin: "0 0 6px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      )
                    }
                  >
                    {p.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      lineHeight: 1.5,
                      margin: "0 0 10px",
                    }}
                  >
                    {p.spec}
                  </p>

                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      margin: "0 0 16px",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>

                  {/* Actions row */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    <button
                      onClick={() =>
                        router.push(
                          `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                        )
                      }
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid rgba(240,238,233,0.2)",
                        background: "transparent",
                        color: "var(--text)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.18s ease, color 0.18s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(240,238,233,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "4px",
                        border: "none",
                        background: addedIds[p.id] ? "var(--muted)" : "var(--primary)",
                        color: "var(--bg)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background 0.18s ease, transform 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                      }}
                      onMouseDown={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                      }}
                    >
                      {addedIds[p.id] ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO SPEC GRID ─────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          borderTop: "1px solid rgba(240,238,233,0.07)",
          borderBottom: "1px solid rgba(240,238,233,0.07)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "12px",
            }}
          >
            Engineering
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "40px",
              lineHeight: 1.1,
            }}
          >
            Built for precision.
          </h2>

          {/* Bento grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gridAutoRows: "220px",
              gap: "16px",
            }}
          >
            {/* Wide tile — product macro */}
            <div
              style={{
                gridColumn: "span 2",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
                background: "var(--bg)",
              }}
            >
              <img
                src="/product-1.jpg"
                alt="Philips Series 3000 blade macro"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.6,
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(19,20,21,0.85) 0%, rgba(19,20,21,0.2) 100%)",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    marginBottom: "8px",
                  }}
                >
                  Precision Blade System
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  Self-sharpening
                  <br />stainless steel
                </h3>
              </div>
            </div>

            {/* Stat tile — 20 settings */}
            <div
              style={{
                borderRadius: "8px",
                background: "var(--bg)",
                border: "1px solid rgba(240,238,233,0.07)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Settings
              </p>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(3rem, 5vw, 4.5rem)",
                    fontWeight: 700,
                    color: "var(--accent)",
                    margin: 0,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  20
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    marginTop: "6px",
                  }}
                >
                  Adjustable length positions from 0.5 mm to 10 mm
                </p>
              </div>
            </div>

            {/* Stat tile — 90 min */}
            <div
              style={{
                borderRadius: "8px",
                background: "var(--bg)",
                border: "1px solid rgba(240,238,233,0.07)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Runtime
              </p>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(3rem, 5vw, 4.5rem)",
                    fontWeight: 700,
                    color: "var(--primary)",
                    margin: 0,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  90
                  <span style={{ fontSize: "1.4rem", fontWeight: 600, letterSpacing: 0 }}>min</span>
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    marginTop: "6px",
                  }}
                >
                  Cordless runtime from a single USB-C charge
                </p>
              </div>
            </div>

            {/* Stat tile — IPX5 */}
            <div
              style={{
                borderRadius: "8px",
                background: "var(--bg)",
                border: "1px solid rgba(240,238,233,0.07)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Water resistance
              </p>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  IPX5
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    marginTop: "6px",
                  }}
                >
                  Fully washable blade head under running water
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ──────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--primary)",
          padding: "14px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: "0",
            animation: "marquee 22s linear infinite",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--bg)",
              }}
            >
              {[
                "Precision Trimming",
                "Matte Finish",
                "Self-Sharpening Blades",
                "Cordless Freedom",
                "USB-C Charging",
                "IPX5 Waterproof",
                "20 Length Settings",
                "90-Min Runtime",
              ].map((item, j) => (
                <span key={j} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ padding: "0 28px" }}>{item}</span>
                  <span style={{ color: "var(--bg)", opacity: 0.4, fontSize: "1rem" }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>

      {/* ── EDITORIAL ASYMMETRIC SPLIT — Brand Manifesto ─────────── */}
      <section
        className="reveal"
        style={{
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Text column */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: "16px",
              }}
            >
              Our Philosophy
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text)",
                marginBottom: "0",
                paddingBottom: "20px",
                borderBottom: "2px solid var(--accent)",
                display: "inline-block",
              }}
            >
              Engineered
              <br />for the man
              <br />who means it.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--muted)",
                marginTop: "28px",
                maxWidth: "480px",
              }}
            >
              We don't sell grooming tools. We sell the confidence that comes from knowing every detail is handled — precisely, reliably, and without compromise. Every product in our range is selected for one reason: it performs exactly as stated, every single time.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                marginTop: "36px",
                padding: "14px 36px",
                background: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
            >
              Shop the Collection
            </button>
          </div>

          {/* Image column */}
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              aspectRatio: "1/1",
              background: "var(--bg)",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Philips trimmer precision close-up"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "brightness(0.85)",
                transition: "transform 0.6s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS HORIZONTAL RAIL ─────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          paddingTop: "80px",
          paddingBottom: "80px",
          borderTop: "1px solid rgba(240,238,233,0.07)",
          borderBottom: "1px solid rgba(240,238,233,0.07)",
        }}
      >
        <div
          style={{
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
            maxWidth: "1280px",
            margin: "0 auto",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Our Bestsellers
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: 0,
              }}
            >
              Crowd Favourites
            </h2>
            <button
              onClick={() => router.push("/shop")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable rail */}
        <div
          style={{
            paddingLeft: "clamp(20px, 5vw, 80px)",
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "8px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: "280px",
                scrollSnapAlign: "start",
                background: "var(--bg)",
                borderRadius: "8px",
                border: "1px solid rgba(240,238,233,0.07)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.25s ease",
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  background: "var(--text)",
                  height: "182px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    margin: "0 0 4px",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    margin: "0 0 10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.spec}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    style={{
                      padding: "6px 14px",
                      background: addedIds[p.id] ? "var(--muted)" : "var(--primary)",
                      color: "var(--bg)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background 0.18s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {addedIds[p.id] ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Rail padding right */}
          <div style={{ flex: "0 0 clamp(20px, 5vw, 80px)" }} />
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────── */}
      <section
        className="reveal"
        id="contact"
        style={{
          background: "var(--bg)",
          paddingTop: "100px",
          paddingBottom: "100px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Start Today
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            Precision in
            <br />
            <span style={{ color: "var(--primary)" }}>every trim.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            No guesswork. No excess. Just tools that perform exactly as stated — the first time, every time.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "16px 48px",
              background: "var(--primary)",
              color: "var(--bg)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 700,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
          >
            Discover the Series
          </button>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginTop: "16px",
            }}
          >
            Free delivery above ₹499 · 1-year warranty · 30-day returns
          </p>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          borderTop: "1px solid rgba(240,238,233,0.07)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "12px",
            }}
          >
            Stay Connected
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "10px",
            }}
          >
            New arrivals, early access.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Get exclusive offers and spec updates directly in your inbox. No spam — just signal.
          </p>

          {subscribed ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              ✓ You're in. We'll be in touch.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                style={{
                  height: "52px",
                  flex: "1 1 240px",
                  maxWidth: "320px",
                  borderRadius: "4px",
                  border: "1px solid rgba(240,238,233,0.15)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  padding: "0 16px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubscribe}
                style={{
                  height: "52px",
                  padding: "0 28px",
                  background: "var(--primary)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .reveal { opacity: 1; transform: translateY(0); }
        .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease-out, transform 0.55s ease-out; }
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
        article:hover .quick-view-btn { opacity: 1 !important; }
        ::-webkit-scrollbar { height: 4px; background: var(--surface); }
        ::-webkit-scrollbar-thumb { background: rgba(240,238,233,0.12); border-radius: 2px; }
        *:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
      `}</style>
    </div>
  );
}