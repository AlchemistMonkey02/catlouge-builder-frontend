import React, { useState } from "react";
import {
  Palette,
  Layout,
  Type,
  Sliders,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle,
  Eye,
  Columns,
  Grid,
  List,
  Square,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  Shield,
  QrCode,
  BookOpen,
  FileText,
  Image,
  Edit3,
} from "lucide-react";

export const DEFAULT_DESIGN_CONFIG = {
  // Theme & Colors
  primaryColor: "#4E5C43",
  secondaryColor: "#1C1917",
  accentColor: "#C5A059",
  pageBg: "#F5F6F0",
  cardBg: "#FFFFFF",
  textColor: "#1C1917",
  cardBorderColor: "#E2E8F0",

  // Grid & Layout
  layoutMode: "grid_2", // 'grid_1', 'grid_2', 'grid_3', 'grid_4', 'list_table'
  imageRatio: "4:5", // '1:1', '4:5', '16:9', 'circle'
  cardRadius: 10, // 0 to 24px
  cardShadow: "soft", // 'none', 'subtle', 'soft', 'floating', 'glow'
  headerStyle: "modern_banner", // 'modern_banner', 'centered_luxe', 'minimal_left', 'bold_contrast', 'clean_strip'
  footerStyle: "full_details",

  // Typography & Design
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'Inter', sans-serif",
  headingLetterSpacing: "0.04em", // 'normal', '0.04em', '0.12em'
  headingTransform: "none", // 'none', 'uppercase', 'capitalize'
  decorativeFrame: "none", // 'none', 'gold_double', 'minimal_clean', 'cyber_hud', 'artisan_arch'
  watermarkText: "",
  showWatermark: false,

  // Card Field Toggles
  showPrice: true,
  showMrp: true,
  showSavings: true,
  showSku: true,
  showCategory: true,
  showStockBadge: true,
  showDescription: true,
  showProductQr: true,

  // Multi-Page Architecture (Every page can be enabled/disabled & custom written)
  pageStructure: {
    showCoverPage: true,
    showAboutPage: true,
    showFinishesPage: true,
    showProductsPage: true,
    showGalleryPage: true,
    showBackCoverPage: true,
  },

  // 1. Cover Page Config
  coverConfig: {
    title: "", // defaults to company name
    subtitle: "", // defaults to company tagline
    edition: "2026 SIGNATURE COLLECTION",
    badgeText: "OFFICIAL CATALOGUE",
    coverImage: "/assets/reference/p1_1.jpg",
    style: "editorial_hero", // 'editorial_hero', 'minimal_frame', 'bold_block', 'split_screen'
  },

  // 2. About Us / Heritage Page Config
  aboutConfig: {
    title: "About Our Craft & Heritage",
    subtitle: "A Tradition of Excellence & Uncompromising Quality",
    content:
      "We take pride in delivering premier craftsmanship and meticulously engineered products. Every creation is curated with authentic materials, master artisans, and rigorous quality benchmarks.",
    highlight1Title: "Artisan Quality",
    highlight1Desc: "Handcrafted and calibrated for long-lasting perfection.",
    highlight2Title: "Sustainable Ethos",
    highlight2Desc: "Ethically sourced with mindful environmental stewardship.",
    highlight3Title: "Global Standards",
    highlight3Desc: "Precision certified and trusted by leading designers.",
    founderQuote: "True elegance lies in the intersection of authenticity and craftsmanship.",
    aboutImage: "/assets/reference/p2_1.jpg",
  },

  // 3. Finishes / Materials / Swatches Page Config
  finishesConfig: {
    title: "Finishes, Textures & Materials",
    subtitle: "Explore our rich palette of surface finishes and artisanal textures",
    items: [
      {
        name: "Polished Mirror Glaze",
        desc: "Glossy, highly reflective surface accentuating rich natural tones.",
        image: "/assets/reference/p5_1.jpg",
      },
      {
        name: "Velvet Satin Matte",
        desc: "Silky smooth satin finish with a modern tactile feel.",
        image: "/assets/reference/p5_2.jpg",
      },
      {
        name: "Handcrafted Antique Texture",
        desc: "Textured tactile grain providing an authentic heritage appearance.",
        image: "/assets/reference/p5_3.jpg",
      },
      {
        name: "Structured Architectural Finish",
        desc: "High slip-resistant rough organic texture built for heavy duty.",
        image: "/assets/reference/p5_4.jpg",
      },
    ],
  },

  // 4. Applications & Lifestyle Gallery Page Config
  galleryConfig: {
    title: "Applications & In-Situ Showcase",
    subtitle: "See how our collections transform spaces and elevate environments",
    items: [
      {
        title: "Residential Living & Flooring",
        desc: "Modern living environments with refined continuity.",
        image: "/assets/reference/p6_1.jpg",
      },
      {
        title: "Commercial Architecture",
        desc: "Grand lobbies and high-traffic institutional installations.",
        image: "/assets/reference/p6_2.jpg",
      },
      {
        title: "Bespoke Wall Cladding & Accents",
        desc: "Architectural vertical accents and exterior facades.",
        image: "/assets/reference/p6_3.jpg",
      },
      {
        title: "Outdoor Landscapes & Terraces",
        desc: "Weather-resistant, enduring stone pavements and garden pathways.",
        image: "/assets/reference/p6_4.jpg",
      },
    ],
  },

  // 5. Back Cover & QR Hub Config
  backCoverConfig: {
    title: "GET IN TOUCH",
    subtitle: "CONTACT US",
    tagline:
      "Access real-time slab inventory, custom designs, architectural spec sheets & direct enquiry portal.",
    ctaBadge: "✦ OFFICIAL DIGITAL SHOWCASE & REAL-TIME CATALOGUE ✦",
  },
};

