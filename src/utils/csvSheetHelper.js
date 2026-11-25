/**
 * csvSheetHelper.js
 * Zero-dependency, pure-JavaScript CSV & Spreadsheet processing engine
 * for Product Category Data Banks and Bulk Product Catalogue Operations.
 * Fully compatible with Microsoft Excel, Google Sheets, and standard CSV.
 */

/**
 * Robust CSV Line & Field Parser
 * Handles commas, tabs, semicolons, quoted fields with internal commas/newlines, and escaped quotes ("").
 */
export function parseCsv(text) {
  if (!text || typeof text !== "string") return [];

  // Remove UTF-8 Byte Order Mark (BOM) if present
  let cleanText = text.replace(/^\uFEFF/, "");

  // Auto-detect delimiter from first line (comma, semicolon, or tab)
  const firstLine = cleanText.split(/\r\n|\n|\r/)[0] || "";
  let delimiter = ",";
  if (!firstLine.includes(",") && firstLine.includes(";")) delimiter = ";";
  else if (!firstLine.includes(",") && firstLine.includes("\t")) delimiter = "\t";

  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < cleanText.length) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = "";
        i++;
        continue;
      } else if (char === "\r" || char === "\n") {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentField.trim());
        // Only push row if it contains at least one non-empty value
        if (currentRow.some((val) => val !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push last field & row if leftover
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((val) => val !== "")) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // Find first row that contains headers (skip leading empty rows or full-row comments)
  let headerRowIndex = 0;
  while (
    headerRowIndex < rows.length &&
    (rows[headerRowIndex].length === 0 ||
      (rows[headerRowIndex][0] &&
        (rows[headerRowIndex][0].startsWith("#") ||
          rows[headerRowIndex][0].startsWith("=") ||
          rows[headerRowIndex][0].startsWith("-"))))
  ) {
    headerRowIndex++;
  }

  if (headerRowIndex >= rows.length) return [];

  // Header row normalized (handles spaces, slashes, parens, currency symbols)
  const headers = rows[headerRowIndex].map((h) =>
    h
      .toLowerCase()
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/[\s\-_/()₹.]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );

  const parsedObjects = [];
  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    headers.forEach((hdr, idx) => {
      obj[hdr] = row[idx] !== undefined ? row[idx] : "";
    });
    parsedObjects.push(obj);
  }

  return parsedObjects;
}

/**
 * Escapes a cell value for safe CSV output.
 */
