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

const hotspots = [
  { id: 1, label: "01", top: "18%", left: "22%", title: "Precision Blade System", body: "German-engineered stainless steel blades with self-sharpening technology. Maintains edge performance through 10,000+ cutting cycles without manual adjustment." },
  { id: 2, label: "02", top: "62%", left: "38%", title: "Torque-Optimised Motor", body: "90-minute lithium charge, 5-hour runtime. The brushless motor maintains consistent RPM under load — no pull, no drag, regardless of hair density." },
  { id: 3, label: "03", top: "28%", left: "68%", title: "IPX5 Waterproof Shell", body: "Full-body waterproof rating. Rinse under the tap, use in the shower. The sealed chassis prevents moisture ingress at every seam and port junction." },
  { id: 4, label: "04", top: "70%", left: "72%", title: "20-Setting Length Dial", body: "0.5mm incremental steps across a 1–20mm range. Single-dial adjustment locks with an audible click — no accidental slippage mid-trim." },
];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };
  const [activeFilter, setActiveFilter] = useState("All");
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

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

  const filtered = activeFilter === "All" ? products : products.filter((p) => (p as any).category === activeFilter);

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
      <style>{`
        .reveal { opacity: 1; transform: none; }
        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1); }
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
        .filter-btn { transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease; }
        .hotspot-btn { transition: opacity 0.25s ease, transform 0.2s ease; }
        .hotspot-btn:hover { transform: scale(1.15); }
        .rail-scroll::-webkit-scrollbar { display: none; }
        .rail-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .bento-hero { grid-column: span 2 !important; grid-row: span 1 !important; }
          .bento-portrait-a { grid-column: span 1 !important; }
          .bento-portrait-b { grid-column: span 1 !important; }
          .bento-landscape { grid-column: span 2 !important; }
        }
        @media (max-width: 600px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-hero { grid-column: span 1 !important; }
          .bento-portrait-a, .bento-portrait-b { grid-column: span 1 !important; }
          .bento-landscape { grid-column: span 1 !important; }
          .manifesto-grid { grid-template-columns: 1fr !important; }
          .manifesto-img { display: none !important; }
        }
        @media (max-width: 768px) {
          .hero-text-block { left: 5% !important; right: 5% !important; width: 90% !important; }
          .hotspot-panel { width: 92vw !important; right: 4vw !important; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO: FULL_BLEED_OVERLAY ─────────────────────────────── */}
      <section
        className="reveal"
        style={{
          position: "relative",
          width: "100%",
          height: "90vh",
          minHeight: "560px",
          overflow: "hidden",
        }}
      >
        {/* Background product image */}
        <img
          src="/product-1.jpg"
          alt="Philips Series 3000 Beard Trimmer hero"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Left-side gradient scrim — dark left 40%, transparent right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.45) 35%, rgba(10,10,10,0) 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Text overlay — flush left at 6% */}
        <div
          className="hero-text-block"
          style={{
            position: "absolute",
            left: "6%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "46vw",
            maxWidth: "640px",
            zIndex: 2,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "16px",
              margin: "0 0 16px 0",
            }}
          >
            Full Collection
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#ffffff",
              margin: "0 0 20px 0",
            }}
          >
            The Full Arsenal.
          </h1>

          {/* Descriptor */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
              maxWidth: "38ch",
              margin: "0 0 36px 0",
            }}
          >
            Every tool engineered for precision. Trimmers, shavers, and grooming essentials — one curated range built to perform.
          </p>

          {/* CTA — flat fill, zero box-shadow */}
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
            onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
            onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "16px 40px",
              background: "var(--accent)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              boxShadow: "none",
              transition: "transform 0.15s ease",
              display: "inline-block",
            }}
          >
            Discover the Series
          </button>

          {/* Trust signals */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "28px",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.6)",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              4.8 · 4,800+ verified buyers
            </span>
            <span>Free delivery above ₹499</span>
            <span>1-year warranty</span>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid rgba(26,26,26,0.08)",
          paddingTop: "32px",
          paddingBottom: "32px",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginRight: "8px",
            }}
          >
            Filter
          </span>
          {filters.map((f) => (
            <button
              key={f}
              className="filter-btn"
              onClick={() => setActiveFilter(f)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                padding: "8px 20px",
                borderRadius: "var(--radius-pill)",
                border: activeFilter === f ? "1px solid var(--text)" : "1px solid rgba(26,26,26,0.18)",
                background: activeFilter === f ? "var(--text)" : "transparent",
                color: activeFilter === f ? "var(--bg)" : "var(--muted)",
                cursor: "pointer",
                boxShadow: "none",
                minHeight: "36px",
              }}
            >
              {f}
            </button>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              color: "var(--muted)",
              letterSpacing: "0.02em",
            }}
          >
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID: BENTO MOSAIC ───────────────────────────── */}
      <section
        className="reveal"
        style={{
          paddingTop: "64px",
          paddingBottom: "80px",
          paddingLeft: "clamp(16px, 6vw, 80px)",
          paddingRight: "clamp(16px, 6vw, 80px)",
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
              color: "var(--muted)",
              marginBottom: "32px",
            }}
          >
            {activeFilter === "All" ? "All Products" : activeFilter}
          </p>

          {/* Bento grid — hero card spans 2 cols, two portrait cards, landscape strip */}
          <div
            className="bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "auto auto",
              gap: "16px",
            }}
          >
            {/* Card 0 — Hero card: 2-col span, 2:3 aspect */}
            {filtered[0] && (
              <article
                className="bento-hero"
                style={{
                  gridColumn: "span 2",
                  gridRow: "span 1",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "var(--shadow-md)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                }}
                onClick={() =>
                  router.push(`/product?name=${encodeURIComponent(filtered[0].name)}&price=${filtered[0].price}&img=${encodeURIComponent(filtered[0].img)}`)
                }
              >
                <div style={{ overflow: "hidden", aspectRatio: "2/3", maxHeight: "580px" }}>
                  <img
                    src={filtered[0].img}
                    alt={filtered[0].name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </div>
                {filtered[0].badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "var(--accent)",
                      color: "#ffffff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "2px",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {filtered[0].badge}
                  </span>
                )}
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      margin: "0 0 6px 0",
                      lineHeight: 1.2,
                    }}
                  >
                    {filtered[0].name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      ₹{filtered[0].price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(filtered[0]);
                      }}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        padding: "9px 20px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--text)",
                        background: addedIds[filtered[0].id] ? "var(--text)" : "transparent",
                        color: addedIds[filtered[0].id] ? "var(--bg)" : "var(--text)",
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: "background 0.18s ease, color 0.18s ease",
                      }}
                    >
                      {addedIds[filtered[0].id] ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Cards 1 & 2 — Portrait stack in column 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[filtered[1], filtered[2]].map((p, idx) =>
                p ? (
                  <article
                    key={p.id}
                    className={idx === 0 ? "bento-portrait-a" : "bento-portrait-b"}
                    style={{
                      background: "var(--surface)",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      cursor: "pointer",
                      flex: 1,
                      boxShadow: "var(--shadow-md)",
                      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                    }}
                    onClick={() =>
                      router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)
                    }
                  >
                    <div style={{ overflow: "hidden", aspectRatio: "1/1.2" }}>
                      <img
                        src={p.img}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                      />
                    </div>
                    <div style={{ padding: "14px 18px 18px" }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "var(--text)",
                          margin: "0 0 4px 0",
                          lineHeight: 1.25,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p);
                          }}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            padding: "7px 14px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--text)",
                            background: addedIds[p.id] ? "var(--text)" : "transparent",
                            color: addedIds[p.id] ? "var(--bg)" : "var(--text)",
                            cursor: "pointer",
                            boxShadow: "none",
                            transition: "background 0.18s ease, color 0.18s ease",
                          }}
                        >
                          {addedIds[p.id] ? "✓ Added" : "Add"}
                        </button>
                      </div>
                    </div>
                  </article>
                ) : null
              )}
            </div>

            {/* Card 3 — Wide landscape strip spanning all 3 columns */}
            {filtered[3] && (
              <article
                className="bento-landscape"
                style={{
                  gridColumn: "span 3",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "stretch",
                  boxShadow: "var(--shadow-md)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                }}
                onClick={() =>
                  router.push(`/product?name=${encodeURIComponent(filtered[3].name)}&price=${filtered[3].price}&img=${encodeURIComponent(filtered[3].img)}`)
                }
              >
                <div style={{ width: "36%", minHeight: "220px", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={filtered[3].img}
                    alt={filtered[3].name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "32px 40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "12px",
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
                      margin: 0,
                    }}
                  >
                    Grooming Essential
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                      fontWeight: 700,
                      color: "var(--text)",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {filtered[3].name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      margin: 0,
                      maxWidth: "52ch",
                    }}
                  >
                    {filtered[3].description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)" }}>
                      ₹{filtered[3].price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(filtered[3]);
                      }}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        padding: "12px 28px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--text)",
                        background: addedIds[filtered[3].id] ? "var(--text)" : "transparent",
                        color: addedIds[filtered[3].id] ? "var(--bg)" : "var(--text)",
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: "background 0.18s ease, color 0.18s ease",
                      }}
                    >
                      {addedIds[filtered[3].id] ? "✓ Added to Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/product?name=${encodeURIComponent(filtered[3].name)}&price=${filtered[3].price}&img=${encodeURIComponent(filtered[3].img)}`)
                      }
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        padding: "12px 28px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "var(--text)",
                        color: "var(--bg)",
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY BREAKDOWN: OVERLAP_BREAKOUT + HOTSPOTS ────── */}
      <section
        id="technology"
        className="reveal"
        style={{
          background: "#F0F4F7",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
          paddingLeft: "0",
          paddingRight: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "clamp(20px, 6vw, 80px)",
            paddingRight: "clamp(20px, 6vw, 80px)",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "12px",
            }}
          >
            Engineering
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: 0,
              maxWidth: "32ch",
            }}
          >
            Built to spec. Annotated.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              marginTop: "12px",
              maxWidth: "42ch",
            }}
          >
            Tap any callout to explore the component engineering behind the series.
          </p>
        </div>

        {/* Full-width 16:9 product image with absolute hotspots */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            maxHeight: "600px",
            overflow: "hidden",
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Philips beard trimmer technical breakdown"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Dark scrim over image for legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,15,15,0.35)",
              pointerEvents: "none",
            }}
          />

          {/* Hotspot buttons */}
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              className="hotspot-btn"
              onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
              style={{
                position: "absolute",
                top: hs.top,
                left: hs.left,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent)",
                border: "2px solid rgba(255,255,255,0.85)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
                opacity: activeHotspot !== null && activeHotspot !== hs.id ? 0.35 : 1,
                zIndex: 3,
                letterSpacing: "0.02em",
              }}
              aria-label={`View detail: ${hs.title}`}
            >
              {hs.label}
            </button>
          ))}

          {/* Slide-in detail panel */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: activeHotspot !== null ? "24px" : "-100%",
              transform: "translateY(-50%)",
              width: "360px",
              maxWidth: "88vw",
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 10,
            }}
          >
            {activeHotspot !== null && (
              <>
                <button
                  onClick={() => setActiveHotspot(null)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px solid rgba(26,26,26,0.15)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "none",
                  }}
                  aria-label="Close detail panel"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text)" strokeWidth="2">
                    <line x1="1" y1="1" x2="11" y2="11" />
                    <line x1="11" y1="1" x2="1" y2="11" />
                  </svg>
                </button>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    margin: "0 0 10px 0",
                  }}
                >
                  {hotspots.find((h) => h.id === activeHotspot)?.label}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    lineHeight: 1.2,
                    margin: "0 0 14px 0",
                  }}
                >
                  {hotspots.find((h) => h.id === activeHotspot)?.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {hotspots.find((h) => h.id === activeHotspot)?.body}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stat callouts row below image */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "clamp(20px, 6vw, 80px)",
            paddingRight: "clamp(20px, 6vw, 80px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          {[
            { stat: "90 min", label: "Runtime per charge", highlight: true },
            { stat: "IPX5", label: "Waterproof rated", highlight: false },
            { stat: "20", label: "Length settings", highlight: false },
            { stat: "0.5 mm", label: "Increment precision", highlight: false },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: s.highlight ? "var(--text)" : "var(--bg)",
                borderRadius: "var(--radius-md)",
                padding: "24px 20px",
                boxShadow: s.highlight ? "none" : "var(--shadow-sm)",
                border: s.highlight ? "none" : "1px solid rgba(26,26,26,0.07)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: s.highlight ? "var(--accent)" : "var(--text)",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.stat}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  color: s.highlight ? "rgba(255,255,255,0.6)" : "var(--muted)",
                  margin: 0,
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND MANIFESTO: ASYMMETRIC_SPLIT 45/55 ─────────────── */}
      <section
        id="manifesto"
        className="reveal"
        style={{
          background: "var(--bg)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
          overflow: "hidden",
        }}
      >
        <div
          className="manifesto-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "45fr 55fr",
            alignItems: "center",
            maxWidth: "100%",
          }}
        >
          {/* Text column */}
          <div
            style={{
              paddingLeft: "clamp(24px, 6vw, 96px)",
              paddingRight: "clamp(24px, 4vw, 64px)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "16px",
              }}
            >
              The Standard
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: "0 0 24px 0",
              }}
            >
              Engineered for the man who means it.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "16px",
                maxWidth: "44ch",
              }}
            >
              No marketing copy here. Every dimension, every surface finish, every motor spec in this range was selected against a single criterion: does it perform better than what you already own?
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "36px",
                maxWidth: "44ch",
              }}
            >
              Built in a facility certified to ISO 9001. Shipped with a one-year replacement guarantee. Supported by engineers, not scripts.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "14px 32px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "var(--text)",
                  color: "var(--bg)",
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "transform 0.15s ease",
                }}
              >
                Shop the Range
              </button>
              <button
                onClick={() => document.getElementById("technology")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  padding: "14px 32px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(26,26,26,0.25)",
                  background: "transparent",
                  color: "var(--text)",
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
              >
                View Engineering
              </button>
            </div>
          </div>

          {/* Image column — 55% width, bleed to right viewport edge, no border-radius */}
          <div
            className="manifesto-img"
            style={{
              height: "580px",
              overflow: "hidden",
              borderRadius: "0",
              paddingRight: "0",
            }}
          >
            <img
              src="/product-2.jpg"
              alt="Men's grooming product editorial"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ── CROWD FAVOURITES: HORIZONTAL_RAIL ───────────────────── */}
      <section
        className="reveal"
        style={{
          background: "#F0F4F7",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "clamp(20px, 6vw, 80px)",
            paddingRight: "clamp(20px, 6vw, 80px)",
            marginBottom: "36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "8px",
                }}
              >
                Customer Picks
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--text)",
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
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                padding: "10px 24px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(26,26,26,0.25)",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
                boxShadow: "none",
                transition: "transform 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
            >
              View All
            </button>
          </div>
        </div>

        {/* Scrollable rail — 4-card peek layout */}
        <div
          className="rail-scroll"
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "clamp(20px, 6vw, 80px)",
            paddingRight: "clamp(20px, 6vw, 80px)",
            paddingBottom: "16px",
          }}
        >
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: "clamp(240px, 22vw, 310px)",
                scrollSnapAlign: "start",
                background: "var(--bg)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              }}
              onClick={() =>
                router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)
              }
            >
              <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                {p.badge && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: "0 0 4px 0",
                    lineHeight: 1.25,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "7px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--text)",
                      background: addedIds[p.id] ? "var(--text)" : "transparent",
                      color: addedIds[p.id] ? "var(--bg)" : "var(--text)",
                      cursor: "pointer",
                      boxShadow: "none",
                      transition: "background 0.18s ease, color 0.18s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {addedIds[p.id] ? "✓ Added" : "Add"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER: FULL_BLEED_BAND ──────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--text)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Early Access
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: "0 0 16px 0",
            }}
          >
            New tools. Spec drops. No noise.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Updates arrive when there is something worth saying. One email per launch cycle.
          </p>
          {subscribed ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--accent)",
                padding: "20px 0",
              }}
            >
              You're on the list. We'll be in touch.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "8px",
                maxWidth: "480px",
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  minWidth: "220px",
                  padding: "14px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.07)",
                  color: "#ffffff",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  outline: "none",
                  boxShadow: "none",
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
              />
              <button
                onClick={handleSubscribe}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "14px 28px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "#ffffff",
                  color: "var(--text)",
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}