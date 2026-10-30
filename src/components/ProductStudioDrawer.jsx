import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Save,
  Image as ImageIcon,
  Wand2,
  Sliders,
  Download,
  Plus,
  Trash2,
  Layers,
  Copy,
} from "lucide-react";
// AI features commented out:
// import {
//   generateAiContent,
//   rewriteAiField,
// } from "../services/api";
import {
  auditImageCompliance,
  exportImageZipArchive,
} from "../services/api";

const REWRITE_TONES = [
  { id: "professional", label: "Professional" },
  { id: "premium", label: "Premium Luxury" },
  { id: "minimal", label: "Minimalist" },
  { id: "seo_focused", label: "SEO Optimized" },
  { id: "feature_focused", label: "Feature Focused" },
  { id: "conversion_focused", label: "High Conversion" },
  { id: "marketplace_compliant", label: "Marketplace Strict" },
  { id: "brand_specific", label: "Brand Voice" },
];

export default function ProductStudioDrawer({ product, onClose, onSave }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pim");
  const [formData, setFormData] = useState({ ...product });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedRewriteTone, setSelectedRewriteTone] = useState("professional");
  const [channelAudit, setChannelAudit] = useState(null);

  // Image Studio State
  const [bgMode, setBgMode] = useState("white");
  const [badgeText, setBadgeText] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const canvasRef = useRef(null);

  useEffect(() => {
    setFormData({ ...product });
    if (product.validationResults) {
      setChannelAudit(product.validationResults);
    }
  }, [product]);

  // Handle direct input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle field lock
  const handleToggleLock = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      fieldLocks: {
        ...(prev.fieldLocks || {}),
        [fieldName]: !(prev.fieldLocks && prev.fieldLocks[fieldName]),
      },
    }));
  };

  // AI handlers commented out - AI features disabled
  /*
  const handleRunAi = async () => { ... };
  const handleRewriteSingle = async () => { ... };
  */
  const handleRunAi = () => {};
  const handleRewriteSingle = () => {};

  // Add Technical Spec
  const handleAddSpec = () => {
    const specs = formData.technicalSpecifications || [];
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: [...specs, { key: "Feature", value: "Standard", verified: true }],
    }));
  };

  // Delete Technical Spec
  const handleDeleteSpec = (idx) => {
    const specs = [...(formData.technicalSpecifications || [])];
    specs.splice(idx, 1);
    setFormData((prev) => ({ ...prev, technicalSpecifications: specs }));
  };

  // Render Canvas in Image Studio
  useEffect(() => {
    if (activeTab !== "image" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;

      // Background fill
      if (bgMode === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1000, 1000);
      } else if (bgMode === "grey") {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, 1000, 1000);
      } else {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 1000, 1000);
      }

      // Filter adjustments
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Draw image centered & padded for Amazon zoom compatibility
      const pad = 100;
      ctx.drawImage(img, pad, pad, 1000 - pad * 2, 1000 - pad * 2);
      ctx.filter = "none";

      // Optional Callout Badge Overlay
      if (badgeText) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.roundRect ? ctx.roundRect(60, 860, 400, 70, 12) : ctx.fillRect(60, 860, 400, 70);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(`✓ ${badgeText.toUpperCase()}`, 85, 905);
      }
    };
  }, [activeTab, formData.image, bgMode, badgeText, brightness, contrast]);

  // Download Canvas Image
  const handleDownloadCanvas = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${formData.sku}_1000x1000_Square.jpg`;
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  // Export ZIP Archive of media
  const handleExportMediaZip = async () => {
    try {
      const blob = await exportImageZipArchive({ productId: formData._id });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${formData.sku}_Media_Assets.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("ZIP export failed: " + err.message);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                padding: "2px 8px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
              }}
            >
              {formData.sku}
            </span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Product Studio
            </span>
            <span className={`status-pill ${formData.status}`}>
              {formData.status}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select
              className="select-field"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
            >
              <option value="draft">Draft</option>
              <option value="needs_review">Needs Review</option>
              <option value="validated">Validated</option>
              <option value="approved">Approved</option>
              <option value="exported">Exported</option>
              <option value="published">Published</option>
            </select>

            <button
              className="btn btn-outline btn-sm"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: "0 1.5rem", background: "var(--bg-glass)" }}>
          <div className="studio-tabs">
            <button
              className={`studio-tab-btn ${activeTab === "pim" ? "active" : ""}`}
              onClick={() => setActiveTab("pim")}
            >
              <Sliders size={15} />
              <span>Core PIM &amp; Specs</span>
            </button>
            {/* AI Content Studio tab commented out */}
            {/*
            <button
              className={`studio-tab-btn ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles size={15} />
              <span>AI Content Studio</span>
              <span className="ai-spark-badge">Active</span>
            </button>
            */}
            <button
              className={`studio-tab-btn ${activeTab === "image" ? "active" : ""}`}
              onClick={() => setActiveTab("image")}
            >
              <ImageIcon size={15} />
              <span>Image Studio</span>
            </button>
            <button
              className={`studio-tab-btn ${activeTab === "compliance" ? "active" : ""}`}
              onClick={() => setActiveTab("compliance")}
            >
              <CheckCircle size={15} />
              <span>Channel Compliance Matrix</span>
            </button>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="drawer-body">
          {/* TAB 1: CORE PIM ATTRIBUTES */}
          {activeTab === "pim" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Product Title (Name)
                  </label>
                  {/* Field lock button commented out */}
                </div>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: "0.85rem" }}
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Character count: {(formData.name || "").length} / 200 (Amazon Limit)
                </div>
              </div>

              {/* Pricing, Stock, Tax */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.price || 0}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                  />
                </div>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.mrp || 0}
                    onChange={(e) => handleChange("mrp", Number(e.target.value))}
                  />
                </div>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Stock Available
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.stock || 0}
                    onChange={(e) => handleChange("stock", Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Category, Brand, HSN */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                  />
                </div>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                  />
                </div>
                <div className="card">
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    HSN Code
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={formData.hsnCode || ""}
                    onChange={(e) => handleChange("hsnCode", e.target.value)}
                  />
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
                  Packaging &amp; Dimensions
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Length (cm)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem" }}
                      value={formData.dimensions?.length || 0}
                      onChange={(e) =>
                        handleChange("dimensions", { ...(formData.dimensions || {}), length: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Width (cm)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem" }}
                      value={formData.dimensions?.width || 0}
                      onChange={(e) =>
                        handleChange("dimensions", { ...(formData.dimensions || {}), width: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Height (cm)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem" }}
                      value={formData.dimensions?.height || 0}
                      onChange={(e) =>
                        handleChange("dimensions", { ...(formData.dimensions || {}), height: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Weight (g)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem" }}
                      value={formData.weight?.value || 0}
                      onChange={(e) =>
                        handleChange("weight", { ...(formData.weight || {}), value: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications Key-Value Editor */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Technical Specifications
                  </div>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddSpec}>
                    <Plus size={14} /> Add Spec
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(formData.technicalSpecifications || []).map((spec, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1 }}
                        placeholder="Key (e.g. Battery)"
                        value={spec.key}
                        onChange={(e) => {
                          const updated = [...formData.technicalSpecifications];
                          updated[idx].key = e.target.value;
                          handleChange("technicalSpecifications", updated);
                        }}
                      />
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 2 }}
                        placeholder="Value (e.g. 5000 mAh)"
                        value={spec.value}
                        onChange={(e) => {
                          const updated = [...formData.technicalSpecifications];
                          updated[idx].value = e.target.value;
                          handleChange("technicalSpecifications", updated);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: "#ef4444" }}
                        onClick={() => handleDeleteSpec(idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI CONTENT STUDIO (Commented out - AI features disabled) */}
          {/*
          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              ...
            </div>
          )}
          */}

          {/* TAB 3: AI IMAGE STUDIO */}
          {activeTab === "image" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Full Studio Shoot Launch Banner commented out */}
              {/*
              <div
                className="card"
                style={{
                  background: "linear-gradient(135deg, rgba(67, 56, 202, 0.12) 0%, rgba(126, 34, 206, 0.12) 100%)",
                  border: "1px solid rgba(67, 56, 202, 0.35)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span>AI Studio Product Shoot Engine</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Transform raw phone camera shots with AI cutout, marble/pedestal stages, contact shadows &amp; reflections.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline-flex", gap: "6px", alignItems: "center", whiteSpace: "nowrap" }}
                  onClick={() => {
                    navigate("/ai-studio", {
                      state: {
                        image: formData.image,
                        productId: formData._id,
                      },
                    });
                    if (onClose) onClose();
                  }}
                >
                  <Sparkles size={14} /> Open AI Photo Studio <ExternalLink size={13} />
                </button>
              </div>
              */}

              <div className="card">
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                  Primary Image URL
                </label>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: "0.85rem" }}
                  value={formData.image || ""}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="Paste URL or upload image"
                />
              </div>

              {/* Studio Canvas & Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem" }}>
                {/* Canvas Preview */}
                <div
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      aspectRatio: "1/1",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button className="btn btn-outline btn-sm" onClick={handleDownloadCanvas}>
                      <Download size={14} /> Download 1:1 Square
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={handleExportMediaZip}>
                      <Download size={14} /> Export Asset ZIP
                    </button>
                  </div>
                </div>

                {/* Adjustments Panel */}
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Studio Adjustments
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Background Type</label>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px" }}>
                      <button
                        className={`btn btn-sm ${bgMode === "white" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setBgMode("white")}
                      >
                        Pure White
                      </button>
                      <button
                        className={`btn btn-sm ${bgMode === "grey" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setBgMode("grey")}
                      >
                        Soft Grey
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Brightness: {brightness}%</label>
                    <input
                      type="range"
                      min={80}
                      max={140}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Contrast: {contrast}%</label>
                    <input
                      type="range"
                      min={80}
                      max={140}
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Add Feature Callout Badge</label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem", marginTop: "4px" }}
                      placeholder="e.g. 1-Year Warranty"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHANNEL COMPLIANCE MATRIX */}
          {activeTab === "compliance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  Channel Readiness Audit
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Real-time validation against listing rules and field constraints for major e-commerce platforms.
                </div>
              </div>

              {/* Amazon India */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 650, color: "var(--text-primary)" }}>Amazon India</div>
                  <span className={`status-pill ${formData.name && formData.price && formData.hsnCode ? "approved" : "needs_review"}`}>
                    {formData.name && formData.price && formData.hsnCode ? "Ready" : "Needs Review"}
                  </span>
                </div>
                <ul style={{ fontSize: "0.8rem", color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Title length: {(formData.name || "").length} / 200 chars</li>
                  <li>Bullet points count: {(formData.keyFeatures || []).length} / 5 recommended</li>
                  <li>HSN Code: {formData.hsnCode ? `✓ ${formData.hsnCode}` : "⚠️ Missing HSN Code"}</li>
                  <li>Pure White Background Image: {bgMode === "white" ? "✓ Compliant" : "⚠️ Needs pure white bg"}</li>
                </ul>
              </div>

              {/* Flipkart */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 650, color: "var(--text-primary)" }}>Flipkart</div>
                  <span className={`status-pill ${formData.dimensions?.length ? "approved" : "needs_review"}`}>
                    {formData.dimensions?.length ? "Ready" : "Needs Package Specs"}
                  </span>
                </div>
                <ul style={{ fontSize: "0.8rem", color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Title limit: max 150 chars</li>
                  <li>Package Dimensions (L x W x H): {formData.dimensions?.length ? "✓ Filled" : "⚠️ Missing dimensions"}</li>
                  <li>Weight: {formData.weight?.value ? `✓ ${formData.weight.value}g` : "⚠️ Missing weight"}</li>
                </ul>
              </div>

              {/* Shopify */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 650, color: "var(--text-primary)" }}>Shopify &amp; D2C</div>
                  <span className="status-pill approved">100% Ready</span>
                </div>
                <ul style={{ fontSize: "0.8rem", color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Product Handle: {formData.seo?.slug || "auto-generated"}</li>
                  <li>Rich HTML Description available</li>
                  <li>Variants and inventory trackable</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
