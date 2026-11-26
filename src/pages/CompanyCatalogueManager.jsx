import React, { useState, useEffect, useMemo } from "react";
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
  MapPin,
  Zap,
  Palette,
  Maximize2,
  Database,
  Eye,
  FileSpreadsheet,
  Scissors,
} from "lucide-react";
import ImageUpscaleModal from "../components/ImageUpscaleModal";
import RemoveBgModal from "../components/RemoveBgModal";
import ProductImagePreviewModal from "../components/ProductImagePreviewModal";
import CompanyDataBankModal from "../components/CompanyDataBankModal";
import ProductSheetUploadModal from "../components/ProductSheetUploadModal";
import {
  fetchCompanies,
  fetchCatalogueProducts,
  createCatalogueProduct,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  updateCompanyDataBank,
  neuralAiCutout,
  // generateAiContent, // AI features commented out
} from "../services/api";
import { isProductCompatibleWithFamily, SPECIALTY_DEMO_PRODUCTS } from "../components/dynamic-catalogue/DynamicCatalogueStudio";
import {
  resolveCompanyCategory,
  resolveCompanyLocation,
  getDefaultDataBank,
} from "../utils/defaultDataBank";


const ODOP_PRESETS = {
  "Kota Doria": {
    category: "Kota Doria Specialty",
    odopProduct: "Kota Doria",
    district: "Kota, Rajasthan",
    size: "6.5m (Includes 80cm Running Blouse Piece)",
    material: "Pure Mulberry Silk Warp, Fine Cotton Weft",
    materialComposition: "Pure Mulberry Silk Warp, Fine Cotton Weft",
    finish: "Tested Electro-Gold Zari on Square Khat",
    application: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
    useApplication: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
    priceRange: "₹2,450 – ₹6,500",
    unit: "",
    image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg"
  },
  "Garlic": {
    category: "Garlic Specialty",
    odopProduct: "Garlic",
    district: "Baran, Rajasthan",
    size: "50 - 65 mm (Grade A+ Large)",
    material: "100% Organically Grown Malwa Garlic",
    materialComposition: "100% Organically Grown Malwa Garlic",
    finish: "Sun-Cured Export Clean White Skin",
    application: "Commercial Culinary, Food Processing & Export",
    useApplication: "Commercial Culinary, Food Processing & Export",
    priceRange: "₹180 – ₹240 / kg",
    unit: "kg",
    image: "/assets/garlic/garlic-01.jpeg"
  },
  "Kota Stone": {
    category: "Kota Stone Specialty",
    odopProduct: "Kota Stone",
    district: "Jhalawar, Rajasthan",
    size: "600x600 mm (20mm Calibrated)",
    material: "Natural Indurated Limestone (Kota Stone)",
    materialComposition: "Natural Indurated Limestone (Kota Stone)",
    finish: "Mirror High Polish / Honed",
    application: "Heavy Commercial Flooring & Corridors",
    useApplication: "Heavy Commercial Flooring & Corridors",
    priceRange: "₹85 – ₹120 / sq.ft",
    unit: "sq.ft",
    image: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg"
  },
  "Sandstone": {
    category: "Sand Stone Specialty",
    odopProduct: "Sandstone",
    district: "Bundi, Rajasthan",
    size: "600x900 mm (25-30mm Calibrated Sawn)",
    material: "Natural Quartzite Sandstone",
    materialComposition: "Natural Quartzite Sandstone",
    finish: "Sandblasted / Hand-Chiseled / Honed",
    application: "Exterior Facades, Cladding & Paving",
    useApplication: "Exterior Facades, Cladding & Paving",
    priceRange: "₹135 – ₹190 / sq.ft",
    unit: "sq.ft",
    image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg"
  }
};

export const CATEGORY_FALLBACK_IMAGES = {
  garlic: [
    "/assets/garlic/garlic-01.jpeg",
    "/assets/garlic/garlic-02.jpeg",
    "/assets/garlic/garlic-03.jpeg",
    "/assets/garlic/garlic-04.jpeg",
    "/assets/garlic/garlic-05.jpeg",
    "/assets/garlic/garlic-06.jpeg",
  ],
  kotastone: [
    "/assets/kota-stone/blue-kota-stone-1.jpg",
    "/assets/kota-stone/blue-kota-stone-2.jpg",
    "/assets/kota-stone/blue-kota-stone-3.jpg",
    "/assets/kota-stone/blue-kota-stone-4.jpg",
  ],
  sandstone: [
    "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
    "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
  ],
  kotadoria: [
    "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
    "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
    "/assets/kota-doria/0X2A0415.jpg",
  ],
  general: [
    "/assets/garlic/garlic-01.jpeg",
  ],
};

export const resolveProductImageUrl = (product, fam = "general", index = 0) => {
  let raw = product?.image || (product?.images && product?.images[0]?.url) || "";
  raw = (raw || "").trim();

  if (raw.startsWith("assets/") || raw.startsWith("uploads/")) {
    raw = `/${raw}`;
  }

  if (!raw || (fam === "garlic" && raw.includes("/assets/reference/"))) {
    const list = CATEGORY_FALLBACK_IMAGES[fam] || CATEGORY_FALLBACK_IMAGES.garlic;
    return list[Math.abs(index) % list.length];
  }

  return raw;
};

function getCompanyDefaultOdop(comp) {
  const fam = resolveCompanyCategory(comp);
  if (fam === "garlic") return ODOP_PRESETS["Garlic"];
  if (fam === "kotastone") return ODOP_PRESETS["Kota Stone"];
  if (fam === "sandstone") return ODOP_PRESETS["Sandstone"];
  return ODOP_PRESETS["Kota Doria"];
}

export function getCategoryFamily(item) {
  return resolveCompanyCategory(item);
}

export function getDefaultProductForm(fam, company) {
  const defOdop = getCompanyDefaultOdop(company);
  const brandName = company?.name || "Authentic Rajasthan";
  const districtName = company?.district || defOdop.district;

  if (fam === "garlic") {
    return {
      name: "",
      sku: `GRL-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      brand: brandName,
      category: "Garlic Specialty",
      district: districtName || "Baran, Rajasthan",
      odopProduct: "Garlic",
      size: "50 - 65 mm (Grade A+ Large)",
      thickness: "",
      fabricWeight: "",
      material: "Moisture < 65%, Sun-Cured Clean White",
      materialComposition: "Moisture < 65%, Sun-Cured Clean White",
      finish: "Sun-Cured Export Clean White Skin",
      color: "Natural Clean White",
      application: "Mandi Wholesale, Food Processing & Dehydration",
      useApplication: "Mandi Wholesale, Food Processing & Dehydration",
      priceRange: "₹180 – ₹240 / kg",
      price: 180,
      unit: "kg",
      pricingUnit: "kg",
      mrp: 240,
      stock: 5000,
      image: "/assets/garlic/garlic-01.jpeg",
      description: "Organically cultivated premium garlic from Baran with high natural allicin potency, intact white skin, and superior storage life for mandi trade and food processing.",
      shortDescription: "Grade A+ Sun-Cured Baran Garlic",
      keyFeatures: [
        "High natural allicin content delivering strong medicinal potency and pungency",
        "100% naturally shed sun-cured with double skin protection against moisture rot",
        "Zero chemical bleaching; free from sprout emergence, dirt, and damaged bulbs",
        "Packed in ventilated UV-stabilized mesh bags for long transit storage",
      ],
      hsnCode: "07032000",
      dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
      weight: { value: 1000, unit: "g" },
      technicalSpecifications: [
        { key: "Bulb Caliber", value: "50 - 65 mm (Grade A+)", verified: true },
        { key: "Moisture Content", value: "< 65% Cured", verified: true },
        { key: "Cloves per Bulb", value: "10 - 14 Cloves", verified: true },
        { key: "Storage Life", value: "6 - 9 Months (Ventilated)", verified: true },
        { key: "Origin Mandi", value: "Baran, Rajasthan", verified: true },
      ],
    };
  }

  if (fam === "sandstone") {
    return {
      name: "",
      sku: `SND-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      brand: brandName,
      category: "Sand Stone Specialty",
      district: districtName || "Bundi, Rajasthan",
      odopProduct: "Sandstone",
      size: "2×2 ft (600×600 mm)",
      thickness: "25 - 30 mm Calibrated",
      fabricWeight: "",
      material: "Natural Quartzite Sandstone",
      materialComposition: "Natural Quartzite Sandstone",
      finish: "Sandblasted / Honed Satin",
      color: "Dholpur Beige / Jodhpur Gold",
      application: "High Traffic Flooring, Exterior Facades & Landscape Cladding",
      useApplication: "High Traffic Flooring, Exterior Facades & Landscape Cladding",
      priceRange: "₹110 – ₹180 / sq.ft",
      price: 140,
      unit: "sq.ft",
      pricingUnit: "sq.ft",
      mrp: 190,
      stock: 12000,
      image: "/assets/sand-stone/Dholpur-Beige-Sandstone-Honed.jpg",
      description: "Fine-textured natural Rajasthan sandstone quarried for high mechanical strength, weather resistance, and natural thermal insulation.",
      shortDescription: "Calibrated Architectural Sandstone",
      keyFeatures: [
        "Non-porous, naturally cool underfoot, and non-slip surface in wet conditions",
        "High compressive strength (> 110 MPa) with exceptional weather durability",
        "100% natural quarried stone; zero artificial pigments, wax, or chemical resins",
        "Uniformly calibrated thickness for rapid, level onsite installation",
      ],
      hsnCode: "68029900",
      dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
      weight: { value: 0, unit: "g" },
      technicalSpecifications: [
        { key: "Tile Plan Size", value: "2×2 ft (600×600 mm)", verified: true },
        { key: "Thickness", value: "25 - 30 mm Calibrated", verified: true },
        { key: "Water Absorption", value: "< 0.45%", verified: true },
        { key: "Edge Finish", value: "Machine Diamond Sawed Square", verified: true },
        { key: "Quarry Source", value: "Bundi / Jodhpur, Rajasthan", verified: true },
      ],
    };
  }

  if (fam === "kotastone") {
    return {
      name: "",
      sku: `KST-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      brand: brandName,
      category: "Kota Stone Specialty",
      district: districtName || "Jhalawar, Rajasthan",
      odopProduct: "Kota Stone",
      size: "2×2 ft (600×600 mm)",
      thickness: "20 - 25 mm Gauged",
      fabricWeight: "",
      material: "Natural Indurated Limestone",
      materialComposition: "Natural Indurated Limestone",
      finish: "Mirror High Polish / Honed",
      color: "Kota Blue-Green",
      application: "Heavy Commercial Flooring, Industrial Corridors & Pavements",
      useApplication: "Heavy Commercial Flooring, Industrial Corridors & Pavements",
      priceRange: "₹55 – ₹95 / sq.ft",
      price: 65,
      unit: "sq.ft",
      pricingUnit: "sq.ft",
      mrp: 95,
      stock: 25000,
      image: "/assets/kota-stone/blue kota stone 1.jpg",
      description: "Fine-grained natural indurated limestone quarried in Ramganj Mandi. Gauged to uniform thickness with machine-cut edges for seamless, wear-resistant commercial flooring.",
      shortDescription: "Premium Polished Kota Stone Limestone",
      keyFeatures: [
        "Non-porous, naturally cool underfoot, and non-slip surface in wet conditions",
        "High compressive strength (> 110 MPa) with exceptional abrasion resistance",
        "100% natural quarried stone; zero artificial pigments, wax, or chemical resins",
        "Uniformly gauged thickness for rapid, level onsite installation",
      ],
      hsnCode: "68022190",
      dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
      weight: { value: 0, unit: "g" },
      technicalSpecifications: [
        { key: "Tile Plan Size", value: "2×2 ft (600×600 mm)", verified: true },
        { key: "Thickness", value: "20 - 25 mm Gauged", verified: true },
        { key: "Water Absorption", value: "< 0.38% (Impervious)", verified: true },
        { key: "Edge Finish", value: "Machine Diamond Sawed Square", verified: true },
        { key: "Quarry Source", value: "Ramganj Mandi / Jhalawar", verified: true },
      ],
    };
  }

  if (fam === "kotadoria") {
    return {
      name: "",
      sku: `KTD-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      brand: brandName,
      category: "Kota Doria Handloom",
      district: districtName || "Kota, Rajasthan",
      odopProduct: "Kota Doria",
      size: "6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in",
      thickness: "",
      fabricWeight: "280 - 320 grams (80s Cotton × 100s Silk)",
      material: "Pure Mulberry Silk Warp, Fine Cotton Weft",
      materialComposition: "Pure Mulberry Silk Warp, Fine Cotton Weft",
      finish: "Tested Electro-Gold Zari on Square Khat",
      color: "Royal Gold & Ivory",
      application: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
      useApplication: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
      priceRange: "₹2,450 – ₹6,500",
      price: 3200,
      unit: "",
      pricingUnit: "",
      mrp: 4800,
      stock: 25,
      image: "/assets/kota-doria/kota-doria-01.jpg",
      description: "Authentic GI-tagged handloom saree woven by master weavers in Kaithun. Features the iconic lightweight square khat check weave combining mulberry silk sheen with breathable cotton comfort.",
      shortDescription: "GI-Tagged Pure Silk Zari Kota Doria Saree",
      keyFeatures: [
        "Certified Geographical Indication (GI Tag No. 27) Handloom Craft",
        "Signature sheer square 'khat' checkered weave for unmatched breathability",
        "Tested real gold zari borders and pallu hand-interlocked into warp and weft",
        "Woven on traditional pit-looms by artisan master weavers of Kaithun",
      ],
      hsnCode: "50072010",
      dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
      weight: { value: 300, unit: "g" },
      technicalSpecifications: [
        { key: "Fabric Length", value: "6.5 Metres with Blouse Piece", verified: true },
        { key: "Fabric Weight", value: "280 - 320 grams (Superfine)", verified: true },
        { key: "Yarn Count", value: "80s Combed Cotton × 100s Silk", verified: true },
        { key: "Weave Structure", value: "Traditional Square Khat Grid", verified: true },
        { key: "Craft Origin", value: "Kaithun, Kota, Rajasthan ", verified: true },
      ],
    };
  }

  // Fallback for General
  return {
    name: "",
    sku: `PROD-${Date.now().toString(36).slice(-4).toUpperCase()}`,
    brand: brandName,
    category: company?.industry || defOdop.category || "General",
    district: districtName || "Rajasthan",
    odopProduct: company?.odopProduct || "Product",
    size: "Standard",
    thickness: "",
    fabricWeight: "",
    material: "Standard Material",
    materialComposition: "Standard Material",
    finish: "Standard Finish",
    color: "Natural",
    application: "General Commercial Use",
    useApplication: "General Commercial Use",
    priceRange: "₹1,000 – ₹2,500",
    price: 1500,
    unit: "piece",
    pricingUnit: "piece",
    mrp: 2000,
    stock: 50,
    image: defOdop.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "High quality certified product crafted to statutory quality standards.",
    shortDescription: "Certified Commercial Product",
    keyFeatures: [
      "Certified authentic craftsmanship meeting statutory quality benchmarks.",
      "Direct producer procurement with full batch provenance.",
    ],
    hsnCode: "",
    dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
    weight: { value: 0, unit: "g" },
    technicalSpecifications: [
      { key: "Country of Origin", value: "India", verified: true },
    ],
  };
}

