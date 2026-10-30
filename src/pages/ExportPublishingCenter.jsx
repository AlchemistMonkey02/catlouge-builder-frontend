import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Download,
  Send,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Terminal,
} from "lucide-react";
import {
  fetchExportValidationReport,
  downloadMarketplaceExport,
  publishToMarketplaceSandbox,
} from "../services/api";

const MARKETPLACES = [
  { id: "amazon_in", name: "Amazon India Flat File (.xlsx)", icon: "🛒", format: "xlsx" },
  { id: "flipkart", name: "Flipkart Bulk Listing (.xlsx)", icon: "🛍️", format: "xlsx" },
  { id: "shopify", name: "Shopify Official Product Feed (.csv)", icon: "🟢", format: "csv" },
  { id: "generic_csv", name: "Universal Master Catalogue (.xlsx)", icon: "📊", format: "xlsx" },
  { id: "json", name: "Structured JSON Data Feed", icon: "📦", format: "json" },
];

export default function ExportPublishingCenter() {
  const [selectedMarketplace, setSelectedMarketplace] = useState("amazon_in");
  const [validationReport, setValidationReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [sandboxLog, setSandboxLog] = useState(null);

  useEffect(() => {
    runPreExportAudit(selectedMarketplace);
  }, [selectedMarketplace]);

  const runPreExportAudit = async (mp) => {
    try {
      setLoadingReport(true);
      const res = await fetchExportValidationReport({ marketplace: mp });
      if (res.data) {
        setValidationReport(res.data);
      }
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownloadExport = async (format) => {
    try {
      setIsExporting(true);
      const data = await downloadMarketplaceExport({
        marketplace: selectedMarketplace,
        format: format || "xlsx",
      });

      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedMarketplace.toUpperCase()}_Export.json`;
        a.click();
      } else {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedMarketplace.toUpperCase()}_Catalogue_Export.${format === "csv" ? "csv" : "xlsx"}`;
        a.click();
      }

      runPreExportAudit(selectedMarketplace);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublishSandbox = async () => {
    try {
      setIsPublishing(true);
      const res = await publishToMarketplaceSandbox({ marketplace: selectedMarketplace });
      if (res.data) {
        setSandboxLog(res.data);
      }
    } catch (err) {
      alert("Submission error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsPublishing(false);
    }
  };

  const summary = validationReport?.summary || {
    readyCount: 0,
    warningCount: 0,
    blockedCount: 0,
    isExportable: true,
  };

  return (
    <div className="main-content">
      <div className="workspace-toolbar">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Export &amp; Marketplace Publishing Center
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
            Audit product data completeness and export channel-compliant flat files or simulate direct API submissions.
          </p>
        </div>

        <button className="btn btn-outline" onClick={() => runPreExportAudit(selectedMarketplace)}>
          <RefreshCw size={15} /> Re-Run Audit
        </button>
      </div>

      {/* Target Channel Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {MARKETPLACES.map((mp) => {
          const isSelected = selectedMarketplace === mp.id;
          return (
            <div
              key={mp.id}
              className="card"
              style={{
                cursor: "pointer",
                border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                background: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--bg-card)",
              }}
              onClick={() => setSelectedMarketplace(mp.id)}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{mp.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{mp.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Target format: {mp.format.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Export Validation Summary Banner */}
      <div
        className="card"
        style={{
          padding: "1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
              Pre-Export Quality Report ({selectedMarketplace.toUpperCase()})
            </span>
            {summary.blockedCount === 0 ? (
              <span className="status-pill approved">All Systems Go</span>
            ) : (
              <span className="status-pill needs_review">{summary.blockedCount} Blocked</span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
            Marketplace rules engine checks title limits, mandatory HSN codes, dimensions, and image resolutions.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Ready</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399" }}>{summary.readyCount}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Warnings</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fbbf24" }}>{summary.warningCount}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Blocked</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: summary.blockedCount > 0 ? "#ef4444" : "var(--text-muted)" }}>
              {summary.blockedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download File vs Publish Sandbox */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={isExporting}
          onClick={() => handleDownloadExport(selectedMarketplace === "shopify" ? "csv" : "xlsx")}
        >
          <Download size={18} /> Download {selectedMarketplace.toUpperCase()} Listing Template
        </button>

        <button
          className="btn btn-secondary btn-lg"
          disabled={isExporting}
          onClick={() => handleDownloadExport("json")}
        >
          <Download size={18} /> Export JSON Data Feed
        </button>

        <button
          className="btn btn-secondary btn-lg"
          disabled={isPublishing}
          onClick={handlePublishSandbox}
        >
          <Send size={18} /> Submit via Marketplace API Sandbox
        </button>
      </div>

      {/* API Sandbox Terminal Console */}
      {sandboxLog && (
        <div
          className="card"
          style={{
            background: "#030712",
            border: "1px solid var(--border-medium)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.5rem" }}>
            <Terminal size={16} />
            <span>Marketplace API Gateway Sandbox — Response 200 OK</span>
          </div>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <div>&gt; Target: {sandboxLog.marketplace} Integration Gateway</div>
            <div>&gt; Submission ID: {sandboxLog.submissionId}</div>
            <div>&gt; Products Transmitted: {sandboxLog.publishedCount} items</div>
            <div>&gt; Feed Status: {sandboxLog.gatewayResponse?.message}</div>
            <div style={{ color: "#34d399" }}>&gt; SUCCESS: Product statuses updated to "submitted" in master database.</div>
          </div>
        </div>
      )}

      {/* Blocked or Warning Product Breakdown */}
      {validationReport?.blockedProducts && validationReport.blockedProducts.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fca5a5", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={18} /> Products Blocked from Export
          </div>
          <div className="table-responsive">
            <table className="pim-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Required Corrections</th>
                </tr>
              </thead>
              <tbody>
                {validationReport.blockedProducts.map((bp) => (
                  <tr key={bp._id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{bp.sku}</td>
                    <td style={{ fontWeight: 500 }}>{bp.name}</td>
                    <td>
                      <ul style={{ paddingLeft: "1.25rem", color: "#fca5a5", fontSize: "0.78rem" }}>
                        {bp.errors.map((err, i) => (
                          <li key={i}>{err.message}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
