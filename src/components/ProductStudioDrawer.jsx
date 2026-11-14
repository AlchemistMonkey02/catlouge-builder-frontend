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
  MapPin,
  Upload,
  Zap,
  Palette,
  ExternalLink,
} from "lucide-react";
import ImageUpscaleModal from "./ImageUpscaleModal";

const ODOP_PRESETS = {
  "Kota Doria": {
    category: "Kota Doria Specialty",
    odopProduct: "Kota Doria",
    district: "Kota, Rajasthan",
    size: "6.5m (Includes 80cm Running Blouse Piece)",
    material: "Pure Mulberry Silk Warp, Fine Cotton Weft",
    finish: "Tested Electro-Gold Zari on Square Khat",
    application: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
    moq: "10 Pieces (Wholesale)",
    priceRange: "₹2,450 – ₹6,500",
  },
  "Garlic": {
    category: "Garlic Specialty",
    odopProduct: "Garlic",
    district: "Baran, Rajasthan",
    size: "50 - 65 mm (Grade A+ Large)",
    material: "100% Organically Grown Malwa Garlic",
    finish: "Sun-Cured Export Clean White Skin",
    application: "Commercial Culinary, Food Processing & Export",
    moq: "500 kg (Wholesale Lot)",
    priceRange: "₹180 – ₹240 / kg",
  },
  "Kota Stone": {
    category: "Kota Stone Specialty",
    odopProduct: "Kota Stone",
    district: "Jhalawar, Rajasthan",
    size: "600x600 mm (20mm Calibrated)",
    material: "Natural Indurated Limestone (Kota Stone)",
    finish: "Mirror High Polish / Honed",
    application: "Heavy Commercial Flooring & Corridors",
    moq: "500 sq.ft (Quarry Lot)",
    priceRange: "₹85 – ₹120 / sq.ft",
  },
  "Sandstone": {
    category: "Sand Stone Specialty",
    odopProduct: "Sandstone",
    district: "Bundi, Rajasthan",
    size: "600x900 mm (25-30mm Calibrated Sawn)",
    material: "Natural Quartzite Sandstone",
    finish: "Sandblasted / Hand-Chiseled / Honed",
    application: "Exterior Facades, Cladding & Paving",
    moq: "400 sq.ft (Project Lot)",
    priceRange: "₹135 – ₹190 / sq.ft",
  },
};
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
  const [isUpscaleModalOpen, setIsUpscaleModalOpen] = useState(false);
  const [pendingUploadImage, setPendingUploadImage] = useState("");
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
              {/* UNDER WHICH ODOP CATEGORY DOES THIS PRODUCT BELONG? */}
              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--primary-light, #818cf8)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <MapPin size={17} style={{ color: "var(--primary)" }} />
                  <label style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    Under Which ODOP Category Does This Product Belong? *
                  </label>
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                  Select the official Rajasthan ODOP corridor to bind the correct district and 4-point specifications:
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem", marginBottom: "0.75rem" }}>
                  {[
                    { product: "Kota Doria", district: "Kota, Rajasthan", label: "🥻 Kota Doria", loc: "District: Kota", cat: "Kota Doria Specialty" },
                    { product: "Garlic", district: "Baran, Rajasthan", label: "🧄 Garlic", loc: "District: Baran", cat: "Garlic Specialty" },
                    { product: "Kota Stone", district: "Jhalawar, Rajasthan", label: "🏛️ Kota Stone", loc: "District: Jhalawar", cat: "Kota Stone Specialty" },
                    { product: "Sandstone", district: "Bundi, Rajasthan", label: "🧱 Sandstone", loc: "District: Bundi", cat: "Sand Stone Specialty" },
                  ].map((od) => {
                    const isSelected =
                      formData.odopProduct === od.product ||
                      formData.category === od.cat ||
                      (od.product === "Garlic" && (formData.category || "").toLowerCase().includes("garlic")) ||
                      (od.product === "Kota Stone" && (formData.category || "").toLowerCase().includes("stone") && !(formData.category || "").toLowerCase().includes("sand")) ||
                      (od.product === "Sandstone" && (formData.category || "").toLowerCase().includes("sand")) ||
                      (od.product === "Kota Doria" && (formData.category || "").toLowerCase().includes("doria"));

                    return (
                      <button
                        key={od.product}
                        type="button"
                        onClick={() => {
                          const preset = ODOP_PRESETS[od.product];
                          setFormData((prev) => ({
                            ...prev,
                            category: preset.category,
                            odopProduct: preset.odopProduct,
                            district: preset.district,
                            size: preset.size,
                            material: preset.material,
                            materialComposition: preset.material,
                            finish: preset.finish,
                            application: preset.application,
                            useApplication: preset.application,
                            moq: preset.moq,
                            priceRange: preset.priceRange,
                          }));
                        }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                          background: isSelected ? "var(--primary-light, rgba(99, 102, 241, 0.12))" : "var(--bg-surface)",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: "0.85rem", color: isSelected ? "var(--primary)" : "var(--text-primary)" }}>
                          {od.label}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: isSelected ? "var(--primary)" : "var(--text-muted)", marginTop: "2px", fontWeight: isSelected ? 700 : 500 }}>
                          📍 {od.loc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ fontWeight: 750, color: "#15803d" }}>
                    📍 Catalogue District: <strong>{formData.district || "Baran / Kota / Jhalawar / Bundi, Rajasthan"}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                    🏷️ ODOP: {formData.odopProduct || "Verified Product"}
                  </span>
                </div>
              </div>

              {/* FOUR MANDATORY ODOP SPECIFICATION POINTS */}
              <div
                style={{
                  background: "var(--bg-surface)",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    Four Mandatory ODOP Product Specification Points
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#166534", background: "#dcfce7", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                    ✓ Auto-Formatted for Catalogue
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      📏 1. Size / Specification *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. 6.5m with blouse / 50-65 mm / 600x600 mm"
                      value={formData.size || ""}
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      🧵 2. Material Composition *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. Pure Mulberry Silk & Cotton / Indurated Limestone"
                      value={formData.material || formData.materialComposition || ""}
                      onChange={(e) => {
                        handleChange("material", e.target.value);
                        handleChange("materialComposition", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      ✨ 3. Surface Finish *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. Tested Gold Zari / Sun-Cured White Skin / Mirror Polish"
                      value={formData.finish || ""}
                      onChange={(e) => handleChange("finish", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      🎯 4. Use / Application *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. Bridal Ensembles / Commercial Culinary / High Footfall Flooring"
                      value={formData.application || formData.useApplication || ""}
                      onChange={(e) => {
                        handleChange("application", e.target.value);
                        handleChange("useApplication", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      📦 Minimum Order Quantity (MOQ)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. 10 Pieces / 500 kg / 500 sq.ft"
                      value={formData.moq || ""}
                      onChange={(e) => handleChange("moq", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      💰 Price Range
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. ₹2,450 – ₹6,500 / ₹180 – ₹240 / kg"
                      value={formData.priceRange || ""}
                      onChange={(e) => handleChange("priceRange", e.target.value)}
                    />
                  </div>
                </div>
              </div>

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
              {/* Full Studio Shoot Launch Banner */}
              <div
                className="card"
                style={{
                  background: "linear-gradient(135deg, rgba(67, 56, 202, 0.12) 0%, rgba(126, 34, 206, 0.12) 100%)",
                  border: "1px solid rgba(67, 56, 202, 0.35)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.85rem 1.15rem",
                  borderRadius: "var(--radius-md)",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem" }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span>AI Studio Product Shoot Engine</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Cut out products, add luxury marble stages, realistic shadows &amp; export directly to catalogue.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline-flex", gap: "6px", alignItems: "center", whiteSpace: "nowrap", fontWeight: 700 }}
                  onClick={() => {
                    navigate("/ai-studio", {
                      state: {
                        image: formData.image,
                        productId: formData._id,
                        productName: formData.name,
                        companyId: formData.companyId,
                        returnTo: window.location.pathname,
                      },
                    });
                    if (onClose) onClose();
                  }}
                >
                  <Sparkles size={14} /> Open in AI Studio <ExternalLink size={13} />
                </button>
              </div>

              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Primary Image (Upload &amp; Upscale 2x/4x)
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ display: "inline-flex", gap: "5px", alignItems: "center", padding: "2px 8px", fontSize: "0.74rem", color: "#10b981", borderColor: "#10b981" }}
                      onClick={() => {
                        setPendingUploadImage(formData.image);
                        setIsUpscaleModalOpen(true);
                      }}
                      title="Upscale this image to 2x or 4x HD"
                    >
                      <Zap size={12} /> Upscale 2x/4x
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", gap: "5px", fontWeight: 700 }}>
                    <Upload size={14} /> Upload &amp; Upscale
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPendingUploadImage(reader.result);
                          setIsUpscaleModalOpen(true);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem", flex: 1 }}
                    value={formData.image || ""}
                    onChange={(e) => handleChange("image", e.target.value)}
                    placeholder="Paste URL or upload image"
                  />
                </div>
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

      {/* Image Upscale & Enhancement Modal */}
      <ImageUpscaleModal
        isOpen={isUpscaleModalOpen}
        onClose={() => setIsUpscaleModalOpen(false)}
        imageSrc={pendingUploadImage}
        productData={{
          productId: formData._id,
          name: formData.name || "Product",
          companyId: formData.companyId,
        }}
        onApply={(finalImg) => {
          handleChange("image", finalImg);
        }}
      />
    </div>
  );
}