export const ODOP_CATEGORY_PRESETS = {
  kotastone: {
    thickness: [
      {
        value: "20 - 25 mm Gauged",
        chipLabel: "20-25mm Gauged",
        label: "20 - 25 mm Gauged (Standard Flooring) — ₹65 / sq.ft",
        price: 65,
        mrp: 95,
        priceRange: "₹55 – ₹85 / sq.ft"
      },
      {
        value: "25 - 30 mm Calibrated",
        chipLabel: "25-30mm Calibrated",
        label: "25 - 30 mm Calibrated (Machine Cut Heavy) — ₹95 / sq.ft",
        price: 95,
        mrp: 135,
        priceRange: "₹85 – ₹120 / sq.ft"
      },
      {
        value: "15 - 18 mm Commercial Polish",
        chipLabel: "15-18mm Polish",
        label: "15 - 18 mm Commercial Polish (Economy) — ₹48 / sq.ft",
        price: 48,
        mrp: 70,
        priceRange: "₹45 – ₹60 / sq.ft"
      },
      {
        value: "30 - 35 mm Heavy Slabs",
        chipLabel: "30-35mm Slabs",
        label: "30 - 35 mm Heavy Corridors & Gangsaw Slabs — ₹125 / sq.ft",
        price: 125,
        mrp: 175,
        priceRange: "₹115 – ₹155 / sq.ft"
      },
      {
        value: "40 - 50 mm Quarry Paver",
        chipLabel: "40-50mm Paver",
        label: "40 - 50 mm Rough Quarry Paver / Driveway — ₹165 / sq.ft",
        price: 165,
        mrp: 220,
        priceRange: "₹150 – ₹195 / sq.ft"
      }
    ],
    sizes: [
      { value: "2×2 ft (600×600 mm)", chipLabel: "2×2 ft (600mm)", label: "2×2 ft (600×600 mm) — Standard Square Tile" },
      { value: "2×1 ft (600×300 mm)", chipLabel: "2×1 ft (600×300)", label: "2×1 ft (600×300 mm) — Rectangular Paver" },
      { value: "22×22 inch (560×560 mm)", chipLabel: "22×22 in", label: "22×22 inch (560×560 mm) — Classic Mandi Size" },
      { value: "17×23 inch (430×580 mm)", chipLabel: "17×23 in", label: "17×23 inch (430×580 mm) — Pre-cut Tile" },
      { value: "2×4 ft (600×1200 mm Grand Slab)", chipLabel: "2×4 ft Grand", label: "2×4 ft (600×1200 mm) — Grand Gangsaw Slab" },
      { value: "1×1 ft (300×300 mm Small Paver)", chipLabel: "1×1 ft Paver", label: "1×1 ft (300×300 mm) — Compact Paver" }
    ],
    finishes: [
      { value: "Mirror High Polish / Honed", chipLabel: "Mirror Polish", label: "Mirror High Polish (Diamond Machine Honed)" },
      { value: "Honed Satin Smooth / Machine Cut", chipLabel: "Honed Satin", label: "Honed Satin Smooth / Machine Cut Square Edge" },
      { value: "River Washed / Flamed Texture", chipLabel: "River Washed", label: "River Washed / Flamed Non-Slip Textured" },
      { value: "Shot Blasted Anti-Skid Surface", chipLabel: "Shot Blasted", label: "Shot Blasted / Bush Hammered Anti-Skid" },
      { value: "Hand-Chiseled Natural Split Face", chipLabel: "Hand-Chiseled", label: "Hand-Chiseled Natural Split Quarry Face" }
    ],
    applications: [
      { value: "Natural Indurated Limestone / Heavy Traffic Flooring", chipLabel: "Limestone Flooring", label: "Natural Indurated Limestone / Commercial Flooring & Corridors" },
      { value: "Kota Blue-Green Limestone / Patios & Pathways", chipLabel: "Patios & Pathways", label: "Kota Blue-Green Limestone / Patios & Landscaping" },
      { value: "Brown Kota Limestone / Premium Living & Wall Cladding", chipLabel: "Brown Kota", label: "Brown Kota Limestone / Premium Living & Cladding" }
    ]
  },

  sandstone: {
    thickness: [
      {
        value: "25 - 30 mm Calibrated",
        chipLabel: "25-30mm Calibrated",
        label: "25 - 30 mm Calibrated (Standard Paving) — ₹140 / sq.ft",
        price: 140,
        mrp: 190,
        priceRange: "₹125 – ₹170 / sq.ft"
      },
      {
        value: "18 - 20 mm Sawn Cladding",
        chipLabel: "18-20mm Cladding",
        label: "18 - 20 mm Sawn Cladding (Lightweight Wall) — ₹110 / sq.ft",
        price: 110,
        mrp: 150,
        priceRange: "₹95 – ₹130 / sq.ft"
      },
      {
        value: "35 - 40 mm Heavy Landscape",
        chipLabel: "35-40mm Landscape",
        label: "35 - 40 mm Heavy Landscape Pavers — ₹185 / sq.ft",
        price: 185,
        mrp: 250,
        priceRange: "₹165 – ₹220 / sq.ft"
      },
      {
        value: "50 mm Heritage Cut Slabs",
        chipLabel: "50mm Heritage",
        label: "50 mm Architectural Heritage Steps & Slabs — ₹240 / sq.ft",
        price: 240,
        mrp: 320,
        priceRange: "₹220 – ₹290 / sq.ft"
      }
    ],
    sizes: [
      { value: "2×2 ft (600×600 mm)", chipLabel: "2×2 ft (600mm)", label: "2×2 ft (600×600 mm) — Standard Sawn Tile" },
      { value: "600×900 mm Architectural Slab", chipLabel: "600×900 mm", label: "600×900 mm — Large Format Architectural Slab" },
      { value: "2×1 ft (600×300 mm)", chipLabel: "2×1 ft", label: "2×1 ft (600×300 mm) — Facade Wall Tile" },
      { value: "Custom Carved Jali Screen Panel (3×4 ft)", chipLabel: "3×4 ft Jali", label: "Custom Carved Jali Screen Panel (3×4 ft)" },
      { value: "1×1 ft (300×300 mm Paver)", chipLabel: "1×1 ft Paver", label: "1×1 ft (300×300 mm) — Landscape Paver" }
    ],
    finishes: [
      { value: "Sandblasted / Honed Satin", chipLabel: "Sandblasted", label: "Sandblasted / Honed Satin Matte" },
      { value: "Hand-Chiseled Rock Face / Chamfered", chipLabel: "Hand-Chiseled", label: "Hand-Chiseled Natural Rock Face" },
      { value: "Mirror Polish / Calibration Sawn", chipLabel: "Mirror Polish", label: "Diamond Sawn Smooth Surface" },
      { value: "Flamed Non-Slip / River Texture", chipLabel: "Flamed", label: "Flamed Non-Slip River Wash" }
    ],
    applications: [
      { value: "Natural Quartzite Sandstone / High Traffic Flooring & Facades", chipLabel: "Quartzite Facades", label: "Natural Quartzite Sandstone / High Traffic Flooring & Facades" },
      { value: "Dholpur Beige Sandstone / Heritage Cladding & Jali", chipLabel: "Dholpur Beige", label: "Dholpur Beige Sandstone / Exterior Cladding & Jali" },
      { value: "Jodhpur Pink / Red Sandstone / Fort Architecture", chipLabel: "Jodhpur Sandstone", label: "Jodhpur Pink / Red Sandstone / Fort Architecture" }
    ]
  },

  garlic: {
    thickness: [
      {
        value: "50 - 65 mm (Grade A+ Large)",
        chipLabel: "50-65mm Grade A+",
        label: "50 - 65 mm (Grade A+ Large Bulbs) — ₹220 / kg",
        price: 220,
        mrp: 280,
        priceRange: "₹200 – ₹260 / kg"
      },
      {
        value: "40 - 50 mm (Grade A Medium)",
        chipLabel: "40-50mm Grade A",
        label: "40 - 50 mm (Grade A Medium Mandi) — ₹180 / kg",
        price: 180,
        mrp: 240,
        priceRange: "₹160 – ₹210 / kg"
      },
      {
        value: "30 - 40 mm (Grade B Commercial)",
        chipLabel: "30-40mm Commercial",
        label: "30 - 40 mm (Grade B Commercial Lot) — ₹140 / kg",
        price: 140,
        mrp: 190,
        priceRange: "₹120 – ₹160 / kg"
      },
      {
        value: "G2 / Yamuna Safed Special Big Clove",
        chipLabel: "G2 Special Clove",
        label: "G2 / Yamuna Safed Special Big Clove — ₹260 / kg",
        price: 260,
        mrp: 340,
        priceRange: "₹240 – ₹310 / kg"
      }
    ],
    sizes: [
      { value: "50 - 65 mm (Grade A+ Large)", chipLabel: "50-65mm A+", label: "50 - 65 mm (Grade A+ Large)" },
      { value: "40 - 50 mm (Grade A Medium)", chipLabel: "40-50mm A", label: "40 - 50 mm (Grade A Medium)" },
      { value: "30 - 40 mm (Grade B Commercial)", chipLabel: "30-40mm B", label: "30 - 40 mm (Grade B Commercial)" },
      { value: "G2 Yamuna Safed Premium Lot", chipLabel: "G2 Premium", label: "G2 Yamuna Safed Premium Lot" }
    ],
    finishes: [
      { value: "Sun-Cured Export Clean White Skin, Clean Cut Roots", chipLabel: "Sun-Cured White", label: "Sun-Cured Export Clean White Skin, Clean Cut Roots" },
      { value: "Natural Desi Pinkish-White Skin, 10-14 Cloves", chipLabel: "Desi Pinkish", label: "Natural Desi Pinkish-White Skin, 10-14 Cloves" },
      { value: "Unbleached Double-Skin Protected Bulbs", chipLabel: "Unbleached Double", label: "Unbleached Double-Skin Protected Bulbs" }
    ],
    applications: [
      { value: "Malwa Desi Garlic in 25kg Aerated Red Mesh Bags", chipLabel: "25kg Mesh Bags", label: "Malwa Desi Garlic in 25kg Aerated Red Mesh Bags" },
      { value: "Amleta Big Clove in 10kg Corrugated Boxes", chipLabel: "10kg Cartons", label: "Amleta Big Clove in 10kg Corrugated Boxes" },
      { value: "Mandi Wholesale, Food Processing & Dehydration", chipLabel: "Food Processing", label: "Mandi Wholesale, Food Processing & Dehydration" }
    ]
  },

  kotadoria: {
    thickness: [
      {
        value: "6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in",
        chipLabel: "6.5m Saree + Blouse",
        label: "6.5 Metres (Saree with Blouse Piece) — ₹3,500",
        price: 3500,
        mrp: 5200,
        priceRange: "₹2,800 – ₹6,500"
      },
      {
        value: "5.5 Metres (Single Saree without Blouse) × 44 in",
        chipLabel: "5.5m Single Saree",
        label: "5.5 Metres (Single Saree) — ₹2,800",
        price: 2800,
        mrp: 4200,
        priceRange: "₹2,400 – ₹4,800"
      },
      {
        value: "2.5 Metres (Handloom Dupatta) × 36 in",
        chipLabel: "2.5m Dupatta",
        label: "2.5 Metres (Handloom Dupatta) — ₹1,450",
        price: 1450,
        mrp: 2200,
        priceRange: "₹1,200 – ₹2,400"
      },
      {
        value: "3-Piece Salwar Suit Cut (7.5m Total)",
        chipLabel: "3-Pc Suit Cut",
        label: "3-Piece Salwar Suit Ensemble (7.5m) — ₹4,200",
        price: 4200,
        mrp: 6000,
        priceRange: "₹3,500 – ₹7,500"
      }
    ],
    sizes: [
      { value: "6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in", chipLabel: "6.5m Saree + Blouse", label: "6.5 Metres with 80cm Running Blouse" },
      { value: "5.5 Metres (Single Saree) × 44 in", chipLabel: "5.5m Saree", label: "5.5 Metres Single Saree" },
      { value: "2.5 Metres Dupatta × 36 in", chipLabel: "2.5m Dupatta", label: "2.5 Metres Handloom Dupatta" },
      { value: "Running Fabric by the Metre (44 in width)", chipLabel: "Running Yardage", label: "Running Fabric by the Metre" }
    ],
    finishes: [
      { value: "Traditional 300+ Square Khat Grid with Tested Gold Zari", chipLabel: "Gold Zari Khat", label: "Traditional 300+ Square Khat Grid with Tested Gold Zari" },
      { value: "Silver Zari Khat Check with Woven Floral Pallu", chipLabel: "Silver Zari", label: "Silver Zari Khat Check with Woven Floral Pallu" },
      { value: "Pure Cotton Plain Khat Grid with Contrast Resham Border", chipLabel: "Resham Border", label: "Pure Cotton Plain Khat Grid with Contrast Resham Border" }
    ],
    applications: [
      { value: "Pure Mulberry Silk & Cotton / Wedding & Festive Wear", chipLabel: "Bridal & Festive", label: "Pure Mulberry Silk & Cotton / Wedding & Festive Wear" },
      { value: "100% Pure Organic Cotton / Daily & Office Wear", chipLabel: "Daily Wear", label: "100% Pure Organic Cotton / Daily & Office Wear" },
      { value: "Tissue Silk Blend / High-End Boutique Luxury", chipLabel: "Boutique Luxury", label: "Tissue Silk Blend / High-End Boutique Luxury" }
    ]
  }
};

