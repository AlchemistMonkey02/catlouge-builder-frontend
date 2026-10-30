/**
 * Centralized API Configuration & Endpoints Registry
 * 
 * Provides:
 * - Environment-driven Base URL resolution (zero hardcoding)
 * - Complete, structured API Endpoint definitions
 * - Helper function to build dynamic / absolute URLs
 */

// In development on localhost, "/api" routes through Vite reverse proxy to eliminate browser CORS blocks.
// In production outside localhost, directly uses the production domain.
export const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "/api"
    : "https://catlougeapi.geoplanetsolution.com/api";

export const API_TIMEOUT = 45000;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // Catalogue Products
  CATALOGUE_PRODUCTS: {
    BASE: "/catalogue-products",
    BY_ID: (id) => `/catalogue-products/${id}`,
    DUPLICATE: (id) => `/catalogue-products/${id}/duplicate`,
    BULK_ACTIONS: "/catalogue-products/bulk-actions",
    TOGGLE_LOCK: (id) => `/catalogue-products/${id}/toggle-lock`,
  },

  // Dynamic Catalogue Records (ODOP / Studio Database)
  CATALOGUE_RECORDS: {
    BASE: "/catalogue-records",
    BY_ID: (id) => `/catalogue-records/${id}`,
  },

  // Multi-Company Brand Profiles
  COMPANIES: {
    BASE: "/companies",
    BY_ID: (id) => `/companies/${id}`,
  },

  // Legacy Store Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id) => `/products/${id}`,
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

export default {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
  ENDPOINTS: API_ENDPOINTS,
  getAbsoluteApiUrl,
};

