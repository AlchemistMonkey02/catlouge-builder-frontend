import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Edit3,
  CheckCircle,
  Palette,
  Sparkles,
  RefreshCw,
  QrCode,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Building2,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Save,
  FolderOpen,
  Trash2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Info,
  X,
  Database,
  Type,
  Image as ImageIcon,
  Upload,
  Link,
  Plus,
  PlusCircle,
  Copy
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TEMPLATE_REGISTRY,
  byUid,
  buildCatalogue,
  exportDynamicPdf
} from "./engine";
import {
  setMode,
  isEditing,
  onRendered,
  isPhoto,
  isText,
  applyEdit,
  keyFor,
  select,
  startText
} from "./editor";
import { getCopy } from "./content";
import {
  fetchCatalogueRecords,
  createCatalogueRecord,
  updateCatalogueRecord,
  deleteCatalogueRecord
} from "../../services/api";
import {
  KOTA_STONE_ASSETS,
  KOTA_DORIA_ASSETS,
  SAND_STONE_ASSETS,
  GARLIC_ASSETS,
  ALL_SPECIALTY_ASSETS
} from "./assetsCatalog";
import "./dynamic-catalogue.css";

const PRESET_SWATCHES = [
  { label: "Original", color: null },
  { label: "Royal Navy", color: "#1e3a8a" },
  { label: "Emerald Luxury", color: "#065f46" },
  { label: "Imperial Burgundy", color: "#831843" },
  { label: "Terracotta Rust", color: "#c2410c" },
  { label: "Warm Brass & Gold", color: "#b45309" },
  { label: "Deep Obsidian", color: "#1e293b" },
  { label: "Forest Olive", color: "#365314" }
];