/**
 * Returns dynamic presets prioritizing the company's saved Data Bank,
 * falling back gracefully to ODOP industry defaults.
 */
export function getCompanyPresets(company, categoryFamily) {
  const companySpecs = company?.dataBank?.specifications || {};
  const staticFallback = ODOP_CATEGORY_PRESETS[categoryFamily] || ODOP_CATEGORY_PRESETS.kotastone;

  return {
    thickness: (companySpecs.thicknesses && companySpecs.thicknesses.length > 0)
      ? companySpecs.thicknesses
      : (staticFallback.thickness || []),
    sizes: (companySpecs.sizes && companySpecs.sizes.length > 0)
      ? companySpecs.sizes
      : (staticFallback.sizes || []),
    finishes: (companySpecs.finishes && companySpecs.finishes.length > 0)
      ? companySpecs.finishes
      : (staticFallback.finishes || []),
    applications: (companySpecs.applications && companySpecs.applications.length > 0)
      ? companySpecs.applications
      : (companySpecs.materials && companySpecs.materials.length > 0)
      ? companySpecs.materials
      : (staticFallback.applications || []),
    priceRanges: (companySpecs.priceRanges && companySpecs.priceRanges.length > 0)
      ? companySpecs.priceRanges
      : (staticFallback.priceRanges || []),
  };
}

/**
 * SmartPresetInput:
 * Clean, modern combobox with integrated Presets dropdown,
 * 1-click quick pills, auto price recalculation, and non-overlapping custom saving.
 */
