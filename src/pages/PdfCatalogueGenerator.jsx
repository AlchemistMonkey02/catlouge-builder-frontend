import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FileText,
  Download,
  Printer,
  Building2,
  Plus,
  Sparkles,
  CheckCircle,
  Eye,
  Layers,
  Palette,
  Phone,
  Mail,
  Globe,
  MapPin,
  Tag,
  Shield,
  X,
  Boxes,
  ArrowLeft,
  Check,
  Star,
  Award,
  Zap,
  ChevronRight,
  ExternalLink,
  QrCode,
  BookOpen,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Save,
  MessageCircle,
  DownloadCloud,
  Link2,
  Trash2,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import {
  fetchCompanies,
  createCompanyProfile,
  updateCompanyProfile,
  fetchCatalogueProducts,
} from "../services/api";
import TemplateDesignStudio, {
  DEFAULT_DESIGN_CONFIG,
  PRESET_CONFIG_MAP,
} from "../components/TemplateDesignStudio";
import DynamicCatalogueRenderer from "../components/DynamicCatalogueRenderer";
import DynamicCatalogueStudio from "../components/dynamic-catalogue/DynamicCatalogueStudio";

const CANVA_TEMPLATES = [
  {
    id: "supreme_architectural",
    name: "1. Supreme Architectural Catalogue",
    styleLabel: "Exact Supreme Granite & Stones Format",
    desc: "Complete 9-page architectural stone catalogue with Cover, About Us, Benefits, Product Specs Table, Surface Finishes, Applications, CNC Patterns, and QR Contact Us back cover.",
    palette: ["#F5F6F0", "#4E5C43", "#1C1917", "#C5A059"],
    badge: "Reference Format",
    icon: "🏛️",
    previewBg: "linear-gradient(135deg, #F5F6F0 0%, #E8EBE0 100%)",
    previewBorder: "#4E5C43",
    textColor: "#4E5C43",
  },
  {
    id: "canva_vogue_luxe",
    name: "2. Vogue Luxury Editorial",
    styleLabel: "High-Fashion Lookbook",
    desc: "Alabaster parchment, champagne gold double-borders, Playfair serif typography, diamond ornaments, and luxury seal.",
    palette: ["#FAF8F5", "#D4AF37", "#1A1715", "#C5A059"],
    badge: "Canva Luxe",
    icon: "✨",
    previewBg: "linear-gradient(135deg, #FAF8F5 0%, #F3EDE2 100%)",
    previewBorder: "#D4AF37",
    textColor: "#1A1715",
  },
  {
    id: "canva_neon_pop",
    name: "3. Neon Streetwear & Drop",
    styleLabel: "Bold & Trendy Pop",
    desc: "Deep obsidian canvas, electric magenta & cyan gradient accents, 3D floating cards, bold Montserrat 900 typography.",
    palette: ["#0D1117", "#7928CA", "#FF0080", "#00DFD8"],
    badge: "Canva Trendy",
    icon: "⚡",
    previewBg: "linear-gradient(135deg, #0D1117 0%, #161B22 100%)",
    previewBorder: "#FF0080",
    textColor: "#FFFFFF",
  },
  {
    id: "canva_corporate_blue",
    name: "4. Corporate Executive Annual",
    styleLabel: "B2B Commercial Catalog",
    desc: "Crisp white canvas, royal navy banner, sapphire blue accents, dual B2B wholesale pricing, structured spec matrices.",
    palette: ["#FFFFFF", "#0A2540", "#0066CC", "#E2E8F0"],
    badge: "Canva B2B",
    icon: "🏢",
    previewBg: "linear-gradient(135deg, #0A2540 0%, #134074 100%)",
    previewBorder: "#0066CC",
    textColor: "#FFFFFF",
  },
  {
    id: "canva_botanical_eco",
    name: "5. Artisan Botanical & Craft",
    styleLabel: "Organic, Earthy & Lifestyle",
    desc: "Warm linen background, signature Canva arched photo frames, sage green & terracotta hues, Cinzel serif typography.",
    palette: ["#F7F4EE", "#2E4F3E", "#C86A4B", "#E3D5C5"],
    badge: "Canva Organic",
    icon: "🌿",
    previewBg: "linear-gradient(135deg, #F7F4EE 0%, #EAE4D7 100%)",
    previewBorder: "#2E4F3E",
    textColor: "#2E4F3E",
  },
  {
    id: "canva_cyber_tech",
    name: "6. Cyber Industrial Tech HUD",
    styleLabel: "Precision Engineering",
    desc: "Matte carbon graphite, safety hazard amber accents, laser cyan crosshair reticle, technical blueprint parameter readouts.",
    palette: ["#12161F", "#F59E0B", "#00E5FF", "#1E2538"],
    badge: "Canva Tech",
    icon: "⚙️",
    previewBg: "linear-gradient(135deg, #12161F 0%, #1E2538 100%)",
    previewBorder: "#00E5FF",
    textColor: "#00E5FF",
  },
];

