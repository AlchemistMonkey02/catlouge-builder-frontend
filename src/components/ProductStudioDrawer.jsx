import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Building2,
  Upload,
  Zap,
  Palette,
  ExternalLink,
  Eye,
} from "lucide-react";
import ImageUpscaleModal from "./ImageUpscaleModal";
import ProductImagePreviewModal from "./ProductImagePreviewModal";
import { SmartPresetInput, ODOP_CATEGORY_PRESETS } from "../pages/CompanyCatalogueManager";

const ODOP_PRESETS = {
  "Kota Doria": {
    category: "Kota Doria Specialty",
    odopProduct: "Kota Doria",
    district: "Kota, Rajasthan",
    size: "6.5m (Includes 80cm Running Blouse Piece)",
    material: "Pure Mulberry Silk Warp, Fine Cotton Weft",
    finish: "Tested Electro-Gold Zari on Square Khat",
    application: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
    priceRange: "₹2,450 – ₹6,500",
    unit: "",
  },
  "Garlic": {
    category: "Garlic Specialty",
    odopProduct: "Garlic",
    district: "Baran, Rajasthan",
    size: "50 - 65 mm (Grade A+ Large)",
    material: "100% Organically Grown Malwa Garlic",
    finish: "Sun-Cured Export Clean White Skin",
    application: "Commercial Culinary, Food Processing & Export",
    priceRange: "₹180 – ₹240 / kg",
    unit: "kg",
  },
  "Kota Stone": {
    category: "Kota Stone Specialty",
    odopProduct: "Kota Stone",
    district: "Jhalawar, Rajasthan",
    size: "600x600 mm (20mm Calibrated)",
    material: "Natural Indurated Limestone (Kota Stone)",
    finish: "Mirror High Polish / Honed",
    application: "Heavy Commercial Flooring & Corridors",
    priceRange: "₹85 – ₹120 / sq.ft",
    unit: "sq.ft",
  },
  "Sandstone": {
    category: "Sand Stone Specialty",
    odopProduct: "Sandstone",
    district: "Bundi, Rajasthan",
    size: "600x900 mm (25-30mm Calibrated Sawn)",
    material: "Natural Quartzite Sandstone",
    finish: "Sandblasted / Hand-Chiseled / Honed",
    application: "Exterior Facades, Cladding & Paving",
    priceRange: "₹135 – ₹190 / sq.ft",
    unit: "sq.ft",
  },
};

import { resolveCompanyCategory } from "../utils/defaultDataBank";

