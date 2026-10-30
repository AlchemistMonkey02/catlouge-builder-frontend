import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  Copy,
  Lock,
  Unlock,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Download,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  fetchCatalogueProducts,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  duplicateCatalogueProduct,
  executeBulkActions,
  createCatalogueProduct,
} from "../services/api";
import ProductStudioDrawer from "../components/ProductStudioDrawer";

const STATUS_FILTERS = [
  { id: "All", label: "All Items" },
  { id: "draft", label: "Draft" },
  { id: "needs_review", label: "Needs Review" },
  { id: "validated", label: "Validated" },
  { id: "approved", label: "Approved" },
  { id: "exported", label: "Exported" },
];

export default function CatalogueWorkspace() {
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Active product drawer
  const [activeDrawerProduct, setActiveDrawerProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [selectedStatus, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        status: selectedStatus,
        category: selectedCategory,
        limit: 50,
      };
      const res = await fetchCatalogueProducts(params);
      if (res.data) {
        setProducts(res.data.products || []);
        setCounts(res.data.counts || {});
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  // Toggle selection
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await executeBulkActions(selectedIds, "update_status", { status: newStatus });
      setSelectedIds([]);
      loadProducts();
    } catch (err) {
      alert("Bulk update failed: " + err.message);
    }
  };

  const handleBulkAiEnrich = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await executeBulkActions(selectedIds, "ai_enrich");
      setSelectedIds([]);
      loadProducts();
    } catch (err) {
      alert("AI enrichment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    try {
      await executeBulkActions(selectedIds, "delete");
      setSelectedIds([]);
      loadProducts();
    } catch (err) {
      alert("Bulk delete failed: " + err.message);
    }
  };

  // Duplicate single product
  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    try {
      await duplicateCatalogueProduct(id);
      loadProducts();
    } catch (err) {
      alert("Duplicate failed: " + err.message);
    }
  };

  // Delete single product
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteCatalogueProduct(id);
      loadProducts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // Save changes from drawer
  const handleSaveProductFromDrawer = async (updatedProduct) => {
    try {
      await updateCatalogueProduct(updatedProduct._id, updatedProduct);
      setActiveDrawerProduct(null);
      loadProducts();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Create new blank product
  const handleCreateNewProduct = async () => {
    try {
      const newSku = `APX-${Date.now().toString(36).toUpperCase()}`;
      const res = await createCatalogueProduct({
        sku: newSku,
        name: "New Product Draft",
        brand: "ai",
        category: "Electronics",
        price: 999,
        mrp: 1499,
        stock: 20,
        description: "New product description draft waiting for AI enrichment.",
      });
      if (res.data) {
        await loadProducts();
        setActiveDrawerProduct(res.data);
      }
    } catch (err) {
      alert("Error creating product: " + err.message);
    }
  };

  return (
    <div className="main-content">
      {/* Workspace Header & Action Bar */}
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
            Catalogue PIM Workspace
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
            Centralized master catalogue with inline editing, AI enrichment, and multi-channel validation.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-outline" onClick={loadProducts} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <div style={{ display: "flex", background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: "2px", border: "1px solid var(--border-subtle)" }}>
            <button
              className={`btn btn-sm ${viewMode === "table" ? "btn-secondary" : "btn-outline"}`}
              style={{ border: "none" }}
              onClick={() => setViewMode("table")}
            >
              <TableIcon size={15} />
            </button>
            <button
              className={`btn btn-sm ${viewMode === "grid" ? "btn-secondary" : "btn-outline"}`}
              style={{ border: "none" }}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleCreateNewProduct}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div
        className="card"
        style={{
          padding: "0.85rem 1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflowX: "auto", flex: 1 }}>
          {STATUS_FILTERS.map((f) => {
            const count = f.id === "All" ? counts.total : counts[f.id];
            return (
              <button
                key={f.id}
                className={`nav-tab-item ${selectedStatus === f.id ? "active" : ""}`}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                onClick={() => setSelectedStatus(f.id)}
              >
                <span>{f.label}</span>
                {count !== undefined && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "1px 5px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(255,255,255,0.08)",
                      marginLeft: "4px",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="input-field"
            placeholder="Search SKU, Title, Brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* High-Density Spreadsheet Data Grid View */}
      {viewMode === "table" ? (
        <div className="grid-container">
          <div className="table-responsive">
            <table className="pim-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedIds.length === products.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>SKU</th>
                  <th>Product Title &amp; Details</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price / MRP</th>
                  <th>Stock</th>
                  <th>Channel Readiness</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      Loading catalogue data...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      No products match current filters.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isSelected = selectedIds.includes(p._id);
                    const readiness = p.validationResults?.readinessScore || 85;
                    return (
                      <tr
                        key={p._id}
                        style={{
                          background: isSelected ? "rgba(99, 102, 241, 0.08)" : undefined,
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveDrawerProduct(p)}
                      >
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(p._id)}
                          />
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-secondary)" }}>
                            {p.sku}
                          </span>
                        </td>
                        <td>
                          <div className="product-row-title">
                            <img
                              src={p.image || (p.images && p.images[0]?.url) || "https://via.placeholder.com/100"}
                              alt={p.name}
                              className="product-thumb"
                            />
                            <div>
                              <div className="product-name-link">{p.name}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                {p.color ? `${p.color} • ` : ""}
                                {p.hsnCode ? `HSN: ${p.hsnCode}` : "No HSN"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: "var(--text-secondary)" }}>{p.category}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{p.brand}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 650, color: "var(--text-primary)" }}>₹{p.price}</div>
                          {p.mrp ? (
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              ₹{p.mrp}
                            </div>
                          ) : null}
                        </td>
                        <td>
                          <span style={{ color: p.stock < 10 ? "#f59e0b" : "var(--text-secondary)" }}>
                            {p.stock}
                          </span>
                        </td>
                        <td>
                          <div className="readiness-meter">
                            <div className="readiness-bar-bg">
                              <div
                                className="readiness-bar-fill"
                                style={{
                                  width: `${readiness}%`,
                                  background: readiness > 80 ? "#10b981" : readiness > 50 ? "#f59e0b" : "#ef4444",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                              {readiness}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${p.status}`}>{p.status}</span>
                        </td>
                        <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Duplicate"
                              onClick={(e) => handleDuplicate(e, p._id)}
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Delete"
                              style={{ color: "#ef4444" }}
                              onClick={(e) => handleDelete(e, p._id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {products.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
              onClick={() => setActiveDrawerProduct(p)}
            >
              <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#000", marginBottom: "0.75rem" }}>
                <img
                  src={p.image || (p.images && p.images[0]?.url)}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className={`status-pill ${p.status}`} style={{ position: "absolute", top: "10px", right: "10px" }}>
                  {p.status}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {p.sku}
              </div>
              <div style={{ fontWeight: 650, color: "var(--text-primary)", fontSize: "0.95rem", margin: "4px 0", lineHeight: 1.3 }}>
                {p.name}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>₹{p.price}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div style={{ height: "18px", width: "1px", background: "var(--border-medium)" }} />
          <button className="btn btn-outline btn-sm" onClick={() => handleBulkStatusChange("approved")}>
            Approve All
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => handleBulkStatusChange("draft")}>
            Move to Draft
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleBulkAiEnrich}>
            <Sparkles size={14} /> AI Enrich Selected
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* Product Studio Drawer */}
      {activeDrawerProduct && (
        <ProductStudioDrawer
          product={activeDrawerProduct}
          onClose={() => setActiveDrawerProduct(null)}
          onSave={handleSaveProductFromDrawer}
        />
      )}
    </div>
  );
}
