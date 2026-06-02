"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const allProducts = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Philips Series 3000/5000 Beard Trimmer",
    description: "Sleek charcoal black electric beard trimmer with matte finish and adjustable comb.",
    price: 499,
    specs: [
      { label: "Blade Material", value: "Stainless steel" },
      { label: "Power", value: "USB rechargeable" },
      { label: "Length Settings", value: "Adjustable comb guide" },
      { label: "Body", value: "Cordless, compact design" },
      { label: "Use", value: "Beard & body trimming" },
    ],
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Matte Black Nose Trimmer",
    description: "Sleek matte black electric nose and ear hair trimmer for discreet personal grooming.",
    price: 299,
    specs: [
      { label: "Blade Material", value: "Stainless steel rotary blade" },
      { label: "Power", value: "Battery operated (AA)" },
      { label: "Waterproof", value: "Washable head" },
      { label: "Use", value: "Nose, ear & eyebrow trimming" },
      { label: "Design", value: "Compact ergonomic barrel" },
    ],
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Braun Series 5 Shaver",
    description: "Sleek, modern electric foil shaver for efficient and comfortable daily grooming.",
    price: 399,
    specs: [
      { label: "Shaving System", value: "Triple foil & cutter" },
      { label: "Power", value: "USB rechargeable" },
      { label: "Wet/Dry", value: "Dry use" },
      { label: "Body Material", value: "Aluminium-finish & rubber grip" },
      { label: "Charging", value: "USB Type-C (approx. 1 hr)" },
    ],
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Professional Electric Wax Heater Kit (generic/unbranded)",
    description: "Compact electric wax warmer with melted wax for convenient at-home hair removal.",
    price: 99,
    specs: [
      { label: "Capacity", value: "500 ml" },
      { label: "Temperature Range", value: "40°C – 120°C (adjustable dial)" },
      { label: "Includes", value: "Wax warmer, wax strip & spatula" },
      { label: "Power", value: "100 W" },
      { label: "Suitable For", value: "Hard & soft wax beads / blocks" },
    ],
  },
];

const techHotspots = [
  {
    id: 1,
    label: "01",
    top: "22%",
    left: "58%",
    title: "Stainless Steel Blade System",
    body: "Precision-ground stainless steel blades maintain sharpness over thousands of trims. The self-sharpening mechanism ensures consistent cutting performance without manual maintenance.",
  },
  {
    id: 2,
    label: "02",
    top: "16%",
    left: "42%",
    title: "Adjustable Comb Guide",
    body: "Integrated 20-position adjustable comb locks into each setting with a satisfying click. Range spans 0.5 mm to 10 mm for precise stubble control or full beard shaping.",
  },
  {
    id: 3,
    label: "03",
    top: "58%",
    left: "36%",
    title: "Textured Grip Zone",
    body: "Pebbled rubber-finish grip panel ensures non-slip control even with wet hands. Ergonomic geometry positions the blade at the optimal 15° angle for natural wrist movement.",
  },
  {
    id: 4,
    label: "04",
    top: "74%",
    left: "22%",
    title: "USB Rechargeable Motor",
    body: "High-efficiency DC motor delivers 6,000 RPM with consistent torque. USB-C charging provides 90 minutes of cordless runtime from a 60-minute charge cycle.",
  },
];

const reviews = [
  {
    name: "Vikram Nair",
    city: "Kochi",
    stars: 5,
    date: "March 2024",
    text: "Absolutely precise. I run a 3mm setting daily and the comb locks flawlessly — zero wobble after two months of daily use.",
  },
  {
    name: "Rohit Desai",
    city: "Pune",
    stars: 4,
    date: "January 2024",
    text: "Great value for ₹499. The USB-C charging is a genuine convenience. Grip is solid; my only ask would be a longer runtime indicator.",
  },
  {
    name: "Suresh Babu",
    city: "Hyderabad",
    stars: 5,
    date: "February 2024",
    text: "Very impressed by the blade sharpness. My barber noticed cleaner lines compared to my previous trimmer. Sleek, light, no fuss.",
  },
  {
    name: "Manish Kulkarni",
    city: "Nagpur",
    stars: 4,
    date: "April 2024",
    text: "Compact enough for travel kit. The adjustable comb is the real selling point — 20 positions for under 500 rupees is exceptional.",
  },
];

