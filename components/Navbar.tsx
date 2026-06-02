"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [badgePulse, setBadgePulse] = React.useState(false);
  const prevTotalRef = React.useRef(totalItems);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotalRef.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  function handleNavLink(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  function handleScrollTo(id: string) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const navLinks: { label: string; action: () => void }[] = [
    { label: "Shop", action: () => handleNavLink("/shop") },
    { label: "Our Story", action: () => handleScrollTo("about") },
    { label: "Support", action: () => handleScrollTo("support") },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid #1E2022",
        boxShadow: scrolled
          ? "0 2px 24px 0 rgba(61,196,242,0.07), 0 1px 6px 0 rgba(0,0,0,0.45)"
          : "none",
        transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
      }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* LOGO */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="men's grooming logo"
            style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        </div>

        {/* DESKTOP NAV LINKS */}
        <div
          className="hidden md:flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "0.02em",
                padding: "8px 16px",
                borderRadius: "6px",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(61,196,242,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #3DC4F2";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE: CART + HAMBURGER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* CART ICON */}
          <button
            aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            onClick={() => router.push("/checkout")}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              transition:
                "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(61,196,242,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #3DC4F2";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {/* Cart SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>

            {/* BADGE */}
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--accent)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  lineHeight: 1,
                  transform: badgePulse ? "scale(1.3)" : "scale(1)",
                  transition:
                    "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  border: "2px solid #131415",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* HAMBURGER — mobile only */}
          <button
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "var(--text)",
              transition:
                "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(61,196,242,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #3DC4F2";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {menuOpen ? (
              /* X icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--bg)",
          zIndex: 49,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          gap: "8px",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition:
            "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderTop: "1px solid #1E2022",
        }}
      >
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={link.action}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "0.02em",
              padding: "16px",
              borderRadius: "8px",
              textAlign: "left",
              transition:
                "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(61,196,242,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #3DC4F2";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {link.label}
          </button>
        ))}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid #1E2022",
          }}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push("/checkout");
            }}
            style={{
              width: "100%",
              padding: "14px 24px",
              backgroundColor: "var(--primary)",
              color: "var(--bg)",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "15px",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition:
                "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #C9A466";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--bg)",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  padding: "2px 6px",
                  minWidth: "18px",
                  lineHeight: 1.4,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}