export const PRESET_CONFIG_MAP = {
  supreme_architectural: {
    primaryColor: "#4E5C43",
    secondaryColor: "#1C1917",
    accentColor: "#C5A059",
    pageBg: "#F5F6F0",
    cardBg: "#FFFFFF",
    textColor: "#1C1917",
    cardBorderColor: "#4E5C4340",
    layoutMode: "grid_2",
    imageRatio: "4:5",
    cardRadius: 8,
    cardShadow: "soft",
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Inter', sans-serif",
    decorativeFrame: "none",
    headerStyle: "centered_luxe",
    pageStructure: {
      showCoverPage: true,
      showAboutPage: true,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: true,
      showBackCoverPage: true,
    },
  },
  canva_vogue_luxe: {
    primaryColor: "#D4AF37",
    secondaryColor: "#1A1715",
    accentColor: "#C5A059",
    pageBg: "#FAF8F5",
    cardBg: "#FFFFFF",
    textColor: "#1A1715",
    cardBorderColor: "#D4AF37",
    layoutMode: "grid_2",
    imageRatio: "4:5",
    cardRadius: 4,
    cardShadow: "subtle",
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Playfair Display', Georgia, serif",
    headingLetterSpacing: "0.12em",
    headingTransform: "uppercase",
    decorativeFrame: "gold_double",
    headerStyle: "centered_luxe",
    coverConfig: {
      title: "",
      subtitle: "Bespoke Luxury Autumn / Spring Collection",
      edition: "HAUTE LUXURY EDITION",
      badgeText: "✦ PRIVATE CLIENT SHOWCASE ✦",
      coverImage: "/assets/reference/p1_1.jpg",
      style: "editorial_hero",
    },
    pageStructure: {
      showCoverPage: true,
      showAboutPage: true,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: true,
      showBackCoverPage: true,
    },
  },
  canva_neon_pop: {
    primaryColor: "#00DFD8",
    secondaryColor: "#7928CA",
    accentColor: "#FF0080",
    pageBg: "#0D1117",
    cardBg: "#161B22",
    textColor: "#F0F6FC",
    cardBorderColor: "#7928CA80",
    layoutMode: "grid_3",
    imageRatio: "1:1",
    cardRadius: 14,
    cardShadow: "glow",
    headingFont: "'Montserrat', sans-serif",
    bodyFont: "'Inter', sans-serif",
    headingLetterSpacing: "0.04em",
    headingTransform: "uppercase",
    decorativeFrame: "cyber_hud",
    headerStyle: "bold_contrast",
    coverConfig: {
      title: "",
      subtitle: "Limited Drop • Cyber Streetwear & Modern Goods",
      edition: "DROP 01 // 2026 EDITION",
      badgeText: "⚡ LIMITED RELEASE",
      coverImage: "/assets/reference/p1_1.jpg",
      style: "bold_block",
    },
    pageStructure: {
      showCoverPage: true,
      showAboutPage: false,
      showFinishesPage: false,
      showProductsPage: true,
      showGalleryPage: true,
      showBackCoverPage: true,
    },
  },
  canva_corporate_blue: {
    primaryColor: "#0066CC",
    secondaryColor: "#0A2540",
    accentColor: "#10B981",
    pageBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textColor: "#0A2540",
    cardBorderColor: "#CBD5E1",
    layoutMode: "list_table",
    imageRatio: "1:1",
    cardRadius: 8,
    cardShadow: "subtle",
    headingFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    headingLetterSpacing: "normal",
    headingTransform: "none",
    decorativeFrame: "minimal_clean",
    headerStyle: "clean_strip",
    coverConfig: {
      title: "",
      subtitle: "Annual Institutional Master Catalogue",
      edition: "COMMERCIAL B2B SPECIFICATIONS",
      badgeText: "VERIFIED WHOLESALE",
      coverImage: "/assets/reference/p1_1.jpg",
      style: "split_screen",
    },
    pageStructure: {
      showCoverPage: true,
      showAboutPage: true,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: false,
      showBackCoverPage: true,
    },
  },
  canva_botanical_eco: {
    primaryColor: "#2E4F3E",
    secondaryColor: "#1F362A",
    accentColor: "#C86A4B",
    pageBg: "#F7F4EE",
    cardBg: "#FFFFFF",
    textColor: "#2E4F3E",
    cardBorderColor: "#C86A4B60",
    layoutMode: "grid_2",
    imageRatio: "4:5",
    cardRadius: 16,
    cardShadow: "soft",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Inter', sans-serif",
    headingLetterSpacing: "0.08em",
    headingTransform: "uppercase",
    decorativeFrame: "artisan_arch",
    headerStyle: "centered_luxe",
    coverConfig: {
      title: "",
      subtitle: "The Sustainable, Earthy & Organic Collection",
      edition: "BOTANICAL HARVEST 2026",
      badgeText: "🌿 HANDCRAFTED ARTISAN",
      coverImage: "/assets/reference/p1_1.jpg",
      style: "minimal_frame",
    },
    pageStructure: {
      showCoverPage: true,
      showAboutPage: true,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: true,
      showBackCoverPage: true,
    },
  },
  canva_cyber_tech: {
    primaryColor: "#00E5FF",
    secondaryColor: "#12161F",
    accentColor: "#F59E0B",
    pageBg: "#12161F",
    cardBg: "#1E2538",
    textColor: "#E2E8F0",
    cardBorderColor: "#00E5FF80",
    layoutMode: "grid_3",
    imageRatio: "16:9",
    cardRadius: 6,
    cardShadow: "glow",
    headingFont: "'JetBrains Mono', monospace",
    bodyFont: "'JetBrains Mono', monospace",
    headingLetterSpacing: "0.05em",
    headingTransform: "uppercase",
    decorativeFrame: "cyber_hud",
    headerStyle: "minimal_left",
    pageStructure: {
      showCoverPage: true,
      showAboutPage: false,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: false,
      showBackCoverPage: true,
    },
  },
};

