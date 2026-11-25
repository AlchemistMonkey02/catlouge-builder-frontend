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
  const [engine, setEngine] = useState("auto"); // "auto" optimal hybrid pipeline
  const [clarityProfile, setClarityProfile] = useState("clean_hd"); // "clean_hd" | "crisp" | "soft"
  const [cleanNoise, setCleanNoise] = useState(true); // edge-preserving denoising
  const [naturalEnhance, setNaturalEnhance] = useState(true);
  const [edgeSharpness, setEdgeSharpness] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [upscaledResult, setUpscaledResult] = useState(null);
  const [viewMode, setViewMode] = useState("upscaled"); // "upscaled" | "original"
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

  // Automatically execute upscaling to generate live HD preview
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    if (scaleFactor === 0) {
      setUpscaledResult(null);
      setViewMode("original");
      return;
    }

    let isSubscribed = true;
    const runLiveUpscale = async () => {
      try {
        setIsGeneratingPreview(true);
        setPreviewError("");

        const sharpnessVal = edgeSharpness ? (clarityProfile === "crisp" ? 1.45 : 1.25) : 1.0;
        const contrastVal = naturalEnhance ? 1.10 : 1.0;
        const satVal = naturalEnhance ? 1.06 : 1.0;

        const res = await upscaleAndEnhanceImage({
          image: imageSrc,
          scaleFactor: scaleFactor,
          sharpness: sharpnessVal,
          contrast: contrastVal,
          saturation: satVal,
          clarityMode: clarityProfile,
          denoise: cleanNoise,
          engine: "auto",
        });

        if (isSubscribed && res && (res.image || res.upscaled)) {
          setUpscaledResult(res);
          setViewMode("upscaled");
        }
      } catch (err) {
        if (isSubscribed) {
          console.warn("Live upscale preview fallback to client-side:", err);
          try {
            const fallback = await clientSideUpscale(
              imageSrc,
              scaleFactor,
              1.25,
              1.10,
              1.06,
              clarityProfile,
              cleanNoise
            );
            if (isSubscribed) {
              setUpscaledResult(fallback);
              setViewMode("upscaled");
            }
          } catch (_) {}
        }
      } finally {
        if (isSubscribed) setIsGeneratingPreview(false);
      }
    };

    runLiveUpscale();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, imageSrc, scaleFactor, naturalEnhance, edgeSharpness, clarityProfile, cleanNoise]);

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

      // If we already have the upscaled result from live preview, apply it directly
      if (upscaledResult && (upscaledResult.image || upscaledResult.upscaled)) {
        const finalImg = upscaledResult.image || upscaledResult.upscaled;
        onApply(finalImg, upscaledResult.stats || {
          scale: `${scaleFactor}x`,
          from: `${dimensions.width}x${dimensions.height}`,
          to: `${targetWidth}x${targetHeight}`,
        });
        onClose();
        return;
      }

      const sharpnessVal = edgeSharpness ? (clarityProfile === "crisp" ? 1.45 : 1.25) : 1.0;
      const contrastVal = naturalEnhance ? 1.10 : 1.0;
      const satVal = naturalEnhance ? 1.06 : 1.0;

      // Run super-resolution engine
      const res = await upscaleAndEnhanceImage({
        image: imageSrc,
        scaleFactor: scaleFactor,
        sharpness: sharpnessVal,
        contrast: contrastVal,
        saturation: satVal,
        clarityMode: clarityProfile,
        denoise: cleanNoise,
        engine: "auto",
      });

      const finalImage = res.image || res.upscaled || imageSrc;
      onApply(finalImage, res.stats || {
        scale: `${scaleFactor}x`,
        clarity: "Clean HD",
        from: `${dimensions.width}x${dimensions.height}`,
        to: `${targetWidth}x${targetHeight}`,
      });
      onClose();
    } catch (err) {
      console.warn("Upscale error, falling back to client-side Lanczos:", err);
      try {
        const fallback = await clientSideUpscale(
          imageSrc,
          scaleFactor,
          1.25,
          1.10,
          1.06,
          clarityProfile,
          cleanNoise
        );
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
            {/* Compare Toggle Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Live Quality Comparison:
              </span>
              <div
                style={{
                  display: "inline-flex",
                  background: "var(--bg-surface-elevated, #f1f5f9)",
                  border: "1px solid var(--border-medium, #cbd5e1)",
                  borderRadius: "6px",
                  padding: "2px",
                  gap: "2px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("original")}
                  style={{
                    background: viewMode === "original" ? "var(--bg-surface, #ffffff)" : "transparent",
                    color: viewMode === "original" ? "var(--text-primary)" : "var(--text-muted)",
                    border: viewMode === "original" ? "1px solid var(--border-subtle, #cbd5e1)" : "none",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: viewMode === "original" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  Original
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("upscaled")}
                  disabled={!upscaledResult}
                  style={{
                    background: viewMode === "upscaled" ? "#10b981" : "transparent",
                    color: viewMode === "upscaled" ? "#ffffff" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "0.68rem",
                    fontWeight: 750,
                    cursor: upscaledResult ? "pointer" : "default",
                    boxShadow: viewMode === "upscaled" ? "0 1px 4px rgba(16, 185, 129, 0.3)" : "none",
                  }}
                >
                  💎 {scaleFactor}x Clean HD
                </button>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "280px",
                borderRadius: "12px",
                background: "#0b0f19",
                border: viewMode === "upscaled" && upscaledResult ? "1.5px solid #10b981" : "1px solid var(--border-medium, #e2e8f0)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08)",
                transition: "border-color 0.2s ease",
              }}
            >
              <img
                src={viewMode === "upscaled" && upscaledResult?.image ? upscaledResult.image : imageSrc}
                alt="Product preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  imageRendering: viewMode === "upscaled" ? "high-quality" : "auto",
                }}
              />

              {/* Live Processing Overlay */}
              {isGeneratingPreview && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(11, 15, 25, 0.65)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "#ffffff",
                    zIndex: 2,
                  }}
                >
                  <RefreshCw size={22} className="spin" color="#10b981" />
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#e2e8f0" }}>
                    Actively applying super-resolution ({scaleFactor}x)...
                  </span>
                </div>
              )}

              {/* View Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: viewMode === "upscaled" ? "rgba(16, 185, 129, 0.9)" : "rgba(15, 23, 42, 0.8)",
                  backdropFilter: "blur(4px)",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 750,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {viewMode === "upscaled" ? (
                  <>
                    <Zap size={10} /> Actively Upscaled ({scaleFactor}x Clean HD)
                  </>
                ) : (
                  <>📷 Original Source</>
                )}
              </div>

              {/* Bottom Dimensions Banner */}
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
                  ➔ {upscaledResult?.width || targetWidth}×{upscaledResult?.height || targetHeight} px
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
                    Ultra high-definition clarity and fine detail reconstruction for luxury lookbooks &amp; large displays.
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
                    🌿 1x Natural Polish
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

            {/* 2. FIX CLARITY & HD CLEAN PROFILES */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "0.86rem",
                    fontWeight: 750,
                    color: "var(--text-primary, #0f172a)",
                    margin: 0,
                  }}
                >
                  2. Fix Clarity &amp; HD Clean Finishing:
                </label>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    fontWeight: 750,
                  }}
                >
                  Active: {clarityProfile === "clean_hd" ? "💎 Clean HD" : clarityProfile === "crisp" ? "⚡ Crisp Detail" : "🌿 Soft Natural"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "10px" }}>
                {/* Profile 1: Clean HD (Recommended) */}
                <div
                  onClick={() => setClarityProfile("clean_hd")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: clarityProfile === "clean_hd" ? "2px solid #10b981" : "1px solid var(--border-medium, #cbd5e1)",
                    background: clarityProfile === "clean_hd" ? "rgba(16, 185, 129, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#059669", display: "flex", alignItems: "center", gap: "4px" }}>
                    💎 Clean HD
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.25 }}>
                    Denoises surfaces &amp; removes grain; clean crisp edges.
                  </div>
                </div>

                {/* Profile 2: Crisp Detail */}
                <div
                  onClick={() => setClarityProfile("crisp")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: clarityProfile === "crisp" ? "2px solid #8b5cf6" : "1px solid var(--border-medium, #cbd5e1)",
                    background: clarityProfile === "crisp" ? "rgba(139, 92, 246, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: "4px" }}>
                    ⚡ Crisp Detail
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.25 }}>
                    High micro-contrast for threads, stone cuts &amp; fine lines.
                  </div>
                </div>

                {/* Profile 3: Soft Natural */}
                <div
                  onClick={() => setClarityProfile("soft")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: clarityProfile === "soft" ? "2px solid #3b82f6" : "1px solid var(--border-medium, #cbd5e1)",
                    background: clarityProfile === "soft" ? "rgba(59, 130, 246, 0.08)" : "var(--bg-surface, #ffffff)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                    🌿 Soft Natural
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.25 }}>
                    Gentle organic look with zero artificial sharpening.
                  </div>
                </div>
              </div>

              {/* Finishing Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: cleanNoise ? "rgba(16, 185, 129, 0.06)" : "var(--bg-surface-elevated, #f8fafc)",
                    border: cleanNoise ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border-subtle, #e2e8f0)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "var(--text-primary, #0f172a)",
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={cleanNoise}
                    onChange={(e) => setCleanNoise(e.target.checked)}
                    style={{ accentColor: "#10b981", width: "16px", height: "16px" }}
                  />
                  <span>
                    <strong>🧹 Clean Noise &amp; Compression Artifacts</strong> — Eliminates camera sensor grain &amp; gritty JPEG compression lines.
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
                    checked={naturalEnhance}
                    onChange={(e) => setNaturalEnhance(e.target.checked)}
                    style={{ accentColor: "var(--primary)", width: "16px", height: "16px" }}
                  />
                  <span>
                    <strong>☀️ Natural Sunlit Vibrance</strong> — Restores fresh natural colors to garlic bulbs, stone veining, and handlooms.
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
                    <strong>🔍 Clean Edge Contour Sharpener</strong> — Sharpens outer boundaries and textures without adding digital noise.
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
                  <span>Applying {scaleFactor}x Clean HD...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.8} />
                  <span>
                    {scaleFactor > 0
                      ? `✓ Apply ${scaleFactor}x Clean HD to Catalogue`
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

