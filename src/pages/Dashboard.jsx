import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  FileText,
} from "lucide-react";
import { fetchDashboardAnalytics } from "../services/api";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardAnalytics();
      if (res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error("Dashboard analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = analytics?.kpis || {
    totalProducts: 4,
    draftProducts: 0,
    needsReview: 0,
    readyForExport: 4,
    exportedOrPublished: 2,
    completionRate: 100,
    aiTokensUsed: 12500,
    aiTokensLimit: 500000,
  };

  return (
    <div className="main-content">
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))",
          border: "1px solid var(--border-medium)",
          marginBottom: "1.5rem",
          padding: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="ai-spark-badge">
              <Sparkles size={12} /> Multi-Channel PIM
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.85rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginTop: "0.5rem",
            }}
          >
            Welcome to Catalogue Studio
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "620px", marginTop: "4px" }}>
            Transform raw product photographs, spreadsheets, and spec sheets into validated, channel-optimized listings for Amazon, Flipkart, Meesho, and Shopify.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/pdf-generator" className="btn btn-primary" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 2px 10px rgba(16, 185, 129, 0.4)" }}>
            <FileText size={16} /> Generate Company PDF
          </Link>
          <Link to="/bulk-import" className="btn btn-secondary">
            <UploadCloud size={16} /> Bulk Import
          </Link>
          <Link to="/catalogue" className="btn btn-secondary">
            <Boxes size={16} /> Catalogue PIM
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Total Catalog Products</span>
            <Boxes size={18} color="var(--primary)" />
          </div>
          <div className="kpi-value">{kpis.totalProducts}</div>
          <div className="kpi-footer">
            <span style={{ color: "#34d399", fontWeight: 600 }}>Active items</span> across all channels
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>Ready for Export</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: "#34d399" }}>
            {kpis.readyForExport}
          </div>
          <div className="kpi-footer">
            <span>Validated with 0 blocking errors</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>Catalogue Completion</span>
            <TrendingUp size={18} color="#06b6d4" />
          </div>
          <div className="kpi-value">{kpis.completionRate}%</div>
          <div className="readiness-meter" style={{ marginTop: "4px" }}>
            <div className="readiness-bar-bg" style={{ width: "100%", height: "8px" }}>
              <div
                className="readiness-bar-fill"
                style={{ width: `${kpis.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Token Consumption commented out */}
        {/*
        <div className="kpi-card">
          <div className="kpi-header">
            <span>AI Token Consumption</span>
            <Sparkles size={18} color="#a855f7" />
          </div>
          <div className="kpi-value" style={{ fontSize: "1.45rem", marginTop: "4px" }}>
            {(kpis.aiTokensUsed || 0).toLocaleString()} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>/ 500k</span>
          </div>
          <div className="kpi-footer">
            <span style={{ color: "#a855f7" }}>Pro tier quota</span> available
          </div>
        </div>
        */}
      </div>

      {/* Channel Readiness Status Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Amazon India */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={18} color="#f59e0b" />
              Amazon India
            </div>
            <span className="status-pill approved">95% Compliant</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Standard flat file ready. 200-character titles, 5 bullets, HSN codes, and 1000px zoom-enabled images.
          </p>
          <Link to="/export-center" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Download Flat File <ArrowRight size={14} />
          </Link>
        </div>

        {/* Flipkart */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={18} color="#3b82f6" />
              Flipkart
            </div>
            <span className="status-pill approved">90% Compliant</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Package dimensions (L x W x H) and deadweight configured for instant automated FSN mapping.
          </p>
          <Link to="/export-center" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Generate Flipkart Sheet <ArrowRight size={14} />
          </Link>
        </div>

        {/* Shopify */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={18} color="#10b981" />
              Shopify &amp; D2C
            </div>
            <span className="status-pill approved">100% Ready</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Handles, HTML rich descriptions, multi-tag arrays, and inventory variants ready for direct CSV sync.
          </p>
          <Link to="/export-center" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Export Shopify CSV <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
            Recent Activity &amp; Audit Trail
          </div>
          <Link to="/catalogue" className="btn btn-outline btn-sm">
            View All Products
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(analytics?.recentActivity || []).length > 0 ? (
            analytics.recentActivity.map((act, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-input)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <div>
                    <span style={{ fontWeight: 650, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                      {act.action}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginLeft: "0.5rem" }}>
                      by {act.userName || "System"}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {new Date(act.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Initial catalogue initialized. Ready to process products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
