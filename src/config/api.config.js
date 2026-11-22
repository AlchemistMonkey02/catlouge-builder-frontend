/**
 * Centralized API Configuration & Endpoints Registry
 * 
 * Provides:
 * - Environment-driven Base URL resolution (zero hardcoding)
 * - Complete, structured API Endpoint definitions for all backend services
 * - Absolute and dynamic URL builder helpers
 * - Asset / image CDN path resolution
 */

// Live production backend API endpoint
export const LIVE_API_BASE_URL = "https://catlougeapi.geoplanetsolution.com/api";

// Environment-driven Base URL resolution:
// Reads from Vite environment variable (VITE_API_URL / VITE_API_BASE_URL / VITE_BACKEND_URL)
// with default fallback to the live production server.
const resolveApiBaseUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
    }
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
    }
    if (import.meta.env.VITE_BACKEND_URL) {
      const clean = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");
      return clean.endsWith("/api") ? clean : `${clean}/api`;
    }
  }
  return LIVE_API_BASE_URL;
};

export const API_BASE_URL = resolveApiBaseUrl();

// Assets origin (for static assets, uploads and asset catalog previews)
export const ASSETS_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ASSETS_URL) ||
  API_BASE_URL.replace(/\/api\/?$/, "");

export const API_TIMEOUT = 45000;

export const API_ENDPOINTS = {
  // System Health
  HEALTH: "/health",

  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // Catalogue Products (Multi-Company Catalogues)
  CATALOGUE_PRODUCTS: {
    BASE: "/catalogue-products",
    BY_ID: (id) => `/catalogue-products/${id}`,
    DUPLICATE: (id) => `/catalogue-products/${id}/duplicate`,
    BULK_ACTIONS: "/catalogue-products/bulk-actions",
    TOGGLE_LOCK: (id) => `/catalogue-products/${id}/toggle-lock`,
  },

  // Dynamic Catalogue Records (ODOP / Studio Database / Published Live Links)
  CATALOGUE_RECORDS: {
    BASE: "/catalogue-records",
    BY_ID: (id) => `/catalogue-records/${id}`,
    PUBLISH_LIVE: (id) => `/catalogue-records/${id}/publish-live`,
  },

  // Multi-Company Brand Profiles & Enterprise Data Bank
  COMPANIES: {
    BASE: "/companies",
    BY_ID: (id) => `/companies/${id}`,
    DATA_BANK: (id) => `/companies/${id}/databank`,
    DATA_BANK_RESET: (id) => `/companies/${id}/databank/reset`,
  },

  // Legacy Store Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id) => `/products/${id}`,
    CATEGORIES: "/products/categories",
  },

  // Bulk Import & Export Spreadsheets
  BULK: {
    UPLOAD: "/bulk/upload",
    PROCESS: "/bulk/process",
    STATUS: (batchId) => `/bulk/status/${batchId}`,
    TEMPLATE: (format = "xlsx") => `/bulk/template/${format}`,
    ERRORS: (batchId) => `/bulk/errors/${batchId}`,
  },

  // Image Studio & Optimization
  IMAGES: {
    AUDIT_SPECS: "/images/audit-specs",
    EXPORT_ZIP: "/images/export-zip",
    APPLY_TO_PRODUCT: "/images/apply-to-product",
    CREATE_FROM_STUDIO: "/images/create-from-studio",
    UPSCALE_ENHANCE: "/images/upscale-enhance",
    CUTOUT: "/images/cutout",
    GENERATE_BG: "/images/generate-bg",
  },

  // AI Content Engine (Stubs)
  AI: {
    GENERATE: "/ai/generate",
    PREDICT_CATEGORY: "/ai/predict-category",
    REWRITE_FIELD: "/ai/rewrite-field",
    EXTRACT_FROM_URL: "/ai/extract-from-url",
    EXTRACT_FROM_PDF: "/ai/extract-from-pdf",
  },

  // Export & Publishing Center
  EXPORT: {
    VALIDATE_REPORT: "/export/validate-report",
    DOWNLOAD: "/export/download",
    PUBLISH_SANDBOX: "/export/publish-sandbox",
  },

  // Analytics & Organization Profile
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
  },
  ORG: {
    PROFILE: "/org/profile",
  },
};

/**
 * Build an absolute API URL for direct links or download anchors (e.g. href downloads)
 * @param {string} endpointPath Relative endpoint path (e.g. "/bulk/template/xlsx")
 * @returns {string} Fully qualified API URL
 */
export const getAbsoluteApiUrl = (endpointPath = "") => {
  const base = (API_BASE_URL || "").replace(/\/+$/, "");
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  return `${base}${cleanPath}`;
};

/**
 * Resolve an asset or media URL to absolute URL if needed
 * @param {string} assetPath Path to asset (e.g. "/assets/garlic/garlic-01.jpeg")
 * @returns {string} Fully qualified or untouched URL
 */
export const getAssetUrl = (assetPath = "") => {
  if (!assetPath) return "";
  if (/^(https?:|data:|blob:|\/\/)/i.test(assetPath)) return assetPath;
  const cleanPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${ASSETS_BASE_URL}${cleanPath}`;
};

export default {
  BASE_URL: API_BASE_URL,
  ASSETS_BASE_URL,
  TIMEOUT: API_TIMEOUT,
  ENDPOINTS: API_ENDPOINTS,
  getAbsoluteApiUrl,
  getAssetUrl,
};