export default function PdfCatalogueGenerator() {
  const [searchParams] = useSearchParams();
  const urlCompanyId = searchParams.get("companyId");

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Dynamic Studio Engine: "dynamic" (ODOP 41-Layout Designer with live photo & text editing) or "classic"
  const [studioEngine, setStudioEngine] = useState("dynamic");

  // Template State - Defaults to Supreme Architectural (Exact Reference Format)
  const [templateId, setTemplateId] = useState("supreme_architectural");
  const [supremeActiveTab, setSupremeActiveTab] = useState("all"); // 'all' or specific page index
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [showPrice, setShowPrice] = useState(true);
  const [showMrp, setShowMrp] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  // Custom User Templates from localStorage
  const [customTemplates, setCustomTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_custom_catalogue_templates");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic Design Studio Configuration
  const [designConfig, setDesignConfig] = useState(() => {
    return PRESET_CONFIG_MAP["supreme_architectural"] || DEFAULT_DESIGN_CONFIG;
  });

  const handleSelectTemplate = (id) => {
    setTemplateId(id);
    if (PRESET_CONFIG_MAP[id]) {
      setDesignConfig((prev) => ({
        ...prev,
        ...PRESET_CONFIG_MAP[id],
      }));
    } else {
      const custom = customTemplates.find((t) => t.id === id);
      if (custom && custom.config) {
        setDesignConfig(custom.config);
      }
    }
  };

  const handleSaveCustomTemplate = (name, config) => {
    const newTmpl = {
      id: "custom_" + Date.now(),
      name,
      styleLabel: "Custom Signature Design",
      desc: "User-created custom layout & color styling",
      palette: [config.primaryColor, config.secondaryColor, config.accentColor, config.pageBg],
      isCustom: true,
      config,
    };
    const updated = [...customTemplates, newTmpl];
    setCustomTemplates(updated);
    try {
      localStorage.setItem("ai_custom_catalogue_templates", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setTemplateId(newTmpl.id);
  };

  const handleDeleteCustomTemplate = (id) => {
    const updated = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(updated);
    try {
      localStorage.setItem("ai_custom_catalogue_templates", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (templateId === id) {
      handleSelectTemplate("supreme_architectural");
    }
  };

  // Dynamic QR Code Studio & Business Profile Link State
  const [includeQrInCatalogue, setIncludeQrInCatalogue] = useState(true);
  const [isQrStudioOpen, setIsQrStudioOpen] = useState(true);
  const [isSavingQr, setIsSavingQr] = useState(false);
  const [qrSavedSuccess, setQrSavedSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const [qrLinks, setQrLinks] = useState({
    businessProfile: "",
    whatsapp: "",
    website: "",
    location: "",
    instagram: "",
    custom: "",
    customLabel: "Scan to Order",
  });
  const [qrDataUrls, setQrDataUrls] = useState({
    businessProfile: "",
    whatsapp: "",
    website: "",
    location: "",
    instagram: "",
    custom: "",
  });

  // Which QR codes to include in the catalogue (user can select 2 only, 4, all, or customize)
  const [selectedQrKeys, setSelectedQrKeys] = useState([
    "businessProfile",
    "whatsapp",
    "website",
    "location",
  ]);

  const handleToggleQrKey = (key) => {
    setSelectedQrKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllQrs = () => {
    setSelectedQrKeys(["businessProfile", "whatsapp", "website", "location", "instagram", "custom"]);
  };

  const handleSelectDualQrs = () => {
    setSelectedQrKeys(["businessProfile", "whatsapp"]);
  };

  const handleDeselectAllQrs = () => {
    setSelectedQrKeys([]);
  };

  const QR_STUDIO_ITEMS = [
    {
      key: "businessProfile",
      title: "Digital Profile",
      icon: Building2,
      accentColor: "#3b82f6",
      placeholder: "https://yourbrand.com/profile",
      actionLabel: "Test Link",
      downloadName: "business_profile",
    },
    {
      key: "whatsapp",
      title: "WhatsApp Orders",
      icon: MessageCircle,
      accentColor: "#10b981",
      placeholder: "https://wa.me/919066804666?text=...",
      actionLabel: "Test Chat",
      downloadName: "whatsapp",
    },
    {
      key: "website",
      title: "Official Website",
      icon: Globe,
      accentColor: "#f59e0b",
      placeholder: "https://www.company.com",
      actionLabel: "Open Site",
      downloadName: "website",
    },
    {
      key: "location",
      title: "Store Location",
      icon: MapPin,
      accentColor: "#0ea5e9",
      placeholder: "https://maps.google.com/?q=...",
      actionLabel: "Open Maps",
      downloadName: "location",
    },
    {
      key: "instagram",
      title: "Instagram",
      icon: Share2,
      accentColor: "#ec4899",
      placeholder: "https://instagram.com/company",
      actionLabel: "Visit Profile",
      downloadName: "instagram",
    },
    {
      key: "custom",
      title: "Custom URL",
      icon: Link2,
      accentColor: "#8b5cf6",
      placeholder: "https://yourlink.com/promo",
      actionLabel: "Test URL",
      downloadName: "custom",
    },
  ];

  // Compile active QR codes for the catalogue
  const activeQrList = [
    {
      key: "businessProfile",
      title: "DIGITAL PROFILE",
      subtitle: "Scan to View Profile",
      qr: qrDataUrls.businessProfile,
      link: qrLinks.businessProfile,
      badgeColor: "#38bdf8",
      accentRgb: "56, 189, 248",
    },
    {
      key: "whatsapp",
      title: "WHATSAPP ORDERS",
      subtitle: "Scan to Order Direct",
      qr: qrDataUrls.whatsapp,
      link: qrLinks.whatsapp,
      badgeColor: "#16a34a",
      accentRgb: "22, 163, 74",
    },
    {
      key: "website",
      title: "WEBSITE",
      subtitle: "Visit Online Store",
      qr: qrDataUrls.website,
      link: qrLinks.website,
      badgeColor: "#d97706",
      accentRgb: "217, 119, 6",
    },
    {
      key: "location",
      title: "LOCATION",
      subtitle: "Google Maps Showroom",
      qr: qrDataUrls.location,
      link: qrLinks.location,
      badgeColor: "#0284c7",
      accentRgb: "2, 132, 199",
    },
    {
      key: "instagram",
      title: "INSTAGRAM",
      subtitle: "Follow on Instagram",
      qr: qrDataUrls.instagram,
      link: qrLinks.instagram,
      badgeColor: "#ec4899",
      accentRgb: "236, 72, 153",
    },
    {
      key: "custom",
      title: (qrLinks.customLabel || "PROMO ACTION").toUpperCase(),
      subtitle: "Custom Direct Link",
      qr: qrDataUrls.custom,
      link: qrLinks.custom,
      badgeColor: "#a855f7",
      accentRgb: "168, 85, 247",
    },
  ].filter((item) => selectedQrKeys.includes(item.key) && item.qr);

  // Quick Company Modal
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    tagline: "Natural • Durable • Timeless",
    industry: "Granite & Natural Stone",
    logoUrl: "/assets/reference/p1_2.png",
    brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
    contact: {
      email: "info@supremestones.in",
      phone: "+91 9066804666",
      website: "https://www.supremestones.in",
      address: "15 16-1A, 21st Mile Stone, Malle Nalsandra, Jigani, Nallasandra, Karnataka – 560083",
    },
    legal: { gstNumber: "29AAGCS1234F1Z9", taxId: "TAX-ID-99221", currency: "INR" },
    wholesaleTerms: "We trade across India with Nationwide Coverage, ensuring smooth execution from selection to completion.",
  });

  const pdfPrintRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [urlCompanyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [compRes, prodRes] = await Promise.all([
        fetchCompanies(),
        fetchCatalogueProducts({ limit: 100 }),
      ]);

      let chosenCompanyId = "";
      if (compRes.data && compRes.data.length > 0) {
        const priorityKeywords = [
          "garlic",
          "kota stone",
          "sandstone",
          "sand stone",
          "kota doria",
          "doria"
        ];
        const sorted = [...compRes.data].sort((a, b) => {
          const aKey = ((a.name || "") + " " + (a.industry || "")).toLowerCase();
          const bKey = ((b.name || "") + " " + (b.industry || "")).toLowerCase();
          const aIdx = priorityKeywords.findIndex((k) => aKey.includes(k));
          const bIdx = priorityKeywords.findIndex((k) => bKey.includes(k));
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
          if (aIdx !== -1) return -1;
          if (bIdx !== -1) return 1;
          return 0;
        });
        setCompanies(sorted);
        let match = urlCompanyId ? sorted.find((c) => c._id === urlCompanyId) : null;
        if (!match) {
          match = sorted[0];
        }
        chosenCompanyId = match ? match._id : sorted[0]._id;
        setSelectedCompanyId(chosenCompanyId);
      }

      if (prodRes.data?.products) {
        const prods = prodRes.data.products;
        setAllProducts(prods);

        // Filter products for chosen company
        const compProds = prods.filter(
          (p) => p.companyId === chosenCompanyId || (chosenCompanyId && p.brand?.toLowerCase() === compRes.data?.find((c) => c._id === chosenCompanyId)?.name?.toLowerCase())
        );

        setSelectedProductIds(compProds.map((p) => p._id));
      }
    } catch (err) {
      console.error("Error loading catalogue data:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentCompany = companies.find((c) => c._id === selectedCompanyId) || companies[0] || {};
  const primaryColor = currentCompany.brandColors?.primary || "#4E5C43";
  const secondaryColor = currentCompany.brandColors?.secondary || "#1C1917";

  // Products belonging to the current company, with specialty product matching
  const companyProducts = useMemo(() => {
    const cName = (currentCompany.name || "").toLowerCase();
    const direct = allProducts.filter((p) => {
      if (p.companyId === selectedCompanyId) return true;
      if (selectedCompanyId && p.brand?.toLowerCase() === cName) return true;
      if (cName.includes("garlic") && (p.category?.toLowerCase()?.includes("garlic") || p.brand?.toLowerCase()?.includes("garlic"))) return true;
      if ((cName.includes("kota stone") || cName.includes("limestone")) && (p.category?.toLowerCase()?.includes("kota") || p.brand?.toLowerCase()?.includes("kota"))) return true;
      if (cName.includes("sand") && (p.category?.toLowerCase()?.includes("sand") || p.brand?.toLowerCase()?.includes("sand"))) return true;
      if (cName.includes("doria") && (p.category?.toLowerCase()?.includes("doria") || p.brand?.toLowerCase()?.includes("doria"))) return true;
      return false;
    });
    return direct.length > 0 ? direct : allProducts;
  }, [allProducts, selectedCompanyId, currentCompany.name]);

  // When clicking a different company
  const handleSelectCompany = (comp) => {
    setSelectedCompanyId(comp._id);
    const cName = (comp.name || "").toLowerCase();
    let compProds = allProducts.filter((p) => {
      if (p.companyId === comp._id) return true;
      if (p.brand?.toLowerCase() === cName) return true;
      if (cName.includes("garlic") && (p.category?.toLowerCase()?.includes("garlic") || p.brand?.toLowerCase()?.includes("garlic"))) return true;
      if ((cName.includes("kota stone") || cName.includes("limestone")) && (p.category?.toLowerCase()?.includes("kota") || p.brand?.toLowerCase()?.includes("kota"))) return true;
      if (cName.includes("sand") && (p.category?.toLowerCase()?.includes("sand") || p.brand?.toLowerCase()?.includes("sand"))) return true;
      if (cName.includes("doria") && (p.category?.toLowerCase()?.includes("doria") || p.brand?.toLowerCase()?.includes("doria"))) return true;
      return false;
    });
    if (compProds.length === 0) compProds = allProducts;
    setSelectedProductIds(compProds.map((p) => p._id));
    syncAndGenerateQrs(comp);
  };

  // Sync & Generate QR Codes automatically whenever the company is selected or loaded
  useEffect(() => {
    if (currentCompany && currentCompany.name) {
      syncAndGenerateQrs(currentCompany);
    }
  }, [selectedCompanyId, currentCompany?.name]);

  const syncAndGenerateQrs = async (comp, overrideLinks = null) => {
    if (!comp) return;
    const phoneClean = (comp.contact?.phone || "").replace(/[^0-9]/g, "");
    const waDefault = phoneClean
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hello! I'm interested in products from ${comp.name}.`)}`
      : "https://wa.me/919066804666";
    const webDefault = comp.contact?.website || "https://www.supremestones.in";
    const locDefault = `https://maps.google.com/?q=${encodeURIComponent(comp.contact?.address || comp.name || "Bangalore")}`;
    const instaDefault = comp.qrLinks?.instagram || `https://instagram.com/${(comp.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const profileDefault = comp.qrLinks?.businessProfile || `${window.location.origin}/pdf-generator?companyId=${comp._id}`;

    const effectiveLinks = overrideLinks || {
      businessProfile: comp.qrLinks?.businessProfile || profileDefault,
      whatsapp: comp.qrLinks?.whatsapp || waDefault,
      website: comp.qrLinks?.website || webDefault,
      location: comp.qrLinks?.location || locDefault,
      instagram: comp.qrLinks?.instagram || instaDefault,
      custom: comp.qrLinks?.custom || "",
      customLabel: comp.qrLinks?.customLabel || "Scan to Inquire",
    };

    setQrLinks(effectiveLinks);

    try {
      const opts = { width: 360, margin: 2, color: { dark: "#111111", light: "#FFFFFF" } };
      const [bp, wa, web, loc, insta, cust] = await Promise.all([
        QRCode.toDataURL(effectiveLinks.businessProfile || profileDefault, opts),
        QRCode.toDataURL(effectiveLinks.whatsapp || waDefault, opts),
        QRCode.toDataURL(effectiveLinks.website || webDefault, opts),
        QRCode.toDataURL(effectiveLinks.location || locDefault, opts),
        QRCode.toDataURL(effectiveLinks.instagram || instaDefault, opts),
        QRCode.toDataURL(effectiveLinks.custom || effectiveLinks.businessProfile || profileDefault, opts),
      ]);

      setQrDataUrls({
        businessProfile: bp,
        whatsapp: wa,
        website: web,
        location: loc,
        instagram: insta,
        custom: cust,
      });
    } catch (err) {
      console.error("QR Code generation error:", err);
    }
  };

  const handleQrLinkChange = (field, value) => {
    const updated = { ...qrLinks, [field]: value };
    setQrLinks(updated);
    generateSingleQr(field, value);
  };

  const generateSingleQr = async (field, value) => {
    try {
      const opts = { width: 360, margin: 2, color: { dark: "#111111", light: "#FFFFFF" } };
      const targetUrl = value || `${window.location.origin}/pdf-generator?companyId=${currentCompany._id}`;
      const dataUrl = await QRCode.toDataURL(targetUrl, opts);
      setQrDataUrls((prev) => ({ ...prev, [field]: dataUrl }));
    } catch (err) {
      console.error("Single QR generation error:", err);
    }
  };

  const handleSaveQrLinks = async () => {
    if (!currentCompany?._id) return;
    try {
      setIsSavingQr(true);
      await updateCompanyProfile(currentCompany._id, { qrLinks });
      setCompanies((prev) =>
        prev.map((c) => (c._id === currentCompany._id ? { ...c, qrLinks } : c))
      );
      setQrSavedSuccess(true);
      setTimeout(() => setQrSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save QR links: " + err.message);
    } finally {
      setIsSavingQr(false);
    }
  };

  const handleDownloadQr = (name, dataUrl) => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${(currentCompany.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "_")}_${name}_qr.png`;
    a.click();
  };

  const handleCopyLink = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(""), 2500);
  };

  // Toggle single product selection
  const handleToggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === companyProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(companyProducts.map((p) => p._id));
    }
  };

  // Create Company Profile submit
  const handleCreateCompanySubmit = async (e) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return alert("Please enter a company name");
    try {
      const res = await createCompanyProfile(newCompany);
      if (res.data) {
        setCompanies((prev) => [...prev, res.data]);
        setSelectedCompanyId(res.data._id);
        setIsCompanyModalOpen(false);
      }
    } catch (err) {
      alert("Failed to create company: " + err.message);
    }
  };

  // Native Browser Print
  const handlePrintPdf = () => {
    window.print();
  };

  // One-Click Standalone PDF Download
  const handleDownloadPdf = async () => {
    if (!pdfPrintRef.current) return;
    try {
      setIsExportingPdf(true);
      const element = pdfPrintRef.current;

      const bgColor =
        templateId === "supreme_architectural"
          ? "#F5F6F0"
          : designConfig.pageBg || "#ffffff";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: bgColor,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Multi-page slicing
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeFilename = `${currentCompany.name || "Company"}_Catalogue.pdf`.replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(safeFilename);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("PDF download failed: " + err.message + ". You can use the 'Print / Save as PDF' button as fallback.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Visible products for this catalogue (selected, or all company products by default)
  const visibleProducts = useMemo(() => {
    const filtered = companyProducts.filter((p) => selectedProductIds.includes(p._id));
    return filtered.length > 0 ? filtered : companyProducts;
  }, [companyProducts, selectedProductIds]);

  // Dynamic canvas container styling per Canva template or custom design
  const getCanvasContainerStyle = () => {
    if (templateId === "supreme_architectural") {
      return {
        background: "#F5F6F0",
        color: "#1C1917",
        padding: "0",
        fontFamily: "'Playfair Display', Georgia, serif",
        boxShadow: "0 20px 60px rgba(78, 92, 67, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
      };
    }
    return {
      background: designConfig.pageBg || "#ffffff",
      color: designConfig.textColor || "#0f172a",
      border: `2px solid ${designConfig.cardBorderColor || "#e2e8f0"}`,
      padding: "0",
      fontFamily: designConfig.bodyFont || "'Inter', sans-serif",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      borderRadius: `${designConfig.cardRadius || 10}px`,
      overflow: "hidden",
    };
  };

  return (
    <div className="main-content">
      {/* Top Action Bar */}
      <div className="workspace-toolbar no-print">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link
              to="/companies"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.85rem",
                marginRight: "0.75rem",
              }}
            >
              <ArrowLeft size={15} /> All Companies
            </Link>
            <span className="ai-spark-badge" style={{ background: studioEngine === "dynamic" ? "#1e3a8a" : "#065f46", color: "#ffffff", borderColor: studioEngine === "dynamic" ? "#3b82f6" : "#047857", fontWeight: 700, padding: "4px 10px", fontSize: "0.78rem" }}>
              <BookOpen size={14} /> {studioEngine === "dynamic" ? "41 ODOP Dynamic Layouts • Fully In-Place Customizable" : "Supreme Reference Format Loaded"}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginTop: "4px",
            }}
          >
            PDF Catalogue Studio
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.94rem", fontWeight: 500, marginTop: "4px" }}>
            {studioEngine === "dynamic"
              ? "Dynamic catalogue designing with 41 layouts, aspect-ratio safe photo rendering, live in-place element customization, and high-DPI A4 PDF export."
              : "Using the architectural format from complete-kota-stone-catalogue-supreme-granite-and-stones.pdf."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Mode Switcher */}
          <div style={{ display: "flex", background: "var(--bg-surface-elevated)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-medium)" }}>
            <button
              type="button"
              className={`btn btn-sm ${studioEngine === "dynamic" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setStudioEngine("dynamic")}
              style={{ fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Sparkles size={15} /> Dynamic Studio (41 Layouts + Customizer)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${studioEngine === "classic" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setStudioEngine("classic")}
              style={{ fontWeight: 700, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Layers size={15} /> Legacy Format
            </button>
          </div>

          {studioEngine === "classic" && (
            <>
              <button className="btn btn-outline" style={{ fontWeight: 700, fontSize: "0.88rem" }} onClick={handlePrintPdf}>
                <Printer size={16} /> Print / Save as PDF
              </button>

              <button
                className="btn btn-primary btn-lg"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)", fontWeight: 700 }}
                disabled={isExportingPdf || visibleProducts.length === 0}
                onClick={handleDownloadPdf}
              >
                <Download size={18} /> {isExportingPdf ? "Compiling PDF..." : `Download PDF (${visibleProducts.length} Products)`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* STEP 1: COMPANY SELECTOR */}
      <div className="card no-print" style={{ marginBottom: "1.25rem", padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building2 size={20} color="var(--primary)" />
            Step 1: Target Company Profile ({companies.length} Available)
          </div>
          <button className="btn btn-outline btn-sm" style={{ fontWeight: 700 }} onClick={() => setIsCompanyModalOpen(true)}>
            <Plus size={14} /> + New Company Profile
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
          {companies.map((comp) => {
            const isSelected = comp._id === selectedCompanyId;
            return (
              <div
                key={comp._id}
                onClick={() => handleSelectCompany(comp)}
                style={{
                  padding: "0.95rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                  border: isSelected ? `2px solid var(--primary)` : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                }}
              >
                {failedLogos[comp._id] || !comp.logoUrl ? (
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "8px",
                      background: `linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)`,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      flexShrink: 0,
                    }}
                  >
                    {(comp.name || "CO").substring(0, 2).toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={comp.logoUrl}
                    alt={comp.name}
                    onError={() => setFailedLogos((prev) => ({ ...prev, [comp._id]: true }))}
                    style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover", background: "#fff", padding: "2px", border: "1px solid var(--border-subtle)", flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                    {comp.industry || "General"} • {comp.tagline}
                  </div>
                </div>
                {isSelected && <CheckCircle size={18} color="var(--primary)" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: DESIGN TEMPLATES & REAL-TIME STUDIO (LEGACY) */}
      {studioEngine === "classic" && (
        <>
          <div className="card no-print" style={{ marginBottom: "1.25rem", padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Palette size={20} color="var(--primary)" />
            Step 2: Choose Preset Template or Custom Signature Design
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {CANVA_TEMPLATES.length} Presets • {customTemplates.length} Custom Designs
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.85rem" }}>
          {[...CANVA_TEMPLATES, ...customTemplates].map((tmpl) => {
            const isSelected = templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                style={{
                  borderRadius: "var(--radius-lg)",
                  background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                  border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "all var(--transition-fast)",
                  boxShadow: isSelected ? "var(--shadow-md)" : "none",
                  position: "relative",
                }}
              >
                {/* Mini Mockup Card */}
                <div
                  style={{
                    height: "90px",
                    background: tmpl.previewBg || `linear-gradient(135deg, ${tmpl.palette?.[0] || "#3b82f6"} 0%, ${tmpl.palette?.[1] || "#1e1b4b"} 100%)`,
                    borderBottom: `2px solid ${tmpl.previewBorder || tmpl.palette?.[2] || "var(--primary)"}`,
                    padding: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.15rem" }}>{tmpl.icon || (tmpl.isCustom ? "🎨" : "📄")}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {tmpl.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete custom template "${tmpl.name}"?`)) {
                              handleDeleteCustomTemplate(tmpl.id);
                            }
                          }}
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            border: "none",
                            color: "#ff6b6b",
                            padding: "3px 6px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Delete custom template"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "3px 9px",
                          borderRadius: "var(--radius-full)",
                          background: isSelected ? "var(--primary)" : "#0f172a",
                          color: "#ffffff",
                          fontWeight: 800,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {tmpl.badge || (tmpl.isCustom ? "Custom" : "Preset")}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: tmpl.textColor || "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                    {tmpl.styleLabel || "Custom Design"}
                  </div>
                </div>

                <div style={{ padding: "0.95rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    {tmpl.name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: 1.45, fontWeight: 500 }}>
                    {tmpl.desc || "Fully customizable catalogue layout and color profile."}
                  </div>

                  {/* Color Swatch Dots */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "auto", paddingTop: "0.85rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700, marginRight: "2px" }}>Palette:</span>
                    {(tmpl.palette || []).map((color, cIdx) => (
                      <span
                        key={cIdx}
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: color,
                          border: "1px solid var(--border-medium)",
                          display: "inline-block",
                        }}
                      />
                    ))}
                    {isSelected && (
                      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.74rem", color: "var(--primary)", fontWeight: 800 }}>
                        <Check size={14} /> Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REAL-TIME TEMPLATE DESIGN STUDIO (Colors, Typography, Layouts, Fields, Custom Designs) */}
      <TemplateDesignStudio
        designConfig={designConfig}
        setDesignConfig={setDesignConfig}
        templateId={templateId}
        setTemplateId={handleSelectTemplate}
        presetTemplates={CANVA_TEMPLATES}
        customTemplates={customTemplates}
        onSaveCustomTemplate={handleSaveCustomTemplate}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        currentCompany={currentCompany}
      />

      {/* SUPREME ARCHITECTURAL CATALOGUE PAGE NAVIGATION (When Supreme is active) */}
      {templateId === "supreme_architectural" && (
        <div className="card no-print" style={{ marginBottom: "1.25rem", padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={18} /> Supreme Granite &amp; Stones Page Spread Selector:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[
                { id: "all", label: "All 9 Pages (Complete Catalogue)" },
                { id: "p1", label: "Page 1: Cover" },
                { id: "p2", label: "Page 2: About Us" },
                { id: "p3", label: "Page 3: Benefits" },
                { id: "p4", label: "Page 4: Product Specs" },
                { id: "p5", label: "Page 5: Finishes" },
                { id: "p6", label: "Page 6: Applications" },
                { id: "p7", label: "Page 7: CNC Patterns" },
                { id: "p9", label: "Page 9: Contact & QR" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSupremeActiveTab(tab.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: supremeActiveTab === tab.id ? 800 : 600,
                    background: supremeActiveTab === tab.id ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: supremeActiveTab === tab.id ? "#fff" : "var(--text-secondary)",
                    border: supremeActiveTab === tab.id ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* STEP 2.5: INTERACTIVE QR CODE STUDIO & BUSINESS PROFILE LINKS */}
      <div className="card no-print" style={{ marginBottom: "1.25rem", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-subtle)", background: "var(--bg-card)", boxShadow: "0 2px 12px -2px rgba(15, 23, 42, 0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: isQrStudioOpen ? "1.25rem" : "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--primary-light)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
              <QrCode size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Step 3: Dynamic QR Code Studio &amp; Business Profile Link
                <span style={{ fontSize: "0.72rem", padding: "3px 9px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 800, border: "1px solid var(--border-medium)" }}>
                  Active in All Formats
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "2px" }}>
                Add custom URLs or auto-generate scannable QR codes connected to <strong style={{ color: "var(--text-primary)" }}>{currentCompany.name || "Business Profile"}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            {/* Toggle Inclusion in Catalogue */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.85rem", color: "var(--text-primary)", cursor: "pointer", background: "var(--bg-surface-elevated)", padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={includeQrInCatalogue}
                onChange={(e) => setIncludeQrInCatalogue(e.target.checked)}
                style={{ accentColor: "var(--primary)", transform: "scale(1.1)" }}
              />
              <span>Embed QR in Catalogue</span>
            </label>

            {/* Quick Auto-generate Button */}
            <button
              className="btn btn-outline btn-sm"
              style={{ color: "var(--primary)", borderColor: "var(--border-medium)", fontWeight: 700 }}
              onClick={() => syncAndGenerateQrs(currentCompany)}
              title="Auto-fill links from phone, website & address"
            >
              <RefreshCw size={14} /> Auto-Generate from Profile
            </button>

            {/* Save to Company Profile Button */}
            <button
              className="btn btn-primary btn-sm"
              style={{ background: qrSavedSuccess ? "var(--success)" : "var(--primary)", fontWeight: 700 }}
              onClick={handleSaveQrLinks}
              disabled={isSavingQr}
            >
              {qrSavedSuccess ? <Check size={14} /> : <Save size={14} />}
              {isSavingQr ? "Saving..." : qrSavedSuccess ? "Saved to Profile!" : "Save to Profile"}
            </button>

            {/* Toggle Collapse */}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsQrStudioOpen(!isQrStudioOpen)}
              style={{ color: "var(--text-secondary)", fontWeight: 700 }}
            >
              {isQrStudioOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Studio Content */}
        {isQrStudioOpen && (
          <div>
            {/* QUICK SELECTION TOOLBAR: ALL, TWO ONLY, OR CUSTOM */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface-elevated)", padding: "10px 14px", borderRadius: "10px", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                <span style={{ color: "var(--text-secondary)" }}>Choose which QR codes appear in the catalogue:</span>
                <span style={{ fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "2px 9px", borderRadius: "12px", border: "1px solid var(--border-medium)", fontSize: "0.8rem" }}>
                  {selectedQrKeys.length} of 6 Selected
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "inline-flex", background: "var(--bg-surface)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-subtle)", gap: "2px" }}>
                  <button
                    type="button"
                    style={{
                      padding: "4px 11px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: selectedQrKeys.length === 6 ? "var(--primary)" : "transparent",
                      color: selectedQrKeys.length === 6 ? "#ffffff" : "var(--text-secondary)",
                      boxShadow: selectedQrKeys.length === 6 ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                      transition: "all 0.15s ease",
                    }}
                    onClick={handleSelectAllQrs}
                  >
                    All (6)
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "4px 11px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: selectedQrKeys.length === 2 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") ? "var(--primary)" : "transparent",
                      color: selectedQrKeys.length === 2 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") ? "#ffffff" : "var(--text-secondary)",
                      boxShadow: selectedQrKeys.length === 2 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                      transition: "all 0.15s ease",
                    }}
                    onClick={handleSelectDualQrs}
                  >
                    Profile + WhatsApp (2)
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "4px 11px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: selectedQrKeys.length === 4 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") && selectedQrKeys.includes("website") && selectedQrKeys.includes("location") ? "var(--primary)" : "transparent",
                      color: selectedQrKeys.length === 4 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") && selectedQrKeys.includes("website") && selectedQrKeys.includes("location") ? "#ffffff" : "var(--text-secondary)",
                      boxShadow: selectedQrKeys.length === 4 && selectedQrKeys.includes("businessProfile") && selectedQrKeys.includes("whatsapp") && selectedQrKeys.includes("website") && selectedQrKeys.includes("location") ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => setSelectedQrKeys(["businessProfile", "whatsapp", "website", "location"])}
                  >
                    4 Standard
                  </button>
                </div>
                <button
                  type="button"
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--text-muted)",
                    transition: "all 0.15s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onClick={handleDeselectAllQrs}
                  title="Clear all QR codes from catalogue"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              </div>
            </div>

            {/* RESPONSIVE BALANCED 3x2 QR CARDS GRID */}
            <div className="qr-studio-grid">
              {QR_STUDIO_ITEMS.map((item) => {
                const isSelected = selectedQrKeys.includes(item.key);
                return (
                  <div
                    key={item.key}
                    style={{
                      background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                      padding: "1rem",
                      borderRadius: "14px",
                      border: isSelected ? `1.5px solid ${item.accentColor}` : "1px solid var(--border-subtle)",
                      boxShadow: isSelected ? `0 8px 24px -4px ${item.accentColor}20, 0 2px 6px -1px rgba(0, 0, 0, 0.04)` : "0 1px 3px rgba(0, 0, 0, 0.02)",
                      position: "relative",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      opacity: isSelected ? 1 : 0.68,
                    }}
                  >
                    {/* Card Header with Icon & Active Toggle Pill */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "9px",
                            background: `${item.accentColor}18`,
                            color: item.accentColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <item.icon size={16} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.title}
                          </div>
                        </div>
                      </div>

                      {/* Modern Pill Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleQrKey(item.key)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: isSelected ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid var(--border-medium)",
                          background: isSelected ? "rgba(16, 185, 129, 0.12)" : "var(--bg-surface-elevated)",
                          color: isSelected ? "#059669" : "var(--text-secondary)",
                          transition: "all 0.15s ease",
                          flexShrink: 0,
                        }}
                        title={isSelected ? "Click to remove from catalogue" : "Click to include in catalogue"}
                      >
                        {isSelected ? (
                          <>
                            <Check size={12} strokeWidth={2.8} /> In Catalogue
                          </>
                        ) : (
                          <>
                            <Plus size={12} strokeWidth={2.4} /> Add
                          </>
                        )}
                      </button>
                    </div>

                    {/* Card Body: QR preview + Input */}
                    <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                      {/* QR Preview Tile */}
                      <div style={{ width: "84px", flexShrink: 0, textAlign: "center" }}>
                        <div
                          style={{
                            width: "84px",
                            height: "84px",
                            background: "#ffffff",
                            borderRadius: "10px",
                            padding: "5px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {qrDataUrls[item.key] ? (
                            <img
                              src={qrDataUrls[item.key]}
                              alt={`${item.title} QR`}
                              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", borderRadius: "6px" }}
                            />
                          ) : (
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Generating...</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadQr(item.downloadName, qrDataUrls[item.key])}
                          style={{
                            marginTop: "6px",
                            width: "100%",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: item.accentColor,
                            background: `${item.accentColor}12`,
                            border: `1px solid ${item.accentColor}30`,
                            borderRadius: "6px",
                            padding: "3px 4px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            transition: "all 0.15s ease",
                          }}
                          title="Download scannable QR code PNG"
                        >
                          <DownloadCloud size={11} /> PNG
                        </button>
                      </div>

                      {/* URL input and action buttons */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <input
                          type="text"
                          className="input-field"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            borderRadius: "8px",
                            border: "1px solid var(--border-medium)",
                            background: "var(--bg-surface-elevated)",
                            color: "var(--text-primary)",
                            outline: "none",
                          }}
                          placeholder={item.placeholder}
                          value={qrLinks[item.key] || ""}
                          onChange={(e) => handleQrLinkChange(item.key, e.target.value)}
                        />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <a
                            href={qrLinks[item.key] || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "0.76rem",
                              fontWeight: 600,
                              color: item.accentColor,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 4px",
                              borderRadius: "4px",
                            }}
                          >
                            <ExternalLink size={12} /> {item.actionLabel}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(qrLinks[item.key], item.key)}
                            style={{
                              fontSize: "0.76rem",
                              fontWeight: 600,
                              color: copyFeedback === item.key ? "#059669" : "var(--text-secondary)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 4px",
                              borderRadius: "4px",
                            }}
                          >
                            <Copy size={12} /> {copyFeedback === item.key ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* STEP 3: PRODUCTS CHECKLIST */}
      <div className="card no-print" style={{ marginBottom: "1.5rem", padding: "1.25rem", border: "1px solid var(--border-medium)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Boxes size={20} color="var(--primary)" />
            Step 4: Products to Include ({visibleProducts.length}/{companyProducts.length})
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {selectedCompanyId && (
              <Link
                to={`/companies/${selectedCompanyId}/catalogue`}
                className="btn btn-outline btn-sm"
                style={{ color: "var(--success)", borderColor: "var(--success)", fontWeight: 700, fontSize: "0.82rem" }}
              >
                <Plus size={15} /> Add More Products
              </Link>
            )}
            {companyProducts.length > 0 && (
              <button className="btn btn-outline btn-sm" onClick={handleSelectAll} style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                {selectedProductIds.length === companyProducts.length ? "Deselect All" : "Select All Products"}
              </button>
            )}
          </div>
        </div>

        {/* Product checklist */}
        {companyProducts.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-medium)" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "0.75rem", fontWeight: 600 }}>
              No products found in <strong>{currentCompany.name}</strong>'s catalogue.
            </div>
            <Link to={`/companies/${selectedCompanyId}/catalogue`} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
              <Plus size={15} /> Click to Add Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              background: "var(--bg-surface-elevated)",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-medium)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.6rem",
            }}
          >
            {companyProducts.map((p) => {
              const isChecked = selectedProductIds.includes(p._id);
              return (
                <label
                  key={p._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.86rem",
                    color: isChecked ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "3px 6px",
                    borderRadius: "6px",
                    background: isChecked ? "var(--bg-surface)" : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleProduct(p._id)}
                    style={{ accentColor: "var(--primary)", transform: "scale(1.1)" }}
                  />
                  <span style={{ fontWeight: 800, color: "var(--primary)" }}>{p.sku}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                    {p.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 4: DYNAMIC CATALOGUE STUDIO / LIVE PREVIEW */}
      {studioEngine === "dynamic" ? (
        <div style={{ marginBottom: "2rem" }}>
          <DynamicCatalogueStudio
            company={currentCompany}
            products={visibleProducts}
            activeQrList={activeQrList}
            includeQr={includeQrInCatalogue}
          />
        </div>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }} className="no-print">
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Eye size={20} color="var(--primary)" /> Live Catalogue Preview
          </div>
          <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            Format: <strong style={{ color: "var(--primary)", fontWeight: 800 }}>{CANVA_TEMPLATES.find((t) => t.id === templateId)?.name}</strong> • Company: <strong style={{ color: "var(--text-primary)", fontWeight: 800 }}>{currentCompany.name}</strong>
          </span>
        </div>

        {/* ACTUAL PDF DOCUMENT CONTAINER */}
        <div
          ref={pdfPrintRef}
          className="pdf-preview-canvas"
          style={getCanvasContainerStyle()}
        >
          {/* EMPTY STATE */}
          {visibleProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(0,0,0,0.03)", borderRadius: "8px", border: "2px dashed #cbd5e1" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📦</div>
              <h3 style={{ fontSize: "1.25rem", color: secondaryColor, fontWeight: 700, margin: 0 }}>
                No Products Selected in this Catalogue
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "6px 0 1.25rem 0" }}>
                Add or select products for {currentCompany.name || "this company"} to compile and preview the catalogue.
              </p>
              <Link to={`/companies/${selectedCompanyId}/catalogue`} className="btn btn-primary" style={{ display: "inline-flex", gap: "0.4rem" }}>
                <Plus size={16} /> Add Products to {currentCompany.name || "Company"}
              </Link>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUPREME ARCHITECTURAL FORMAT (Exact Match to Reference PDF)               */}
          {/* ========================================================================= */}
          {templateId === "supreme_architectural" && visibleProducts.length > 0 && (
            <div style={{ background: "#F5F6F0", color: "#111111" }}>
              
              {/* PAGE 1: COVER PAGE */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p1") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", position: "relative", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  {/* Decorative Olive Border Pinstripes */}
                  <div style={{ position: "absolute", left: "1.2rem", top: "2rem", bottom: "2rem", width: "3px", background: "#5C6B50" }} />
                  <div style={{ position: "absolute", left: "1.6rem", top: "2.5rem", bottom: "2.5rem", width: "1px", background: "#5C6B50" }} />
                  <div style={{ position: "absolute", right: "1.2rem", top: "2rem", bottom: "2rem", width: "3px", background: "#5C6B50" }} />
                  <div style={{ position: "absolute", right: "1.6rem", top: "2.5rem", bottom: "2.5rem", width: "1px", background: "#5C6B50" }} />

                  {/* Top Logo & Brand Name */}
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <img
                      src={currentCompany.logoUrl || "/assets/reference/p1_2.png"}
                      alt={currentCompany.name}
                      style={{ height: "46px", objectFit: "contain", margin: "0 auto 6px auto", display: "block" }}
                    />
                    <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.01em", color: "#111111", margin: 0 }}>
                      {currentCompany.name}
                    </h1>
                  </div>

                  {/* Hero Architecture Photo with Angled Polygon Cut */}
                  <div style={{ position: "relative", margin: "0 1.5rem", flex: 1, minHeight: "600px", overflow: "hidden" }}>
                    <img
                      src="/assets/reference/p1_1.jpg"
                      alt="Hero Architecture"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)" }}
                    />

                    {/* Slanted Cursive Badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "30px",
                        background: "#FFFFFF",
                        padding: "1.5rem 2.5rem",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "3rem", fontWeight: 700, color: "#111111", lineHeight: 1 }}>
                        Kota Stone
                      </div>
                    </div>
                  </div>

                  {/* Three-Dot Tagline */}
                  <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.45rem", color: "#222222", letterSpacing: "0.08em" }}>
                      Natural &nbsp; &nbsp; • &nbsp; &nbsp; Durable &nbsp; &nbsp; • &nbsp; &nbsp; Timeless
                    </div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem", color: "#555555", margin: "0.75rem auto 0 auto", maxWidth: "620px", lineHeight: 1.5 }}>
                      We trade across India with <strong>Nationwide Coverage</strong>, ensuring smooth execution from selection to completion.
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 2: ABOUT US & LEGACY */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p2") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  {/* Header bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #D8DDD0", paddingBottom: "1rem", marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                      {currentCompany.name}
                    </h2>
                    <img
                      src={currentCompany.logoUrl || "/assets/reference/p1_2.png"}
                      alt="Logo"
                      style={{ height: "32px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Content Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", flex: 1 }}>
                    <div>
                      <img
                        src="/assets/reference/p2_1.jpg"
                        alt="Quarry Legacy"
                        style={{ width: "100%", height: "100%", maxHeight: "800px", objectFit: "cover", display: "block" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                          About Us
                        </h3>
                        <p style={{ fontSize: "0.82rem", color: "#333333", lineHeight: 1.6, margin: "0 0 0.4rem 0" }}>
                          {currentCompany.name} is one of Bangalore's trusted names in premium granite and natural stone.
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "#333333", lineHeight: 1.6, margin: 0 }}>
                          We combine craftsmanship, precision, and innovation to deliver materials that meet both aesthetic and functional demands. From sourcing to finishing, every slab reflects our commitment to quality and consistency.
                        </p>
                      </div>

                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                          Our Legacy
                        </h3>
                        <p style={{ fontSize: "0.82rem", color: "#333333", lineHeight: 1.6, margin: "0 0 0.4rem 0" }}>
                          Built on years of experience, SGS stands for reliability, expertise, and enduring design. We work across residential, commercial, hospitality, and landscape projects—bringing architectural visions to life.
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "#333333", lineHeight: 1.6, margin: 0 }}>
                          Kota stone, known for its durability and timeless appeal, remains a key part of our offering—ideal for both modern and traditional spaces.
                        </p>
                      </div>

                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                          What We Do
                        </h4>
                        <ul style={{ paddingLeft: "1.2rem", fontSize: "0.82rem", color: "#333333", lineHeight: 1.7, margin: 0 }}>
                          <li>Residential Projects</li>
                          <li>Hospitality Projects</li>
                          <li>Commercial Developments</li>
                          <li>Landscaping &amp; Outdoor Applications</li>
                          <li>Architectural &amp; Decorative Works</li>
                        </ul>
                      </div>

                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                          Why Choose Us
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.8rem", color: "#333333" }}>
                          <div>• Quality Assurance</div>
                          <div>• Customer Satisfaction</div>
                          <div>• Timely Delivery</div>
                          <div>• Eco-friendly Practices</div>
                          <div>• Durable Materials</div>
                          <div>• Advanced Technology</div>
                          <div>• Competitive Pricing</div>
                          <div>• Reliable Partnerships</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div style={{ borderTop: "1px solid #D8DDD0", paddingTop: "1rem", marginTop: "2rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#444444" }}>
                    <div>📍 {currentCompany.contact?.address}</div>
                    <div>📞 {currentCompany.contact?.phone}</div>
                  </div>
                </div>
              )}

              {/* PAGE 3: UNDERSTANDING & KEY BENEFITS */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p3") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2.5rem", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.1rem", fontWeight: 700, color: "#111111", lineHeight: 1.2, margin: "0 0 1.5rem 0" }}>
                          UNDERSTANDING<br />KOTA STONE
                        </h2>

                        <div style={{ marginBottom: "2rem" }}>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                            What Is Kota Stone :
                          </h4>
                          <p style={{ fontSize: "0.85rem", color: "#444444", lineHeight: 1.65, margin: "0 0 0.75rem 0" }}>
                            Kota Stone is a fine-grained limestone from the extensive Kota region of Rajasthan. Known for its layered formation and naturally cemented structure, it features unique grey and green hues.
                          </p>
                          <p style={{ fontSize: "0.85rem", color: "#444444", lineHeight: 1.65, margin: 0 }}>
                            This stone is sourced directly from quarries and is widely used for its durability and natural appeal.
                          </p>
                        </div>

                        <div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#111111", margin: "0 0 1.25rem 0", letterSpacing: "0.04em" }}>
                            KEY BENEFITS
                          </h3>

                          {/* 3 Benefit Rows with Icons */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                              <img src="/assets/reference/p3_7.png" alt="Durability" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111111", textTransform: "uppercase" }}>
                                  EXCEPTIONAL DURABILITY
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#555555", marginTop: "2px" }}>
                                  High compressive strength enables it to withstand heavy foot traffic.
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                              <img src="/assets/reference/p3_8.png" alt="Non-Slip" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111111", textTransform: "uppercase" }}>
                                  NATURALLY NON-SLIP SURFACE
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#555555", marginTop: "2px" }}>
                                  The texture retains safe grip even when wet, making it ideal for walkways and poolside areas.
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                              <img src="/assets/reference/p3_9.png" alt="Eco-Friendly" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111111", textTransform: "uppercase" }}>
                                  ECO-FRIENDLY &amp; NATURAL
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#555555", marginTop: "2px" }}>
                                  Sustainable, cool-to-touch material with unique mineral patterns.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Logo */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #D8DDD0", paddingTop: "1rem" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem" }}>{currentCompany.name}</span>
                        <img src="/assets/reference/p1_2.png" alt="SGS" style={{ height: "24px" }} />
                      </div>
                    </div>

                    {/* Right Chevron Mask Image */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src="/assets/reference/p3_1.jpg"
                        alt="Quarry Overview"
                        style={{ width: "100%", height: "100%", minHeight: "750px", objectFit: "cover", clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 4: PRODUCT SHOWCASE & SPECIFICATIONS TABLE */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p4") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                        Kota Stone<br />Natural Green
                      </h2>
                      <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem", color: "#5C6B50", margin: "6px 0 1.5rem 0" }}>
                        #KS-01-NGKS
                      </div>

                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.06em", color: "#111111", margin: "0 0 1rem 0" }}>
                        AVAILABLE COLORS:
                      </h4>

                      {/* Color Swatch Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        {[
                          { name: "Natural Yellow", sku: "#KS-02-NYKS", img: "/assets/reference/p4_2.jpg" },
                          { name: "Mandana Red", sku: "#KS-03-MRKS", img: "/assets/reference/p4_3.jpg" },
                          { name: "Charcoal Black", sku: "#KS-04-CBKS", img: "/assets/reference/p4_4.jpg" },
                          { name: "Natural Grey", sku: "#KS-05-NGKS", img: "/assets/reference/p4_5.jpg" },
                          { name: "Natural Blue", sku: "#KS-06-NBKS", img: "/assets/reference/p4_6.jpg" },
                        ].map((swatch, sIdx) => (
                          <div key={sIdx} style={{ textAlign: "center" }}>
                            <img
                              src={swatch.img}
                              alt={swatch.name}
                              style={{ width: "65px", height: "65px", borderRadius: "10px", objectFit: "cover", margin: "0 auto", display: "block", border: "1px solid #D8DDD0" }}
                            />
                            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#111111", marginTop: "4px" }}>
                              {swatch.name}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#666666", fontFamily: "monospace" }}>
                              {swatch.sku}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Texture Sample */}
                    <div>
                      <img
                        src="/assets/reference/p4_1.jpg"
                        alt="Natural Green"
                        style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px", border: "2px solid #5C6B50" }}
                      />
                    </div>
                  </div>

                  {/* Specifications Boxed Table */}
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ borderTop: "3px solid #5C6B50", paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                        Specifications : <span style={{ fontSize: "0.95rem", fontWeight: 400, color: "#555555" }}>(With Calibration and Box packing)</span>
                      </h3>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #111111", textAlign: "left", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #111111", background: "#EAECE4" }}>
                          <th style={{ padding: "10px 14px", borderRight: "1px solid #111111" }}>Sizes</th>
                          <th style={{ padding: "10px 14px", borderRight: "1px solid #111111" }}>Finishes</th>
                          <th style={{ padding: "10px 14px" }}>Thickness</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "16px 14px", verticalAlign: "top", borderRight: "1px solid #111111", lineHeight: 1.8 }}>
                            <div>2 ft x 2 ft [ 22" x 22" ]</div>
                            <div>2 ft x 4 ft [ 22" x 46" ]</div>
                          </td>
                          <td style={{ padding: "16px 14px", verticalAlign: "top", borderRight: "1px solid #111111", lineHeight: 1.8 }}>
                            <div>Semi. Polish</div>
                            <div>High. Polish</div>
                            <div>Mirror. Polish</div>
                            <div>Leather</div>
                            <div>Rough</div>
                            <div>Satin</div>
                          </td>
                          <td style={{ padding: "16px 14px", verticalAlign: "middle", textAlign: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                            18 - 20 mm
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAGE 5: SURFACE FINISHES */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p5") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #D8DDD0", paddingBottom: "1rem", marginBottom: "2rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>{currentCompany.name}</span>
                    <img src="/assets/reference/p1_2.png" alt="SGS" style={{ height: "30px" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", marginBottom: "3rem" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 700, color: "#111111", margin: "0 0 1rem 0" }}>
                        SURFACE<br />FINISHES
                      </h2>
                      <p style={{ fontSize: "0.88rem", color: "#333333", lineHeight: 1.65, maxWidth: "450px" }}>
                        Our range of surface finishes enhances the natural character of Kota Stone while offering versatility for a wide range of applications.
                      </p>
                      <div style={{ borderLeft: "3px solid #5C6B50", paddingLeft: "1rem", margin: "1.5rem 0", fontStyle: "italic", fontSize: "0.95rem", color: "#5C6B50" }}>
                        Naturally textured. Expertly finished. Built to last.
                      </div>
                    </div>

                    <div>
                      <img
                        src="/assets/reference/p5_1.jpg"
                        alt="Surface Texture"
                        style={{ width: "100%", height: "260px", objectFit: "cover", clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
                      />
                    </div>
                  </div>

                  {/* 3 Finish Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "auto" }}>
                    {[
                      {
                        title: "MIRROR POLISH FINISHE",
                        desc: "An ultra-gloss finish that delivers max reflection, depth, and luxurious visual appeal.",
                        img: "/assets/reference/p5_2.png",
                      },
                      {
                        title: "LEATHER FINISHE",
                        desc: "A refined matte texture with enhanced grip and a contemporary appearance.",
                        img: "/assets/reference/p5_3.png",
                      },
                      {
                        title: "SEMI-POLISH FINISHE",
                        desc: "A subtle sheen that enhances the stone's beauty while maintaining its natural look.",
                        img: "/assets/reference/p5_4.png",
                      },
                    ].map((card, cIdx) => (
                      <div key={cIdx} style={{ background: "#FFFFFF", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                        <div style={{ height: "140px", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
                          <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                          {card.title}
                        </h4>
                        <p style={{ fontSize: "0.78rem", color: "#555555", lineHeight: 1.5, margin: 0 }}>
                          {card.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer Tagline */}
                  <div style={{ textAlign: "center", borderTop: "1px solid #D8DDD0", paddingTop: "1.5rem", marginTop: "2.5rem", fontSize: "0.85rem", color: "#5C6B50", letterSpacing: "0.1em" }}>
                    Natural Beauty &nbsp; • &nbsp; Enhanced Durability &nbsp; • &nbsp; Low Maintenance
                  </div>
                </div>
              )}

              {/* PAGE 6: VERSATILE APPLICATIONS (GALLERY) */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p6") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                      VERSATILE APPLICATIONS
                    </h2>
                    <p style={{ fontStyle: "italic", fontSize: "1.1rem", color: "#555555", margin: "4px 0 0 0" }}>
                      Luxury For Every Space ...
                    </p>
                  </div>

                  {/* 5-Photo Gallery Collage */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flex: 1 }}>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>1. Staircases</div>
                      <img src="/assets/reference/p6_1.jpg" alt="Staircases" style={{ width: "100%", height: "230px", borderRadius: "10px", objectFit: "cover" }} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>2. Interior Flooring</div>
                      <img src="/assets/reference/p6_2.jpg" alt="Interior Flooring" style={{ width: "100%", height: "230px", borderRadius: "10px", objectFit: "cover" }} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>3. Hospitality &amp; Outdoor Leisure Spaces...</div>
                      <img src="/assets/reference/p6_3.jpg" alt="Hospitality" style={{ width: "100%", height: "220px", borderRadius: "10px", objectFit: "cover" }} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>4. Outdoor Pathways &amp; Landscaping</div>
                      <img src="/assets/reference/p6_4.jpg" alt="Pathways" style={{ width: "100%", height: "230px", borderRadius: "10px", objectFit: "cover" }} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>5. Commercial Spaces</div>
                      <img src="/assets/reference/p6_5.jpg" alt="Commercial Spaces" style={{ width: "100%", height: "230px", borderRadius: "10px", objectFit: "cover" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #D8DDD0", paddingTop: "1rem", marginTop: "2rem" }}>
                    <span style={{ fontWeight: 700 }}>{currentCompany.name}</span>
                    <img src="/assets/reference/p1_2.png" alt="SGS" style={{ height: "24px" }} />
                  </div>
                </div>
              )}

              {/* PAGE 7: CNC PATTERNS */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p7") && (
                <div style={{ padding: "3rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", borderBottom: supremeActiveTab === "all" ? "4px dashed #D8DDD0" : "none" }}>
                  <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                      SPECIAL CNC PATTERNS :
                    </h2>
                    <p style={{ fontSize: "0.95rem", color: "#555555", margin: "4px 0 0 0" }}>
                      (Can Be Customized Based On Requirement) ..
                    </p>
                  </div>

                  {/* 6 Patterns Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", flex: 1 }}>
                    {[
                      { name: "Radial X Pattern", desc: "Crosshair angled radial lines" },
                      { name: "Radial Split Pattern", desc: "8-point radial starburst" },
                      { name: "Diamond Layout", desc: "Framed concentric diamond" },
                      { name: "Diamond Grid Pattern", desc: "Interlocking diagonal grid" },
                      { name: "Triangular Tessellation", desc: "Geometric diagonal matrix" },
                      { name: "Square Grid Pattern", desc: "Symmetrical square tiles" },
                    ].map((pat, pIdx) => (
                      <div key={pIdx} style={{ textAlign: "center" }}>
                        <div style={{ width: "100%", height: "180px", background: "#7D8C7C", borderRadius: "12px", border: "2px solid #5C6B50", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
                          {/* SVG Geometric pattern */}
                          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {pIdx === 0 && <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="2" />}
                            {pIdx === 1 && <path d="M0,0 L100,100 M100,0 L0,100 M50,0 L50,100 M0,50 L100,50" stroke="#fff" strokeWidth="1.5" />}
                            {pIdx === 2 && <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#fff" strokeWidth="2" />}
                            {pIdx === 3 && <path d="M25,0 L100,75 M0,25 L75,100 M0,75 L75,0 M25,100 L100,25" stroke="#fff" strokeWidth="1.5" />}
                            {pIdx === 4 && <path d="M0,0 L100,100 M0,50 L50,100 M50,0 L100,50 M0,100 L100,0" stroke="#fff" strokeWidth="1.5" />}
                            {pIdx === 5 && <path d="M25,0 L25,100 M50,0 L50,100 M75,0 L75,100 M0,25 L100,25 M0,50 L100,50 M0,75 L100,75" stroke="#fff" strokeWidth="1.5" />}
                          </svg>
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#111111", margin: "8px 0 2px 0" }}>
                          {pat.name}
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "#666666" }}>{pat.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #D8DDD0", paddingTop: "1rem", marginTop: "2rem" }}>
                    <span style={{ fontWeight: 700 }}>{currentCompany.name}</span>
                    <img src="/assets/reference/p1_2.png" alt="SGS" style={{ height: "24px" }} />
                  </div>
                </div>
              )}

              {/* PAGE 9: GET IN TOUCH & QR CODES (BACK COVER) */}
              {(supremeActiveTab === "all" || supremeActiveTab === "p9") && (
                <div style={{ padding: "3.5rem 2.5rem", minHeight: "1100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 700, color: "#111111", margin: "0 0 0.5rem 0" }}>
                      GET IN TOUCH
                    </h2>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.3rem", fontWeight: 400, color: "#5C6B50", margin: "0 0 2.5rem 0" }}>
                      CONTACT US
                    </h3>
                  </div>

                  {/* Top Digital Business Profile & Instant Enquiry Card */}
                  {includeQrInCatalogue && (
                    <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.5rem 2.25rem", marginBottom: "1.75rem", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", border: "2px solid #5C6B50" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#5C6B50", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          ✦ OFFICIAL DIGITAL SHOWCASE &amp; REAL-TIME CATALOGUE ✦
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.65rem", fontWeight: 700, color: "#111111", margin: "4px 0" }}>
                          Scan to View {currentCompany.name} Online
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "#555555", margin: 0, maxWidth: "480px", lineHeight: 1.5 }}>
                          Access real-time slab inventory, custom CNC designs, architectural spec sheets &amp; direct enquiry portal.
                        </p>
                        {qrLinks.businessProfile && (
                          <div style={{ fontSize: "0.75rem", color: "#5C6B50", marginTop: "6px", fontWeight: 600, wordBreak: "break-all" }}>
                            🔗 {qrLinks.businessProfile}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <a href={qrLinks.businessProfile || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#F5F6F0", padding: "8px", borderRadius: "10px", border: "1px solid #5C6B50", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                          <img
                            src={qrDataUrls.businessProfile || "/assets/reference/p9_2.png"}
                            alt="Digital Business Profile QR"
                            style={{ width: "115px", height: "115px", display: "block" }}
                          />
                        </a>
                        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#111111", marginTop: "4px", letterSpacing: "0.05em" }}>
                          SCAN DIGITAL PROFILE
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Selected QR Codes Container */}
                  {includeQrInCatalogue && activeQrList.length > 0 && (
                    <div style={{ background: "#C5CBBF", borderRadius: "20px", padding: "2.25rem", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", marginBottom: "2rem" }}>
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
                              ? "repeat(2, 1fr)"
                              : "repeat(3, 1fr)",
                          gap: "2rem",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        {activeQrList.map((box, bIdx) => (
                          <div key={bIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <a href={box.link || "#"} target="_blank" rel="noopener noreferrer" style={{ background: "#fff", padding: "10px", borderRadius: "10px", display: "inline-block", boxShadow: "0 4px 15px rgba(0,0,0,0.06)", textDecoration: "none" }}>
                              <img src={box.qr} alt={box.title} style={{ width: "110px", height: "110px", objectFit: "contain", display: "block" }} />
                            </a>
                            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111111", letterSpacing: "0.08em", marginTop: "8px" }}>
                              {box.title}
                            </div>
                            <a href={box.link || "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: "#333333", textDecoration: "underline", fontWeight: 600 }}>
                              {box.subtitle}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Address & Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem", borderTop: "2px solid #5C6B50", paddingTop: "1.5rem" }}>
                    <div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
                        ADDRESS
                      </h4>
                      <p style={{ fontSize: "0.85rem", color: "#333333", lineHeight: 1.5, margin: 0 }}>
                        {currentCompany.contact?.address}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
                        PHONE
                      </h4>
                      <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                        {currentCompany.contact?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ========================================================================= */}
          {/* DYNAMIC CATALOGUE SYSTEM (All Canva Presets & User Custom Designs)        */}
          {/* ========================================================================= */}
          {templateId !== "supreme_architectural" && visibleProducts.length > 0 && (
            <DynamicCatalogueRenderer
              products={visibleProducts}
              currentCompany={currentCompany}
              designConfig={designConfig}
              currencySymbol={currencySymbol}
              includeQrInCatalogue={includeQrInCatalogue}
              activeQrList={activeQrList}
              qrDataUrls={qrDataUrls}
              qrLinks={qrLinks}
            />
          )}
        </div>
      </div>
      )}

      {/* CREATE NEW COMPANY PROFILE MODAL */}
      {isCompanyModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCompanyModalOpen(false)}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "auto",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 size={18} color="var(--primary)" /> Add New Company Profile
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsCompanyModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: "0.85rem" }}
                  placeholder="e.g. Supreme Granite & Stones"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={newCompany.tagline}
                    onChange={(e) => setNewCompany({ ...newCompany, tagline: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Industry
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsCompanyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Company Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
