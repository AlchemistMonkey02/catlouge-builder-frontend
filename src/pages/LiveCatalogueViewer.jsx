import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Check,
  MessageCircle,
  Building2,
  Layers,
  ArrowLeft,
  QrCode,
  BookOpen,
  FileText,
  Sun,
  Moon,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import confetti from "canvas-confetti";
import { fetchCatalogueRecordById } from "../services/api";
import { exportDynamicPdf, qrDataUrl, initTemplateRegistry } from "../components/dynamic-catalogue/engine";
import Loading from "../components/Loading";

export default function LiveCatalogueViewer() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reader state
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [viewMode, setViewMode] = useState("single"); // "single" | "spread" | "scroll"
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [stageTheme, setStageTheme] = useState("dark"); // "dark" | "warm" | "light"
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Actions state
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const stageRef = useRef(null);
  const touchStartRef = useRef(null);

  // Fetch record
  useEffect(() => {
    initTemplateRegistry();
    async function loadCatalogue() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetchCatalogueRecordById(id);
        if (res && res.data) {
          setRecord(res.data);
          const currentUrl = window.location.href;
          qrDataUrl(currentUrl).then(url => setQrCodeUrl(url));
        } else {
          setError("Catalogue not found or link has expired.");
        }
      } catch (err) {
        console.error("Failed to load live catalogue:", err);
        setError("Unable to load catalogue. Please check the URL.");
      } finally {
        setLoading(false);
      }
    }
    loadCatalogue();
  }, [id]);

  const pages = record?.pagesHtml || [];
  const totalPages = pages.length;

  // Set default view mode based on screen width
  useEffect(() => {
    if (window.innerWidth >= 1280 && totalPages > 2) {
      setViewMode("spread");
    } else {
      setViewMode("single");
    }
  }, [totalPages]);

  // Dynamic Auto-Fit calculation
  const updateAutoFit = useCallback(() => {
    if (!stageRef.current) return;
    const stageWidth = stageRef.current.clientWidth;
    const stageHeight = stageRef.current.clientHeight;

    if (!stageWidth || !stageHeight) return;

    const isMobile = stageWidth < 640;
    const padX = isMobile ? 24 : 110; // Reserve room for edge navigation chevrons
    const padY = isMobile ? 20 : 44; // Reserve room for header and footer spacing

    const availW = Math.max(280, stageWidth - padX);
    const availH = Math.max(300, stageHeight - padY);

    let requiredW = 794;
    const requiredH = 1123;

    // In spread mode, two pages side-by-side (unless on cover or lone back cover)
    const isDualPageSpread =
      viewMode === "spread" &&
      currentPage > 0 &&
      currentPage < totalPages;

    if (isDualPageSpread) {
      requiredW = 794 * 2;
    }

    const scaleW = availW / requiredW;
    const scaleH = availH / requiredH;
    const computedFit = Math.min(scaleW, scaleH);

    setFitZoom(computedFit);
    if (isAutoFit) {
      setZoomLevel(computedFit);
    }
  }, [viewMode, currentPage, totalPages, isAutoFit]);

  // Window resize observer
  useEffect(() => {
    updateAutoFit();
    const handleResize = () => updateAutoFit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateAutoFit]);

  // Re-calculate fit when view mode or page changes
  useEffect(() => {
    if (isAutoFit) {
      updateAutoFit();
    }
  }, [viewMode, currentPage, isAutoFit, updateAutoFit]);

  // Page Navigation Handlers
  const canGoPrev = currentPage > 0;
  const canGoNext =
    viewMode === "spread" && currentPage > 0
      ? currentPage + 2 < totalPages || currentPage + 1 < totalPages
      : currentPage < totalPages - 1;

  const handlePrevPage = () => {
    if (viewMode === "spread") {
      if (currentPage <= 1) {
        setCurrentPage(0);
      } else {
        setCurrentPage(p => Math.max(1, p - 2));
      }
    } else {
      setCurrentPage(p => Math.max(0, p - 1));
    }
  };

  const handleNextPage = () => {
    if (viewMode === "spread") {
      if (currentPage === 0) {
        setCurrentPage(1);
      } else {
        setCurrentPage(p => Math.min(totalPages - 1, p + 2));
      }
    } else {
      setCurrentPage(p => Math.min(totalPages - 1, p + 1));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when inside inputs/modals
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentPage(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentPage(totalPages - 1);
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, viewMode]);

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !e.changedTouches || !e.changedTouches[0]) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Horizontal swipe threshold 45px, must exceed vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) {
        handlePrevPage();
      } else {
        handleNextPage();
      }
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoomLevel(z => Math.min(2.0, Number((z + 0.12).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoomLevel(z => Math.max(0.35, Number((z - 0.12).toFixed(2))));
  };

  const handleResetZoom = () => {
    setIsAutoFit(true);
    if (fitZoom) setZoomLevel(fitZoom);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Share Link handler
  const handleShareLink = async () => {
    const shareUrl = window.location.href;
    const title = record?.ent_name ? `${record.ent_name} - Official Digital Catalogue` : "Product Catalogue";
    const text = `Explore the official digital product catalogue of ${record?.ent_name || "our company"}.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
    } catch (_) {
      alert("Catalogue link: " + shareUrl);
    }
  };

  // Download PDF handler
  const handleDownloadPdf = async () => {
    if (!pages || !pages.length) return;
    try {
      setIsExportingPdf(true);
      await exportDynamicPdf({
        pages,
        info: {
          ent: record.ent_name,
          district: record.district,
          product: record.product,
          mobile: record.mobile,
          website: record.form_json?.website || window.location.href
        },
        sel: { uid: record.template_uid || "editorial:ed-kd1", size: [794, 1123] },
        items: record.variants_json || []
      });
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      console.error("PDF export error:", err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Clean WhatsApp link with contextual page message
  const rawMobile = String(record?.mobile || "").replace(/\D/g, "");
  const waNumber = rawMobile.length === 10 ? `91${rawMobile}` : rawMobile;
  const currentViewLabel =
    viewMode === "spread" && currentPage > 0 && currentPage < totalPages - 1
      ? `Pages ${currentPage + 1}-${currentPage + 2}`
      : `Page ${currentPage + 1}`;
  const waMessage = encodeURIComponent(
    `Hello! I am viewing ${currentViewLabel} of your official digital catalogue for "${record?.ent_name || "your company"}" at ${window.location.href}. I would like to inquire about specifications and pricing.`
  );
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : "";

  // Theme palettes for viewer stage
  const themeStyles = {
    dark: {
      bg: "radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 65%, #020617 100%)",
      headerBg: "rgba(15, 23, 42, 0.92)",
      headerBorder: "rgba(255, 255, 255, 0.08)",
      textPrimary: "#f8fafc",
      textMuted: "#94a3b8",
      glow: "rgba(59, 130, 246, 0.12)"
    },
    warm: {
      bg: "radial-gradient(circle at 50% 35%, #292524 0%, #1c1917 65%, #0c0a09 100%)",
      headerBg: "rgba(28, 25, 23, 0.94)",
      headerBorder: "rgba(245, 158, 11, 0.15)",
      textPrimary: "#fef3c7",
      textMuted: "#a8a29e",
      glow: "rgba(245, 158, 11, 0.12)"
    },
    light: {
      bg: "radial-gradient(circle at 50% 35%, #f1f5f9 0%, #e2e8f0 70%, #cbd5e1 100%)",
      headerBg: "rgba(255, 255, 255, 0.94)",
      headerBorder: "rgba(0, 0, 0, 0.08)",
      textPrimary: "#0f172a",
      textMuted: "#64748b",
      glow: "rgba(148, 163, 184, 0.2)"
    }
  };
  const activeTheme = themeStyles[stageTheme] || themeStyles.dark;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f19" }}>
        <Loading message="Loading digital catalogue edition..." />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#0b0f19" }}>
        <div className="card" style={{ maxWidth: "480px", textAlign: "center", padding: "2.5rem", background: "rgba(30, 41, 59, 0.8)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}></div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem", color: "#f8fafc" }}>Digital Publication Unavailable</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>{error || "This catalogue link is not available or has been unpublished."}</p>
          <Link to="/" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <ArrowLeft size={16} /> Return to Studio
          </Link>
        </div>
      </div>
    );
  }

  // Label for current page indicator in header
  const getPageIndicatorLabel = () => {
    if (viewMode === "spread" && currentPage > 0 && currentPage < totalPages) {
      const rightPageNum = currentPage + 1;
      if (rightPageNum < totalPages) {
        return `Pages ${currentPage + 1}-${rightPageNum + 1} of ${totalPages}`;
      }
      return `Page ${currentPage + 1} of ${totalPages}`;
    }
    return `Page ${currentPage + 1} of ${totalPages}`;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: activeTheme.bg,
        color: activeTheme.textPrimary,
        position: "relative",
        userSelect: "none"
      }}
    >
      {/* 1. TOP FLOATING CONTROL BAR */}
      <header
        className="no-print"
        style={{
          height: "58px",
          background: activeTheme.headerBg,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${activeTheme.headerBorder}`,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 100,
          flexShrink: 0,
          gap: "12px"
        }}
      >
        {/* Left: Brand Identity & Exit Shortcut */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: "0 1 auto" }}>
          {/* Back to Studio Link */}
          <Link
            to="/companies"
            title="Return to Studio Dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: activeTheme.textMuted,
              textDecoration: "none",
              fontSize: "0.74rem",
              fontWeight: 700,
              transition: "all 0.15s ease"
            }}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Studio</span>
          </Link>

          {/* Company Brand Badge */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
            }}
          >
            <Building2 size={17} />
          </div>

          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.92rem",
                color: activeTheme.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "-0.01em"
              }}
            >
              {record.ent_name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", color: activeTheme.textMuted }}>
              <span style={{ color: "#38bdf8", fontWeight: 700 }}>ODOP {record.product}</span>
              <span>&bull;</span>
              <span>{record.district}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  padding: "1px 6px",
                  borderRadius: "99px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontWeight: 700,
                  fontSize: "0.64rem"
                }}
              >
                ● Digital Edition
              </span>
            </div>
          </div>
        </div>

        {/* Center: Ergonomic Page Stepper */}
        {viewMode !== "scroll" && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "4px 8px",
              borderRadius: "10px",
              border: `1px solid ${activeTheme.headerBorder}`,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}
          >
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={handlePrevPage}
              style={{
                background: "transparent",
                border: "none",
                color: canGoPrev ? activeTheme.textPrimary : "rgba(148, 163, 184, 0.3)",
                cursor: canGoPrev ? "pointer" : "default",
                padding: "4px 6px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center"
              }}
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft size={16} />
            </button>

            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: activeTheme.textPrimary,
                minWidth: "110px",
                textAlign: "center",
                padding: "0 4px"
              }}
            >
              {getPageIndicatorLabel()}
            </span>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={handleNextPage}
              style={{
                background: "transparent",
                border: "none",
                color: canGoNext ? activeTheme.textPrimary : "rgba(148, 163, 184, 0.3)",
                cursor: canGoNext ? "pointer" : "default",
                padding: "4px 6px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center"
              }}
              title="Next Page (Right Arrow / Space)"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Right: Controls & Conversion Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {/* View Mode Switcher */}
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "8px",
              border: `1px solid ${activeTheme.headerBorder}`,
              padding: "2px"
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("single")}
              style={{
                padding: "4px 8px",
                fontSize: "0.72rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                background: viewMode === "single" ? "#2563eb" : "transparent",
                color: viewMode === "single" ? "#ffffff" : activeTheme.textMuted,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
              title="Single Page Slide View"
            >
              <FileText size={12} />
              <span className="hidden md:inline">Single</span>
            </button>

            {totalPages > 2 && (
              <button
                type="button"
                onClick={() => setViewMode("spread")}
                style={{
                  padding: "4px 8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: viewMode === "spread" ? "#2563eb" : "transparent",
                  color: viewMode === "spread" ? "#ffffff" : activeTheme.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
                title="2-Page Book Spread (Magazine Style)"
              >
                <BookOpen size={12} />
                <span className="hidden md:inline">Spread</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode("scroll")}
              style={{
                padding: "4px 8px",
                fontSize: "0.72rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                background: viewMode === "scroll" ? "#2563eb" : "transparent",
                color: viewMode === "scroll" ? "#ffffff" : activeTheme.textMuted,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
              title="Continuous Vertical Scroll Mode"
            >
              <Layers size={12} />
              <span className="hidden md:inline">Scroll</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "8px",
              border: `1px solid ${activeTheme.headerBorder}`,
              padding: "2px 4px"
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              style={{ background: "transparent", border: "none", color: activeTheme.textMuted, cursor: "pointer", padding: "4px" }}
              title="Zoom Out (-)"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              style={{
                background: isAutoFit ? "rgba(59, 130, 246, 0.2)" : "transparent",
                border: "none",
                color: isAutoFit ? "#38bdf8" : activeTheme.textPrimary,
                cursor: "pointer",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "3px 6px",
                borderRadius: "4px"
              }}
              title="Fit to Window (0)"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              style={{ background: "transparent", border: "none", color: activeTheme.textMuted, cursor: "pointer", padding: "4px" }}
              title="Zoom In (+)"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Thumbnails Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowThumbnails(v => !v)}
            style={{
              background: showThumbnails ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${showThumbnails ? "#3b82f6" : activeTheme.headerBorder}`,
              color: showThumbnails ? "#38bdf8" : activeTheme.textMuted,
              padding: "6px 9px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.75rem",
              fontWeight: 700
            }}
            title="Toggle Page Thumbnails Strip"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Pages</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${activeTheme.headerBorder}`,
              color: activeTheme.textMuted,
              padding: "6px 8px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Presentation (F)"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Theme Ambiance Switcher */}
          <button
            type="button"
            onClick={() => setStageTheme(t => (t === "dark" ? "warm" : t === "warm" ? "light" : "dark"))}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${activeTheme.headerBorder}`,
              color: activeTheme.textMuted,
              padding: "6px 8px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
            title={`Stage Theme: ${stageTheme.toUpperCase()} (Click to toggle)`}
          >
            {stageTheme === "dark" ? <Moon size={14} /> : stageTheme === "warm" ? <Sparkles size={14} /> : <Sun size={14} />}
          </button>

          {/* QR Code Trigger */}
          {qrCodeUrl && (
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              style={{
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                color: "#38bdf8",
                padding: "6px 10px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.75rem",
                fontWeight: 700
              }}
              title="Show QR Code for Mobile Scanning"
            >
              <QrCode size={14} />
              <span className="hidden sm:inline">QR</span>
            </button>
          )}

          {/* Share Link */}
          <button
            type="button"
            onClick={handleShareLink}
            style={{
              background: copiedLink ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${copiedLink ? "#10b981" : activeTheme.headerBorder}`,
              color: copiedLink ? "#10b981" : activeTheme.textPrimary,
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.75rem",
              fontWeight: 700
            }}
            title="Copy or share catalogue link"
          >
            {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copiedLink ? "Copied!" : "Share"}</span>
          </button>

          {/* High-Res PDF Download */}
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "none",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: isExportingPdf ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
            }}
            title="Download publication-grade PDF catalogue"
          >
            <Download size={14} />
            <span className="hidden md:inline">{isExportingPdf ? "Compiling..." : "PDF"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN READING STAGE */}
      <main
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          position: "relative",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: viewMode === "scroll" ? "flex-start" : "center",
          padding: viewMode === "scroll" ? "32px 16px 80px 16px" : "20px 16px",
          perspective: "1200px"
        }}
      >
        {/* Soft Ambient Radial Glow Behind the Catalogue */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: activeTheme.glow,
            filter: "blur(140px)",
            pointerEvents: "none",
            zIndex: 0
          }}
        />

        {/* FLOATING LEFT CHEVRON (PREVIOUS PAGE) */}
        {viewMode !== "scroll" && canGoPrev && (
          <button
            type="button"
            onClick={handlePrevPage}
            style={{
              position: "fixed",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 80,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.15s ease, background 0.15s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              e.currentTarget.style.background = "#2563eb";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
            }}
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* FLOATING RIGHT CHEVRON (NEXT PAGE) */}
        {viewMode !== "scroll" && canGoNext && (
          <button
            type="button"
            onClick={handleNextPage}
            style={{
              position: "fixed",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 80,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.15s ease, background 0.15s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              e.currentTarget.style.background = "#2563eb";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
            }}
            title="Next Page (Right Arrow / Space)"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* CATALOGUE PRESENTATION CORE */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center" }}>
          {/* A. SINGLE PAGE PRESENTATION MODE */}
          {viewMode === "single" && (
            <div
              key={`page-${currentPage}`}
              style={{
                width: `${Math.round(794 * zoomLevel)}px`,
                height: `${Math.round(1123 * zoomLevel)}px`,
                position: "relative",
                background: "#ffffff",
                boxShadow:
                  stageTheme === "light"
                    ? "0 20px 45px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)"
                    : "0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                overflow: "hidden",
                transition: "box-shadow 0.2s ease"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "794px",
                  height: "1123px",
                  transformOrigin: "0 0",
                  transform: `scale(${zoomLevel})`
                }}
                dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
              />
            </div>
          )}

          {/* B. 2-PAGE BOOK SPREAD MODE (MAGAZINE/EDITORIAL SPREAD) */}
          {viewMode === "spread" && (
            <div
              key={`spread-${currentPage}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {currentPage === 0 ? (
                /* Cover Page: Rendered solo in center */
                <div
                  style={{
                    width: `${Math.round(794 * zoomLevel)}px`,
                    height: `${Math.round(1123 * zoomLevel)}px`,
                    position: "relative",
                    background: "#ffffff",
                    boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px 8px 8px 4px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "794px",
                      height: "1123px",
                      transformOrigin: "0 0",
                      transform: `scale(${zoomLevel})`
                    }}
                    dangerouslySetInnerHTML={{ __html: pages[0] }}
                  />
                </div>
              ) : currentPage >= totalPages - 1 && totalPages % 2 === 1 ? (
                /* Lone Back Cover: Rendered solo in center */
                <div
                  style={{
                    width: `${Math.round(794 * zoomLevel)}px`,
                    height: `${Math.round(1123 * zoomLevel)}px`,
                    position: "relative",
                    background: "#ffffff",
                    boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px 4px 4px 8px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "794px",
                      height: "1123px",
                      transformOrigin: "0 0",
                      transform: `scale(${zoomLevel})`
                    }}
                    dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
                  />
                </div>
              ) : (
                /* Open 2-Page Spread with Center Book Spine Crease */
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}
                >
                  {/* Left Page (with right-edge spine crease shadow) */}
                  <div
                    style={{
                      width: `${Math.round(794 * zoomLevel)}px`,
                      height: `${Math.round(1123 * zoomLevel)}px`,
                      position: "relative",
                      background: "#ffffff",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "794px",
                        height: "1123px",
                        transformOrigin: "0 0",
                        transform: `scale(${zoomLevel})`
                      }}
                      dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
                    />
                    {/* Spine Shadow Overlay (Left) */}
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "28px",
                        background: "linear-gradient(to left, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.08) 50%, transparent 100%)",
                        pointerEvents: "none"
                      }}
                    />
                  </div>

                  {/* Center Binding Crease Line */}
                  <div
                    style={{
                      width: "2px",
                      height: `${Math.round(1123 * zoomLevel)}px`,
                      background: "rgba(0, 0, 0, 0.35)",
                      zIndex: 20
                    }}
                  />

                  {/* Right Page (with left-edge spine crease shadow) */}
                  {currentPage + 1 < totalPages && (
                    <div
                      style={{
                        width: `${Math.round(794 * zoomLevel)}px`,
                        height: `${Math.round(1123 * zoomLevel)}px`,
                        position: "relative",
                        background: "#ffffff",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "794px",
                          height: "1123px",
                          transformOrigin: "0 0",
                          transform: `scale(${zoomLevel})`
                        }}
                        dangerouslySetInnerHTML={{ __html: pages[currentPage + 1] }}
                      />
                      {/* Spine Shadow Overlay (Right) */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "28px",
                          background: "linear-gradient(to right, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.08) 50%, transparent 100%)",
                          pointerEvents: "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* C. CONTINUOUS MULTI-PAGE VERTICAL SCROLL MODE */}
          {viewMode === "scroll" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
              {pages.map((pageHtml, idx) => (
                <div
                  key={`scroll-${idx}`}
                  style={{
                    width: `${Math.round(794 * zoomLevel)}px`,
                    height: `${Math.round(1123 * zoomLevel)}px`,
                    position: "relative",
                    background: "#ffffff",
                    boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "794px",
                      height: "1123px",
                      transformOrigin: "0 0",
                      transform: `scale(${zoomLevel})`
                    }}
                    dangerouslySetInnerHTML={{ __html: pageHtml }}
                  />
                  {/* Floating Page Badge */}
                  <div
                    className="no-print"
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(6px)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      zIndex: 20
                    }}
                  >
                    Page {idx + 1} of {totalPages}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 3. INTERACTIVE BOTTOM THUMBNAIL FILMSTRIP DRAWER */}
      {showThumbnails && (
        <aside
          className="no-print"
          style={{
            height: "120px",
            background: activeTheme.headerBg,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${activeTheme.headerBorder}`,
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            gap: "12px",
            overflowX: "auto",
            zIndex: 90,
            flexShrink: 0
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 auto" }}>
            {pages.map((_, idx) => {
              const isActive =
                viewMode === "spread" && currentPage > 0
                  ? idx === currentPage || idx === currentPage + 1
                  : idx === currentPage;

              return (
                <div
                  key={`thumb-${idx}`}
                  onClick={() => {
                    setCurrentPage(idx);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    transition: "transform 0.15s ease"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  title={`Jump to Page ${idx + 1}`}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "74px",
                      background: "#ffffff",
                      borderRadius: "4px",
                      position: "relative",
                      overflow: "hidden",
                      border: isActive ? "2.5px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: isActive ? "0 0 12px rgba(56, 189, 248, 0.6)" : "0 4px 10px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "794px",
                        height: "1123px",
                        transformOrigin: "0 0",
                        transform: "scale(0.065)",
                        pointerEvents: "none"
                      }}
                      dangerouslySetInnerHTML={{ __html: pages[idx] }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "#38bdf8" : activeTheme.textMuted
                    }}
                  >
                    {idx === 0 ? "Cover" : idx === totalPages - 1 ? "Back" : `p. ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* 4. FLOATING CONVERSION CALL-TO-ACTION (BOTTOM RIGHT) */}
      {waUrl && (
        <aside
          className="no-print"
          style={{
            position: "fixed",
            bottom: showThumbnails ? "134px" : "22px",
            right: "22px",
            zIndex: 95,
            transition: "bottom 0.2s ease"
          }}
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#25D366",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "0.82rem",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(37, 211, 102, 0.4)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(37, 211, 102, 0.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 211, 102, 0.4)";
            }}
            title="Chat directly with company on WhatsApp"
          >
            <MessageCircle size={18} />
            <span>Inquire on WhatsApp</span>
          </a>
        </aside>
      )}

      {/* 5. QR CODE SCAN MODAL */}
      {showQrModal && (
        <div
          className="dynamic-catalogue-modal-backdrop"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "420px",
              margin: "auto",
              textAlign: "center",
              padding: "2.25rem",
              background: "#0f172a",
              color: "#f8fafc",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.8)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}
            >
              <QrCode size={26} />
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Scan to View on Phone
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Scan with your smartphone camera to open and share this live catalogue on WhatsApp or social media.
            </p>

            {qrCodeUrl && (
              <>
                <div
                  style={{
                    display: "inline-block",
                    padding: "14px",
                    background: "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    marginBottom: "0.75rem"
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="Live Catalogue QR Code"
                    style={{ width: "210px", height: "210px", display: "block" }}
                  />
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <a
                    href={typeof window !== "undefined" ? window.location.href : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qr-click-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      background: "#2563eb",
                      padding: "6px 18px",
                      borderRadius: "99px",
                      textDecoration: "none",
                      boxShadow: "0 3px 10px rgba(37,99,235,0.35)"
                    }}
                  >
                    Click here ↗
                  </a>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleShareLink}
                style={{ color: "#f8fafc", borderColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Share2 size={14} /> Copy Link
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowQrModal(false)}
                style={{ background: "#2563eb" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