export const HARMONIOUS_PALETTES = [
  {
    name: "Luxe Gold & Champagne",
    primary: "#D4AF37",
    secondary: "#1A1715",
    accent: "#C5A059",
    pageBg: "#FAF8F5",
    cardBg: "#FFFFFF",
    textColor: "#1A1715",
  },
  {
    name: "Modern Indigo & Pink",
    primary: "#4338CA",
    secondary: "#0F172A",
    accent: "#EC4899",
    pageBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textColor: "#0F172A",
  },
  {
    name: "Cyber Neon Obsidian",
    primary: "#00DFD8",
    secondary: "#7928CA",
    accent: "#FF0080",
    pageBg: "#0D1117",
    cardBg: "#161B22",
    textColor: "#F0F6FC",
  },
  {
    name: "Emerald Green & Amber",
    primary: "#047857",
    secondary: "#064E3B",
    accent: "#F59E0B",
    pageBg: "#F0FDF4",
    cardBg: "#FFFFFF",
    textColor: "#064E3B",
  },
  {
    name: "Corporate Executive Navy",
    primary: "#0066CC",
    secondary: "#0A2540",
    accent: "#10B981",
    pageBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textColor: "#0A2540",
  },
  {
    name: "Artisan Terracotta & Linen",
    primary: "#92400E",
    secondary: "#2E4F3E",
    accent: "#C86A4B",
    pageBg: "#F7F4EE",
    cardBg: "#FFFFFF",
    textColor: "#2E4F3E",
  },
  {
    name: "Monochrome Slate Minimal",
    primary: "#2563EB",
    secondary: "#1E293B",
    accent: "#64748B",
    pageBg: "#FFFFFF",
    cardBg: "#F8FAFC",
    textColor: "#0F172A",
  },
];

