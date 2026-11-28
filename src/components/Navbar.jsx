import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Building2,
  FileText,
  ShieldCheck,
  Sun,
  Moon,
  Palette,
  Camera,
  Layers,
  LogOut,
} from "lucide-react";

const THEMES = [
  { id: "light", label: "Light", title: "Studio Light", icon: Sun, dot: "#4f46e5" },
  { id: "warm", label: "Warm", title: "Warm Luxe", icon: Palette, dot: "#d97706" },
  { id: "slate", label: "Slate", title: "Nordic Slate", icon: Layers, dot: "#2563eb" },
  { id: "forest", label: "Forest", title: "Earthy Forest Hues", icon: Layers, dot: "#588157" },
  { id: "dark", label: "Dark", title: "Obsidian Dark", icon: Moon, dot: "#818cf8" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_logged_in");
    navigate("/login");
  };

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("app_theme", currentTheme);
  }, [currentTheme]);

  const navLinks = [
    { to: "/companies", label: "Company Profiles", icon: Building2 },
    // AI Photo Studio commented out
    // { to: "/ai-studio", label: "AI Photo Studio", icon: Camera, aiBadge: true },
    { to: "/pdf-generator", label: "PDF Catalogue Studio", icon: FileText },
  ];

  return (
    <>
    <header className="header-nav no-print">
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
        <Link to="/companies" className="header-brand" style={{ gap: "0.65rem" }}>
          <div
            className="brand-icon-box"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 5.5C4 4.67157 4.67157 4 5.5 4H10.5C11.3284 4 12 4.67157 12 5.5V19.5C12 18.6716 11.3284 18 10.5 18H5.5C4.67157 18 4 17.3284 4 16.5V5.5Z"
                fill="white"
                fillOpacity="0.92"
              />
              <path
                d="M20 5.5C20 4.67157 19.3284 4 18.5 4H13.5C12.6716 4 12 4.67157 12 5.5V19.5C12 18.6716 12.6716 18 13.5 18H18.5C19.3284 18 20 17.3284 20 16.5V5.5Z"
                fill="white"
                fillOpacity="0.65"
              />
              <circle cx="16" cy="9" r="1.5" fill="white" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span className="brand-title" style={{ fontSize: "1.02rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Catalogue Studio
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--primary)",
                textTransform: "uppercase",
              }}
            >
              Pro Suite
            </span>
          </div>
        </Link>

        <nav className="nav-tabs">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to === "/companies" && location.pathname.startsWith("/companies"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-tab-item ${isActive ? "active" : ""}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.aiBadge && (
                  <span
                    style={{
                      background: "linear-gradient(135deg, #4338ca 0%, #be185d 100%)",
                      color: "#ffffff",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    AI Vision
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="topbar-right">
        {/* COMPACT SLEEK THEME SWITCHER */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--bg-surface-elevated)",
            padding: "3px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          {THEMES.map((thm) => {
            const isSelected = currentTheme === thm.id;
            const Icon = thm.icon;
            return (
              <button
                key={thm.id}
                onClick={() => setCurrentTheme(thm.id)}
                title={`Switch to ${thm.title}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 10px",
                  borderRadius: "var(--radius-full)",
                  border: isSelected ? "1px solid var(--border-subtle)" : "1px solid transparent",
                  background: isSelected ? "var(--bg-surface)" : "transparent",
                  color: isSelected ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.80rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: thm.dot,
                    display: "inline-block",
                  }}
                />
                <span>{thm.label}</span>
              </button>
            );
          })}
        </div>

        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            padding: "0.35rem 0.5rem",
          }}
          title="Admin Account"
        >
          <ShieldCheck size={15} style={{ color: "var(--primary)" }} />
          <span>Admin Portal</span>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.5rem",
            fontSize: "0.8rem",
            color: "var(--success)",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "var(--success)",
              display: "inline-block",
            }}
          />
          <span>Studio Ready</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontWeight: 600,
            padding: "0.35rem 0.5rem",
            color: "#dc2626",
            border: "none",
            background: "transparent",
          }}
          title="Sign out"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>

    <nav className="mobile-bottom-nav no-print" aria-label="Mobile Navigation">
      <Link
        to="/companies"
        className={`mobile-nav-item ${location.pathname.startsWith("/companies") ? "active" : ""}`}
      >
        <Building2 size={18} />
        <span>Companies</span>
      </Link>
      <Link
        to="/pdf-generator"
        className={`mobile-nav-item ${location.pathname.startsWith("/pdf") ? "active" : ""}`}
      >
        <FileText size={18} />
        <span>PDF Studio</span>
      </Link>
      <Link
        to="/login"
        className={`mobile-nav-item ${location.pathname === "/login" ? "active" : ""}`}
      >
        <ShieldCheck size={18} />
        <span>Admin</span>
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="mobile-nav-item"
        style={{ color: "#dc2626", background: "transparent", border: "none" }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </nav>
    </>
  );
}
