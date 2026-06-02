"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Philips Series 3000/5000 Beard Trimmer", description: "Sleek charcoal black electric beard trimmer with matte finish and adjustable comb.", price: 499, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Matte Black Nose Trimmer", description: "Sleek matte black electric nose and ear hair trimmer for discreet personal grooming.", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Braun Series 5 Shaver", description: "Sleek, modern electric foil shaver for efficient and comfortable daily grooming.", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Professional Electric Wax Heater Kit (generic/unbranded)", description: "Compact electric wax warmer with melted wax for convenient at-home hair removal.", price: 99, badge: "" }
];

const techFeatures = [
  {
    id: 1,
    label: "01",
    title: "Stainless Steel Blade System",
    body: "Precision-ground stainless steel blades maintain sharpness over thousands of trims. The self-sharpening mechanism ensures consistent cutting performance without manual maintenance.",
    top: "22%",
    left: "68%",
  },
  {
    id: 2,
    label: "02",
    title: "Adjustable Comb Guide",
    body: "Integrated 20-position adjustable comb locks into each setting with a satisfying click. Range spans 0.5 mm to 10 mm for precise stubble control or full beard shaping.",
    top: "18%",
    left: "52%",
  },
  {
    id: 3,
    label: "03",
    title: "Textured Grip Zone",
    body: "Pebbled rubber-finish grip panel ensures non-slip control even with wet hands. Ergonomic geometry positions the blade at the optimal 15° angle for natural wrist movement.",
    top: "55%",
    left: "42%",
  },
  {
    id: 4,
    label: "04",
    title: "USB Rechargeable Motor",
    body: "High-efficiency DC motor delivers 6,000 RPM with consistent torque. USB-C charging provides 90 minutes of cordless runtime from a 60-minute charge cycle.",
    top: "72%",
    left: "28%",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

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

  function handleAddToCart(p: (typeof products)[0]) {
    addItem({ id: p.id, name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubscribed(true);
    setEmail("");
  }

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
        }
        .marquee-inner:hover {
          animation-play-state: paused;
        }
        .will-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.55s ease-out, transform 0.55s ease-out;
        }
        .visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .tech-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(400px, 92vw);
          background: var(--surface);
          border-left: 1px solid rgba(61,196,242,0.15);
          z-index: 200;
          padding: 48px 32px;
          transform: translateX(100%);
          transition: transform 350ms ease-out;
          overflow-y: auto;
        }
        .tech-panel.open {
          transform: translateX(0);
        }
        .tech-panel-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 199;
        }
        .tech-panel-backdrop.open {
          display: block;
        }
        .hotspot-btn {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--bg);
          color: var(--bg);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, opacity 0.2s ease;
          transform: translate(-50%, -50%);
          font-family: var(--font-body);
          z-index: 10;
        }
        .hotspot-btn:hover {
          transform: translate(-50%, -50%) scale(1.18);
        }
        .hotspot-btn.dimmed {
          opacity: 0.35;
        }
        .hotspot-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
          transform: translate(-50%, -50%) scale(1.15);
        }
        .product-rail::-webkit-scrollbar { display: none; }
        .product-rail { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hero-left { min-height: 72vw !important; }
          .hero-right { padding: 40px 24px !important; }
          .bento-grid { grid-template-columns: 1fr 1fr !important; }
          .bento-wide { grid-column: span 2 !important; }
          .manifesto-grid { grid-template-columns: 1fr !important; }
          .manifesto-img { display: none; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO: Asymmetric Split ── */}
      <section
        className="hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "60fr 40fr",
          minHeight: "100vh",
          background: "var(--bg)",
        }}
      >
        {/* Left: dark panel with product image at diagonal */}
        <div
          className="hero-left"
          style={{
            position: "relative",
            background: "var(--bg)",
            overflow: "hidden",
            minHeight: "60vmin",
          }}
        >
          {/* Subtle top-left accent rule */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "3px",
              height: "100%",
              background: "var(--primary)",
              opacity: 0.4,
            }}
          />
          {/* Product image — diagonal, bleeds off bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: "-8%",
              left: "-6%",
              width: "90%",
              transform: "rotate(-18deg)",
              transformOrigin: "bottom left",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Philips Series 3000/5000 Beard Trimmer angled view"
              style={{
                width: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
              }}
            />
          </div>
          {/* Trust strip bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polygon points="6,0.5 7.5,4.5 12,4.8 8.8,7.6 9.9,12 6,9.5 2.1,12 3.2,7.6 0,4.8 4.5,4.5" fill="var(--accent)"/>
                </svg>
              ))}
              <span style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-body)" }}>
                4.7 · 4,800+ verified buyers
              </span>
            </div>
            <span style={{ color: "var(--muted)", fontSize: "11px", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Free delivery above ₹499
            </span>
          </div>
        </div>

        {/* Right: headline panel */}
        <div
          className="hero-right"
          style={{
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 56px 80px 48px",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "20px",
            }}
          >
            Men's Grooming
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 0.97,
              color: "var(--text)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            PRECISION<br />
            <span style={{ color: "var(--primary)" }}>IN</span><br />
            EVERY<br />
            TRIM.
          </h1>
          {/* Gold accent rule */}
          <div style={{ width: "48px", height: "2px", background: "var(--accent)", margin: "28px 0" }} />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "var(--muted)",
              maxWidth: "320px",
              margin: "0 0 36px",
            }}
          >
            Engineering-grade stainless steel blades. 20 precision length settings. USB-rechargeable for 90 minutes of cordless performance.
          </p>

          {/* Spec chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
            {["20 Settings", "90-Min Runtime", "USB-C Charge", "Stainless Blades"].map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  border: "1px solid rgba(61,196,242,0.3)",
                  borderRadius: "2px",
                  color: "var(--primary)",
                  background: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              background: "var(--primary)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "2px",
              padding: "0 36px",
              height: "52px",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "transform 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            Discover the Series
          </button>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="var(--muted)" strokeWidth="1.2"/>
              <path d="M5 8l2 2 4-4" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)" }}>
              Trusted by over 1 Million users worldwide
            </span>
          </div>
        </div>
      </section>

      {/* ── BENTO SPEC GRID ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "12px",
            }}
          >
            Engineered Advantage
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              margin: "0 0 40px",
            }}
          >
            Built Different.
          </h2>

          <div
            className="bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gridTemplateRows: "auto auto",
              gap: "16px",
            }}
          >
            {/* Wide cell — macro blade image */}
            <div
              className="bento-wide"
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                position: "relative",
                overflow: "hidden",
                borderRadius: "4px",
                background: "var(--surface)",
                minHeight: "320px",
              }}
            >
              <img
                src="/product-1.jpg"
                alt="Close-up of trimmer blade teeth"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  position: "absolute",
                  inset: 0,
                  opacity: 0.55,
                  transition: "transform 0.6s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(19,20,21,0.92) 0%, rgba(19,20,21,0.3) 60%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "32px",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: "16px" }}>
                  <path d="M8 20h24M20 8v24" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="14" y="14" width="12" height="12" rx="1" stroke="var(--accent)" strokeWidth="1.5"/>
                </svg>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 700, color: "var(--text)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                  Precision Blades
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.6, color: "var(--muted)", margin: 0, maxWidth: "280px" }}>
                  Self-sharpening stainless steel blades engineered for clean edge definition, trim after trim.
                </p>
              </div>
            </div>

            {/* Stat cell: 20 Settings */}
            {[
              { stat: "20", unit: "Settings", desc: "Length precision from 0.5 mm to 10 mm" },
              { stat: "90", unit: "Min Runtime", desc: "Full charge lasts an entire week of daily trims" },
              { stat: "IPX5", unit: "Washable", desc: "Rinse under running water for effortless cleaning" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  borderRadius: "4px",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.25s ease",
                  cursor: "default",
                  border: "1px solid rgba(240,238,233,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2.2rem, 4vw, 3rem)",
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {item.stat}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginTop: "4px",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)", lineHeight: 1.55, margin: "16px 0 0" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div
        style={{
          background: "var(--primary)",
          overflow: "hidden",
          padding: "14px 0",
        }}
      >
        <div className="marquee-inner">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {[
                "PRECISION TRIMMING",
                "MATTE FINISH BODY",
                "SELF-SHARPENING BLADES",
                "CORDLESS FREEDOM",
                "USB-C RECHARGEABLE",
                "20 LENGTH SETTINGS",
                "90-MIN RUNTIME",
                "IPX5 WASHABLE",
              ].map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--bg)",
                      padding: "0 32px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                  </span>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── TECHNOLOGY BREAKDOWN (Visual Fingerprint) ── */}
      <section
        id="technology"
        className="reveal"
        style={{
          background: "var(--text)",
          padding: "96px 24px",
          position: "relative",
        }}
      >
        {/* Slide-in panel backdrop */}
        <div
          className={`tech-panel-backdrop${selectedFeature !== null ? " open" : ""}`}
          onClick={() => setSelectedFeature(null)}
        />
        {/* Slide-in panel */}
        <div className={`tech-panel${selectedFeature !== null ? " open" : ""}`}>
          <button
            onClick={() => setSelectedFeature(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              fontSize: "22px",
              lineHeight: 1,
              padding: "8px",
            }}
          >
            ×
          </button>
          {selectedFeature !== null && (() => {
            const f = techFeatures.find(x => x.id === selectedFeature);
            if (!f) return null;
            return (
              <>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    marginBottom: "16px",
                  }}
                >
                  Feature {f.label}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    margin: "0 0 20px",
                  }}
                >
                  {f.title}
                </h3>
                <div style={{ width: "32px", height: "2px", background: "var(--accent)", marginBottom: "20px" }} />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  {f.body}
                </p>
              </>
            );
          })()}
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "12px",
              }}
            >
              Engineering Inside
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--bg)",
                margin: "0 0 12px",
              }}
            >
              Technology Breakdown
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#666", margin: 0 }}>
              Tap any hotspot to explore the engineering behind every component.
            </p>
          </div>

          {/* Image + hotspots */}
          <div
            style={{
              position: "relative",
              maxWidth: "780px",
              margin: "0 auto",
              borderRadius: "8px",
              overflow: "visible",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Philips Series 3000/5000 Beard Trimmer — interactive feature diagram"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "contain",
                background: "var(--text)",
                borderRadius: "8px",
                display: "block",
              }}
            />
            {techFeatures.map((f) => (
              <button
                key={f.id}
                className={`hotspot-btn${selectedFeature === f.id ? " active" : selectedFeature !== null ? " dimmed" : ""}`}
                style={{ top: f.top, left: f.left }}
                onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                aria-label={`Feature ${f.label}: ${f.title}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "#999",
              marginTop: "20px",
              letterSpacing: "0.08em",
            }}
          >
            SELECT A HOTSPOT TO EXPLORE
          </p>
        </div>
      </section>

      {/* ── BRAND MANIFESTO (Asymmetric Split) ── */}
      <section
        className="reveal manifesto-grid"
        style={{
          background: "var(--bg)",
          padding: "96px 24px",
          display: "grid",
          gridTemplateColumns: "65fr 35fr",
          gap: "48px",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <div style={{ paddingRight: "16px" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "16px",
            }}
          >
            Our Philosophy
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: "0 0 0",
            }}
          >
            We Sell Handsomeness.
          </h2>
          {/* Accent underline */}
          <div style={{ width: "56px", height: "2px", background: "var(--primary)", margin: "24px 0" }} />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "17px",
              lineHeight: 1.75,
              color: "var(--muted)",
              margin: "0 0 24px",
              maxWidth: "520px",
            }}
          >
            Great grooming isn't about vanity — it's about control. Every millimetre of precision you achieve with the right tool translates directly to confidence in every room you walk into.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--muted)",
              margin: "0 0 36px",
              maxWidth: "480px",
            }}
          >
            We source and curate only grooming instruments that meet our single non-negotiable standard: measurable, repeatable precision. Nothing superfluous. No excess words. Just function and form.
          </p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "transparent",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: "2px",
              padding: "0 32px",
              height: "48px",
              cursor: "pointer",
              transition: "transform 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            Shop the Collection
          </button>
        </div>

        <div
          className="manifesto-img"
          style={{
            overflow: "hidden",
            borderRadius: "4px",
            aspectRatio: "1/1",
          }}
        >
          <img
            src="/product-3.jpg"
            alt="Precise grooming tool held in hand — close-up"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </section>

      {/* ── CROWD FAVOURITES — Horizontal Rail ── */}
      <section
        className="reveal"
        id="bestsellers"
        style={{
          background: "var(--text)",
          padding: "80px 0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "10px",
                }}
              >
                Our Products
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--bg)",
                  margin: 0,
                }}
              >
                Crowd Favourites
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--bg)",
                border: "1px solid #1a1a1a",
                borderRadius: "2px",
                padding: "0 24px",
                height: "40px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              View All
            </button>
          </div>
        </div>

        {/* Scrollable rail */}
        <div
          className="product-rail"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "max(24px, calc((100vw - 1200px)/2 + 24px))",
            paddingRight: "24px",
            paddingBottom: "8px",
          }}
        >
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: "clamp(240px, 28vw, 300px)",
                scrollSnapAlign: "start",
                background: "#fff",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div
                style={{ overflow: "hidden", background: "#fff" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "contain",
                    background: "#fff",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  {p.tag}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--bg)",
                    margin: "0 0 4px",
                    lineHeight: 1.3,
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                >
                  {p.name}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#777", margin: "0 0 12px", lineHeight: 1.45 }}>
                  {p.description.split(".")[0]}.
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      background: addedId === p.id ? "var(--bg)" : "var(--primary)",
                      color: addedId === p.id ? "#fff" : "var(--bg)",
                      border: "none",
                      borderRadius: "2px",
                      padding: "0 16px",
                      height: "36px",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {addedId === p.id ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL OFFSET FEATURE ROW ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "96px 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Left: trimmer image anchored left */}
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-24px",
                left: "-24px",
                width: "2px",
                height: "calc(100% + 48px)",
                background: "var(--accent)",
                opacity: 0.4,
              }}
            />
            <div style={{ overflow: "hidden", borderRadius: "4px" }}>
              <img
                src="/product-1.jpg"
                alt="Philips Series 3000/5000 Beard Trimmer — feature detail"
                style={{
                  width: "100%",
                  objectFit: "contain",
                  background: "var(--surface)",
                  aspectRatio: "4/5",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>

          {/* Right: numbered callouts */}
          <div>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: "12px",
              }}
            >
              Why It Works
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: "0 0 40px",
                lineHeight: 1.1,
              }}
            >
              Every Detail.<br />Intentional.
            </h2>

            {[
              {
                num: "01",
                title: "Self-Sharpening Steel Blades",
                desc: "Precision-ground to maintain 0.1 mm edge consistency over the lifetime of the device.",
              },
              {
                num: "02",
                title: "20-Position Adjustable Comb",
                desc: "Click-lock settings from 0.5 mm to 10 mm. No guesswork. No slipping mid-trim.",
              },
              {
                num: "03",
                title: "90-Min Cordless Runtime",
                desc: "Full charge in 60 minutes. One week of daily trims on a single cycle.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "24px",
                  marginBottom: "32px",
                  paddingBottom: "32px",
                  borderBottom: i < 2 ? "1px solid rgba(240,238,233,0.08)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "0.06em",
                    minWidth: "28px",
                    paddingTop: "3px",
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text)",
                      margin: "0 0 8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted)", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF EDITORIAL STRIP ── */}
      <section
        className="reveal"
        style={{
          background: "var(--text)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" style={{ marginBottom: "24px", opacity: 0.3 }}>
            <path d="M0 28V16C0 7.163 5.373 1.653 16.12 0l1.88 3.04C12.347 4.307 9.413 7.507 8.48 12H16V28H0ZM20 28V16C20 7.163 25.373 1.653 36.12 0L38 3.04C32.347 4.307 29.413 7.507 28.48 12H36V28H20Z" fill="var(--bg)"/>
          </svg>
          <blockquote
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--bg)",
              lineHeight: 1.45,
              margin: "0 0 32px",
              letterSpacing: "-0.01em",
            }}
          >
            "Used three different beard trimmers before this one. None of them held the length setting consistently past the second trim. This one locks, stays locked, and the blade stays sharp. Nothing more to say."
          </blockquote>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <polygon points="6,0.5 7.5,4.5 12,4.8 8.8,7.6 9.9,12 6,9.5 2.1,12 3.2,7.6 0,4.8 4.5,4.5" fill="var(--primary)"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--bg)" }}>
                Sudhanshu Verma
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#888", marginLeft: "8px" }}>
                Pune, Maharashtra
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#888",
              }}
            >
              4,800+ verified buyers
            </span>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA BAND ── */}
      <section
        id="contact"
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "96px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(240,238,233,0.06)",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "16px",
            }}
          >
            Stay Sharp
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text)",
              margin: "0 0 12px",
            }}
          >
            First Access.<br />No Noise.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--muted)",
              lineHeight: 1.65,
              margin: "0 0 36px",
            }}
          >
            New arrivals, exclusive pricing, and grooming guides — delivered to your inbox when it matters.
          </p>

          {subscribed ? (
            <div
              style={{
                padding: "20px 32px",
                background: "rgba(61,196,242,0.1)",
                border: "1px solid rgba(61,196,242,0.3)",
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              ✓ You're on the list. We'll be in touch.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "460px",
                  gap: "0",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: "1 1 240px",
                    height: "52px",
                    padding: "0 20px",
                    background: "rgba(240,238,233,0.08)",
                    border: "1px solid rgba(240,238,233,0.15)",
                    borderRadius: "2px",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    outline: "none",
                    minWidth: "0",
                  }}
                />
                <button
                  type="submit"
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  style={{
                    height: "52px",
                    padding: "0 28px",
                    background: "var(--primary)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "2px",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Subscribe
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)" }}>
                No spam. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}