function StarIcon({ filled }: { filled: boolean }) {
const products = [
  { id: 1, img: "/product-1.jpg", name: "Philips Series 3000/5000 Beard Trimmer", description: "Sleek charcoal black electric beard trimmer with matte finish and adjustable comb.", price: 499, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Matte Black Nose Trimmer", description: "Sleek matte black electric nose and ear hair trimmer for discreet personal grooming.", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Braun Series 5 Shaver", description: "Sleek, modern electric foil shaver for efficient and comfortable daily grooming.", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Professional Electric Wax Heater Kit (generic/unbranded)", description: "Compact electric wax warmer with melted wax for convenient at-home hair removal.", price: 99, badge: "" }
];
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5" style={{ display: "inline" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Philips Series 3000/5000 Beard Trimmer";
  const displayPrice = paramPrice ?? 499;

  const matchedProduct = allProducts.find((p) => p.name === displayName) ?? allProducts[0];
  const specs = matchedProduct.specs;
  const description = matchedProduct.description;

  const [quantity, setQuantity] = useState(1);
  const [addedState, setAddedState] = useState<"idle" | "added">("idle");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
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

  function handleAddToCart() {
    addItem({
      id: String(matchedProduct.id),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 1500);
  }

  function handleBuyNow() {
    addItem({
      id: String(matchedProduct.id),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    router.push("/checkout");
  }

  function handleHotspot(id: number) {
    if (selectedHotspot === id) {
      setSelectedHotspot(null);
      setPanelVisible(false);
    } else {
      setSelectedHotspot(id);
      setPanelVisible(true);
    }
  }

  const relatedProducts = allProducts.filter((p) => p.name !== displayName).slice(0, 3);

  const selectedFeatureData = techHotspots.find((h) => h.id === selectedHotspot);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div style={{ padding: "80px 0 0", borderBottom: "1px solid rgba(240,238,233,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Home
            </button>
            <span style={{ opacity: 0.4 }}>→</span>
            <button
              onClick={() => router.push("/shop")}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Shop
            </button>
            <span style={{ opacity: 0.4 }}>→</span>
            <span style={{ color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "40ch" }}>{displayName}</span>
          </div>
        </div>
      </div>

      {/* ── MAIN PRODUCT DETAIL (two-column desktop, stacked mobile) ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr",
            gap: isMobile ? "32px" : "64px",
            alignItems: "start",
          }}
        >
          {/* LEFT: sticky image */}
          <div style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? "auto" : 100 }}>
            {/* Main image */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                cursor: "zoom-in",
                border: "1px solid rgba(240,238,233,0.06)",
                position: "relative",
              }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={displayImg}
                alt={displayName}
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "contain",
                  background: "var(--surface)",
                  display: "block",
                  transition: "transform 0.6s ease",
                  maxHeight: isMobile ? 320 : 560,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Zoom hint */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  background: "rgba(19,20,21,0.7)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 10px",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-body)",
                  pointerEvents: "none",
                }}
              >
                CLICK TO ENLARGE
              </div>
            </div>

            {/* Trust strip below image */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: 20,
                padding: "16px 20px",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(240,238,233,0.06)",
              }}
            >
              {[
                { icon: "★", text: "4.6 · 4,800+ Verified Buyers" },
                { icon: "⚡", text: "Ships in 24 hrs" },
                { icon: "↩", text: "30-Day Returns" },
              ].map((t) => (
                <span
                  key={t.text}
                  style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span style={{ color: "var(--primary)", fontSize: "0.85rem" }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Eyebrow */}
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Precision Grooming
            </p>

            {/* Name */}
            <h1
              style={{
                fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {displayName}
            </h1>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  background: "rgba(61,196,242,0.1)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-pill)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(61,196,242,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                Free delivery above ₹499
              </span>
            </div>

            {/* Star rating inline */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= 4} />
                ))}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>4.6 (4,800+ reviews)</span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "1rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
                margin: 0,
                borderLeft: "2px solid var(--primary)",
                paddingLeft: 16,
              }}
            >
              {description}
            </p>

            {/* Quantity selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                }}
              >
                Quantity
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 0, width: "fit-content", border: "1px solid rgba(240,238,233,0.12)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--surface)",
                    border: "none",
                    color: "var(--text)",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(61,196,242,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                >
                  −
                </button>
                <span
                  style={{
                    width: 56,
                    textAlign: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--text)",
                    background: "var(--bg)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 44,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--surface)",
                    border: "none",
                    color: "var(--text)",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(61,196,242,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  height: 56,
                  background: addedState === "added" ? "rgba(61,196,242,0.15)" : "var(--primary)",
                  color: addedState === "added" ? "var(--primary)" : "var(--bg)",
                  border: addedState === "added" ? "1px solid var(--primary)" : "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "transform 0.15s ease, background 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                {addedState === "added" ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  height: 56,
                  background: "var(--accent)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "transform 0.15s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Buy Now
              </button>
            </div>

            {/* Specs Grid */}
            {specs.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    marginBottom: 12,
                    margin: "0 0 12px 0",
                  }}
                >
                  Specifications
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                    gap: "1px",
                    background: "rgba(240,238,233,0.06)",
                    border: "1px solid rgba(240,238,233,0.06)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "var(--surface)",
                        padding: "12px 16px",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                        {s.label}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--text)", fontFamily: "var(--font-body)", lineHeight: 1.4 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to shop */}
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "1px solid rgba(240,238,233,0.12)",
                borderRadius: "var(--radius-md)",
                color: "var(--muted)",
                fontSize: "0.85rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                height: 44,
                cursor: "pointer",
                letterSpacing: "0.06em",
                transition: "border-color 0.15s ease, color 0.15s ease",
                marginTop: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(240,238,233,0.12)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY BREAKDOWN ── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          {/* Section header */}
          <div style={{ marginBottom: 48, display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Engineering
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: 0,
              }}
            >
              Technology Breakdown
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.6, margin: 0, maxWidth: "48ch" }}>
              Tap each hotspot to explore the precision engineering behind every trim.
            </p>
          </div>

          {/* Image + hotspots container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 880,
              margin: "0 auto",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              background: "var(--bg)",
              border: "1px solid rgba(240,238,233,0.06)",
            }}
          >
            <img
              src={displayImg}
              alt={`${displayName} technology breakdown`}
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "contain",
                background: "var(--bg)",
                display: "block",
              }}
            />
            {/* Hotspots */}
            {techHotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => handleHotspot(h.id)}
                style={{
                  position: "absolute",
                  top: h.top,
                  left: h.left,
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: selectedHotspot === h.id ? "var(--accent)" : "var(--primary)",
                  border: "2px solid rgba(240,238,233,0.3)",
                  color: "var(--bg)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: selectedHotspot !== null && selectedHotspot !== h.id ? 0.4 : 1,
                  transition: "opacity 0.25s ease, background 0.2s ease, transform 0.15s ease",
                  zIndex: 4,
                  boxShadow: selectedHotspot === h.id ? "0 0 0 4px rgba(201,164,102,0.3)" : "0 0 0 3px rgba(61,196,242,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)")}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Slide-in panel — rendered below image on mobile, beside on desktop */}
          <div
            style={{
              marginTop: 24,
              maxWidth: 880,
              margin: "24px auto 0",
              height: panelVisible && selectedFeatureData ? "auto" : 0,
              overflow: "hidden",
              transition: "height 0.35s ease-out",
            }}
          >
            {selectedFeatureData && (
              <div
                style={{
                  background: "var(--bg)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(240,238,233,0.08)",
                  padding: "28px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "var(--bg)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                      flexShrink: 0,
                    }}
                  >
                    {selectedFeatureData.label}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--text)",
                      margin: 0,
                    }}
                  >
                    {selectedFeatureData.title}
                  </h3>
                </div>
                <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7, fontFamily: "var(--font-body)", margin: 0 }}>
                  {selectedFeatureData.body}
                </p>
              </div>
            )}
          </div>

          {/* Hotspot legend */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 12,
              marginTop: 24,
              maxWidth: 880,
              margin: "24px auto 0",
            }}
          >
            {techHotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => handleHotspot(h.id)}
                style={{
                  background: selectedHotspot === h.id ? "rgba(201,164,102,0.1)" : "var(--bg)",
                  border: `1px solid ${selectedHotspot === h.id ? "var(--accent)" : "rgba(240,238,233,0.08)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: selectedHotspot === h.id ? "var(--accent)" : "var(--primary)",
                    color: "var(--bg)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    flexShrink: 0,
                    transition: "background 0.2s ease",
                  }}
                >
                  {h.label}
                </span>
                <span style={{ fontSize: "0.8rem", color: selectedHotspot === h.id ? "var(--text)" : "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {h.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPEC BENTO ── */}
      <section
        className="reveal"
        style={{ padding: "80px 0", background: "var(--bg)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            By the Numbers
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--text)",
              marginBottom: 40,
            }}
          >
            Built to Perform
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 2,
              background: "rgba(240,238,233,0.06)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {[
              { stat: "20", unit: "Settings", desc: "Precision comb positions from 0.5 mm to 10 mm" },
              { stat: "90", unit: "Min Runtime", desc: "Cordless usage from a single 60-minute USB-C charge" },
              { stat: "IPX5", unit: "Washable", desc: "Fully washable head — rinse under running water" },
              { stat: "6K", unit: "RPM Motor", desc: "High-torque DC motor for clean, consistent cuts" },
            ].map((item, i) => (
              <div
                key={item.stat}
                style={{
                  background: i === 0 ? "var(--surface)" : "var(--bg)",
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = i === 0 ? "var(--surface)" : "var(--bg)")}
              >
                <span
                  style={{
                    fontSize: "clamp(2rem,4vw,3rem)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}
                >
                  {item.stat}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                  }}
                >
                  {item.unit}
                </span>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55, margin: 0, marginTop: 4 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "18px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            animation: "marquee 22s linear infinite",
            width: "max-content",
          }}
        >
          {[...Array(3)].map((_, i) =>
            ["PRECISION TRIMMING", "MATTE FINISH", "SELF-SHARPENING BLADES", "CORDLESS FREEDOM", "USB-C CHARGING", "IPX5 WASHABLE"].map((item) => (
              <span
                key={`${i}-${item}`}
                style={{
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "var(--bg)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  padding: "0 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 28,
                }}
              >
                {item}
                <span style={{ display: "inline-block", width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
              </span>
            ))
          )}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .reveal.will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
          .reveal.visible { opacity: 1; transform: translateY(0); }
        `}</style>
      </div>

      {/* ── REVIEWS ── */}
      <section className="reveal" style={{ padding: "80px 0", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 40 }}>
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Verified Buyers
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.8rem,3vw,2.8rem)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                4,800+ Reviews
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= 4} />
              ))}
              <span style={{ fontSize: "1rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text)", marginLeft: 4 }}>4.6 / 5</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: 16,
            }}
          >
            {reviews.map((r) => (
              <div
                key={r.name}
                style={{
                  background: "var(--bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  border: "1px solid rgba(240,238,233,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(61,196,242,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,238,233,0.06)")}
              >
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled={s <= r.stars} />
                  ))}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", fontFamily: "var(--font-body)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                  "{r.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <div>
                    <p style={{ fontSize: "0.82rem", fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)", margin: 0 }}>{r.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)", margin: "2px 0 0" }}>{r.city}</p>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOU MIGHT ALSO LIKE (horizontal rail) ── */}
      <section className="reveal" style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Complete Your Kit
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.6rem,2.5vw,2.4rem)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                You Might Also Like
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "1px solid rgba(240,238,233,0.12)",
                borderRadius: "var(--radius-md)",
                color: "var(--muted)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                padding: "10px 20px",
                cursor: "pointer",
                letterSpacing: "0.06em",
                transition: "border-color 0.15s ease, color 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(240,238,233,0.12)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              View All
            </button>
          </div>

          {/* Horizontal rail */}
          <div
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 8,
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  flex: "0 0 auto",
                  width: "clamp(240px, 28vw, 300px)",
                  scrollSnapAlign: "start",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid rgba(240,238,233,0.06)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(61,196,242,0.25)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(240,238,233,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ overflow: "hidden", background: "var(--bg)" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "contain",
                      background: "var(--bg)",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <p style={{ fontSize: "0.85rem", fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.35 }}>{p.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: 4, lineHeight: 1.4 }}>{p.description.slice(0, 55)}…</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--accent)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
                      }}
                      style={{
                        background: "var(--primary)",
                        color: "var(--bg)",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 14px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 44,
              height: 44,
              background: "rgba(240,238,233,0.1)",
              border: "1px solid rgba(240,238,233,0.15)",
              borderRadius: "50%",
              color: "var(--text)",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <img
            src={displayImg}
            alt={displayName}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "var(--radius-md)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── STICKY MOBILE BOTTOM BAR ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 16px",
            background: "var(--surface)",
            borderTop: "1px solid rgba(240,238,233,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            zIndex: 50,
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)" }}>
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              height: 48,
              background: addedState === "added" ? "rgba(61,196,242,0.15)" : "var(--primary)",
              color: addedState === "added" ? "var(--primary)" : "var(--bg)",
              border: addedState === "added" ? "1px solid var(--primary)" : "none",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "background 0.2s ease",
              letterSpacing: "0.04em",
            }}
          >
            {addedState === "added" ? "✓ Added" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            style={{
              flex: 1,
              height: 48,
              background: "var(--accent)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Buy Now
          </button>
        </div>
      )}

      <div style={{ paddingBottom: isMobile ? 80 : 0 }}>
        <Footer />
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}