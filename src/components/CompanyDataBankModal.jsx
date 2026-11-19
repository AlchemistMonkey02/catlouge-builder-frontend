import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { updateCompanyDataBank, resetCompanyDataBank } from "../services/api";
import {
  getDefaultDataBank,
  resolveCompanyCategory,
  resolveCompanyLocation,
} from "../utils/defaultDataBank";

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

      moqsTitle: "📦 Packaging Lots & Minimum Mandi Orders (MOQ)",
      moqsSubtitle: "Wholesale mesh bags, export cartons, and truckload consignments",
      moqPlaceholder: "e.g. 500 kg (Wholesale Mandi Lot) or 25kg Mesh Bags",

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

      moqsTitle: "📦 Quarry Order Lots & Minimum Quantities (MOQ)",
      moqsSubtitle: "Crated project lots, truckload dispatch, and container loads",
      moqPlaceholder: "e.g. 500 sq.ft (Quarry Lot) or 1 Truckload (12,000 sq.ft)",

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

      moqsTitle: "📦 Project Lots & Minimum Order Quantities (MOQ)",
      moqsSubtitle: "Sea container payloads, palleted crates, and architectural lots",
      moqPlaceholder: "e.g. 400 sq.ft (Project Lot) or 20 Tonne Container",

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

      moqsTitle: "📦 Artisan Order Quantities & Boutique Lots (MOQ)",
      moqsSubtitle: "Wholesale weaver sets, boutique consignments, and custom orders",
      moqPlaceholder: "e.g. 10 Pieces (Wholesale Boutique Lot)",

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

      moqsTitle: "📦 Minimum Order Quantities (MOQ)",
      moqsSubtitle: "Trade order minimums and wholesale batch sizes",
      moqPlaceholder: "e.g. 10 Units",

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
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dataBank, setDataBank] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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
  const [newMoq, setNewMoq] = useState({ value: "", chipLabel: "", label: "" });
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

              {/* GRID: MATERIALS / APPLICATIONS & MOQS */}
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

                {/* MOQs & Price Ranges */}
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
                      {cfg.moqsTitle}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {(specs.moqs?.length || 0) +
                        (specs.priceRanges?.length || 0)}{" "}
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
                    {(specs.moqs || [])
                      .concat(specs.priceRanges || [])
                      .map((q, idx) => (
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
                            onClick={() => {
                              if (idx < (specs.moqs || []).length) {
                                removeSpecItem("moqs", idx);
                              } else {
                                removeSpecItem(
                                  "priceRanges",
                                  idx - (specs.moqs || []).length
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
                      placeholder={cfg.moqPlaceholder}
                      value={newMoq.value}
                      onChange={(e) =>
                        setNewMoq({
                          ...newMoq,
                          value: e.target.value,
                          chipLabel: e.target.value.slice(0, 14),
                        })
                      }
                      style={{ paddingLeft: "0.6rem", fontSize: "0.76rem", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => addSpecItem("moqs", newMoq, setNewMoq, "MOQ")}
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
