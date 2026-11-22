import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  Zap,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Check,
  Layers,
  Move,
  Tag,
  Eye,
  Palette,
  Info,
} from "lucide-react";

/**
 * ProductImagePreviewModal
 * Full-resolution lightbox modal allowing catalogue managers to inspect
 * uploaded and AI-upscaled product imagery with pan & zoom controls,
 * resolution metrics, upscale badges, and 1-click enhancement shortcuts.
 */
export default function ProductImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  productName = "Product Image Preview",
  productMeta = {},
  upscaleStats = null,
  onOpenUpscale = null,
  onOpenAiStudio = null,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(imageUrl || "");
  const [hasFallbackApplied, setHasFallbackApplied] = useState(false);
  const containerRef = useRef(null);

  // Determine fallback image based on product metadata/category
  const getFallbackImage = () => {
    const cat = (productMeta?.category || "").toLowerCase();
    if (cat.includes("garlic")) return "/assets/garlic/garlic-01.jpeg";
    if (cat.includes("kota stone") || cat.includes("limestone")) return "/assets/kota-stone/blue-kota-stone-1.jpg";
    if (cat.includes("sand")) return "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg";
    if (cat.includes("doria") || cat.includes("saree")) return "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg";
    return "/assets/garlic/garlic-01.jpeg";
  };

  // Reset zoom & pan when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsLoaded(false);
      setDownloadSuccess(false);
      setHasFallbackApplied(false);
      let normalized = (imageUrl || "").trim();
      if (normalized.startsWith("assets/") || normalized.startsWith("uploads/")) {
        normalized = `/${normalized}`;
      }
      setCurrentUrl(normalized || getFallbackImage());
    }
  }, [isOpen, imageUrl]);

  // Load natural dimensions
  useEffect(() => {
    const urlToLoad = currentUrl || imageUrl;
    if (!urlToLoad) return;
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth || img.width || 800,
        height: img.naturalHeight || img.height || 800,
      });
      setIsLoaded(true);
    };
    img.onerror = () => {
      if (!hasFallbackApplied) {
        setHasFallbackApplied(true);
        const fb = getFallbackImage();
        setCurrentUrl(fb);
        setDimensions({ width: 800, height: 800 });
        setIsLoaded(true);
      }
    };
    img.src = urlToLoad;
  }, [currentUrl, imageUrl, hasFallbackApplied]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const displayImage = currentUrl || imageUrl || getFallbackImage();

  // Zoom manipulation
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handleSetZoomLevel = (lvl) => {
    setZoom(lvl);
    if (lvl === 1) setPan({ x: 0, y: 0 });
  };

  // Drag / Pan logic
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Direct Download
  const handleDownload = async () => {
    try {
      const sanitizedName = (productName || "product-image")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      const filename = `${sanitizedName}-${upscaleStats?.scale || "hd"}-${dimensions.width}x${dimensions.height}.png`;

      const targetImgUrl = displayImage || currentUrl || imageUrl || getFallbackImage();
      // If data URL, download directly
      if (targetImgUrl?.startsWith?.("data:")) {
        const link = document.createElement("a");
        link.href = targetImgUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fetch as blob for remote URLs to trigger true download
        const res = await fetch(targetImgUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback
      window.open(imageUrl, "_blank");
    }
  };

  const megapixels =
    dimensions.width && dimensions.height
      ? ((dimensions.width * dimensions.height) / 1000000).toFixed(2)
      : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 15, 29, 0.88)",
        backdropFilter: "blur(10px)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL WRAPPER */}
      <div
        style={{
          width: "95vw",
          maxWidth: "1160px",
          height: "90vh",
          maxHeight: "860px",
          background: "var(--bg-surface, #ffffff)",
          borderRadius: "16px",
          border: "1px solid var(--border-medium, rgba(255, 255, 255, 0.15))",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-surface-elevated, #f8fafc)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Title & Metadata */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
                flexShrink: 0,
              }}
            >
              <Eye size={18} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 750,
                    color: "var(--text-primary, #0f172a)",
                  }}
                >
                  {productName}
                </h3>

                {productMeta.sku && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#4f46e5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    SKU: {productMeta.sku}
                  </span>
                )}

                {upscaleStats ? (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 750,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      boxShadow: "0 2px 6px rgba(16, 185, 129, 0.25)",
                    }}
                  >
                    <Zap size={11} /> {upscaleStats.scale || "2x"} Super-Resolution Applied
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#2563eb",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={11} /> High Clarity Preview
                  </span>
                )}
              </div>

              {/* Subtitle / Dimensions */}
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "var(--text-muted, #64748b)",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {dimensions.width > 0 && (
                  <span>
                    Resolution: <strong>{dimensions.width} × {dimensions.height} px</strong>
                    {megapixels && ` (${megapixels} MP)`}
                  </span>
                )}
                {productMeta.category && <span>• Category: <strong>{productMeta.category}</strong></span>}
                {productMeta.price && (
                  <span>• Price: <strong>₹{productMeta.price.toLocaleString?.() || productMeta.price}{productMeta.unit ? ` / ${productMeta.unit}` : ""}</strong></span>
                )}
                {productMeta.mrp && <span style={{ textDecoration: "line-through", color: "var(--text-muted)" }}>₹{productMeta.mrp}</span>}
                {productMeta.size && <span>• 📏 <strong>{productMeta.size}</strong></span>}
                {productMeta.material && <span>• 🌿 <strong>{productMeta.material}</strong></span>}
                {productMeta.finish && <span>• ✨ <strong>{productMeta.finish}</strong></span>}
                {productMeta.application && <span>• 🎯 <strong>{productMeta.application}</strong></span>}
                {productMeta.priceRange && <span>• 💰 <strong>{productMeta.priceRange}</strong></span>}
                {upscaleStats?.engine && (
                  <span>• Engine: <strong style={{ color: "#059669" }}>{upscaleStats.engine}</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Zoom Bar & Close Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border-medium, #cbd5e1)",
                borderRadius: "8px",
                padding: "2px 4px",
                gap: "2px",
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom Out (-25%)"
                style={{ padding: "4px 6px", minWidth: "28px" }}
              >
                <ZoomOut size={14} />
              </button>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-secondary, #475569)",
                  minWidth: "48px",
                  textAlign: "center",
                }}
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleZoomIn}
                disabled={zoom >= 4}
                title="Zoom In (+25%)"
                style={{ padding: "4px 6px", minWidth: "28px" }}
              >
                <ZoomIn size={14} />
              </button>
              <div style={{ width: "1px", height: "16px", background: "var(--border-medium, #e2e8f0)", margin: "0 2px" }} />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleZoomReset}
                title="Reset Zoom to 100%"
                style={{ padding: "4px 6px", fontSize: "0.72rem", fontWeight: 650 }}
              >
                <RotateCcw size={12} style={{ marginRight: "3px" }} /> Reset
              </button>
            </div>

            {/* Quick Zoom Presets */}
            <div style={{ display: "none", mdDisplay: "flex", gap: "3px" }} className="zoom-presets">
              {[1, 1.5, 2].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSetZoomLevel(lvl)}
                  style={{
                    background: zoom === lvl ? "var(--primary, #3b82f6)" : "transparent",
                    color: zoom === lvl ? "#ffffff" : "var(--text-secondary, #64748b)",
                    border: "1px solid var(--border-subtle, #e2e8f0)",
                    borderRadius: "6px",
                    padding: "3px 7px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {lvl * 100}%
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                color: "var(--text-secondary, #64748b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Close Preview (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* IMAGE VIEWPORT / CANVAS */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            flex: 1,
            position: "relative",
            background: "#090d16",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.04) 1px, #090d16 1px)",
            backgroundSize: "24px 24px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            userSelect: "none",
          }}
        >
          {/* Main Product Image */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
              maxWidth: "100%",
              maxHeight: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={currentUrl || imageUrl}
              alt={productName}
              draggable={false}
              onError={() => {
                if (!hasFallbackApplied) {
                  setHasFallbackApplied(true);
                  setCurrentUrl(getFallbackImage());
                }
              }}
              style={{
                maxWidth: "85vw",
                maxHeight: "68vh",
                objectFit: "contain",
                display: "block",
                borderRadius: "8px",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
                imageRendering: "high-quality",
              }}
            />
          </div>

          {/* Zoom Instruction Floating Pill */}
          {zoom > 1 && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(6px)",
                padding: "4px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#cbd5e1",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                pointerEvents: "none",
                fontWeight: 600,
              }}
            >
              <Move size={12} /> Drag image to inspect high-definition details
            </div>
          )}

          {/* Upscale Progression Notification Box */}
          {upscaleStats && (
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(8px)",
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#ffffff",
                fontSize: "0.76rem",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#10b981", fontWeight: 800, fontSize: "0.85rem" }}>✓</span>
              <div>
                <span style={{ fontWeight: 700, color: "#6ee7b7" }}>
                  {upscaleStats.scale || "2x"} Super-Resolution Applied:
                </span>{" "}
                <span style={{ color: "#cbd5e1" }}>
                  {upscaleStats.from} ➔{" "}
                  <strong style={{ color: "#ffffff" }}>{upscaleStats.to || `${dimensions.width}×${dimensions.height}`}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div
          style={{
            padding: "0.85rem 1.5rem",
            borderTop: "1px solid var(--border-subtle, #e2e8f0)",
            background: "var(--bg-surface-elevated, #f8fafc)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Left stats info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.78rem", color: "var(--text-secondary, #475569)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <ImageIcon size={14} color="#6366f1" />
              <span>Format: <strong>High-Definition {displayImage?.startsWith?.("data:image/png") ? "PNG" : "JPEG/WebP"}</strong></span>
            </span>
            {dimensions.width > 0 && (
              <span>• Aspect Ratio: <strong>{(dimensions.width / dimensions.height).toFixed(2)}:1</strong></span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {onOpenUpscale && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenUpscale(displayImage);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#059669",
                  borderColor: "#10b981",
                  background: "rgba(16, 185, 129, 0.08)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "5px 12px",
                }}
                title="Upscale further to 2x or 4x Ultra 4K"
              >
                <Zap size={14} /> Re-Upscale (2x/4x)
              </button>
            )}

            {onOpenAiStudio && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenAiStudio(displayImage);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#8b5cf6",
                  borderColor: "#8b5cf6",
                  background: "rgba(139, 92, 246, 0.08)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "5px 12px",
                }}
                title="Open in AI Studio to replace background or add shadows"
              >
                <Palette size={14} /> Edit in AI Studio ➔
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDownload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "5px 14px",
              }}
              title="Download full resolution image to your computer"
            >
              {downloadSuccess ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: "#10b981" }}>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download HD</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
              style={{ fontWeight: 700, fontSize: "0.8rem", padding: "5px 16px" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