function escapeCsvCell(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r") || str.includes(";")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Downloads text as a CSV file in the browser with UTF-8 BOM so Excel opens Hindi, ₹, and accented chars properly.
 */
export function downloadCsvFile(filename, csvContent) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 1. CATEGORY DATA BANK (SPECIFICATIONS, PRESETS & COPY) CSV ENGINE
// ============================================================================

/**
 * Generates ready-to-fill CSV template tailored specifically to each ODOP category family.
 */
export function generateCategoryDataBankTemplate(family = "general", currencySymbol = "₹") {
  const sym = currencySymbol || "₹";

  const headers = [
    "Category Section",
    "Specification / Item Title",
    "Short Tag (Button)",
    "Selling Rate (₹)",
    "MRP (₹)",
    "Price Range",
    "Sub-Group / Type",
    "Detailed Description & Marketing Notes",
  ];

  let rows = [];

  if (family === "garlic") {
    rows = [
      ["=== 1. PRODUCE GRADING & MANDI SELLING RATES ===", "", "", "", "", "", "", ""],
      ["Rate Preset", "50 - 65 mm (Grade A+ Large Bulbs)", "50-65mm A+", "220", "280", `${sym}200 – ${sym}260 / kg`, "Grading Preset", "Primary export-grade bulb caliber with large uniform cloves"],
      ["Rate Preset", "40 - 50 mm (Grade A Medium Bulbs)", "40-50mm A", "180", "230", `${sym}160 – ${sym}210 / kg`, "Grading Preset", "Standard commercial grade for retail packs and culinary use"],
      ["Rate Preset", "30 - 40 mm (Grade B Small Bulbs)", "30-40mm B", "140", "180", `${sym}120 – ${sym}160 / kg`, "Grading Preset", "Economy processing caliber ideal for paste, flake, and powder dehydration"],
      ["Rate Preset", "Special Large Bulb (> 65 mm Extra Jumbo)", ">65mm Jumbo", "260", "330", `${sym}240 – ${sym}310 / kg`, "Grading Preset", "Ultra-premium exhibition jumbo grade for selective export consignments"],
      ["=== 2. BULB CALIBERS & SIZING DIMENSIONS ===", "", "", "", "", "", "", ""],
      ["Size", "50 - 65 mm (Grade A+ Large)", "50-65mm A+", "", "", "", "Sizing", "Bulb caliber 50-65 mm"],
      ["Size", "40 - 50 mm (Grade A Medium)", "40-50mm A", "", "", "", "Sizing", "Bulb caliber 40-50 mm"],
      ["Size", "30 - 40 mm (Grade B Goli/Small)", "30-40mm B", "", "", "", "Sizing", "Bulb caliber 30-40 mm"],
      ["=== 3. CURING STANDARDS & SKIN FINISHES ===", "", "", "", "", "", "", ""],
      ["Finish", "Sun-Cured Export Clean White Skin", "Sun-Cured White", "", "", "", "Finish", "100% naturally solar-cured with intact outer protective sheath"],
      ["Finish", "Natural Pinkish-White Clove Skin", "Pinkish-White", "", "", "", "Finish", "High bioactive pigment with traditional farm finish"],
      ["Finish", "Fully Root-Trimmed & Stem-Dressed (Export Quality)", "Stem-Dressed", "", "", "", "Finish", "Machine-dressed with clean-cut roots and uniform stem trimming"],
      ["=== 4. CULTIVARS & AGRO QUALITY STANDARDS ===", "", "", "", "", "", "", ""],
      ["Material", "100% Organically Grown Malwa Garlic", "Organically Grown", "", "", "", "Cultivar", "Organically cultivated in high-mineral black basalt soil"],
      ["Material", "Moisture < 65%, High Natural Allicin Content", "Moisture <65%", "", "", "", "Agro Standard", "Laboratory verified moisture content below 65% for long transit life"],
      ["=== 5. COMMERCIAL APPLICATIONS & USES ===", "", "", "", "", "", "", ""],
      ["Application", "Commercial Culinary & Food Processing", "Culinary & Processing", "", "", "", "Application", "Ideal for hotels, packaged foods, and seasoning mixes"],
      ["Application", "Bulk Mandi Wholesale & Export Consignments", "Export Wholesale", "", "", "", "Application", "Sea-freight and reefer container export certified"],
      ["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""],
      ["Heading", "Malwa Sun-Cured Pure Desi White Garlic", "", "", "", "", "Cover / Title", "Signature hero title for catalogue covers"],
      ["Heading", "Export Grade Bulb Caliber & Mandi Sorting", "", "", "", "", "Section Title", "Section headline for sorting standards"],
      ["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""],
      ["Tagline", "High-Allicin Pungency • Farm-Fresh Solar Cured • Export Certified", "", "", "", "", "Tagline", "Catalogue banner tagline"],
      ["=== 8. HARVEST & ORIGIN STORIES ===", "", "", "", "", "", "", ""],
      ["Story", "Malwa Black Basalt Soil & Bioactive Allicin", "", "", "", "", "Harvest Story", "Our garlic is harvested across the mineral-rich Malwa plateau, cured under direct sun to preserve its high bioactive allicin concentration."],
      ["=== 9. KEY SELLING BULLET POINTS ===", "", "", "", "", "", "", ""],
      ["Highlight", "Certified high natural allicin concentration (> 4.5 mg/g) delivering unmatched therapeutic pungency", "", "", "", "", "Feature Highlight", "Key selling bullet point"],
    ];
  } else if (family === "kotastone") {
    rows = [
      ["=== 1. STONE THICKNESS & QUARRY RATE PRESETS ===", "", "", "", "", "", "", ""],
      ["Rate Preset", "20 - 25 mm Gauged (Standard Flooring)", "20-25mm Gauged", "65", "95", `${sym}55 – ${sym}85 / sq.ft`, "Thickness Preset", "Diamond calibrated thickness for uniform interior & exterior flooring"],
      ["Rate Preset", "25 - 30 mm Calibrated (Heavy Traffic)", "25-30mm Heavy", "85", "120", `${sym}75 – ${sym}110 / sq.ft`, "Thickness Preset", "Heavy-duty commercial thickness for concourses, railway stations, and hospitals"],
      ["Rate Preset", "15 - 18 mm Precision Sawn (Wall Cladding)", "15-18mm Cladding", "70", "105", `${sym}60 – ${sym}95 / sq.ft`, "Thickness Preset", "Lightweight calibrated sawn stone for vertical facades and wall linings"],
      ["Rate Preset", "30 - 40 mm Quarry Slabs (Rough Paving)", "30-40mm Paving", "95", "135", `${sym}85 – ${sym}125 / sq.ft`, "Thickness Preset", "Heavy landscaping and driveway pavers with high compressive load resistance"],
      ["=== 2. TILE PLAN SIZES & SLAB DIMENSIONS ===", "", "", "", "", "", "", ""],
      ["Size", "2×2 ft (600×600 mm) Square Tile", "600×600 mm", "", "", "", "Dimensions", "Standard modular flooring tile"],
      ["Size", "2×1 ft (600×300 mm) Rectangular Tile", "600×300 mm", "", "", "", "Dimensions", "Corridor and staircase border tile"],
      ["Size", "18×18 in (450×450 mm)", "450×450 mm", "", "", "", "Dimensions", "Residential balcony and terrace format"],
      ["=== 3. SURFACE FINISHES & EDGE TREATMENTS ===", "", "", "", "", "", "", ""],
      ["Finish", "Mirror High Polish (Factory Finished)", "Mirror Polish", "", "", "", "Surface Finish", "Ultra-smooth reflection with deep greenish-blue sheen"],
      ["Finish", "Honed Smooth Satin Finish", "Honed Satin", "", "", "", "Surface Finish", "Low-sheen tactile matte finish for contemporary interiors"],
      ["Finish", "Natural Split Cleft Texture (Anti-Skid)", "Natural Split", "", "", "", "Surface Finish", "Naturally cleft non-slip surface for wet areas and patios"],
      ["=== 4. LIMESTONE GEOLOGICAL FORMATIONS & FORMULATIONS ===", "", "", "", "", "", "", ""],
      ["Material", "Natural Indurated Limestone (Kota Blue/Green)", "Limestone", "", "", "", "Material", "High density dolomitic limestone with compressive strength > 140 MPa"],
      ["=== 5. COMMERCIAL APPLICATIONS & USES ===", "", "", "", "", "", "", ""],
      ["Application", "Commercial Corridors, Hospitals & Public Spaces", "Heavy Commercial", "", "", "", "Application", "Withstands million-footfall wear without erosion or pitting"],
      ["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""],
      ["Heading", "Royal Kota Blue Limestone Architectural Slabs", "", "", "", "", "Cover / Title", "Catalogue hero heading"],
      ["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""],
      ["Tagline", "Zero Porosity • Naturally Cool Underfoot • Abrasion Resistant", "", "", "", "", "Tagline", "Banner tagline"],
      ["=== 8. QUARRY HERITAGE & ORIGIN STORIES ===", "", "", "", "", "", "", ""],
      ["Story", "Ramganj Mandi & Suket Basin Provenance", "", "", "", "", "Quarry Heritage", "Quarried directly from the Suket and Ramganj Mandi geological basins, our Kota Stone offers proven durability tested across century-old Indian estates."],
      ["=== 9. TECHNICAL STRENGTH HIGHLIGHTS ===", "", "", "", "", "", "", ""],
      ["Highlight", "Ultra-low water absorption (< 0.45%) preventing moss accumulation and subfloor dampness", "", "", "", "", "Feature Highlight", "Core technical advantage"],
    ];
  } else if (family === "sandstone") {
    rows = [
      ["=== 1. CALIBRATED THICKNESS & SAWN RATE PRESETS ===", "", "", "", "", "", "", ""],
      ["Rate Preset", "25 - 30 mm Calibrated Sawn", "25-30mm Sawn", "145", "195", `${sym}130 – ${sym}185 / sq.ft`, "Thickness Preset", "Machine sawn architectural cladding thickness"],
      ["Rate Preset", "35 - 40 mm Hand-Chiseled Pavers", "35-40mm Chiseled", "165", "225", `${sym}150 – ${sym}210 / sq.ft`, "Thickness Preset", "Exterior driveway and courtyard load-bearing stone"],
      ["Rate Preset", "50 - 75 mm Carved Jali & Facade Screens", "50-75mm Jali", "320", "450", `${sym}280 – ${sym}420 / sq.ft`, "Thickness Preset", "Intricate CNC and hand-carved heritage perforated screens"],
      ["=== 2. ARCHITECTURAL SIZES & PAVING DIMENSIONS ===", "", "", "", "", "", "", ""],
      ["Size", "2×3 ft (600×900 mm) Architectural Cladding", "600×900 mm", "", "", "", "Dimensions", "Large format facade slabs"],
      ["Size", "1×2 ft (300×600 mm) Exterior Paver", "300×600 mm", "", "", "", "Dimensions", "Interlocking pathway paver"],
      ["=== 3. SURFACE FINISHES & ARTISANAL TREATMENTS ===", "", "", "", "", "", "", ""],
      ["Finish", "Sandblasted Uniform Textured Surface", "Sandblasted", "", "", "", "Surface Finish", "Non-slip weather-resistant matte exterior texture"],
      ["Finish", "Hand-Chiseled Rockface Heritage Border", "Hand-Chiseled", "", "", "", "Surface Finish", "Traditional Rajasthani stone artisan chisel finish"],
      ["=== 4. QUARTZITE COMPOSITIONS & SPECIFICATIONS ===", "", "", "", "", "", "", ""],
      ["Material", "Fine-Grained Quartzite Sandstone (Dholpur / Bundi)", "Quartzite", "", "", "", "Material", "Silica-cemented quartz sandstone impervious to acid rain and frost"],
      ["=== 5. PROJECT APPLICATIONS & USES ===", "", "", "", "", "", "", ""],
      ["Application", "Exterior Facades, Heritage Palaces & Boundary Walls", "Exterior Facade", "", "", "", "Application", "Centuries of weather durability in harsh climates"],
      ["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""],
      ["Heading", "Imperial Hand-Crafted Rajasthani Sandstone", "", "", "", "", "Cover / Title", "Catalogue title"],
      ["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""],
      ["Tagline", "Monolithic Strength • Thermal Insulation • Artisanal Jali Craft", "", "", "", "", "Tagline", "Subtitle"],
      ["=== 8. HERITAGE & QUARRY STORIES ===", "", "", "", "", "", "", ""],
      ["Story", "The Artisans of Bundi & Dholpur Quarries", "", "", "", "", "Quarry Heritage", "Formed over millions of years, our sandstone provides natural thermal insulation and withstands harsh freeze-thaw cycles without surface spalling."],
      ["=== 9. ARCHITECTURAL ADVANTAGE HIGHLIGHTS ===", "", "", "", "", "", "", ""],
      ["Highlight", "High compressive strength (> 110 MPa) with exceptional weather durability across all seasons", "", "", "", "", "Feature Highlight", "Core technical advantage"],
    ];
  } else if (family === "kotadoria") {
    rows = [
      ["=== 1. FABRIC LENGTH & WEAVE RATE PRESETS ===", "", "", "", "", "", "", ""],
      ["Rate Preset", "6.5 Metres (5.5m Saree + 0.8m Blouse Piece)", "6.5m Saree", "3200", "4800", `${sym}2,600 – ${sym}6,500`, "Length Preset", "Standard bridal & boutique saree length with running blouse"],
      ["Rate Preset", "2.5 Metres Luxury Dupatta (Silk-Cotton)", "2.5m Dupatta", "1450", "2200", `${sym}1,200 – ${sym}2,800`, "Length Preset", "Gossamer handloom drape with gold zari border"],
      ["Rate Preset", "5.0 Metres 3-Piece Unstitched Suit Ensemble", "5.0m Suit", "2800", "4200", `${sym}2,400 – ${sym}5,500`, "Length Preset", "Complete artisan handloom suit fabric (Kurta, Salwar & Dupatta)"],
      ["=== 2. YARDAGE DIMENSIONS & DRAPE SIZES ===", "", "", "", "", "", "", ""],
      ["Size", "6.5 Metres (includes 80cm Running Blouse Piece)", "6.5m Saree", "", "", "", "Yardage", "Full traditional saree length"],
      ["Size", "2.5 Metres (Width 36 inches / 90 cm)", "2.5m Dupatta", "", "", "", "Yardage", "Drape length"],
      ["=== 3. ZARI WEAVE & NATURAL PRINT FINISHES ===", "", "", "", "", "", "", ""],
      ["Finish", "Tested Electro-Gold Zari on 300+ Square Khat Grid", "Gold Zari Khat", "", "", "", "Finishing", "Authentic gold-plated metallic thread interlocking"],
      ["Finish", "Traditional Bagru / Sanganeri Natural Hand-Block Print", "Block Printed", "", "", "", "Finishing", "Plant-based vegetable dye artisan motifs"],
      ["Finish", "Pure Silver Zari (Chandi Zari) Weft Border", "Silver Zari", "", "", "", "Finishing", "Lustrous silver metallic weave"],
      ["=== 4. YARN COMPOSITION & SILK-COTTON RATIOS ===", "", "", "", "", "", "", ""],
      ["Material", "Pure Mulberry Silk Warp, Fine Cotton Weft (80s Count)", "Silk Warp Cotton Weft", "", "", "", "Yarn", "Gossamer translucent handloom textile"],
      ["Material", "100% Organic Super-Combed Cotton (120s Count)", "Combed Cotton", "", "", "", "Yarn", "Breathable feather-light summer handloom"],
      ["=== 5. ATTIRE & CEREMONIAL USES ===", "", "", "", "", "", "", ""],
      ["Application", "Bridal Ensembles, Wedding Drapes & Boutique Luxury", "Bridal & Boutique", "", "", "", "Attire", "Prestigious ceremonial drapes"],
      ["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""],
      ["Heading", "Royal Gossamer Pure Silk Zari Kota Doria Sarees", "", "", "", "", "Cover / Title", "Catalogue title"],
      ["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""],
      ["Tagline", "GI Tag Certified • 300+ Square Khat Weave • Pure Mulberry Silk", "", "", "", "", "Tagline", "Hero subtitle"],
      ["=== 8. WEAVERS GUILD & GI TAG NO. 37 STORIES ===", "", "", "", "", "", "", ""],
      ["Story", "The Kaithun Master Weavers & GI Tag No. 37", "", "", "", "", "Artisan Guild", "Woven exclusively on traditional pit looms in Kaithun by master weaver families, each piece requires 8 to 14 days of meticulous handloom craftsmanship."],
      ["=== 9. ARTISAN CRAFTSMANSHIP HIGHLIGHTS ===", "", "", "", "", "", "", ""],
      ["Highlight", "Certified authentic Geographical Indication (GI Tag No. 37) with genuine square 'khat' warp and weft grid", "", "", "", "", "Feature Highlight", "Core artisan hallmark"],
    ];
  } else {
    rows = [
      ["=== 1. PRICING & SPECIFICATION RATE PRESETS ===", "", "", "", "", "", "", ""],
      ["Rate Preset", "Standard Grade / Model A", "Grade A", "1200", "1650", `${sym}1,000 – ${sym}2,200`, "Pricing Preset", "Standard commercial specification"],
      ["Rate Preset", "Premium Grade / Model A+", "Grade A+", "1850", "2450", `${sym}1,600 – ${sym}3,000`, "Pricing Preset", "High specification enterprise benchmark"],
      ["=== 2. STANDARD PRODUCT SIZES & DIMENSIONS ===", "", "", "", "", "", "", ""],
      ["Size", "Standard Packaging Size", "Standard", "", "", "", "Dimensions", "Standard physical dimensions"],
      ["=== 3. SURFACE FINISHES & COATINGS ===", "", "", "", "", "", "", ""],
      ["Finish", "Commercial Standard Surface", "Standard Finish", "", "", "", "Finish", "High durability commercial finish"],
      ["=== 4. MATERIAL SPECIFICATIONS & COMPOSITIONS ===", "", "", "", "", "", "", ""],
      ["Material", "Industry Certified High-Grade Composition", "Certified Material", "", "", "", "Material", "Compliant with statutory quality standards"],
      ["=== 5. COMMERCIAL APPLICATIONS & USES ===", "", "", "", "", "", "", ""],
      ["Application", "Commercial, Retail & Enterprise Distribution", "Enterprise", "", "", "", "Application", "Multi-channel distribution"],
      ["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""],
      ["Heading", "Official Enterprise Product Catalogue", "", "", "", "", "Cover / Title", "Catalogue cover headline"],
      ["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""],
      ["Tagline", "Standardized Quality • Reliable Sourcing • Fast Dispatch", "", "", "", "", "Tagline", "Catalogue subtitle"],
      ["=== 8. BRAND & COMPANY STORIES ===", "", "", "", "", "", "", ""],
      ["Story", "Manufacturing Excellence & Benchmark Standards", "", "", "", "", "Brand Story", "Our products are engineered to provide maximum performance, durability, and commercial value across all sales channels."],
      ["=== 9. KEY VALUE HIGHLIGHTS ===", "", "", "", "", "", "", ""],
      ["Highlight", "Strict quality control and batch testing ensuring full marketplace compliance", "", "", "", "", "Feature Highlight", "Standard guarantee"],
    ];
  }

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Exports the company's current Data Bank as a downloadable CSV.
 * Organizes specifications, rate presets, and copy into clear, numbered section blocks.
 */
export function exportCurrentDataBankToCsv(dataBank, family = "general") {
  if (!dataBank) return "";

  const headers = [
    "Category Section",
    "Specification / Item Title",
    "Short Tag (Button)",
    "Selling Rate (₹)",
    "MRP (₹)",
    "Price Range",
    "Sub-Group / Type",
    "Detailed Description & Marketing Notes",
  ];

  const rows = [];
  const specs = dataBank.specifications || {};

  // 1. Thicknesses / Rate Presets
  const rates = specs.thicknesses || [];
  if (rates.length > 0) {
    const rateBanner =
      family === "garlic"
        ? "=== 1. PRODUCE GRADING & MANDI SELLING RATES ==="
        : family === "kotastone"
        ? "=== 1. STONE THICKNESS & QUARRY RATE PRESETS ==="
        : family === "sandstone"
        ? "=== 1. CALIBRATED THICKNESS & SAWN RATE PRESETS ==="
        : family === "kotadoria"
        ? "=== 1. FABRIC LENGTH & WEAVE RATE PRESETS ==="
        : "=== 1. PRICING & SPECIFICATION RATE PRESETS ===";
    rows.push([rateBanner, "", "", "", "", "", "", ""]);
    rates.forEach((item) => {
      rows.push([
        "Rate Preset",
        item.value || "",
        item.chipLabel || "",
        item.price || 0,
        item.mrp || 0,
        item.priceRange || "",
        "Rate & Pricing Preset",
        item.label || "",
      ]);
    });
  }

  // 2. Sizes / Calibers
  const sizes = specs.sizes || [];
  if (sizes.length > 0) {
    const sizeBanner =
      family === "garlic"
        ? "=== 2. BULB CALIBERS & SIZING DIMENSIONS ==="
        : family === "kotastone"
        ? "=== 2. TILE PLAN SIZES & SLAB DIMENSIONS ==="
        : family === "sandstone"
        ? "=== 2. ARCHITECTURAL SIZES & PAVING DIMENSIONS ==="
        : family === "kotadoria"
        ? "=== 2. YARDAGE DIMENSIONS & DRAPE SIZES ==="
        : "=== 2. PRODUCT SIZES & PHYSICAL DIMENSIONS ===";
    rows.push([sizeBanner, "", "", "", "", "", "", ""]);
    sizes.forEach((item) => {
      rows.push(["Size", item.value || "", item.chipLabel || "", "", "", "", "Sizing", item.label || ""]);
    });
  }

  // 3. Finishes / Curing
  const finishes = specs.finishes || [];
  if (finishes.length > 0) {
    const finishBanner =
      family === "garlic"
        ? "=== 3. CURING STANDARDS & SKIN FINISHES ==="
        : family === "kotastone" || family === "sandstone"
        ? "=== 3. SURFACE FINISHES & EDGE TREATMENTS ==="
        : family === "kotadoria"
        ? "=== 3. ZARI WEAVE & NATURAL PRINT FINISHES ==="
        : "=== 3. SURFACE FINISHES & TREATMENTS ===";
    rows.push([finishBanner, "", "", "", "", "", "", ""]);
    finishes.forEach((item) => {
      rows.push(["Finish", item.value || "", item.chipLabel || "", "", "", "", "Surface Finish", item.label || ""]);
    });
  }

  // 4. Materials / Cultivars
  const materials = specs.materials || [];
  if (materials.length > 0) {
    const matBanner =
      family === "garlic"
        ? "=== 4. CULTIVARS & AGRO QUALITY STANDARDS ==="
        : family === "kotastone"
        ? "=== 4. LIMESTONE GEOLOGICAL FORMATIONS & FORMULATIONS ==="
        : family === "sandstone"
        ? "=== 4. QUARTZITE COMPOSITIONS & SPECIFICATIONS ==="
        : family === "kotadoria"
        ? "=== 4. YARN COMPOSITION & SILK-COTTON RATIOS ==="
        : "=== 4. MATERIAL COMPOSITIONS & SPECIFICATIONS ===";
    rows.push([matBanner, "", "", "", "", "", "", ""]);
    materials.forEach((item) => {
      rows.push(["Material", item.value || "", item.chipLabel || "", "", "", "", "Material Standard", item.label || ""]);
    });
  }

  // 5. Applications
  const applications = specs.applications || [];
  if (applications.length > 0) {
    rows.push(["=== 5. COMMERCIAL APPLICATIONS & USES ===", "", "", "", "", "", "", ""]);
    applications.forEach((item) => {
      rows.push(["Application", item.value || "", item.chipLabel || "", "", "", "", "Application", item.label || ""]);
    });
  }

  // 6. Headings
  const headings = dataBank.headings || [];
  if (headings.length > 0) {
    rows.push(["=== 6. CATALOGUE HERO HEADLINES ===", "", "", "", "", "", "", ""]);
    headings.forEach((item) => {
      rows.push(["Heading", item.text || "", "", "", "", "", item.category || "Headline", ""]);
    });
  }

  // 7. Taglines
  const taglines = dataBank.taglines || [];
  if (taglines.length > 0) {
    rows.push(["=== 7. BANNER TAGLINES & CATCHPHRASES ===", "", "", "", "", "", "", ""]);
    taglines.forEach((item) => {
      rows.push(["Tagline", item.text || "", "", "", "", "", "Tagline", ""]);
    });
  }

  // 8. Paragraphs / Stories
  const paragraphs = dataBank.paragraphs || [];
  if (paragraphs.length > 0) {
    const storyBanner =
      family === "garlic"
        ? "=== 8. HARVEST & ORIGIN STORIES ==="
        : family === "kotastone" || family === "sandstone"
        ? "=== 8. QUARRY HERITAGE & ORIGIN STORIES ==="
        : family === "kotadoria"
        ? "=== 8. WEAVERS GUILD & GI TAG NO. 37 STORIES ==="
        : "=== 8. BRAND & COMPANY STORIES ===";
    rows.push([storyBanner, "", "", "", "", "", "", ""]);
    paragraphs.forEach((item) => {
      rows.push(["Story", item.title || "", "", "", "", "", item.category || "Story", item.text || ""]);
    });
  }

  // 9. Feature Highlights
  const featureHighlights = dataBank.featureHighlights || [];
  if (featureHighlights.length > 0) {
    rows.push(["=== 9. KEY SELLING BULLET POINTS ===", "", "", "", "", "", "", ""]);
    featureHighlights.forEach((item) => {
      rows.push(["Highlight", item.text || "", "", "", "", "", "Highlight", ""]);
    });
  }

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Parses uploaded CSV text and constructs an updated Data Bank object.
 * Supports merge mode (append new items without duplicates) or replace mode.
 * Robust against legacy headers, human-friendly headers, section banner rows, and comments.
 */
export function parseDataBankCsv(csvText, existingDataBank = null, mode = "merge") {
  const parsedRows = parseCsv(csvText);
  if (!parsedRows || parsedRows.length === 0) {
    throw new Error("Spreadsheet contains no data rows or could not be parsed.");
  }

  // Base Data Bank
  const baseBank =
    mode === "merge" && existingDataBank
      ? JSON.parse(JSON.stringify(existingDataBank))
      : {
          specifications: {
            thicknesses: [],
            sizes: [],
            finishes: [],
            materials: [],
            applications: [],
            priceRanges: [],
          },
          headings: [],
          taglines: [],
          paragraphs: [],
          featureHighlights: [],
        };

  if (!baseBank.specifications) {
    baseBank.specifications = {
      thicknesses: [],
      sizes: [],
      finishes: [],
      materials: [],
      applications: [],
      priceRanges: [],
    };
  }

  const counts = {
    thicknesses: 0,
    sizes: 0,
    finishes: 0,
    materials: 0,
    applications: 0,
    headings: 0,
    taglines: 0,
    paragraphs: 0,
    highlights: 0,
  };

  parsedRows.forEach((row, idx) => {
    // Support seeding Data Bank directly from Product Catalogue CSV sheets
    const prodName = (row.product_name || row.name || "").trim();
    if (
      prodName &&
      !prodName.startsWith("#") &&
      !row.category_section &&
      !row.specification_item_title &&
      (row.thickness_or_grade || row.size || row.finish || row.material || row.application || row.price)
    ) {
      const pPrice = Number(String(row.price || row.selling_price || 0).replace(/[^0-9.]/g, "")) || 0;
      const pMrp = Number(String(row.mrp || 0).replace(/[^0-9.]/g, "")) || (pPrice > 0 ? Math.round(pPrice * 1.35) : 0);
      const pUnit = (row.unit || "").trim();
      const pRange = pPrice > 0 ? `₹${pPrice}${pUnit ? " / " + pUnit : ""}` : "";

      const gradeVal = (row.thickness_or_grade || row.grade || row.thickness || prodName).trim();
      if (gradeVal && !baseBank.specifications.thicknesses.some((x) => x.value.toLowerCase() === gradeVal.toLowerCase())) {
        baseBank.specifications.thicknesses.push({
          value: gradeVal,
          chipLabel: gradeVal.slice(0, 18),
          label: `${gradeVal}${pPrice > 0 ? ` — ₹${pPrice}` : ""}`,
          price: pPrice,
          mrp: pMrp,
          priceRange: pRange,
        });
        counts.thicknesses++;
      }

      const sizeVal = (row.size || row.dimensions || "").trim();
      if (sizeVal && !baseBank.specifications.sizes.some((x) => x.value.toLowerCase() === sizeVal.toLowerCase())) {
        baseBank.specifications.sizes.push({ value: sizeVal, chipLabel: sizeVal.slice(0, 18), label: sizeVal });
        counts.sizes++;
      }

      const finishVal = (row.finish || row.surface_finish || "").trim();
      if (finishVal && !baseBank.specifications.finishes.some((x) => x.value.toLowerCase() === finishVal.toLowerCase())) {
        baseBank.specifications.finishes.push({ value: finishVal, chipLabel: finishVal.slice(0, 18), label: finishVal });
        counts.finishes++;
      }

      const matVal = (row.material || row.materialcomposition || "").trim();
      if (matVal && !baseBank.specifications.materials.some((x) => x.value.toLowerCase() === matVal.toLowerCase())) {
        baseBank.specifications.materials.push({ value: matVal, chipLabel: matVal.slice(0, 18), label: matVal });
        counts.materials++;
      }

      const appVal = (row.application || row.commercial_use || "").trim();
      if (appVal && !baseBank.specifications.applications.some((x) => x.value.toLowerCase() === appVal.toLowerCase())) {
        baseBank.specifications.applications.push({ value: appVal, chipLabel: appVal.slice(0, 18), label: appVal });
        counts.applications++;
      }

      const descVal = (row.short_description || row.description || "").trim();
      if (descVal && !baseBank.paragraphs.some((x) => x.title.toLowerCase() === prodName.toLowerCase())) {
        baseBank.paragraphs.push({
          id: `p_csv_${Date.now()}_${idx}`,
          title: prodName,
          category: (row.category || "Product Story").trim(),
          text: descVal,
        });
        counts.paragraphs++;
      }
      return;
    }

    // Determine section and item value across human-friendly and developer column aliases
    const firstKey = Object.keys(row)[0];
    const section = (
      row.category_section ||
      row.section ||
      row.category ||
      row.section_name ||
      row.type ||
      row.c ||
      (firstKey && row[firstKey] ? row[firstKey] : "") ||
      ""
    ).toLowerCase().trim();

    const val = (
      row.specification_item_title ||
      row.specification_title ||
      row.item_title ||
      row.item_name ||
      row.specification ||
      row.produce_grade ||
      row.bulb_caliber ||
      row.stone_thickness ||
      row.fabric_length ||
      row.value_or_title ||
      row.value ||
      row.title ||
      row.text ||
      ""
    ).trim();

    // Skip empty lines, comment lines, section dividers, or instruction headers
    if (
      !section ||
      section.startsWith("#") ||
      section.startsWith("=") ||
      section.startsWith("-") ||
      val.startsWith("#") ||
      val.startsWith("=") ||
      val.startsWith("-") ||
      !val
    ) {
      return;
    }

    const chip = (
      row.short_tag_button ||
      row.short_tag_button_chip ||
      row.short_tag ||
      row.button_tag ||
      row.button_chip ||
      row.short_label ||
      row.chip_label ||
      row.chiplabel ||
      row.tag ||
      ""
    ).trim() || val.slice(0, 18);

    const ratePrice = Number(
      row.selling_rate ||
      row["selling_rate_₹"] ||
      row.rate_price ||
      row.wholesale_rate ||
      row.mandi_rate ||
      row.rate ||
      row.price ||
      0
    ) || 0;

    const mrp = Number(
      row.mrp ||
      row["mrp_₹"] ||
      row.retail_mrp ||
      row.list_mrp ||
      row.mrp_price ||
      0
    ) || (ratePrice > 0 ? Math.round(ratePrice * 1.35) : 0);

    const priceRange = (
      row.price_range ||
      row.mandi_range ||
      row.range ||
      ""
    ).trim() || (ratePrice > 0 ? `₹${ratePrice}` : "");

    const categoryOrGroup = (
      row.sub_group_type ||
      row.sub_group ||
      row.category_or_group ||
      row.classification ||
      row.category ||
      row.group ||
      ""
    ).trim();

    const description = (
      row.detailed_description_marketing_notes ||
      row.detailed_description ||
      row.description_marketing_text ||
      row.full_description ||
      row.description ||
      row.desc ||
      row.marketing_notes ||
      row.notes ||
      ""
    ).trim();

    // 1. Rate Preset / Thickness Preset / Mandi Rate
    if (
      section.includes("rate") ||
      section.includes("thickness") ||
      section.includes("grade") ||
      section.includes("caliber") ||
      section.includes("pricing")
    ) {
      const existing = baseBank.specifications.thicknesses || [];
      if (!existing.some((t) => t.value.toLowerCase() === val.toLowerCase())) {
        existing.push({
          value: val,
          chipLabel: chip,
          label: description || `${val} — ₹${ratePrice}`,
          price: ratePrice,
          mrp: mrp,
          priceRange: priceRange,
        });
        counts.thicknesses++;
      }
      baseBank.specifications.thicknesses = existing;
    }
    // 2. Sizes / Dimensions / Plan / Cut / Yardage
    else if (
      section.includes("size") ||
      section.includes("dimen") ||
      section.includes("plan") ||
      section.includes("cut") ||
      section.includes("yard")
    ) {
      const existing = baseBank.specifications.sizes || [];
      if (!existing.some((s) => s.value.toLowerCase() === val.toLowerCase())) {
        existing.push({
          value: val,
          chipLabel: chip,
          label: description || val,
        });
        counts.sizes++;
      }
      baseBank.specifications.sizes = existing;
    }
    // 3. Finishes / Polish / Curing / Zari / Texture
    else if (
      section.includes("finish") ||
      section.includes("curing") ||
      section.includes("polish") ||
      section.includes("zari") ||
      section.includes("texture") ||
      section.includes("skin") ||
      section.includes("surface")
    ) {
      const existing = baseBank.specifications.finishes || [];
      if (!existing.some((f) => f.value.toLowerCase() === val.toLowerCase())) {
        existing.push({
          value: val,
          chipLabel: chip,
          label: description || val,
        });
        counts.finishes++;
      }
      baseBank.specifications.finishes = existing;
    }
    // 4. Materials / Cultivars / Yarn / Fabric / Agro
    else if (
      section.includes("mat") ||
      section.includes("cultivar") ||
      section.includes("yarn") ||
      section.includes("fabric") ||
      section.includes("agro") ||
      section.includes("formation")
    ) {
      const existing = baseBank.specifications.materials || [];
      if (!existing.some((m) => m.value.toLowerCase() === val.toLowerCase())) {
        existing.push({
          value: val,
          chipLabel: chip,
          label: description || val,
        });
        counts.materials++;
      }
      baseBank.specifications.materials = existing;
    }
    // 5. Applications / Packaging / Attire / Uses / Purpose
    else if (
      section.includes("app") ||
      section.includes("use") ||
      section.includes("attire") ||
      section.includes("purpose")
    ) {
      const existing = baseBank.specifications.applications || [];
      if (!existing.some((a) => a.value.toLowerCase() === val.toLowerCase())) {
        existing.push({
          value: val,
          chipLabel: chip,
          label: description || val,
        });
        counts.applications++;
      }
      baseBank.specifications.applications = existing;
    }
    // Skip MOQ rows (MOQ removed per global catalogue standards)
    else if (section.includes("moq")) {
      // Ignored
    }
    // 7. Headings / Titles / Headlines / Covers
    else if (
      section.includes("head") ||
      section.includes("title") ||
      section.includes("cover")
    ) {
      const existing = baseBank.headings || [];
      if (!existing.some((h) => h.text.toLowerCase() === val.toLowerCase())) {
        existing.push({
          id: `h_csv_${Date.now()}_${idx}`,
          text: val,
          category: categoryOrGroup || "Section Title",
        });
        counts.headings++;
      }
      baseBank.headings = existing;
    }
    // 8. Taglines / Subtitles / Catchphrases / Banners
    else if (
      section.includes("tag") ||
      section.includes("sub") ||
      section.includes("catch")
    ) {
      const existing = baseBank.taglines || [];
      if (!existing.some((t) => t.text.toLowerCase() === val.toLowerCase())) {
        existing.push({
          id: `t_csv_${Date.now()}_${idx}`,
          text: val,
        });
        counts.taglines++;
      }
      baseBank.taglines = existing;
    }
    // 9. Stories / Paragraphs / Harvest Story / Heritage / About
    else if (
      section.includes("story") ||
      section.includes("para") ||
      section.includes("copy") ||
      section.includes("about") ||
      section.includes("heritage") ||
      section.includes("harvest")
    ) {
      const existing = baseBank.paragraphs || [];
      if (!existing.some((p) => p.title.toLowerCase() === val.toLowerCase())) {
        existing.push({
          id: `p_csv_${Date.now()}_${idx}`,
          title: val,
          category: categoryOrGroup || "Brand Story",
          text: description || val,
        });
        counts.paragraphs++;
      }
      baseBank.paragraphs = existing;
    }
    // 10. Highlights / Bullets / Features / Points
    else if (
      section.includes("high") ||
      section.includes("bullet") ||
      section.includes("feature") ||
      section.includes("point") ||
      section.includes("advantage")
    ) {
      const existing = baseBank.featureHighlights || [];
      if (!existing.some((h) => h.text.toLowerCase() === val.toLowerCase())) {
        existing.push({
          id: `f_csv_${Date.now()}_${idx}`,
          text: val,
        });
        counts.highlights++;
      }
      baseBank.featureHighlights = existing;
    }
    // Fallback: If section matches nothing, check if it has a rate price -> rate preset
    else if (ratePrice > 0) {
      const existing = baseBank.specifications.thicknesses || [];
      existing.push({
        value: val,
        chipLabel: chip,
        label: description || `${val} — ₹${ratePrice}`,
        price: ratePrice,
        mrp: mrp,
        priceRange: priceRange,
      });
      counts.thicknesses++;
      baseBank.specifications.thicknesses = existing;
    }
  });

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    dataBank: baseBank,
    counts,
    totalItems,
  };
}

export function generateProductCatalogueCsvTemplate(family = "general", company = null) {
  const companyName = company?.name || "Enterprise";
  const headers = [
    "Product_Name",
    "SKU",
    "Category",
    "Price",
    "MRP",
    "Unit",
    "Size",
    "Thickness_Or_Grade",
    "Finish",
    "Material",
    "Application",
    "Stock",
    "Image_URL",
    "Description",
  ];

  let sampleRows = [];

  if (family === "garlic") {
    sampleRows = [
      [
        "Malwa Sun-Cured Desi White Garlic (Export A+ Jumbo)",
        "GRL-MLW-01",
        "Garlic Specialty",
        "220",
        "280",
        "kg",
        "50 - 65 mm (Grade A+ Large)",
        "Grade A+ Large Bulbs",
        "Sun-Cured Export Clean White Skin",
        "100% Organically Grown Malwa Garlic (Moisture < 65%)",
        "Bulk Mandi Wholesale & Export Consignments",
        "1200",
        "/assets/garlic/garlic-01.jpeg",
        "Premium solar-cured Malwa white garlic with high bioactive allicin concentration and intact sheath.",
      ],
      [
        "Medium Cured Malwa Table Garlic (Grade A)",
        "GRL-MLW-02",
        "Garlic Specialty",
        "180",
        "230",
        "kg",
        "40 - 50 mm (Grade A Medium)",
        "Grade A Medium Bulbs",
        "Natural Pinkish-White Clove Skin",
        "High Allicin Standard Desi Variety",
        "Commercial Culinary & Food Processing",
        "850",
        "/assets/garlic/garlic-02.jpeg",
        "Uniform medium caliber table garlic ideal for hotels, restaurants, and fresh retail distribution.",
      ],
      [
        "Processing Caliber Malwa Garlic (Small/Goli)",
        "GRL-MLW-03",
        "Garlic Specialty",
        "140",
        "180",
        "kg",
        "30 - 40 mm (Grade B Small)",
        "Grade B Small Bulbs",
        "Sun-Cured Export Clean White Skin",
        "Organically Grown Malwa Cultivar",
        "Paste, Flake & Powder Dehydration",
        "2400",
        "/assets/garlic/garlic-03.jpeg",
        "High-pungency compact garlic cloves formulated for culinary dehydration and seasoning manufacture.",
      ],
    ];
  } else if (family === "kotastone") {
    sampleRows = [
      [
        "Royal Kota Blue Limestone Tiles (Mirror Polished)",
        "KST-BLU-600",
        "Kota Stone Specialty",
        "75",
        "105",
        "sq.ft",
        "600x600 mm (2x2 ft)",
        "20 - 25 mm Gauged",
        "Mirror High Polish (Factory Finished)",
        "Natural Indurated Limestone (Kota Blue/Green)",
        "Heavy Commercial Flooring & Public Concourses",
        "5000",
        "/assets/kota-stone/blue-kota-stone-1.jpg",
        "Direct Suket quarry extraction with diamond calibration, rectified edges, and mirror polish sheen.",
      ],
      [
        "Kota Green Limestone Slabs (Honed Satin Anti-Skid)",
        "KST-GRN-300",
        "Kota Stone Specialty",
        "68",
        "95",
        "sq.ft",
        "600x300 mm (2x1 ft)",
        "25 - 30 mm Calibrated",
        "Honed Smooth Satin Finish",
        "Natural Indurated Limestone",
        "Hospitals, Corridors & Exterior Walkways",
        "3200",
        "/assets/kota-stone/blue-kota-stone-2.jpg",
        "Abrasion-resistant low-sheen satin finish designed for wet and high-wear footfall environments.",
      ],
      [
        "Natural Split Rough Kota Pavers (Patio & Driveway)",
        "KST-SPL-450",
        "Kota Stone Specialty",
        "55",
        "80",
        "sq.ft",
        "450x450 mm",
        "30 - 40 mm Quarry Slabs",
        "Natural Split Cleft Texture (Anti-Skid)",
        "High Compressive Limestone",
        "Driveways, Courtyards & Parking Lots",
        "4500",
        "/assets/kota-stone/blue-kota-stone-3.jpg",
        "Heavy natural cleft paver with maximum compressive load endurance and non-slip outdoor texture.",
      ],
    ];
  } else if (family === "sandstone") {
    sampleRows = [
      [
        "Dholpur Beige Sandstone Architectural Cladding",
        "SND-DHP-01",
        "Sand Stone Specialty",
        "155",
        "210",
        "sq.ft",
        "600x900 mm (2x3 ft)",
        "25 - 30 mm Calibrated Sawn",
        "Sandblasted Uniform Textured Surface",
        "Natural Quartzite Sandstone",
        "Exterior Facades & Cladding",
        "2800",
        "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        "Fine-grained quartz sandstone with thermal insulation properties and weather-resistant surface.",
      ],
      [
        "Heritage Hand-Carved Sandstone Jali Screen",
        "SND-JAL-02",
        "Sand Stone Specialty",
        "350",
        "480",
        "sq.ft",
        "600x1200 mm",
        "50 - 75 mm Carved Jali",
        "Hand-Chiseled Rockface Heritage Border",
        "Sedimentary Quartzite Sandstone",
        "Palatial Screens & Heritage Partitions",
        "650",
        "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
        "Intricately carved geometric jali screens providing ambient ventilation and regal aesthetics.",
      ],
    ];
  } else if (family === "kotadoria") {
    sampleRows = [
      [
        "Royal Gossamer Silk Zari Buti Kota Doria Saree",
        "KTD-ZAR-01",
        "Kota Doria Specialty",
        "3800",
        "5500",
        "saree",
        "6.5m (Includes 80cm Running Blouse Piece)",
        "6.5 Metres Drape",
        "Tested Electro-Gold Zari on Square Khat",
        "Pure Mulberry Silk Warp, Fine Cotton Weft",
        "Bridal Ensembles & High-End Boutique Luxury",
        "85",
        "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        "Woven on traditional Kaithun pit looms with pure silk warp, fine cotton weft, and tested gold zari buti.",
      ],
      [
        "Hand-Block Printed Sanganeri Motif Silk-Cotton Saree",
        "KTD-BLK-02",
        "Kota Doria Specialty",
        "2900",
        "4200",
        "saree",
        "6.5m (Includes 80cm Running Blouse Piece)",
        "6.5 Metres Drape",
        "Traditional Bagru / Sanganeri Natural Hand-Block Print",
        "Pure Mulberry Silk Warp, Fine Cotton Weft",
        "Festive Wear & Boutique Collections",
        "120",
        "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
        "Artisanal hand-block floral motifs printed with plant-based natural dyes on gossamer khat fabric.",
      ],
      [
        "Gossamer Silk-Cotton Zari Border Dupatta",
        "KTD-DUP-03",
        "Kota Doria Specialty",
        "1450",
        "2100",
        "dupatta",
        "2.5 Metres (Width 36 in)",
        "2.5 Metres Dupatta",
        "Pure Silver Zari (Chandi Zari) Weft Border",
        "Pure Mulberry Silk Warp, Fine Cotton Weft",
        "Ethnic Formal & Festive Drapes",
        "200",
        "/assets/kota-doria/0X2A0415.jpg",
        "Feather-light translucent dupatta featuring signature square khat texture with silver zari borders.",
      ],
    ];
  } else {
    sampleRows = [
      [
        "Premium Commercial Enterprise Product",
        "PROD-001",
        "General Products",
        "1250",
        "1750",
        "piece",
        "Standard Sizing",
        "Grade A Standard",
        "Matte High Durability",
        "Certified Alloy / Composition",
        "Commercial & Retail Distribution",
        "500",
        "/assets/reference/p1_1.jpg",
        "Standard quality enterprise product engineered for multi-channel sales and dependable durability.",
      ],
    ];
  }

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...sampleRows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Parses uploaded Product CSV file and transforms rows into full CatalogueProduct objects.
 */
export function parseProductCatalogueCsv(csvText, categoryFamily = "general", company = null) {
  const rows = parseCsv(csvText);
  if (!rows || rows.length === 0) {
    throw new Error("Product spreadsheet is empty or has no readable rows.");
  }

  const validProducts = [];
  const errors = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // Spreadsheet row index

    // Try finding title/name under common column variants
    const name = (
      row.product_name ||
      row.name ||
      row.title ||
      row.product_title ||
      row.item_name ||
      ""
    ).trim();

    if (!name || name.startsWith("#")) return; // Skip comments/empties

    // Price
    const rawPrice = row.price || row.selling_price || row.rate || row.wholesale_price || 0;
    const price = Number(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

    if (price <= 0) {
      errors.push({ rowNum, name, error: "Selling Price must be a valid number greater than 0" });
      return;
    }

    // SKU
    let sku = (row.sku || row.product_id || row.item_code || "").trim();
    if (!sku) {
      const prefix = categoryFamily === "garlic" ? "GRL" : categoryFamily === "kotastone" ? "KST" : categoryFamily === "sandstone" ? "SND" : categoryFamily === "kotadoria" ? "KTD" : "PRD";
      sku = `${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}-${idx + 1}`;
    }

    // Category
    const category = (
      row.category ||
      (categoryFamily === "garlic"
        ? "Garlic Specialty"
        : categoryFamily === "kotastone"
        ? "Kota Stone Specialty"
        : categoryFamily === "sandstone"
        ? "Sand Stone Specialty"
        : categoryFamily === "kotadoria"
        ? "Kota Doria Specialty"
        : "Commercial")
    ).trim();

    // MRP
    const rawMrp = row.mrp || row.list_price || row.retail_mrp || 0;
    const mrp = Number(String(rawMrp).replace(/[^0-9.]/g, "")) || Math.round(price * 1.35);

    // Unit
    let unit = (row.unit || row.pricing_unit || "").trim();
    if (!unit) {
      if (categoryFamily === "garlic") unit = "kg";
      else if (categoryFamily === "kotastone" || categoryFamily === "sandstone") unit = "sq.ft";
      else if (categoryFamily === "kotadoria") unit = "";
      else unit = "piece";
    }

    // Stock
    const stock = Number(row.stock || row.inventory || row.qty || 100) || 100;

    // Specifications
    const size = (row.size || row.dimensions || row.plan_dimensions || row.bulb_caliber || "").trim();
    const thickness = (row.thickness_or_grade || row.thickness || row.grade || "").trim();
    const finish = (row.finish || row.curing || row.surface_finish || "").trim();
    const material = (row.material || row.cultivar || row.yarn || row.materialcomposition || "").trim();
    const application = (row.application || row.packaging || row.commercial_use || "").trim();
    const description = (
      row.description ||
      row.details ||
      `${name} — Authentic ${category} offering verified quality standards and reliable dispatch.`
    ).trim();

    let imageUrl = (row.image_url || row.image || row.photo || "").trim();
    if (imageUrl.startsWith("assets/") || imageUrl.startsWith("uploads/")) {
      imageUrl = `/${imageUrl}`;
    }
    if (!imageUrl || (categoryFamily === "garlic" && imageUrl.includes("/assets/reference/"))) {
      const garlicImages = [
        "/assets/garlic/garlic-01.jpeg",
        "/assets/garlic/garlic-02.jpeg",
        "/assets/garlic/garlic-03.jpeg",
        "/assets/garlic/garlic-04.jpeg",
        "/assets/garlic/garlic-05.jpeg",
        "/assets/garlic/garlic-06.jpeg",
      ];
      const kotaStoneImages = [
        "/assets/kota-stone/blue-kota-stone-1.jpg",
        "/assets/kota-stone/blue-kota-stone-2.jpg",
        "/assets/kota-stone/blue-kota-stone-3.jpg",
        "/assets/kota-stone/blue-kota-stone-4.jpg",
      ];
      const sandStoneImages = [
        "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
      ];
      const kotaDoriaImages = [
        "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
        "/assets/kota-doria/0X2A0415.jpg",
      ];
      const pool =
        categoryFamily === "garlic"
          ? garlicImages
          : categoryFamily === "kotastone"
          ? kotaStoneImages
          : categoryFamily === "sandstone"
          ? sandStoneImages
          : categoryFamily === "kotadoria"
          ? kotaDoriaImages
          : garlicImages;
      imageUrl = pool[idx % pool.length];
    }

    const technicalSpecifications = [];
    if (size) technicalSpecifications.push({ key: "Size / Dimensions", value: size, verified: true });
    if (thickness) technicalSpecifications.push({ key: "Thickness / Grade", value: thickness, verified: true });
    if (finish) technicalSpecifications.push({ key: "Surface Finish", value: finish, verified: true });
    if (material) technicalSpecifications.push({ key: "Material Composition", value: material, verified: true });
    if (application) technicalSpecifications.push({ key: "Commercial Application", value: application, verified: true });

    validProducts.push({
      name,
      sku,
      category,
      price,
      mrp,
      unit,
      stock,
      size,
      thickness,
      finish,
      color: finish,
      material,
      materialComposition: material,
      application,
      useApplication: application,
      description,
      image: imageUrl,
      images: [{ url: imageUrl, isPrimary: true, backgroundType: "white" }],
      technicalSpecifications,
      district: company?.district || (categoryFamily === "garlic" ? "Baran, Rajasthan" : categoryFamily === "kotastone" ? "Jhalawar, Rajasthan" : categoryFamily === "sandstone" ? "Bundi, Rajasthan" : "Kota, Rajasthan"),
      brand: company?.name || "Authentic Enterprise",
      odopProduct: company?.odopProduct || (categoryFamily === "garlic" ? "Garlic" : categoryFamily === "kotastone" ? "Kota Stone" : categoryFamily === "sandstone" ? "Sandstone" : "Kota Doria"),
      companyId: company?._id || null,
    });
  });

  return {
    products: validProducts,
    validCount: validProducts.length,
    invalidCount: errors.length,
    errors,
  };
}

/**
 * Exports current products to CSV
 */
export function exportProductsToCsv(products = [], categoryFamily = "general") {
  const headers = [
    "Product_Name",
    "SKU",
    "Category",
    "Price",
    "MRP",
    "Unit",
    "Size",
    "Thickness",
    "Finish",
    "Material",
    "Application",
    "Stock",
    "Image_URL",
    "Description",
  ];

  const rows = (products || []).map((p) => [
    p.name || "",
    p.sku || "",
    p.category || "",
    p.price || 0,
    p.mrp || 0,
    p.unit || "",
    p.size || "",
    p.thickness || "",
    p.finish || p.color || "",
    p.material || p.materialComposition || "",
    p.application || p.useApplication || "",
    p.stock || 0,
    p.image || "",
    p.description || "",
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return csvLines.join("\r\n");
}

/**
 * Registry of all 25 Specialized Sample Sheets (5 Distinct Sheets per Category)
 * Strictly zero mentions of MOQ across all sheets.
 */
export const ALL_CATEGORY_SAMPLE_SHEETS = {
  garlic: [
    {
      sheetNumber: 1,
      title: "Export Jumbo Caliber",
      filename: "01_Garlic_Specialty_Sheet1_Export_Jumbo_Catalogue.csv",
      type: "products",
      badge: "Export Grade",
      description: "5 Export-grade garlic products (50-65mm Jumbo, Ek-Pothi, Cured Sheath)",
    },
    {
      sheetNumber: 2,
      title: "Mandi Wholesale Lots",
      filename: "01_Garlic_Specialty_Sheet2_Mandi_Wholesale_Catalogue.csv",
      type: "products",
      badge: "Mandi Trade",
      description: "5 Mandi wholesale trade lots (Medium A 40-50mm, Black Basalt Desi)",
    },
    {
      sheetNumber: 3,
      title: "Processing & Dehydration",
      filename: "01_Garlic_Specialty_Sheet3_Processing_Dehydration_Catalogue.csv",
      type: "products",
      badge: "Processing",
      description: "5 Food processing calibers (Goli 30-40mm, Flake & Powder grades)",
    },
    {
      sheetNumber: 4,
      title: "Retail & Value-Packs",
      filename: "01_Garlic_Specialty_Sheet4_Retail_ValuePacks_Catalogue.csv",
      type: "products",
      badge: "Retail Pack",
      description: "5 Retail consumer formats (Peeled Cloves, Braided Garlic Ropes)",
    },
    {
      sheetNumber: 5,
      title: "Garlic Data Bank (Specs & Copy)",
      filename: "01_Garlic_Specialty_Sheet5_DataBank_Specifications.csv",
      type: "databank",
      badge: "Data Bank",
      description: "45 Pre-filled specification items across 9 marketing & technical sections",
    },
  ],
  kotastone: [
    {
      sheetNumber: 1,
      title: "Mirror Polished Blue Flooring",
      filename: "02_Kota_Stone_Sheet1_Mirror_Polished_Blue_Catalogue.csv",
      type: "products",
      badge: "Flooring Slabs",
      description: "5 Mirror-finish commercial stone slabs (600x600, 1200x600, Calibrated)",
    },
    {
      sheetNumber: 2,
      title: "Honed Satin Green Slabs",
      filename: "02_Kota_Stone_Sheet2_Honed_Satin_Green_Catalogue.csv",
      type: "products",
      badge: "Honed / Leather",
      description: "5 Matte honed & leathered green limestone tiles for interiors & steps",
    },
    {
      sheetNumber: 3,
      title: "Rough Hand-Cut Paving",
      filename: "02_Kota_Stone_Sheet3_Rough_Split_Paving_Catalogue.csv",
      type: "products",
      badge: "Exterior Paver",
      description: "5 Natural split heavy pavers & cobbles for exterior driveways & ramps",
    },
    {
      sheetNumber: 4,
      title: "Yellow-Brown Heritage Tiles",
      filename: "02_Kota_Stone_Sheet4_Yellow_Brown_Heritage_Catalogue.csv",
      type: "products",
      badge: "Heritage Earth",
      description: "5 Golden brown calibrated stones & cobblestones for courtyards",
    },
    {
      sheetNumber: 5,
      title: "Kota Stone Data Bank (Specs & Copy)",
      filename: "02_Kota_Stone_Sheet5_DataBank_Specifications.csv",
      type: "databank",
      badge: "Data Bank",
      description: "45 Stone quarry specifications, thickness presets, and marketing copy",
    },
  ],
  sandstone: [
    {
      sheetNumber: 1,
      title: "Architectural Wall Facades",
      filename: "03_Sandstone_Sheet1_Architectural_Facade_Catalogue.csv",
      type: "products",
      badge: "Wall Cladding",
      description: "5 Dholpur Beige & Mint White architectural rainscreen panels & battens",
    },
    {
      sheetNumber: 2,
      title: "Imperial Agra Red Monoliths",
      filename: "03_Sandstone_Sheet2_Imperial_Agra_Red_Catalogue.csv",
      type: "products",
      badge: "Agra Red",
      description: "5 Historical Agra Red ashlar blocks, kerbstones, and monolithic steps",
    },
    {
      sheetNumber: 3,
      title: "Outdoor Landscape Paving",
      filename: "03_Sandstone_Sheet3_Outdoor_Landscape_Paving_Catalogue.csv",
      type: "products",
      badge: "Patio Paving",
      description: "5 Autumn Brown & Modak Golden patio slabs, pool coping, and steps",
    },
    {
      sheetNumber: 4,
      title: "Hand-Carved Heritage Jali",
      filename: "03_Sandstone_Sheet4_Hand_Carved_Jali_Mandir_Craft_Catalogue.csv",
      type: "products",
      badge: "Artisan Craft",
      description: "5 Master artisan pierced jalis, floral wall murals, and fluted pillars",
    },
    {
      sheetNumber: 5,
      title: "Sandstone Data Bank (Specs & Copy)",
      filename: "03_Sandstone_Sheet5_DataBank_Specifications.csv",
      type: "databank",
      badge: "Data Bank",
      description: "45 Sandstone dimensional presets, edge finishes, and heritage stories",
    },
  ],
  kotadoria: [
    {
      sheetNumber: 1,
      title: "Royal Gold Zari Bridal Sarees",
      filename: "04_Kota_Doria_Sheet1_Royal_Gold_Zari_Bridal_Catalogue.csv",
      type: "products",
      badge: "Bridal Zari",
      description: "5 Pure silk-cotton wedding sarees with real metallic zari borders",
    },
    {
      sheetNumber: 2,
      title: "Hand-Block Sanganeri Sarees",
      filename: "04_Kota_Doria_Sheet2_HandBlock_Sanganeri_Catalogue.csv",
      type: "products",
      badge: "Hand-Block",
      description: "5 Hand-block printed Bagru and Ajrakh artisan khat weave sarees",
    },
    {
      sheetNumber: 3,
      title: "Silk Tissue & Zari Dupattas",
      filename: "04_Kota_Doria_Sheet3_Silk_Tissue_Dupattas_Catalogue.csv",
      type: "products",
      badge: "Silk Dupatta",
      description: "5 Lightweight gossamer dupattas, stoles, and leheriya festive wraps",
    },
    {
      sheetNumber: 4,
      title: "Unstitched 3-Piece Salwar Suits",
      filename: "04_Kota_Doria_Sheet4_Unstitched_Salwar_Suits_Catalogue.csv",
      type: "products",
      badge: "Salwar Suits",
      description: "5 Luxury unstitched suits with matching cotton silk pants & dupattas",
    },
    {
      sheetNumber: 5,
      title: "Kota Doria Data Bank (Specs & Copy)",
      filename: "04_Kota_Doria_Sheet5_DataBank_Specifications.csv",
      type: "databank",
      badge: "Data Bank",
      description: "45 Handloom pit-loom weaving presets, khat counts, and craft stories",
    },
  ],
  general: [
    {
      sheetNumber: 1,
      title: "Smart Audio & IoT Electronics",
      filename: "05_General_Enterprise_Sheet1_Smart_Electronics_Catalogue.csv",
      type: "products",
      badge: "Smart Tech",
      description: "5 Smart electronic products (ANC Headphones, USB-C Mics, IoT Hubs)",
    },
    {
      sheetNumber: 2,
      title: "Modern Living & Oak Furniture",
      filename: "05_General_Enterprise_Sheet2_Modern_Furniture_Catalogue.csv",
      type: "products",
      badge: "Furniture",
      description: "5 Solid wood designer furniture items (Lounge chairs, Platform beds)",
    },
    {
      sheetNumber: 3,
      title: "Botanical Organic Cosmetics",
      filename: "05_General_Enterprise_Sheet3_Organic_Cosmetics_Catalogue.csv",
      type: "products",
      badge: "Cosmetics",
      description: "5 Clean organic skincare items (Vitamin C Serum, Mineral Sunscreen)",
    },
    {
      sheetNumber: 4,
      title: "Luxury Apparel & Accessories",
      filename: "05_General_Enterprise_Sheet4_Luxury_Apparel_Catalogue.csv",
      type: "products",
      badge: "Luxury Wear",
      description: "5 Premium fashion items (Mulberry Silk Scarves, Cashmere Overcoats)",
    },
    {
      sheetNumber: 5,
      title: "General Enterprise Data Bank",
      filename: "05_General_Enterprise_Sheet5_DataBank_Specifications.csv",
      type: "databank",
      badge: "Data Bank",
      description: "45 Commercial presets, sustainable certifications, and brand copy",
    },
  ],
};

/**
 * Returns the 5 specialized sheets for any given category family.
 */
export function getCategorySampleSheets(family = "general") {
  const fam = (family || "general").toLowerCase().replace(/[^a-z]/g, "");
  if (fam.includes("garlic")) return ALL_CATEGORY_SAMPLE_SHEETS.garlic;
  if (fam.includes("kotastone") || fam.includes("stone") || (fam.includes("kota") && !fam.includes("doria"))) return ALL_CATEGORY_SAMPLE_SHEETS.kotastone;
  if (fam.includes("sandstone")) return ALL_CATEGORY_SAMPLE_SHEETS.sandstone;
  if (fam.includes("doria") || fam.includes("handloom") || fam.includes("fabric") || fam.includes("saree")) return ALL_CATEGORY_SAMPLE_SHEETS.kotadoria;
  return ALL_CATEGORY_SAMPLE_SHEETS.general;
}

