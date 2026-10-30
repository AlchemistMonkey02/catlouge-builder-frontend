import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2,
  Plus,
  Boxes,
  FileText,
  Phone,
  Mail,
  Globe,
  MapPin,
  Trash2,
  Sparkles,
  ArrowRight,
  X,
  Upload,
  QrCode,
  Edit2,
  Check,
  Palette,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Search,
  CheckCircle,
  Layers,
} from "lucide-react";
import {
  fetchCompanies,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from "../services/api";

const EMPTY_FORM = {
  name: "",
  tagline: "Exclusive Product Collection",
  industry: "General",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
  brandColors: { primary: "#6366f1", secondary: "#0f172a", accent: "#10b981" },
  contact: {
    email: "contact@company.com",
    phone: "+91 98765 43210",
    website: "https://www.company.com",
    address: "100 Commercial Plaza, Business District",
  },
  qrLinks: {
    businessProfile: "",
    whatsapp: "",
    website: "",
    location: "",
    instagram: "",
    custom: "",
    customLabel: "Scan to Order",
  },
  legal: { gstNumber: "07AAAAA0000A1Z5", taxId: "PAN-998877", currency: "INR" },
  wholesaleTerms:
    "Standard Trade Terms: Net 30 payment terms for verified accounts. Minimum order quantity applies.",
};

export default function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [logoPreview, setLogoPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [failedLogos, setFailedLogos] = useState({});

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetchCompanies();
      if (res.data) {
        setCompanies(res.data);

        // Check if an edit company ID was requested in query string
        const editId = searchParams.get("edit");
        if (editId) {
          const target = res.data.find((c) => c._id === editId);
          if (target) {
            openEditModal(target);
          }
        }
      }
    } catch (err) {
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCompanyId(null);
    setFormData(EMPTY_FORM);
    setLogoPreview("");
    setActiveTab("general");
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const openEditModal = (comp) => {
    setEditingCompanyId(comp._id);
    setFormData({
      name: comp.name || "",
      tagline: comp.tagline || "",
      industry: comp.industry || "General",
      logoUrl: comp.logoUrl || "",
      brandColors: {
        primary: comp.brandColors?.primary || "#6366f1",
        secondary: comp.brandColors?.secondary || "#0f172a",
        accent: comp.brandColors?.accent || "#10b981",
      },
      contact: {
        email: comp.contact?.email || "",
        phone: comp.contact?.phone || "",
        website: comp.contact?.website || "",
        address: comp.contact?.address || "",
      },
      qrLinks: {
        businessProfile: comp.qrLinks?.businessProfile || "",
        whatsapp: comp.qrLinks?.whatsapp || "",
        website: comp.qrLinks?.website || "",
        location: comp.qrLinks?.location || "",
        instagram: comp.qrLinks?.instagram || "",
        custom: comp.qrLinks?.custom || "",
        customLabel: comp.qrLinks?.customLabel || "Scan to Order",
      },
      legal: {
        gstNumber: comp.legal?.gstNumber || "",
        taxId: comp.legal?.taxId || "",
        currency: comp.legal?.currency || "INR",
      },
      wholesaleTerms: comp.wholesaleTerms || "",
    });
    setLogoPreview(comp.logoUrl || "");
    setActiveTab("general");
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompanyId(null);
    if (searchParams.get("edit")) {
      searchParams.delete("edit");
      setSearchParams(searchParams);
    }
  };

  // Handle Logo File Upload from Computer
  const handleLogoFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler: Handles both Create and Update
  const handleSubmitCompany = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter a company name");

    try {
      setSaving(true);
      if (editingCompanyId) {
        // Edit existing company
        const res = await updateCompanyProfile(editingCompanyId, formData);
        if (res.data) {
          setCompanies((prev) =>
            prev.map((c) => (c._id === editingCompanyId ? res.data : c))
          );
          setSaveSuccess(true);
          setTimeout(() => {
            closeModal();
          }, 600);
        }
      } else {
        // Create new company
        const res = await createCompanyProfile(formData);
        if (res.data) {
          setCompanies((prev) => [...prev, res.data]);
          setSaveSuccess(true);
          setTimeout(() => {
            closeModal();
          }, 600);
        }
      }
    } catch (err) {
      alert("Error saving company profile: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (id, name) => {
    if (!window.confirm(`Delete company profile for "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCompanyProfile(id);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="main-content">
      {/* Header Banner */}
      <div className="workspace-toolbar" style={{ marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={13} /> Enterprise Brand Hub
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
                background: "var(--success-bg)",
                color: "var(--success)",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              <CheckCircle size={12} /> Atlas Connected
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.15rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginTop: "8px",
              lineHeight: 1.2,
            }}
          >
            Company Profiles &amp; Catalogues
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.96rem",
              marginTop: "5px",
              fontWeight: 500,
              maxWidth: "680px",
            }}
          >
            Manage multi-channel brand catalogues, digital QR storefronts, and automated print/PDF export studios.
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ fontSize: "0.95rem", fontWeight: 700, padding: "0.75rem 1.4rem" }}
          onClick={openCreateModal}
        >
          <Plus size={18} /> Create New Company Profile
        </button>
      </div>

      {/* Executive Metric KPI Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Active Brand Profiles
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {companies.length}
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "rgba(16, 185, 129, 0.12)",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Boxes size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Digital Catalogues
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {companies.length} Live
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "rgba(217, 119, 6, 0.12)",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <QrCode size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Dynamic QR Links
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {companies.length * 6} Portals
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "rgba(2, 132, 199, 0.12)",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Catalogue Formats
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              6 Canva Styles
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: "0.85rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
          <div className="search-input-wrapper" style={{ maxWidth: "380px" }}>
            <Search size={16} />
            <input
              type="text"
              className="input-field"
              placeholder="Search companies by name, industry, GST..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery("")}
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-muted)" }}>
            Industry:
          </span>
          {["all", ...new Set(companies.map((c) => c.industry).filter(Boolean))].map((ind) => {
            const isSel = selectedIndustry === ind;
            return (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
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
                {ind === "all" ? "All Industries" : ind}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && companies.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          Loading company profiles...
        </div>
      )}

      {/* Empty Search Result */}
      {!loading && companies.length > 0 && (
        (() => {
          const q = searchQuery.toLowerCase().trim();
          const filtered = companies.filter((c) => {
            const matchesSearch =
              !q ||
              c.name?.toLowerCase().includes(q) ||
              c.tagline?.toLowerCase().includes(q) ||
              c.industry?.toLowerCase().includes(q) ||
              c.legal?.gstNumber?.toLowerCase().includes(q);
            const matchesIndustry = selectedIndustry === "all" || c.industry === selectedIndustry;
            return matchesSearch && matchesIndustry;
          });

          if (filtered.length === 0) {
            return (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "3.5rem 2rem",
                  color: "var(--text-muted)",
                }}
              >
                <Building2 size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.4 }} />
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  No companies match your search
                </h3>
                <p style={{ fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto" }}>
                  Try adjusting your search query or industry filter to see matching company profiles.
                </p>
              </div>
            );
          }

          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "1.35rem",
              }}
            >
              {filtered.map((comp) => {
                const primaryColor = comp.brandColors?.primary || "#4338ca";
                const isLogoFailed = failedLogos[comp._id];

                return (
                  <div
                    key={comp._id}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "1.5rem",
                      transition: "all var(--transition-normal)",
                      position: "relative",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-card)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* Card Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flex: 1, minWidth: 0 }}>
                        {isLogoFailed || !comp.logoUrl ? (
                          <div
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "var(--radius-md)",
                              background: `linear-gradient(135deg, ${primaryColor} 0%, #1e1b4b 100%)`,
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              letterSpacing: "0.04em",
                              flexShrink: 0,
                              boxShadow: `0 4px 14px ${primaryColor}30`,
                            }}
                          >
                            {(comp.name || "CO").substring(0, 2).toUpperCase()}
                          </div>
                        ) : (
                          <img
                            src={comp.logoUrl}
                            alt={comp.name}
                            onError={() => setFailedLogos((prev) => ({ ...prev, [comp._id]: true }))}
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "var(--radius-md)",
                              objectFit: "cover",
                              border: "1px solid var(--border-subtle)",
                              background: "#ffffff",
                              padding: "2px",
                              flexShrink: 0,
                            }}
                          />
                        )}

                        <div style={{ overflow: "hidden" }}>
                          <h3
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 750,
                              color: "var(--text-primary)",
                              lineHeight: 1.25,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                            title={comp.name}
                          >
                            {comp.name}
                          </h3>
                          <div
                            style={{
                              fontSize: "0.82rem",
                              color: "var(--text-secondary)",
                              fontWeight: 500,
                              marginTop: "3px",
                              lineHeight: 1.3,
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                color: primaryColor,
                                fontWeight: 750,
                                background: `${primaryColor}15`,
                                padding: "1px 6px",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "0.75rem",
                              }}
                            >
                              {comp.industry || "General"}
                            </span>
                            <span style={{ color: "var(--text-muted)" }}>•</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                              {comp.tagline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Top Action Buttons (Edit + Delete) */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginLeft: "0.5rem" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.80rem",
                            fontWeight: 650,
                          }}
                          title="Edit Company Profile"
                          onClick={() => openEditModal(comp)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          style={{
                            color: "var(--danger)",
                            padding: "0.35rem 0.55rem",
                            borderColor: "var(--border-subtle)",
                          }}
                          title="Delete Company"
                          onClick={() => handleDeleteCompany(comp._id, comp.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div
                      style={{
                        fontSize: "0.86rem",
                        color: "var(--text-primary)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginBottom: "1.1rem",
                        marginTop: "0.2rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Mail size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                        <span style={{ fontWeight: 550, color: "var(--text-secondary)", fontSize: "0.84rem" }}>
                          {comp.contact?.email || "No email configured"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Phone size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                        <span style={{ fontWeight: 550, color: "var(--text-secondary)", fontSize: "0.84rem" }}>
                          {comp.contact?.phone || "No phone configured"}
                        </span>
                      </div>
                      {comp.contact?.website && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Globe size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          <a
                            href={comp.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontWeight: 600,
                              color: "var(--primary)",
                              textDecoration: "none",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.84rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>{comp.contact.website.replace(/^https?:\/\//, "")}</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", lineHeight: 1.35 }}>
                        <MapPin size={14} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontWeight: 450, color: "var(--text-muted)", fontSize: "0.82rem" }}>
                          {comp.contact?.address || "Address not provided"}
                        </span>
                      </div>
                    </div>

                    {/* Badges / Meta row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                        fontSize: "0.76rem",
                        padding: "0.4rem 0.75rem",
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                        GST: <strong style={{ color: "var(--text-primary)" }}>{comp.legal?.gstNumber || "N/A"}</strong>
                      </span>
                      <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                        Currency: <strong style={{ color: "var(--text-primary)" }}>{comp.legal?.currency || "INR"}</strong>
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 650,
                          color: "var(--primary)",
                          cursor: "pointer",
                        }}
                        onClick={() => openEditModal(comp)}
                      >
                        <Palette size={12} /> Brand Kit
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                        borderTop: "1px solid var(--border-subtle)",
                        paddingTop: "1rem",
                      }}
                    >
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: "0.88rem", fontWeight: 700 }}
                        onClick={() => navigate(`/companies/${comp._id}/catalogue`)}
                      >
                        <Boxes size={15} /> Add Products
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: "0.88rem", fontWeight: 700 }}
                        onClick={() => navigate(`/pdf-generator?companyId=${comp._id}`)}
                      >
                        <FileText size={15} /> Generate PDF &amp; QR
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      )}

      {/* CREATE / EDIT COMPANY PROFILE MODAL */}
      {isModalOpen && (
        <div className="drawer-backdrop" onClick={closeModal}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "720px",
              margin: "auto",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              padding: "0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-surface-elevated)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  className="brand-icon-box"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: formData.brandColors?.primary || "var(--primary)",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {editingCompanyId ? "Edit Company Profile" : "Create Company Profile"}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                      marginTop: "2px",
                    }}
                  >
                    {editingCompanyId
                      ? `Customize branding, contact, QR codes, and trade terms for ${formData.name || "this company"}`
                      : "Add a new company profile with custom branding and catalogue preferences"}
                  </div>
                </div>
              </div>

              <button className="btn btn-outline btn-sm" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                padding: "0.5rem 1.5rem",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
                overflowX: "auto",
              }}
            >
              {[
                { id: "general", label: "General & Branding", icon: Building2 },
                { id: "contact", label: "Contact Details", icon: Mail },
                { id: "qr", label: "QR Codes & Links", icon: QrCode },
                { id: "legal", label: "Legal & Wholesale Terms", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "0.5rem 0.85rem",
                      fontSize: "0.84rem",
                      fontWeight: isActive ? 700 : 550,
                      borderRadius: "6px",
                      border: "none",
                      background: isActive ? "var(--primary-light)" : "transparent",
                      color: isActive ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmitCompany}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                gap: "1.25rem",
              }}
            >
              {/* TAB 1: GENERAL & BRANDING */}
              {activeTab === "general" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div>
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="e.g. Supreme Granite & Stones or Acme Audio"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="e.g. Natural • Durable • Timeless"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Industry / Sector
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="e.g. Granite & Natural Stone, Electronics"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Logo Section */}
                  <div
                    style={{
                      background: "var(--bg-surface-elevated)",
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Company Logo (Upload File or Enter Image URL)
                    </label>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <label
                        className="btn btn-secondary btn-sm"
                        style={{
                          cursor: "pointer",
                          display: "inline-flex",
                          gap: "6px",
                          flexShrink: 0,
                        }}
                      >
                        <Upload size={14} /> Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleLogoFileUpload}
                        />
                      </label>

                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem", flex: 1 }}
                        placeholder="Or paste Logo URL"
                        value={formData.logoUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, logoUrl: e.target.value });
                          setLogoPreview(e.target.value);
                        }}
                      />

                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid var(--border-medium)",
                            background: "#fff",
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "6px",
                            border: "1px dashed var(--border-medium)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                            fontSize: "0.7rem",
                            flexShrink: 0,
                          }}
                        >
                          No logo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand Color Palettes */}
                  <div>
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Brand Color Scheme (Used on PDF headers, cards, and catalogue badges)
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                      <div
                        style={{
                          background: "var(--bg-surface-elevated)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", fontWeight: 650, color: "var(--text-secondary)" }}>
                          Primary Color
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                          <input
                            type="color"
                            style={{
                              width: "36px",
                              height: "32px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            value={formData.brandColors?.primary || "#6366f1"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, primary: e.target.value },
                              })
                            }
                          />
                          <input
                            type="text"
                            className="input-field"
                            style={{ padding: "0.3rem 0.5rem", fontSize: "0.82rem" }}
                            value={formData.brandColors?.primary || "#6366f1"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, primary: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          background: "var(--bg-surface-elevated)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", fontWeight: 650, color: "var(--text-secondary)" }}>
                          Secondary Color
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                          <input
                            type="color"
                            style={{
                              width: "36px",
                              height: "32px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            value={formData.brandColors?.secondary || "#0f172a"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, secondary: e.target.value },
                              })
                            }
                          />
                          <input
                            type="text"
                            className="input-field"
                            style={{ padding: "0.3rem 0.5rem", fontSize: "0.82rem" }}
                            value={formData.brandColors?.secondary || "#0f172a"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, secondary: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          background: "var(--bg-surface-elevated)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", fontWeight: 650, color: "var(--text-secondary)" }}>
                          Accent Color
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                          <input
                            type="color"
                            style={{
                              width: "36px",
                              height: "32px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            value={formData.brandColors?.accent || "#10b981"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, accent: e.target.value },
                              })
                            }
                          />
                          <input
                            type="text"
                            className="input-field"
                            style={{ padding: "0.3rem 0.5rem", fontSize: "0.82rem" }}
                            value={formData.brandColors?.accent || "#10b981"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandColors: { ...formData.brandColors, accent: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT DETAILS */}
              {activeTab === "contact" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Official Email
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="info@company.com"
                        value={formData.contact?.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, email: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Phone / WhatsApp Helpline
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="+91 90668 04666"
                        value={formData.contact?.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Website URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      style={{ paddingLeft: "0.85rem" }}
                      placeholder="https://www.supremestones.in"
                      value={formData.contact?.website || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, website: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Corporate / Factory Address
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                      placeholder="e.g. 15 16-1A, 21st Mile Stone, Malle Nalsandra, Jigani, Karnataka - 560083"
                      value={formData.contact?.address || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, address: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: QR CODES & ONLINE LINKS */}
              {activeTab === "qr" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div
                    style={{
                      background: "var(--bg-surface-elevated)",
                      padding: "0.85rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.83rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    These QR links will automatically generate interactive QR Codes on the front and back cover of your PDF Catalogues for buyers to scan.
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        WhatsApp Direct Link / Number
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="https://wa.me/919066804666"
                        value={formData.qrLinks?.whatsapp || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, whatsapp: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Google Maps Location Link
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="https://maps.google.com/?q=..."
                        value={formData.qrLinks?.location || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, location: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Instagram Profile Link
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="https://instagram.com/supremestones"
                        value={formData.qrLinks?.instagram || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, instagram: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Online Catalogue / Profile Link
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="https://www.company.com/catalogue"
                        value={formData.qrLinks?.businessProfile || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, businessProfile: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Custom QR Label
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="e.g. Scan to Order"
                        value={formData.qrLinks?.customLabel || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, customLabel: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Custom Action Link
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="https://example.com/order-form"
                        value={formData.qrLinks?.custom || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qrLinks: { ...formData.qrLinks, custom: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LEGAL & WHOLESALE TERMS */}
              {activeTab === "legal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        GSTIN / Tax ID
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="29AAGCS1234F1Z9"
                        value={formData.legal?.gstNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legal: { ...formData.legal, gstNumber: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        PAN / Corp Registration
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="PAN-SUPR1234S"
                        value={formData.legal?.taxId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legal: { ...formData.legal, taxId: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Default Currency
                      </label>
                      <select
                        className="select-field"
                        style={{ width: "100%" }}
                        value={formData.legal?.currency || "INR"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legal: { ...formData.legal, currency: e.target.value },
                          })
                        }
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 650,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Trade &amp; Wholesale Ordering Terms
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                      placeholder="e.g. Nationwide Coverage. Calibrated and box packed. Customized CNC patterns, surface finishes, and sizes tailored to projects."
                      value={formData.wholesaleTerms || ""}
                      onChange={(e) => setFormData({ ...formData, wholesaleTerms: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "1rem",
                  marginTop: "auto",
                }}
              >
                {saveSuccess ? (
                  <span
                    style={{
                      color: "var(--success)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={16} /> Saved successfully!
                  </span>
                ) : (
                  <span />
                )}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" className="btn btn-outline" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 700,
                    }}
                  >
                    {saving ? (
                      "Saving..."
                    ) : editingCompanyId ? (
                      <>
                        <Check size={16} /> Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Create Company Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
