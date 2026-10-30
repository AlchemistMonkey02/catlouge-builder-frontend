import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  FileText,
  Globe,
  Sparkles,
  RefreshCw,
  Table,
} from "lucide-react";
import {
  uploadSpreadsheetForPreview,
  processBulkImportJob,
  getDownloadTemplateUrl,
  getDownloadErrorUrl,
  extractProductFromUrl,
  extractProductFromPdf,
  createCatalogueProduct,
} from "../services/api";

export default function BulkImportHub() {
  const [activeTab, setActiveTab] = useState("file"); // 'file', 'url', 'pdf'
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState(null);

  // URL Scraper State
  const [urlInput, setUrlInput] = useState("");
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState(null);

  // PDF Extraction State
  const [pdfFile, setPdfFile] = useState(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfExtracted, setPdfExtracted] = useState(null);

  // Handle file selection & upload preview
  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setBatchResult(null);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      setIsProcessing(true);
      const res = await uploadSpreadsheetForPreview(formData);
      if (res.data) {
        setPreviewData(res.data);
        setColumnMapping(res.data.suggestedMapping || {});
      }
    } catch (err) {
      alert("Error parsing file: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Batch Import
  const handleExecuteImport = async () => {
    if (!previewData || !previewData.allRows) return;
    try {
      setIsProcessing(true);
      const res = await processBulkImportJob({
        fileName: previewData.fileName,
        rows: previewData.allRows,
        columnMapping,
      });

      if (res.data) {
        setBatchResult(res.data);
      }
    } catch (err) {
      alert("Import execution failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // URL Scrape
  const handleScrapeUrl = async () => {
    if (!urlInput) return;
    try {
      setIsScrapingUrl(true);
      const res = await extractProductFromUrl(urlInput);
      if (res.data) {
        setScrapedProduct(res.data);
      }
    } catch (err) {
      alert("URL extraction failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleSaveScrapedProduct = async () => {
    if (!scrapedProduct) return;
    try {
      const sku = `SKU-URL-${Date.now().toString(36).toUpperCase()}`;
      await createCatalogueProduct({
        ...scrapedProduct,
        sku,
      });
      alert(`Product "${scrapedProduct.name}" added to catalogue!`);
      setScrapedProduct(null);
      setUrlInput("");
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  // PDF Extraction
  const handlePdfUpload = async (e) => {
    const selectedPdf = e.target.files[0];
    if (!selectedPdf) return;
    setPdfFile(selectedPdf);

    const formData = new FormData();
    formData.append("pdfFile", selectedPdf);

    try {
      setIsParsingPdf(true);
      const res = await extractProductFromPdf(formData);
      if (res.data) {
        setPdfExtracted(res.data);
      }
    } catch (err) {
      alert("PDF parsing failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsParsingPdf(false);
    }
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
            Bulk Catalogue Builder &amp; Ingestion Hub
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
            Ingest hundreds or thousands of products via spreadsheets, PDF specification sheets, or product URLs.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a
            href={getDownloadTemplateUrl("xlsx")}
            className="btn btn-outline"
            download="Catalogue_Template.xlsx"
          >
            <Download size={15} /> Download Sample Excel (.xlsx)
          </a>
          <a
            href={getDownloadTemplateUrl("csv")}
            className="btn btn-outline"
            download="Catalogue_Template.csv"
          >
            <Download size={15} /> Sample CSV
          </a>
        </div>
      </div>

      {/* Ingestion Mode Switcher */}
      <div className="card" style={{ padding: "0.75rem 1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="nav-tab-item active"
            onClick={() => setActiveTab("file")}
          >
            <FileSpreadsheet size={16} /> Excel / CSV Spreadsheet
          </button>
          {/* AI Ingestion options commented out */}
          {/*
          <button
            className={`nav-tab-item ${activeTab === "url" ? "active" : ""}`}
            onClick={() => setActiveTab("url")}
          >
            <Globe size={16} /> Authorized Product URL
          </button>
          <button
            className={`nav-tab-item ${activeTab === "pdf" ? "active" : ""}`}
            onClick={() => setActiveTab("pdf")}
          >
            <FileText size={16} /> PDF Spec Sheet
          </button>
          */}
        </div>
      </div>

      {/* TAB 1: SPREADSHEET BULK IMPORT */}
      {activeTab === "file" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Upload Dropzone */}
          {!previewData && (
            <div
              className="card"
              style={{
                border: "2px dashed var(--border-medium)",
                padding: "3.5rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("bulk-file-input").click()}
            >
              <div className="brand-icon-box" style={{ width: "54px", height: "54px" }}>
                <UploadCloud size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Upload Excel (.xlsx) or CSV Catalogue
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
                  Drag &amp; drop your product spreadsheet here, or click to browse. Max 25MB.
                </p>
              </div>
              <input
                id="bulk-file-input"
                type="file"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button className="btn btn-primary" type="button">
                Select File from Computer
              </button>
            </div>
          )}

          {/* Interactive Column Mapping and Preview */}
          {previewData && !batchResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg-glass)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>
                    File Uploaded: {previewData.fileName}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Detected {previewData.totalRows} product rows and {previewData.headers.length} columns.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setPreviewData(null);
                      setFile(null);
                    }}
                  >
                    Change File
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={isProcessing}
                    onClick={handleExecuteImport}
                  >
                    {isProcessing ? "Processing Rows..." : "Run Batch Ingestion"}
                  </button>
                </div>
              </div>

              {/* Column Mapping Selector */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                  Step 2: Map Spreadsheet Columns to PIM Fields
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {previewData.headers.map((col) => (
                    <div
                      key={col}
                      style={{
                        padding: "0.75rem",
                        background: "var(--bg-input)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#a5b4fc", display: "block", marginBottom: "4px" }}>
                        Column: "{col}"
                      </label>
                      <select
                        className="select-field"
                        style={{ width: "100%", padding: "0.4rem 0.65rem", fontSize: "0.82rem" }}
                        value={columnMapping[col] || ""}
                        onChange={(e) =>
                          setColumnMapping({ ...columnMapping, [col]: e.target.value })
                        }
                      >
                        <option value="">-- Ignore Column --</option>
                        {previewData.targetFields.map((tf) => (
                          <option key={tf.key} value={tf.key}>
                            {tf.label} {tf.required ? "(Required)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-Row Data Preview Table */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                  First 5 Rows Preview
                </div>
                <div className="table-responsive">
                  <table className="pim-table">
                    <thead>
                      <tr>
                        {previewData.headers.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.previewRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {previewData.headers.map((h) => (
                            <td key={h}>{String(row[h] || "-")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Batch Result Summary & Error Download */}
          {batchResult && (
            <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={28} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Batch Processing Completed
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Successfully imported {batchResult.successfulRows} of {batchResult.total} products.
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Rows</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{batchResult.total}</div>
                </div>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Imported</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399" }}>
                    {batchResult.successfulRows}
                  </div>
                </div>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Failed Rows</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: batchResult.failedRows > 0 ? "#ef4444" : "#94a3b8" }}>
                    {batchResult.failedRows}
                  </div>
                </div>
              </div>

              {batchResult.failedRows > 0 && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, color: "#fca5a5", fontSize: "0.85rem" }}>
                      Partial failure detected in {batchResult.failedRows} rows. Remaining rows imported successfully.
                    </div>
                    <a
                      href={getDownloadErrorUrl(batchResult.batchId)}
                      className="btn btn-danger btn-sm"
                      download={`Batch_${batchResult.batchId}_Errors.xlsx`}
                    >
                      <Download size={14} /> Download Error Spreadsheet
                    </a>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setPreviewData(null);
                    setBatchResult(null);
                  }}
                >
                  Import Another File
                </button>
                <a href="/catalogue" className="btn btn-primary">
                  View Catalogue Products <ArrowRight size={15} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2 & TAB 3 (Commented out - AI features disabled) */}
      {/*
      {activeTab === "url" && ( ... )}
      {activeTab === "pdf" && ( ... )}
      */}
    </div>
  );
}
