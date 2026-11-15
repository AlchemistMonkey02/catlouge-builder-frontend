/**
 * Universal Price and Pricing Unit Formatter for Catalogue Builder
 * Supports:
 * - Dynamic units (sq.ft, kg, ml, metre, tonne, piece, etc.)
 * - Optional / empty unit (Clothes, Sarees, Luxury goods -> NO UNIT SHOWN)
 * - Intelligent inference for legacy products (Stone -> sq.ft, Garlic -> kg, Clothes -> none)
 * - Safe range formatting without hardcoding / kg or / sq.ft
 */

export function formatProductPrice(price, unit, product = {}) {
  const pObj = typeof price === "object" && price !== null ? price : (product || {});
  const rawPrice =
    typeof price === "number" || typeof price === "string"
      ? price
      : (pObj.price ?? pObj.formattedPrice);

  if (rawPrice == null || rawPrice === "") return "Price on Request";

  // Check explicit unit from argument or product
  let u = unit !== undefined ? unit : (pObj.unit ?? pObj.pricingUnit ?? pObj.priceUnit);

  // If unit was undefined / null, infer from product keywords, BUT if user set it to empty string "", respect NO UNIT!
  if (u === undefined || u === null) {
    const text = `${pObj.name || ""} ${pObj.category || ""} ${pObj.subcategory || ""} ${pObj.material || ""}`.toLowerCase();
    if (
      text.includes("saree") ||
      text.includes("doria") ||
      text.includes("cloth") ||
      text.includes("apparel") ||
      text.includes("fashion") ||
      text.includes("audio") ||
      text.includes("electronic") ||
      text.includes("phone") ||
      text.includes("lifestyle") ||
      text.includes("kurti") ||
      text.includes("dupatta")
    ) {
      u = "";
    } else if (
      text.includes("stone") ||
      text.includes("sandstone") ||
      text.includes("limestone") ||
      text.includes("granite") ||
      text.includes("slab") ||
      text.includes("paver") ||
      text.includes("tile")
    ) {
      u = "sq.ft";
    } else if (
      text.includes("garlic") ||
      text.includes("lahsun") ||
      text.includes("agro") ||
      text.includes("bulb")
    ) {
      u = "kg";
    } else {
      u = "";
    }
  }

  u = String(u || "").trim();
  if (/^(none|null|undefined|-|no unit)$/i.test(u)) {
    u = "";
  }

  const s = String(rawPrice).trim();

  // If rawPrice already has a slash unit (e.g. "₹110 / kg" or "₹110 / sq.ft"):
  if (s.includes("/")) {
    const parts = s.split("/");
    const valPart = parts[0].trim();
    const existingUnit = parts.slice(1).join("/").trim();

    // If unit is explicitly empty (no unit), strip the existing unit!
    if (!u) {
      return valPart.startsWith("₹") ? valPart : `₹${valPart}`;
    }

    // If a different unit was requested, replace with the requested unit
    const cleanU = u.replace(/^\/+/, "").trim();
    return `${valPart.startsWith("₹") ? valPart : `₹${valPart}`} / ${cleanU}`;
  }

  const num = Number(s.replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num <= 0) {
    if (s.startsWith("₹")) return s;
    return s || "Price on Request";
  }

  const formattedNum = `₹${num.toLocaleString("en-IN")}`;
  if (!u) {
    return formattedNum; // NO UNIT for saree, clothes, or when unit is unselected
  }

  const cleanUnit = u.replace(/^\/+/, "").trim();
  return `${formattedNum} / ${cleanUnit}`;
}

export function formatProductPriceRange(priceRange, minPrice, maxPrice, unit, product = {}) {
  const pObj = typeof minPrice === "object" && minPrice !== null ? minPrice : (product || {});
  let u = unit !== undefined ? unit : (pObj.unit ?? pObj.pricingUnit ?? pObj.priceUnit);

  if (u === undefined || u === null) {
    const text = `${pObj.name || ""} ${pObj.category || ""} ${pObj.subcategory || ""}`.toLowerCase();
    if (
      text.includes("saree") ||
      text.includes("doria") ||
      text.includes("cloth") ||
      text.includes("apparel") ||
      text.includes("fashion") ||
      text.includes("audio")
    ) {
      u = "";
    } else if (text.includes("stone") || text.includes("sandstone") || text.includes("granite")) {
      u = "sq.ft";
    } else if (text.includes("garlic")) {
      u = "kg";
    } else {
      u = "";
    }
  }

  u = String(u || "").trim();
  if (/^(none|null|undefined|-|no unit)$/i.test(u)) {
    u = "";
  }
  const cleanU = u ? u.replace(/^\/+/, "").trim() : "";

  // If priceRange string was provided
  if (priceRange && typeof priceRange === "string" && priceRange.trim()) {
    let r = priceRange.trim();
    if (r.includes("/")) {
      const base = r.split("/")[0].trim();
      return cleanU ? `${base} / ${cleanU}` : base;
    }
    return cleanU ? `${r} / ${cleanU}` : r;
  }

  // Derive from minPrice & maxPrice or minPrice * 1.35
  const rawMin = (typeof minPrice === "number" || typeof minPrice === "string") ? minPrice : (pObj.price ?? 0);
  const minNum = Number(String(rawMin).replace(/[^0-9.]/g, "")) || 0;
  if (!minNum) return cleanU ? `Price on Request / ${cleanU}` : "Price on Request";

  const rawMax = maxPrice != null ? maxPrice : (pObj.mrp || Math.round(minNum * 1.35));
  const maxNum = Number(String(rawMax).replace(/[^0-9.]/g, "")) || Math.round(minNum * 1.35);

  const base = maxNum > minNum
    ? `₹${minNum.toLocaleString("en-IN")} – ₹${maxNum.toLocaleString("en-IN")}`
    : `₹${minNum.toLocaleString("en-IN")}`;

  return cleanU ? `${base} / ${cleanU}` : base;
}

