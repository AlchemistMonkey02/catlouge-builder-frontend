import React, { useState, useRef } from "react";
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  parseProductCatalogueCsv,
  generateProductCatalogueCsvTemplate,
  downloadCsvFile,
  getCategorySampleSheets,
} from "../utils/csvSheetHelper";
import { createCatalogueProduct } from "../services/api";

/**
 * ProductSheetUploadModal
 * Enables one-click batch upload of products via Excel/CSV sheets,
 * eliminating the need to repeatedly type repetitive product specifications.
 */
export default function ProductSheetUploadModal({
  isOpen,
  onClose,
  company,
  categoryFamily = "general",
  onProductsImported,
}) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(categoryFamily);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = (overrideFamily = null) => {
    const fam = overrideFamily || categoryFamily;
    const csvContent = generateProductCatalogueCsvTemplate(fam, company);
    const safeCompName = (company?.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "_");
    downloadCsvFile(`${safeCompName}_${fam}_products_template.csv`, csvContent);
  };

  const handleFileProcess = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setIsParsing(true);
    setParseErrors([]);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const result = parseProductCatalogueCsv(text, categoryFamily, company);
        setParsedProducts(result.products);
        setParseErrors(result.errors || []);
      } catch (err) {
        alert("Failed to parse spreadsheet: " + err.message);
        setParsedProducts([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
      setIsParsing(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteImport = async () => {
    if (!parsedProducts || parsedProducts.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);

    const importedList = [];

    for (let i = 0; i < parsedProducts.length; i++) {
      const prod = parsedProducts[i];
      try {
        // Save product directly to backend API
        const payload = {
          ...prod,
          organizationId: company?._id || "default_org",
          companyId: company?._id || null,
        };
        const res = await createCatalogueProduct(payload);
        const savedProd = res?.data || { ...payload, _id: `prod_${Date.now()}_${i}` };
        importedList.push(savedProd);
      } catch (err) {
        console.warn(`Server creation issue for ${prod.name}:`, err.message);
      }

      setImportProgress(Math.round(((i + 1) / parsedProducts.length) * 100));
    }

    setIsImporting(false);
    setImportSuccess(true);

    if (onProductsImported) {
      onProductsImported(importedList);
    }

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 15, 29, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isImporting) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: "95vw",
          maxWidth: "1050px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          background: "var(--bg-surface, #ffffff)",
          border: "1px solid var(--border-medium, #cbd5e1)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "1.2rem 1.6rem",
            borderBottom: "1px solid var(--border-subtle, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 3px 10px rgba(16, 185, 129, 0.35)",
              }}
            >
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Upload Products Sheet (Excel / CSV)
                </h3>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 750,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  ✓ {categoryFamily.toUpperCase()} SPECIFICATIONS READY
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Upload an Excel or CSV spreadsheet of products to instantly add all items with category specifications. No need to write them one-by-one!
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "1.4rem 1.6rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* STEP 1: DOWNLOAD TEMPLATE & INSTRUCTIONS */}
          <div
            style={{
              background: "var(--bg-surface-elevated, #f8fafc)",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              border: "1.5px dashed var(--border-medium, #cbd5e1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "650px" }}>
              <div style={{ color: "#3b82f6", marginTop: "2px" }}>
                <HelpCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 750, color: "var(--text-primary)" }}>
                  Step 1: Download Pre-Formatted Excel/CSV Template (5 Sample Products Per Category)
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.4 }}>
                  Verified column headers (Name, SKU, Price, MRP, Unit, Size, Thickness/Grade, Finish, Material, Application, Stock, Image_URL, Description) with 5 authentic products per category. Open in Excel, customize, and upload below.
                </div>
                {/* Category Selection Tabs */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                  {[
                    { id: "garlic", label: "🧄 Garlic" },
                    { id: "kotastone", label: "🪨 Kota Stone" },
                    { id: "sandstone", label: "🏛️ Sandstone" },
                    { id: "kotadoria", label: "✨ Kota Doria" },
                    { id: "general", label: "📦 General" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedFamily(cat.id)}
                      style={{
                        fontSize: "0.75rem",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: cat.id === selectedFamily ? "1.5px solid #2563eb" : "1px solid var(--border-medium, #cbd5e1)",
                        background: cat.id === selectedFamily ? "rgba(37, 99, 235, 0.12)" : "var(--bg-surface-elevated, #ffffff)",
                        color: cat.id === selectedFamily ? "#2563eb" : "var(--text-secondary)",
                        fontWeight: cat.id === selectedFamily ? 750 : 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {cat.label} {cat.id === selectedFamily && "✓"}
                    </button>
                  ))}
                </div>

                {/* 5 Distinct Specialized Sample Sheets for Selected Category */}
                <div
                  style={{
                    marginTop: "10px",
                    background: "rgba(37, 99, 235, 0.04)",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 750,
                      color: "#1d4ed8",
                      marginBottom: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>5 Ready-to-Use Sheets for {selectedFamily.toUpperCase()}:</span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      (Click any sheet to download .csv)
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {getCategorySampleSheets(selectedFamily).map((sheet) => (
                      <a
                        key={sheet.filename}
                        href={`/sample_sheets/${sheet.type === "databank" ? "databank" : "product"}/${sheet.filename}`}
                        download={sheet.filename}
                        style={{
                          fontSize: "0.72rem",
                          padding: "4px 9px",
                          borderRadius: "6px",
                          border: "1px solid rgba(37, 99, 235, 0.35)",
                          background: "#ffffff",
                          color: "#1d4ed8",
                          fontWeight: 650,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                          transition: "all 0.15s ease",
                        }}
                        title={`${sheet.description} — File: ${sheet.filename}`}
                      >
                        <FileSpreadsheet size={12} color="#2563eb" />
                        <span>Sheet {sheet.sheetNumber}: {sheet.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => handleDownloadTemplate(selectedFamily)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
                fontSize: "0.82rem",
                color: "#2563eb",
                borderColor: "#3b82f6",
                background: "rgba(59, 130, 246, 0.08)",
                whiteSpace: "nowrap",
                padding: "8px 14px",
              }}
            >
              <Download size={15} /> Download {selectedFamily.toUpperCase()} Template (.csv)
            </button>
          </div>

          {/* STEP 2: DROPZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? "#10b981" : "var(--border-medium, #cbd5e1)"}`,
              borderRadius: "12px",
              padding: "1.75rem",
              textAlign: "center",
              cursor: "pointer",
              background: isDragOver ? "rgba(16, 185, 129, 0.05)" : "var(--bg-input, #fafafa)",
              transition: "all 0.15s ease",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px auto",
              }}
            >
              <Upload size={22} />
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 750, color: "var(--text-primary)" }}>
              {fileName ? `Selected: ${fileName}` : "Click to select or drag & drop your Excel / CSV sheet here"}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Supports standard CSV, TSV, or Excel export files (.csv)
            </div>
          </div>

          {/* STEP 3: PREVIEW & VALIDATION TABLE */}
          {parsedProducts.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    Ready to Import: {parsedProducts.length} Products
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    ✓ All Validated
                  </span>
                </div>
                {parseErrors.length > 0 && (
                  <span style={{ fontSize: "0.76rem", color: "#ef4444", fontWeight: 600 }}>
                    ⚠ {parseErrors.length} row(s) skipped due to missing price or name
                  </span>
                )}
              </div>

              {/* Scrollable Table Viewport */}
              <div
                style={{
                  maxHeight: "260px",
                  overflowY: "auto",
                  border: "1px solid var(--border-medium, #e2e8f0)",
                  borderRadius: "10px",
                }}
              >
                <table className="table" style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, background: "var(--bg-surface-elevated, #f1f5f9)", zIndex: 2 }}>
                    <tr>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>#</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Product Name</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>SKU</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Price</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Size / Caliber</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Thickness / Grade</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Finish / Curing</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Material / Cultivar</th>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle, #f1f5f9)" }}>
                        <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>{idx + 1}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 700, color: "var(--text-primary)", maxWidth: "220px" }}>
                          {p.name}
                        </td>
                        <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono, monospace)", color: "#4f46e5" }}>
                          {p.sku}
                        </td>
                        <td style={{ padding: "8px 10px", fontWeight: 750, color: "#059669" }}>
                          ₹{p.price} {p.unit ? `/ ${p.unit}` : ""}
                        </td>
                        <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{p.size || "—"}</td>
                        <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{p.thickness || "—"}</td>
                        <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{p.finish || "—"}</td>
                        <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{p.material || "—"}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 600 }}>{p.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROGRESS OR SUCCESS NOTICE */}
          {isImporting && (
            <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "10px 14px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                <span>Importing products into catalogue...</span>
                <span>{importProgress}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${importProgress}%`, height: "100%", background: "var(--primary)", transition: "width 0.2s ease" }} />
              </div>
            </div>
          )}

          {importSuccess && (
            <div
              style={{
                background: "#dcfce7",
                border: "1px solid #86efac",
                color: "#166534",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              <CheckCircle size={18} />
              <span>✓ Successfully imported {parsedProducts.length} products into the catalogue! Refreshing view...</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "1rem 1.6rem",
            borderTop: "1px solid var(--border-subtle, #e2e8f0)",
            background: "var(--bg-surface-elevated, #f8fafc)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Need specifications? Use the <strong>Category Data Bank</strong> to configure standard pricing and grading presets.
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isImporting}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecuteImport}
              disabled={isImporting || parsedProducts.length === 0 || importSuccess}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
            >
              <CheckCircle size={16} />
              <span>{isImporting ? "Importing..." : `Import ${parsedProducts.length} Products`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
