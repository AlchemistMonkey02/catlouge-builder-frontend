import React, { useState, useEffect } from "react";
import { X, Scissors, Check, Loader2, RefreshCw } from "lucide-react";
import { neuralAiCutout } from "../services/api";

export default function RemoveBgModal({ isOpen, onClose, imageSrc, onApply }) {
  const [cutoutImage, setCutoutImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const runRemoveBg = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setError("");
    setCutoutImage(null);
    try {
      const res = await neuralAiCutout({ image: imageSrc });
      if (res?.success && res?.cutout) {
        setCutoutImage(res.cutout);
      } else {
        setError(res?.message || res?.error || "Background removal failed. Please check that the server is running.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Background removal failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && imageSrc) {
      runRemoveBg();
    } else if (!isOpen) {
      setCutoutImage(null);
      setError("");
      setIsProcessing(false);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "var(--bg-surface)",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            paddingBottom: "0.85rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(124, 58, 237, 0.12)",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Scissors size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                Remove Background (rembg)
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Preview the transparent cutout before applying it to your product
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ padding: "6px" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Original Image
            </div>
            <div
              style={{
                height: "320px",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface-elevated)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "0.75rem",
              }}
            >
              <img
                src={imageSrc}
                alt="Original"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#7c3aed",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Background Removed
            </div>
            <div
              style={{
                height: "320px",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                backgroundImage:
                  "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "0.75rem",
              }}
            >
              {isProcessing ? (
                <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 0.5rem" }} />
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Removing background...</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "1rem", fontSize: "0.85rem" }}>
                  {error}
                </div>
              ) : cutoutImage ? (
                <img
                  src={cutoutImage}
                  alt="Background Removed"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={runRemoveBg}
            disabled={isProcessing}
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!cutoutImage || isProcessing}
              onClick={() => {
                if (cutoutImage) {
                  onApply(cutoutImage);
                  onClose();
                }
              }}
            >
              <Check size={16} />
              <span>Apply Cutout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
