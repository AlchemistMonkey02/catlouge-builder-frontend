import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

const THEMES = [
  { id: "light", label: "Light", title: "Studio Light", icon: Sun, dot: "#4f46e5" },
  { id: "warm", label: "Warm", title: "Warm Luxe", icon: Palette, dot: "#d97706" },
  { id: "slate", label: "Slate", title: "Nordic Slate", icon: Layers, dot: "#2563eb" },
  { id: "dark", label: "Dark", title: "Obsidian Dark", icon: Moon, dot: "#818cf8" },
];

export default function Navbar() {
  const location = useLocation();

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
    <header className="header-nav no-print">
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
        <Link to="/companies" className="header-brand">
          <div className="brand-icon-box">
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="brand-title">Catalogue Studio</span>
              <span className="brand-tag">PRO SUITE</span>
            </div>
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
          className="org-badge"
          style={{
            textDecoration: "none",
            cursor: "pointer",
            fontSize: "0.82rem",
            padding: "0.42rem 0.85rem",
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
            gap: "0.45rem",
            padding: "0.38rem 0.75rem",
            background: "var(--success-bg)",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(4, 120, 87, 0.25)",
            fontSize: "0.78rem",
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
              boxShadow: "0 0 6px var(--success)",
              display: "inline-block",
            }}
          />
          <span>Studio Ready</span>
        </div>
      </div>
    </header>
  );
}
