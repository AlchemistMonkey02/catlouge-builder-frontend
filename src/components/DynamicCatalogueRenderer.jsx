import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  ExternalLink,
  Tag,
  Shield,
  QrCode,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
  Star,
  Sparkles,
  BookOpen,
  Award,
  Layers,
} from "lucide-react";

export default function DynamicCatalogueRenderer({
  products = [],
  currentCompany = {},
  designConfig = {},
  currencySymbol = "₹",
  includeQrInCatalogue = true,
  activeQrList = [],
  qrDataUrls = {},
  qrLinks = {},
}) {
  const [productQrMap, setProductQrMap] = useState({});

  // Generate QR for each product if showProductQr is true
  useEffect(() => {
    if (!designConfig.showProductQr || products.length === 0) return;

    let isMounted = true;
    const generateProductQrs = async () => {
      const qrs = {};
      const opts = { width: 140, margin: 1, color: { dark: "#111111", light: "#FFFFFF" } };

      for (const p of products) {
        try {
          const targetUrl =
            p.customUrl ||
            `${window.location.origin}/companies/${currentCompany._id || "view"}/catalogue?sku=${encodeURIComponent(p.sku || p._id)}`;
          const dataUrl = await QRCode.toDataURL(targetUrl, opts);
          qrs[p._id] = dataUrl;
        } catch {
          // ignore
        }
      }
      if (isMounted) setProductQrMap(qrs);
    };

    generateProductQrs();
    return () => {
      isMounted = false;
    };
  }, [products, designConfig.showProductQr, currentCompany._id]);

  // Extract config tokens with safe fallbacks
  const {
    primaryColor = "#4E5C43",
    secondaryColor = "#1C1917",
    accentColor = "#C5A059",
    pageBg = "#F5F6F0",
    cardBg = "#FFFFFF",
    textColor = "#1C1917",
    cardBorderColor = "#E2E8F0",
    layoutMode = "grid_2",
    imageRatio = "4:5",
    cardRadius = 10,
    cardShadow = "soft",
    headingFont = "'Playfair Display', Georgia, serif",
    bodyFont = "'Inter', sans-serif",
    headingLetterSpacing = "normal",
    headingTransform = "none",
    decorativeFrame = "none",
    showPrice = true,
    showMrp = true,
    showSavings = true,
    showSku = true,
    showCategory = true,
    showStockBadge = true,
    showDescription = true,
    showProductQr = true,
    headerStyle = "modern_banner",
    pageStructure = {
      showCoverPage: true,
      showAboutPage: true,
      showFinishesPage: true,
      showProductsPage: true,
      showGalleryPage: true,
      showBackCoverPage: true,
    },
    coverConfig = {},
    aboutConfig = {},
    finishesConfig = {},
    galleryConfig = {},
    backCoverConfig = {},
  } = designConfig;

  // Compute shadow style
  const getShadowCss = () => {
    switch (cardShadow) {
      case "none":
        return "none";
      case "subtle":
        return "0 2px 8px rgba(0,0,0,0.06)";
      case "soft":
        return "0 10px 25px rgba(0,0,0,0.08)";
      case "floating":
        return "0 20px 40px rgba(0,0,0,0.16)";
      case "glow":
        return `0 0 25px ${primaryColor}40`;
      default:
        return "0 4px 15px rgba(0,0,0,0.08)";
    }
  };

  // Image container styling
  const getImageContainerStyle = (isList = false) => {
    if (isList) {
      return {
        width: "90px",
        height: "90px",
        borderRadius: `${Math.min(cardRadius, 8)}px`,
        overflow: "hidden",
        flexShrink: 0,
      };
    }

    let height = "260px";
    let borderRadius = `${Math.min(cardRadius, 12)}px`;

    if (imageRatio === "4:5") {
      height = "320px";
    } else if (imageRatio === "16:9") {
      height = "210px";
    } else if (imageRatio === "circle") {
      height = "200px";
      borderRadius = "50%";
    }

    return {
      width: "100%",
      height,
      borderRadius,
      overflow: "hidden",
      position: "relative",
      background: "#f1f5f9",
    };
  };

  // Grid columns based on layoutMode
  const getGridColumns = () => {
    switch (layoutMode) {
      case "grid_1":
        return "1fr";
      case "grid_2":
        return "repeat(2, 1fr)";
      case "grid_3":
        return "repeat(3, 1fr)";
      case "grid_4":
        return "repeat(4, 1fr)";
      default:
        return "repeat(2, 1fr)";
    }
  };

  // Compute decorative frame border style
  const getDecorativeFrameStyle = () => {
    switch (decorativeFrame) {
      case "gold_double":
        return {
          border: `3px double ${accentColor}`,
          boxShadow: `inset 0 0 0 6px ${pageBg}, inset 0 0 0 7px ${accentColor}`,
        };
      case "minimal_clean":
        return {
          border: `1.5px solid ${cardBorderColor}`,
        };
      case "cyber_hud":
        return {
          border: `2px solid ${primaryColor}`,
          boxShadow: `0 0 20px ${primaryColor}30`,
        };
      case "artisan_arch":
        return {
          border: `2px solid ${accentColor}`,
          borderRadius: "16px",
        };
      default:
        return {};
    }
  };

  const pageContainerBaseStyle = {
    background: pageBg,
    color: textColor,
    fontFamily: bodyFont,
    minHeight: "1050px",
    padding: "3rem",
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    pageBreakAfter: "always",
    breakAfter: "page",
    borderBottom: `2px dashed ${cardBorderColor}`,
    ...getDecorativeFrameStyle(),
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* PAGE 1: FRONT COVER PAGE (If Enabled)                                     */}
      {/* ========================================================================= */}
      {pageStructure.showCoverPage && (
        <div style={pageContainerBaseStyle}>
          {/* Cover Header Strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${accentColor}`, paddingBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {currentCompany.logoUrl ? (
                <img
                  src={currentCompany.logoUrl}
                  alt={currentCompany.name}
                  style={{ height: "45px", objectFit: "contain", background: "#ffffff", padding: "4px", borderRadius: "6px" }}
                />
              ) : (
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: primaryColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                  {(currentCompany.name || "CO").substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: primaryColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {currentCompany.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: textColor, opacity: 0.75 }}>
                  {currentCompany.industry || "Signature Brand Portfolio"}
                </div>
              </div>
            </div>

            <div style={{ background: primaryColor, color: "#ffffff", padding: "4px 14px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {coverConfig.badgeText || "OFFICIAL CATALOGUE"}
            </div>
          </div>

          {/* Cover Hero Body */}
          <div style={{ margin: "2.5rem 0", textAlign: coverConfig.style === "minimal_frame" ? "center" : "left" }}>
            {coverConfig.style === "split_screen" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "center" }}>
                <div style={{ borderRadius: `${cardRadius}px`, overflow: "hidden", height: "480px", border: `2px solid ${accentColor}`, boxShadow: getShadowCss() }}>
                  <img
                    src={coverConfig.coverImage || "/assets/reference/p1_1.jpg"}
                    alt="Cover Hero"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: accentColor, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    ✦ {coverConfig.edition || "2026 SIGNATURE COLLECTION"} ✦
                  </div>
                  <h1
                    style={{
                      fontFamily: headingFont,
                      fontSize: "3.2rem",
                      fontWeight: 900,
                      color: primaryColor,
                      lineHeight: 1.1,
                      letterSpacing: headingLetterSpacing,
                      textTransform: headingTransform,
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {coverConfig.title || currentCompany.name}
                  </h1>
                  <p style={{ fontSize: "1.15rem", color: textColor, opacity: 0.85, lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                    {coverConfig.subtitle || currentCompany.tagline}
                  </p>
                  <div style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: "1rem", fontSize: "0.85rem", color: textColor, opacity: 0.8 }}>
                    Architectural catalogue, material specifications &amp; trade edition.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: `1.5px solid ${accentColor}`, padding: "4px 18px", borderRadius: "30px", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.18em", color: accentColor, textTransform: "uppercase", background: cardBg, marginBottom: "1rem" }}>
                    ✦ {coverConfig.edition || "2026 SIGNATURE COLLECTION"} ✦
                  </div>
                  <h1
                    style={{
                      fontFamily: headingFont,
                      fontSize: "3.5rem",
                      fontWeight: 900,
                      color: primaryColor,
                      lineHeight: 1.12,
                      letterSpacing: headingLetterSpacing,
                      textTransform: headingTransform,
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    {coverConfig.title || currentCompany.name}
                  </h1>
                  <p style={{ fontSize: "1.2rem", color: textColor, opacity: 0.85, maxWidth: "680px", margin: "0 auto", fontStyle: "italic" }}>
                    "{coverConfig.subtitle || currentCompany.tagline}"
                  </p>
                </div>

                <div style={{ width: "100%", height: "460px", borderRadius: `${cardRadius}px`, overflow: "hidden", border: `2px solid ${cardBorderColor}`, boxShadow: getShadowCss(), position: "relative" }}>
                  <img
                    src={coverConfig.coverImage || "/assets/reference/p1_1.jpg"}
                    alt="Cover Showcase"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", padding: "2rem", color: "#ffffff" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: accentColor }}>
                      CERTIFIED SPECIFICATIONS &amp; MASTER ARCHIVE
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "2px" }}>
                      Curated For Leading Architects, Designers &amp; Trade Partners
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cover Footer Strip */}
          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.80rem", color: textColor, opacity: 0.8 }}>
            <span>© {new Date().getFullYear()} {currentCompany.name}. All Rights Reserved.</span>
            <span>Headquarters: {currentCompany.contact?.address || "Global Showroom"}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: ABOUT US & BRAND STORY (If Enabled)                               */}
      {/* ========================================================================= */}
      {pageStructure.showAboutPage && (
        <div style={pageContainerBaseStyle}>
          <div>
            <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: "1rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: accentColor, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  SECTION 01 // HERITAGE &amp; ETHOS
                </span>
                <h2 style={{ fontFamily: headingFont, fontSize: "2.3rem", fontWeight: 800, color: primaryColor, margin: "2px 0 0 0", letterSpacing: headingLetterSpacing }}>
                  {aboutConfig.title || "About Our Craft & Heritage"}
                </h2>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: textColor, opacity: 0.6 }}>PAGE 02</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "center", marginBottom: "2.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: primaryColor, marginBottom: "0.75rem", fontFamily: headingFont }}>
                  {aboutConfig.subtitle || "A Tradition of Excellence & Uncompromising Quality"}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: textColor, opacity: 0.9, marginBottom: "1.25rem" }}>
                  {aboutConfig.content || "We take pride in delivering premier craftsmanship and meticulously engineered products. Every piece is curated with authentic materials, master artisans, and rigorous quality benchmarks."}
                </p>

                {aboutConfig.founderQuote && (
                  <div style={{ background: cardBg, padding: "1.25rem", borderRadius: "8px", borderLeft: `4px solid ${accentColor}`, boxShadow: getShadowCss(), fontStyle: "italic", fontSize: "0.92rem", color: textColor }}>
                    "{aboutConfig.founderQuote}"
                  </div>
                )}
              </div>

              <div style={{ height: "340px", borderRadius: `${cardRadius}px`, overflow: "hidden", border: `2px solid ${cardBorderColor}`, boxShadow: getShadowCss() }}>
                <img
                  src={aboutConfig.aboutImage || "/assets/reference/p2_1.jpg"}
                  alt="About Us Heritage"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* 3 Key Pillar Highlight Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
              {[
                { title: aboutConfig.highlight1Title || "Master Craftsmanship", desc: aboutConfig.highlight1Desc || "Calibrated for long-lasting perfection.", icon: Award },
                { title: aboutConfig.highlight2Title || "Sustainable Ethos", desc: aboutConfig.highlight2Desc || "Ethically sourced with environmental care.", icon: Sparkles },
                { title: aboutConfig.highlight3Title || "Precision Verified", desc: aboutConfig.highlight3Desc || "Rigorously tested to international benchmarks.", icon: Shield },
              ].map((pil, pIdx) => {
                const Icon = pil.icon;
                return (
                  <div key={pIdx} style={{ background: cardBg, padding: "1.25rem", borderRadius: `${cardRadius}px`, border: `1.5px solid ${cardBorderColor}`, boxShadow: getShadowCss() }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${primaryColor}15`, color: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                      <Icon size={18} />
                    </div>
                    <h4 style={{ fontFamily: headingFont, fontSize: "1.05rem", fontWeight: 800, color: primaryColor, margin: "0 0 4px 0" }}>
                      {pil.title}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: textColor, opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                      {pil.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", opacity: 0.75 }}>
            <span>{currentCompany.name} • Master Catalogue</span>
            <span>Brand Heritage &amp; Quality Commitment</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: FINISHES, MATERIALS & TEXTURES (If Enabled)                       */}
      {/* ========================================================================= */}
      {pageStructure.showFinishesPage && (
        <div style={pageContainerBaseStyle}>
          <div>
            <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: "1rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: accentColor, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  SECTION 02 // SURFACES, WEAVES &amp; TEXTURES
                </span>
                <h2 style={{ fontFamily: headingFont, fontSize: "2.3rem", fontWeight: 800, color: primaryColor, margin: "2px 0 0 0", letterSpacing: headingLetterSpacing }}>
                  {finishesConfig.title || "Finishes, Textures & Materials"}
                </h2>
                <div style={{ fontSize: "0.88rem", color: textColor, opacity: 0.8, marginTop: "2px" }}>
                  {finishesConfig.subtitle || "Explore our rich palette of surface finishes and artisanal textures"}
                </div>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: textColor, opacity: 0.6 }}>PAGE 03</span>
            </div>

            {/* Finishes Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {(finishesConfig.items || []).map((fin, fIdx) => (
                <div key={fIdx} style={{ background: cardBg, borderRadius: `${cardRadius}px`, border: `1px solid ${cardBorderColor}`, overflow: "hidden", boxShadow: getShadowCss() }}>
                  <div style={{ width: "100%", height: "200px", background: "#eee", overflow: "hidden" }}>
                    <img
                      src={fin.image || "/assets/reference/p5_1.jpg"}
                      alt={fin.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1.1rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                      SPECIFICATION #{fIdx + 1}
                    </span>
                    <h4 style={{ fontFamily: headingFont, fontSize: "1.1rem", fontWeight: 800, color: primaryColor, margin: "2px 0 6px 0" }}>
                      {fin.name}
                    </h4>
                    <p style={{ fontSize: "0.80rem", color: textColor, opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                      {fin.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", opacity: 0.75 }}>
            <span>{currentCompany.name} • Surface &amp; Material Matrix</span>
            <span>Custom textures &amp; dimensions available on request</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 4+: PRODUCT CATALOGUE SHOWCASE (If Enabled)                          */}
      {/* ========================================================================= */}
      {pageStructure.showProductsPage && (
        <div style={pageContainerBaseStyle}>
          <div>
            {/* Catalogue Header Strip */}
            <div
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                color: "#ffffff",
                padding: "1.75rem 2rem",
                borderRadius: `${cardRadius}px`,
                marginBottom: "2rem",
                boxShadow: getShadowCss(),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: accentColor, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  COLLECTION INVENTORY // {products.length} CURATED ITEMS
                </div>
                <h2 style={{ fontFamily: headingFont, fontSize: "2rem", fontWeight: 900, margin: "2px 0 0 0", letterSpacing: headingLetterSpacing, textTransform: headingTransform }}>
                  {currentCompany.name} Product Portfolio
                </h2>
                <div style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "2px" }}>
                  {currentCompany.tagline}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.15)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.76rem", fontWeight: 800 }}>
                {layoutMode === "list_table" ? "Wholesale Spec Matrix" : `${layoutMode.replace("_", "-").toUpperCase()} Cards`}
              </div>
            </div>

            {/* A. WHOLESALE SPEC TABLE */}
            {layoutMode === "list_table" ? (
              <div style={{ background: cardBg, borderRadius: `${cardRadius}px`, border: `1px solid ${cardBorderColor}`, overflow: "hidden", boxShadow: getShadowCss(), marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: `${primaryColor}15`, color: primaryColor, borderBottom: `2px solid ${cardBorderColor}` }}>
                      <th style={{ padding: "12px 14px", fontWeight: 800 }}>Item</th>
                      <th style={{ padding: "12px 14px", fontWeight: 800 }}>Product Name &amp; Specs</th>
                      {showCategory && <th style={{ padding: "12px 14px", fontWeight: 800 }}>Category</th>}
                      {showSku && <th style={{ padding: "12px 14px", fontWeight: 800 }}>SKU Code</th>}
                      {showStockBadge && <th style={{ padding: "12px 14px", fontWeight: 800 }}>Stock</th>}
                      {showMrp && <th style={{ padding: "12px 14px", fontWeight: 800 }}>MRP</th>}
                      {showPrice && <th style={{ padding: "12px 14px", fontWeight: 800 }}>Trade Price</th>}
                      {showProductQr && <th style={{ padding: "12px 14px", fontWeight: 800, textAlign: "center" }}>Spec QR</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, pIdx) => {
                      const mrp = p.mrp || (p.price ? Math.round(p.price * 1.25) : 0);
                      const savings = mrp && p.price && mrp > p.price ? Math.round(((mrp - p.price) / mrp) * 100) : 0;
                      const qrData = productQrMap[p._id];

                      return (
                        <tr key={p._id} style={{ borderBottom: `1px solid ${cardBorderColor}`, background: pIdx % 2 === 0 ? "transparent" : `${primaryColor}06` }}>
                          <td style={{ padding: "10px 14px", width: "80px" }}>
                            <img src={p.image || p.imageUrl || "/assets/reference/p4_1.jpg"} alt={p.name} style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "6px" }} />
                          </td>
                          <td style={{ padding: "10px 14px", maxWidth: "260px" }}>
                            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: textColor, fontFamily: headingFont }}>{p.name}</div>
                            {showDescription && (
                              <div style={{ fontSize: "0.76rem", opacity: 0.75, marginTop: "2px", lineHeight: 1.4 }}>{p.shortDescription || p.description}</div>
                            )}
                          </td>
                          {showCategory && <td style={{ padding: "10px 14px", fontWeight: 600 }}>{p.category || "General"}</td>}
                          {showSku && (
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ background: `${primaryColor}18`, color: primaryColor, padding: "2px 8px", borderRadius: "4px", fontWeight: 800, fontSize: "0.74rem", fontFamily: "monospace" }}>
                                {p.sku || `SKU-${pIdx + 1}`}
                              </span>
                            </td>
                          )}
                          {showStockBadge && (
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "12px", fontWeight: 700, background: p.stockStatus === "Out of Stock" ? "#fee2e2" : "#dcfce7", color: p.stockStatus === "Out of Stock" ? "#b91c1c" : "#15803d" }}>
                                {p.stockStatus || "In Stock"}
                              </span>
                            </td>
                          )}
                          {showMrp && (
                            <td style={{ padding: "10px 14px", opacity: 0.6, textDecoration: "line-through", fontSize: "0.85rem" }}>
                              {mrp ? `${currencySymbol}${mrp.toLocaleString()}` : "—"}
                            </td>
                          )}
                          {showPrice && (
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ fontWeight: 900, color: primaryColor, fontSize: "1.05rem" }}>
                                {p.price ? `${currencySymbol}${p.price.toLocaleString()}` : "P.O.R."}
                              </div>
                              {showSavings && savings > 0 && (
                                <div style={{ fontSize: "0.68rem", color: accentColor, fontWeight: 800 }}>Save {savings}%</div>
                              )}
                            </td>
                          )}
                          {showProductQr && (
                            <td style={{ padding: "10px 14px", textAlign: "center" }}>
                              {qrData ? (
                                <img src={qrData} alt="Scan QR" style={{ width: "45px", height: "45px", display: "inline-block", border: `1px solid ${cardBorderColor}`, borderRadius: "4px", background: "#fff", padding: "2px" }} />
                              ) : (
                                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>QR</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* B. PRODUCT CARDS GRID */
              <div style={{ display: "grid", gridTemplateColumns: getGridColumns(), gap: "1.5rem", marginBottom: "2rem" }}>
                {products.map((p, pIdx) => {
                  const mrp = p.mrp || (p.price ? Math.round(p.price * 1.25) : 0);
                  const savings = mrp && p.price && mrp > p.price ? Math.round(((mrp - p.price) / mrp) * 100) : 0;
                  const qrData = productQrMap[p._id];

                  return (
                    <div
                      key={p._id}
                      style={{
                        background: cardBg,
                        borderRadius: `${cardRadius}px`,
                        border: `1px solid ${cardBorderColor}`,
                        boxShadow: getShadowCss(),
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={getImageContainerStyle()}>
                        <img
                          src={p.image || p.imageUrl || "/assets/reference/p4_1.jpg"}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {showSavings && savings > 0 && (
                          <span style={{ position: "absolute", top: "10px", left: "10px", background: accentColor, color: "#fff", fontWeight: 900, fontSize: "0.72rem", padding: "3px 9px", borderRadius: "16px" }}>
                            -{savings}%
                          </span>
                        )}
                        {showStockBadge && (
                          <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "0.68rem", padding: "3px 8px", borderRadius: "12px", fontWeight: 800, background: p.stockStatus === "Out of Stock" ? "rgba(185, 28, 28, 0.9)" : "rgba(21, 128, 61, 0.9)", color: "#fff" }}>
                            {p.stockStatus || "In Stock"}
                          </span>
                        )}
                      </div>

                      <div style={{ padding: "1.1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          {showCategory && (
                            <span style={{ fontSize: "0.70rem", color: accentColor, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                              {p.category || "Collection"}
                            </span>
                          )}
                          {showSku && (
                            <span style={{ fontSize: "0.70rem", color: textColor, opacity: 0.6, fontFamily: "monospace" }}>
                              {p.sku || `SKU-${pIdx + 1}`}
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontFamily: headingFont, fontSize: "1.18rem", fontWeight: 800, color: textColor, margin: "2px 0 6px 0", lineHeight: 1.3 }}>
                          {p.name}
                        </h3>

                        {showDescription && (
                          <p style={{ fontSize: "0.80rem", color: textColor, opacity: 0.8, lineHeight: 1.45, margin: "0 0 0.85rem 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.shortDescription || p.description}
                          </p>
                        )}

                        <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: `1px solid ${cardBorderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            {showPrice && (
                              <div style={{ fontWeight: 900, fontSize: "1.15rem", color: primaryColor }}>
                                {currencySymbol}{p.price ? p.price.toLocaleString() : "P.O.R."}
                              </div>
                            )}
                            {showMrp && mrp > (p.price || 0) && (
                              <div style={{ fontSize: "0.70rem", opacity: 0.5, textDecoration: "line-through" }}>
                                MRP: {currencySymbol}{mrp.toLocaleString()}
                              </div>
                            )}
                          </div>

                          {showProductQr && qrData && (
                            <div style={{ textAlign: "center", flexShrink: 0 }}>
                              <img src={qrData} alt="Product QR" style={{ width: "42px", height: "42px", background: "#ffffff", padding: "2px", borderRadius: "4px", border: `1px solid ${cardBorderColor}`, display: "block" }} />
                              <span style={{ fontSize: "0.56rem", fontWeight: 700, color: primaryColor, display: "block", marginTop: "1px" }}>SCAN</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", opacity: 0.75 }}>
            <span>{currentCompany.name} • Active Inventory</span>
            <span>Scan product QR for real-time dimension &amp; batch availability</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 5: APPLICATIONS & LIFESTYLE GALLERY (If Enabled)                     */}
      {/* ========================================================================= */}
      {pageStructure.showGalleryPage && (
        <div style={pageContainerBaseStyle}>
          <div>
            <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: "1rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: accentColor, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  SECTION 04 // IN-SITU &amp; ARCHITECTURAL APPLICATIONS
                </span>
                <h2 style={{ fontFamily: headingFont, fontSize: "2.3rem", fontWeight: 800, color: primaryColor, margin: "2px 0 0 0", letterSpacing: headingLetterSpacing }}>
                  {galleryConfig.title || "Applications & In-Situ Showcase"}
                </h2>
                <div style={{ fontSize: "0.88rem", color: textColor, opacity: 0.8, marginTop: "2px" }}>
                  {galleryConfig.subtitle || "See how our collections transform spaces and elevate environments"}
                </div>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: textColor, opacity: 0.6 }}>PAGE 05</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.75rem" }}>
              {(galleryConfig.items || []).map((item, idx) => (
                <div key={idx} style={{ background: cardBg, borderRadius: `${cardRadius}px`, border: `1px solid ${cardBorderColor}`, overflow: "hidden", boxShadow: getShadowCss() }}>
                  <div style={{ height: "230px", overflow: "hidden" }}>
                    <img src={item.image || "/assets/reference/p6_1.jpg"} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h4 style={{ fontFamily: headingFont, fontSize: "1.15rem", fontWeight: 800, color: primaryColor, margin: "0 0 4px 0" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: textColor, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", opacity: 0.75 }}>
            <span>{currentCompany.name} • Project Portfolio</span>
            <span>Commercial &amp; Residential References</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 6: BACK COVER & QR TRADE HUB (If Enabled)                            */}
      {/* ========================================================================= */}
      {pageStructure.showBackCoverPage && (
        <div style={pageContainerBaseStyle}>
          <div>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: `1.5px solid ${accentColor}`, padding: "4px 18px", borderRadius: "30px", fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.18em", color: accentColor, textTransform: "uppercase", background: cardBg, marginBottom: "0.75rem" }}>
                {backCoverConfig.ctaBadge || "✦ OFFICIAL DIGITAL SHOWCASE & REAL-TIME CATALOGUE ✦"}
              </div>

              <h2 style={{ fontFamily: headingFont, fontSize: "3.2rem", fontWeight: 900, color: primaryColor, margin: "0 0 0.5rem 0", letterSpacing: headingLetterSpacing }}>
                {backCoverConfig.title || "GET IN TOUCH"}
              </h2>
              <h3 style={{ fontFamily: headingFont, fontSize: "2rem", fontWeight: 500, color: accentColor, margin: "0 0 1rem 0" }}>
                {backCoverConfig.subtitle || "CONTACT & DIRECT ENQUIRIES"}
              </h3>
              <p style={{ fontSize: "0.95rem", color: textColor, opacity: 0.85, maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
                {backCoverConfig.tagline || "Access real-time slab inventory, custom designs, architectural spec sheets & direct enquiry portal."}
              </p>
            </div>

            {/* Selected Active QR Codes Container */}
            {includeQrInCatalogue && activeQrList.length > 0 && (
              <div style={{ background: `${primaryColor}08`, borderRadius: "16px", padding: "2.25rem", border: `2px solid ${accentColor}`, boxShadow: getShadowCss(), marginBottom: "2.5rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      activeQrList.length === 1
                        ? "1fr"
                        : activeQrList.length === 2
                        ? "1fr 1fr"
                        : activeQrList.length === 3
                        ? "repeat(3, 1fr)"
                        : activeQrList.length === 4
                        ? "repeat(4, 1fr)"
                        : "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "1.75rem",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  {activeQrList.map((box, bIdx) => (
                    <div key={bIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ background: "#ffffff", padding: "8px", borderRadius: "10px", border: `1.5px solid ${accentColor}`, boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                        <img src={box.qr} alt={box.title} style={{ width: "105px", height: "105px", display: "block" }} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "0.88rem", color: primaryColor, marginTop: "8px", letterSpacing: "0.06em" }}>
                        {box.title}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: textColor, opacity: 0.7, marginTop: "2px" }}>
                        {box.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Address & Phone Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2.5rem", borderTop: `2px solid ${accentColor}`, paddingTop: "2rem" }}>
              <div>
                <h4 style={{ fontFamily: headingFont, fontSize: "1.2rem", fontWeight: 800, color: primaryColor, margin: "0 0 0.5rem 0" }}>
                  REGISTERED TRADE ADDRESS
                </h4>
                <p style={{ fontSize: "0.90rem", color: textColor, opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
                  {currentCompany.contact?.address || "Commercial Showroom & Operations"}
                </p>
                {currentCompany.contact?.email && (
                  <div style={{ fontSize: "0.85rem", color: textColor, opacity: 0.8, marginTop: "6px" }}>
                    Email: {currentCompany.contact.email}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontFamily: headingFont, fontSize: "1.2rem", fontWeight: 800, color: primaryColor, margin: "0 0 0.5rem 0" }}>
                  DIRECT INQUIRY &amp; GSTIN
                </h4>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: primaryColor, margin: "0 0 4px 0" }}>
                  {currentCompany.contact?.phone || "+91 (Inquiries)"}
                </p>
                {currentCompany.legal?.gstNumber && (
                  <div style={{ fontSize: "0.85rem", color: textColor, opacity: 0.85 }}>
                    GSTIN: {currentCompany.legal.gstNumber}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", opacity: 0.75 }}>
            <span>{currentCompany.name} • End of Official Catalogue</span>
            <span>Designed &amp; Compiled with AI Catalogue Studio</span>
          </div>
        </div>
      )}
    </div>
  );
}
