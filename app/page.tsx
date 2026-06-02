"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
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
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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

  const selectedTech = techFeatures.find((f) => f.id === selectedFeature);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      {/* Global animation styles injected via a single class rule approach using useEffect-friendly inline trick */}
      <Navbar />

      {/* ── HERO: Split 60/40 — dark image panel left, light copy panel right ── */}
      <section
        style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns: isMobile ? undefined : "60fr 40fr",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* LEFT: Dark panel with portrait product image bleeding into right */}
        <div
          style={{
            position: "relative",
            background: "#1a1a1a",
            overflow: "hidden",
            minHeight: isMobile ? "62vw" : undefined,
            width: isMobile ? "100%" : undefined,
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Philips Series 3000/5000 Beard Trimmer — precision trimming"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              transform: isMobile ? undefined : "translateX(40px)",
              zIndex: 1,
            }}
          />
          {/* Subtle right-edge fade so image bleeds into copy panel */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "160px",
                height: "100%",
                background: "linear-gradient(to left, #1a1a1a 0%, transparent 100%)",
                zIndex: 2,
              }}
            />
          )}
          {/* Dark gradient at bottom for trust strip legibility */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
              zIndex: 3,
            }}
          />
          {/* Trust strip */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              zIndex: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <polygon
                    points="6,0.5 7.5,4.5 12,4.8 8.8,7.6 9.9,12 6,9.5 2.1,12 3.2,7.6 0,4.8 4.5,4.5"
                    fill="var(--accent)"
                  />
                </svg>
              ))}
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)",
                  marginLeft: "4px",
                }}
              >
                4.7 · 4,800+ verified buyers
              </span>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Free delivery above ₹499
            </span>
          </div>
        </div>

        {/* RIGHT: Light copy panel — product image bleeds ~80px from left via negative margin */}
        <div
          style={{
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "48px 24px 56px" : "80px 56px 80px 80px",
            position: "relative",
            zIndex: 5,
            marginLeft: isMobile ? 0 : "-80px",
            borderRadius: isMobile ? 0 : "0 0 0 0",
          }}
        >
          {/* Vertical accent rule */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? 0 : "0",
              top: isMobile ? undefined : "10%",
              bottom: isMobile ? undefined : "10%",
              width: "2px",
              background: "var(--accent)",
              opacity: 0.6,
              height: isMobile ? "2px" : undefined,
              width: isMobile ? "48px" : "2px",
              top: isMobile ? "0" : "10%",
              left: isMobile ? "24px" : "0",
            }}
          />

          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "24px",
              paddingLeft: isMobile ? 0 : "0",
            }}
          >
            Men's Grooming
          </span>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: "var(--text)",
              margin: "0 0 28px",
              textTransform: "uppercase",
            }}
          >
            PRECISION<br />
            IN<br />
            EVERY<br />
            TRIM.
          </h1>

          {/* Brass rule */}
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "var(--accent)",
              marginBottom: "24px",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "300px",
              margin: "0 0 32px",
            }}
          >
            Engineering-grade stainless steel blades. 20 precision length settings. USB-C rechargeable for 90 minutes of cordless performance.
          </p>

          {/* Spec chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
            {["20 Settings", "90-Min Runtime", "USB-C Charge", "Stainless Blades"].map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  border: "1px solid rgba(201,164,102,0.35)",
                  borderRadius: "2px",
                  color: "var(--text)",
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
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "var(--text)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "2px",
              padding: "0 36px",
              height: "56px",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "transform 0.15s ease",
              textTransform: "uppercase",
            }}
          >
            Discover the Series
          </button>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="var(--muted)" strokeWidth="1.2" />
              <path d="M5 8l2 2 4-4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)" }}>
              Trusted by over 1 Million users worldwide
            </span>
          </div>
        </div>
      </section>

      {/* ── FEATURE TRIO: BENTO_MOSAIC — 2fr 1fr 1fr grid ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Why it performs
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginTop: "8px",
                textTransform: "uppercase",
              }}
            >
              Engineered to outlast.
            </h2>
          </div>

          {/* Bento grid: 2fr 1fr 1fr, rows auto, tall tile left spans 2 rows */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
              gridTemplateRows: isMobile ? undefined : "auto auto",
              gap: "1px",
              background: "#D0CEC9",
              border: "1px solid #D0CEC9",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            {/* Tall left tile spanning 2 rows */}
            <div
              style={{
                gridRow: isMobile ? undefined : "span 2",
                background: "#F5F3EF",
                padding: "clamp(2rem, 4vw, 3rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? "200px" : "400px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1.5px solid var(--text)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  Precision Blade Architecture
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "#5A5752",
                    maxWidth: "340px",
                  }}
                >
                  Dual-track stainless steel blades are precision-ground to ±0.02 mm tolerance. The blade geometry maintains sharpness across 10,000 trim cycles before any degradation in cutting performance.
                </p>
              </div>
              <div style={{ display: "flex", gap: "24px", marginTop: "32px" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2rem, 3vw, 2.8rem)",
                      fontWeight: 700,
                      color: "var(--text)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    10K
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#8A8480", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Trim Cycles
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2rem, 3vw, 2.8rem)",
                      fontWeight: 700,
                      color: "var(--text)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    0.5
                    <span style={{ fontSize: "1rem" }}>mm</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#8A8480", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Min Length
                  </div>
                </div>
              </div>
            </div>

            {/* Top-right tile */}
            <div
              style={{
                background: "#1C1C1C",
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    color: "#F5F3EF",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  90-Min Cordless Runtime
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.5)" }}>
                  USB-C fast charge. Full power in 60 minutes. No performance drop as battery depletes.
                </p>
              </div>
            </div>

            {/* Bottom-right tile */}
            <div
              style={{
                background: "#F5F3EF",
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: "1px solid #D0CEC9",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1.5px solid var(--text)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    color: "var(--text)",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  20 Precision Settings
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.6, color: "#5A5752" }}>
                  Indexed comb positions from 0.5 mm to 10 mm. Each setting clicks and locks under load.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID: HORIZONTAL_RAIL ── */}
      <section
        className="reveal"
        style={{
          background: "#F5F3EF",
          padding: "clamp(4rem, 8vw, 8rem) 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingLeft: "clamp(1.5rem, 5vw, 5rem)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingRight: "clamp(1.5rem, 5vw, 5rem)",
              marginBottom: "40px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                The Range
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  marginTop: "8px",
                  textTransform: "uppercase",
                }}
              >
                Shop the Series
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                background: "transparent",
                color: "var(--text)",
                border: "1px solid rgba(26,26,26,0.3)",
                borderRadius: "2px",
                padding: "10px 24px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              View All
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingRight: "clamp(1.5rem, 5vw, 5rem)",
              paddingBottom: "8px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {products.map((p) => (
              <article
                key={p.id}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                style={{
                  flex: "0 0 auto",
                  width: "clamp(240px, 28vw, 300px)",
                  scrollSnapAlign: "start",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div
                  style={{
                    overflow: "hidden",
                    background: "#ECEAE5",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "16px",
                    position: "relative",
                  }}
                >
                  {p.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "var(--accent)",
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "4px 10px",
                        borderRadius: "2px",
                        textTransform: "uppercase",
                        zIndex: 2,
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      display: "block",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--text)",
                    marginBottom: "4px",
                    lineHeight: 1.4,
                  }}
                >
                  {p.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--text)",
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
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      background: addedId === p.id ? "#4A7C59" : "var(--text)",
                      color: "#F5F3EF",
                      border: "none",
                      borderRadius: "2px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      transition: "background 0.2s ease, transform 0.15s ease",
                      textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {addedId === p.id ? "✓ Added" : "Add to Bag"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY BREAKDOWN: Full-bleed dark band with hotspot annotations ── */}
      <section
        className="reveal"
        style={{
          background: "#1C1C1C",
          padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Under the hood
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#F5F3EF",
                marginTop: "8px",
                textTransform: "uppercase",
              }}
            >
              Technology Breakdown
            </h2>
          </div>

          {/* 16:9 image with hotspots */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <img
                src="/product-1.jpg"
                alt="Trimmer with head detached — annotated technology view"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Dark overlay for contrast */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                }}
              />
              {/* Hotspots */}
              {techFeatures.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                  style={{
                    position: "absolute",
                    top: f.top,
                    left: f.left,
                    transform: "translate(-50%, -50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: selectedFeature === f.id ? "var(--accent)" : "transparent",
                    border: `2px solid ${selectedFeature === f.id ? "var(--accent)" : "#F5F3EF"}`,
                    color: "#F5F3EF",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",
                    opacity: selectedFeature !== null && selectedFeature !== f.id ? 0.35 : 1,
                    zIndex: 10,
                    letterSpacing: "0.04em",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Spec panel — slides in below image on selection */}
            <div
              style={{
                maxHeight: selectedFeature ? "300px" : "0",
                overflow: "hidden",
                transition: "max-height 350ms ease-out",
              }}
            >
              {selectedTech && (
                <div
                  style={{
                    background: "#F5F3EF",
                    borderRadius: "var(--radius-md)",
                    padding: "clamp(1.5rem, 3vw, 2.5rem)",
                    marginTop: "16px",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "auto 1fr",
                    gap: "24px",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "var(--accent)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {selectedTech.label}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "var(--text)",
                        marginBottom: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      {selectedTech.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: "#5A5752",
                      }}
                    >
                      {selectedTech.body}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hint label */}
            {selectedFeature === null && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  marginTop: "16px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Tap a hotspot to explore
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── BRAND MANIFESTO: ASYMMETRIC_SPLIT ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Text */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                display: "block",
                marginBottom: "20px",
              }}
            >
              The philosophy
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 4vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                color: "var(--text)",
                marginBottom: "32px",
                textTransform: "uppercase",
              }}
            >
              Function is<br />the aesthetic.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                lineHeight: 1.75,
                color: "#5A5752",
                maxWidth: "480px",
                marginBottom: "20px",
              }}
            >
              We don't engineer for shelf appeal. Every gram of weight, every millimetre of blade travel, every texture on the grip — these are specifications, not style decisions.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                lineHeight: 1.75,
                color: "#5A5752",
                maxWidth: "480px",
                marginBottom: "40px",
              }}
            >
              When the engineering is right, the form follows. That is what we mean by handsomeness.
            </p>
            <div style={{ display: "flex", gap: "48px" }}>
              {[
                { num: "1M+", label: "Users Served" },
                { num: "₹299", label: "Starting Price" },
                { num: "4.7★", label: "Avg. Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                      fontWeight: 700,
                      color: "var(--text)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      color: "var(--muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "4px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          {!isMobile && (
            <div
              style={{
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                background: "#ECEAE5",
              }}
            >
              <img
                src="/product-2.jpg"
                alt="Matte Black Nose Trimmer — precision detail"
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  transition: "transform 0.7s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── CROWD FAVOURITES: HORIZONTAL_RAIL on dark band ── */}
      <section
        className="reveal"
        style={{
          background: "#1C1C1C",
          padding: "clamp(4rem, 8vw, 8rem) 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingLeft: "clamp(1.5rem, 5vw, 5rem)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingRight: "clamp(1.5rem, 5vw, 5rem)",
              marginBottom: "40px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                Most ordered
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#F5F3EF",
                  marginTop: "8px",
                  textTransform: "uppercase",
                }}
              >
                Crowd Favourites
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "2px",
                padding: "10px 24px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              See All
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingRight: "clamp(1.5rem, 5vw, 5rem)",
              paddingBottom: "8px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {[...products].reverse().map((p, idx) => (
              <article
                key={p.id}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                style={{
                  flex: "0 0 auto",
                  width: "clamp(220px, 24vw, 280px)",
                  scrollSnapAlign: "start",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div
                  style={{
                    overflow: "hidden",
                    background: "#2A2A2A",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "14px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.04em",
                      zIndex: 2,
                    }}
                  >
                    0{4 - idx}
                  </span>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      display: "block",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#F5F3EF",
                    marginBottom: "6px",
                    lineHeight: 1.4,
                  }}
                >
                  {p.name}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--accent)",
                  }}
                >
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER: Full-bleed warm band ── */}
      <section
        className="reveal"
        style={{
          background: "#F5F3EF",
          padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
          borderTop: "1px solid #D0CEC9",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            Stay sharp
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: "16px",
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            Early access.<br />No noise.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#5A5752",
              marginBottom: "36px",
              maxWidth: "400px",
              margin: "0 auto 36px",
            }}
          >
            New product drops, restocks, and grooming guides — delivered directly. Zero promotions, only specifications.
          </p>
          {subscribed ? (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "#4A7C59",
                fontWeight: 600,
                padding: "20px",
                background: "rgba(74,124,89,0.08)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(74,124,89,0.2)",
              }}
            >
              You're in. Expect precision.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", gap: "0", maxWidth: "440px", margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  padding: "0 20px",
                  height: "52px",
                  border: "1px solid #D0CEC9",
                  borderRight: "none",
                  borderRadius: "2px 0 0 2px",
                  background: "#fff",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  background: "var(--text)",
                  color: "#F5F3EF",
                  border: "none",
                  borderRadius: "0 2px 2px 0",
                  padding: "0 28px",
                  height: "52px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          )}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--muted)",
              marginTop: "16px",
              letterSpacing: "0.04em",
            }}
          >
            No spam. Unsubscribe anytime. Made in India.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}