export function getCategoryFamily(item) {
  return resolveCompanyCategory(item);
}
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
  const [priceNotice, setPriceNotice] = useState(null);

  // Image Studio State
  const [bgMode, setBgMode] = useState("white");
  const [badgeText, setBadgeText] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isUpscaleModalOpen, setIsUpscaleModalOpen] = useState(false);
  const [pendingUploadImage, setPendingUploadImage] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [upscaleStats, setUpscaleStats] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setFormData({ ...product });
    if (product.validationResults) {
      setChannelAudit(product.validationResults);
    }
  }, [product]);

  const categoryFamily = useMemo(() => {
    return getCategoryFamily(formData);
  }, [formData?.odopProduct, formData?.category, formData?.district, formData?.name]);

  const handleSave = () => {
    const specs = Array.isArray(formData.technicalSpecifications) ? [...formData.technicalSpecifications] : [];
    if (formData.thickness && !specs.some((s) => s.key?.toLowerCase().includes("thickness"))) {
      specs.unshift({ key: "Thickness", value: formData.thickness, verified: true });
    }
    if (formData.fabricWeight && !specs.some((s) => s.key?.toLowerCase().includes("weight"))) {
      specs.unshift({ key: "Fabric Weight", value: formData.fabricWeight, verified: true });
    }
    onSave({ ...formData, technicalSpecifications: specs });
  };

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
              {/* REGISTERED COMPANY ODOP CORRIDOR (Inherited from Company Profile - Never prompts repeatedly) */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)",
                  padding: "0.85rem 1.1rem",
                  borderRadius: "10px",
                  border: "1.5px solid rgba(99, 102, 241, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "var(--primary)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)",
                      flexShrink: 0
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                      Registered Company ODOP Category
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {categoryFamily === "garlic" ? "🧄 Garlic Specialty" :
                       categoryFamily === "sandstone" ? "🧱 Sand Stone Specialty" :
                       categoryFamily === "kotastone" ? "🏛️ Kota Stone Specialty" :
                       categoryFamily === "kotadoria" ? "🥻 Kota Doria Handloom" :
                       (formData.category || "General Specialty")}
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.82rem", marginLeft: "6px" }}>
                        ({formData.brand || "Registered Enterprise"})
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 750,
                      color: "#15803d",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    📍 Registered District: <strong>{formData.district || "Rajasthan"}</strong>
                  </span>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      padding: "4px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    ✓ Linked at Company Registration
                  </span>
                </div>
              </div>

              {/* CATEGORY-SPECIFIC MANDATORY SPECIFICATION POINTS */}
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
                    {categoryFamily === "garlic"
                      ? "🧄 Garlic Agro Specifications & Grading Standards"
                      : (categoryFamily === "sandstone" || categoryFamily === "kotastone")
                      ? "🧱 Stone Architectural Specifications & Calibration (Thickness & Surface)"
                      : categoryFamily === "kotadoria"
                      ? "🥻 Kota Doria Artisan Handloom Specifications (Length & Weight)"
                      : "Four Mandatory Product Specification Points"}
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#166534", background: "#dcfce7", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                    ✓ Auto-Formatted for Catalogue
                  </span>
                </div>

                {/* Dynamic Price Notice Pill inside Specifications */}
                {priceNotice && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1.5px solid rgba(16, 185, 129, 0.4)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    color: "#059669",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}>
                    <span>⚡ {priceNotice}</span>
                    <button
                      type="button"
                      onClick={() => setPriceNotice(null)}
                      style={{ background: "transparent", border: "none", color: "#059669", cursor: "pointer", fontWeight: 800, fontSize: "0.85rem" }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Conditional Fields: GARLIC */}
                {categoryFamily === "garlic" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Bulb Caliber / Sizing Diameter *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🧄</span>}
                          placeholder="e.g. 50 - 65 mm (Grade A+ Large) / 40-50 mm (Medium)"
                          value={formData.size || ""}
                          onChange={(val) => handleChange("size", val)}
                          presets={ODOP_CATEGORY_PRESETS.garlic.thickness}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setFormData((prev) => ({
                                ...prev,
                                size: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.35),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Price auto-adjusted to ₹${preset.price}/kg based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select grade to auto-calculate price, or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Moisture Content & Quality Standard *"
                          icon={<span style={{ fontSize: "0.9rem" }}>💧</span>}
                          placeholder="e.g. Moisture < 65%, Sun-Cured Clean White"
                          value={formData.material || formData.materialComposition || ""}
                          onChange={(val) => {
                            handleChange("material", val);
                            handleChange("materialComposition", val);
                          }}
                          presets={[
                            { value: "Moisture < 65%, Sun-Cured Clean White (Export Ready)", chipLabel: "<65% Export", label: "Moisture < 65%, Sun-Cured Clean White (Export Ready)" },
                            { value: "Moisture < 70%, Well-Dried Organically Grown", chipLabel: "<70% Organic", label: "Moisture < 70%, Well-Dried Organically Grown" },
                            { value: "Standard Mandi Sun-Cured, High Allicin", chipLabel: "Standard Mandi", label: "Standard Mandi Sun-Cured, High Allicin" },
                          ]}
                          customHelpText="💡 Pick quality standard or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Curing & Skin Finish *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Sun-Cured Export Clean White Skin"
                          value={formData.finish || ""}
                          onChange={(val) => handleChange("finish", val)}
                          presets={ODOP_CATEGORY_PRESETS.garlic.finishes}
                          customHelpText="💡 Pick curing finish or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Variety, Packaging & Commercial Use *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Malwa Desi in 25kg Aerated Red Mesh Bags"
                          value={formData.application || formData.useApplication || ""}
                          onChange={(val) => {
                            handleChange("application", val);
                            handleChange("useApplication", val);
                          }}
                          presets={ODOP_CATEGORY_PRESETS.garlic.applications}
                          customHelpText="💡 Pick packaging or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: SANDSTONE / KOTA STONE */}
                {(categoryFamily === "sandstone" || categoryFamily === "kotastone") && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Plan Dimensions / Tile Size (L × W) *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📐</span>}
                          placeholder="e.g. 2×2 ft (600×600 mm) / Custom Size"
                          value={formData.size || ""}
                          onChange={(val) => handleChange("size", val)}
                          presets={ODOP_CATEGORY_PRESETS[categoryFamily]?.sizes || ODOP_CATEGORY_PRESETS.kotastone.sizes}
                          customHelpText="💡 Pick standard tile dimensions or type custom size."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Stone Thickness & Gauging Calibration *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. 20 - 25 mm Gauged / Custom Thickness"
                          value={formData.thickness || ""}
                          onChange={(val) => handleChange("thickness", val)}
                          presets={ODOP_CATEGORY_PRESETS[categoryFamily]?.thickness || ODOP_CATEGORY_PRESETS.kotastone.thickness}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setFormData((prev) => ({
                                ...prev,
                                thickness: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.4),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Rate auto-adjusted to ₹${preset.price}/sq.ft based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select thickness to auto-update rate, or type custom thickness."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Surface Finish & Edge Treatment *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Mirror Polish / Honed Satin / Hand-Chiseled"
                          value={formData.finish || ""}
                          onChange={(val) => handleChange("finish", val)}
                          presets={ODOP_CATEGORY_PRESETS[categoryFamily]?.finishes || ODOP_CATEGORY_PRESETS.kotastone.finishes}
                          customHelpText="💡 Pick texture finish or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Rock Material & Commercial Application *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Natural Limestone / Heavy Traffic Flooring"
                          value={formData.material || formData.materialComposition || formData.application || ""}
                          onChange={(val) => {
                            handleChange("material", val);
                            handleChange("materialComposition", val);
                            handleChange("application", val);
                            handleChange("useApplication", val);
                          }}
                          presets={ODOP_CATEGORY_PRESETS[categoryFamily]?.applications || ODOP_CATEGORY_PRESETS.kotastone.applications}
                          customHelpText="💡 Pick stone application or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: KOTA DORIA */}
                {categoryFamily === "kotadoria" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Fabric Length & Cut Dimensions *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. 6.5 Metres with 80cm Running Blouse"
                          value={formData.size || ""}
                          onChange={(val) => handleChange("size", val)}
                          presets={ODOP_CATEGORY_PRESETS.kotadoria.thickness}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setFormData((prev) => ({
                                ...prev,
                                size: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.5),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Price auto-adjusted to ₹${preset.price} based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select cut length to auto-set price, or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Fabric Weight & Yarn Count *"
                          icon={<span style={{ fontSize: "0.9rem" }}>⚖️</span>}
                          placeholder="e.g. Lightweight 280-320 grams / 80s × 100s Count"
                          value={formData.fabricWeight || ""}
                          onChange={(val) => handleChange("fabricWeight", val)}
                          presets={[
                            { value: "Lightweight 280-320 grams (80s Cotton × 100s Silk)", chipLabel: "280-320g Silk/Cotton", label: "Lightweight 280-320 grams (80s Cotton × 100s Silk)" },
                            { value: "Featherlight 240-270 grams (Pure Silk Warp & Weft)", chipLabel: "240-270g Pure Silk", label: "Featherlight 240-270 grams (Pure Silk Warp & Weft)" },
                            { value: "Medium 350-380 grams (Pure Cotton Handloom)", chipLabel: "350-380g Pure Cotton", label: "Medium 350-380 grams (Pure Cotton Handloom)" },
                          ]}
                          customHelpText="💡 Pick yarn count weight or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Weave Grid (Khat) & Zari Border *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Traditional Square Khat Grid with Tested Gold Zari"
                          value={formData.finish || ""}
                          onChange={(val) => handleChange("finish", val)}
                          presets={ODOP_CATEGORY_PRESETS.kotadoria.finishes}
                          customHelpText="💡 Pick weave motif or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Fiber Composition, Occasion & Care *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Pure Mulberry Silk & Cotton / Dry Clean Only"
                          value={formData.material || formData.materialComposition || formData.application || ""}
                          onChange={(val) => {
                            handleChange("material", val);
                            handleChange("materialComposition", val);
                            handleChange("application", val);
                            handleChange("useApplication", val);
                          }}
                          presets={ODOP_CATEGORY_PRESETS.kotadoria.applications}
                          customHelpText="💡 Pick composition & care or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: GENERAL FALLBACK */}
                {categoryFamily !== "garlic" && categoryFamily !== "sandstone" && categoryFamily !== "kotastone" && categoryFamily !== "kotadoria" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Size / Specification *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. Dimensions, Capacity, Size"
                          value={formData.size || ""}
                          onChange={(val) => handleChange("size", val)}
                          presets={[
                            { value: "Standard Regular Size", chipLabel: "Standard", label: "Standard Regular Size" },
                            { value: "Large Format / Heavy Duty", chipLabel: "Large", label: "Large Format / Heavy Duty" },
                            { value: "Compact / Portable Size", chipLabel: "Compact", label: "Compact / Portable Size" },
                          ]}
                          customHelpText="💡 Pick standard size or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Material Composition *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🧵</span>}
                          placeholder="e.g. Material, Fabric, Metal"
                          value={formData.material || formData.materialComposition || ""}
                          onChange={(val) => {
                            handleChange("material", val);
                            handleChange("materialComposition", val);
                          }}
                          presets={[
                            { value: "High Grade Natural Composition", chipLabel: "Natural", label: "High Grade Natural Composition" },
                            { value: "Premium Certified Organic Component", chipLabel: "Organic", label: "Premium Certified Organic Component" },
                          ]}
                          customHelpText="💡 Pick material or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                          ✨ 3. Surface Finish / Color *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          style={{ paddingLeft: "0.85rem" }}
                          placeholder="e.g. Matte, Polished, Color"
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
                          placeholder="e.g. Commercial, Residential, Apparel"
                          value={formData.application || formData.useApplication || ""}
                          onChange={(e) => {
                            handleChange("application", e.target.value);
                            handleChange("useApplication", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Price Range */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    💰 Price Range (₹)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder={
                      categoryFamily === "garlic"
                        ? "e.g. ₹180 – ₹240 / kg"
                        : (categoryFamily === "sandstone" || categoryFamily === "kotastone")
                        ? "e.g. ₹85 – ₹140 / sq.ft"
                        : categoryFamily === "kotadoria"
                        ? "e.g. ₹2,450 – ₹6,500"
                        : "e.g. ₹1,000 – ₹2,500"
                    }
                    value={formData.priceRange || ""}
                    onChange={(e) => handleChange("priceRange", e.target.value)}
                  />
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

              {/* Dynamic Price Adjustment Notice */}
              {priceNotice && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1.5px solid rgba(16, 185, 129, 0.4)",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  color: "#059669",
                  fontSize: "0.82rem",
                  fontWeight: 700
                }}>
                  <span>⚡ {priceNotice}</span>
                  <button
                    type="button"
                    onClick={() => setPriceNotice(null)}
                    style={{ background: "transparent", border: "none", color: "#059669", cursor: "pointer", fontWeight: 800, fontSize: "0.9rem" }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Pricing, Stock, Unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr", gap: "0.75rem" }}>
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
                    Pricing Unit (per)
                  </label>
                  <select
                    className="input-field"
                    style={{ paddingLeft: "0.6rem", fontWeight: 600, background: "var(--bg-surface)" }}
                    value={formData.unit || ""}
                    onChange={(e) => handleChange("unit", e.target.value)}
                  >
                    {categoryFamily === "garlic" ? (
                      <>
                        <option value="kg">kg (Garlic, Produce - Standard)</option>
                        <option value="g">g (Grams - Retail Packs)</option>
                        <option value="quintal">quintal (100 kg - Mandi Wholesale)</option>
                        <option value="tonne">tonne / MT (Bulk Export)</option>
                        <option value="mesh bag">mesh bag (10kg/25kg)</option>
                        <option value="box">box (Pack, Carton)</option>
                        <option value="">No Unit</option>
                      </>
                    ) : (categoryFamily === "sandstone" || categoryFamily === "kotastone") ? (
                      <>
                        <option value="sq.ft">sq.ft (Stone, Tiles, Flooring - Standard)</option>
                        <option value="sq.m">sq.m (Square Metre)</option>
                        <option value="piece">piece (Pre-cut Paver, Tile, Jali)</option>
                        <option value="slab">slab (Gangsaw Architectural Slab)</option>
                        <option value="tonne">tonne / MT (Bulk Quarry Stone)</option>
                        <option value="">No Unit</option>
                      </>
                    ) : categoryFamily === "kotadoria" ? (
                      <>
                        <option value="">No Unit (Clean Price like ₹3,200 — Recommended for Sarees)</option>
                        <option value="saree">saree (Per Saree)</option>
                        <option value="piece">piece (Individual Piece)</option>
                        <option value="metre">metre (Running Handloom Fabric)</option>
                        <option value="set">set (2-pc / 3-pc Suit Ensemble)</option>
                        <option value="dupatta">dupatta (Per Dupatta)</option>
                      </>
                    ) : (
                      <>
                        <option value="">No Unit (Clothes, Saree, Items)</option>
                        <option value="piece">piece (Individual Unit)</option>
                        <option value="sq.ft">sq.ft (Stone, Tiles, Granite)</option>
                        <option value="sq.m">sq.m (Square Metre)</option>
                        <option value="kg">kg (Garlic, Spices, Agro)</option>
                        <option value="g">g (Gram)</option>
                        <option value="tonne">tonne / MT</option>
                        <option value="metre">metre (Textiles, Fabric)</option>
                        <option value="litre">litre (Liquids)</option>
                        <option value="set">set (Ensemble, Suite)</option>
                        <option value="box">box (Pack, Carton)</option>
                      </>
                    )}
                  </select>
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

              {/* Live Price Tag Preview */}
              <div style={{ marginTop: "0.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Display in catalogue:</span>
                <span style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #a7f3d0",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}>
                  ₹{(formData.price || 0).toLocaleString()}{formData.unit ? ` / ${formData.unit}` : ""}
                </span>
                <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.74rem" }}>
                  {formData.unit ? `(Priced per ${formData.unit})` : "(No unit suffix — perfect for clothes, sarees, electronics & standalone products)"}
                </span>
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

              {/* Dimensions & Weight (Only for general items) */}
              {categoryFamily === "general" && (
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
              )}

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
                  <div style={{ display: "flex", gap: "6px" }}>
                    {formData.image && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ display: "inline-flex", gap: "5px", alignItems: "center", padding: "2px 8px", fontSize: "0.74rem", color: "#2563eb", borderColor: "#2563eb", background: "rgba(37, 99, 235, 0.08)", fontWeight: 700 }}
                        onClick={() => setIsPreviewModalOpen(true)}
                        title="Preview uploaded & upscaled image in full resolution"
                      >
                        <Eye size={12} /> Preview Image
                      </button>
                    )}
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
                  {formData.image && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsPreviewModalOpen(true)}
                      title="Click to preview full-resolution product image"
                      style={{
                        position: "relative",
                        flexShrink: 0,
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1.5px solid #2563eb",
                        boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                        display: "block",
                      }}
                    >
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{ width: "42px", height: "42px", objectFit: "cover", display: "block" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(15, 23, 42, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.15s ease",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
                      >
                        <Eye size={14} />
                      </div>
                      {upscaleStats && (
                        <span
                          style={{
                            position: "absolute",
                            top: "1px",
                            right: "1px",
                            background: "#10b981",
                            color: "#fff",
                            fontSize: "0.55rem",
                            fontWeight: 800,
                            padding: "0 3px",
                            borderRadius: "2px",
                            pointerEvents: "none",
                          }}
                        >
                          {upscaleStats.scale || "HD"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {upscaleStats && (
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "#166534", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                    <span>✓ Image optimized: {upscaleStats.from} ➔ {upscaleStats.to} ({upscaleStats.scale} Super-Resolution applied)</span>
                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontWeight: 700,
                        textDecoration: "underline",
                        padding: 0,
                        fontSize: "0.74rem",
                      }}
                    >
                      View HD Preview ➔
                    </button>
                  </div>
                )}
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
          <button className="btn btn-primary" onClick={handleSave}>
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
        onApply={(finalImg, stats) => {
          handleChange("image", finalImg);
          setUpscaleStats(stats);
        }}
      />

      {/* Full-Resolution Product Image Preview Modal */}
      <ProductImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        imageUrl={formData.image}
        productName={formData.name || "Product"}
        productMeta={{
          sku: formData.sku,
          category: formData.category,
          price: formData.price,
          unit: formData.unit,
          district: formData.district,
          id: formData._id,
        }}
        upscaleStats={upscaleStats}
        onOpenUpscale={(imgUrl) => {
          setPendingUploadImage(imgUrl);
          setIsUpscaleModalOpen(true);
        }}
        onOpenAiStudio={(imgUrl) => {
          navigate("/ai-studio", {
            state: {
              image: imgUrl,
              productId: formData._id || null,
              productName: formData.name || "Product",
              companyId: formData.companyId || null,
              returnTo: window.location.pathname,
            },
          });
        }}
      />
    </div>
  );
}