export const FONT_OPTIONS = [
  { id: "'Inter', sans-serif", label: "Inter (Modern Tech Sans)", family: "'Inter', sans-serif" },
  { id: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta (Clean Corporate)", family: "'Plus Jakarta Sans', sans-serif" },
  { id: "'Outfit', sans-serif", label: "Outfit (Trendy D2C Display)", family: "'Outfit', sans-serif" },
  { id: "'Playfair Display', Georgia, serif", label: "Playfair Display (Luxury Editorial)", family: "'Playfair Display', Georgia, serif" },
  { id: "'Cinzel', serif", label: "Cinzel (Artisan Classical)", family: "'Cinzel', serif" },
  { id: "'Montserrat', sans-serif", label: "Montserrat (Bold Geometric)", family: "'Montserrat', sans-serif" },
  { id: "'JetBrains Mono', monospace", label: "JetBrains Mono (Technical Spec)", family: "'JetBrains Mono', monospace" },
];

export default function TemplateDesignStudio({
  designConfig = {},
  setDesignConfig,
  templateId,
  setTemplateId,
  presetTemplates = [],
  customTemplates = [],
  onSaveCustomTemplate,
  onDeleteCustomTemplate,
  currentCompany = {},
}) {
  const [activeTab, setActiveTab] = useState("pages");
  const [activePageSection, setActivePageSection] = useState("cover");
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const updateField = (key, value) => {
    setDesignConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (section, key, value) => {
    setDesignConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const togglePage = (pageKey) => {
    setDesignConfig((prev) => ({
      ...prev,
      pageStructure: {
        ...(prev.pageStructure || DEFAULT_DESIGN_CONFIG.pageStructure),
        [pageKey]: !prev.pageStructure?.[pageKey],
      },
    }));
  };

  const handleApplyPalette = (palette) => {
    setDesignConfig((prev) => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      pageBg: palette.pageBg,
      cardBg: palette.cardBg,
      textColor: palette.textColor,
    }));
  };

  const handleExtractBrandColors = () => {
    if (currentCompany?.brandColors) {
      setDesignConfig((prev) => ({
        ...prev,
        primaryColor: currentCompany.brandColors.primary || prev.primaryColor,
        secondaryColor: currentCompany.brandColors.secondary || prev.secondaryColor,
        accentColor: currentCompany.brandColors.accent || prev.accentColor,
      }));
    }
  };

  // Finishes List Management
  const currentFinishes = designConfig.finishesConfig?.items || DEFAULT_DESIGN_CONFIG.finishesConfig.items;

  const updateFinishItem = (index, field, value) => {
    const updated = [...currentFinishes];
    updated[index] = { ...updated[index], [field]: value };
    updateNestedField("finishesConfig", "items", updated);
  };

  const addFinishItem = () => {
    const updated = [
      ...currentFinishes,
      {
        name: "New Finish / Material",
        desc: "Custom texture description and characteristics.",
        image: "/assets/reference/p5_1.jpg",
      },
    ];
    updateNestedField("finishesConfig", "items", updated);
  };

  const removeFinishItem = (index) => {
    const updated = currentFinishes.filter((_, i) => i !== index);
    updateNestedField("finishesConfig", "items", updated);
  };

  const handleSaveModalSubmit = (e) => {
    e.preventDefault();
    if (!templateNameInput.trim()) return;
    onSaveCustomTemplate(templateNameInput.trim(), designConfig);
    setTemplateNameInput("");
    setIsModalOpen(false);
    setSaveSuccessMsg(`Custom Version "${templateNameInput.trim()}" saved with full pages & styling!`);
    setTimeout(() => setSaveSuccessMsg(""), 4500);
  };

  const pageStructure = designConfig.pageStructure || DEFAULT_DESIGN_CONFIG.pageStructure;
  const coverConfig = designConfig.coverConfig || DEFAULT_DESIGN_CONFIG.coverConfig;
  const aboutConfig = designConfig.aboutConfig || DEFAULT_DESIGN_CONFIG.aboutConfig;
  const finishesConfig = designConfig.finishesConfig || DEFAULT_DESIGN_CONFIG.finishesConfig;
  const galleryConfig = designConfig.galleryConfig || DEFAULT_DESIGN_CONFIG.galleryConfig;
  const backCoverConfig = designConfig.backCoverConfig || DEFAULT_DESIGN_CONFIG.backCoverConfig;

  return (
    <div
      className="card no-print"
      style={{
        marginBottom: "1.25rem",
        padding: "1.25rem",
        background: "var(--bg-card)",
        border: "1.5px solid var(--border-medium)",
        boxShadow: "var(--shadow-md)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Studio Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          paddingBottom: isOpen ? "1rem" : 0,
          borderBottom: isOpen ? "1px solid var(--border-subtle)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(67, 56, 202, 0.35)",
            }}
          >
            <Sliders size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                Multi-Page Template Studio &amp; Custom Version Builder
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  fontWeight: 800,
                  border: "1px solid var(--border-medium)",
                }}
              >
                Full Multi-Page Engine
              </span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Build whole custom versions: edit individual pages (Cover, About, Finishes, Specs, Back Cover), custom fonts, layout densities &amp; save your signature editions.
            </div>
          </div>
        </div>

        {/* Global Toolbar Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleExtractBrandColors}
            title={`Extract ${currentCompany?.name || "Company"}'s brand colors`}
            style={{ fontSize: "0.78rem" }}
          >
            <Sparkles size={13} color="var(--primary)" /> Sync Company Colors
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
            style={{ fontWeight: 800, fontSize: "0.78rem", background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)" }}
          >
            <Save size={13} /> Save as Custom Version
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsOpen(!isOpen)}
            style={{ padding: "4px 8px" }}
            title={isOpen ? "Collapse Design Studio" : "Expand Design Studio"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.6rem 1rem",
            background: "var(--success-bg)",
            color: "var(--success)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(4, 120, 87, 0.3)",
            fontSize: "0.84rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle size={16} /> {saveSuccessMsg}
        </div>
      )}

      {/* Expanded Designer Workbench */}
      {isOpen && (
        <div style={{ marginTop: "1rem" }}>
          {/* Sub-Tabs Navigation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
              gap: "4px",
              padding: "4px",
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "1.25rem",
            }}
          >
            {[
              { id: "pages", label: "📖 Pages & Structure", icon: FileText },
              { id: "typography", label: "🔤 Fonts & Accents", icon: Type },
              { id: "colors", label: "🎨 Colors & Theme", icon: Palette },
              { id: "layout", label: "📐 Layout & Grid", icon: Layout },
              { id: "fields", label: "🏷️ Card & Fields", icon: Tag },
              { id: "custom", label: `✨ My Versions (${customTemplates.length})`, icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "8px 10px",
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 800 : 600,
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: PAGES & STRUCTURE (Full Page Builder)                               */}
          {/* ========================================================================= */}
          {activeTab === "pages" && (
            <div>
              {/* Master Page Switcher Pills */}
              <div style={{ background: "var(--bg-surface-elevated)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-medium)", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  Catalogue Page Architecture (Toggle Pages to Include in PDF Export):
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem" }}>
                  {[
                    { key: "showCoverPage", label: "1. Front Cover Page", pageId: "cover" },
                    { key: "showAboutPage", label: "2. About & Brand Story", pageId: "about" },
                    { key: "showFinishesPage", label: "3. Finishes & Swatches", pageId: "finishes" },
                    { key: "showProductsPage", label: "4. Products Grid / Matrix", pageId: "products" },
                    { key: "showGalleryPage", label: "5. Lifestyle / Gallery", pageId: "gallery" },
                    { key: "showBackCoverPage", label: "6. Back Cover & QRs", pageId: "backcover" },
                  ].map((p) => {
                    const isIncluded = Boolean(pageStructure[p.key]);
                    return (
                      <div
                        key={p.key}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: isIncluded ? "var(--primary-light)" : "var(--bg-surface)",
                          border: isIncluded ? "1.5px solid var(--primary)" : "1px solid var(--border-medium)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                        onClick={() => togglePage(p.key)}
                      >
                        <span style={{ fontSize: "0.80rem", fontWeight: 800, color: isIncluded ? "var(--primary)" : "var(--text-secondary)" }}>
                          {p.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => {}}
                          style={{ accentColor: "var(--primary)", transform: "scale(1.15)" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Page Editor Selector */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", overflowX: "auto", paddingBottom: "4px" }}>
                {[
                  { id: "cover", label: "Edit Cover Page" },
                  { id: "about", label: "Edit About Story Page" },
                  { id: "finishes", label: "Edit Finishes & Swatches" },
                  { id: "gallery", label: "Edit In-Situ Gallery" },
                  { id: "backcover", label: "Edit Back Cover & Contact" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActivePageSection(sec.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "0.80rem",
                      fontWeight: activePageSection === sec.id ? 800 : 600,
                      background: activePageSection === sec.id ? "var(--primary)" : "var(--bg-surface-elevated)",
                      color: activePageSection === sec.id ? "#ffffff" : "var(--text-secondary)",
                      border: activePageSection === sec.id ? "1px solid var(--primary)" : "1px solid var(--border-medium)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* 1. COVER PAGE EDITOR */}
              {activePageSection === "cover" && (
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <BookOpen size={16} color="var(--primary)" /> Cover Page Customization:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Cover Main Title (Defaults to {currentCompany.name}):
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={currentCompany.name || "Brand Name"}
                        value={coverConfig.title}
                        onChange={(e) => updateNestedField("coverConfig", "title", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Cover Subtitle / Tagline:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={currentCompany.tagline || "Brand Tagline"}
                        value={coverConfig.subtitle}
                        onChange={(e) => updateNestedField("coverConfig", "subtitle", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Edition / Season Label:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={coverConfig.edition}
                        onChange={(e) => updateNestedField("coverConfig", "edition", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Top Ribbon / Badge Text:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={coverConfig.badgeText}
                        onChange={(e) => updateNestedField("coverConfig", "badgeText", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Cover Layout Style:
                      </label>
                      <select
                        className="input-field"
                        value={coverConfig.style}
                        onChange={(e) => updateNestedField("coverConfig", "style", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      >
                        <option value="editorial_hero">Editorial Hero (Full bleed photo)</option>
                        <option value="minimal_frame">Minimalist Framed Crest</option>
                        <option value="split_screen">Split Screen Architectural</option>
                        <option value="bold_block">Bold Contemporary Block</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Cover Hero Image URL:
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={coverConfig.coverImage}
                      onChange={(e) => updateNestedField("coverConfig", "coverImage", e.target.value)}
                      style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      placeholder="/assets/reference/p1_1.jpg or web image url"
                    />
                  </div>
                </div>
              )}

              {/* 2. ABOUT US PAGE EDITOR */}
              {activePageSection === "about" && (
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Edit3 size={16} color="var(--primary)" /> Brand Story &amp; Heritage Page Editor:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Section Heading:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={aboutConfig.title}
                        onChange={(e) => updateNestedField("aboutConfig", "title", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Section Subtitle:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={aboutConfig.subtitle}
                        onChange={(e) => updateNestedField("aboutConfig", "subtitle", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Brand Narrative &amp; Craft Story:
                    </label>
                    <textarea
                      rows={3}
                      className="input-field"
                      value={aboutConfig.content}
                      onChange={(e) => updateNestedField("aboutConfig", "content", e.target.value)}
                      style={{ padding: "8px 10px", fontSize: "0.85rem", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ background: "var(--bg-surface-elevated)", padding: "8px", borderRadius: "6px" }}>
                      <input
                        type="text"
                        className="input-field"
                        value={aboutConfig.highlight1Title}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight1Title", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.80rem", fontWeight: 800, marginBottom: "4px" }}
                      />
                      <textarea
                        rows={2}
                        className="input-field"
                        value={aboutConfig.highlight1Desc}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight1Desc", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div style={{ background: "var(--bg-surface-elevated)", padding: "8px", borderRadius: "6px" }}>
                      <input
                        type="text"
                        className="input-field"
                        value={aboutConfig.highlight2Title}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight2Title", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.80rem", fontWeight: 800, marginBottom: "4px" }}
                      />
                      <textarea
                        rows={2}
                        className="input-field"
                        value={aboutConfig.highlight2Desc}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight2Desc", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div style={{ background: "var(--bg-surface-elevated)", padding: "8px", borderRadius: "6px" }}>
                      <input
                        type="text"
                        className="input-field"
                        value={aboutConfig.highlight3Title}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight3Title", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.80rem", fontWeight: 800, marginBottom: "4px" }}
                      />
                      <textarea
                        rows={2}
                        className="input-field"
                        value={aboutConfig.highlight3Desc}
                        onChange={(e) => updateNestedField("aboutConfig", "highlight3Desc", e.target.value)}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Founder / Philosophy Quote:
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={aboutConfig.founderQuote}
                      onChange={(e) => updateNestedField("aboutConfig", "founderQuote", e.target.value)}
                      style={{ padding: "7px 10px", fontSize: "0.85rem", fontStyle: "italic" }}
                    />
                  </div>
                </div>
              )}

              {/* 3. FINISHES & MATERIALS SWATCHES EDITOR */}
              {activePageSection === "finishes" && (
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Grid size={16} color="var(--primary)" /> Finishes, Swatches &amp; Materials Editor ({currentFinishes.length} items):
                    </div>
                    <button
                      type="button"
                      onClick={addFinishItem}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: "0.78rem", fontWeight: 700 }}
                    >
                      <Plus size={13} /> + Add Material / Texture
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Page Title:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={finishesConfig.title}
                        onChange={(e) => updateNestedField("finishesConfig", "title", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Page Subtitle:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={finishesConfig.subtitle}
                        onChange={(e) => updateNestedField("finishesConfig", "subtitle", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
                    {currentFinishes.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "var(--bg-surface-elevated)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border-medium)",
                          position: "relative",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => removeFinishItem(idx)}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>

                        <div style={{ fontWeight: 800, fontSize: "0.76rem", color: "var(--primary)", marginBottom: "4px" }}>
                          Finish #{idx + 1}
                        </div>

                        <input
                          type="text"
                          className="input-field"
                          placeholder="Finish / Texture Name"
                          value={item.name}
                          onChange={(e) => updateFinishItem(idx, "name", e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "0.82rem", fontWeight: 700, marginBottom: "4px", width: "88%" }}
                        />

                        <input
                          type="text"
                          className="input-field"
                          placeholder="Image URL"
                          value={item.image}
                          onChange={(e) => updateFinishItem(idx, "image", e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "0.75rem", marginBottom: "4px" }}
                        />

                        <textarea
                          rows={2}
                          className="input-field"
                          placeholder="Description"
                          value={item.desc}
                          onChange={(e) => updateFinishItem(idx, "desc", e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. GALLERY / IN-SITU EDITOR */}
              {activePageSection === "gallery" && (
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Image size={16} color="var(--primary)" /> Lifestyle &amp; Applications Gallery Editor:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Gallery Page Title:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={galleryConfig.title}
                        onChange={(e) => updateNestedField("galleryConfig", "title", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Gallery Subtitle:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={galleryConfig.subtitle}
                        onChange={(e) => updateNestedField("galleryConfig", "subtitle", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
                    {(galleryConfig.items || []).map((item, idx) => (
                      <div key={idx} style={{ background: "var(--bg-surface-elevated)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-medium)" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.76rem", color: "var(--primary)", marginBottom: "4px" }}>
                          Application #{idx + 1}
                        </div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...galleryConfig.items];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateNestedField("galleryConfig", "items", updated);
                          }}
                          style={{ padding: "4px 8px", fontSize: "0.82rem", fontWeight: 700, marginBottom: "4px" }}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Image URL"
                          value={item.image}
                          onChange={(e) => {
                            const updated = [...galleryConfig.items];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            updateNestedField("galleryConfig", "items", updated);
                          }}
                          style={{ padding: "4px 8px", fontSize: "0.75rem", marginBottom: "4px" }}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Description / Caption"
                          value={item.desc}
                          onChange={(e) => {
                            const updated = [...galleryConfig.items];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            updateNestedField("galleryConfig", "items", updated);
                          }}
                          style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. BACK COVER & CONTACT EDITOR */}
              {activePageSection === "backcover" && (
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <QrCode size={16} color="var(--primary)" /> Back Cover &amp; QR Hub Editor:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Back Cover Title:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={backCoverConfig.title}
                        onChange={(e) => updateNestedField("backCoverConfig", "title", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Back Cover Subtitle:
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={backCoverConfig.subtitle}
                        onChange={(e) => updateNestedField("backCoverConfig", "subtitle", e.target.value)}
                        style={{ padding: "7px 10px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Closing Call-to-Action Note:
                    </label>
                    <textarea
                      rows={2}
                      className="input-field"
                      value={backCoverConfig.tagline}
                      onChange={(e) => updateNestedField("backCoverConfig", "tagline", e.target.value)}
                      style={{ padding: "7px 10px", fontSize: "0.85rem", resize: "vertical" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FONTS & ACCENTS                                                    */}
          {/* ========================================================================= */}
          {activeTab === "typography" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                {/* Heading Font */}
                <div style={{ background: "var(--bg-surface-elevated)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                    Primary Heading Font:
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateField("headingFont", f.family)}
                        className={`btn btn-sm ${designConfig.headingFont === f.family ? "btn-primary" : "btn-outline"}`}
                        style={{ fontFamily: f.family, justifyContent: "flex-start", padding: "6px 12px", fontSize: "0.86rem" }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Font */}
                <div style={{ background: "var(--bg-surface-elevated)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                    Body Text &amp; Specifications Font:
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateField("bodyFont", f.family)}
                        className={`btn btn-sm ${designConfig.bodyFont === f.family ? "btn-primary" : "btn-outline"}`}
                        style={{ fontFamily: f.family, justifyContent: "flex-start", padding: "6px 12px", fontSize: "0.86rem" }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Frame, Letter Spacing & Watermark */}
              <div style={{ background: "var(--bg-surface-elevated)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Heading Letter Spacing:
                  </label>
                  <select
                    className="input-field"
                    value={designConfig.headingLetterSpacing || "normal"}
                    onChange={(e) => updateField("headingLetterSpacing", e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                  >
                    <option value="normal">Normal (0em)</option>
                    <option value="0.04em">Editorial Wide (0.04em)</option>
                    <option value="0.12em">Luxe Spaced (0.12em)</option>
                    <option value="0.22em">Ultra Spaced Vogue (0.22em)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Heading Text Transform:
                  </label>
                  <select
                    className="input-field"
                    value={designConfig.headingTransform || "none"}
                    onChange={(e) => updateField("headingTransform", e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                  >
                    <option value="none">Default As Typed</option>
                    <option value="uppercase">ALL UPPERCASE (Bold Impact)</option>
                    <option value="capitalize">Capitalize Each Word</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Decorative Border Accents:
                  </label>
                  <select
                    className="input-field"
                    value={designConfig.decorativeFrame || "none"}
                    onChange={(e) => updateField("decorativeFrame", e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                  >
                    <option value="none">None (Clean Modern Edge)</option>
                    <option value="gold_double">Double Gold Luxe Border</option>
                    <option value="minimal_clean">Architectural Fine Border</option>
                    <option value="cyber_hud">Cyber Tech HUD Reticle</option>
                    <option value="artisan_arch">Artisan Arched Frame</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: COLORS & THEMES                                                    */}
          {/* ========================================================================= */}
          {activeTab === "colors" && (
            <div>
              {/* 1-Click Harmonious Palettes */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  1-Click Curated Color Themes:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem" }}>
                  {HARMONIOUS_PALETTES.map((pal) => (
                    <div
                      key={pal.name}
                      onClick={() => handleApplyPalette(pal)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-medium)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pal.name}
                      </span>
                      <div style={{ display: "flex", gap: "3px", flexShrink: 0, marginLeft: "6px" }}>
                        {[pal.primary, pal.accent, pal.pageBg, pal.textColor].map((c, i) => (
                          <span
                            key={i}
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: c,
                              border: "1px solid rgba(0,0,0,0.15)",
                              display: "inline-block",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Hex & Color Pickers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Primary Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.primaryColor || "#4E5C43"}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.primaryColor || ""}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Accent / Badge Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.accentColor || "#C5A059"}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.accentColor || ""}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Canvas Page Background:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.pageBg || "#F5F6F0"}
                      onChange={(e) => updateField("pageBg", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.pageBg || ""}
                      onChange={(e) => updateField("pageBg", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Card Surface Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.cardBg || "#FFFFFF"}
                      onChange={(e) => updateField("cardBg", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.cardBg || ""}
                      onChange={(e) => updateField("cardBg", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Main Text Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.textColor || "#1C1917"}
                      onChange={(e) => updateField("textColor", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.textColor || ""}
                      onChange={(e) => updateField("textColor", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                    Card Border Line Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={designConfig.cardBorderColor || "#E2E8F0"}
                      onChange={(e) => updateField("cardBorderColor", e.target.value)}
                      style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={designConfig.cardBorderColor || ""}
                      onChange={(e) => updateField("cardBorderColor", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: "0.82rem", fontFamily: "monospace" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: LAYOUT & DENSITY                                                   */}
          {/* ========================================================================= */}
          {activeTab === "layout" && (
            <div>
              {/* Product Grid Columns */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  Product Grid Density &amp; Layout Columns:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
                  {[
                    { id: "grid_1", label: "1-Col Hero Showcase", desc: "Large hero photo & specs", icon: Square },
                    { id: "grid_2", label: "2-Col Editorial Cards", desc: "Lookbook balanced cards", icon: Columns },
                    { id: "grid_3", label: "3-Col Retail Storefront", desc: "Standard e-commerce density", icon: Grid },
                    { id: "grid_4", label: "4-Col Dense Master", desc: "Max products per page", icon: Layers },
                    { id: "list_table", label: "Wholesale Spec Table", desc: "Line sheet with specs & SKU", icon: List },
                  ].map((mode) => {
                    const isSelected = designConfig.layoutMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => updateField("layoutMode", mode.id)}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "var(--radius-md)",
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-medium)",
                          background: isSelected ? "var(--primary-light)" : "var(--bg-surface)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        <Icon size={18} color={isSelected ? "var(--primary)" : "var(--text-secondary)"} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.84rem", color: isSelected ? "var(--primary)" : "var(--text-primary)" }}>
                            {mode.label}
                          </div>
                          <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>{mode.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photo Aspect Ratio, Radius & Shadows */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Product Photo Aspect Ratio:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
                    {[
                      { id: "1:1", label: "1:1 Square" },
                      { id: "4:5", label: "4:5 Portrait" },
                      { id: "16:9", label: "16:9 Banner" },
                      { id: "circle", label: "Circle" },
                    ].map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => updateField("imageRatio", ratio.id)}
                        className={`btn btn-sm ${designConfig.imageRatio === ratio.id ? "btn-primary" : "btn-outline"}`}
                        style={{ padding: "5px 4px", fontSize: "0.74rem" }}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)" }}>Card Corner Radius:</label>
                    <span style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--primary)" }}>{designConfig.cardRadius ?? 10}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={designConfig.cardRadius ?? 10}
                    onChange={(e) => updateField("cardRadius", parseInt(e.target.value, 10))}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    <span>0px Sharp</span>
                    <span>8px</span>
                    <span>16px Smooth</span>
                    <span>24px Pill</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.80rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Card Shadow &amp; Depth:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
                    {[
                      { id: "none", label: "Flat" },
                      { id: "subtle", label: "Subtle" },
                      { id: "soft", label: "Floating" },
                      { id: "glow", label: "Neon Glow" },
                    ].map((shd) => (
                      <button
                        key={shd.id}
                        type="button"
                        onClick={() => updateField("cardShadow", shd.id)}
                        className={`btn btn-sm ${designConfig.cardShadow === shd.id ? "btn-primary" : "btn-outline"}`}
                        style={{ padding: "5px 4px", fontSize: "0.74rem" }}
                      >
                        {shd.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CARD & FIELDS TOGGLES                                              */}
          {/* ========================================================================= */}
          {activeTab === "fields" && (
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                Toggle Visible Product Details &amp; Commercial Badges:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
                {[
                  { key: "showPrice", label: "Selling Price Tag", desc: "Display formatted net price" },
                  { key: "showMrp", label: "MRP / Strikethrough", desc: "Show original MRP strikethrough" },
                  { key: "showSavings", label: "Savings % Pill", desc: "Display 'Save 25% OFF' badge" },
                  { key: "showSku", label: "Product SKU Code", desc: "Display reference item code" },
                  { key: "showCategory", label: "Category Tag Pill", desc: "Display category badge pill" },
                  { key: "showStockBadge", label: "Stock Status Badge", desc: "Show 'In Stock' / 'Ready to Ship'" },
                  { key: "showDescription", label: "Product Description", desc: "Show short product summary" },
                  { key: "showProductQr", label: "1-Click Product QR", desc: "Embed instant buy QR on each card" },
                ].map((item) => {
                  const isChecked = Boolean(designConfig[item.key]);
                  return (
                    <label
                      key={item.key}
                      style={{
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: isChecked ? "1.5px solid var(--primary)" : "1px solid var(--border-medium)",
                        background: isChecked ? "var(--primary-light)" : "var(--bg-surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => updateField(item.key, e.target.checked)}
                        style={{ accentColor: "var(--primary)", marginTop: "2px", transform: "scale(1.15)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.82rem", color: isChecked ? "var(--primary)" : "var(--text-primary)" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", marginTop: "1px" }}>
                          {item.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: MY CUSTOM CREATED VERSIONS                                         */}
          {/* ========================================================================= */}
          {activeTab === "custom" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Your Custom Created Designs ({customTemplates.length}):
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsModalOpen(true)}
                  style={{ fontWeight: 800, fontSize: "0.78rem" }}
                >
                  <Plus size={13} /> Save Current Setup as New Design
                </button>
              </div>

              {customTemplates.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    background: "var(--bg-surface-elevated)",
                    borderRadius: "8px",
                    border: "1px dashed var(--border-medium)",
                  }}
                >
                  <Sparkles size={24} color="var(--primary)" style={{ margin: "auto", marginBottom: "0.5rem" }} />
                  <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                    No Custom Template Versions Saved Yet
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px", maxWidth: "420px", margin: "4px auto 1rem auto" }}>
                    Customize page layouts, colors, and typography, then click "Save as Custom Version" to define your signature edition.
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Save size={14} /> Save Current Customizer Version
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                  {customTemplates.map((ct) => {
                    const isSelected = templateId === ct.id;
                    return (
                      <div
                        key={ct.id}
                        style={{
                          background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-medium)",
                          padding: "0.85rem",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                            🎨 {ct.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete template version "${ct.name}"?`)) {
                                onDeleteCustomTemplate(ct.id);
                              }
                            }}
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}
                            title="Delete template"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: "4px", marginBottom: "8px", alignItems: "center" }}>
                          {(ct.palette || []).map((col, cIdx) => (
                            <span
                              key={cIdx}
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: col,
                                border: "1px solid rgba(0,0,0,0.15)",
                                display: "inline-block",
                              }}
                            />
                          ))}
                          <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                            {ct.config?.layoutMode || "custom"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setTemplateId(ct.id)}
                          className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
                          style={{ width: "100%", fontSize: "0.76rem", fontWeight: 700 }}
                        >
                          {isSelected ? "✓ Active Template" : "Apply This Design"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SAVE CUSTOM TEMPLATE VERSION MODAL */}
      {isModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "480px",
              margin: "auto",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                <Sparkles size={18} color="var(--primary)" />
                <span>Save Full Custom Catalogue Version</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "3px 6px" }}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveModalSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Template Version Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Kota Doria Heritage Silk, Royale Gold 2026, Architectural Line"
                  value={templateNameInput}
                  onChange={(e) => setTemplateNameInput(e.target.value)}
                  style={{ paddingLeft: "0.85rem" }}
                  autoFocus
                />
              </div>

              <div style={{ background: "var(--bg-surface-elevated)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                  This will capture your complete multi-page architecture:
                </div>
                <div>• Active Pages: {[
                  pageStructure.showCoverPage && "Cover",
                  pageStructure.showAboutPage && "About",
                  pageStructure.showFinishesPage && "Finishes",
                  pageStructure.showProductsPage && "Products",
                  pageStructure.showGalleryPage && "Gallery",
                  pageStructure.showBackCoverPage && "Back Cover",
                ].filter(Boolean).join(", ")}</div>
                <div>• Heading Font: {designConfig.headingFont} • Spacing: {designConfig.headingLetterSpacing || "normal"}</div>
                <div>• Frame: {designConfig.decorativeFrame || "none"} • Layout: {designConfig.layoutMode}</div>
                <div>• Palette: {designConfig.primaryColor} / {designConfig.accentColor} / {designConfig.pageBg}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>
                  <Save size={14} /> Save Complete Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
