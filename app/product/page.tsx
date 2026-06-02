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

const products = [
  { id: 1, img: "/product-1.jpg", name: "Philips Series 3000/5000 Beard Trimmer", description: "Sleek charcoal black electric beard trimmer with matte finish and adjustable comb.", price: 499, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Matte Black Nose Trimmer", description: "Sleek matte black electric nose and ear hair trimmer for discreet personal grooming.", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Braun Series 5 Shaver", description: "Sleek, modern electric foil shaver for efficient and comfortable daily grooming.", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Professional Electric Wax Heater Kit (generic/unbranded)", description: "Compact electric wax warmer with melted wax for convenient at-home hair removal.", price: 99, badge: "" },
];

function StarIcon({ filled }: { filled: boolean }) {
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
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div
        style={{
          paddingTop: 80,
          borderBottom: "1px solid rgba(26,26,26,0.08)",
          background: "var(--bg)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.75rem",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                padding: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Home
            </button>
            <span style={{ opacity: 0.35, fontSize: "0.65rem" }}>›</span>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                padding: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Shop
            </button>
            <span style={{ opacity: 0.35, fontSize: "0.65rem" }}>›</span>
            <span
              style={{
                color: "var(--text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "40ch",
              }}
            >
              {displayName}
            </span>
          </div>
        </div>
      </div>

      {/* ── HERO: ASYMMETRIC 65/35 — product image full-bleed left, no card wrapper ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "65fr 35fr",
          minHeight: isMobile ? "auto" : "88vh",
          alignItems: "stretch",
          background: "var(--bg)",
          position: "relative",
        }}
      >
        {/* LEFT: full-bleed product image — no border-radius, no card wrapper */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: isMobile ? 320 : "88vh",
            background: "#ECEEF0",
            cursor: "zoom-in",
          }}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={displayImg}
            alt={displayName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Subtle right-edge blend so right column floats above */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "15%",
              height: "100%",
              background: "linear-gradient(to right, transparent, rgba(244,249,252,0.55))",
              pointerEvents: "none",
            }}
          />
          {/* Zoom badge */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(244,249,252,0.85)",
              borderRadius: "2px",
              padding: "4px 10px",
              fontSize: "0.65rem",
              color: "var(--muted)",
              letterSpacing: "0.12em",
              fontFamily: "var(--font-body)",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Click to enlarge
          </div>
        </div>

        {/* RIGHT: product details — overlaps image via negative left margin on desktop */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "40px 24px 40px" : "64px 48px 64px 40px",
            background: "var(--bg)",
            position: "relative",
            zIndex: 2,
            marginLeft: isMobile ? 0 : -32,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Men's Grooming — Precision Series
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem,5vw,4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--text)",
              margin: "0 0 20px",
            }}
          >
            {displayName}
          </h1>

          {/* Trust signals */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              marginBottom: 24,
              fontSize: "0.8rem",
              color: "var(--muted)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= 4} />
              ))}
              <span style={{ marginLeft: 6 }}>4.6 · 4,800+ buyers</span>
            </span>
            <span
              style={{
                width: 1,
                height: 14,
                background: "rgba(26,26,26,0.15)",
                display: isMobile ? "none" : "block",
              }}
            />
            <span>Free delivery above ₹499</span>
            <span
              style={{
                width: 1,
                height: 14,
                background: "rgba(26,26,26,0.15)",
                display: isMobile ? "none" : "block",
              }}
            />
            <span>Made in India</span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              margin: "0 0 28px",
              maxWidth: 360,
            }}
          >
            {description}
          </p>

          {/* Price */}
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            ₹{displayPrice.toLocaleString("en-IN")}
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: 28,
              letterSpacing: "0.04em",
            }}
          >
            Inclusive of all taxes
          </div>

          {/* Quantity */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginBottom: 24,
              border: "1px solid rgba(26,26,26,0.15)",
              borderRadius: "2px",
              width: "fit-content",
            }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: 40,
                height: 44,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,26,26,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              −
            </button>
            <span
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--text)",
                borderLeft: "1px solid rgba(26,26,26,0.15)",
                borderRight: "1px solid rgba(26,26,26,0.15)",
              }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{
                width: 40,
                height: 44,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,26,26,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              +
            </button>
          </div>

          {/* BUTTON SYSTEM — flat, editorial, no cyan */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
            {/* Primary: solid off-white with black label, borderRadius 2px, no shadow */}
            <button
              onClick={handleAddToCart}
              style={{
                height: 52,
                padding: "0 32px",
                background: "var(--text)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              {addedState === "added" ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            {/* Secondary: transparent with 1px border */}
            <button
              onClick={handleBuyNow}
              style={{
                height: 52,
                padding: "0 32px",
                background: "transparent",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "1px solid rgba(26,26,26,0.4)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(26,26,26,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(26,26,26,0.4)";
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Buy Now
            </button>
          </div>

          {/* Micro trust row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 28,
              paddingTop: 24,
              borderTop: "1px solid rgba(26,26,26,0.08)",
            }}
          >
            {[
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                text: "1-Year Warranty",
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                text: "Ships in 24 hrs",
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                  </svg>
                ),
                text: "30-Day Returns",
              },
            ].map((t, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {t.icon}
                {t.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE TICKER — editorial separator ── */}
      <div
        className="reveal"
        style={{
          background: "#F0F4F7",
          borderTop: "1px solid #D8DFE4",
          borderBottom: "1px solid #D8DFE4",
          overflow: "hidden",
          padding: "14px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 48,
            whiteSpace: "nowrap",
            animation: "marquee 32s linear infinite",
          }}
        >
          {[
            "PRECISION TRIMMING",
            "MATTE FINISH",
            "SELF-SHARPENING BLADES",
            "USB-C CHARGING",
            "IPX5 SPLASH PROOF",
            "6,000 RPM MOTOR",
            "20-POSITION COMB",
            "90 MIN RUNTIME",
            "PRECISION TRIMMING",
            "MATTE FINISH",
            "SELF-SHARPENING BLADES",
            "USB-C CHARGING",
            "IPX5 SPLASH PROOF",
            "6,000 RPM MOTOR",
            "20-POSITION COMB",
            "90 MIN RUNTIME",
          ].map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 48,
              }}
            >
              {item}
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--accent)",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ── SPECS + FEATURES: BENTO_MOSAIC ── */}
      <section
        className="reveal"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "48px 24px" : "96px 24px",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Specifications
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem,3vw,2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            margin: "0 0 48px",
            lineHeight: 1.15,
          }}
        >
          Built to Perform.
          <br />
          Engineered to Last.
        </h2>

        {/* Bento mosaic grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
            gridAutoRows: isMobile ? "auto" : "220px",
            gap: 16,
          }}
        >
          {/* Tile 1: large image spanning 2 cols / 2 rows */}
          <div
            style={{
              gridColumn: isMobile ? "1 / -1" : "span 2",
              gridRow: isMobile ? "auto" : "span 2",
              overflow: "hidden",
              borderRadius: "var(--radius-lg)",
              background: "#ECEEF0",
              position: "relative",
            }}
          >
            <img
              src={displayImg}
              alt={displayName + " detail"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                minHeight: isMobile ? 220 : "auto",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Tile 2: headline tile */}
          <div
            style={{
              background: "var(--text)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "var(--bg)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              6K
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(244,249,252,0.55)",
                marginTop: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              RPM Motor
            </div>
          </div>

          {/* Tile 3: IPX5 */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: "2.8rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "var(--text)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              IPX5
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginTop: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              Splash Proof
            </div>
          </div>

          {/* Tile 4: runtime */}
          <div
            style={{
              background: "var(--accent)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              90
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginTop: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              Min Runtime
            </div>
          </div>

          {/* Tile 5: 20 positions */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: "2.8rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "var(--text)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              20
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginTop: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              Comb Settings
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS HORIZONTAL RAIL — unequal column widths ── */}
      <section
        className="reveal"
        style={{
          background: "var(--text)",
          padding: isMobile ? "48px 24px" : "64px 0",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "40fr 20fr 20fr 20fr",
              gap: 0,
              alignItems: "center",
            }}
          >
            {[
              { num: "6K", label: "RPM", sublabel: "High-efficiency motor", big: true },
              { num: "90", label: "min", sublabel: "Cordless runtime", big: false },
              { num: "IPX5", label: "", sublabel: "Splash resistant", big: false },
              { num: "20", label: "pos", sublabel: "Comb settings", big: false },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: isMobile ? "24px 16px" : "32px 40px",
                  borderLeft: i > 0 ? "1px solid #333" : "none",
                  borderBottom: isMobile && i < 2 ? "1px solid #333" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: stat.big
                      ? "clamp(4rem,9vw,7rem)"
                      : "clamp(2.4rem,4.5vw,3.8rem)",
                    fontWeight: 900,
                    fontFamily: "var(--font-heading)",
                    color: "#F4F9FC",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.num}
                  {stat.label && (
                    <span
                      style={{
                        fontSize: "0.4em",
                        letterSpacing: "0.04em",
                        color: "rgba(244,249,252,0.55)",
                        marginLeft: 4,
                        fontFamily: "var(--font-body)",
                        fontWeight: 400,
                      }}
                    >
                      {stat.label}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#666",
                    fontFamily: "var(--font-body)",
                    marginTop: 8,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY BREAKDOWN — OVERLAP_BREAKOUT ── */}
      <section
        id="tech-breakdown"
        className="reveal"
        style={{
          padding: isMobile ? "48px 0 48px" : "96px 0 120px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Engineering Detail
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem,4vw,3.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Technology Breakdown
            </h2>
            {!isMobile && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  marginTop: 12,
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}
              >
                Select a hotspot to explore the engineering behind every component.
              </p>
            )}
          </div>
        </div>

        {/* Full-width 16:9 image with hotspots — breakout */}
        <div
          style={{
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              position: "relative",
              background: "#ECEEF0",
            }}
          >
            <img
              src={displayImg}
              alt={displayName + " technology breakdown"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {/* Subtle scrim */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(244,249,252,0.08) 0%, rgba(244,249,252,0.0) 60%)",
                pointerEvents: "none",
              }}
            />

            {/* Hotspots */}
            {techHotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => handleHotspot(hs.id)}
                style={{
                  position: "absolute",
                  top: hs.top,
                  left: hs.left,
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background:
                    selectedHotspot === hs.id ? "var(--accent)" : "rgba(244,249,252,0.92)",
                  border:
                    selectedHotspot === hs.id
                      ? "2px solid var(--accent)"
                      : "1px solid rgba(26,26,26,0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: selectedHotspot === hs.id ? "#fff" : "var(--text)",
                  fontFamily: "var(--font-body)",
                  opacity: selectedHotspot !== null && selectedHotspot !== hs.id ? 0.35 : 1,
                  transition: "opacity 0.3s ease, background 0.25s ease, transform 0.2s ease",
                  zIndex: 10,
                  boxShadow: selectedHotspot === hs.id ? "0 0 0 6px rgba(201,164,102,0.25)" : "0 2px 8px rgba(0,0,0,0.12)",
                }}
                onMouseEnter={(e) => {
                  if (selectedHotspot !== hs.id) {
                    e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                }}
              >
                {hs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slide-in panel */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: isMobile ? "90vw" : 420,
            background: "var(--bg)",
            borderLeft: "1px solid rgba(26,26,26,0.1)",
            boxShadow: panelVisible ? "var(--shadow-xl)" : "none",
            zIndex: 100,
            transform: panelVisible ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            padding: isMobile ? "32px 24px" : "48px 40px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setSelectedHotspot(null);
              setPanelVisible(false);
            }}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "1px solid rgba(26,26,26,0.15)",
              borderRadius: "2px",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginBottom: 32,
              color: "var(--text)",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {selectedFeatureData && (
            <>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Feature {selectedFeatureData.label}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.4rem,2.5vw,1.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--text)",
                  margin: "0 0 20px",
                }}
              >
                {selectedFeatureData.title}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  margin: 0,
                }}
              >
                {selectedFeatureData.body}
              </p>
            </>
          )}
        </div>

        {/* Panel backdrop */}
        {panelVisible && (
          <div
            onClick={() => {
              setSelectedHotspot(null);
              setPanelVisible(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(26,26,26,0.25)",
              zIndex: 99,
              cursor: "pointer",
            }}
          />
        )}
      </section>

      {/* ── PRODUCT SPECS: ASYMMETRIC_SPLIT ── */}
      <section
        className="reveal"
        style={{
          background: "#F0F4F7",
          padding: isMobile ? "48px 24px" : "96px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
            gap: isMobile ? 40 : 80,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Technical Specifications
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem,3vw,2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: "0 0 40px",
                lineHeight: 1.15,
              }}
            >
              Every Detail,
              <br />
              Specified.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {specs.map((spec, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(26,26,26,0.08)",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    {spec.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <img
              src={displayImg}
              alt={displayName + " specifications"}
              style={{
                width: "100%",
                aspectRatio: "4/5",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ── REVIEWS: HORIZONTAL_RAIL ── */}
      <section
        className="reveal"
        style={{
          padding: isMobile ? "48px 0" : "96px 0",
          background: "var(--bg)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", marginBottom: 40 }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Customer Reviews
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Trusted by 4,800+ men.
          </h2>
        </div>

        {/* Horizontal scrolling rail */}
        <div
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 8,
            msOverflowStyle: "none",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 auto",
                width: isMobile ? "82vw" : 340,
                scrollSnapAlign: "start",
                background: "#F0F4F7",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= r.stars} />
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  margin: 0,
                  flex: 1,
                }}
              >
                "{r.text}"
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {r.city}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {r.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── YOU MIGHT ALSO LIKE — MINIMAL_BELOW card pattern ── */}
      <section
        className="reveal"
        style={{
          padding: isMobile ? "48px 24px" : "96px 24px",
          background: "#F0F4F7",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Complete the Collection
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem,3vw,2.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                You Might Also Like
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "1px solid rgba(26,26,26,0.25)",
                borderRadius: "2px",
                padding: "12px 24px",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(26,26,26,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(26,26,26,0.25)";
              }}
            >
              View All
            </button>
          </div>

          {/* MINIMAL_BELOW product cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(180px, 1fr))" : "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {relatedProducts.map((p) => (
              <article
                key={p.id}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                  const overlay = e.currentTarget.querySelector(".card-hover-overlay") as HTMLElement;
                  if (overlay) {
                    overlay.style.transform = "translateY(0)";
                    overlay.style.opacity = "1";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  const overlay = e.currentTarget.querySelector(".card-hover-overlay") as HTMLElement;
                  if (overlay) {
                    overlay.style.transform = "translateY(100%)";
                    overlay.style.opacity = "0";
                  }
                }}
              >
                {/* Image wrapper — 4:5 ratio */}
                <div
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    background: "#ECEEF0",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.7s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Slide-up hover button overlay */}
                  <div
                    className="card-hover-overlay"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "var(--text)",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "translateY(100%)",
                      opacity: 0,
                      transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        id: crypto.randomUUID(),
                        name: p.name,
                        price: p.price,
                        quantity: 1,
                        image: p.img,
                      });
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--bg)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                      }}
                    >
                      Add to Cart
                    </span>
                  </div>
                </div>

                {/* Card info — minimal below */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--text)",
                      margin: "0 0 6px",
                      lineHeight: 1.4,
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#999",
                      margin: 0,
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND MANIFESTO: FULL_BLEED_BAND ── */}
      <section
        className="reveal"
        style={{
          background: "var(--text)",
          padding: isMobile ? "64px 24px" : "120px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Our Commitment
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem,4vw,3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: "#F4F9FC",
              margin: "0 0 28px",
            }}
          >
            We sell handsomeness.
            <br />
            Nothing less.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "rgba(244,249,252,0.6)",
              fontFamily: "var(--font-body)",
              margin: "0 0 40px",
            }}
          >
            Every product in our range is specified to a single standard: does it perform? No excess, no fluff — just engineering that delivers precise results, every single day.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              height: 52,
              padding: "0 36px",
              background: "transparent",
              border: "1px solid rgba(244,249,252,0.35)",
              borderRadius: "2px",
              color: "#F4F9FC",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.borderColor = "rgba(244,249,252,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(244,249,252,0.35)";
            }}
          >
            Explore the Range
          </button>
        </div>
      </section>

      {/* ── NEWSLETTER: FULL_BLEED_BAND ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: isMobile ? "48px 24px" : "96px 24px",
          borderTop: "1px solid rgba(26,26,26,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Stay Informed
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem,3vw,2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            New arrivals. No noise.
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.65,
              margin: "0 0 32px",
            }}
          >
            Product launches, performance guides, and grooming specifications delivered to your inbox.
          </p>

          {subscribed ? (
            <div
              style={{
                padding: "18px 32px",
                background: "rgba(61,196,242,0.08)",
                border: "1px solid rgba(61,196,242,0.25)",
                borderRadius: "2px",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
              }}
            >
              You're subscribed. Expect precision.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  setSubscribed(true);
                }
              }}
              style={{ display: "flex", gap: 0, maxWidth: 440, margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  height: 52,
                  padding: "0 20px",
                  background: "var(--bg)",
                  border: "1px solid rgba(26,26,26,0.2)",
                  borderRight: "none",
                  borderRadius: "2px 0 0 2px",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height: 52,
                  padding: "0 24px",
                  background: "var(--text)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: "0 2px 2px 0",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />

      {/* ── STICKY MOBILE ADD-TO-CART BAR ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px",
            background: "var(--bg)",
            borderTop: "1px solid rgba(26,26,26,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 50,
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "var(--text)",
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.02em",
              }}
            >
              ₹{displayPrice.toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              incl. taxes
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              maxWidth: 220,
              height: 48,
              background: "var(--text)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "2px",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {addedState === "added" ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(244,249,252,0.95)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "1px solid rgba(26,26,26,0.2)",
              borderRadius: "2px",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={displayImg}
            alt={displayName}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── MARQUEE KEYFRAME via style injection — only safe pattern in React 18 ── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg)", minHeight: "100vh" }} />}>
      <ProductContent />
    </Suspense>
  );
}