"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid #1E2022",
        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
        color: "var(--text)",
        paddingTop: "64px",
        paddingBottom: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* TOP GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "48px",
            marginBottom: "56px",
          }}
        >
          {/* BRAND COLUMN */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <img
              src="/logo.png"
              alt="men's grooming logo"
              style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }}
            />
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
                color: "var(--muted)",
                maxWidth: "280px",
                margin: 0,
              }}
            >
              Precision grooming tools engineered for the modern man. No excess.
              Just function and form.
            </p>

            {/* SOCIAL ICONS */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface)",
                  color: "var(--muted)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(61,196,242,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline =
                    "2px solid #3DC4F2";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface)",
                  color: "var(--muted)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(61,196,242,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline =
                    "2px solid #3DC4F2";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface)",
                  color: "var(--muted)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(61,196,242,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline =
                    "2px solid #3DC4F2";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              Quick Links
            </h3>
            {[
              { label: "Home", path: "/" },
              { label: "Shop", path: "/shop" },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => router.push(path)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "2px 0",
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "var(--text)",
                  letterSpacing: "0.01em",
                  width: "fit-content",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #3DC4F2";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                  (e.currentTarget as HTMLButtonElement).style.borderRadius = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {label}
              </button>
            ))}

            {/* CONTACT */}
            <div style={{ marginTop: "8px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: "0 0 8px 0",
                }}
              >
                Contact Us
              </p>
              <a
                href="mailto:maliyajay77@gmail.com"
                style={{
                  color: "var(--accent)",
                  fontSize: "14px",
                  textDecoration: "none",
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline =
                    "2px solid #3DC4F2";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                  (e.currentTarget as HTMLAnchorElement).style.borderRadius = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                maliyajay77@gmail.com
              </a>
            </div>
          </div>

          {/* NEWSLETTER COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              Stay Sharp
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "var(--muted)",
                margin: 0,
              }}
            >
              Grooming tips, new drops, and exclusive offers. No spam.
            </p>

            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  padding: "14px 16px",
                  backgroundColor: "rgba(61,196,242,0.08)",
                  border: "1px solid rgba(61,196,242,0.25)",
                  borderRadius: "8px",
                  color: "var(--primary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                }}
              >
                Thanks! We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                noValidate
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid #2a2e32",
                    borderRadius: "8px",
                    color: "var(--text)",
                    fontSize: "14px",
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition:
                      "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--primary)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "#2a2e32";
                  }}
                />
                {status === "error" && (
                  <p
                    role="alert"
                    style={{
                      fontSize: "13px",
                      color: "#f87171",
                      margin: 0,
                      fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    }}
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-disabled={status === "loading"}
                  style={{
                    padding: "12px 24px",
                    backgroundColor:
                      status === "loading" ? "#2a2e32" : "var(--primary)",
                    color: status === "loading" ? "var(--muted)" : "var(--bg)",
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize: "14px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "8px",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    letterSpacing: "0.04em",
                    transition:
                      "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)";
                    }
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline =
                      "2px solid #C9A466";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                      "2px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "none";
                  }}
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            borderTop: "1px solid #1E2022",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "var(--muted)",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            }}
          >
            &copy; {new Date().getFullYear()} men&apos;s grooming. All rights
            reserved.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "var(--muted)",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            }}
          >
            Made in India &nbsp;·&nbsp; Free shipping on orders above ₹999
          </p>
        </div>
      </div>
    </footer>
  );
}