import React, { useState, useEffect } from "react";
import {
  Palette,
  Building2,
  Save,
  CheckCircle,
  Shield,
  Truck,
  Sparkles,
} from "lucide-react";
import {
  fetchOrganizationProfile,
  updateOrganizationProfile,
} from "../services/api";

const TONES = [
  { id: "professional", label: "Professional & Authoritative" },
  { id: "premium", label: "Premium Luxury & Elegant" },
  { id: "minimal", label: "Minimalist & Direct" },
  { id: "seo_focused", label: "SEO & Keyword Heavy" },
  { id: "feature_focused", label: "Engineering & Feature Rich" },
  { id: "conversion_focused", label: "High-Converting & Engaging" },
];

export default function BrandKitSettings() {
  const [profile, setProfile] = useState({
    name: "ai Brands & Catalogues",
    businessProfile: {
      legalName: "ai Commerce Enterprises Pvt Ltd",
      gstNumber: "07AAAAA0000A1Z5",
      supportEmail: "catalogues@aibrands.com",
      supportPhone: "+91 98765 43210",
      websiteUrl: "https://aibrands.example.com",
      brandColors: {
        primary: "#6366f1",
        secondary: "#0f172a",
        accent: "#10b981",
      },
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
      tone: "professional",
      defaultPolicies: {
        warranty: "1 Year Standard Manufacturer Warranty against defects",
        care: "Store in cool dry conditions. Avoid abrasive materials.",
        returnPolicy: "7 Days Instant Return & Replacement",
        shippingInfo: "Dispatches within 24h via Express Air Cargo",
      },
    },
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchOrganizationProfile();
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateOrganizationProfile({
        name: profile.name,
        businessProfile: profile.businessProfile,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save brand kit: " + err.message);
    } finally {
      setSaving(false);
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
            Brand Kit &amp; Business Profile
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
            Configure default brand colors, AI writing tone, legal details, and standardized policies for catalogue generation.
          </p>
        </div>

        {savedSuccess && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#34d399",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <CheckCircle size={16} /> Saved Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Business Identity */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building2 size={18} color="var(--primary)" /> Business Entity &amp; Legal Details
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Brand / Organization Display Name
              </label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: "0.85rem" }}
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Registered Legal Entity Name
              </label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: "0.85rem" }}
                value={profile.businessProfile?.legalName || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: { ...profile.businessProfile, legalName: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: "0.85rem" }}
                value={profile.businessProfile?.gstNumber || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: { ...profile.businessProfile, gstNumber: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Support Email
              </label>
              <input
                type="email"
                className="input-field"
                style={{ paddingLeft: "0.85rem" }}
                value={profile.businessProfile?.supportEmail || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: { ...profile.businessProfile, supportEmail: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Brand Aesthetic & AI Tone */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Palette size={18} color="#a855f7" /> Brand Aesthetics &amp; Default AI Tone
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Default AI Content Writing Tone
              </label>
              <select
                className="select-field"
                style={{ width: "100%" }}
                value={profile.businessProfile?.tone || "professional"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: { ...profile.businessProfile, tone: e.target.value },
                  })
                }
              >
                {TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Brand Logo URL
              </label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: "0.85rem" }}
                value={profile.businessProfile?.logoUrl || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: { ...profile.businessProfile, logoUrl: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Primary Brand Color
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="color"
                  value={profile.businessProfile?.brandColors?.primary || "#6366f1"}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      businessProfile: {
                        ...profile.businessProfile,
                        brandColors: { ...profile.businessProfile?.brandColors, primary: e.target.value },
                      },
                    })
                  }
                  style={{ width: "40px", height: "38px", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: "0.85rem", flex: 1 }}
                  value={profile.businessProfile?.brandColors?.primary || "#6366f1"}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      businessProfile: {
                        ...profile.businessProfile,
                        brandColors: { ...profile.businessProfile?.brandColors, primary: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Standard Policy Defaults */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} color="#10b981" /> Standard Catalogue Policy Defaults
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Default Warranty Clause
              </label>
              <textarea
                className="input-field"
                rows={3}
                style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                value={profile.businessProfile?.defaultPolicies?.warranty || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: {
                      ...profile.businessProfile,
                      defaultPolicies: { ...profile.businessProfile?.defaultPolicies, warranty: e.target.value },
                    },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Default Return / Replacement Terms
              </label>
              <textarea
                className="input-field"
                rows={3}
                style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                value={profile.businessProfile?.defaultPolicies?.returnPolicy || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    businessProfile: {
                      ...profile.businessProfile,
                      defaultPolicies: { ...profile.businessProfile?.defaultPolicies, returnPolicy: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} /> {saving ? "Saving Brand Kit..." : "Save Brand Kit"}
          </button>
        </div>
      </form>
    </div>
  );
}
