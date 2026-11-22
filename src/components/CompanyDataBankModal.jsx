import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Database,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  FileText,
  Sliders,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Maximize2,
  Copy,
  Tag,
  Boxes,
  HelpCircle,
  FolderPlus,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Table,
} from "lucide-react";
import { updateCompanyDataBank, resetCompanyDataBank } from "../services/api";
import {
  getDefaultDataBank,
  resolveCompanyCategory,
  resolveCompanyLocation,
} from "../utils/defaultDataBank";
import {
  parseDataBankCsv,
  generateCategoryDataBankTemplate,
  exportCurrentDataBankToCsv,
  downloadCsvFile,
} from "../utils/csvSheetHelper";

/**
 * Returns dynamic Data Bank labels, placeholders, and schemas
 * tailored faithfully to each company's authentic ODOP corridor/industry,
 * cataloged products, and country/district.
 */
export function getCategoryDataBankConfig(company) {
  const family = resolveCompanyCategory(company);
  const loc = resolveCompanyLocation(company);
  const sym = loc.currencySymbol || "₹";
  const locLabel = loc.locationDisplay || "Rajasthan, India";

  const configs = {
    garlic: {
      family: "garlic",
      icon: "🧄",
      corridorBadge: `✓ ODOP Garlic Corridor Connected (${locLabel})`,
      thicknessTitle: "Produce Grading, Bulb Caliber & Mandi Rate Presets",
      thicknessSubtitle:
        `Select bulb caliber/grade to auto-calculate wholesale Mandi selling rate (${sym}/kg), list price, and price range.`,
      thicknessColHeader: "Bulb Caliber / Produce Grade",
      rateColHeader: `Mandi Rate (${sym}/kg)`,
      mrpColHeader: `Mandi MRP (${sym}/kg)`,
      priceUnit: "/ kg",
      addThicknessTitle: "+ Add New Produce Grade / Sizing Preset",
      thicknessPlaceholder: "e.g. 50 - 65 mm (Grade A+ Large)",
      chipPlaceholder: "Chip (e.g. 50-65mm A+)",
      ratePlaceholder: `Rate ${sym} (per kg)`,
      mrpPlaceholder: `Mandi MRP ${sym}`,
      rangePlaceholder: `Range e.g. ${sym}200 – ${sym}260 / kg`,

      sizesTitle: "📐 Saved Bulb Calibers & Sizing Dimensions",
      sizesSubtitle: "Bulb diameter ranges, clove counts, and mandi grading calipers",
      sizePlaceholder: "e.g. 50 - 65 mm (Grade A+ Large Bulbs)",

      finishesTitle: "✨ Curing Standards & Outer Skin Finishes",
      finishesSubtitle: "Natural sun-curing, root trimming, and clove skin protection",
      finishPlaceholder: "e.g. Sun-Cured Clean White Skin, Clean Cut Roots",

      materialsTitle: "🎯 Cultivar Varieties & Mandi Agro Standards",
      materialsSubtitle: "Organic provenance, allicin content standards, and certification",
      materialPlaceholder: "e.g. 100% Organically Grown Malwa Garlic (Moisture < 65%)",

      priceRangesTitle: "💰 Mandi Rates & Reference Price Ranges",
      priceRangesSubtitle: "Wholesale auction benchmarks, grading rates, and seasonal market price ranges",
      priceRangePlaceholder: "e.g. ₹180 – ₹240 / kg (Grade A Cured)",

      headingsCategoryOptions: [
        "Cover / Title",
        "Section Title",
        "Produce Hero",
        "Farm Provenance",
        "Harvest Story",
        "Agro Quality",
      ],
      headingPlaceholder: "Enter pre-filled harvest title (e.g. Malwa Sun-Cured Garlic)...",
      taglinePlaceholder: "e.g. Farm-Fresh High-Allicin Cured Garlic Bulbs...",
      paragraphsCategoryOptions: [
        "Harvest Story",
        "Quality Standards",
        "Export Packing",
        "Health & Allicin",
        "Mandi Trade",
      ],
      paragraphTitlePlaceholder: "e.g. Malwa Soil Provenance & Bioactive Potency",
      paragraphTextPlaceholder:
        "Enter detailed copy about garlic harvest, allicin potency, or curing standards...",
      highlightPlaceholder:
        "e.g. High natural allicin content delivering strong medicinal potency and pungency",
    },

    kotastone: {
      family: "kotastone",
      icon: "🏛️",
      corridorBadge: `✓ ODOP Kota Stone Corridor Connected (${locLabel})`,
      thicknessTitle: "Stone Thickness & Quarry Calibration Rate Presets",
      thicknessSubtitle:
        `Select stone thickness/gauging to auto-calculate quarry rate (${sym}/sq.ft), list MRP, and price range.`,
      thicknessColHeader: "Stone Thickness & Calibration",
      rateColHeader: `Quarry Rate (${sym}/sq.ft)`,
      mrpColHeader: `List MRP (${sym}/sq.ft)`,
      priceUnit: "/ sq.ft",
      addThicknessTitle: "+ Add New Stone Thickness / Gauging Preset",
      thicknessPlaceholder: "e.g. 20 - 25 mm Gauged (Standard Flooring)",
      chipPlaceholder: "Chip (e.g. 20-25mm)",
      ratePlaceholder: `Rate ${sym} (per sq.ft)`,
      mrpPlaceholder: `List MRP ${sym}`,
      rangePlaceholder: `Range e.g. ${sym}55 – ${sym}85 / sq.ft`,

      sizesTitle: "📐 Saved Tile Plan Sizes & Slab Dimensions",
      sizesSubtitle: "Precision sawn tile dimensions, pavement slabs, and grand formats",
      sizePlaceholder: "e.g. 2×2 ft (600×600 mm) Square Tile",

      finishesTitle: "✨ Surface Finishes & Edge Treatments",
      finishesSubtitle: "Diamond machine honing, mirror polish, river wash, and chisel cuts",
      finishPlaceholder: "e.g. Mirror High Polish (Diamond Machine Honed)",

      materialsTitle: "🎯 Limestone Geological Formations & Commercial Applications",
      materialsSubtitle: "Indurated limestone beds, compressive strength, and high-traffic uses",
      materialPlaceholder: "e.g. Natural Indurated Limestone / Heavy Traffic Corridors",

      priceRangesTitle: "💰 Quarry Rates & Reference Price Ranges",
      priceRangesSubtitle: "Direct quarry rates, slab benchmarks, and calibrated tile price ranges",
      priceRangePlaceholder: "e.g. ₹85 – ₹140 / sq.ft (Calibrated Heavy)",

      headingsCategoryOptions: [
        "Cover / Title",
        "Section Title",
        "Product Hero",
        "Quarry Provenance",
        "Architectural Specs",
        "Project Applications",
      ],
      headingPlaceholder: "Enter pre-filled stone title (e.g. Mirror High Polish Slabs)...",
      taglinePlaceholder: "e.g. Naturally cool underfoot, non-porous, and wear resistant...",
      paragraphsCategoryOptions: [
        "Brand Story",
        "Quarry Heritage",
        "Technical Strength",
        "Finish Details",
        "Installation Guide",
      ],
      paragraphTitlePlaceholder: "e.g. About Our Ramganj Mandi Quarry",
      paragraphTextPlaceholder:
        "Enter detailed copy about stone extraction, water absorption, or compressive strength...",
      highlightPlaceholder:
        "e.g. Non-porous, naturally cool underfoot, and non-slip surface in wet conditions",
    },

    sandstone: {
      family: "sandstone",
      icon: "🪨",
      corridorBadge: `✓ ODOP Sandstone Corridor Connected (${locLabel})`,
      thicknessTitle: "Sandstone Thickness & Calibrated Rate Presets",
      thicknessSubtitle:
        `Select calibrated thickness to auto-calculate square-foot rate (${sym}/sq.ft), list MRP, and price range.`,
      thicknessColHeader: "Calibrated Thickness / Gauge",
      rateColHeader: `Sawn Rate (${sym}/sq.ft)`,
      mrpColHeader: `List MRP (${sym}/sq.ft)`,
      priceUnit: "/ sq.ft",
      addThicknessTitle: "+ Add New Sandstone Thickness Preset",
      thicknessPlaceholder: "e.g. 25 - 30 mm Calibrated (Standard Paving)",
      chipPlaceholder: "Chip (e.g. 25-30mm)",
      ratePlaceholder: `Rate ${sym} (per sq.ft)`,
      mrpPlaceholder: `List MRP ${sym}`,
      rangePlaceholder: `Range e.g. ${sym}110 – ${sym}180 / sq.ft`,

      sizesTitle: "📐 Saved Facade & Paving Slab Dimensions",
      sizesSubtitle: "Large format architectural slabs, cladding tiles, and CNC jali panels",
      sizePlaceholder: "e.g. 600×900 mm Architectural Sawn Slab",

      finishesTitle: "✨ Surface Textures & Rockface Treatments",
      finishesSubtitle: "Sandblasted satin, hand-chiseled rockface, flamed, and honed",
      finishPlaceholder: "e.g. Sandblasted / Honed Satin Matte",

      materialsTitle: "🎯 Quartzite Sandstone Varieties & Facade Applications",
      materialsSubtitle:
        "Dholpur Beige, Jodhpur Gold, Agra Red, and thermal insulated cladding",
      materialPlaceholder:
        "e.g. Natural Quartzite Sandstone / Exterior Facades & Cladding",

      priceRangesTitle: "💰 Sawn Slab Rates & Reference Price Ranges",
      priceRangesSubtitle: "Architectural cladding rates, jali screens, and project lot prices",
      priceRangePlaceholder: "e.g. ₹135 – ₹190 / sq.ft (Sandblasted Honed)",

      headingsCategoryOptions: [
        "Cover / Title",
        "Section Title",
        "Product Hero",
        "Quarry Source",
        "Architectural Facades",
        "Heritage Craft",
      ],
      headingPlaceholder: "Enter pre-filled sandstone title (e.g. Palatial Sandstone Facades)...",
      taglinePlaceholder: "e.g. High compressive strength with palatial weather durability...",
      paragraphsCategoryOptions: [
        "Quarry Heritage",
        "Architectural Facades",
        "Weather Durability",
        "Artisanal Masonry",
        "Installation Notes",
      ],
      paragraphTitlePlaceholder: "e.g. Sedimentary Quartz & Weather Resistance",
      paragraphTextPlaceholder:
        "Enter detailed copy about sandstone mining, facade jali screens, or ASTM standards...",
      highlightPlaceholder:
        "e.g. High compressive strength (> 110 MPa) with exceptional weather durability",
    },

    kotadoria: {
      family: "kotadoria",
      icon: "🧵",
      corridorBadge: `✓ ODOP Kota Doria Corridor Connected (${locLabel})`,
      thicknessTitle: "Fabric Length, Cut & Weaver Rate Presets",
      thicknessSubtitle:
        `Select fabric length/ensemble cut to auto-calculate saree/suit rate (${sym}), MRP, and boutique pricing.`,
      thicknessColHeader: "Fabric Length / Ensemble Cut",
      rateColHeader: `Weaver Rate (${sym})`,
      mrpColHeader: `Retail MRP (${sym})`,
      priceUnit: "/ piece",
      addThicknessTitle: "+ Add New Handloom Cut / Drape Preset",
      thicknessPlaceholder: "e.g. 6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in",
      chipPlaceholder: "Chip (e.g. 6.5m Saree)",
      ratePlaceholder: `Rate ${sym} (per piece)`,
      mrpPlaceholder: `MRP ${sym}`,
      rangePlaceholder: `Range e.g. ${sym}2,800 – ${sym}6,500`,

      sizesTitle: "📐 Saved Fabric Cuts, Saree Lengths & Yardage",
      sizesSubtitle:
        "Saree lengths with blouse pieces, dupattas, 3-piece suits, and running fabrics",
      sizePlaceholder: "e.g. 6.5 Metres (includes 80cm Running Blouse Piece)",

      finishesTitle: "✨ Zari Embellishments, Khat Checks & Artisan Finishes",
      finishesSubtitle:
        "Tested gold zari borders, silver zari, Bagru hand-block prints, and Chikankari",
      finishPlaceholder: "e.g. Traditional 300+ Square Khat Grid with Tested Gold Zari",

      materialsTitle: "🎯 Yarn Compositions, Weave Density & Attire Uses",
      materialsSubtitle:
        "Mulberry silk warp, fine combed cotton weft, and wedding ensembles",
      materialPlaceholder:
        "e.g. Pure Mulberry Silk Warp, Fine Cotton Weft / Bridal Wear",

      priceRangesTitle: "💰 Loom Rates & Reference Price Ranges",
      priceRangesSubtitle: "Handloom weaver rates, luxury bridal sarees, and boutique bundle prices",
      priceRangePlaceholder: "e.g. ₹2,450 – ₹6,500 / Saree",

      headingsCategoryOptions: [
        "Cover / Title",
        "Collection Title",
        "Artisan Spotlight",
        "GI Heritage",
        "Bridal Lookbook",
        "Weaving Legacy",
      ],
      headingPlaceholder: "Enter pre-filled handloom title (e.g. Royal Gold Zari Saree)...",
      taglinePlaceholder: "e.g. Signature gossamer silk-cotton with tested gold zari...",
      paragraphsCategoryOptions: [
        "Artisan Guild",
        "GI Tag Provenance",
        "The Khat Weave",
        "Care & Longevity",
        "Boutique Orders",
      ],
      paragraphTitlePlaceholder: "e.g. Kaithun Artisan Weaving Guild & GI Tag",
      paragraphTextPlaceholder:
        "Enter detailed copy about handloom pit-looms, mulberry silk warp, or zari interlocking...",
      highlightPlaceholder:
        "e.g. Certified Geographical Indication (GI Tag No. 37) Handloom Craft",
    },

    general: {
      family: "general",
      icon: "📦",
      corridorBadge: `✓ Enterprise Brand Connected (${locLabel})`,
      thicknessTitle: "Product Sizing, Grade & Rate Presets",
      thicknessSubtitle:
        `Configure standardized sizes and grades with automated pricing rules in ${sym}.`,
      thicknessColHeader: "Size / Grade / Model",
      rateColHeader: `Selling Rate (${sym})`,
      mrpColHeader: `List MRP (${sym})`,
      priceUnit: "",
      addThicknessTitle: "+ Add New Size / Grade Preset",
      thicknessPlaceholder: "e.g. Standard Model / Grade A",
      chipPlaceholder: "Chip Label",
      ratePlaceholder: `Rate ${sym}`,
      mrpPlaceholder: `MRP ${sym}`,
      rangePlaceholder: `Range e.g. ${sym}1,000 – ${sym}2,500`,

      sizesTitle: "📐 Saved Dimensions & Measurements",
      sizesSubtitle: "Standard measurements, packaging formats, and sizes",
      sizePlaceholder: "e.g. Standard Size",

      finishesTitle: "✨ Surface Finishes & Treatments",
      finishesSubtitle: "Colors, surface finishes, and quality treatments",
      finishPlaceholder: "e.g. Premium Matte Finish",

      materialsTitle: "🎯 Materials & Commercial Applications",
      materialsSubtitle: "Material composition and primary usage applications",
      materialPlaceholder: "e.g. Commercial Grade Material",

      priceRangesTitle: "💰 Reference Price Ranges",
      priceRangesSubtitle: "Commercial rates and trade price ranges",
      priceRangePlaceholder: "e.g. ₹1,000 – ₹2,500",

      headingsCategoryOptions: [
        "Cover / Title",
        "Section Title",
        "Product Hero",
        "Company Heritage",
      ],
      headingPlaceholder: "Enter pre-filled headline text...",
      taglinePlaceholder: "Enter pre-filled tagline or subtitle...",
      paragraphsCategoryOptions: [
        "Brand Story",
        "Product Quality",
        "Commercial Terms",
      ],
      paragraphTitlePlaceholder: "e.g. Brand Story & Quality Benchmark",
      paragraphTextPlaceholder: "Enter detailed paragraph copy...",
      highlightPlaceholder:
        "e.g. Certified authentic craftsmanship meeting statutory quality benchmarks",
    },
  };

  return configs[family] || configs.general;
}