const SPECIALTY_DEMO_PRODUCTS = {
  garlic: [
    {
      _id: "demo_g1",
      name: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
      title: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
      category: "Garlic Specialty",
      sku: "GRL-01-EXP",
      price: 180,
      mrp: 240,
      image: "/assets/garlic/garlic-01.jpeg",
      angle1: "/assets/garlic/garlic-01.jpeg",
      angle2: "/assets/garlic/garlic-02.jpeg",
      angle3: "/assets/garlic/garlic-03.jpeg",
      images: [
        { url: "/assets/garlic/garlic-01.jpeg", alt: "Angle 1 (Hero - Large Farm Harvest Bulbs)", isPrimary: true },
        { url: "/assets/garlic/garlic-02.jpeg", alt: "Angle 2 (Bulb Caliber & Root Clean Finish)" },
        { url: "/assets/garlic/garlic-03.jpeg", alt: "Angle 3 (Clean White Sun-Cured Skin)" },
        { url: "/assets/garlic/garlic-04.jpeg", alt: "Angle 4 (Harvest Mesh Bag Packing Sizing)" }
      ],
      description: "Sun-cured large caliber garlic bulbs from Malwa soil with papery white skins and rich aromatic allicin.",
      specifications: { "Bulb Caliber": "50-65 mm", "Moisture": "64% Max", "Packing": "10/20kg Mesh Bags", "Certification": "Global GAP" }
    },
    {
      _id: "demo_g2",
      name: "Fresh Peeled Whole Garlic Cloves",
      title: "Fresh Peeled Whole Garlic Cloves",
      category: "Garlic Specialty",
      sku: "GRL-02-PEEL",
      price: 260,
      mrp: 320,
      image: "/assets/garlic/garlic-05.jpeg",
      angle1: "/assets/garlic/garlic-05.jpeg",
      angle2: "/assets/garlic/garlic-06.jpeg",
      angle3: "/assets/garlic/garlic-07.jpeg",
      images: [
        { url: "/assets/garlic/garlic-05.jpeg", alt: "Angle 1 (Fresh Cloves & Bulb Inspection)" },
        { url: "/assets/garlic/garlic-06.jpeg", alt: "Angle 2 (High Allicin Pungent Bulbs)" },
        { url: "/assets/garlic/garlic-07.jpeg", alt: "Angle 3 (Export Sorting Table)" }
      ],
      description: "Air-peeled nitrogen-flushed whole garlic cloves, 100% kitchen yield ready with zero peeling prep.",
      specifications: { "Purity": "100% Peeled Cloves", "Shelf Life": "45 Days Refrigerated", "Packaging": "1kg Vacuum Pouches" }
    },
    {
      _id: "demo_g3",
      name: "Bulk Harvest Agro-Grade Garlic Sacks",
      title: "Bulk Harvest Agro-Grade Garlic Sacks",
      category: "Garlic Specialty",
      sku: "GRL-03-FLK",
      price: 340,
      mrp: 420,
      image: "/assets/garlic/garlic-08.jpeg",
      angle1: "/assets/garlic/garlic-08.jpeg",
      angle2: "/assets/garlic/garlic-09.jpeg",
      angle3: "/assets/garlic/garlic-10.jpeg",
      images: [
        { url: "/assets/garlic/garlic-08.jpeg", alt: "Angle 1 (Bulk Harvest Crate Stacking)" },
        { url: "/assets/garlic/garlic-09.jpeg", alt: "Angle 2 (Clean Dry Storage Bulbs)" },
        { url: "/assets/garlic/garlic-10.jpeg", alt: "Angle 3 (Grading Caliber 50mm+)" }
      ],
      description: "Field-fresh sun-cured garlic in ventilated export mesh bags, calibrated for wholesale mandis and supermarket cold chains.",
      specifications: { "Moisture": "< 64.0%", "Bulb Caliber": "45-60 mm", "Packaging": "20kg Ventilated Mesh Sacks" }
    },
    {
      _id: "demo_g4",
      name: "Premium Handpicked White Garlic Bulbs",
      title: "Premium Handpicked White Garlic Bulbs",
      category: "Garlic Specialty",
      sku: "GRL-04-BLK",
      price: 950,
      mrp: 1250,
      image: "/assets/garlic/garlic-11.jpeg",
      angle1: "/assets/garlic/garlic-11.jpeg",
      angle2: "/assets/garlic/garlic-12.jpeg",
      angle3: "/assets/garlic/garlic-13.jpeg",
      images: [
        { url: "/assets/garlic/garlic-11.jpeg", alt: "Angle 1 (Field Fresh Garlic Bulbs)" },
        { url: "/assets/garlic/garlic-12.jpeg", alt: "Angle 2 (Naturally Dried Stems)" },
        { url: "/assets/garlic/garlic-13.jpeg", alt: "Angle 3 (Premium Clean Cloves Sizing)" }
      ],
      description: "Artisanal handpicked farm garlic featuring dense clove count, pristine tight skins, and superior medicinal allicin potency.",
      specifications: { "Sorting": "100% Handpicked", "Allicin Content": "High Potency Standard", "Storage": "Ambient Ventilated 90 Days" }
    }
  ],
  kotastone: [
    {
      _id: "demo_k1",
      name: "Kota Stone Natural Blue Calibrated Tiles",
      title: "Kota Stone Natural Blue Calibrated Tiles",
      category: "Kota Stone Specialty",
      sku: "KTA-01-BLU",
      price: 85,
      mrp: 120,
      image: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
      angle1: "/assets/kota-stone/Blue-Kota-Stone-Tiles-3.jpg",
      angle2: "/assets/kota-stone/Blue-Kota-Stone-Tiles-4.jpg",
      angle3: "/assets/kota-stone/Blue-Kota-Stone-Tiles-5.jpg",
      images: [
        { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg", alt: "Angle 1 (Hero - Blue Kota Slabs)", isPrimary: true },
        { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-3.jpg", alt: "Angle 2 (Close-up Texture & Grain)" },
        { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-4.jpg", alt: "Angle 3 (Cut Tile Stacks)" },
        { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-5.jpg", alt: "Angle 4 (Finished Surface Quality)" }
      ],
      description: "Fine-grained architectural blue-green limestone with natural non-slip surface, calibrated 18-20mm thickness, and high compressive load tolerance.",
      specifications: { "Thickness": "18-20 mm Calibrated", "Compressive Strength": "135-140 MPa", "Water Absorption": "< 0.38%", "Origin": "Kota Quarries, Rajasthan" }
    },
    {
      _id: "demo_k2",
      name: "Mirror High-Polish Kota Stone Flooring Slabs",
      title: "Mirror High-Polish Kota Stone Flooring Slabs",
      category: "Kota Stone Specialty",
      sku: "KTA-02-MIR",
      price: 110,
      mrp: 155,
      image: "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg",
      angle1: "/assets/kota-stone/blue-kota-stone-1.jpg",
      angle2: "/assets/kota-stone/blue-kota-stone-2.jpg",
      angle3: "/assets/kota-stone/blue-kota-stone-3.jpg",
      images: [
        { url: "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg", alt: "Angle 1 (High Polish Surface Reflection)" },
        { url: "/assets/kota-stone/blue-kota-stone-1.jpg", alt: "Angle 2 (Natural Deep Cyan Tone)" },
        { url: "/assets/kota-stone/blue-kota-stone-2.jpg", alt: "Angle 3 (Polished Edge & Bevel Detail)" },
        { url: "/assets/kota-stone/blue-kota-stone-3.jpg", alt: "Angle 4 (Architectural Slab View)" }
      ],
      description: "Glass-like high sheen surface reflection bringing out rich blue-green natural mineral saturation for premium interiors and luxury lobbies.",
      specifications: { "Finish": "12-Head Mirror Polish", "Sizes": "600x600, 600x900 mm", "Edge": "Precision Sawn & Beveled Chamfer" }
    },
    {
      _id: "demo_k3",
      name: "Designer Architectural Kota Stone Tiles",
      title: "Designer Architectural Kota Stone Tiles",
      category: "Kota Stone Specialty",
      sku: "KTA-03-DSG",
      price: 95,
      mrp: 140,
      image: "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg",
      angle1: "/assets/kota-stone/Designer-Kota-Stone-Tiles-2.jpg",
      angle2: "/assets/kota-stone/Designer-Kota-Stone-Tiles-3.jpg",
      angle3: "/assets/kota-stone/Designer-kota-stone-5.jpg",
      images: [
        { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg", alt: "Angle 1 (Designer Geometric Layout)" },
        { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles-2.jpg", alt: "Angle 2 (Multi-Tone Pattern)" },
        { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles-3.jpg", alt: "Angle 3 (Surface Relief & Texture)" },
        { url: "/assets/kota-stone/Designer-kota-stone-5.jpg", alt: "Angle 4 (Interior Courtyard Floor)" }
      ],
      description: "Custom geometric paving tiles and ornamental floor accents engineered for luxury villas, hospitality resorts, and grand verandas.",
      specifications: { "Finish": "Honed Satin / Leather", "Applications": "Interior & Semi-Covered Patios", "Density": "2.68 g/cm³" }
    },
    {
      _id: "demo_k4",
      name: "Natural Yellow Kota Limestone Tiles",
      title: "Natural Yellow Kota Limestone Tiles",
      category: "Kota Stone Specialty",
      sku: "KTA-04-YEL",
      price: 90,
      mrp: 135,
      image: "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg",
      angle1: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-1.jpg",
      angle2: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-2.jpg",
      angle3: "/assets/kota-stone/yellow-brown-kota-stone-3-1.jpg",
      images: [
        { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg", alt: "Angle 1 (Warm Ochre Yellow Tiles)" },
        { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-1.jpg", alt: "Angle 2 (Layered Sand Veins)" },
        { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-2.jpg", alt: "Angle 3 (Calibrated Stacks)" },
        { url: "/assets/kota-stone/yellow-brown-kota-stone-3-1.jpg", alt: "Angle 4 (Yellow-Brown Warmth)" }
      ],
      description: "Naturally layered warm earth-tone limestone tiles displaying golden undertones, naturally cool to the touch and thermal-resistant.",
      specifications: { "Tone": "Desert Gold & Warm Ochre", "Thickness": "18 - 20 mm", "Thermal Conductivity": "Naturally Cool" }
    },
    {
      _id: "demo_k5",
      name: "Calibrated Kota Stone Flooring Slabs",
      title: "Calibrated Kota Stone Flooring Slabs",
      category: "Kota Stone Specialty",
      sku: "KTA-05-FLR",
      price: 78,
      mrp: 110,
      image: "/assets/kota-stone/Kota-Stone-Flooring-Tiles.jpg",
      angle1: "/assets/kota-stone/Kota-Stone-Flooring-3-1.jpg",
      angle2: "/assets/kota-stone/Kota-Stone-Flooring-5.jpg",
      angle3: "/assets/kota-stone/kota-stone-flooring-2-1.jpg",
      images: [
        { url: "/assets/kota-stone/Kota-Stone-Flooring-Tiles.jpg", alt: "Angle 1 (Uniform Calibrated Slabs)" },
        { url: "/assets/kota-stone/Kota-Stone-Flooring-3-1.jpg", alt: "Angle 2 (Clean Edge Sawn Finish)" },
        { url: "/assets/kota-stone/Kota-Stone-Flooring-5.jpg", alt: "Angle 3 (Large Format Floor Layout)" },
        { url: "/assets/kota-stone/kota-stone-flooring-2-1.jpg", alt: "Angle 4 (Quarry Direct Slabs)" }
      ],
      description: "Precision-calibrated commercial stone slabs, box-packed with protective spacers for zero-breakage transport and rapid installation.",
      specifications: { "Calibration": "Machine Gauged 20mm ±1mm", "Slip Rating": "R11 Anti-Skid", "Standard": "IS 1130 Certified" }
    },
    {
      _id: "demo_k6",
      name: "Heavy-Duty Chequered Parking & Driveway Tiles",
      title: "Heavy-Duty Chequered Parking & Driveway Tiles",
      category: "Kota Stone Specialty",
      sku: "KTA-06-PRK",
      price: 68,
      mrp: 95,
      image: "/assets/kota-stone/Parking-Tiles-2.jpg",
      angle1: "/assets/kota-stone/Parking-Tiles-3.jpg",
      angle2: "/assets/kota-stone/kota-stone-flooring-4.jpg",
      angle3: "/assets/kota-stone/blue-kota-stone-8.jpg",
      images: [
        { url: "/assets/kota-stone/Parking-Tiles-2.jpg", alt: "Angle 1 (Heavy Vehicle Anti-Skid Pattern)" },
        { url: "/assets/kota-stone/Parking-Tiles-3.jpg", alt: "Angle 2 (Ramp & Driveway Paver)" },
        { url: "/assets/kota-stone/kota-stone-flooring-4.jpg", alt: "Angle 3 (Rugged Split Base)" },
        { url: "/assets/kota-stone/blue-kota-stone-8.jpg", alt: "Angle 4 (Quarry Dressed Stone)" }
      ],
      description: "High-traction chequered limestone pavers designed to support heavy vehicular traffic, steep basement ramps, and rainy pedestrian corridors.",
      specifications: { "Load Capacity": "40 Tonnes / Truck Safe", "Pattern": "Diamond & Chequered Grip", "Weather Resistance": "100% Frost & Water Safe" }
    }
  ],
  sandstone: [
    {
      _id: "demo_s1",
      name: "Royal Agra Red Sandstone Sandblasted Slabs",
      title: "Royal Agra Red Sandstone Sandblasted Slabs",
      category: "Sand Stone Specialty",
      sku: "SND-01-AGR",
      price: 135,
      mrp: 190,
      image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
      angle1: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
      angle2: "/assets/sand-stone/slab1-600x500.jpg",
      angle3: "/assets/sand-stone/IMG-20151210-WA0004-600x600.jpg",
      images: [
        { url: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg", alt: "Angle 1 (Sandblasted Agra Red)", isPrimary: true },
        { url: "/assets/sand-stone/slab1-600x500.jpg", alt: "Angle 2 (Quarry Cut Sawn Slab)" },
        { url: "/assets/sand-stone/IMG-20151210-WA0004-600x600.jpg", alt: "Angle 3 (Natural Texture Detail)" }
      ],
      description: "Timeless imperial terracotta-red sandstone revered across UNESCO heritage sites, temples, and premier modern ventilated facades.",
      specifications: { "Thickness": "25-30 mm Sawn", "Density": "2.55 g/cm³", "Standard": "ASTM C616 Certified", "Origin": "Agra-Dholpur Belt" }
    },
    {
      _id: "demo_s2",
      name: "Autumn Brown Natural Calibrated Sandstone",
      title: "Autumn Brown Natural Calibrated Sandstone",
      category: "Sand Stone Specialty",
      sku: "SND-02-AUT",
      price: 155,
      mrp: 215,
      image: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
      angle1: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
      angle2: "/assets/sand-stone/istockphoto-1146322748-612x612.jpg",
      angle3: "/assets/sand-stone/istockphoto-1166440099-612x612.jpg",
      images: [
        { url: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg", alt: "Angle 1 (Autumn Brown Warm Palette)" },
        { url: "/assets/sand-stone/istockphoto-1146322748-612x612.jpg", alt: "Angle 2 (Natural Stone Masonry)" },
        { url: "/assets/sand-stone/istockphoto-1166440099-612x612.jpg", alt: "Angle 3 (Warm Earth Swirls)" }
      ],
      description: "Warm autumnal tones with subtle brown, grey, and ochre blending seamlessly for luxury garden patios, terraces, and pool decks.",
      specifications: { "Finish": "Natural Cleft & Tumbled", "Compressive Strength": "120 MPa", "Porosity": "< 1.2%" }
    },
    {
      _id: "demo_s3",
      name: "Modak Natural Calibrated Sandstone Paving",
      title: "Modak Natural Calibrated Sandstone Paving",
      category: "Sand Stone Specialty",
      sku: "SND-03-MDK",
      price: 165,
      mrp: 230,
      image: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg",
      angle1: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg",
      angle2: "/assets/sand-stone/istockphoto-1428028931-612x612.jpg",
      angle3: "/assets/sand-stone/istockphoto-1487747252-612x612.jpg",
      images: [
        { url: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg", alt: "Angle 1 (Modak Rich Terracotta Rose)" },
        { url: "/assets/sand-stone/istockphoto-1428028931-612x612.jpg", alt: "Angle 2 (Artisanal Texture)" },
        { url: "/assets/sand-stone/istockphoto-1487747252-612x612.jpg", alt: "Angle 3 (Exterior Architectural Facade)" }
      ],
      description: "Exotic blend of pink, golden, and honey-veined patterns that glow with vibrant luster when exposed to direct sunlight.",
      specifications: { "Color Scheme": "Honey Gold & Salmon Pink", "Applications": "Patios, Cladding, Pathways", "Water Absorption": "0.85%" }
    },
    {
      _id: "demo_s4",
      name: "White Mint Sandstone Shotblasted & Tumbled",
      title: "White Mint Sandstone Shotblasted & Tumbled",
      category: "Sand Stone Specialty",
      sku: "SND-04-MNT",
      price: 185,
      mrp: 260,
      image: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg",
      angle1: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg",
      angle2: "/assets/sand-stone/istockphoto-1194350196-612x612.jpg",
      angle3: "/assets/sand-stone/istockphoto-2257211262-612x612.jpg",
      images: [
        { url: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg", alt: "Angle 1 (Mint Sandstone Shotblasted)" },
        { url: "/assets/sand-stone/istockphoto-1194350196-612x612.jpg", alt: "Angle 2 (Natural Rockface Texture)" },
        { url: "/assets/sand-stone/istockphoto-2257211262-612x612.jpg", alt: "Angle 3 (Pool Coping & Patio Surface)" }
      ],
      description: "Clean pale ivory and mint stone with shotblasted textured grip, non-slippery around water bodies and thermal insulated under bare feet.",
      specifications: { "Finish": "Shotblasted & Hand-Tumbled", "Frost Resistance": "Freeze-Thaw Proven", "Density": "2.40 g/cm³" }
    }
  ],
  kotadoria: [
    {
      _id: "demo_d1",
      name: "Royal Crimson & Gold Zari Silk-Cotton Saree",
      title: "Royal Crimson & Gold Zari Silk-Cotton Saree",
      category: "Kota Doria Specialty",
      sku: "KDR-01-ZAR",
      price: 4850,
      mrp: 6500,
      image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
      angle1: "/assets/kota-doria/0X2A0415.jpg",
      angle2: "/assets/kota-doria/3E9A1251.jpg",
      angle3: "/assets/kota-doria/3E9A3098_b15c9d83-4fac-46af-b126-7bb8ad88357d.jpg",
      images: [
        { url: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg", alt: "Angle 1 (Bridal Presentation Saree)", isPrimary: true },
        { url: "/assets/kota-doria/0X2A0415.jpg", alt: "Angle 2 (Pallu & Zari Weave Close-up)" },
        { url: "/assets/kota-doria/3E9A1251.jpg", alt: "Angle 3 (Drape & Sheer Flow)" },
        { url: "/assets/kota-doria/3E9A3098_b15c9d83-4fac-46af-b126-7bb8ad88357d.jpg", alt: "Angle 4 (Full Silhouette Elegance)" }
      ],
      description: "Authentic handwoven gossamer silk-cotton saree featuring traditional square khat checks, opulent woven zari border, and handcrafted tassels.",
      specifications: { "Length": "6.5 Meters with Blouse Piece", "Khat Density": "300+ Checks / Meter", "GI Provenance": "GI Tag Certified (Rajasthan)", "Fabric": "Pure Silk Warp, Cotton Weft" }
    },
    {
      _id: "demo_d2",
      name: "Natural Dyed Bagru Hand Block Print Cotton Saree",
      title: "Natural Dyed Bagru Hand Block Print Cotton Saree",
      category: "Kota Doria Specialty",
      sku: "KDR-02-BGR",
      price: 2450,
      mrp: 3200,
      image: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
      angle1: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-754-.jpg",
      angle2: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-918.jpg",
      angle3: "/assets/kota-doria/black-bagh-hand-block-print-natural-dyed-kota-doria-cotton-3pc-572.jpg",
      images: [
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg", alt: "Angle 1 (Natural Dyed Bagru Motif)" },
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-754-.jpg", alt: "Angle 2 (Artisanal Woodblock Print Detail)" },
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-918.jpg", alt: "Angle 3 (Set Fold & Border View)" },
        { url: "/assets/kota-doria/black-bagh-hand-block-print-natural-dyed-kota-doria-cotton-3pc-572.jpg", alt: "Angle 4 (Black Bagh Natural Dye Variation)" }
      ],
      description: "Hand-printed using hand-carved teak woodblocks and plant-based vegetable dyes on lightweight airy Kota Doria cotton fabric.",
      specifications: { "Dyes": "100% Organic Indigo, Harda & Pomegranate", "Craft": "Authentic Bagru Hand-Block", "Maintenance": "Gentle Cold Hand Wash" }
    },
    {
      _id: "demo_d3",
      name: "Hand-Embroidered Lucknowi Chikankari Unstitched Suit",
      title: "Hand-Embroidered Lucknowi Chikankari Unstitched Suit",
      category: "Kota Doria Specialty",
      sku: "KDR-03-CHK",
      price: 2850,
      mrp: 3900,
      image: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg",
      angle1: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-510.jpg",
      angle2: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-910.jpg",
      angle3: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-916.jpg",
      images: [
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg", alt: "Angle 1 (Chikankari Neckline Embroidery)" },
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-510.jpg", alt: "Angle 2 (Intricate Bakhiya & Phanda Stitches)" },
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-910.jpg", alt: "Angle 3 (Kurta Panel & Motifs)" },
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-916.jpg", alt: "Angle 4 (Full Unstitched Ensemble)" }
      ],
      description: "Delicate needlecraft featuring traditional Bakhiya, Tepchi, and Phanda stitches hand-rendered on translucent Kota Doria weave.",
      specifications: { "Embroidery": "Hand Chikan Needlework", "Set": "Kurta & Dupatta Set (2pc)", "Feel": "Featherlight Breathable Summer Wear" }
    },
    {
      _id: "demo_d4",
      name: "Pure Silk-Cotton Kaithun Bridal Saree Ensemble",
      title: "Pure Silk-Cotton Kaithun Bridal Saree Ensemble",
      category: "Kota Doria Specialty",
      sku: "KDR-04-BRL",
      price: 5200,
      mrp: 7200,
      image: "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
      angle1: "/assets/kota-doria/0Q8A6247_62dcd3b8-3f2b-4348-87c0-c6c1437df6b7.jpg",
      angle2: "/assets/kota-doria/0Q8A9127_9a53b013-6806-4ef4-84b9-114c58d9b338.jpg",
      angle3: "/assets/kota-doria/3E9A7095_81bf7953-0d4f-400b-a394-9ddb65bf9205.jpg",
      images: [
        { url: "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg", alt: "Angle 1 (Bridal Atelier Studio Portrait)" },
        { url: "/assets/kota-doria/0Q8A6247_62dcd3b8-3f2b-4348-87c0-c6c1437df6b7.jpg", alt: "Angle 2 (Side Silhouette & Drape)" },
        { url: "/assets/kota-doria/0Q8A9127_9a53b013-6806-4ef4-84b9-114c58d9b338.jpg", alt: "Angle 3 (Detail of Pallu & Border)" },
        { url: "/assets/kota-doria/3E9A7095_81bf7953-0d4f-400b-a394-9ddb65bf9205.jpg", alt: "Angle 4 (Full Festive Look)" }
      ],
      description: "Exquisite handwoven bridal saree featuring lustrous silk finish, reinforced selvedge, and intricate gold floral bootis.",
      specifications: { "Loom": "Kaithun Village Pitloom", "Yarn": "Mulberry Silk & Long Staple Cotton", "Weight": "Under 380 grams" }
    },
    {
      _id: "demo_d5",
      name: "Sanganeri Hand Block Print 3-Piece Dress Material",
      title: "Sanganeri Hand Block Print 3-Piece Dress Material",
      category: "Kota Doria Specialty",
      sku: "KDR-05-SNG",
      price: 1950,
      mrp: 2600,
      image: "/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg",
      angle1: "/assets/kota-doria/brown-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-834.jpg",
      angle2: "/assets/kota-doria/purple-kota-doria-cotton-hand-block-sanganeri-print-fabric-08-fabrics-876.jpg",
      angle3: "/assets/kota-doria/blue-hand-block-bagh-print-natural-dyed-kota-doria-cotton-3pc-597.jpg",
      images: [
        { url: "/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg", alt: "Angle 1 (Emerald Green Floral Print)" },
        { url: "/assets/kota-doria/brown-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-834.jpg", alt: "Angle 2 (Earthy Brown Variant)" },
        { url: "/assets/kota-doria/purple-kota-doria-cotton-hand-block-sanganeri-print-fabric-08-fabrics-876.jpg", alt: "Angle 3 (Royal Purple Floral Details)" },
        { url: "/assets/kota-doria/blue-hand-block-bagh-print-natural-dyed-kota-doria-cotton-3pc-597.jpg", alt: "Angle 4 (Blue Hand Block Print Set)" }
      ],
      description: "Graceful Rajasthani floral motifs hand-stamped onto breathable square-checked fabric, complete with matching dupatta.",
      specifications: { "Set Content": "Top 2.5m, Bottom 2.0m, Dupatta 2.5m", "Print": "Calico Heritage Sanganer", "Colorfastness": "Lab Tested Level 4" }
    },
    {
      _id: "demo_d6",
      name: "Handcrafted Lucknowi Chikankari Pure Cotton Dupatta",
      title: "Handcrafted Lucknowi Chikankari Pure Cotton Dupatta",
      category: "Kota Doria Specialty",
      sku: "KDR-06-DUP",
      price: 1450,
      mrp: 1950,
      image: "/assets/kota-doria/red-kota-doria-cotton-hand-embroidered-lucknowi-chikankari-dupatta-19-131.jpg",
      angle1: "/assets/kota-doria/black-kota-doria-cotton-tie-dye-bandhani-fabric-09-fabrics-496.jpg",
      angle2: "/assets/kota-doria/green-kota-doria-cotton-tie-dye-bandhani-fabric-11-fabrics-863.jpg",
      angle3: "/assets/kota-doria/yellow-plain-cotton-kota-doria-fabric-11-fabrics-859.jpg",
      images: [
        { url: "/assets/kota-doria/red-kota-doria-cotton-hand-embroidered-lucknowi-chikankari-dupatta-19-131.jpg", alt: "Angle 1 (Ruby Red Embroidered Dupatta)" },
        { url: "/assets/kota-doria/black-kota-doria-cotton-tie-dye-bandhani-fabric-09-fabrics-496.jpg", alt: "Angle 2 (Bandhani Tie-Dye Fabric)" },
        { url: "/assets/kota-doria/green-kota-doria-cotton-tie-dye-bandhani-fabric-11-fabrics-863.jpg", alt: "Angle 3 (Olive Green Bandhani)" },
        { url: "/assets/kota-doria/yellow-plain-cotton-kota-doria-fabric-11-fabrics-859.jpg", alt: "Angle 4 (Mustard Yellow Plain Fabric)" }
      ],
      description: "Festive ruby red sheer dupatta ornamented with white silk thread embroidery and handcrafted border finish.",
      specifications: { "Dimensions": "2.5m x 36 Inches", "Weight": "95 grams", "Border": "Hand-rolled Picot / Zari piping" }
    }
  ]
};

const DEFAULT_DEMO_PRODUCTS = SPECIALTY_DEMO_PRODUCTS.garlic;

export default function DynamicCatalogueStudio({
  company,
  products = [],
  activeQrList = [],
  includeQr = true,
  onBack
}) {
  // Template & Category Selection
  const [selectedUid, setSelectedUid] = useState("garlic:garlic-1");
  const [activeCategory, setActiveCategory] = useState(null);
  const [colorOverride, setColorOverride] = useState(null);
  const [customColor, setCustomColor] = useState("#2c3e91");

  // Sidebar Tool Tabs: "edit-text", "edit-photos", "templates", "copywriting"
  const [sidebarTab, setSidebarTab] = useState("edit-text");

  // Catalogue Text Overrides
  const [textOverrides, setTextOverrides] = useState({
    tagline: "",
    why: "",
    apps: "",
    values: ""
  });

  // Editor & Render State
  const [isEditMode, setIsEditMode] = useState(true); // Default to ALWAYS EDITABLE
  const [pagesHtml, setPagesHtml] = useState([]);
  const [currentSel, setCurrentSel] = useState(null);
  const [catalogInfo, setCatalogInfo] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const [previewScale, setPreviewScale] = useState(0.8);
  const [showHelpGuide, setShowHelpGuide] = useState(true);

  // Live Inspected Page Elements
  const [selectedInspectPage, setSelectedInspectPage] = useState(0);
  const [inspectedTexts, setInspectedTexts] = useState([]);
  const [inspectedPhotos, setInspectedPhotos] = useState([]);

  // MongoDB Catalogue Record State
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedRecords, setSavedRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // Drag and Drop States
  const [draggedPageIdx, setDraggedPageIdx] = useState(null);
  const [dragOverPageIdx, setDragOverPageIdx] = useState(null);

  // Custom Gallery of Photos with curated local real photos from Garlic, Kota Stone, Kota Doria & Sand Stone
  const [customGallery, setCustomGallery] = useState(() => {
    try {
      const saved = localStorage.getItem("catalogue_custom_gallery");
      return saved ? JSON.parse(saved) : [
        "/assets/garlic/garlic-01.jpeg",
        "/assets/garlic/garlic-05.jpeg",
        "/assets/garlic/garlic-08.jpeg",
        "/assets/garlic/garlic-11.jpeg",
        "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
        "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg",
        "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg",
        "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg",
        "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
        "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg",
        "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
        "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg"
      ];
    } catch {
      return [];
    }
  });

  const currentFam = selectedUid?.split(":")[0];
  const activeProducts = useMemo(() => {
    if (products && products.length > 0) return products;
    return SPECIALTY_DEMO_PRODUCTS[currentFam] || DEFAULT_DEMO_PRODUCTS;
  }, [products, currentFam]);

  // Real Photo Bank (Garlic, Kota Stone, Kota Doria, Sandstone) state & filtering
  const [assetTab, setAssetTab] = useState("all");
  const [assetSearch, setAssetSearch] = useState("");

  const filteredAssets = useMemo(() => {
    let list = [];
    if (assetTab === "all") {
      list = [...GARLIC_ASSETS, ...KOTA_STONE_ASSETS, ...KOTA_DORIA_ASSETS, ...SAND_STONE_ASSETS];
    } else if (assetTab === "garlic") {
      list = GARLIC_ASSETS;
    } else if (assetTab === "kotastone") {
      list = KOTA_STONE_ASSETS;
    } else if (assetTab === "kotadoria") {
      list = KOTA_DORIA_ASSETS;
    } else if (assetTab === "sandstone") {
      list = SAND_STONE_ASSETS;
    }
    if (assetSearch.trim()) {
      const q = assetSearch.toLowerCase().trim();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.filename.toLowerCase().includes(q));
    }
    return list;
  }, [assetTab, assetSearch]);

  const handleInsertAssetPhoto = (assetUrl, targetPageIdx = selectedInspectPage) => {
    const host = previewHostRef.current;
    if (!host) return;
    const cards = host.querySelectorAll(".pvpage");
    const targetCard = cards[targetPageIdx] || cards[0];
    if (!targetCard) return;
    const pg = targetCard.firstElementChild;
    if (!pg) return;

    const existingCustomEls = pg.querySelectorAll(".custom-user-el");
    const topOffset = Math.min(820, 160 + existingCustomEls.length * 60);

    const el = document.createElement("div");
    el.className = "custom-user-el photo-frame";
    el.setAttribute("data-custom-el", "true");
    el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;width:320px;height:220px;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.18);cursor:move;z-index:60;background:#f8fafc;`;

    const img = document.createElement("img");
    img.src = assetUrl;
    img.alt = "Inserted asset";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
    el.appendChild(img);

    pg.appendChild(el);
    select(el, targetCard);
    refreshInspectedElements(targetPageIdx);
    confetti({ particleCount: 40, spread: 50 });
  };

  // Interactive Swap Image Modal State
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapModalTarget, setSwapModalTarget] = useState(null); // { el, inner, url, pageIdx, pIdx, key, label }
  const [swapModalCategory, setSwapModalCategory] = useState("all");
  const [swapModalSearch, setSwapModalSearch] = useState("");
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState("");

  const swapModalImages = useMemo(() => {
    let list = [];
    if (swapModalCategory === "all") {
      list = [...SAND_STONE_ASSETS, ...KOTA_STONE_ASSETS, ...KOTA_DORIA_ASSETS, ...GARLIC_ASSETS];
    } else if (swapModalCategory === "sandstone") {
      list = SAND_STONE_ASSETS;
    } else if (swapModalCategory === "kotastone") {
      list = KOTA_STONE_ASSETS;
    } else if (swapModalCategory === "kotadoria") {
      list = KOTA_DORIA_ASSETS;
    } else if (swapModalCategory === "garlic") {
      list = GARLIC_ASSETS;
    } else if (swapModalCategory === "products") {
      list = activeProducts.map((p, idx) => ({
        title: p.name || p.title || `Product #${idx + 1}`,
        filename: p.sku || `Product-${idx + 1}`,
        url: p.image || (p.images && p.images[0]?.url) || ""
      })).filter(p => Boolean(p.url));
    }
    if (swapModalSearch.trim()) {
      const q = swapModalSearch.toLowerCase().trim();
      list = list.filter(a => a.title.toLowerCase().includes(q) || (a.filename && a.filename.toLowerCase().includes(q)));
    }
    return list;
  }, [swapModalCategory, swapModalSearch, activeProducts]);

  const handleOpenSwapForInspectedPhoto = (photoItem, photoIdx) => {
    setSwapModalTarget({
      el: photoItem.el,
      inner: photoItem.el,
      url: photoItem.url,
      pageIdx: selectedInspectPage,
      pIdx: photoIdx,
      key: photoItem.key,
      label: `Photo #${photoIdx + 1} on Page ${selectedInspectPage + 1}`
    });
    if (currentFam === "sandstone") setSwapModalCategory("sandstone");
    else if (currentFam === "kotastone") setSwapModalCategory("kotastone");
    else if (currentFam === "kotadoria") setSwapModalCategory("kotadoria");
    else if (currentFam === "garlic") setSwapModalCategory("garlic");
    else setSwapModalCategory("all");

    setIsSwapModalOpen(true);
  };

  const handleExecutePhotoSwap = (newImageUrl) => {
    if (!swapModalTarget || !swapModalTarget.el || !newImageUrl) return;

    applyEdit(swapModalTarget.el, { customImg: newImageUrl, photo: undefined }, newImageUrl);

    const pv = swapModalTarget.el.closest(".pvpage");
    if (pv) {
      const key = keyFor(swapModalTarget.el, pv);
      if (!window.DesignEdits) window.DesignEdits = {};
      if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
      window.DesignEdits[selectedUid][key] = Object.assign(
        {},
        window.DesignEdits[selectedUid][key] || {},
        { kind: "photo", customImg: newImageUrl, photo: undefined }
      );
    }

    if (!customGallery.includes(newImageUrl)) {
      const updated = [newImageUrl, ...customGallery.slice(0, 19)];
      setCustomGallery(updated);
      try {
        localStorage.setItem("catalogue_custom_gallery", JSON.stringify(updated));
      } catch (_) {}
    }

    refreshInspectedElements(swapModalTarget.pageIdx != null ? swapModalTarget.pageIdx : selectedInspectPage);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setIsSwapModalOpen(false);
    setSwapModalTarget(null);
  };

  const handleApplyAssetImage = (assetUrl) => {
    if (swapModalTarget && swapModalTarget.el) {
      handleApplyCustomPhoto(swapModalTarget, assetUrl);
      confetti({ particleCount: 35, spread: 50 });
      return;
    }
    if (inspectedPhotos.length > 0) {
      handleApplyCustomPhoto(inspectedPhotos[0], assetUrl);
      confetti({ particleCount: 35, spread: 50 });
    } else {
      handleInsertAssetPhoto(assetUrl);
    }
  };

  const handleReorderPages = (fromIdx, toIdx) => {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    const newPages = [...pagesHtml];
    const [moved] = newPages.splice(fromIdx, 1);
    newPages.splice(toIdx, 0, moved);
    setPagesHtml(newPages);

    // Reorder DOM cards in previewHostRef
    const host = previewHostRef.current;
    if (host) {
      const cards = Array.from(host.querySelectorAll(".pvpage"));
      if (cards[fromIdx]) {
        const movedCard = cards[fromIdx];
        if (toIdx >= cards.length - 1) {
          host.appendChild(movedCard);
        } else {
          const refCard = toIdx > fromIdx ? cards[toIdx].nextSibling : cards[toIdx];
          host.insertBefore(movedCard, refCard);
        }
        // Update tags and dataset.i
        const updatedCards = host.querySelectorAll(".pvpage");
        updatedCards.forEach((c, i) => {
          c.dataset.i = i;
          const tag = c.querySelector(".pvtag");
          if (tag) tag.textContent = `Page ${i + 1} of ${updatedCards.length}`;
        });
        if (currentSel) onRendered(currentSel);
        refreshInspectedElements(0);
      }
    }
  };

  // Add a new page to the catalogue (blank, showcase, or gallery)
  const handleAddPage = (layoutType = "blank") => {
    const [pw, ph] = (currentSel && currentSel.size) || [794, 1123];
    const brandColor = colorOverride || "#2563eb";
    const compName = company?.name || "Supreme Granite & Stones";
    const pNum = pagesHtml.length + 1;

    let pageContentHtml = "";
    if (layoutType === "blank") {
      pageContentHtml = `
        <div style="position:absolute;left:56px;top:50px;right:56px;height:4px;background:${brandColor};border-radius:2px;"></div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:70px;font-size:28px;font-weight:800;font-family:'Montserrat',sans-serif;color:#1e293b;line-height:1.2;">
          Page ${pNum} Title
        </div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:115px;font-size:14px;font-weight:600;font-family:'Montserrat',sans-serif;color:${brandColor};letter-spacing:1.5px;text-transform:uppercase;">
          Custom Section Subtitle
        </div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:150px;width:80px;height:2px;background:${brandColor};border-radius:1px;"></div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:175px;font-size:14px;font-weight:400;font-family:'Montserrat',sans-serif;color:#475569;line-height:1.6;max-width:620px;">
          This is a fresh custom page. Use the "+ Elements" panel on the left to add more headings, paragraphs, callout boxes, price tags, and custom photos!
        </div>
      `;
    } else if (layoutType === "showcase") {
      pageContentHtml = `
        <div style="position:absolute;left:0;top:0;right:0;height:6px;background:${brandColor};"></div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:50px;font-size:28px;font-weight:800;font-family:'Montserrat',sans-serif;color:#1e293b;">
          Featured Collection Spotlight
        </div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:95px;font-size:14px;font-weight:600;color:${brandColor};text-transform:uppercase;letter-spacing:1px;">
          Architectural Mastery &bull; ${compName}
        </div>
        <div class="custom-user-el photo-frame" data-custom-el="true" style="position:absolute;left:56px;top:135px;width:${pw - 112}px;height:380px;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.12);background:#f1f5f9;">
          <img src="/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg" alt="Showcase" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:540px;font-size:20px;font-weight:700;color:#1e293b;">
          Specifications &amp; Applications
        </div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:575px;font-size:13.5px;color:#475569;line-height:1.6;max-width:${pw - 112}px;">
          Direct-from-quarry processing with computerized high-precision calibration. Suited for heavy-footfall commercial walkways, luxury residential villas, and exterior facade claddings.
        </div>
      `;
    } else if (layoutType === "gallery") {
      const gWidth = Math.floor((pw - 112 - 20) / 2);
      pageContentHtml = `
        <div style="position:absolute;left:56px;top:50px;right:56px;height:4px;background:${brandColor};border-radius:2px;"></div>
        <div class="custom-user-el" data-custom-el="true" style="position:absolute;left:56px;top:70px;font-size:28px;font-weight:800;font-family:'Montserrat',sans-serif;color:#1e293b;">
          Product Gallery &amp; Finishes
        </div>
        <div class="custom-user-el photo-frame" data-custom-el="true" style="position:absolute;left:56px;top:130px;width:${gWidth}px;height:240px;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.1);">
          <img src="/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg" alt="G1" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
        <div class="custom-user-el photo-frame" data-custom-el="true" style="position:absolute;left:${56 + gWidth + 20}px;top:130px;width:${gWidth}px;height:240px;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.1);">
          <img src="/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg" alt="G2" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
        <div class="custom-user-el photo-frame" data-custom-el="true" style="position:absolute;left:56px;top:400px;width:${gWidth}px;height:240px;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.1);">
          <img src="/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg" alt="G3" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
        <div class="custom-user-el photo-frame" data-custom-el="true" style="position:absolute;left:${56 + gWidth + 20}px;top:400px;width:${gWidth}px;height:240px;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.1);">
          <img src="/assets/garlic/garlic-01.jpeg" alt="G4 (Garlic)" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
      `;
    }

    const newPageHtml = `<div class="pg custom-added-page" style="width:${pw}px;height:${ph}px;position:relative;overflow:hidden;background:#ffffff;box-sizing:border-box;">${pageContentHtml}</div>`;
    const newPages = [...pagesHtml, newPageHtml];
    setPagesHtml(newPages);

    // Append to live DOM
    const host = previewHostRef.current;
    if (host) {
      const s = previewScale;
      const W = Math.round(pw * s);
      const H = Math.round(ph * s);
      const pageCard = document.createElement("div");
      pageCard.className = "pvpage";
      pageCard.dataset.i = newPages.length - 1;
      pageCard.dataset.s = s;
      pageCard.style.cssText = `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#ffffff;margin:0 0 20px;box-shadow:0 12px 36px rgba(0,0,0,0.45);border-radius:6px;`;
      pageCard.innerHTML = newPageHtml;

      const pg = pageCard.firstElementChild;
      if (pg) {
        pg.style.cssText += `;position:absolute;left:0;top:0;margin:0;transform-origin:0 0;transform:scale(${s})`;
      }

      const tag = document.createElement("div");
      tag.className = "pvtag";
      tag.textContent = `Page ${newPages.length} of ${newPages.length}`;
      pageCard.appendChild(tag);
      host.appendChild(pageCard);

      // Re-index all pvtag labels
      const allCards = host.querySelectorAll(".pvpage");
      allCards.forEach((c, idx) => {
        c.dataset.i = idx;
        const tg = c.querySelector(".pvtag");
        if (tg) tg.textContent = `Page ${idx + 1} of ${allCards.length}`;
      });

      if (currentSel) onRendered(currentSel);
      setSelectedInspectPage(newPages.length - 1);
      refreshInspectedElements(newPages.length - 1);
      setTimeout(() => {
        pageCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }

    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
  };

  // Duplicate an existing page
  const handleDuplicatePage = (pageIdx) => {
    const host = previewHostRef.current;
    let pageHtmlToCopy = pagesHtml[pageIdx];
    if (host) {
      const cards = host.querySelectorAll(".pvpage");
      if (cards[pageIdx] && cards[pageIdx].firstElementChild) {
        pageHtmlToCopy = cards[pageIdx].firstElementChild.outerHTML;
      }
    }

    const newPages = [...pagesHtml];
    newPages.splice(pageIdx + 1, 0, pageHtmlToCopy);
    setPagesHtml(newPages);

    // Sync DOM host
    if (host) {
      const [pw, ph] = (currentSel && currentSel.size) || [794, 1123];
      const s = previewScale;
      const W = Math.round(pw * s);
      const H = Math.round(ph * s);

      const pageCard = document.createElement("div");
      pageCard.className = "pvpage";
      pageCard.dataset.s = s;
      pageCard.style.cssText = `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#ffffff;margin:0 0 20px;box-shadow:0 12px 36px rgba(0,0,0,0.45);border-radius:6px;`;
      pageCard.innerHTML = pageHtmlToCopy;

      const pg = pageCard.firstElementChild;
      if (pg) {
        pg.style.cssText += `;position:absolute;left:0;top:0;margin:0;transform-origin:0 0;transform:scale(${s})`;
      }

      const tag = document.createElement("div");
      tag.className = "pvtag";
      pageCard.appendChild(tag);

      const cards = Array.from(host.querySelectorAll(".pvpage"));
      if (pageIdx >= cards.length - 1) {
        host.appendChild(pageCard);
      } else {
        host.insertBefore(pageCard, cards[pageIdx + 1]);
      }

      const allCards = host.querySelectorAll(".pvpage");
      allCards.forEach((c, idx) => {
        c.dataset.i = idx;
        const tg = c.querySelector(".pvtag");
        if (tg) tg.textContent = `Page ${idx + 1} of ${allCards.length}`;
      });

      if (currentSel) onRendered(currentSel);
      setSelectedInspectPage(pageIdx + 1);
      refreshInspectedElements(pageIdx + 1);
      setTimeout(() => {
        pageCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }

    confetti({ particleCount: 50, spread: 50 });
  };

  // Delete a page
  const handleDeletePage = (pageIdx) => {
    if (pagesHtml.length <= 1) {
      alert("A catalogue must contain at least one page.");
      return;
    }
    const confirmDel = window.confirm(`Are you sure you want to delete Page ${pageIdx + 1}?`);
    if (!confirmDel) return;

    const newPages = pagesHtml.filter((_, i) => i !== pageIdx);
    setPagesHtml(newPages);

    const host = previewHostRef.current;
    if (host) {
      const cards = Array.from(host.querySelectorAll(".pvpage"));
      if (cards[pageIdx]) {
        cards[pageIdx].remove();
        const remaining = host.querySelectorAll(".pvpage");
        remaining.forEach((c, idx) => {
          c.dataset.i = idx;
          const tg = c.querySelector(".pvtag");
          if (tg) tg.textContent = `Page ${idx + 1} of ${remaining.length}`;
        });
        if (currentSel) onRendered(currentSel);
        const nextIdx = Math.max(0, Math.min(pageIdx, remaining.length - 1));
        setSelectedInspectPage(nextIdx);
        refreshInspectedElements(nextIdx);
      }
    }
  };

  // Add an extra element to a page (heading, subheading, paragraph, callout, price tag, bullet, photo, divider)
  const handleAddElement = (type, targetPageIdx = selectedInspectPage) => {
    const host = previewHostRef.current;
    if (!host) return;
    const cards = host.querySelectorAll(".pvpage");
    const targetCard = cards[targetPageIdx] || cards[0];
    if (!targetCard) return;
    const pg = targetCard.firstElementChild;
    if (!pg) return;

    const brandColor = colorOverride || "#2563eb";
    const existingCustomEls = pg.querySelectorAll(".custom-user-el");
    const topOffset = Math.min(850, 150 + existingCustomEls.length * 65);

    let el = document.createElement("div");
    el.className = "custom-user-el";
    el.setAttribute("data-custom-el", "true");

    if (type === "heading" || type === "h1") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:30px;font-weight:800;font-family:'Montserrat',sans-serif;color:#1e293b;line-height:1.2;cursor:move;z-index:60;max-width:640px;`;
      el.textContent = "New Headline Title";
    } else if (type === "subheading" || type === "h2") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:18px;font-weight:700;font-family:'Montserrat',sans-serif;color:${brandColor};text-transform:uppercase;letter-spacing:1.5px;cursor:move;z-index:60;max-width:640px;`;
      el.textContent = "Section Subheading";
    } else if (type === "paragraph" || type === "body") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:14px;font-weight:400;font-family:'Montserrat',sans-serif;color:#475569;line-height:1.6;cursor:move;z-index:60;max-width:560px;`;
      el.textContent = "Enter descriptive paragraph copy here. Natural split textures, precision calibration, and durable architectural appeal.";
    } else if (type === "textarea") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:14px;font-weight:400;font-family:'Montserrat',sans-serif;color:#334155;line-height:1.6;cursor:move;z-index:60;max-width:580px;background:rgba(248,250,252,0.9);border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;`;
      el.textContent = "Multi-line text area content. Ideal for detailed technical specifications, project certifications, warranty terms, and company narrative.";
    } else if (type === "text") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:15px;font-weight:600;font-family:'Montserrat',sans-serif;color:#1e293b;cursor:move;z-index:60;max-width:480px;`;
      el.textContent = "Custom Text Element";
    } else if (type === "callout") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:13.5px;font-weight:600;font-family:'Montserrat',sans-serif;color:#1e293b;background:rgba(59,130,246,0.08);border-left:4px solid ${brandColor};border-radius:6px;padding:12px 18px;cursor:move;z-index:60;max-width:480px;line-height:1.5;`;
      el.textContent = "★ Special Note: Available in custom finishes, edge profiles, and direct nationwide dispatch.";
    } else if (type === "price") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:18px;font-weight:800;font-family:'Montserrat',sans-serif;color:#ffffff;background:#0f172a;border-radius:99px;padding:8px 22px;display:inline-block;cursor:move;z-index:60;box-shadow:0 4px 14px rgba(0,0,0,0.18);`;
      el.textContent = "₹ 1,450 / sq.ft";
    } else if (type === "bullet") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;font-size:13.5px;font-weight:600;font-family:'Montserrat',sans-serif;color:#059669;background:#ecfdf5;border:1.5px solid #a7f3d0;border-radius:8px;padding:8px 16px;display:inline-block;cursor:move;z-index:60;`;
      el.textContent = "✓ 100% Anti-Slip & Weatherproof Natural Stone";
    } else if (type === "photo") {
      el.className = "custom-user-el photo-frame";
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;width:300px;height:200px;border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.12);cursor:move;z-index:60;background:#f8fafc;`;
      const img = document.createElement("img");
      const famDefaultImg = currentFam === "kotadoria" ? "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg" : currentFam === "sandstone" ? "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg" : "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg";
      img.src = famDefaultImg;
      img.alt = "Added photo";
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      el.appendChild(img);
    } else if (type === "divider") {
      el.style.cssText = `position:absolute;left:56px;top:${topOffset}px;width:240px;height:3px;background:${brandColor};border-radius:2px;cursor:move;z-index:60;`;
    }

    pg.appendChild(el);

    // Select the new element & start inline text editing if text
    select(el, targetCard);
    if (type !== "photo" && type !== "divider") {
      startText(el);
    }

    refreshInspectedElements(targetPageIdx);
    setSidebarTab("edit-text");
  };

  // Delete an inspected element
  const handleDeleteElement = (item) => {
    if (!item || !item.el) return;
    item.el.remove();
    select(null);
    if (currentSel) onRendered(currentSel);
    refreshInspectedElements(selectedInspectPage);
  };

  const previewHostRef = useRef(null);
  const containerRef = useRef(null);

  // Group templates by family with 4 primary product categories
  const categoryGroups = useMemo(() => {
    const groups = [
      { key: "garlic", title: "🧄 Garlic Specialty (8 Templates)", desc: "Organic farm harvest, bulb sizing 40-65mm, dehydrated flakes, export specifications & B2B matrices", fam: "garlic" },
      { key: "kotastone", title: "🏛️ Kota Stone Specialty (8 Templates)", desc: "Geometric architectural cuts, calibrated limestone, mirror polish, leather finishes & heavy paving", fam: "kotastone" },
      { key: "sandstone", title: "🏜️ Sand Stone Specialty (8 Templates)", desc: "Royal Jodhpur gold, exotic rainbow/teakwood veins, facade cladding & ASTM tested physical properties", fam: "sandstone" },
      { key: "kotadoria", title: "🥻 Kota Doria Specialty (10 Templates)", desc: "Royal gossamer handlooms, Parampara wholesale suite, Silken Saga celebration wedding lookbook & GI sarees", fam: "kotadoria" },
      { key: "editorial", title: "💎 Editorial Luxury Lookbook", desc: "High-fashion magazine spreads, soft serif typography, large hero imagery", fam: "editorial" },
      { key: "stonecat", title: "🌐 Trade & Export Catalogue", desc: "Commercial landscape spreads, technical spec matrices, mosaic swatches", fam: "stonecat" },
      { key: "simple", title: "⚡ Modern & Clean Signatures", desc: "Versatile, structured card grids, spec rows, masonry & contact closing", fam: "simple" }
    ];

    return groups.map(g => {
      const items = TEMPLATE_REGISTRY.filter(r => r.fam === g.fam);
      return { ...g, items };
    });
  }, []);

  // Initialize text defaults and auto-align template family based on company
  useEffect(() => {
    if (company) {
      const cName = (company.name || "").toLowerCase();
      const cInd = (company.industry || "").toLowerCase();
      if ((cName.includes("garlic") || cInd.includes("garlic")) && !selectedUid.startsWith("garlic:")) {
        setSelectedUid("garlic:garlic-1");
      } else if ((cName.includes("sand") || cInd.includes("sand")) && !selectedUid.startsWith("sandstone:")) {
        setSelectedUid("sandstone:ss-1");
      } else if ((cName.includes("doria") || cInd.includes("doria")) && !selectedUid.startsWith("kotadoria:")) {
        setSelectedUid("kotadoria:kd-1");
      } else if ((cName.includes("kota stone") || cInd.includes("kota")) && !selectedUid.startsWith("kotastone:")) {
        setSelectedUid("kotastone:ks-b1");
      }

      const copy = getCopy({
        ent: company.name,
        district: (company.contact && (company.contact.city || company.contact.state)) || "India",
        product: company.industry || (products && products[0] && products[0].name) || "Catalogue"
      });
      setTextOverrides({
        tagline: company.tagline || copy.tagline || "",
        why: (copy.why || []).join("\n"),
        apps: (copy.apps || []).join("\n"),
        values: (copy.values || []).map(v => `${v[0]}: ${v[1]}`).join("\n")
      });
    }
  }, [company]);

  // Adjust preview scaler width dynamically
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && currentSel) {
        const availableW = containerRef.current.clientWidth - 40;
        const pageW = (currentSel.size && currentSel.size[0]) || 794;
        const s = Math.min(1.0, Math.max(0.4, availableW / pageW));
        setPreviewScale(Number(s.toFixed(2)));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [currentSel]);

  // Scan current page for all text elements & photos for the inspector
  const refreshInspectedElements = (pageIdx = selectedInspectPage) => {
    const host = previewHostRef.current;
    if (!host) return;
    const cards = host.querySelectorAll(".pvpage");
    const card = cards[pageIdx] || cards[0];
    if (!card) return;
    const pg = card.firstElementChild;
    if (!pg) return;

    const texts = [];
    const photos = [];

    const walk = (node) => {
      if (!node) return;
      if (node.nodeType === 1) {
        if (/^(SCRIPT|STYLE|BR)$/i.test(node.tagName)) return;
        if (node.classList.contains("pvtag") || node.classList.contains("dz-sel") || node.classList.contains("dz-bar")) return;

        // Check for photo
        if (isPhoto(node)) {
          let url = "";
          if (node.tagName === "IMG") url = node.getAttribute("src") || "";
          else if (node.tagName === "IMAGE" || node.tagName === "image") url = node.getAttribute("href") || node.getAttribute("xlink:href") || "";
          else {
            const m = /url\(["']?([^"')]+)["']?\)/.exec(node.getAttribute("style") || "");
            if (m) url = m[1];
          }
          if (url) {
            photos.push({
              el: node,
              url,
              key: keyFor(node, card),
              tag: node.tagName.toLowerCase()
            });
          }
        }

        // Direct Text Node
        const directText = [...node.childNodes]
          .filter((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
          .map((n) => n.textContent.trim())
          .join(" ");

        const isCustom = node.classList.contains("custom-user-el") || node.getAttribute("data-custom-el");
        if ((isCustom || (directText && directText.length > 0)) && !isPhoto(node)) {
          texts.push({
            el: node,
            tag: node.tagName.toLowerCase(),
            key: keyFor(node, card),
            text: directText || node.textContent.trim() || "(Empty text element)",
            fullHtml: node.innerHTML
          });
        }
        [...node.children].forEach(walk);
      }
    };

    walk(pg);
    setInspectedTexts(texts);
    setInspectedPhotos(photos);
  };

  // Compile catalogue pages
  const compileCatalogue = async (live = false) => {
    let activeProducts = (products && products.length > 0) ? products : null;
    const fam = selectedUid?.split(":")[0];
    if (!activeProducts || activeProducts.length === 0) {
      activeProducts = SPECIALTY_DEMO_PRODUCTS[fam] || DEFAULT_DEMO_PRODUCTS;
    }
    setIsRendering(true);
    try {
      const preparedText = {
        tagline: textOverrides.tagline ? textOverrides.tagline.trim() : undefined,
        why: textOverrides.why ? textOverrides.why.split("\n").map(s => s.trim()).filter(Boolean) : undefined,
        apps: textOverrides.apps ? textOverrides.apps.split("\n").map(s => s.trim()).filter(Boolean) : undefined,
        values: textOverrides.values ? textOverrides.values.split("\n").map(line => {
          const idx = line.indexOf(":");
          return idx > 0 ? [line.slice(0, idx).trim(), line.slice(idx + 1).trim()] : [line.trim(), ""];
        }).filter(v => v[0]) : undefined
      };

      const result = await buildCatalogue({
        company,
        products: activeProducts,
        templateUid: selectedUid,
        colorOverride,
        textOverrides: preparedText,
        includeQr,
        customQrList: activeQrList
      });

      setCurrentSel(result.sel);
      setPagesHtml(result.pages);
      setCatalogInfo(result.info);

      // Render to DOM host with scaled page cards
      setTimeout(() => {
        if (previewHostRef.current) {
          const host = previewHostRef.current;
          host.innerHTML = "";
          const [pw, ph] = result.sel.size || [794, 1123];
          const s = previewScale;
          const W = Math.round(pw * s);
          const H = Math.round(ph * s);

          result.pages.forEach((html, idx) => {
            const pageCard = document.createElement("div");
            pageCard.className = "pvpage";
            pageCard.dataset.i = idx;
            pageCard.dataset.s = s;
            pageCard.style.cssText = `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#ffffff;margin:0 0 20px;box-shadow:0 12px 36px rgba(0,0,0,0.45);border-radius:6px;`;
            pageCard.innerHTML = html;

            const pg = pageCard.firstElementChild;
            if (pg) {
              pg.style.cssText += `;position:absolute;left:0;top:0;margin:0;transform-origin:0 0;transform:scale(${s})`;
            }

            const tag = document.createElement("div");
            tag.className = "pvtag";
            tag.textContent = `Page ${idx + 1} of ${result.pages.length}`;
            pageCard.appendChild(tag);
            host.appendChild(pageCard);
          });

          onRendered(result.sel);
          setMode(isEditMode);
          refreshInspectedElements(selectedInspectPage);

          window.onCatalogueTextEdited = () => {
            refreshInspectedElements(selectedInspectPage);
          };
        }
      }, 50);

      window.renderDynamicCatalogue = () => compileCatalogue(true);
    } catch (err) {
      console.error("Catalogue compilation failed:", err);
    } finally {
      setIsRendering(false);
    }
  };

  // Sync edit mode & trigger photo swap callbacks from editor.js
  useEffect(() => {
    window.onCatalogueModeChanged = (active) => {
      setIsEditMode(active);
    };

    window.onTriggerPhotoSwap = (sel) => {
      if (!sel || !sel.el) return;
      const targetPv = sel.pv || sel.el.closest(".pvpage");
      const pIdx = targetPv ? Number(targetPv.dataset.i || 0) : selectedInspectPage;
      setSelectedInspectPage(pIdx);

      const inner = sel.inner || sel.el;
      let currentUrl = "";
      if (inner.tagName === "IMG") {
        currentUrl = inner.getAttribute("src") || "";
      } else if (inner.tagName && inner.tagName.toLowerCase() === "image") {
        currentUrl = inner.getAttribute("href") || inner.getAttribute("xlink:href") || "";
      } else {
        const bgMatch = /url\(["']?([^"')]+)["']?\)/.exec(inner.getAttribute("style") || "");
        if (bgMatch) currentUrl = bgMatch[1];
      }

      setSwapModalTarget({
        el: sel.el,
        inner: inner,
        url: currentUrl,
        pageIdx: pIdx,
        key: sel.key,
        label: `Photo on Page ${pIdx + 1}`
      });

      if (currentFam === "sandstone") setSwapModalCategory("sandstone");
      else if (currentFam === "kotastone") setSwapModalCategory("kotastone");
      else if (currentFam === "kotadoria") setSwapModalCategory("kotadoria");
      else if (currentFam === "garlic") setSwapModalCategory("garlic");
      else setSwapModalCategory("all");

      setIsSwapModalOpen(true);
    };

    return () => {
      window.onCatalogueModeChanged = null;
      window.onTriggerPhotoSwap = null;
    };
  }, [currentFam, selectedInspectPage]);

  // Compile on template, color, products, company, or scale change
  useEffect(() => {
    compileCatalogue();
  }, [selectedUid, colorOverride, products, company, includeQr, previewScale]);

  // Update text from sidebar inspector
  const handleUpdateTextValue = (item, newVal) => {
    item.el.textContent = newVal;
    item.text = newVal;
    const pv = item.el.closest(".pvpage");
    if (pv) {
      const key = keyFor(item.el, pv);
      if (!window.DesignEdits) window.DesignEdits = {};
      if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
      window.DesignEdits[selectedUid][key] = Object.assign(
        {},
        window.DesignEdits[selectedUid][key] || {},
        { html: newVal }
      );
    }
    setInspectedTexts([...inspectedTexts]);
  };

  // Typography styling from sidebar inspector (Bold, Italic, Casing, Font)
  const handleToggleItemTypography = (item, prop, val) => {
    const pv = item.el.closest(".pvpage");
    if (!pv) return;
    const key = keyFor(item.el, pv);
    if (!window.DesignEdits) window.DesignEdits = {};
    if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
    const curEd = window.DesignEdits[selectedUid][key] || {};
    let patch = {};
    if (prop === 'bold') {
      const isBold = curEd.bold !== undefined ? curEd.bold : (getComputedStyle(item.el).fontWeight >= 600);
      patch.bold = !isBold;
      item.el.style.fontWeight = patch.bold ? '700' : 'normal';
    } else if (prop === 'italic') {
      const isItalic = curEd.italic !== undefined ? curEd.italic : (getComputedStyle(item.el).fontStyle === 'italic');
      patch.italic = !isItalic;
      item.el.style.fontStyle = patch.italic ? 'italic' : 'normal';
    } else if (prop === 'transform') {
      patch.transform = curEd.transform === val ? 'none' : val;
      item.el.style.textTransform = patch.transform;
    } else if (prop === 'fontFamily') {
      patch.fontFamily = val;
      item.el.style.fontFamily = val;
    }
    window.DesignEdits[selectedUid][key] = Object.assign({}, curEd, patch);
    setInspectedTexts([...inspectedTexts]);
  };

  // Update photo from sidebar inspector
  const handleSwapPhoto = (photoItem, photoIdx) => {
    const activeProducts = (products && products.length > 0) ? products : DEFAULT_DEMO_PRODUCTS;
    const prod = activeProducts[photoIdx];
    const newUrl = prod ? (prod.image || (prod.images && prod.images[0]?.url) || "") : "";
    if (!newUrl) return;

    applyEdit(photoItem.el, { photo: photoIdx, customImg: null }, newUrl);
    const pv = photoItem.el.closest(".pvpage");
    if (pv) {
      const key = keyFor(photoItem.el, pv);
      if (!window.DesignEdits) window.DesignEdits = {};
      if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
      window.DesignEdits[selectedUid][key] = Object.assign(
        {},
        window.DesignEdits[selectedUid][key] || {},
        { kind: "photo", photo: photoIdx, customImg: null }
      );
    }
    refreshInspectedElements(selectedInspectPage);
  };

  // Apply custom non-product photo (file upload or custom URL)
  const handleApplyCustomPhoto = (photoItem, customUrl) => {
    if (!customUrl) return;
    applyEdit(photoItem.el, { customImg: customUrl, photo: null }, customUrl);
    const pv = photoItem.el.closest(".pvpage");
    if (pv) {
      const key = keyFor(photoItem.el, pv);
      if (!window.DesignEdits) window.DesignEdits = {};
      if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
      window.DesignEdits[selectedUid][key] = Object.assign(
        {},
        window.DesignEdits[selectedUid][key] || {},
        { kind: "photo", customImg: customUrl, photo: undefined }
      );
    }
    if (!customGallery.includes(customUrl)) {
      const updated = [customUrl, ...customGallery.slice(0, 19)];
      setCustomGallery(updated);
      try {
        localStorage.setItem("catalogue_custom_gallery", JSON.stringify(updated));
      } catch (_) { }
    }
    refreshInspectedElements(selectedInspectPage);
  };

  const handleFileUpload = (photoItem, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      handleApplyCustomPhoto(photoItem, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSetShape = (photoItem, shape) => {
    applyEdit(photoItem.el, { shape }, null);
    const pv = photoItem.el.closest(".pvpage");
    if (pv) {
      const key = keyFor(photoItem.el, pv);
      if (!window.DesignEdits) window.DesignEdits = {};
      if (!window.DesignEdits[selectedUid]) window.DesignEdits[selectedUid] = {};
      window.DesignEdits[selectedUid][key] = Object.assign(
        {},
        window.DesignEdits[selectedUid][key] || {},
        { kind: "photo", shape }
      );
    }
    refreshInspectedElements(selectedInspectPage);
  };

  // Toggle in-place edit mode
  const handleToggleEditMode = () => {
    const next = !isEditMode;
    setIsEditMode(next);
    setMode(next);
  };

  // Export PDF
  const handleExportPdf = async () => {
    if (!currentSel || !catalogInfo) return;
    try {
      setIsExporting(true);

      // Extract current live HTML from DOM host so any added pages or added elements are included
      let livePages = pagesHtml;
      const host = previewHostRef.current;
      if (host) {
        const cards = Array.from(host.querySelectorAll(".pvpage"));
        if (cards.length) {
          livePages = cards.map(c => c.firstElementChild ? c.firstElementChild.outerHTML : c.innerHTML);
        }
      }

      setExportProgress({ current: 0, total: livePages.length });
      await exportDynamicPdf({
        pages: livePages,
        sel: currentSel,
        info: catalogInfo,
        items: activeProducts,
        onProgress: (cur, tot) => setExportProgress({ current: cur, total: tot })
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF generation failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Save to MongoDB
  const handleSaveToMongo = async () => {
    try {
      setIsSavingRecord(true);
      const activeProducts = (products && products.length > 0) ? products : DEFAULT_DEMO_PRODUCTS;
      const edits = (window.DesignEdits && window.DesignEdits[selectedUid]) || {};

      const payload = {
        ent_name: company?.name || "Supreme Granite & Stones",
        companyId: company?._id || null,
        district: (company?.contact && (company?.contact.city || company?.contact.state)) || "India",
        product: company?.industry || "Catalogue",
        template_uid: selectedUid,
        color: colorOverride || "",
        status: "draft",
        form_json: textOverrides,
        variants_json: activeProducts,
        design_edits_json: edits,
        logo_file: company?.logoUrl || ""
      };

      let res;
      if (currentRecordId) {
        res = await updateCatalogueRecord(currentRecordId, payload);
      } else {
        res = await createCatalogueRecord(payload);
        if (res.data?._id) setCurrentRecordId(res.data._id);
      }

      setSaveSuccessMsg("Saved successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save: " + err.message);
    } finally {
      setIsSavingRecord(false);
    }
  };

  // Open Saved Records Modal
  const handleOpenLoadModal = async () => {
    try {
      setIsLoadingRecords(true);
      setIsLoadModalOpen(true);
      const res = await fetchCatalogueRecords();
      if (res.data) setSavedRecords(res.data);
    } catch (err) {
      console.error("Fetch records error:", err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Load a record into the studio
  const handleSelectRecord = (rec) => {
    setCurrentRecordId(rec._id);
    if (rec.template_uid) setSelectedUid(rec.template_uid);
    if (rec.color !== undefined) setColorOverride(rec.color || null);
    if (rec.form_json) {
      setTextOverrides({
        tagline: rec.form_json.tagline || "",
        why: Array.isArray(rec.form_json.why) ? rec.form_json.why.join("\n") : (rec.form_json.why || ""),
        apps: Array.isArray(rec.form_json.apps) ? rec.form_json.apps.join("\n") : (rec.form_json.apps || ""),
        values: Array.isArray(rec.form_json.values) ? rec.form_json.values.map(v => Array.isArray(v) ? `${v[0]}: ${v[1]}` : v).join("\n") : (rec.form_json.values || "")
      });
    }
    if (rec.design_edits_json && rec.template_uid) {
      if (!window.DesignEdits) window.DesignEdits = {};
      window.DesignEdits[rec.template_uid] = rec.design_edits_json;
    }
    setIsLoadModalOpen(false);
    setSaveSuccessMsg(`Loaded "${rec.ent_name}"!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
    setTimeout(() => compileCatalogue(true), 100);
  };

  // Delete a record
  const handleDeleteRecord = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this saved catalogue design?")) return;
    try {
      await deleteCatalogueRecord(id);
      setSavedRecords(prev => prev.filter(r => r._id !== id));
      if (currentRecordId === id) setCurrentRecordId(null);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const selectedTemplate = byUid(selectedUid);
  const currentCategoryObj = categoryGroups.find(g => g.items.some(t => t.uid === selectedUid));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top Studio Control Bar */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          borderRadius: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff"
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                Dynamic Catalogue Studio
              </h2>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "99px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Database size={11} /> Connected
              </span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "2px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span>
                Layout: <strong style={{ color: "#f8fafc" }}>{selectedTemplate?.title || selectedUid}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSidebarTab("templates")}
                style={{
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid #8b5cf6",
                  color: "#c4b5fd",
                  padding: "1px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
                title="Browse and select catalogue templates"
              >
                <Palette size={11} /> 🎨 Change Layout ({TEMPLATE_REGISTRY.length})
              </button>
              <span>•</span>
              <span style={{ color: "#38bdf8", fontWeight: 700 }}>Single-Click ANY Text or Photo to Edit</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn btn-sm ${sidebarTab === "templates" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSidebarTab("templates")}
            style={{
              fontWeight: 800,
              fontSize: "0.82rem",
              background: sidebarTab === "templates" ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" : "rgba(139, 92, 246, 0.1)",
              borderColor: "#8b5cf6",
              color: sidebarTab === "templates" ? "#ffffff" : "#c4b5fd",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
            title="Browse and select catalogue layout templates"
          >
            <Palette size={14} /> 🎨 Layouts ({TEMPLATE_REGISTRY.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm ${isEditMode ? "btn-primary" : "btn-outline"}`}
            onClick={handleToggleEditMode}
            style={{
              fontWeight: 700,
              fontSize: "0.82rem",
              background: isEditMode ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : undefined,
              borderColor: isEditMode ? "#10b981" : "#475569",
              color: isEditMode ? "#ffffff" : "#94a3b8"
            }}
          >
            <Edit3 size={14} /> {isEditMode ? "✏️ Editor: ON" : "✏️ Enable Editor"}
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            style={{ color: "#94a3b8", borderColor: "#475569", fontWeight: 700, fontSize: "0.82rem" }}
          >
            <HelpCircle size={15} /> {showHelpGuide ? "Hide Help" : "How to Edit"}
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleOpenLoadModal}
            style={{ color: "#38bdf8", borderColor: "#0284c7", fontWeight: 700, fontSize: "0.82rem" }}
          >
            <FolderOpen size={15} /> Load
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleSaveToMongo}
            disabled={isSavingRecord}
            style={{ color: "#10b981", borderColor: "#059669", fontWeight: 700, fontSize: "0.82rem" }}
          >
            <Save size={15} /> {isSavingRecord ? "Saving..." : (currentRecordId ? "Update" : "Save")}
          </button>

          {/* DOWNLOAD MULTI-PAGE PDF BUTTON */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleExportPdf}
            disabled={isExporting}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              fontWeight: 800,
              fontSize: "0.84rem",
              padding: "7px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Download size={15} /> {isExporting ? `Compiling PDF (${exportProgress.current}/${exportProgress.total})...` : "📥 Download Multi-Page PDF"}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1.5px solid #10b981",
            borderRadius: "10px",
            padding: "10px 16px",
            color: "#6ee7b7",
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <CheckCircle size={18} /> {saveSuccessMsg}
        </div>
      )}

      {/* STEP-BY-STEP USER GUIDE (Collapsible) */}
      {showHelpGuide && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
            border: "1.5px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            color: "#f8fafc"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={18} /> Direct Text &amp; Photo Editing: How It Works
            </div>
            <button
              type="button"
              onClick={() => setShowHelpGuide(false)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#38bdf8", marginBottom: "4px" }}>
                1. 🔤 Edit Directly On Canvas (Single-Click)
              </div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                Click directly on <strong>ANY word, headline, specification, or price</strong> on the page. You get an active cursor to type inline immediately, plus a floating toolbar to adjust font size, bold, or color!
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#a78bfa", marginBottom: "4px" }}>
                2. 📝 Edit in Sidebar Form ("Edit All Text")
              </div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                Prefer typing into clean input fields? Use the <strong>"📝 Edit All Text"</strong> tab on the left! It lists every headline, phrase, and spec for that page in real-time.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#34d399", marginBottom: "4px" }}>
                3. 🖼️ Swap &amp; Shape Any Photo
              </div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                Click ANY image (including arch cutouts and stone swatches) to change shape (<strong>Arch, Rounded, Square, Circle</strong>), swap with any other product photo, or resize with drag handles!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Studio Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* Left Sidebar: Comprehensive Multi-Tab Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Navigation Pill Tabs - 2x3 Spacious Grid (Zero Clipping) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "var(--bg-surface-elevated)", padding: "6px", borderRadius: "12px", border: "1px solid var(--border-medium)", gap: "5px" }}>
            {/* TAB 1: LAYOUTS / TEMPLATES (PROMINENT FIRST) */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "templates" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSidebarTab("templates")}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: sidebarTab === "templates" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "rgba(139, 92, 246, 0.08)",
                color: sidebarTab === "templates" ? "#ffffff" : "#a78bfa",
                borderColor: sidebarTab === "templates" ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)",
                boxShadow: sidebarTab === "templates" ? "0 2px 8px rgba(139, 92, 246, 0.4)" : "none"
              }}
              title="Select Catalogue Layout Templates & Color Palettes"
            >
              <Palette size={13} /> 🎨 Layouts
            </button>

            {/* TAB 2: TEXT INSPECTOR */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "edit-text" ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setSidebarTab("edit-text");
                refreshInspectedElements(selectedInspectPage);
              }}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px"
              }}
              title="Edit all text and typography on the active page"
            >
              <Type size={13} /> Text
            </button>

            {/* TAB 3: PHOTOS INSPECTOR */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "edit-photos" ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setSidebarTab("edit-photos");
                refreshInspectedElements(selectedInspectPage);
              }}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px"
              }}
              title="Inspect and swap photos on the active page"
            >
              <ImageIcon size={13} /> Photos
            </button>

            {/* TAB 4: 101 PHOTO BANK */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "assets" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSidebarTab("assets")}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: sidebarTab === "assets" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : undefined,
                color: sidebarTab === "assets" ? "#ffffff" : undefined,
                borderColor: sidebarTab === "assets" ? "#8b5cf6" : undefined
              }}
              title="Browse 101 Real Images: Garlic, Kota Stone, Kota Doria & Sand Stone"
            >
              <FolderOpen size={13} /> Bank (101)
            </button>

            {/* TAB 5: INSERT ELEMENTS */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "add-elements" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSidebarTab("add-elements")}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: sidebarTab === "add-elements" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : undefined,
                color: sidebarTab === "add-elements" ? "#ffffff" : undefined,
                borderColor: sidebarTab === "add-elements" ? "#2563eb" : undefined
              }}
              title="Insert Extra Headings, Paragraphs, Badges & Photo Frames"
            >
              <PlusCircle size={13} /> + Elements
            </button>

            {/* TAB 6: REORDER PAGES */}
            <button
              type="button"
              className={`btn btn-sm ${sidebarTab === "drag-drop" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSidebarTab("drag-drop")}
              style={{
                fontSize: "0.76rem",
                fontWeight: 800,
                padding: "8px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: sidebarTab === "drag-drop" ? "linear-gradient(135deg, #10b981, #059669)" : undefined,
                color: sidebarTab === "drag-drop" ? "#ffffff" : undefined,
                borderColor: sidebarTab === "drag-drop" ? "#10b981" : undefined
              }}
              title="Reorder and arrange pages in your catalogue"
            >
              <Layers size={13} /> Pages
            </button>
          </div>

          {/* TAB 1: EDIT ALL TEXT ON CURRENT PAGE */}
          {sidebarTab === "edit-text" && (
            <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Type size={17} color="var(--primary)" />
                  Page Text Inspector
                </div>

                {/* Page Selector Dropdown */}
                <select
                  value={selectedInspectPage}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedInspectPage(idx);
                    refreshInspectedElements(idx);
                  }}
                  style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "6px", background: "var(--bg-surface-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-medium)", fontWeight: 700 }}
                >
                  {pagesHtml.map((_, pIdx) => (
                    <option key={pIdx} value={pIdx}>
                      Page {pIdx + 1} {pIdx === 0 ? "(Cover)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Type in any field below to update that exact text on <strong>Page {selectedInspectPage + 1}</strong> instantly:
              </div>

              {/* Add Extra Elements to Page (Direct Quick Inserter) */}
              <div
                style={{
                  marginBottom: "0.85rem",
                  padding: "10px 12px",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: "10px",
                  border: "1.5px dashed var(--primary, #3b82f6)",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <PlusCircle size={15} color="#2563eb" />
                    + Add Extra Element to Page {selectedInspectPage + 1}:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSidebarTab("add-elements")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}
                  >
                    All Elements &amp; Pages →
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("heading", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Large Bold H1 Heading"
                  >
                    <Type size={12} color="#2563eb" /> + Heading (H1)
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("subheading", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Tracking H2 Subheading"
                  >
                    <Type size={12} color="#059669" /> + Subheading (H2)
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("paragraph", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Paragraph Body Copy"
                  >
                    <FileText size={12} color="#8b5cf6" /> + Paragraph
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("textarea", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Multi-line Text Area"
                  >
                    <Edit3 size={12} color="#0891b2" /> + Text Area
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("callout", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Callout Note Box"
                  >
                    <Sparkles size={12} color="#f59e0b" /> + Callout Note
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("price", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Price Tag Pill"
                  >
                    <span style={{ fontSize: "11px", fontWeight: 900, color: "#e11d48" }}>₹</span> + Price Badge
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("bullet", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Feature Pill / Key Spec Tag"
                  >
                    <CheckCircle size={12} color="#10b981" /> + Feature Pill
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddElement("photo", selectedInspectPage)}
                    style={{ fontSize: "0.74rem", padding: "5px 7px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-start", background: "var(--bg-surface)" }}
                    title="Insert Resizable Photo Frame"
                  >
                    <ImageIcon size={12} color="#d97706" /> + Photo Frame
                  </button>
                </div>
              </div>

              {inspectedTexts.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", border: "1px dashed var(--border-medium)", borderRadius: "8px" }}>
                  No text elements detected on Page {selectedInspectPage + 1}. You can also click directly on the canvas page to edit!
                </div>
              ) : (
                <div style={{ maxHeight: "420px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", paddingRight: "4px" }}>
                  {inspectedTexts.map((item, tIdx) => (
                    <div
                      key={item.key || tIdx}
                      style={{
                        padding: "8px 10px",
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                          Field #{tIdx + 1} ({item.tag})
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              item.el.scrollIntoView({ behavior: "smooth", block: "center" });
                              item.el.focus();
                            }}
                            style={{ background: "none", border: "none", color: "#38bdf8", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}
                          >
                            Focus ↗
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteElement(item)}
                            style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px" }}
                            title="Delete this text element from page"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>

                      {item.text.length > 50 ? (
                        <textarea
                          rows={2}
                          className="input-field"
                          value={item.text}
                          onChange={(e) => handleUpdateTextValue(item, e.target.value)}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.82rem", resize: "vertical" }}
                        />
                      ) : (
                        <input
                          type="text"
                          className="input-field"
                          value={item.text}
                          onChange={(e) => handleUpdateTextValue(item, e.target.value)}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.84rem" }}
                        />
                      )}

                      {/* Quick typography bar */}
                      <div style={{ display: "flex", gap: "4px", marginTop: "5px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleItemTypography(item, "bold")}
                          style={{ padding: "2px 6px", fontSize: "0.72rem", fontWeight: 800, borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="Toggle Bold (B)"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleItemTypography(item, "italic")}
                          style={{ padding: "2px 6px", fontSize: "0.72rem", fontStyle: "italic", fontFamily: "serif", fontWeight: 700, borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="Toggle Italic / Emphasis (I)"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleItemTypography(item, "transform", "uppercase")}
                          style={{ padding: "2px 5px", fontSize: "0.68rem", fontWeight: 800, borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="UPPERCASE"
                        >
                          AA
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleItemTypography(item, "transform", "lowercase")}
                          style={{ padding: "2px 5px", fontSize: "0.68rem", fontWeight: 700, borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="lowercase"
                        >
                          aa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleItemTypography(item, "transform", "capitalize")}
                          style={{ padding: "2px 5px", fontSize: "0.68rem", fontWeight: 800, borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="Capitalize"
                        >
                          Aa
                        </button>
                        <select
                          onChange={(e) => handleToggleItemTypography(item, "fontFamily", e.target.value)}
                          style={{ padding: "2px 4px", fontSize: "0.68rem", borderRadius: "4px", border: "1px solid var(--border-medium)", background: "var(--bg-surface)", color: "var(--text-primary)", maxWidth: "105px" }}
                          title="Font Family"
                        >
                          <option value="">Font...</option>
                          <option value="'Playfair Display', serif">Playfair</option>
                          <option value="'Cinzel', serif">Cinzel</option>
                          <option value="'Cormorant Garamond', serif">Cormorant</option>
                          <option value="'Lora', serif">Lora</option>
                          <option value="'Montserrat', sans-serif">Montserrat</option>
                          <option value="'Outfit', sans-serif">Outfit</option>
                          <option value="'Inter', sans-serif">Inter</option>
                          <option value="'Poppins', sans-serif">Poppins</option>
                          <option value="Georgia, serif">Georgia</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Bottom Add Another Text Element Card */}
                  <div
                    onClick={() => handleAddElement("paragraph", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "center",
                      border: "1.5px dashed var(--primary, #3b82f6)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--primary, #2563eb)",
                      background: "rgba(37,99,235,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.15s ease"
                    }}
                    title="Add another text element to this page"
                  >
                    <Plus size={14} /> + Add Another Text to Page {selectedInspectPage + 1}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PHOTOS ON CURRENT PAGE */}
          {sidebarTab === "edit-photos" && (
            <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ImageIcon size={17} color="var(--primary)" />
                  Page Photos (Page {selectedInspectPage + 1})
                </div>

                <select
                  value={selectedInspectPage}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedInspectPage(idx);
                    refreshInspectedElements(idx);
                  }}
                  style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "6px", background: "var(--bg-surface-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-medium)", fontWeight: 700 }}
                >
                  {pagesHtml.map((_, pIdx) => (
                    <option key={pIdx} value={pIdx}>
                      Page {pIdx + 1}
                    </option>
                  ))}
                </select>
              </div>

              {inspectedPhotos.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", border: "1px dashed var(--border-medium)", borderRadius: "8px" }}>
                  No photos detected on Page {selectedInspectPage + 1}. You can click directly on any photo on the page to customize.
                </div>
              ) : (
                <div style={{ maxHeight: "420px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", paddingRight: "4px" }}>
                  {inspectedPhotos.map((photoItem, pIdx) => (
                    <div
                      key={photoItem.key || pIdx}
                      style={{
                        padding: "10px",
                        background: "var(--bg-surface-elevated)",
                        borderRadius: "10px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                        <div
                          onClick={() => handleOpenSwapForInspectedPhoto(photoItem, pIdx)}
                          style={{ width: "56px", height: "56px", borderRadius: "6px", overflow: "hidden", background: "#f1f5f9", flexShrink: 0, border: "1.5px solid var(--border-medium)", cursor: "pointer" }}
                          title="Click to swap this image"
                        >
                          <img src={photoItem.url} alt="Photo thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                            Photo #{pIdx + 1}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {photoItem.tag} frame
                          </div>
                        </div>
                      </div>

                      {/* Primary Swap Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenSwapForInspectedPhoto(photoItem, pIdx)}
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          padding: "6px 10px",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          boxShadow: "0 2px 8px rgba(139, 92, 246, 0.35)"
                        }}
                      >
                        <RefreshCw size={13} /> 🔄 Select &amp; Swap This Image
                      </button>

                      {/* Shape Changer */}
                      <div style={{ marginBottom: "6px" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>Frame Shape:</div>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {[
                            { id: "original", label: "Original" },
                            { id: "arch", label: "Arch" },
                            { id: "rounded", label: "Rounded" },
                            { id: "circle", label: "Circle" },
                            { id: "square", label: "Square" }
                          ].map((shp) => (
                            <button
                              key={shp.id}
                              type="button"
                              onClick={() => handleSetShape(photoItem, shp.id)}
                              style={{ padding: "3px 8px", fontSize: "0.72rem", borderRadius: "4px", background: "var(--bg-surface)", border: "1px solid var(--border-medium)", cursor: "pointer", fontWeight: 600, color: "var(--text-primary)" }}
                            >
                              {shp.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Swap with Product Variants */}
                      <div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>Swap with Product:</div>
                        <select
                          onChange={(e) => {
                            if (e.target.value !== "") handleSwapPhoto(photoItem, Number(e.target.value));
                          }}
                          style={{ width: "100%", padding: "5px 8px", fontSize: "0.78rem", borderRadius: "6px", background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-medium)" }}
                        >
                          <option value="">Select product to swap...</option>
                          {activeProducts.map((p, idx) => (
                            <option key={p._id || idx} value={idx}>
                              Item #{idx + 1}: {p.name || p.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Non-Product Photo: Upload from Computer or Paste URL */}
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Upload size={12} /> Or Use Non-Product Custom Photo:
                        </div>

                        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                          <label
                            style={{
                              flex: 1,
                              padding: "5px 8px",
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              background: "rgba(59, 130, 246, 0.1)",
                              border: "1px dashed #3b82f6",
                              cursor: "pointer",
                              color: "#38bdf8",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px"
                            }}
                          >
                            <Upload size={13} /> Upload File (Desktop/Folder)
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(photoItem, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Paste Image URL */}
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="url"
                            placeholder="Or paste Image URL (https://...)"
                            id={`custom-url-${pIdx}`}
                            style={{
                              flex: 1,
                              padding: "4px 8px",
                              fontSize: "0.74rem",
                              borderRadius: "6px",
                              background: "var(--bg-surface)",
                              color: "var(--text-primary)",
                              border: "1px solid var(--border-medium)"
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                handleApplyCustomPhoto(photoItem, e.target.value.trim());
                                e.target.value = "";
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: "0.72rem", padding: "4px 8px" }}
                            onClick={() => {
                              const inp = document.getElementById(`custom-url-${pIdx}`);
                              if (inp && inp.value.trim()) {
                                handleApplyCustomPhoto(photoItem, inp.value.trim());
                                inp.value = "";
                              }
                            }}
                          >
                            Apply
                          </button>
                        </div>

                        {/* Quick pick from gallery */}
                        {customGallery.length > 0 && (
                          <div style={{ marginTop: "6px" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: "3px" }}>Saved Custom Photos:</div>
                            <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "2px" }}>
                              {customGallery.map((gUrl, gIdx) => (
                                <div
                                  key={gIdx}
                                  onClick={() => handleApplyCustomPhoto(photoItem, gUrl)}
                                  style={{ width: "30px", height: "30px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-medium)", cursor: "pointer", flexShrink: 0 }}
                                  title="Click to apply this custom photo"
                                >
                                  <img src={gUrl} alt="custom thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADD ELEMENTS & PAGES */}
          {sidebarTab === "add-elements" && (
            <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Header with Page Target Selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <PlusCircle size={17} color="#2563eb" />
                  Add Elements &amp; Pages
                </div>

                <select
                  value={selectedInspectPage}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedInspectPage(idx);
                    refreshInspectedElements(idx);
                  }}
                  style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "6px", background: "var(--bg-surface-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-medium)", fontWeight: 700 }}
                >
                  {pagesHtml.map((_, pIdx) => (
                    <option key={pIdx} value={pIdx}>
                      Target: Page {pIdx + 1} {pIdx === 0 ? "(Cover)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* 1. Page Operations: Add New Page, Duplicate, Delete */}
              <div style={{ padding: "10px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📑 Page Management:</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Total: {pagesHtml.length} Pages</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddPage("blank")}
                    style={{ fontSize: "0.75rem", padding: "6px 8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
                  >
                    <Plus size={13} strokeWidth={2.5} /> + Blank Page
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleAddPage("showcase")}
                    style={{ fontSize: "0.75rem", padding: "6px 8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Sparkles size={13} color="#f59e0b" /> + Showcase Page
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleAddPage("gallery")}
                    style={{ fontSize: "0.75rem", padding: "6px 8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <ImageIcon size={13} color="#10b981" /> + Gallery Page
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDuplicatePage(selectedInspectPage)}
                    style={{ fontSize: "0.75rem", padding: "6px 8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                    title={`Clone Page ${selectedInspectPage + 1}`}
                  >
                    <Copy size={13} color="#8b5cf6" /> ⎘ Clone Current
                  </button>
                </div>

                {pagesHtml.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedInspectPage)}
                    style={{
                      marginTop: "2px",
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      color: "#ef4444",
                      borderRadius: "6px",
                      padding: "5px 8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    <Trash2 size={13} /> Delete Page {selectedInspectPage + 1}
                  </button>
                )}
              </div>

              {/* 2. Extra Elements to Add to Current Page */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                  ✨ Add Elements to Page {selectedInspectPage + 1}:
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Click any element to place it on the page. You can drag to move or type inline:
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                  {/* Heading */}
                  <div
                    onClick={() => handleAddElement("heading", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all var(--transition-fast)"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                        Headline (H1 Title)
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Large bold headline for section headers
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563eb", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Subheading */}
                  <div
                    onClick={() => handleAddElement("subheading", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--primary)" }}>
                        Subheading (H2 Subtitle)
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Uppercase colored tracking subtitle
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563eb", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Paragraph */}
                  <div
                    onClick={() => handleAddElement("paragraph", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                        Paragraph (Body Copy)
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Multi-line descriptive product or brand text
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563eb", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Callout Box */}
                  <div
                    onClick={() => handleAddElement("callout", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#10b981" }}>
                        Callout Box / Special Note
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Highlighted accent box with colored left border
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Price Tag Badge */}
                  <div
                    onClick={() => handleAddElement("price", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#f59e0b" }}>
                        Price Tag Pill (₹ Price / Unit)
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        High-contrast rounded pill badge for pricing
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Feature Pill */}
                  <div
                    onClick={() => handleAddElement("bullet", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#06b6d4" }}>
                        Feature Pill (✓ Key Advantage)
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Certification, finish, or warranty badge
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(6,182,212,0.1)", color: "#06b6d4", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Photo Frame */}
                  <div
                    onClick={() => handleAddElement("photo", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#8b5cf6" }}>
                        Photo / Image Frame
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Drop-in photo container (swap via upload or drag)
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div
                    onClick={() => handleAddElement("divider", selectedInspectPage)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="add-element-card"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-primary)" }}>
                        Divider Rule Line
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        Sleek horizontal divider rule
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563eb", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      + Add
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REAL ASSET BANK (101 Images) */}
          {sidebarTab === "assets" && (
            <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FolderOpen size={17} color="#8b5cf6" />
                    Specialty Photo Bank
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    101 High-Res Images (Garlic, Kota Stone, Kota Doria, Sandstone)
                  </div>
                </div>

                <select
                  value={selectedInspectPage}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedInspectPage(idx);
                    refreshInspectedElements(idx);
                  }}
                  style={{ padding: "4px 8px", fontSize: "0.78rem", borderRadius: "6px", background: "var(--bg-surface-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-medium)", fontWeight: 700 }}
                >
                  {pagesHtml.map((_, pIdx) => (
                    <option key={pIdx} value={pIdx}>
                      Target: Page {pIdx + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `All (${GARLIC_ASSETS.length + KOTA_STONE_ASSETS.length + KOTA_DORIA_ASSETS.length + SAND_STONE_ASSETS.length})` },
                  { key: "garlic", label: `🧄 Garlic (${GARLIC_ASSETS.length})` },
                  { key: "kotastone", label: `🏛️ Kota Stone (${KOTA_STONE_ASSETS.length})` },
                  { key: "kotadoria", label: `🥻 Kota Doria (${KOTA_DORIA_ASSETS.length})` },
                  { key: "sandstone", label: `🏜️ Sand Stone (${SAND_STONE_ASSETS.length})` }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setAssetTab(tab.key)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.72rem",
                      borderRadius: "6px",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid",
                      background: assetTab === tab.key ? "#8b5cf6" : "var(--bg-surface-elevated)",
                      color: assetTab === tab.key ? "#ffffff" : "var(--text-primary)",
                      borderColor: assetTab === tab.key ? "#8b5cf6" : "var(--border-medium)"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Filter Box */}
              <div>
                <input
                  type="text"
                  placeholder="Search photos (e.g. blue, bagru, mirror, tile)..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    fontSize: "0.78rem",
                    borderRadius: "6px",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-medium)",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Image Grid */}
              <div style={{ maxHeight: "460px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", paddingRight: "4px" }}>
                {filteredAssets.map((asset, aIdx) => (
                  <div
                    key={aIdx}
                    style={{
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                    }}
                  >
                    <div style={{ width: "100%", height: "95px", position: "relative", background: "#0f172a", overflow: "hidden" }}>
                      <img
                        src={asset.url}
                        alt={asset.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: "4px", flex: 1, justifyContent: "space-between" }}>
                      <div
                        style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        title={asset.title}
                      >
                        {asset.title}
                      </div>

                      <div style={{ display: "flex", gap: "3px", marginTop: "2px" }}>
                        <button
                          type="button"
                          onClick={() => handleInsertAssetPhoto(asset.url, selectedInspectPage)}
                          style={{
                            flex: 1,
                            padding: "3px 4px",
                            fontSize: "0.68rem",
                            borderRadius: "4px",
                            background: "rgba(37,99,235,0.1)",
                            color: "#2563eb",
                            border: "1px solid rgba(37,99,235,0.3)",
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                          title={`Insert photo frame with this image onto Page ${selectedInspectPage + 1}`}
                        >
                          + Insert
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyAssetImage(asset.url)}
                          style={{
                            flex: 1,
                            padding: "3px 4px",
                            fontSize: "0.68rem",
                            borderRadius: "4px",
                            background: "rgba(16,185,129,0.1)",
                            color: "#10b981",
                            border: "1px solid rgba(16,185,129,0.3)",
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                          title="Apply this image to the current page's photo slot"
                        >
                          Swap
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DRAG & DROP STUDIO */}
          {sidebarTab === "drag-drop" && (
            <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Layers size={17} color="#10b981" />
                  Drag &amp; Drop Control Center
                </div>
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "99px", fontWeight: 700 }}>
                  Active &amp; Live
                </span>
              </div>

              {/* Feature Instructions Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.78rem" }}>
                <div style={{ padding: "8px 10px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "#38bdf8" }}>1. ✢ Drag Elements on Page:</strong> Click any text block or photo. A blue <strong>✢ Drag to Move</strong> pill handle appears. Drag it anywhere on the page to reposition!
                </div>
                <div style={{ padding: "8px 10px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "#34d399" }}>2. 🖼️ Drag Photos onto Canvas:</strong> Drag any product photo card below directly onto any photo or image frame on the canvas to swap it instantly!
                </div>
                <div style={{ padding: "8px 10px", background: "var(--bg-surface-elevated)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "#fbbf24" }}>3. 📁 Desktop Image Drop:</strong> Drag any image file from your computer folder directly onto any photo placeholder on the page!
                </div>
              </div>

              {/* Draggable Product Photos Shelf */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⠿ Drag Product Photos into Canvas:</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Drag any card below and drop it onto any photo on the page:
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
                  {activeProducts.map((p, idx) => {
                    const imgUrl = (p.images && p.images[0] && (p.images[0].url || p.images[0])) || p.image || "";
                    return (
                      <div
                        key={p._id || idx}
                        draggable="true"
                        onDragStart={(e) => {
                          const payload = JSON.stringify({ type: "product-photo", index: idx, url: imgUrl });
                          e.dataTransfer.setData("application/json", payload);
                          e.dataTransfer.setData("text/plain", payload);
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        className="draggable-asset-card"
                        style={{
                          padding: "8px",
                          background: "var(--bg-surface-elevated)",
                          borderRadius: "8px",
                          border: "1px solid var(--border-medium)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px"
                        }}
                      >
                        <div style={{ position: "relative", width: "100%", height: "70px", borderRadius: "6px", overflow: "hidden", background: "#f8fafc" }}>
                          <img src={imgUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                          <div style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "2px" }}>
                            <span>⠿ Drag</span>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                          Item #{idx + 1} &bull; ₹{p.price || 0}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Non-Product Photos (Facility, Project, Showroom) */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>🎨 Non-Product Custom Photos:</span>
                  <label style={{ fontSize: "0.72rem", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontWeight: 700, background: "rgba(56, 189, 248, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                    <Upload size={11} /> + Upload New
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (rev) => {
                            const nu = [rev.target.result, ...customGallery.slice(0, 19)];
                            setCustomGallery(nu);
                            try { localStorage.setItem("catalogue_custom_gallery", JSON.stringify(nu)); } catch (_) { }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Drag any custom photo below onto any frame on the canvas:
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {customGallery.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      draggable="true"
                      onDragStart={(e) => {
                        const payload = JSON.stringify({ type: "product-photo", index: null, url: imgUrl });
                        e.dataTransfer.setData("application/json", payload);
                        e.dataTransfer.setData("text/plain", payload);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      className="draggable-asset-card"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "60px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid var(--border-medium)",
                        background: "#1e293b"
                      }}
                      title="Drag onto any photo on the page"
                    >
                      <img src={imgUrl} alt="custom" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: "2px", right: "2px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.55rem", padding: "1px 4px", borderRadius: "3px" }}>
                        ⠿ Drag
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drag to Reorder Pages Tray */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📑 Drag to Reorder Pages ({pagesHtml.length} pages):</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Drag any page chip and drop it over another page to rearrange:
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {pagesHtml.map((_, pIdx) => (
                    <div
                      key={pIdx}
                      draggable="true"
                      onDragStart={(e) => {
                        setDraggedPageIdx(pIdx);
                        e.dataTransfer.setData("text/plain", String(pIdx));
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverPageIdx(pIdx);
                      }}
                      onDragLeave={() => {
                        if (dragOverPageIdx === pIdx) setDragOverPageIdx(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverPageIdx(null);
                        const from = draggedPageIdx !== null ? draggedPageIdx : Number(e.dataTransfer.getData("text/plain"));
                        if (from !== undefined && !isNaN(from)) {
                          handleReorderPages(from, pIdx);
                        }
                        setDraggedPageIdx(null);
                      }}
                      className={`page-reorder-chip ${dragOverPageIdx === pIdx ? "drag-over" : ""}`}
                      style={{
                        padding: "6px 10px",
                        background: dragOverPageIdx === pIdx ? "rgba(16, 185, 129, 0.2)" : "var(--bg-surface-elevated)",
                        borderRadius: "8px",
                        border: `1px solid ${dragOverPageIdx === pIdx ? "#10b981" : "var(--border-medium)"}`,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>⠿</span> Page {pIdx + 1} {pIdx === 0 ? "(Cover)" : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATES & HARMONIOUS COLOR PALETTES */}
          {sidebarTab === "templates" && (
            <>
              {/* CATEGORY & TEMPLATE PICKER */}
              <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Layers size={17} color="var(--primary)" />
                    {activeCategory ? (
                      <span>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(null)}
                          style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 700, padding: 0, textDecoration: "underline", marginRight: "4px" }}
                        >
                          Categories
                        </button>
                        / {categoryGroups.find(g => g.key === activeCategory)?.title}
                      </span>
                    ) : (
                      <span>{TEMPLATE_REGISTRY.length} Dynamic Specialty Templates</span>
                    )}
                  </div>
                  {activeCategory && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveCategory(null)}
                      style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                    >
                      <ArrowLeft size={12} /> All Categories
                    </button>
                  )}
                </div>

                {/* Category Cards View */}
                {!activeCategory ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {categoryGroups.map((group) => {
                      const isActive = currentCategoryObj?.key === group.key;
                      return (
                        <div
                          key={group.key}
                          onClick={() => setActiveCategory(group.key)}
                          style={{
                            padding: "0.85rem 1rem",
                            borderRadius: "10px",
                            background: isActive ? "rgba(59, 130, 246, 0.12)" : "var(--bg-surface-elevated)",
                            border: isActive ? "2px solid #3b82f6" : "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            transition: "all var(--transition-fast)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                              {group.title}
                            </div>
                            <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                              {group.desc}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 700, marginTop: "4px" }}>
                              {group.items.length} Layouts Available
                            </div>
                          </div>
                          <ChevronRight size={18} color="var(--text-secondary)" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Subcategory Templates List */
                  <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "4px" }}>
                    {categoryGroups.find(g => g.key === activeCategory)?.items.map((tmpl) => {
                      const isSelected = selectedUid === tmpl.uid;
                      return (
                        <div
                          key={tmpl.uid}
                          onClick={() => setSelectedUid(tmpl.uid)}
                          style={{
                            padding: "0.75rem 0.9rem",
                            borderRadius: "8px",
                            background: isSelected ? "var(--primary-light)" : "var(--bg-surface-elevated)",
                            border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            transition: "all var(--transition-fast)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div style={{ flex: 1, marginRight: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 800, fontSize: "0.86rem", color: isSelected ? "var(--primary)" : "var(--text-primary)" }}>
                                {tmpl.title}
                              </span>
                              {tmpl.badge && (
                                <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: isSelected ? "var(--primary)" : "rgba(59, 130, 246, 0.12)", color: isSelected ? "#fff" : "var(--primary)", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                  {tmpl.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                              {tmpl.desc || "A4 Full Spread Catalogue Layout"}
                            </div>
                          </div>
                          {isSelected && <CheckCircle size={16} color="var(--primary)" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PALETTE / COLOR RE-THEMER */}
              <div className="card" style={{ padding: "1.1rem", background: "var(--bg-surface)", border: "1px solid var(--border-medium)" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.75rem" }}>
                  <Palette size={17} color="var(--primary)" />
                  Harmonious Color Palettes
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                  {PRESET_SWATCHES.map((swatch) => {
                    const isSelected = colorOverride === swatch.color;
                    return (
                      <button
                        key={swatch.label}
                        type="button"
                        onClick={() => setColorOverride(swatch.color)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 4px",
                          borderRadius: "8px",
                          background: isSelected ? "var(--bg-surface-elevated)" : "transparent",
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                          cursor: "pointer"
                        }}
                      >
                        <span
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: swatch.color || "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                            border: "1px solid rgba(0,0,0,0.2)",
                            display: "block"
                          }}
                        />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-primary)", textAlign: "center" }}>
                          {swatch.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>Custom Color:</span>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setColorOverride(e.target.value);
                    }}
                    style={{ width: "32px", height: "30px", padding: 0, border: "none", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 700 }}>
                    {colorOverride || "Preset"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Live Scaled Preview & In-Place Editor Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }} ref={containerRef}>

          {/* Zoom and Preview Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-surface)",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-medium)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)" }}>
                📄 Multi-Page Preview ({pagesHtml.length} A4 Pages)
              </span>
              <span style={{ fontSize: "0.74rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(59, 130, 246, 0.15)", color: "#38bdf8", fontWeight: 700 }}>
                💡 Click ANY text to type inline
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Zoom:</span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPreviewScale(s => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                style={{ padding: "2px 7px", fontSize: "0.75rem" }}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)", minWidth: "40px", textAlign: "center" }}>
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPreviewScale(s => Math.min(1.4, Number((s + 0.1).toFixed(2))))}
                style={{ padding: "2px 7px", fontSize: "0.75rem" }}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPreviewScale(0.8)}
                style={{ padding: "2px 7px", fontSize: "0.75rem" }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick Page Reorder & Management Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-surface)",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border-medium)",
              overflowX: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              📑 Pages ({pagesHtml.length}):
            </span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {pagesHtml.map((_, pIdx) => (
                <div
                  key={pIdx}
                  draggable="true"
                  onDragStart={(e) => {
                    setDraggedPageIdx(pIdx);
                    e.dataTransfer.setData("text/plain", String(pIdx));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverPageIdx(pIdx);
                  }}
                  onDragLeave={() => {
                    if (dragOverPageIdx === pIdx) setDragOverPageIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverPageIdx(null);
                    const from = draggedPageIdx !== null ? draggedPageIdx : Number(e.dataTransfer.getData("text/plain"));
                    if (from !== undefined && !isNaN(from)) {
                      handleReorderPages(from, pIdx);
                    }
                    setDraggedPageIdx(null);
                  }}
                  onClick={() => {
                    setSelectedInspectPage(pIdx);
                    refreshInspectedElements(pIdx);
                    const host = previewHostRef.current;
                    if (host) {
                      const cards = host.querySelectorAll(".pvpage");
                      if (cards[pIdx]) cards[pIdx].scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  className={`page-reorder-chip ${dragOverPageIdx === pIdx ? "drag-over" : ""}`}
                  style={{
                    padding: "4px 8px",
                    background: selectedInspectPage === pIdx ? "var(--primary-light, rgba(37,99,235,0.12))" : (dragOverPageIdx === pIdx ? "rgba(16, 185, 129, 0.25)" : "var(--bg-surface-elevated)"),
                    borderRadius: "6px",
                    border: `1.5px solid ${selectedInspectPage === pIdx ? "var(--primary, #2563eb)" : (dragOverPageIdx === pIdx ? "#10b981" : "var(--border-subtle)")}`,
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }}
                  title="Click to view & edit, or drag to reorder"
                >
                  <span style={{ color: "#94a3b8" }}>⠿</span> Page {pIdx + 1}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicatePage(pIdx);
                    }}
                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "1px 2px", display: "inline-flex", alignItems: "center" }}
                    title="Duplicate this page"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(pIdx);
                    }}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "1px 2px", display: "inline-flex", alignItems: "center" }}
                    title="Delete this page"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Page Buttons */}
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => handleAddPage("blank")}
                style={{ fontSize: "0.74rem", padding: "4px 10px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
                title="Add a blank A4 canvas page"
              >
                <Plus size={13} strokeWidth={3} /> Add Page
              </button>
            </div>
          </div>

          {/* Actual Scaled A4 Multi-Page Container */}
          <div className="dyn-preview-container">
            <div id="pageInfo" style={{ display: "none" }} />
            <div className="dyn-preview-scaler">
              <div id="previewHost" ref={previewHostRef} />
            </div>
          </div>
        </div>
      </div>

      {/* LOAD SAVED DESIGN FROM MONGODB MODAL */}
      {isLoadModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsLoadModalOpen(false)}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "auto",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Database size={20} color="var(--primary)" /> Saved Designs ({savedRecords.length})
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsLoadModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {isLoadingRecords ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                Loading saved designs...
              </div>
            ) : savedRecords.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", border: "1px dashed var(--border-medium)", borderRadius: "10px" }}>
                No saved catalogue designs found yet. Click "Save" to store your customized designs!
              </div>
            ) : (
              <div style={{ maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {savedRecords.map((rec) => (
                  <div
                    key={rec._id}
                    onClick={() => handleSelectRecord(rec)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {rec.ent_name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Layout: <strong style={{ color: "var(--primary)" }}>{rec.template_uid}</strong> • {rec.district} • {new Date(rec.updatedAt || rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                        onClick={() => handleSelectRecord(rec)}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: "#ef4444", borderColor: "#f87171", padding: "4px 8px" }}
                        onClick={(e) => handleDeleteRecord(e, rec._id)}
                        title="Delete from MongoDB"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE IMAGE SWAP MODAL */}
      {isSwapModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsSwapModalOpen(false)}>
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "860px",
              margin: "auto",
              background: "var(--bg-surface)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1.5px solid var(--border-medium)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", boxShadow: "0 4px 12px rgba(109, 40, 217, 0.4)" }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)" }}>
                    Select &amp; Swap Image
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    {swapModalTarget?.label || `Page ${selectedInspectPage + 1} Image Frame`} • Click any photo below to swap instantly
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsSwapModalOpen(false)}
                style={{ padding: "4px 8px" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Target Comparison Strip */}
            {swapModalTarget?.url && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-surface-elevated)", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", border: "1.5px solid var(--border-medium)", flexShrink: 0 }}>
                  <img src={swapModalTarget.url} alt="Current" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Current Active Image</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {swapModalTarget.url.split("/").pop()}
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "6px", background: "rgba(139, 92, 246, 0.12)", color: "#a78bfa", fontWeight: 700 }}>
                  Click any image below to swap ⬇
                </span>
              </div>
            )}

            {/* Category Filter Pills & Search */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {[
                  { key: "sandstone", label: `🏜️ Sand Stone (${SAND_STONE_ASSETS.length})` },
                  { key: "all", label: `All 101 (${SAND_STONE_ASSETS.length + KOTA_STONE_ASSETS.length + KOTA_DORIA_ASSETS.length + GARLIC_ASSETS.length})` },
                  { key: "kotastone", label: `🏛️ Kota Stone (${KOTA_STONE_ASSETS.length})` },
                  { key: "kotadoria", label: `🥻 Kota Doria (${KOTA_DORIA_ASSETS.length})` },
                  { key: "garlic", label: `🧄 Garlic (${GARLIC_ASSETS.length})` },
                  { key: "products", label: `📦 Catalogue Products (${activeProducts.length})` },
                  { key: "upload", label: "📁 Upload / URL" }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSwapModalCategory(tab.key)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "0.75rem",
                      borderRadius: "7px",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid",
                      background: swapModalCategory === tab.key ? "#8b5cf6" : "var(--bg-surface-elevated)",
                      color: swapModalCategory === tab.key ? "#ffffff" : "var(--text-primary)",
                      borderColor: swapModalCategory === tab.key ? "#8b5cf6" : "var(--border-medium)"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {swapModalCategory !== "upload" && (
                <input
                  type="text"
                  placeholder="Search images..."
                  value={swapModalSearch}
                  onChange={(e) => setSwapModalSearch(e.target.value)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "0.78rem",
                    borderRadius: "7px",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-medium)",
                    width: "180px"
                  }}
                />
              )}
            </div>

            {/* Modal Body: Upload Tab vs Image Grid */}
            {swapModalCategory === "upload" ? (
              <div style={{ padding: "1.5rem", background: "var(--bg-surface-elevated)", borderRadius: "12px", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "6px" }}>
                    1. Upload an Image File from your Computer
                  </div>
                  <label
                    style={{
                      padding: "16px",
                      border: "2px dashed #8b5cf6",
                      borderRadius: "10px",
                      background: "rgba(139, 92, 246, 0.05)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      textAlign: "center"
                    }}
                  >
                    <Upload size={24} color="#8b5cf6" />
                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#8b5cf6" }}>Click to browse image files (PNG, JPG, WEBP)</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Selected file will immediately replace the targeted image</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            handleExecutePhotoSwap(re.target.result);
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "6px" }}>
                    2. Or Paste an Online Image Web URL
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={customPhotoUrlInput}
                      onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                      style={{ flex: 1, padding: "8px 12px", fontSize: "0.82rem", borderRadius: "8px", background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-medium)" }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (customPhotoUrlInput.trim()) {
                          handleExecutePhotoSwap(customPhotoUrlInput.trim());
                        }
                      }}
                      style={{ fontWeight: 700, padding: "8px 16px", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "10px",
                  maxHeight: "460px",
                  overflowY: "auto",
                  paddingRight: "6px"
                }}
              >
                {swapModalImages.map((asset, idx) => (
                  <div
                    key={asset.url || idx}
                    onClick={() => handleExecutePhotoSwap(asset.url)}
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "var(--bg-surface-elevated)",
                      border: "1.5px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "all 0.15s ease",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                    }}
                    className="swap-thumb-card"
                    title={`Click to swap with: ${asset.title}`}
                  >
                    <div style={{ width: "100%", height: "105px", overflow: "hidden", background: "#0f172a", position: "relative" }}>
                      <img
                        src={asset.url}
                        alt={asset.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      <div className="swap-hover-overlay">
                        <span>Click to Swap</span>
                      </div>
                    </div>
                    <div style={{ padding: "6px 8px", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", background: "var(--bg-surface-elevated)" }}>
                      {asset.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
