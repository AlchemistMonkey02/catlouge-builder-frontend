import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Maximize2,
  Sliders,
  Check,
  CheckCircle,
  RefreshCw,
  Palette,
  ArrowRight,
  X,
  Image as ImageIcon,
  Layers,
  Eye,
  SlidersHorizontal,
  Flame,
  SunMedium,
} from "lucide-react";
import { upscaleAndEnhanceImage, clientSideUpscale } from "../services/api";

/**
 * ImageUpscaleModal
 * Interactive dialog shown immediately when a user uploads an image.
 * Provides 2x / 4x super-resolution upscaling, natural enhancement,
 * direct application into the catalogue, and 1-click transition to AI Studio.
 */
export default function ImageUpscaleModal({
  isOpen,
  onClose,
  imageSrc,
  productData = {},
  onApply,
}) {
  const navigate = useNavigate();

  const [scaleFactor, setScaleFactor] = useState(2); // 2 = 2x HD, 4 = 4x Ultra 4K, 1 = Natural Enhance, 0 = Raw Original
  const [naturalEnhance, setNaturalEnhance] = useState(true);
  const [edgeSharpness, setEdgeSharpness] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [previewError, setPreviewError] = useState("");

  // Inspect uploaded image dimensions on mount
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth || img.width || 800,
        height: img.naturalHeight || img.height || 800,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const targetWidth = scaleFactor === 0 ? dimensions.width : dimensions.width * (scaleFactor || 1);
  const targetHeight = scaleFactor === 0 ? dimensions.height : dimensions.height * (scaleFactor || 1);

  // Execute Upscale & Apply to Catalogue
  const handleApplyToCatalogue = async () => {
    try {
      setIsProcessing(true);
      setPreviewError("");

      if (scaleFactor === 0) {
        // Raw Original
        onApply(imageSrc, {
          scale: "1x",
          from: `${dimensions.width}x${dimensions.height}`,
          to: `${dimensions.width}x${dimensions.height}`,
        });
        onClose();
        return;
      }

      const sharpnessVal = edgeSharpness ? 1.35 : 1.0;
      const contrastVal = naturalEnhance ? 1.12 : 1.0;
      const satVal = naturalEnhance ? 1.08 : 1.0;

      // Run super-resolution engine
      const res = await upscaleAndEnhanceImage({
        image: imageSrc,
        scaleFactor: scaleFactor,
        sharpness: sharpnessVal,
        contrast: contrastVal,
        saturation: satVal,
      });

      const finalImage = res.image || res.upscaled || imageSrc;
      onApply(finalImage, res.stats || {
        scale: `${scaleFactor}x`,
        from: `${dimensions.width}x${dimensions.height}`,
        to: `${targetWidth}x${targetHeight}`,
      });
      onClose();
    } catch (err) {
      console.warn("Upscale error, falling back to client-side Lanczos:", err);
      try {
        const fallback = await clientSideUpscale(imageSrc, scaleFactor, 1.35, 1.12, 1.08);
        onApply(fallback.image || imageSrc, fallback.stats);
        onClose();
      } catch (fallbackErr) {
        setPreviewError("Processing failed. Applying original image.");
        onApply(imageSrc, { scale: "1x", error: fallbackErr.message });
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Open & Edit in AI Studio
  const handleOpenInAiStudio = () => {
    onClose();
    navigate("/ai-studio", {
      state: {
        image: imageSrc,
        productId: productData.productId || productData._id || null,
        productName: productData.name || "",
        companyId: productData.companyId || null,
        returnTo: window.location.pathname,
      },
    });
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "var(--bg-surface, #ffffff)",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--border-medium, #e2e8f0)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.08) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.18rem",
                  fontWeight: 800,
                  color: "var(--text-primary, #0f172a)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                AI Smart Image Optimizer &amp; Upscaler
              </h3>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary, #64748b)",
                }}
              >
                Upscale to 2x/4x HD and polish lighting so products look fresh, high-resolution and natural in your catalogue
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ padding: "6px", borderRadius: "50%", minWidth: "32px", height: "32px" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "310px 1fr",
            gap: "1.25rem",
          }}
        >
          {/* LEFT: VISUAL PREVIEW & RESOLUTION KPI */}
          <div>
            <div
              style={{
                width: "100%",
                height: "280px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid var(--border-medium, #e2e8f0)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              <img
                src={imageSrc}
                alt="Uploaded preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  right: "10px",
                  padding: "6px 10px",
                  background: "rgba(15, 23, 42, 0.85)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <span>Input: {dimensions.width}×{dimensions.height} px</span>
                <span style={{ color: "#38bdf8", fontWeight: 800 }}>
                  ➔ {targetWidth}×{targetHeight} px
                </span>
              </div>
            </div>

            {/* Resolution Metric Box */}
            <div
              style={{
                marginTop: "10px",
                padding: "10px 12px",
                background: "var(--bg-surface-elevated, #f8fafc)",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle, #e2e8f0)",
                fontSize: "0.78rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "var(--text-secondary, #64748b)" }}>Target Clarity:</span>
                <strong style={{ color: scaleFactor === 4 ? "#8b5cf6" : scaleFactor === 2 ? "#10b981" : "var(--text-primary)" }}>
                  {scaleFactor === 4 ? "4x Ultra HD 4K" : scaleFactor === 2 ? "2x Super HD" : scaleFactor === 1 ? "1x Natural Polish" : "Original Raw"}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary, #64748b)" }}>Catalogue Zoom Quality:</span>
                <strong style={{ color: "#166534" }}>{scaleFactor >= 2 ? "⭐⭐⭐⭐⭐ Crystal Clear" : "Standard"}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: RESOLUTION & ENHANCEMENT CONTROLS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                style={{
                  fontSize: "0.86rem",
                  fontWeight: 750,
                  color: "var(--text-primary, #0f172a)",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                1. Select Target Resolution &amp; Sharpness:
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {/* 2X HD (RECOMMENDED) */}
                <div
                  onClick={() => setScaleFactor(2)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: scaleFactor === 2 ? "2px solid #10b981" : "1px solid var(--border-medium, #cbd5e1)",
                    background: scaleFactor === 2 ? "rgba(16, 185, 129, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#10b981", display: "flex", alignItems: "center", gap: "5px" }}>
                      <Zap size={14} /> 2x Ultra HD
                    </span>
                    <span style={{ fontSize: "0.65rem", background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: "10px", fontWeight: 800 }}>
                      RECOMMENDED
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--text-secondary, #64748b)", lineHeight: 1.3 }}>
                    Doubles resolution, micro-sharpens threads &amp; grains, cleans mobile camera artifacts.
                  </p>
                </div>

                {/* 4X ULTRA 4K */}
                <div
                  onClick={() => setScaleFactor(4)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: scaleFactor === 4 ? "2px solid #8b5cf6" : "1px solid var(--border-medium, #cbd5e1)",
                    background: scaleFactor === 4 ? "rgba(139, 92, 246, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#8b5cf6", display: "flex", alignItems: "center", gap: "5px" }}>
                      <Sparkles size={14} /> 4x Super 4K
                    </span>
                    <span style={{ fontSize: "0.65rem", background: "#ede9fe", color: "#6d28d9", padding: "1px 6px", borderRadius: "10px", fontWeight: 800 }}>
                      PRINT READY
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--text-secondary, #64748b)", lineHeight: 1.3 }}>
                    Quadruple resolution with deep neural edge reconstruction for luxury lookbooks &amp; large prints.
                  </p>
                </div>

                {/* 1X NATURAL ENHANCE */}
                <div
                  onClick={() => setScaleFactor(1)}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: scaleFactor === 1 ? "2px solid var(--primary, #6366f1)" : "1px solid var(--border-medium, #cbd5e1)",
                    background: scaleFactor === 1 ? "rgba(99, 102, 241, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary, #0f172a)", marginBottom: "3px" }}>
                    🌿 1x Natural Enhance
                  </div>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary, #64748b)", lineHeight: 1.3 }}>
                    Balances contrast, colors and clean lighting without changing image dimensions.
                  </p>
                </div>

                {/* RAW ORIGINAL */}
                <div
                  onClick={() => setScaleFactor(0)}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: scaleFactor === 0 ? "2px solid #64748b" : "1px solid var(--border-medium, #cbd5e1)",
                    background: scaleFactor === 0 ? "rgba(100, 116, 139, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary, #0f172a)", marginBottom: "3px" }}>
                    📁 Keep Raw Original
                  </div>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary, #64748b)", lineHeight: 1.3 }}>
                    Use the raw uploaded file directly with zero changes.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. NATURAL POLISH & TEXTURE TOGGLES */}
            <div>
              <label
                style={{
                  fontSize: "0.86rem",
                  fontWeight: 750,
                  color: "var(--text-primary, #0f172a)",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                2. Organic Finishing Options:
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-surface-elevated, #f8fafc)",
                    border: "1px solid var(--border-subtle, #e2e8f0)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "var(--text-primary, #0f172a)",
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={naturalEnhance}
                    onChange={(e) => setNaturalEnhance(e.target.checked)}
                    style={{ accentColor: "var(--primary)", width: "16px", height: "16px" }}
                  />
                  <span>
                    <strong>Natural Sunlit Vibrance</strong> — Restores fresh natural colors to fabric, garlic bulbs, and stone veining.
                  </span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-surface-elevated, #f8fafc)",
                    border: "1px solid var(--border-subtle, #e2e8f0)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "var(--text-primary, #0f172a)",
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={edgeSharpness}
                    onChange={(e) => setEdgeSharpness(e.target.checked)}
                    style={{ accentColor: "var(--primary)", width: "16px", height: "16px" }}
                  />
                  <span>
                    <strong>Micro-Detail Edge Sharpener</strong> — Sharpens handloom zari khats, clove skins, and quarry cuts.
                  </span>
                </label>
              </div>
            </div>

            {previewError && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                ⚠️ {previewError}
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER WITH TWO DIRECT ACTION PATHWAYS */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--border-subtle, #f1f5f9)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-surface-elevated, #f8fafc)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* OPTION TO EDIT IN AI STUDIO */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleOpenInAiStudio}
            disabled={isProcessing}
            style={{
              fontWeight: 750,
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#8b5cf6",
              borderColor: "#8b5cf6",
              background: "rgba(139, 92, 246, 0.05)",
            }}
            title="Open full AI Studio to isolate cutout, add luxury shadows, stages & lighting"
          >
            <Palette size={16} /> Edit &amp; Compose in AI Studio ➔
          </button>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isProcessing}
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Cancel
            </button>

            {/* DIRECT APPLY TO CATALOGUE */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyToCatalogue}
              disabled={isProcessing}
              style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                padding: "8px 22px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderColor: "#10b981",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Upscaling {scaleFactor}x HD...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.8} />
                  <span>
                    {scaleFactor > 0
                      ? `✓ Apply ${scaleFactor}x HD Image to Catalogue`
                      : "✓ Apply Original to Catalogue"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