export function SmartPresetInput({
  label,
  value,
  onChange,
  placeholder,
  presets = [],
  onSelectPreset,
  icon,
  customHelpText,
  onSaveToDataBank,
}) {
  const matchedPreset = presets.find((p) => p.value === value || p.label === value);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === "__custom__") {
      return;
    }
    const found = presets.find((p) => p.value === val);
    if (found) {
      onChange(found.value);
      if (onSelectPreset) onSelectPreset(found);
    }
  };

  const handleChipClick = (preset) => {
    onChange(preset.value);
    if (onSelectPreset) onSelectPreset(preset);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {/* Label and Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "20px" }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "5px" }}>
          {icon} {label}
        </label>
        {value && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "1px 7px",
              borderRadius: "12px",
              background: matchedPreset ? "rgba(99, 102, 241, 0.1)" : "rgba(245, 158, 11, 0.1)",
              color: matchedPreset ? "var(--primary, #4f46e5)" : "#d97706",
              border: `1px solid ${matchedPreset ? "rgba(99, 102, 241, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
              whiteSpace: "nowrap"
            }}
          >
            {matchedPreset ? "✓ Pre-filled" : "✏️ Custom"}
          </span>
        )}
      </div>

      {/* Unified Input + Integrated Dropdown Trigger */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          borderRadius: "8px",
          border: matchedPreset ? "1.5px solid rgba(99, 102, 241, 0.4)" : "1.5px solid var(--border-medium)",
          background: "var(--bg-surface)",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          transition: "all 0.15s ease"
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "transparent",
            padding: "8px 12px",
            fontSize: "0.84rem",
            color: "var(--text-primary)",
            outline: "none",
          }}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />

        {presets.length > 0 && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              borderLeft: "1px solid var(--border-subtle)",
              background: "var(--bg-surface-elevated)",
              padding: "0 10px",
              cursor: "pointer"
            }}
            title="Choose from company Data Bank presets"
          >
            <select
              value={matchedPreset ? matchedPreset.value : "__custom__"}
              onChange={handleSelectChange}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <option value="" disabled>Select Preset...</option>
              {presets.map((p, idx) => (
                <option key={idx} value={p.value}>
                  {p.label || p.value}
                </option>
              ))}
              <option value="__custom__">Custom</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: "var(--primary, #4f46e5)", pointerEvents: "none", whiteSpace: "nowrap" }}>
              <span>Presets</span>
              <span style={{ fontSize: "0.62rem" }}>▾</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick 1-Click Pills & Save to Data Bank Button */}
      {presets.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center", marginTop: "2px" }}>
          {presets.slice(0, 4).map((p, idx) => {
            const isSelected = value === p.value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(p)}
                style={{
                  fontSize: "0.71rem",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  border: isSelected ? "1.5px solid var(--primary, #4f46e5)" : "1px solid var(--border-subtle)",
                  background: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--bg-surface-elevated)",
                  color: isSelected ? "var(--primary, #4f46e5)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: isSelected ? 750 : 550,
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title={p.price ? `Auto-calculates price: ₹${p.price}` : "1-click select"}
              >
                {isSelected && <span style={{ fontSize: "0.65rem" }}>✓</span>}
                <span>{p.chipLabel || p.value}</span>
                {p.price !== undefined && (
                  <span style={{
                    fontSize: "0.64rem",
                    fontWeight: 800,
                    marginLeft: "2px",
                    background: isSelected ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.12)",
                    color: "#15803d",
                    padding: "0 4px",
                    borderRadius: "3px"
                  }}>
                    ₹{p.price}
                  </span>
                )}
              </button>
            );
          })}

          {/* Clean Save to Data Bank Button if custom value typed */}
          {!matchedPreset && value && onSaveToDataBank && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSaveToDataBank(value);
              }}
              style={{
                fontSize: "0.69rem",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#059669",
                fontWeight: 750,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginLeft: "auto",
                transition: "all 0.15s ease"
              }}
              title="Save this custom value to company Data Bank"
            >
              <span>Save to Data Bank</span>
            </button>
          )}
        </div>
      )}

      {/* Helpful prompt if custom */}
      {customHelpText && !matchedPreset && (
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "1px" }}>{customHelpText}</span>
      )}
    </div>
  );
}

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

  // Dynamic Price Notice state
  const [priceNotice, setPriceNotice] = useState("");
  const [isDataBankModalOpen, setIsDataBankModalOpen] = useState(false);
  const [initialDataBankTab, setInitialDataBankTab] = useState("specs");
  const [isProductSheetModalOpen, setIsProductSheetModalOpen] = useState(false);
  const [dataBankToast, setDataBankToast] = useState(null);

  // Image Upscaler & AI Studio Integration
  const [isUpscaleModalOpen, setIsUpscaleModalOpen] = useState(false);
  const [pendingUploadImage, setPendingUploadImage] = useState("");
  const [upscaleStats, setUpscaleStats] = useState(null);
  const [upscaleTargetProductId, setUpscaleTargetProductId] = useState(null);

  // Full-Resolution Product Image Preview Modal
  const [imagePreviewModal, setImagePreviewModal] = useState({
    isOpen: false,
    url: "",
    title: "",
    meta: {},
    stats: null,
  });

  const openImagePreview = (url, title = "Product Preview", meta = {}, stats = null) => {
    const effectiveUrl =
      url ||
      resolveProductImageUrl({ ...meta, image: url }, categoryFamily, 0) ||
      (CATEGORY_FALLBACK_IMAGES[categoryFamily]?.[0] || "/assets/garlic/garlic-01.jpeg");
    setImagePreviewModal({
      isOpen: true,
      url: effectiveUrl,
      title,
      meta,
      stats: stats || meta?.upscaleStats || null,
    });
  };

  // Initial Product Form State
  const [productForm, setProductForm] = useState(() => getDefaultProductForm("general", null));

  // Active Category Family (determined once from company registration)
  const categoryFamily = useMemo(() => {
    return getCategoryFamily(company || productForm);
  }, [company, productForm.odopProduct, productForm.category, productForm.district]);

  // Dynamic specifications presets resolved directly from the company's Data Bank!
  const effectivePresets = useMemo(() => {
    return getCompanyPresets(company, categoryFamily);
  }, [company?.dataBank, categoryFamily]);

  const handleSaveSpecToDataBank = async (fieldKey, value, extraProps = {}) => {
    if (!company?._id || !value || !value.toString().trim()) return;
    const strVal = value.toString().trim();
    try {
      const currentBank = company.dataBank ? JSON.parse(JSON.stringify(company.dataBank)) : {};
      const specs = currentBank.specifications || {};
      const list = specs[fieldKey] || [];
      if (list.some((item) => (item.value || item) === strVal)) {
        setDataBankToast(`"${strVal}" is already in your Data Bank.`);
        setTimeout(() => setDataBankToast(null), 3000);
        return;
      }
      const newItem = {
        value: strVal,
        chipLabel: strVal.slice(0, 16),
        label: strVal,
        ...extraProps,
      };
      const updatedSpecs = {
        ...specs,
        [fieldKey]: [...list, newItem],
      };
      const updatedDataBank = {
        ...currentBank,
        specifications: updatedSpecs,
      };
      await updateCompanyDataBank(company._id, updatedDataBank);
      setCompany((prev) => ({ ...prev, dataBank: updatedDataBank }));
      setDataBankToast(`✓ Saved "${strVal}" to ${company.name} Data Bank!`);
      setTimeout(() => setDataBankToast(null), 3500);
    } catch (err) {
      alert("Failed to save to Data Bank: " + err.message);
    }
  };

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadCompanyAndProducts();
  }, [companyId]);

  const loadCompanyAndProducts = async () => {
    try {
      setLoading(true);
      const [compRes, prodRes] = await Promise.all([
        fetchCompanies().catch((err) => ({ data: [] })),
        fetchCatalogueProducts({ limit: 500 }).catch((err) => ({ data: { products: [] } })),
      ]);

      let targetCompany = null;
      let fam = "general";
      if (compRes && compRes.data && compRes.data.length > 0) {
        targetCompany =
          compRes.data.find((c) => String(c._id) === String(companyId)) ||
          compRes.data.find(
            (c) =>
              c.name &&
              companyId &&
              c.name.toLowerCase() === decodeURIComponent(companyId).toLowerCase()
          ) ||
          compRes.data[0];
        setCompany(targetCompany);
        const defOdop = getCompanyDefaultOdop(targetCompany);
        fam = getCategoryFamily(targetCompany || defOdop);

        // Populate productForm with authentic category-specific defaults
        setProductForm(getDefaultProductForm(fam, targetCompany));
      }

      if (targetCompany) {
        let prods = [];
        if (prodRes?.data?.products && Array.isArray(prodRes.data.products)) {
          prods = [...prodRes.data.products];
        } else if (Array.isArray(prodRes?.data)) {
          prods = [...prodRes.data];
        }

        // Match products belonging strictly to this company from server API
        let compProducts = prods.filter(
          (p) =>
            (String(p.companyId) === String(targetCompany._id) ||
              (p.brand &&
                targetCompany.name &&
                p.brand.toLowerCase() === targetCompany.name.toLowerCase()) ||
              (p.companyName &&
                targetCompany.name &&
                p.companyName.toLowerCase() === targetCompany.name.toLowerCase()))
        );

        // If no products matched by ID or name, match compatible products
        if (compProducts.length === 0) {
          compProducts = prods.filter((p) => isProductCompatibleWithFamily(p, fam));
        }

        // Guarantee every product has an authentic, high-definition image resolved
        compProducts = compProducts.map((p, idx) => ({
          ...p,
          image: resolveProductImageUrl(p, fam, idx),
        }));

        setProducts(compProducts);
      }
    } catch (err) {
      console.error("Error loading catalogue products from API:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Upload Product Image from Computer & Trigger AI Upscale Dialog
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingUploadImage(reader.result);
      setIsUpscaleModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const [removeBgModal, setRemoveBgModal] = useState({ isOpen: false, productId: null, imageSrc: null });

  const handleApplyRemoveBgImage = async (cutoutImage) => {
    const targetId = removeBgModal.productId;
    if (!targetId) return;
    if (targetId === "FORM") {
      setProductForm((prev) => ({ ...prev, image: cutoutImage }));
      return;
    }
    setProducts((prev) =>
      prev.map((item) => (item._id === targetId ? { ...item, image: cutoutImage } : item))
    );
    setFailedThumbnails((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setImagePreviewModal((prev) => {
      if (prev.isOpen && prev.meta?.id === targetId) {
        return { ...prev, url: cutoutImage };
      }
      return prev;
    });
    try {
      await updateCatalogueProduct(targetId, { image: cutoutImage });
    } catch (err) {
      console.warn("Product image server update:", err.message);
    }
  };

  const handleApplyUpscaledImage = async (finalImage, stats) => {
    if (upscaleTargetProductId) {
      const targetId = upscaleTargetProductId;
      setUpscaleTargetProductId(null);
      // Immediately update local UI product list
      setProducts((prev) =>
        prev.map((item) => (item._id === targetId ? { ...item, image: finalImage, upscaleStats: stats } : item))
      );
      setFailedThumbnails((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      // Update imagePreviewModal if it is open for this product
      setImagePreviewModal((prev) => {
        if (prev.isOpen && prev.meta?.id === targetId) {
          return { ...prev, url: finalImage, stats: stats };
        }
        return prev;
      });
      // Sync image update directly with backend API
      try {
        await updateCatalogueProduct(targetId, { image: finalImage });
      } catch (err) {
        console.warn("Product image server update:", err.message);
      }
      setDataBankToast(`✓ Image upscaled to Super Clarity (${stats?.scale || "2x"} HD)!`);
      setTimeout(() => setDataBankToast(null), 4000);
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      image: finalImage,
      images: [{ url: finalImage, isPrimary: true, backgroundType: "white" }],
    }));
    setImagePreview(finalImage);
    setUpscaleStats(stats);
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

    // Seamlessly inject thickness and weight into technicalSpecifications if present
    const specs = Array.isArray(productForm.technicalSpecifications) ? [...productForm.technicalSpecifications] : [];
    if (productForm.thickness && !specs.some((s) => s.key?.toLowerCase().includes("thickness"))) {
      specs.unshift({ key: "Thickness", value: productForm.thickness, verified: true });
    }
    if (productForm.fabricWeight && !specs.some((s) => s.key?.toLowerCase().includes("weight"))) {
      specs.unshift({ key: "Fabric Weight", value: productForm.fabricWeight, verified: true });
    }

    const resolvedColor = productForm.finish || productForm.color || (
      categoryFamily === "garlic" ? "Natural Clean White" :
      categoryFamily === "sandstone" || categoryFamily === "kotastone" ? "Natural Quarried Stone" :
      categoryFamily === "kotadoria" ? "Gold & Natural" : "Natural"
    );
    const resolvedMaterial = productForm.material || productForm.materialComposition || (
      categoryFamily === "garlic" ? "Organically Grown Produce" :
      categoryFamily === "sandstone" ? "Natural Quartzite Sandstone" :
      categoryFamily === "kotastone" ? "Natural Indurated Limestone" :
      categoryFamily === "kotadoria" ? "Pure Mulberry Silk & Cotton" : "Standard Material"
    );

    const payload = {
      ...productForm,
      color: resolvedColor,
      finish: productForm.finish || resolvedColor,
      material: resolvedMaterial,
      materialComposition: resolvedMaterial,
      thickness: productForm.thickness || "",
      fabricWeight: productForm.fabricWeight || "",
      technicalSpecifications: specs,
      companyId: company?._id,
      brand: company?.name || productForm.brand || "Brand",
      sku: productForm.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      status: "approved",
      unit: productForm.unit !== undefined ? productForm.unit : "",
      pricingUnit: productForm.unit !== undefined ? productForm.unit : "",
    };

    try {
      if (editingProductId) {
        const res = await updateCatalogueProduct(editingProductId, payload);
        const serverData = res?.data || { ...payload, _id: editingProductId };
        setProducts((prev) =>
          prev.map((item) => (item._id === editingProductId ? { ...item, ...serverData } : item))
        );
      } else {
        const created = await createCatalogueProduct(payload);
        if (created?.data) {
          setProducts((prev) => [created.data, ...prev]);
        }
      }
      setIsProductModalOpen(false);
      setEditingProductId(null);
      resetForm();
      loadCompanyAndProducts();
    } catch (err) {
      console.warn("Product save server error:", err.message);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit existing product
  const handleOpenEditProduct = (p) => {
    setEditingProductId(p._id);

    let currentP = { ...p };

    const pSpecs = currentP.technicalSpecifications || [];
    const findSpec = (key) => pSpecs.find((s) => s.key?.toLowerCase().includes(key.toLowerCase()))?.value || "";

    const resolvedSize = currentP.size || findSpec("size") || findSpec("dimension") || "";
    const resolvedThickness = currentP.thickness || findSpec("thickness") || findSpec("gauge") || "";
    const resolvedFabricWeight = currentP.fabricWeight || (typeof currentP.weight === "object" ? (currentP.weight.value ? `${currentP.weight.value} ${currentP.weight.unit || 'g'}` : "") : currentP.weight) || findSpec("fabric weight") || findSpec("weight") || findSpec("yarn count") || "";
    const resolvedMaterial = currentP.material || currentP.materialComposition || findSpec("material") || "";
    const resolvedFinish = currentP.finish || currentP.color || findSpec("finish") || "";
    const resolvedApp = currentP.application || currentP.useApplication || findSpec("application") || findSpec("use") || "";
    const resolvedPriceRange = currentP.priceRange || (currentP.price ? `₹${currentP.price.toLocaleString()} – ₹${(currentP.mrp || Math.round(currentP.price * 1.35)).toLocaleString()}` : "");

    setProductForm({
      name: currentP.name || "",
      sku: currentP.sku || "",
      brand: currentP.brand || "",
      category:
        currentP.category ||
        (categoryFamily === "garlic"
          ? "Garlic Specialty"
          : categoryFamily === "kotastone"
          ? "Kota Stone Specialty"
          : categoryFamily === "sandstone"
          ? "Sand Stone Specialty"
          : "Kota Doria Specialty"),
      district: currentP.district || company?.district || (categoryFamily === "garlic" ? "Baran, Rajasthan" : "Kota, Rajasthan"),
      odopProduct: currentP.odopProduct || company?.odopProduct || (categoryFamily === "garlic" ? "Garlic" : "Kota Doria"),
      size: resolvedSize,
      thickness: resolvedThickness,
      fabricWeight: resolvedFabricWeight,
      material: resolvedMaterial,
      finish: resolvedFinish,
      application: resolvedApp,
      useApplication: resolvedApp,
      priceRange: resolvedPriceRange,
      subcategory: currentP.subcategory || "",
      price: currentP.price || 0,
      unit: currentP.unit !== undefined ? currentP.unit : (currentP.pricingUnit || ""),
      pricingUnit: currentP.pricingUnit !== undefined ? currentP.pricingUnit : (currentP.unit || ""),
      mrp: currentP.mrp || 0,
      stock: currentP.stock || 0,
      image: currentP.image || (currentP.images && currentP.images[0]?.url) || "",
      description: currentP.description || "",
      shortDescription: currentP.shortDescription || "",
      keyFeatures: currentP.keyFeatures || [],
      materialComposition: resolvedMaterial,
      color: resolvedFinish,
      hsnCode: currentP.hsnCode || "",
      dimensions: currentP.dimensions || { length: 0, width: 0, height: 0, unit: "cm" },
      weight: currentP.weight || { value: 0, unit: "g" },
      technicalSpecifications: currentP.technicalSpecifications || [],
    });
    setImagePreview(currentP.image || "");
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from catalogue?")) return;
    try {
      await deleteCatalogueProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.warn("Delete request error:", err.message);
      alert("Failed to delete product: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    const defOdop = getCompanyDefaultOdop(company);
    const fam = getCategoryFamily(company || defOdop);
    setProductForm(getDefaultProductForm(fam, company));
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

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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
            className="btn btn-outline"
            style={{
              color: "#059669",
              borderColor: "rgba(16, 185, 129, 0.45)",
              background: "rgba(16, 185, 129, 0.08)",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => setIsProductSheetModalOpen(true)}
            title="Upload multiple products at once from Excel or CSV spreadsheet"
          >
            <FileSpreadsheet size={16} />
            <span>Upload Products Sheet (Excel/CSV)</span>
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
                <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.12)", color: "var(--primary)", padding: "2px 8px", borderRadius: "4px", verticalAlign: "middle", fontWeight: 700 }}>
                  📍 District: {company.district || (company.odopProduct === "Garlic" ? "Baran, Rajasthan" : company.odopProduct === "Kota Stone" ? "Jhalawar, Rajasthan" : company.odopProduct === "Sandstone" ? "Bundi, Rajasthan" : "Kota, Rajasthan")}
                </span>
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

                <button
                  className="btn btn-outline btn-sm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.78rem",
                    padding: "3px 10px",
                    fontWeight: 750,
                    background: "rgba(99, 102, 241, 0.08)",
                    border: "1px solid rgba(99, 102, 241, 0.35)",
                    color: "var(--primary)",
                  }}
                  title="Manage Company Pre-Filled Data Bank (Headings, Stories & Specs)"
                  onClick={() => setIsDataBankModalOpen(true)}
                >
                  <Database size={13} />
                  <span>Company Data Bank</span>
                  <span style={{ fontSize: "0.68rem", background: "var(--primary)", color: "#fff", padding: "1px 6px", borderRadius: "10px", fontWeight: 800 }}>
                    {(company.dataBank?.specifications?.thicknesses?.length || 0) + (company.dataBank?.headings?.length || 0) || "Ready"}
                  </span>
                </button>

                <button
                  className="btn btn-outline btn-sm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.78rem",
                    padding: "3px 10px",
                    fontWeight: 750,
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#059669",
                  }}
                  title="Upload / Update Category Data Bank via Excel or CSV spreadsheet"
                  onClick={() => {
                    setInitialDataBankTab("sheet");
                    setIsDataBankModalOpen(true);
                  }}
                >
                  <FileSpreadsheet size={13} />
                  <span>Category Sheet Upload</span>
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
                        {products.length === 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                              No products added to catalogue yet
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "420px" }}>
                              Add products individually using your pre-filled category Data Bank, or upload an entire spreadsheet at once.
                            </div>
                            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  resetForm();
                                  setEditingProductId(null);
                                  setIsProductModalOpen(true);
                                }}
                              >
                                <Plus size={14} /> Add Product Manually
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                style={{
                                  color: "#059669",
                                  borderColor: "rgba(16, 185, 129, 0.45)",
                                  background: "rgba(16, 185, 129, 0.08)",
                                  fontWeight: 700,
                                }}
                                onClick={() => setIsProductSheetModalOpen(true)}
                              >
                                <FileSpreadsheet size={14} /> Upload Products Sheet (Excel/CSV)
                              </button>
                            </div>
                          </div>
                        ) : (
                          "No products matched your search or category filter."
                        )}
                      </td>
                    </tr>
                  );
                }

                return filtered.map((p, idx) => {
                  const resolvedImg = resolveProductImageUrl(p, categoryFamily, idx);
                  const isThumbFailed = failedThumbnails[p._id];
                  const displayImg = isThumbFailed
                    ? (CATEGORY_FALLBACK_IMAGES[categoryFamily]?.[idx % (CATEGORY_FALLBACK_IMAGES[categoryFamily]?.length || 1)] || "/assets/garlic/garlic-01.jpeg")
                    : resolvedImg;

                  return (
                    <tr key={p._id}>
                      <td>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            openImagePreview(displayImg, p.name, {
                              sku: p.sku,
                              category: p.category,
                              price: p.price,
                              mrp: p.mrp,
                              unit: p.unit,
                              district: p.district,
                              id: p._id,
                              size: p.size,
                              material: p.material || p.materialComposition,
                              finish: p.finish,
                              application: p.application || p.useApplication,
                              priceRange: p.priceRange,
                              stock: p.stock,
                              upscaleStats: p.upscaleStats || null,
                            }, p.upscaleStats || null)
                          }
                          title="Click to preview high-definition image"
                          style={{
                            position: "relative",
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-sm)",
                            overflow: "hidden",
                            cursor: "pointer",
                            border: "1px solid var(--border-subtle)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            display: "block",
                            background: "var(--bg-surface-elevated)",
                          }}
                        >
                          <img
                            src={displayImg}
                            alt={p.name}
                            onError={(e) => {
                              if (!failedThumbnails[p._id]) {
                                setFailedThumbnails((prev) => ({ ...prev, [p._id]: true }));
                                const fallback = CATEGORY_FALLBACK_IMAGES[categoryFamily]?.[0] || "/assets/garlic/garlic-01.jpeg";
                                e.currentTarget.src = fallback;
                              }
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(15, 23, 42, 0.45)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.15s ease",
                              color: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                          >
                            <Eye size={16} />
                          </div>
                        </div>
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
                          {p.size ? `📏 ${p.size} • ` : ""}{p.material || p.materialComposition || ""}
                        </div>
                        {p.finish && (
                          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                            ✨ {p.finish}
                          </div>
                        )}
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
                            display: "inline-block",
                          }}
                        >
                          {p.category}
                        </span>
                        <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700, marginTop: "3px" }}>
                          📍 {p.district || (
                            (p.category || "").toLowerCase().includes("garlic") ? "Baran, Rajasthan" :
                            (p.category || "").toLowerCase().includes("kota stone") ? "Jhalawar, Rajasthan" :
                            (p.category || "").toLowerCase().includes("sand") ? "Bundi, Rajasthan" :
                            "Kota, Rajasthan"
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                          ₹{p.price?.toLocaleString?.() || p.price}{p.unit ? ` / ${p.unit}` : ""}
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
                            title="👁️ Preview full resolution image"
                            onClick={() =>
                              openImagePreview(displayImg, p.name, {
                                sku: p.sku,
                                category: p.category,
                                price: p.price,
                                mrp: p.mrp,
                                unit: p.unit,
                                district: p.district,
                                id: p._id,
                                size: p.size,
                                material: p.material || p.materialComposition,
                                finish: p.finish,
                                application: p.application || p.useApplication,
                                priceRange: p.priceRange,
                                stock: p.stock,
                                upscaleStats: p.upscaleStats || null,
                              }, p.upscaleStats || null)
                            }
                            style={{
                              color: "#2563eb",
                              borderColor: "rgba(37, 99, 235, 0.35)",
                              background: "rgba(37, 99, 235, 0.08)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 700,
                              padding: "4px 8px",
                              fontSize: "0.78rem",
                            }}
                          >
                            <Eye size={13} />
                            <span>Preview</span>
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            title="✨ Upscale & Enhance to Super Clarity HD"
                            onClick={() => {
                              setPendingUploadImage(displayImg);
                              setUpscaleTargetProductId(p._id);
                              setIsUpscaleModalOpen(true);
                            }}
                            style={{
                              color: "#059669",
                              borderColor: "rgba(16, 185, 129, 0.4)",
                              background: "rgba(16, 185, 129, 0.08)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 750,
                              padding: "4px 9px",
                              fontSize: "0.78rem",
                            }}
                          >
                            <Zap size={13} />
                            <span>HD Upscale</span>
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            title="Remove Background using rembg"
                            onClick={() => setRemoveBgModal({ isOpen: true, productId: p._id, imageSrc: displayImg })}
                            style={{
                              color: "#7c3aed",
                              borderColor: "rgba(124, 58, 237, 0.35)",
                              background: "rgba(124, 58, 237, 0.08)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 750,
                              padding: "4px 9px",
                              fontSize: "0.78rem",
                            }}
                          >
                            <Scissors size={13} />
                            <span>Remove BG</span>
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            title="AI Studio Shoot (Convert image to studio master, change stage & cutout)"
                            onClick={() =>
                              navigate("/ai-studio", {
                                state: {
                                  image: displayImg,
                                  productId: p._id,
                                  productName: p.name,
                                  category: p.category,
                                  price: p.price,
                                  unit: p.unit,
                                  sku: p.sku,
                                  companyId: company?._id || companyId || null,
                                  returnTo: window.location.pathname,
                                },
                              })
                            }
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
                  {editingProductId
                    ? (categoryFamily === "garlic" ? "Edit Garlic Produce" :
                       categoryFamily === "sandstone" || categoryFamily === "kotastone" ? "Edit Stone Product" :
                       categoryFamily === "kotadoria" ? "Edit Kota Doria Handloom" : "Edit Product")
                    : (categoryFamily === "garlic" ? "🧄 Add Garlic Produce to Catalogue" :
                       categoryFamily === "sandstone" || categoryFamily === "kotastone" ? "🧱 Add Stone Product to Catalogue" :
                       categoryFamily === "kotadoria" ? "🥻 Add Kota Doria Handloom to Catalogue" : "Add Product to Catalogue")}
                </h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsProductModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* REGISTERED COMPANY ODOP CORRIDOR (Inherited from Company Profile - Never prompts repeatedly) */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)",
                  padding: "0.85rem 1.1rem",
                  borderRadius: "10px",
                  border: "1.5px solid rgba(99, 102, 241, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "var(--primary)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)",
                      flexShrink: 0
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                      Registered Company ODOP Category
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {categoryFamily === "garlic" ? "🧄 Garlic Specialty" :
                       categoryFamily === "sandstone" ? "🧱 Sand Stone Specialty" :
                       categoryFamily === "kotastone" ? "🏛️ Kota Stone Specialty" :
                       categoryFamily === "kotadoria" ? "🥻 Kota Doria Handloom" :
                       (productForm.category || "General Specialty")}
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.82rem", marginLeft: "6px" }}>
                        ({company?.name || "Registered Enterprise"})
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 750,
                      color: "#15803d",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    📍 Registered District: <strong>{company?.district || productForm.district || "Rajasthan"}</strong>
                  </span>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      padding: "4px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    ✓ Linked at Company Registration
                  </span>
                </div>
              </div>

              {/* COMPANY DATA BANK QUICK AUTO-FILL & MANAGER BAR */}
              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-medium)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "0.85rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "7px",
                      background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      flexShrink: 0
                    }}
                  >
                    <Database size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 750, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{company?.name || "Company"} Data Bank</span>
                      <span style={{ fontSize: "0.66rem", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.12)", color: "#16a34a" }}>
                        ✓ Connected
                      </span>
                    </div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                      Pre-filled specifications, thickness rates &amp; catalogue copy active
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {/* Autofill Title from Data Bank */}
                  {(company?.dataBank?.headings?.length > 0) && (
                    <select
                      className="input-field"
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.73rem",
                        fontWeight: 650,
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(99, 102, 241, 0.28)",
                        color: "var(--primary)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "auto",
                        maxWidth: "220px",
                        height: "30px"
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        setProductForm((prev) => ({ ...prev, name: val }));
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>⚡ Autofill Title from Data Bank...</option>
                      {(company?.dataBank?.headings || []).map((h, i) => (
                        <option key={i} value={h.text}>{h.text} ({h.category || "Headline"})</option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.73rem",
                      padding: "4px 10px",
                      fontWeight: 700,
                      height: "30px",
                      borderRadius: "6px"
                    }}
                    onClick={() => setIsDataBankModalOpen(true)}
                  >
                    <Sliders size={12} /> Open Data Bank
                  </button>
                </div>
              </div>

              {/* Data Bank Toast Notification */}
              {dataBankToast && (
                <div
                  style={{
                    padding: "0.45rem 0.85rem",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: "6px",
                    color: "#059669",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}
                >
                  <span>{dataBankToast}</span>
                  <button
                    type="button"
                    onClick={() => setDataBankToast(null)}
                    style={{ background: "none", border: "none", color: "#059669", cursor: "pointer", fontWeight: 800 }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Product Title */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)" }}>
                    {categoryFamily === "garlic"
                      ? "🧄 Garlic Variety / Produce Name *"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "🧱 Stone Product Title / Sizing Name *"
                      : categoryFamily === "kotadoria"
                      ? "🥻 Handloom Design Title / Motif Name *"
                      : "Product Title / Name *"}
                  </label>
                </div>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: "0.85rem" }}
                  placeholder={
                    categoryFamily === "garlic"
                      ? "e.g. Malwa Pure Desi White Garlic (Export Lot A+)"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "e.g. Kota Blue Limestone Semi-Honed Flooring Tiles / Dholpur Beige Sandstone Jali"
                      : categoryFamily === "kotadoria"
                      ? "e.g. Royal Gossamer Pure Silk Zari Buti Kota Doria Saree"
                      : "e.g. Premium Commercial Product Title"
                  }
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              {/* SKU & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    {categoryFamily === "garlic"
                      ? "Batch / Mandi SKU Code"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "Quarry Lot / Slab SKU Code"
                      : categoryFamily === "kotadoria"
                      ? "Loom Code / Design SKU"
                      : "SKU / Item Code"}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    placeholder={
                      categoryFamily === "garlic" ? "e.g. GRL-MLW-01" :
                      categoryFamily === "kotastone" ? "e.g. KST-BLU-600" :
                      categoryFamily === "sandstone" ? "e.g. SND-DHP-01" :
                      categoryFamily === "kotadoria" ? "e.g. KTD-ZAR-01" : "e.g. PROD-01"
                    }
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: "0.85rem", background: "var(--bg-surface-elevated)" }}
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    {categoryFamily === "garlic"
                      ? "Wholesale Price (₹) *"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "Quarry Rate (₹) *"
                      : categoryFamily === "kotadoria"
                      ? "Artisan Price (₹) *"
                      : "Selling Price (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    style={{ paddingLeft: "0.85rem" }}
                    value={productForm.price}
                    onChange={(e) => {
                      setProductForm({ ...productForm, price: Number(e.target.value) });
                      setPriceNotice(`Manual rate set: ₹${e.target.value}`);
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Pricing Unit (per)
                  </label>
                  <select
                    className="input-field"
                    style={{ paddingLeft: "0.6rem", fontWeight: 600, background: "var(--bg-surface)" }}
                    value={productForm.unit || ""}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  >
                    {categoryFamily === "garlic" ? (
                      <>
                        <option value="kg">kg (Garlic, Produce - Standard)</option>
                        <option value="g">g (Grams - Retail Packs)</option>
                        <option value="quintal">quintal (100 kg - Mandi Wholesale)</option>
                        <option value="tonne">tonne / MT (Bulk Export)</option>
                        <option value="mesh bag">mesh bag (10kg/25kg)</option>
                        <option value="box">box (Pack, Carton)</option>
                        <option value="">No Unit</option>
                      </>
                    ) : (categoryFamily === "sandstone" || categoryFamily === "kotastone") ? (
                      <>
                        <option value="sq.ft">sq.ft (Stone, Tiles, Flooring - Standard)</option>
                        <option value="sq.m">sq.m (Square Metre)</option>
                        <option value="piece">piece (Pre-cut Paver, Tile, Jali)</option>
                        <option value="slab">slab (Gangsaw Architectural Slab)</option>
                        <option value="tonne">tonne / MT (Bulk Quarry Stone)</option>
                        <option value="">No Unit</option>
                      </>
                    ) : categoryFamily === "kotadoria" ? (
                      <>
                        <option value="">No Unit (Clean Price like ₹3,200 — Recommended for Sarees)</option>
                        <option value="saree">saree (Per Saree)</option>
                        <option value="piece">piece (Individual Piece)</option>
                        <option value="metre">metre (Running Handloom Fabric)</option>
                        <option value="set">set (2-pc / 3-pc Suit Ensemble)</option>
                        <option value="dupatta">dupatta (Per Dupatta)</option>
                      </>
                    ) : (
                      <>
                        <option value="">No Unit (Clothes, Saree, Items)</option>
                        <option value="piece">piece (Individual Unit)</option>
                        <option value="sq.ft">sq.ft (Stone, Tiles, Granite)</option>
                        <option value="sq.m">sq.m (Square Metre)</option>
                        <option value="kg">kg (Garlic, Spices, Agro)</option>
                        <option value="g">g (Gram)</option>
                        <option value="tonne">tonne / MT</option>
                        <option value="metre">metre (Textiles, Fabric)</option>
                        <option value="litre">litre (Liquids)</option>
                        <option value="set">set (Ensemble, Suite)</option>
                        <option value="box">box (Pack, Carton)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
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
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    {categoryFamily === "garlic"
                      ? "Harvest Stock (kg/qntl)"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "Quarry Stock (sq.ft)"
                      : categoryFamily === "kotadoria"
                      ? "Available Loom Pieces"
                      : "Stock Units"}
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

              {/* Live Price Tag Preview */}
              <div style={{ marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Display in catalogue:</span>
                <span style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #a7f3d0",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}>
                  ₹{(productForm.price || 0).toLocaleString()}{productForm.unit ? ` / ${productForm.unit}` : ""}
                </span>
                <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.74rem" }}>
                  {productForm.unit ? `(Priced per ${productForm.unit})` : "(No unit suffix — perfect for clothes, sarees, electronics & standalone products)"}
                </span>
              </div>

              {/* Dynamic Thickness / Preset Price Change Notice */}
              {priceNotice && (
                <div style={{
                  marginTop: "0.35rem",
                  padding: "0.4rem 0.85rem",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)",
                  border: "1.5px solid rgba(16, 185, 129, 0.35)",
                  borderRadius: "7px",
                  color: "#065f46",
                  fontSize: "0.77rem",
                  fontWeight: 650,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(16, 185, 129, 0.12)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "1rem" }}>⚡</span>
                    <span>{priceNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPriceNotice("")}
                    style={{ background: "transparent", border: "none", color: "#065f46", cursor: "pointer", fontSize: "0.85rem", padding: "0 4px", fontWeight: 700 }}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Product Image: Upload from Computer or URL */}
              {/* Product Image Section with AI Upscale Dialog & AI Studio Integration */}
              <div className="card" style={{ background: "var(--bg-input)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Product Image (Auto-Upscaler 2x/4x &amp; AI Studio Enabled)
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {productForm.image && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ display: "inline-flex", gap: "5px", alignItems: "center", padding: "3px 9px", fontSize: "0.75rem", color: "#2563eb", borderColor: "#2563eb", background: "rgba(37, 99, 235, 0.08)", fontWeight: 700 }}
                        onClick={() =>
                          openImagePreview(productForm.image, productForm.name || "Product Image", {
                            sku: productForm.sku,
                            category: productForm.category,
                            price: productForm.price,
                            unit: productForm.unit,
                          }, upscaleStats)
                        }
                        title="Preview uploaded & upscaled image in high definition"
                      >
                        <Eye size={13} /> Preview Image
                      </button>
                    )}
                    {productForm.image && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ display: "inline-flex", gap: "5px", alignItems: "center", padding: "3px 8px", fontSize: "0.75rem", color: "#10b981", borderColor: "#10b981" }}
                        onClick={() => {
                          setPendingUploadImage(productForm.image);
                          setIsUpscaleModalOpen(true);
                        }}
                        title="Upscale to 2x or 4x high-resolution"
                      >
                        <Zap size={12} /> Upscale 2x/4x
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ display: "inline-flex", gap: "5px", alignItems: "center", padding: "3px 10px", fontSize: "0.75rem", color: "#8b5cf6", borderColor: "#8b5cf6" }}
                      onClick={() => {
                        navigate("/ai-studio", {
                          state: {
                            image: productForm.image,
                            productId: editingProductId || null,
                            productName: productForm.name || "Product",
                            companyId: companyId || null,
                            returnTo: window.location.pathname,
                          },
                        });
                      }}
                      title="Open AI Studio to edit lighting, remove background, or add luxury stages"
                    >
                      <Palette size={13} /> Edit in AI Studio
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", gap: "6px", fontWeight: 700 }}>
                    <Upload size={14} /> Upload &amp; Upscale
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
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        openImagePreview(productForm.image, productForm.name || "Product Image", {
                          sku: productForm.sku,
                          category: productForm.category,
                          price: productForm.price,
                          unit: productForm.unit,
                        }, upscaleStats)
                      }
                      title="Click to preview uploaded & upscaled image"
                      style={{
                        position: "relative",
                        flexShrink: 0,
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid #2563eb",
                        boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                        display: "block",
                      }}
                    >
                      <img
                        src={
                          productForm.image && (productForm.image.startsWith("assets/") || productForm.image.startsWith("uploads/"))
                            ? `/${productForm.image}`
                            : productForm.image
                        }
                        alt="Product Preview"
                        style={{ width: "52px", height: "52px", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            categoryFamily === "garlic"
                              ? "/assets/garlic/garlic-01.jpeg"
                              : categoryFamily === "kotastone"
                              ? "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg"
                              : categoryFamily === "sandstone"
                              ? "/assets/sand-stone/Dholpur-Beige-Sandstone.jpg"
                              : "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(15, 23, 42, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.15s ease",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
                      >
                        <Eye size={16} />
                      </div>
                      {upscaleStats && (
                        <span
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "#10b981",
                            color: "#fff",
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            padding: "1px 4px",
                            borderRadius: "3px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            pointerEvents: "none",
                          }}
                        >
                          {upscaleStats.scale || "HD"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {upscaleStats && (
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "#166534", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                    <span>✓ Image optimized: {upscaleStats.from} ➔ {upscaleStats.to} ({upscaleStats.scale} Super-Resolution applied)</span>
                    <button
                      type="button"
                      onClick={() =>
                        openImagePreview(productForm.image, productForm.name || "Product Image", {
                          sku: productForm.sku,
                          category: productForm.category,
                          price: productForm.price,
                          unit: productForm.unit,
                        }, upscaleStats)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontWeight: 700,
                        textDecoration: "underline",
                        padding: 0,
                        fontSize: "0.74rem",
                      }}
                    >
                      View HD Preview ➔
                    </button>
                  </div>
                )}
              </div>

              
              {/* CATEGORY-SPECIFIC MANDATORY SPECIFICATION POINTS */}
              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "1.1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-medium)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ fontSize: "0.86rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    {categoryFamily === "garlic"
                      ? "Garlic Agro Specifications & Grading Standards"
                      : (categoryFamily === "sandstone" || categoryFamily === "kotastone")
                      ? "Stone Architectural Specifications & Calibration (Thickness & Surface)"
                      : categoryFamily === "kotadoria"
                      ? "Kota Doria Artisan Handloom Specifications (Length & Weight)"
                      : "Four Mandatory Product Specification Points"}
                  </label>
                  <span style={{ fontSize: "0.72rem", color: "#15803d", background: "rgba(22, 163, 74, 0.08)", border: "1px solid rgba(22, 163, 74, 0.2)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                    ✓ Auto-Formatted for Catalogue
                  </span>
                </div>

                {/* Conditional Fields: GARLIC */}
                {categoryFamily === "garlic" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Bulb Caliber / Sizing Diameter *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🧄</span>}
                          placeholder="e.g. 50 - 65 mm (Grade A+ Large)"
                          value={productForm.size || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, size: val }))}
                          presets={effectivePresets.thickness}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("thicknesses", val, { price: productForm.price, mrp: productForm.mrp })}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setProductForm((prev) => ({
                                ...prev,
                                size: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.35),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Price auto-adjusted to ₹${preset.price}/kg based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select grade to auto-calculate price, or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Moisture Content & Quality Standard *"
                          icon={<span style={{ fontSize: "0.9rem" }}>💧</span>}
                          placeholder="e.g. Moisture < 65%, Sun-Cured Clean White"
                          value={productForm.material || productForm.materialComposition || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, material: val, materialComposition: val }))}
                          presets={effectivePresets.materials?.length ? effectivePresets.materials : [
                            { value: "Moisture < 65%, Sun-Cured Clean White (Export Ready)", chipLabel: "<65% Export", label: "Moisture < 65%, Sun-Cured Clean White (Export Ready)" },
                            { value: "Moisture < 70%, Well-Dried Organically Grown", chipLabel: "<70% Organic", label: "Moisture < 70%, Well-Dried Organically Grown" },
                            { value: "Standard Mandi Sun-Cured, High Allicin", chipLabel: "Standard Mandi", label: "Standard Mandi Sun-Cured, High Allicin" },
                          ]}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("materials", val)}
                          customHelpText="💡 Pick quality standard or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Curing & Skin Finish *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Sun-Cured Export Clean White Skin"
                          value={productForm.finish || productForm.color || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, finish: val, color: val }))}
                          presets={effectivePresets.finishes}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("finishes", val)}
                          customHelpText="💡 Pick curing finish or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Variety, Packaging & Commercial Use *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Malwa Desi in 25kg Aerated Red Mesh Bags"
                          value={productForm.application || productForm.useApplication || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, application: val, useApplication: val }))}
                          presets={effectivePresets.applications}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("applications", val)}
                          customHelpText="💡 Pick packaging or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: SANDSTONE / KOTA STONE */}
                {(categoryFamily === "sandstone" || categoryFamily === "kotastone") && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Plan Dimensions / Tile Size (L × W) *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📐</span>}
                          placeholder="e.g. 2×2 ft (600×600 mm) / Custom Size"
                          value={productForm.size || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, size: val }))}
                          presets={effectivePresets.sizes}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("sizes", val)}
                          customHelpText="💡 Pick standard tile dimensions or type custom size."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Stone Thickness & Gauging Calibration *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. 20 - 25 mm Gauged / Custom Thickness"
                          value={productForm.thickness || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, thickness: val }))}
                          presets={effectivePresets.thickness}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("thicknesses", val, { price: productForm.price, mrp: productForm.mrp, priceRange: productForm.priceRange })}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setProductForm((prev) => ({
                                ...prev,
                                thickness: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.4),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Rate auto-adjusted to ₹${preset.price}/sq.ft based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select thickness to auto-update rate, or type custom thickness."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Surface Finish & Edge Treatment *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Mirror Polish / Honed Satin / Hand-Chiseled"
                          value={productForm.finish || productForm.color || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, finish: val, color: val }))}
                          presets={effectivePresets.finishes}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("finishes", val)}
                          customHelpText="💡 Pick texture finish or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Rock Material & Commercial Application *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Natural Limestone / Heavy Traffic Flooring"
                          value={productForm.material || productForm.materialComposition || productForm.application || ""}
                          onChange={(val) => setProductForm((prev) => ({
                            ...prev,
                            material: val,
                            materialComposition: val,
                            application: val,
                            useApplication: val,
                          }))}
                          presets={effectivePresets.applications?.length ? effectivePresets.applications : effectivePresets.materials}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("applications", val)}
                          customHelpText="💡 Pick stone application or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: KOTA DORIA */}
                {categoryFamily === "kotadoria" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Fabric Length & Cut Dimensions *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. 6.5 Metres with 80cm Running Blouse"
                          value={productForm.size || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, size: val }))}
                          presets={effectivePresets.thickness}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("thicknesses", val, { price: productForm.price, mrp: productForm.mrp })}
                          onSelectPreset={(preset) => {
                            if (preset.price !== undefined) {
                              setProductForm((prev) => ({
                                ...prev,
                                size: preset.value,
                                price: preset.price,
                                mrp: preset.mrp || Math.round(preset.price * 1.5),
                                priceRange: preset.priceRange || prev.priceRange,
                              }));
                              setPriceNotice(`Price auto-adjusted to ₹${preset.price} based on ${preset.chipLabel || preset.value}`);
                            }
                          }}
                          customHelpText="⚡ Select cut length to auto-set price, or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Fabric Weight & Yarn Count *"
                          icon={<span style={{ fontSize: "0.9rem" }}>⚖️</span>}
                          placeholder="e.g. Lightweight 280-320 grams / 80s × 100s Count"
                          value={productForm.fabricWeight || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, fabricWeight: val }))}
                          presets={[
                            { value: "Lightweight 280-320 grams (80s Cotton × 100s Silk)", chipLabel: "280-320g Silk/Cotton", label: "Lightweight 280-320 grams (80s Cotton × 100s Silk)" },
                            { value: "Featherlight 240-270 grams (Pure Silk Warp & Weft)", chipLabel: "240-270g Pure Silk", label: "Featherlight 240-270 grams (Pure Silk Warp & Weft)" },
                            { value: "Medium 350-380 grams (Pure Cotton Handloom)", chipLabel: "350-380g Pure Cotton", label: "Medium 350-380 grams (Pure Cotton Handloom)" },
                          ]}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("materials", val)}
                          customHelpText="💡 Pick yarn count weight or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="3. Weave Grid (Khat) & Zari Border *"
                          icon={<span style={{ fontSize: "0.9rem" }}>✨</span>}
                          placeholder="e.g. Traditional Square Khat Grid with Tested Gold Zari"
                          value={productForm.finish || productForm.color || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, finish: val, color: val }))}
                          presets={effectivePresets.finishes}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("finishes", val)}
                          customHelpText="💡 Pick weave motif or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="4. Fiber Composition, Occasion & Care *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🎯</span>}
                          placeholder="e.g. Pure Mulberry Silk & Cotton / Dry Clean Only"
                          value={productForm.material || productForm.materialComposition || productForm.application || ""}
                          onChange={(val) => setProductForm((prev) => ({
                            ...prev,
                            material: val,
                            materialComposition: val,
                            application: val,
                            useApplication: val,
                          }))}
                          presets={effectivePresets.applications}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("applications", val)}
                          customHelpText="💡 Pick composition & care or type custom."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: GENERAL FALLBACK */}
                {categoryFamily !== "garlic" && categoryFamily !== "sandstone" && categoryFamily !== "kotastone" && categoryFamily !== "kotadoria" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                      <div>
                        <SmartPresetInput
                          label="1. Size / Specification *"
                          icon={<span style={{ fontSize: "0.9rem" }}>📏</span>}
                          placeholder="e.g. Dimensions, Capacity, Size"
                          value={productForm.size || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, size: val }))}
                          presets={effectivePresets.sizes?.length ? effectivePresets.sizes : [
                            { value: "Standard Regular Size", chipLabel: "Standard", label: "Standard Regular Size" },
                            { value: "Large Format / Heavy Duty", chipLabel: "Large", label: "Large Format / Heavy Duty" },
                            { value: "Compact / Portable Size", chipLabel: "Compact", label: "Compact / Portable Size" },
                          ]}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("sizes", val)}
                          customHelpText="💡 Pick standard size or type custom."
                        />
                      </div>
                      <div>
                        <SmartPresetInput
                          label="2. Material Composition *"
                          icon={<span style={{ fontSize: "0.9rem" }}>🧵</span>}
                          placeholder="e.g. Material, Fabric, Metal"
                          value={productForm.material || productForm.materialComposition || ""}
                          onChange={(val) => setProductForm((prev) => ({ ...prev, material: val, materialComposition: val }))}
                          presets={effectivePresets.materials?.length ? effectivePresets.materials : [
                            { value: "High Grade Natural Composition", chipLabel: "Natural", label: "High Grade Natural Composition" },
                            { value: "Premium Certified Organic Component", chipLabel: "Organic", label: "Premium Certified Organic Component" },
                          ]}
                          onSaveToDataBank={(val) => handleSaveSpecToDataBank("materials", val)}
                          customHelpText="💡 Pick material or type custom."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                          ✨ 3. Surface Finish / Color *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          style={{ paddingLeft: "0.85rem" }}
                          placeholder="e.g. Matte, Polished, Color"
                          value={productForm.finish || productForm.color || ""}
                          onChange={(e) => setProductForm({ ...productForm, finish: e.target.value, color: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                          🎯 4. Use / Application *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          style={{ paddingLeft: "0.85rem" }}
                          placeholder="e.g. Commercial, Residential, Apparel"
                          value={productForm.application || productForm.useApplication || ""}
                          onChange={(e) => setProductForm({ ...productForm, application: e.target.value, useApplication: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Price Range */}
                <div>
                  <SmartPresetInput
                    label="Price Range (₹)"
                    icon={<span style={{ fontSize: "0.9rem" }}>💰</span>}
                    placeholder="e.g. ₹55 – ₹95 / sq.ft"
                    value={productForm.priceRange || ""}
                    onChange={(val) => setProductForm((prev) => ({ ...prev, priceRange: val }))}
                    presets={effectivePresets.priceRanges}
                    onSaveToDataBank={(val) => handleSaveSpecToDataBank("priceRanges", val)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  {categoryFamily === "garlic"
                    ? "🧄 Produce & Harvest Description"
                    : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                    ? "🧱 Stone Architectural & Geological Description"
                    : categoryFamily === "kotadoria"
                    ? "🥻 Handloom Heritage & Craft Description"
                    : "Product Description"}
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  style={{ paddingLeft: "0.85rem", resize: "vertical" }}
                  placeholder={
                    categoryFamily === "garlic"
                      ? "Comprehensive description of garlic harvest lot, soil cultivation, curing method, and storage shelf-life."
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "Detailed description of stone geology, compressive strength, quarry provenance, and architectural applications."
                      : categoryFamily === "kotadoria"
                      ? "Description of pit-loom weave, silk/cotton yarn count, zari motifs, and Kaithun artisan heritage."
                      : "Comprehensive description of product features, usage, and quality."
                  }
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              {/* General Fallback Dimensions & Weight - Only visible if not a specialized ODOP category */}
              {categoryFamily === "general" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Color / Finish
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.85rem" }}
                        placeholder="e.g. Natural"
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
                        placeholder="e.g. Standard Material"
                        value={productForm.materialComposition}
                        onChange={(e) => setProductForm({ ...productForm, materialComposition: e.target.value })}
                      />
                    </div>
                  </div>

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
                          placeholder="e.g. 500"
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
                </>
              )}

              {/* Key Feature Bullets */}
              <div className="card" style={{ background: "var(--bg-input)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    {categoryFamily === "garlic"
                      ? "🧄 Harvest Quality & Storage Highlights"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "🧱 Architectural Performance Highlights"
                      : categoryFamily === "kotadoria"
                      ? "🥻 Master Weaver Craftsmanship Highlights"
                      : "Key Feature Highlights (Bullets)"}
                  </label>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddBullet}>
                    <Plus size={13} /> Add Highlight
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(productForm.keyFeatures || []).map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1 }}
                        placeholder="Highlight point..."
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
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    {categoryFamily === "garlic"
                      ? "🧄 Agro & Mandi Testing Parameters"
                      : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                      ? "🧱 Geological & Physical Test Parameters"
                      : categoryFamily === "kotadoria"
                      ? "🥻 Handloom & Textile Specifications"
                      : "Technical Specifications"}
                  </label>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddSpecRow}>
                    <Plus size={13} /> Add Parameter
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {productForm.technicalSpecifications.map((s, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: "0.75rem", flex: 1 }}
                        placeholder={
                          categoryFamily === "garlic"
                            ? "Parameter (e.g. Moisture Content)"
                            : categoryFamily === "sandstone" || categoryFamily === "kotastone"
                            ? "Parameter (e.g. Water Absorption)"
                            : categoryFamily === "kotadoria"
                            ? "Parameter (e.g. Yarn Count)"
                            : "Parameter"
                        }
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
                        placeholder="Value (e.g. Specification benchmark)"
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
      {/* AI Smart Image Upscale & Enhancement Dialog */}
      <ImageUpscaleModal
        isOpen={isUpscaleModalOpen}
        onClose={() => setIsUpscaleModalOpen(false)}
        imageSrc={pendingUploadImage}
        productData={{
          productId: upscaleTargetProductId || imagePreviewModal.meta?.id || editingProductId || null,
          name: (upscaleTargetProductId ? products.find((x) => x._id === upscaleTargetProductId)?.name : null) || imagePreviewModal.title || productForm.name || "Product",
          companyId: companyId,
        }}
        onApply={handleApplyUpscaledImage}
      />

      <RemoveBgModal
        isOpen={removeBgModal.isOpen}
        onClose={() => setRemoveBgModal({ isOpen: false, productId: null, imageSrc: null })}
        imageSrc={removeBgModal.imageSrc}
        onApply={handleApplyRemoveBgImage}
      />

      {/* Full-Resolution Product Image Preview Modal */}
      <ProductImagePreviewModal
        isOpen={imagePreviewModal.isOpen}
        onClose={() => setImagePreviewModal((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={imagePreviewModal.url}
        productName={imagePreviewModal.title}
        productMeta={imagePreviewModal.meta}
        upscaleStats={imagePreviewModal.stats}
        onOpenUpscale={(imgUrl) => {
          setPendingUploadImage(imgUrl);
          const targetId = imagePreviewModal.meta?.id || editingProductId || null;
          setUpscaleTargetProductId(targetId);
          setIsUpscaleModalOpen(true);
        }}
        onOpenAiStudio={(imgUrl) => {
          navigate("/ai-studio", {
            state: {
              image: imgUrl,
              productId: imagePreviewModal.meta?.id || editingProductId || null,
              productName: imagePreviewModal.title || productForm.name || "Product",
              category: imagePreviewModal.meta?.category || productForm.category || "",
              price: imagePreviewModal.meta?.price || productForm.price || "",
              unit: imagePreviewModal.meta?.unit || productForm.unit || "",
              sku: imagePreviewModal.meta?.sku || productForm.sku || "",
              companyId: company?._id || companyId || null,
              returnTo: window.location.pathname,
            },
          });
        }}
      />

      {/* Company Data Bank Modal */}
      {company && (
        <CompanyDataBankModal
          isOpen={isDataBankModalOpen}
          onClose={() => {
            setIsDataBankModalOpen(false);
            setInitialDataBankTab("specs");
          }}
          company={company}
          initialTab={initialDataBankTab}
          onOpenProductSheetUpload={() => setIsProductSheetModalOpen(true)}
          onSave={(updatedDataBank) => {
            setCompany((prev) => ({ ...prev, dataBank: updatedDataBank }));
          }}
        />
      )}

      {/* Product Batch Spreadsheet Upload Modal */}
      <ProductSheetUploadModal
        isOpen={isProductSheetModalOpen}
        onClose={() => setIsProductSheetModalOpen(false)}
        company={company}
        categoryFamily={categoryFamily}
        onProductsImported={(newProducts) => {
          setProducts((prev) => [...prev, ...newProducts]);
          setDataBankToast(`✓ Successfully imported ${newProducts.length} products from sheet!`);
          setTimeout(() => setDataBankToast(null), 5000);
        }}
      />
    </div>
  );
}
