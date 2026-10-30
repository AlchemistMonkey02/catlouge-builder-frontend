import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, Building2 } from "lucide-react";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@aibrands.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_name", "Administrator");
      localStorage.setItem("admin_email", email);
      if (onLoginSuccess) onLoginSuccess();
      navigate("/companies");
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    localStorage.setItem("admin_logged_in", "true");
    localStorage.setItem("admin_name", "Administrator");
    localStorage.setItem("admin_email", "admin@aibrands.com");
    if (onLoginSuccess) onLoginSuccess();
    navigate("/companies");
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem 2.25rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            className="brand-icon-box"
            style={{ width: "52px", height: "52px", margin: "0 auto 1rem" }}
          >
            <Sparkles size={28} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Catalogue Portal
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
            Sign in to create company profiles, manage product catalogues, and generate PDF exports.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            <ShieldCheck size={18} /> {loading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: "100%", borderStyle: "dashed", borderColor: "rgba(99, 102, 241, 0.4)", color: "#a5b4fc" }}
            onClick={handleQuickDemoLogin}
          >
            ⚡ One-Click Instant Admin Access
          </button>
        </div>
      </div>
    </div>
  );
}
