import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Boxes,
  Plus,
  FileText,
  Upload,
  Sparkles,
  Trash2,
  Edit2,
  CheckCircle,
  Building2,
  ArrowLeft,
  X,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Sliders,
  Search,
} from "lucide-react";
import {
  fetchCompanies,
  fetchCatalogueProducts,
  createCatalogueProduct,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  // generateAiContent, // AI features commented out
} from "../services/api";

export default function CompanyCatalogueManager() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [failedThumbnails, setFailedThumbnails] = useState({});
  const [isLogoFailed, setIsLogoFailed] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "Electronics",
    subcategory: "",
    price: 1999,
    mrp: 2999,
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "",
    shortDescription: "",
    keyFeatures: [
      "Engineered with high-grade components for long-lasting durability.",
      "Ergonomic, modern profile designed for effortless daily usability.",
      "Includes complete manufacturer warranty and full accessories pack.",
    ],
    materialComposition: "High-Grade Composite",
    color: "Matte Black",
    hsnCode: "85183000",
    dimensions: { length: 20, width: 15, height: 5, unit: "cm" },
    weight: { value: 350, unit: "g" },
    technicalSpecifications: [
      { key: "Warranty", value: "1 Year Replacement", verified: true },
      { key: "Country of Origin", value: "India", verified: true },
    ],
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadCompanyAndProducts();
  }, [companyId]);

  const loadCompanyAndProducts = async () => {
    try {
      setLoading(true);
      const [compRes, prodRes] = await Promise.all([
        fetchCompanies(),
        fetchCatalogueProducts({ limit: 100 }),
      ]);

      let targetCompany = null;
      if (compRes.data) {
        targetCompany = compRes.data.find((c) => c._id === companyId) || compRes.data[0];
        setCompany(targetCompany);
      }

      if (prodRes.data?.products && targetCompany) {
        // Strictly filter products belonging to this company or matching brand name
        const compProducts = prodRes.data.products.filter(
          (p) => p.companyId === targetCompany._id || p.brand?.toLowerCase() === targetCompany.name.toLowerCase()
        );
        setProducts(compProducts);
      }
    } catch (err) {
      console.error("Error loading catalogue products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload Product Image from Computer
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm((prev) => ({
        ...prev,
        image: reader.result,
        images: [{ url: reader.result, isPrimary: true, backgroundType: "white" }],
      }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // AI Content Generator helper (Commented out - AI features removed)
  /*
  const handleAutoEnrichAi = async () => {
    if (!productForm.name) return alert("Please enter a Product Name first");
    try {
      setIsGeneratingAi(true);
      const res = await generateAiContent({
        productData: {
          name: productForm.name,
          category: productForm.category,
          brand: company?.name || "ai",
          color: productForm.color,
          materialComposition: productForm.materialComposition,
        },
        tone: "professional",
      });

      if (res.data?.generated) {
        const g = res.data.generated;
        setProductForm((prev) => ({
          ...prev,
          shortDescription: g.shortDescription,
          description: g.description,
          keyFeatures: g.keyFeatures || prev.keyFeatures,
        }));
      }
    } catch (err) {
      alert("AI enrichment failed: " + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };
  */

  // Add Bullet
  const handleAddBullet = () => {
    setProductForm((prev) => ({
      ...prev,
      keyFeatures: [...(prev.keyFeatures || []), "Premium grade finish with high durability"],
    }));
  };

  const handleDeleteBullet = (idx) => {
    const bullets = [...(productForm.keyFeatures || [])];
    bullets.splice(idx, 1);
    setProductForm((prev) => ({ ...prev, keyFeatures: bullets }));
  };

  // Add Spec Row
  const handleAddSpecRow = () => {
    setProductForm((prev) => ({
      ...prev,
      technicalSpecifications: [
        ...prev.technicalSpecifications,
        { key: "Parameter", value: "Standard", verified: true },
      ],
    }));
  };

  const handleDeleteSpecRow = (idx) => {
    const specs = [...productForm.technicalSpecifications];
    specs.splice(idx, 1);
    setProductForm((prev) => ({ ...prev, technicalSpecifications: specs }));
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return alert("Product name is required");

    const payload = {
      ...productForm,
      companyId: company?._id,
      brand: company?.name || productForm.brand || "Brand",
      sku: productForm.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      status: "approved",
    };

    try {
      if (editingProductId) {
        await updateCatalogueProduct(editingProductId, payload);
      } else {
        await createCatalogueProduct(payload);
      }
      setIsProductModalOpen(false);
      setEditingProductId(null);
      resetForm();
      loadCompanyAndProducts();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit existing product
  const handleOpenEditProduct = (p) => {
    setEditingProductId(p._id);
    setProductForm({
      name: p.name || "",
      sku: p.sku || "",
      brand: p.brand || "",
      category: p.category || "Electronics",
      subcategory: p.subcategory || "",
      price: p.price || 0,
      mrp: p.mrp || 0,
      stock: p.stock || 0,
      image: p.image || (p.images && p.images[0]?.url) || "",
      description: p.description || "",
      shortDescription: p.shortDescription || "",
      keyFeatures: p.keyFeatures || [],
      materialComposition: p.materialComposition || "",
      color: p.color || "",
      hsnCode: p.hsnCode || "",
      dimensions: p.dimensions || { length: 0, width: 0, height: 0, unit: "cm" },
      weight: p.weight || { value: 0, unit: "g" },
      technicalSpecifications: p.technicalSpecifications || [],
    });
    setImagePreview(p.image || "");
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from catalogue?")) return;
    try {
      await deleteCatalogueProduct(id);
      loadCompanyAndProducts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      sku: "",
      brand: "",
      category: "Electronics",
      subcategory: "",
      price: 1999,
      mrp: 2999,
      stock: 50,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      description: "",
      shortDescription: "",
      keyFeatures: [
        "Engineered with high-grade components for long-lasting durability.",
        "Ergonomic, modern profile designed for effortless daily usability.",
        "Includes complete manufacturer warranty and full accessories pack.",
      ],
      materialComposition: "High-Grade Composite",
      color: "Matte Black",
      hsnCode: "85183000",
      dimensions: { length: 20, width: 15, height: 5, unit: "cm" },
      weight: { value: 350, unit: "g" },
      technicalSpecifications: [
        { key: "Warranty", value: "1 Year Replacement", verified: true },
        { key: "Country of Origin", value: "India", verified: true },
      ],
    });
    setImagePreview("");
  };

  const primaryColor = company?.brandColors?.primary || "#6366f1";

  return (
    <div className="main-content">
      {/* Back link & Top Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Link
          to="/companies"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Companies
        </Link>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn btn-outline"
            onClick={() => {
              resetForm();
              setEditingProductId(null);
              setIsProductModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Product to Catalogue
          </button>

          <button
            className="btn btn-primary btn-lg"
            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)" }}
            onClick={() => navigate(`/pdf-generator?companyId=${company?._id}`)}
          >
            <FileText size={18} /> Generate PDF Catalogue ({products.length} Products)
          </button>
        </div>
      </div>

      {/* Company Header Card */}
      {company && (
        <div
          className="card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            {isLogoFailed || !company.logoUrl ? (
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "var(--radius-md)",
                  background: `linear-gradient(135deg, ${primaryColor} 0%, #1e1b4b 100%)`,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  letterSpacing: "0.04em",
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${primaryColor}30`,
                }}
              >
                {(company.name || "CO").substring(0, 2).toUpperCase()}
              </div>
            ) : (
              <img
                src={company.logoUrl}
                alt={company.name}
                onError={() => setIsLogoFailed(true)}
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "var(--radius-md)",
                  objectFit: "cover",
                  border: "1px solid var(--border-subtle)",
                  background: "#ffffff",
                  padding: "2px",
                  flexShrink: 0,
                }}
              />
            )}

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
                  {company.name}
                </h2>
                <span className="status-pill approved">Active Catalogue</span>
                <button
                  className="btn btn-outline btn-sm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.78rem",
                    padding: "3px 8px",
                    fontWeight: 650,
                  }}
                  title="Edit Company Profile & Branding"
                  onClick={() => navigate(`/companies?edit=${company._id}`)}
                >
                  <Edit2 size={12} /> Edit Profile
                </button>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: "4px 0 0 0", fontWeight: 500 }}>
                {company.tagline} • GST: <strong>{company.legal?.gstNumber || "N/A"}</strong> • Currency: <strong>{company.legal?.currency || "INR"}</strong>
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              background: "var(--bg-surface-elevated)",
              padding: "0.65rem 1.25rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1.1 }}>
                {products.length}
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Products Catalogued
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table Toolbar (Search + Category Filter) */}
      <div
        className="card"
        style={{
          padding: "0.85rem 1.25rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
          <div className="search-input-wrapper" style={{ maxWidth: "360px" }}>
            <Search size={16} />
            <input
              type="text"
              className="input-field"
              placeholder="Search products by title, SKU, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery("")}
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem" }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-muted)" }}>
            Category:
          </span>
          {["all", ...new Set(products.map((p) => p.category).filter(Boolean))].map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.78rem",
                  fontWeight: isSel ? 750 : 500,
                  borderRadius: "var(--radius-full)",
                  background: isSel ? "var(--primary)" : "var(--bg-surface-elevated)",
                  color: isSel ? "#ffffff" : "var(--text-secondary)",
                  border: isSel ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                }}
              >
                {cat === "all" ? "All Items" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="grid-container">
        <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Boxes size={17} color="var(--primary)" /> Catalogue Product Items
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Ready to export to Canva-style PDF templates
          </span>
        </div>

        <div className="table-responsive">
          <table className="pim-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>MRP</th>
                <th>Inventory</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const q = searchQuery.toLowerCase().trim();
                const filtered = products.filter((p) => {
                  const matchesSearch =
                    !q ||
                    p.name?.toLowerCase().includes(q) ||
                    p.sku?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.color?.toLowerCase().includes(q) ||
                    p.materialComposition?.toLowerCase().includes(q);
                  const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "3.5rem 1rem", color: "var(--text-muted)" }}>
                        {products.length === 0
                          ? 'No products added yet. Click "+ Add Product to Catalogue" above to start!'
                          : "No products matched your search or category filter."}
                      </td>
                    </tr>
                  );
                }

                return filtered.map((p) => {
                  const isThumbFailed = failedThumbnails[p._id];
                  return (
                    <tr key={p._id}>
                      <td>
                        {isThumbFailed || !p.image ? (
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "var(--radius-sm)",
                              background: "var(--bg-surface-elevated)",
                              border: "1px solid var(--border-subtle)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--text-muted)",
                            }}
                          >
                            <ImageIcon size={20} />
                          </div>
                        ) : (
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={() => setFailedThumbnails((prev) => ({ ...prev, [p._id]: true }))}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border-subtle)",
                              background: "#000000",
                              display: "block",
                            }}
                          />
                        )}
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 650, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                          {p.sku}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 650, color: "var(--text-primary)", fontSize: "0.92rem", maxWidth: "280px" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {p.color ? `${p.color} • ` : ""}{p.materialComposition || ""}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "var(--radius-full)",
                            background: "var(--bg-surface-elevated)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                          ₹{p.price}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-muted)", textDecoration: "line-through", fontSize: "0.85rem" }}>
                          {p.mrp ? `₹${p.mrp}` : "-"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.stock > 0 ? "approved" : "draft"}`}>
                          {p.stock > 0 ? `${p.stock} In Stock` : "Out of Stock"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
                          <button
                            className="btn btn-outline btn-sm"
                            title="AI Studio Shoot (Convert phone image to studio master)"
                            onClick={() => navigate("/ai-studio", { state: { image: p.image, productId: p._id } })}
                            style={{
                              color: "var(--primary)",
                              borderColor: "var(--border-subtle)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 650,
                              padding: "4px 9px",
                              fontSize: "0.78rem",
                            }}
                          >
                            <Sparkles size={13} />
                            <span>AI Studio</span>
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            title="Edit Product"
                            onClick={() => handleOpenEditProduct(p)}
                            style={{ padding: "4px 8px" }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: "var(--danger)", padding: "4px 8px", borderColor: "var(--border-subtle)" }}
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "740px",
              margin: "auto",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div className="brand-icon-box" style={{ width: "36px", height: "36px" }}>
                  <Boxes size={20} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 750, color: "var(--text-primary)" }}>
                  {editingProductId ? "Edit Product" : "Add Product to Catalogue"}
                </h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsProductModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Product Title & AI Helper */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Product Title / Name *
                  </label>
                  {/* AI Auto-Generate Details button commented out */}
                  {/*
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: "0.72rem", padding: "2px 8px", color: "#a855f7" }}
                    onClick={handleAutoEnrichAi}
                    disabled={isGeneratingAi}
                  >
                    <Sparkles size={12} /> {isGeneratingAi ? "Enriching..." : "AI Auto-Generate Details"}
                  </button>
                  */}
                </div>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: "0.85rem" }}
                  placeholder="e.g. Pure Copper Insulated Thermal Flask - 1000ml"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              {/* SKU & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    SKU / Item Code
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder="e.g. APX-PRO-01"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder="e.g. Electronics, Fashion, Home"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Selling / Wholesale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Product Image: Upload from Computer or URL */}
              <div className="card" style={{ background: "var(--bg-input)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Product Image (Upload from Computer, Phone or URL)
                  </label>
                  {/* Shoot in AI Studio commented out */}
                  {/*
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ display: "inline-flex", gap: "6px", alignItems: "center", padding: "3px 10px", fontSize: "0.78rem" }}
                    onClick={() => {
                      navigate("/ai-studio", {
                        state: {
                          image: productForm.image,
                          productId: editingProductId || null,
                        },
                      });
                    }}
                    title="Open AI Studio to turn normal phone shot into studio-level commercial shoot"
                  >
                    <Sparkles size={13} /> Shoot in AI Studio
                  </button>
                  */}
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", gap: "6px" }}>
                    <Upload size={14} /> Upload File
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFileUpload} />
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem", flex: 1 }}
                    placeholder="Or paste Image URL"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Product Preview"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-medium)" }}
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Product Description
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                  placeholder="Comprehensive description of product features, usage, and quality."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              {/* Color & Material */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Color / Finish
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder="e.g. Matte Onyx Black"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Material Composition
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder="e.g. Anodized Aluminum & Memory Foam"
                    value={productForm.materialComposition}
                    onChange={(e) => setProductForm({ ...productForm, materialComposition: e.target.value })}
                  />
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Dimensions (L x W x H)
                  </label>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.5rem" }}
                      placeholder="L"
                      value={productForm.dimensions?.length || ""}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        dimensions: { ...(productForm.dimensions || {}), length: Number(e.target.value), unit: "cm" }
                      })}
                    />
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.5rem" }}
                      placeholder="W"
                      value={productForm.dimensions?.width || ""}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        dimensions: { ...(productForm.dimensions || {}), width: Number(e.target.value), unit: "cm" }
                      })}
                    />
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.5rem" }}
                      placeholder="H"
                      value={productForm.dimensions?.height || ""}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        dimensions: { ...(productForm.dimensions || {}), height: Number(e.target.value), unit: "cm" }
                      })}
                    />
                    <span style={{ alignSelf: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>cm</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Shipping Weight
                  </label>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <input
                      type="number"
                      className="input-field"
                      style={{ paddingLeft: "0.75rem", flex: 1 }}
                      placeholder="e.g. 350"
                      value={productForm.weight?.value || ""}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        weight: { ...(productForm.weight || {}), value: Number(e.target.value), unit: "g" }
                      })}
                    />
                    <span style={{ alignSelf: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>g</span>
                  </div>
                </div>
              </div>

              {/* Key Feature Bullets */}
              <div className="card" style={{ background: "var(--bg-input)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Key Feature Highlights (Bullets)
                  </label>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddBullet}>
                    <Plus size={13} /> Add Bullet
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(productForm.keyFeatures || []).map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1 }}
                        placeholder="Bullet feature highlight..."
                        value={feat}
                        onChange={(e) => {
                          const updated = [...(productForm.keyFeatures || [])];
                          updated[idx] = e.target.value;
                          setProductForm({ ...productForm, keyFeatures: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: "#ef4444" }}
                        onClick={() => handleDeleteBullet(idx)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="card" style={{ background: "var(--bg-input)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Technical Specifications
                  </label>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddSpecRow}>
                    <Plus size={13} /> Add Spec
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {productForm.technicalSpecifications.map((s, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1 }}
                        placeholder="Parameter (e.g. Material)"
                        value={s.key}
                        onChange={(e) => {
                          const updated = [...productForm.technicalSpecifications];
                          updated[idx].key = e.target.value;
                          setProductForm({ ...productForm, technicalSpecifications: updated });
                        }}
                      />
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1.5 }}
                        placeholder="Value (e.g. Stainless Steel)"
                        value={s.value}
                        onChange={(e) => {
                          const updated = [...productForm.technicalSpecifications];
                          updated[idx].value = e.target.value;
                          setProductForm({ ...productForm, technicalSpecifications: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: "#ef4444" }}
                        onClick={() => handleDeleteSpecRow(idx)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProductId ? "Update Product" : "Save Product to Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