export default function CompanyDataBankModal({
  isOpen,
  onClose,
  company,
  onSave,
  initialTab = "specs",
  onOpenProductSheetUpload = null,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dataBank, setDataBank] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sheet Upload & Spreadsheet Template State
  const [sheetFileName, setSheetFileName] = useState("");
  const [sheetUploadRawText, setSheetUploadRawText] = useState("");
  const [sheetParsedData, setSheetParsedData] = useState(null);
  const [sheetImportMode, setSheetImportMode] = useState("merge"); // "merge" | "replace"
  const [isParsingSheet, setIsParsingSheet] = useState(false);
  const [sheetDragOver, setSheetDragOver] = useState(false);
  const [sheetInputMethod, setSheetInputMethod] = useState("file"); // "file" | "paste"
  const [showStructureGuide, setShowStructureGuide] = useState(false);
  const sheetFileInputRef = useRef(null);

  // Sync active tab if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Dynamic configuration tailored to this company's product corridor
  const cfg = useMemo(() => getCategoryDataBankConfig(company), [company]);

  // New item inputs
  const [newHeading, setNewHeading] = useState({ text: "", category: "Section Title" });
  const [newTagline, setNewTagline] = useState("");
  const [newParagraph, setNewParagraph] = useState({ title: "", text: "", category: "Brand Story" });
  const [newHighlight, setNewHighlight] = useState("");

  const [newThickness, setNewThickness] = useState({
    value: "",
    chipLabel: "",
    label: "",
    price: 0,
    mrp: 0,
    priceRange: "",
  });
  const [newSize, setNewSize] = useState({ value: "", chipLabel: "", label: "" });
  const [newFinish, setNewFinish] = useState({ value: "", chipLabel: "", label: "" });
  const [newMaterial, setNewMaterial] = useState({ value: "", chipLabel: "", label: "" });
  const [newApplication, setNewApplication] = useState({ value: "", chipLabel: "", label: "" });
  const [newPriceRange, setNewPriceRange] = useState({ value: "", chipLabel: "", label: "" });

  useEffect(() => {
    if (company) {
      const currentBank = company.dataBank;
      const expectedFam = cfg.family;
      // If no dataBank, or if dataBank has wrong family or missing specifications
      if (
        !currentBank ||
        !currentBank.specifications ||
        !currentBank.family ||
        currentBank.family !== expectedFam
      ) {
        setDataBank(getDefaultDataBank(company));
      } else {
        setDataBank(JSON.parse(JSON.stringify(currentBank)));
      }
    } else {
      setDataBank(null);
    }
  }, [company, cfg.family]);

  if (!isOpen || !company) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async () => {
    if (!dataBank) return;
    setIsSaving(true);
    try {
      // Ensure family is tagged on save
      const bankToSave = {
        ...dataBank,
        family: cfg.family,
        companyName: company.name,
      };
      const res = await updateCompanyDataBank(company._id, bankToSave);
      showToast("✓ Company Data Bank saved successfully!");
      if (onSave) onSave(res.data);
    } catch (err) {
      alert("Failed to save Data Bank: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        `Reset Data Bank for "${company.name}" back to verified ODOP ${cfg.family.toUpperCase()} industry defaults? Any custom added items will be replaced.`
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      const defaultBank = getDefaultDataBank(company);
      try {
        const res = await resetCompanyDataBank(company._id);
        if (res && res.data) {
          setDataBank(res.data);
          if (onSave) onSave(res.data);
        } else {
          setDataBank(defaultBank);
          if (onSave) onSave(defaultBank);
        }
      } catch (apiErr) {
        console.warn("Server reset fallback to client default:", apiErr);
        setDataBank(defaultBank);
        if (onSave) onSave(defaultBank);
      }
      showToast("✓ Data Bank reset to verified industry defaults!");
    } catch (err) {
      alert("Failed to reset Data Bank: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // --- SPREADSHEET (EXCEL/CSV) DATA BANK HANDLERS ---
  const handleDownloadCategoryTemplate = () => {
    const loc = resolveCompanyLocation(company);
    const content = generateCategoryDataBankTemplate(cfg.family, loc.currencySymbol);
    const safeCompName = (company?.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "_");
    downloadCsvFile(`${safeCompName}_${cfg.family}_databank_template.csv`, content);
    showToast(`✓ Downloaded ${cfg.family.toUpperCase()} Data Bank template`);
  };

  const handleExportCurrentDataBank = () => {
    if (!dataBank) return;
    const content = exportCurrentDataBankToCsv(dataBank, cfg.family);
    const safeCompName = (company?.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "_");
    downloadCsvFile(`${safeCompName}_${cfg.family}_databank_current.csv`, content);
    showToast("✓ Exported current Data Bank to CSV");
  };

  const handleSheetFileSelected = (selectedFile) => {
    if (!selectedFile) return;
    setSheetFileName(selectedFile.name);
    setIsParsingSheet(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        setSheetUploadRawText(text);
        const parsed = parseDataBankCsv(text, dataBank, sheetImportMode);
        setSheetParsedData(parsed);
      } catch (err) {
        alert("Failed to parse sheet: " + err.message);
        setSheetParsedData(null);
      } finally {
        setIsParsingSheet(false);
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
      setIsParsingSheet(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleApplySheetToDataBank = async () => {
    if (!sheetParsedData || !sheetParsedData.dataBank) return;
    const newBank = {
      ...sheetParsedData.dataBank,
      family: cfg.family,
      companyName: company.name,
    };
    setDataBank(newBank);
    setIsSaving(true);
    try {
      const res = await updateCompanyDataBank(company._id, newBank);
      showToast(`✓ Applied ${sheetParsedData.totalItems} specifications & presets from sheet and saved!`);
      if (onSave) onSave(res.data);
      setSheetParsedData(null);
      setSheetFileName("");
      setSheetUploadRawText("");
    } catch (err) {
      alert("Failed to save Data Bank: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  // Add Item Helpers
  const addHeading = () => {
    if (!newHeading.text.trim()) return;
    const updated = {
      ...dataBank,
      headings: [
        ...(dataBank?.headings || []),
        { id: `h_${Date.now()}`, text: newHeading.text.trim(), category: newHeading.category || "General" },
      ],
    };
    setDataBank(updated);
    setNewHeading({ text: "", category: cfg.headingsCategoryOptions[0] || "Section Title" });
    showToast("Added heading to Data Bank");
  };

  const removeHeading = (idx) => {
    const updated = { ...dataBank, headings: dataBank.headings.filter((_, i) => i !== idx) };
    setDataBank(updated);
  };

  const addTagline = () => {
    if (!newTagline.trim()) return;
    const updated = {
      ...dataBank,
      taglines: [
        ...(dataBank?.taglines || []),
        { id: `t_${Date.now()}`, text: newTagline.trim() },
      ],
    };
    setDataBank(updated);
    setNewTagline("");
    showToast("Added tagline to Data Bank");
  };

  const removeTagline = (idx) => {
    const updated = { ...dataBank, taglines: dataBank.taglines.filter((_, i) => i !== idx) };
    setDataBank(updated);
  };

  const addParagraph = () => {
    if (!newParagraph.text.trim()) return;
    const updated = {
      ...dataBank,
      paragraphs: [
        ...(dataBank?.paragraphs || []),
        {
          id: `p_${Date.now()}`,
          title: newParagraph.title.trim() || "Brand Note",
          text: newParagraph.text.trim(),
          category: newParagraph.category || cfg.paragraphsCategoryOptions[0] || "General",
        },
      ],
    };
    setDataBank(updated);
    setNewParagraph({
      title: "",
      text: "",
      category: cfg.paragraphsCategoryOptions[0] || "Brand Story",
    });
    showToast("Added paragraph to Data Bank");
  };

  const removeParagraph = (idx) => {
    const updated = { ...dataBank, paragraphs: dataBank.paragraphs.filter((_, i) => i !== idx) };
    setDataBank(updated);
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    const updated = {
      ...dataBank,
      featureHighlights: [
        ...(dataBank?.featureHighlights || []),
        { id: `f_${Date.now()}`, text: newHighlight.trim() },
      ],
    };
    setDataBank(updated);
    setNewHighlight("");
    showToast("Added feature highlight to Data Bank");
  };

  const removeHighlight = (idx) => {
    const updated = {
      ...dataBank,
      featureHighlights: dataBank.featureHighlights.filter((_, i) => i !== idx),
    };
    setDataBank(updated);
  };

  // Add Spec Helpers
  const addThickness = () => {
    if (!newThickness.value.trim()) return;
    const chip = newThickness.chipLabel.trim() || newThickness.value.slice(0, 16);
    const label =
      newThickness.label.trim() ||
      `${newThickness.value} — ₹${newThickness.price}${cfg.priceUnit}`;
    const specs = dataBank?.specifications || {};
    const updated = {
      ...dataBank,
      specifications: {
        ...specs,
        thicknesses: [
          ...(specs.thicknesses || []),
          {
            value: newThickness.value.trim(),
            chipLabel: chip,
            label: label,
            price: Number(newThickness.price) || 0,
            mrp:
              Number(newThickness.mrp) ||
              Math.round((Number(newThickness.price) || 0) * 1.35),
            priceRange:
              newThickness.priceRange.trim() ||
              `₹${newThickness.price}${cfg.priceUnit}`,
          },
        ],
      },
    };
    setDataBank(updated);
    setNewThickness({
      value: "",
      chipLabel: "",
      label: "",
      price: 0,
      mrp: 0,
      priceRange: "",
    });
    showToast(`Added ${cfg.thicknessColHeader} preset to Data Bank`);
  };

  const removeThickness = (idx) => {
    const specs = dataBank?.specifications || {};
    const updated = {
      ...dataBank,
      specifications: {
        ...specs,
        thicknesses: (specs.thicknesses || []).filter((_, i) => i !== idx),
      },
    };
    setDataBank(updated);
  };

  const addSpecItem = (fieldKey, itemState, setItemState, itemName) => {
    if (!itemState.value.trim()) return;
    const specs = dataBank?.specifications || {};
    const updated = {
      ...dataBank,
      specifications: {
        ...specs,
        [fieldKey]: [
          ...(specs[fieldKey] || []),
          {
            value: itemState.value.trim(),
            chipLabel: itemState.chipLabel.trim() || itemState.value.slice(0, 16),
            label: itemState.label.trim() || itemState.value.trim(),
          },
        ],
      },
    };
    setDataBank(updated);
    setItemState({ value: "", chipLabel: "", label: "" });
    showToast(`Added ${itemName} to Data Bank`);
  };

  const removeSpecItem = (fieldKey, idx) => {
    const specs = dataBank?.specifications || {};
    const updated = {
      ...dataBank,
      specifications: {
        ...specs,
        [fieldKey]: (specs[fieldKey] || []).filter((_, i) => i !== idx),
      },
    };
    setDataBank(updated);
  };

  const specs = dataBank?.specifications || {};

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "1050px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-medium)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.2rem 1.6rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                fontSize: "1.4rem",
              }}
            >
              {cfg.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {company.name} — Data Bank
                </h3>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {cfg.corridorBadge}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                Company-wide pre-filled repository: stores headings, taglines,
                paragraphs, and verified {cfg.family.toUpperCase()} specifications.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab("sheet")}
              title="Upload / Download Category Data Bank as Excel or CSV spreadsheet"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.78rem",
                color: "#059669",
                borderColor: "rgba(16, 185, 129, 0.4)",
                background: "rgba(16, 185, 129, 0.08)",
                fontWeight: 700,
              }}
            >
              <FileSpreadsheet size={14} />
              <span>Sheet Upload</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleResetToDefaults}
              disabled={isResetting}
              title={`Reset Data Bank back to verified ${cfg.family} industry standards`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.78rem",
              }}
            >
              <RotateCcw size={14} />
              <span>{isResetting ? "Resetting..." : "Reset Defaults"}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              <Save size={15} />
              <span>{isSaving ? "Saving..." : "Save Data Bank"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
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
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              background: "#059669",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontWeight: 700,
              padding: "6px 16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-glass)",
            padding: "0 1.6rem",
            gap: "8px",
          }}
        >
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.8rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <Sliders size={16} />
            <span>Product Specifications Bank</span>
            <span
              style={{
                fontSize: "0.7rem",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--primary)",
                padding: "1px 6px",
                borderRadius: "10px",
              }}
            >
              {(specs.thicknesses?.length || 0) +
                (specs.sizes?.length || 0) +
                (specs.finishes?.length || 0)}{" "}
              presets
            </span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "copy" ? "active" : ""}`}
            onClick={() => setActiveTab("copy")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.8rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <FileText size={16} />
            <span>Catalogue Copy & Marketing Bank</span>
            <span
              style={{
                fontSize: "0.7rem",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--primary)",
                padding: "1px 6px",
                borderRadius: "10px",
              }}
            >
              {(dataBank?.headings?.length || 0) +
                (dataBank?.paragraphs?.length || 0)}{" "}
              texts
            </span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "sheet" ? "active" : ""}`}
            onClick={() => setActiveTab("sheet")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.8rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: activeTab === "sheet" ? "#059669" : undefined,
              borderColor: activeTab === "sheet" ? "#059669" : undefined,
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Excel / CSV Sheet Upload</span>
            <span
              style={{
                fontSize: "0.7rem",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#059669",
                padding: "1px 6px",
                borderRadius: "10px",
                fontWeight: 800,
              }}
            >
              Upload &amp; Export
            </span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === "help" ? "active" : ""}`}
            onClick={() => setActiveTab("help")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.8rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <HelpCircle size={16} />
            <span>How Data Bank Works</span>
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "1.5rem",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* TAB 1: PRODUCT SPECIFICATIONS BANK */}
          {activeTab === "specs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* SECTION: THICKNESS / CALIBER / LENGTH & RATE PRESETS */}
              <div
                className="card"
                style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{cfg.icon}</span> {cfg.thicknessTitle}
                    </h4>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {cfg.thicknessSubtitle}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#059669",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    Auto-Adjusts Rate
                  </span>
                </div>

                {/* Table of Thicknesses / Grades */}
                <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "0.8rem",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderBottom: "1px solid var(--border-subtle)",
                          textAlign: "left",
                        }}
                      >
                        <th style={{ padding: "6px 8px" }}>{cfg.thicknessColHeader}</th>
                        <th style={{ padding: "6px 8px" }}>Quick Chip</th>
                        <th style={{ padding: "6px 8px" }}>{cfg.rateColHeader}</th>
                        <th style={{ padding: "6px 8px" }}>{cfg.mrpColHeader}</th>
                        <th style={{ padding: "6px 8px" }}>Price Range</th>
                        <th style={{ padding: "6px 8px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(specs.thicknesses || []).map((t, idx) => (
                        <tr
                          key={idx}
                          style={{ borderBottom: "1px solid var(--border-subtle)" }}
                        >
                          <td
                            style={{
                              padding: "8px",
                              fontWeight: 650,
                              color: "var(--text-primary)",
                            }}
                          >
                            {t.value}
                          </td>
                          <td style={{ padding: "8px" }}>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                padding: "2px 7px",
                                borderRadius: "10px",
                                background: "var(--primary)",
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              {t.chipLabel || t.value}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              fontWeight: 800,
                              color: "#059669",
                            }}
                          >
                            ₹{t.price}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              color: "var(--text-muted)",
                              textDecoration: "line-through",
                            }}
                          >
                            ₹{t.mrp}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              color: "var(--text-secondary)",
                              fontSize: "0.76rem",
                            }}
                          >
                            {t.priceRange}
                          </td>
                          <td style={{ padding: "8px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => removeThickness(idx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--danger)",
                                cursor: "pointer",
                                padding: "3px",
                              }}
                              title="Delete preset"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Thickness / Caliber Row */}
                <div
                  style={{
                    background: "var(--bg-input)",
                    padding: "0.85rem",
                    borderRadius: "8px",
                    border: "1px dashed var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    {cfg.addThicknessTitle}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1fr 0.8fr 0.8fr 1.2fr auto",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.thicknessPlaceholder}
                      value={newThickness.value}
                      onChange={(e) =>
                        setNewThickness({ ...newThickness, value: e.target.value })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.chipPlaceholder}
                      value={newThickness.chipLabel}
                      onChange={(e) =>
                        setNewThickness({ ...newThickness, chipLabel: e.target.value })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder={cfg.ratePlaceholder}
                      value={newThickness.price || ""}
                      onChange={(e) =>
                        setNewThickness({
                          ...newThickness,
                          price: Number(e.target.value),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder={cfg.mrpPlaceholder}
                      value={newThickness.mrp || ""}
                      onChange={(e) =>
                        setNewThickness({
                          ...newThickness,
                          mrp: Number(e.target.value),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.rangePlaceholder}
                      value={newThickness.priceRange}
                      onChange={(e) =>
                        setNewThickness({
                          ...newThickness,
                          priceRange: e.target.value,
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={addThickness}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID: SIZES & SURFACE FINISHES */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {/* Sizes / Dimensions */}
                <div
                  className="card"
                  style={{
                    padding: "1.1rem",
                    background: "var(--bg-surface-elevated)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      {cfg.sizesTitle}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {(specs.sizes || []).length} items
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: "0.85rem",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {(specs.sizes || []).map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.73rem",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <strong>{s.chipLabel || s.value}</strong>
                        <button
                          type="button"
                          onClick={() => removeSpecItem("sizes", idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.sizePlaceholder}
                      value={newSize.value}
                      onChange={(e) =>
                        setNewSize({
                          ...newSize,
                          value: e.target.value,
                          chipLabel: e.target.value.slice(0, 14),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.76rem", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => addSpecItem("sizes", newSize, setNewSize, "Size")}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Surface Finishes */}
                <div
                  className="card"
                  style={{
                    padding: "1.1rem",
                    background: "var(--bg-surface-elevated)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      {cfg.finishesTitle}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {(specs.finishes || []).length} items
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: "0.85rem",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {(specs.finishes || []).map((f, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.73rem",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span>{f.chipLabel || f.value}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecItem("finishes", idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.finishPlaceholder}
                      value={newFinish.value}
                      onChange={(e) =>
                        setNewFinish({
                          ...newFinish,
                          value: e.target.value,
                          chipLabel: e.target.value.slice(0, 14),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.76rem", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        addSpecItem("finishes", newFinish, setNewFinish, "Finish")
                      }
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID: MATERIALS / APPLICATIONS & PRICE RANGES */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {/* Materials & Applications */}
                <div
                  className="card"
                  style={{
                    padding: "1.1rem",
                    background: "var(--bg-surface-elevated)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      {cfg.materialsTitle}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {(specs.materials?.length || 0) +
                        (specs.applications?.length || 0)}{" "}
                      items
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: "0.85rem",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {(specs.materials || [])
                      .concat(specs.applications || [])
                      .map((m, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.73rem",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-subtle)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span>{m.chipLabel || m.value}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx < (specs.materials || []).length) {
                                removeSpecItem("materials", idx);
                              } else {
                                removeSpecItem(
                                  "applications",
                                  idx - (specs.materials || []).length
                                );
                              }
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--danger)",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.materialPlaceholder}
                      value={newMaterial.value}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          value: e.target.value,
                          chipLabel: e.target.value.slice(0, 15),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.76rem", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        addSpecItem(
                          "materials",
                          newMaterial,
                          setNewMaterial,
                          "Material/Application"
                        )
                      }
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Price Ranges */}
                <div
                  className="card"
                  style={{
                    padding: "1.1rem",
                    background: "var(--bg-surface-elevated)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      {cfg.priceRangesTitle}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {specs.priceRanges?.length || 0} items
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: "0.85rem",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {(specs.priceRanges || []).map((q, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.73rem",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#059669",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontWeight: 650,
                        }}
                      >
                        <span>{q.chipLabel || q.value}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecItem("priceRanges", idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.priceRangePlaceholder}
                      value={newPriceRange.value}
                      onChange={(e) =>
                        setNewPriceRange({
                          ...newPriceRange,
                          value: e.target.value,
                          chipLabel: e.target.value.slice(0, 16),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.76rem", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        addSpecItem(
                          "priceRanges",
                          newPriceRange,
                          setNewPriceRange,
                          "Price Range"
                        )
                      }
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOGUE COPY & MARKETING */}
          {activeTab === "copy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Headings */}
              <div
                className="card"
                style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      📰 Catalogue Headings & Page Titles
                    </h4>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      Stored headlines used across catalogue cover pages, collection
                      dividers, and hero banners.
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {(dataBank?.headings || []).length} headings
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    marginBottom: "0.85rem",
                  }}
                >
                  {(dataBank?.headings || []).map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "var(--bg-input)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 750,
                            color: "var(--primary)",
                            background: "rgba(99, 102, 241, 0.1)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {h.category || "Headline"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {h.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHeading(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                        title="Delete heading"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Heading Row */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    className="input-field"
                    style={{ width: "170px", padding: "4px 8px", fontSize: "0.78rem" }}
                    value={newHeading.category}
                    onChange={(e) =>
                      setNewHeading({ ...newHeading, category: e.target.value })
                    }
                  >
                    {cfg.headingsCategoryOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={cfg.headingPlaceholder}
                    value={newHeading.text}
                    onChange={(e) =>
                      setNewHeading({ ...newHeading, text: e.target.value })
                    }
                    style={{ paddingLeft: "0.75rem", fontSize: "0.8rem", flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={addHeading}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Taglines & Subheadings */}
              <div
                className="card"
                style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      💬 Brand Taglines & Subheadings
                    </h4>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      Short value propositions, slogans, and subtitle banners.
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {(dataBank?.taglines || []).length} taglines
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    marginBottom: "0.85rem",
                  }}
                >
                  {(dataBank?.taglines || []).map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 12px",
                        background: "var(--bg-input)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text-secondary)",
                          fontWeight: 550,
                        }}
                      >
                        "{t.text}"
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTagline(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={cfg.taglinePlaceholder}
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    style={{ paddingLeft: "0.75rem", fontSize: "0.8rem", flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={addTagline}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Brand Stories & Paragraphs */}
              <div
                className="card"
                style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      📖 Brand Stories, Specifications & Paragraphs
                    </h4>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      Pre-written descriptions ready to paste into catalogue pages or
                      product listings.
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {(dataBank?.paragraphs || []).length} stories
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  {(dataBank?.paragraphs || []).map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 14px",
                        background: "var(--bg-input)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              color: "var(--primary)",
                              background: "rgba(99, 102, 241, 0.1)",
                              padding: "1px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {p.category}
                          </span>
                          <strong
                            style={{
                              fontSize: "0.88rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            {p.title}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParagraph(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {p.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Paragraph Form */}
                <div
                  style={{
                    background: "var(--bg-input)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px dashed var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "6px" }}>
                    <select
                      className="input-field"
                      style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                      value={newParagraph.category}
                      onChange={(e) =>
                        setNewParagraph({ ...newParagraph, category: e.target.value })
                      }
                    >
                      {cfg.paragraphsCategoryOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={cfg.paragraphTitlePlaceholder}
                      value={newParagraph.title}
                      onChange={(e) =>
                        setNewParagraph({ ...newParagraph, title: e.target.value })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.78rem" }}
                    />
                  </div>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder={cfg.paragraphTextPlaceholder}
                    value={newParagraph.text}
                    onChange={(e) =>
                      setNewParagraph({ ...newParagraph, text: e.target.value })
                    }
                    style={{
                      paddingLeft: "0.6rem",
                      fontSize: "0.78rem",
                      resize: "vertical",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={addParagraph}
                    >
                      <Plus size={14} /> Add Paragraph
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Highlights (Bullets) */}
              <div
                className="card"
                style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        color: "var(--text-primary)",
                      }}
                    >
                      📌 Reusable Key Feature Bullets
                    </h4>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      Pre-filled bullet points automatically loaded at the time of
                      product listing.
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {(dataBank?.featureHighlights || []).length} bullets
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    marginBottom: "0.85rem",
                  }}
                >
                  {(dataBank?.featureHighlights || []).map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 12px",
                        background: "var(--bg-input)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ color: "#059669", fontWeight: 800 }}>•</span>
                        <span
                          style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}
                        >
                          {f.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={cfg.highlightPlaceholder}
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    style={{ paddingLeft: "0.75rem", fontSize: "0.8rem", flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={addHighlight}
                  >
                    <Plus size={14} /> Add Bullet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW DATA BANK WORKS */}
          {activeTab === "help" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                className="card"
                style={{ padding: "1.5rem", background: "var(--bg-surface-elevated)" }}
              >
                <h4
                  style={{
                    margin: "0 0 0.85rem 0",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Database size={20} color="var(--primary)" /> How the Company Data
                  Bank Works
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      1
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-primary)" }}>
                        Stored Once Per Company in Cloud:
                      </strong>{" "}
                      Each company has its own persistent Data Bank saved in MongoDB
                      Atlas. When you register a stone quarry, garlic exporter, or
                      handloom enterprise, its Data Bank is initialized with verified{" "}
                      {cfg.family.toUpperCase()} industry standards.
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      2
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-primary)" }}>
                        Shows at Time of Product Listing:
                      </strong>{" "}
                      When adding any new product (in the Add Product modal or Product
                      Studio), the dropdowns and 1-click pills pull directly from your
                      company's Data Bank. Selecting a {cfg.thicknessColHeader.toLowerCase()} automatically fills the rate, MRP, and
                      specifications without manual typing.
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      3
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-primary)" }}>
                        Usable in Catalogue Builder:
                      </strong>{" "}
                      In the Catalogue Studio, open the Data Bank tab or use Page Text
                      Inspector to click any saved Heading, Subheading, or Brand Story to
                      insert it directly into your A4 catalogue pages.
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      4
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-primary)" }}>
                        Save New Presets On the Fly:
                      </strong>{" "}
                      Whenever you type a new specification or custom rate in the
                      product listing form, you can click "Save to Data Bank" to store
                      it permanently for all future listings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXCEL / CSV SHEET UPLOAD & SPECIFICATION PRESETS */}
          {activeTab === "sheet" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Category Status & Instructions Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)",
                  padding: "1.2rem 1.4rem",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ maxWidth: "680px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "1.2rem" }}>{cfg.icon}</span>
                    <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {company.name} — {cfg.family.toUpperCase()} Category Data Bank Spreadsheet
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    Instead of repeatedly typing product specifications, sizing dimensions, and rate presets, you can download the <strong>{cfg.family.toUpperCase()}</strong> spreadsheet template, update it in Microsoft Excel or Google Sheets, and upload it back. All specifications and copy presets will automatically populate into your product listing forms!
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleDownloadCategoryTemplate}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 750,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                    }}
                    title="Download pre-configured template with authentic ODOP category columns"
                  >
                    <Download size={15} /> Download Category Template (.csv)
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      const loc = resolveCompanyLocation(company);
                      const csvText = generateCategoryDataBankTemplate(cfg.family, loc.currencySymbol);
                      navigator.clipboard.writeText(csvText);
                      showToast("✓ Copied organized sheet to clipboard! You can paste directly into Excel or below.");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 700,
                      color: "#059669",
                      borderColor: "#10b981",
                      background: "rgba(16, 185, 129, 0.08)",
                    }}
                    title="Copy formatted sheet to clipboard to paste straight into Excel"
                  >
                    <Copy size={15} /> Copy Formatted Sheet
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleExportCurrentDataBank}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      borderColor: "var(--primary)",
                      background: "rgba(99, 102, 241, 0.08)",
                    }}
                    title="Export your current presets to Excel/CSV to edit them"
                  >
                    <FileSpreadsheet size={15} /> Export Current Data Bank
                  </button>
                </div>
              </div>

              {/* Method Switcher & Guide Toggle */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "6px", background: "var(--bg-surface-elevated)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  <button
                    type="button"
                    onClick={() => setSheetInputMethod("file")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: sheetInputMethod === "file" ? "#10b981" : "transparent",
                      color: sheetInputMethod === "file" ? "#ffffff" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Upload size={14} /> Upload File (.csv, .tsv)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetInputMethod("paste")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: sheetInputMethod === "paste" ? "#10b981" : "transparent",
                      color: sheetInputMethod === "paste" ? "#ffffff" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <FileText size={14} /> Paste Sheet Text Directly
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStructureGuide(!showStructureGuide)}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Info size={14} /> {showStructureGuide ? "Hide Column Structure Guide" : "View Column & Section Guide"}
                </button>
              </div>

              {/* Collapsible Structure Guide */}
              {showStructureGuide && (
                <div
                  style={{
                    background: "var(--bg-surface-elevated, #f8fafc)",
                    border: "1px solid var(--border-medium, #cbd5e1)",
                    borderRadius: "10px",
                    padding: "1rem 1.25rem",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
                    📊 Spreadsheet Structure &amp; Column Definitions:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                    <div>
                      <strong>1. Category Section:</strong> Rate Preset, Size, Finish, Material, Application, Heading, Tagline, Story, Highlight.<br />
                      <strong>2. Specification / Item Title:</strong> Full grade or produce title (e.g. <em>50 - 65 mm (Grade A+ Large)</em>).<br />
                      <strong>3. Short Tag (Button):</strong> Short chip text for quick product form buttons (e.g. <em>50-65mm A+</em>).<br />
                      <strong>4. Selling Rate (₹):</strong> Wholesale selling price per kg / sq.ft.
                    </div>
                    <div>
                      <strong>5. MRP (₹):</strong> List / retail catalogue price.<br />
                      <strong>6. Price Range:</strong> Optional display text (e.g. <em>₹200 – ₹260 / kg</em>).<br />
                      <strong>7. Sub-Group / Type:</strong> Grading Preset, Sizing, Surface Finish, Cultivar, etc.<br />
                      <strong>8. Detailed Description &amp; Marketing Notes:</strong> Marketing bullet, farm heritage story, or curing notes.
                    </div>
                  </div>
                </div>
              )}

              {sheetInputMethod === "paste" ? (
                <div className="card" style={{ padding: "1.2rem", background: "var(--bg-surface-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 750, color: "var(--text-primary)" }}>
                      📋 Paste Raw Spreadsheet Rows (CSV or Tab-Delimited from Excel)
                    </label>
                    {sheetUploadRawText && (
                      <button
                        type="button"
                        onClick={() => {
                          setSheetUploadRawText("");
                          setSheetParsedData(null);
                        }}
                        style={{ fontSize: "0.75rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                      >
                        Clear Text
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={7}
                    placeholder="Paste rows directly from Excel or Google Sheets (e.g. Rate Preset, 50 - 65 mm, 50-65mm A+, 220, 280...)"
                    value={sheetUploadRawText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSheetUploadRawText(val);
                      if (!val.trim()) {
                        setSheetParsedData(null);
                        return;
                      }
                      try {
                        const parsed = parseDataBankCsv(val, dataBank, sheetImportMode);
                        setSheetParsedData(parsed);
                        setSheetFileName("Pasted Spreadsheet Text");
                      } catch (err) {
                        setSheetParsedData(null);
                      }
                    }}
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-medium)",
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      resize: "vertical",
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Tip: You can copy cells directly from Microsoft Excel or Google Sheets and press Ctrl+V here.
                  </div>
                </div>
              ) : (
                /* Upload Dropzone */
                <div
                  className="card"
                  onDragOver={(e) => {
                  e.preventDefault();
                  setSheetDragOver(true);
                }}
                onDragLeave={() => setSheetDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setSheetDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleSheetFileSelected(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => sheetFileInputRef.current?.click()}
                style={{
                  padding: "2rem",
                  border: `2px dashed ${sheetDragOver ? "#10b981" : "var(--border-medium, #cbd5e1)"}`,
                  borderRadius: "12px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: sheetDragOver ? "rgba(16, 185, 129, 0.05)" : "var(--bg-surface-elevated, #f8fafc)",
                  transition: "all 0.15s ease",
                }}
              >
                <input
                  ref={sheetFileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSheetFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px auto",
                  }}
                >
                  <Upload size={24} />
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 750, color: "var(--text-primary)" }}>
                  {sheetFileName ? `Selected: ${sheetFileName}` : "Click to select or drag & drop updated Excel / CSV Sheet"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Upload .csv exported from Microsoft Excel, Google Sheets, or Apple Numbers
                </div>
              </div>

              )}

              {/* Parsed Summary & Preview */}
              {sheetParsedData && (
                <div className="card" style={{ padding: "1.25rem", background: "var(--bg-surface)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          Parsed Spreadsheet Preview
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 750,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: "#dcfce7",
                            color: "#166534",
                          }}
                        >
                          ✓ {sheetParsedData.totalItems} Items Detected
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Review detected specifications before applying to the category repository.
                      </div>
                    </div>

                    {/* Mode Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-surface-elevated)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 650, display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: sheetImportMode === "merge" ? "#059669" : "var(--text-secondary)" }}>
                        <input
                          type="radio"
                          name="sheetImportMode"
                          value="merge"
                          checked={sheetImportMode === "merge"}
                          onChange={() => {
                            setSheetImportMode("merge");
                            if (sheetUploadRawText) {
                              setSheetParsedData(parseDataBankCsv(sheetUploadRawText, dataBank, "merge"));
                            }
                          }}
                        />
                        Merge (Add new &amp; keep existing)
                      </label>
                      <label style={{ fontSize: "0.78rem", fontWeight: 650, display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: sheetImportMode === "replace" ? "#dc2626" : "var(--text-secondary)" }}>
                        <input
                          type="radio"
                          name="sheetImportMode"
                          value="replace"
                          checked={sheetImportMode === "replace"}
                          onChange={() => {
                            setSheetImportMode("replace");
                            if (sheetUploadRawText) {
                              setSheetParsedData(parseDataBankCsv(sheetUploadRawText, dataBank, "replace"));
                            }
                          }}
                        />
                        Replace (Overwrite presets)
                      </label>
                    </div>
                  </div>

                  {/* Detected Breakdown Badges */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {sheetParsedData.counts.thicknesses > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
                        ⚡ {sheetParsedData.counts.thicknesses} Rate &amp; Grading Presets
                      </span>
                    )}
                    {sheetParsedData.counts.sizes > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(99, 102, 241, 0.12)", color: "var(--primary)" }}>
                        📐 {sheetParsedData.counts.sizes} Sizing Dimensions
                      </span>
                    )}
                    {sheetParsedData.counts.finishes > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(245, 158, 11, 0.12)", color: "#b45309" }}>
                        ✨ {sheetParsedData.counts.finishes} Surface Finishes
                      </span>
                    )}
                    {sheetParsedData.counts.materials > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}>
                        🎯 {sheetParsedData.counts.materials} Materials &amp; Standards
                      </span>
                    )}
                    {sheetParsedData.counts.applications > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(139, 92, 246, 0.12)", color: "#7c3aed" }}>
                        📦 {sheetParsedData.counts.applications} Applications
                      </span>
                    )}
                    {sheetParsedData.counts.headings > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(236, 72, 153, 0.12)", color: "#db2777" }}>
                        📰 {sheetParsedData.counts.headings} Headings
                      </span>
                    )}
                    {sheetParsedData.counts.paragraphs > 0 && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(20, 184, 166, 0.12)", color: "#0f766e" }}>
                        📖 {sheetParsedData.counts.paragraphs} Stories / Paragraphs
                      </span>
                    )}
                  </div>

                  {/* Apply Action Bar */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSheetParsedData(null);
                        setSheetFileName("");
                        setSheetUploadRawText("");
                      }}
                    >
                      Clear Selection
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleApplySheetToDataBank}
                      disabled={isSaving}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 750,
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        padding: "8px 16px",
                      }}
                    >
                      <CheckCircle size={16} />
                      <span>{isSaving ? "Saving..." : "Apply Sheet & Save Data Bank"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Products Batch Upload Card */}
              <div
                style={{
                  background: "var(--bg-surface-elevated, #f8fafc)",
                  padding: "1.2rem 1.4rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle, #e2e8f0)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    📦 Want to Batch Upload Products Directly into Catalogue?
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    If you have a spreadsheet with complete products (SKU, title, price, size, finish, image), use the Product Sheet Uploader to import them all in seconds.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    onClose();
                    if (onOpenProductSheetUpload) {
                      onOpenProductSheetUpload();
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 750,
                    fontSize: "0.82rem",
                    color: "#2563eb",
                    borderColor: "#3b82f6",
                    background: "rgba(59, 130, 246, 0.08)",
                  }}
                >
                  <Upload size={14} /> Open Product Sheet Uploader ➔
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "0.85rem 1.6rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-surface)",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Changes are saved to {company.name}'s cloud profile.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={isSaving}
              style={{ fontWeight: 700 }}
            >
              {isSaving ? "Saving..." : "Save Data Bank"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
