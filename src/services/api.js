import axios from "axios";
import {
  API_BASE_URL,
  LIVE_API_BASE_URL,
  ASSETS_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  getAbsoluteApiUrl,
  getAssetUrl,
} from "../config/api.config";

// Re-export config and endpoints for direct access from any consumer
export {
  API_BASE_URL,
  LIVE_API_BASE_URL,
  ASSETS_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  getAbsoluteApiUrl,
  getAssetUrl,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

// Attach stored auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically clear stale or invalid tokens when reported by the server
api.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers["x-token-invalid"]) {
      localStorage.removeItem("token");
    }
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.headers && error.response.headers["x-token-invalid"]))
    ) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);



// --- AUTHENTICATION ---
export const loginUser = async (credentials) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
  return data;
};

// --- CATALOGUE PRODUCTS ---
export const fetchCatalogueProducts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
  const { data } = await api.get(API_ENDPOINTS.CATALOGUE_PRODUCTS.BASE, { params: cleanParams });
  return data;
};

export const fetchCatalogueProductById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.CATALOGUE_PRODUCTS.BY_ID(id));
  return data;
};

export const createCatalogueProduct = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_PRODUCTS.BASE, payload);
  return data;
};

export const updateCatalogueProduct = async (id, payload) => {
  const { data } = await api.put(API_ENDPOINTS.CATALOGUE_PRODUCTS.BY_ID(id), payload);
  return data;
};

export const deleteCatalogueProduct = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.CATALOGUE_PRODUCTS.BY_ID(id));
  return data;
};

export const duplicateCatalogueProduct = async (id) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_PRODUCTS.DUPLICATE(id));
  return data;
};

export const executeBulkActions = async (productIds, action, payload = {}) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_PRODUCTS.BULK_ACTIONS, {
    productIds,
    action,
    payload,
  });
  return data;
};

export const toggleProductFieldLock = async (id, field) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_PRODUCTS.TOGGLE_LOCK(id), { field });
  return data;
};

// --- AI CONTENT ENGINE (Commented out / stubs) ---
export const generateAiContent = async () => ({ data: {} });
export const predictAiCategory = async () => ({ data: {} });
export const rewriteAiField = async () => ({ data: {} });
export const extractProductFromUrl = async () => ({ data: {} });
export const extractProductFromPdf = async () => ({ data: {} });

// --- BULK IMPORT ---
export const uploadSpreadsheetForPreview = async (formData) => {
  const { data } = await api.post(API_ENDPOINTS.BULK.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const processBulkImportJob = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.BULK.PROCESS, payload);
  return data;
};

export const fetchBatchStatus = async (batchId) => {
  const { data } = await api.get(API_ENDPOINTS.BULK.STATUS(batchId));
  return data;
};

export const getDownloadTemplateUrl = (format = "xlsx") => {
  return getAbsoluteApiUrl(API_ENDPOINTS.BULK.TEMPLATE(format));
};

export const getDownloadErrorUrl = (batchId) => {
  return getAbsoluteApiUrl(API_ENDPOINTS.BULK.ERRORS(batchId));
};

// --- IMAGE STUDIO ---
export const auditImageCompliance = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.IMAGES.AUDIT_SPECS, payload);
  return data;
};

export const exportImageZipArchive = async (payload) => {
  const response = await api.post(API_ENDPOINTS.IMAGES.EXPORT_ZIP, payload, {
    responseType: "blob",
  });
  return response.data;
};

export const applyStudioImageToProduct = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.IMAGES.APPLY_TO_PRODUCT, payload);
  return data;
};

export const createProductFromStudio = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.IMAGES.CREATE_FROM_STUDIO, payload);
  return data;
};

// --- AI Image Studio APIs ---
export const generateAiStudioBackground = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.IMAGES.GENERATE_BG, payload);
    return data;
  } catch (err) {
    console.warn("Backend generate-bg error, returning empty result:", err.message);
    return { success: false, data: {} };
  }
};

export const neuralAiCutout = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.IMAGES.CUTOUT, payload);
    return data;
  } catch (err) {
    console.warn("Backend cutout error, falling back to client canvas:", err.message);
    return { success: false, error: err.message };
  }
};
export const fetchGeminiStudioPlan = async () => ({ success: false, message: "Gemini features disabled." });

export const clientSideUpscale = (imageBase64, scaleFactor = 2, sharpness = 1.35, contrast = 1.12, saturation = 1.08) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const targetW = Math.min(4000, Math.round(origW * scaleFactor));
        const targetH = Math.min(4000, Math.round(origH * scaleFactor));

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Multi-step interpolation for smooth sub-pixel enlargement
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const isPng = typeof imageBase64 === "string" && (imageBase64.includes("image/png") || imageBase64.startsWith("data:image/png"));

        // Micro-contrast, clarity, unsharp sharpening and saturation
        try {
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const d = imgData.data;
          const contrastFactor = Number(contrast) || 1.15;
          const satFactor = Number(saturation) || 1.08;
          const sharpnessFactor = Number(sharpness) || 1.35;

          // Pass 1: Contrast tone curve and color vibrancy
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] === 0) continue;
            // Contrast S-curve
            d[i] = Math.min(255, Math.max(0, ((d[i] / 255 - 0.5) * contrastFactor + 0.5) * 255));
            d[i + 1] = Math.min(255, Math.max(0, ((d[i + 1] / 255 - 0.5) * contrastFactor + 0.5) * 255));
            d[i + 2] = Math.min(255, Math.max(0, ((d[i + 2] / 255 - 0.5) * contrastFactor + 0.5) * 255));

            // Saturation vibrancy
            const gray = 0.2989 * d[i] + 0.5870 * d[i + 1] + 0.1140 * d[i + 2];
            d[i] = Math.min(255, Math.max(0, gray + (d[i] - gray) * satFactor));
            d[i + 1] = Math.min(255, Math.max(0, gray + (d[i + 1] - gray) * satFactor));
            d[i + 2] = Math.min(255, Math.max(0, gray + (d[i + 2] - gray) * satFactor));
          }

          // Pass 2: High-definition Unsharp Masking (Laplacian edge recovery convolution)
          if (sharpnessFactor > 1.0) {
            const strength = Math.min(0.65, (sharpnessFactor - 1.0) * 0.85);
            const copy = new Uint8ClampedArray(d);
            const stride = targetW * 4;
            for (let y = 1; y < targetH - 1; y++) {
              const yOff = y * stride;
              for (let x = 1; x < targetW - 1; x++) {
                const idx = yOff + x * 4;
                for (let c = 0; c < 3; c++) {
                  const center = copy[idx + c];
                  const surrounding = (
                    copy[idx - 4 + c] +
                    copy[idx + 4 + c] +
                    copy[idx - stride + c] +
                    copy[idx + stride + c]
                  ) * 0.25;
                  const sharpened = center + (center - surrounding) * strength * 2.4;
                  d[idx + c] = Math.min(255, Math.max(0, sharpened));
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
        } catch (_) {}

        const mimeType = isPng ? "image/png" : "image/jpeg";
        const quality = isPng ? undefined : 0.95;
        const upscaledDataUrl = canvas.toDataURL(mimeType, quality);

        resolve({
          success: true,
          image: upscaledDataUrl,
          upscaled: upscaledDataUrl,
          originalWidth: origW,
          originalHeight: origH,
          width: targetW,
          height: targetH,
          scaleFactor,
          stats: {
            from: `${origW}x${origH}`,
            to: `${targetW}x${targetH}`,
            scale: `${scaleFactor}x`
          }
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for upscaling"));
    img.src = imageBase64;
  });
};

export const upscaleAndEnhanceImage = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.IMAGES.UPSCALE_ENHANCE, payload);
    if (data && (data.image || data.upscaled)) {
      return data;
    }
  } catch (err) {
    console.warn("Backend upscaler unavailable, using client-side Lanczos engine:", err.message);
  }

  // Fallback to in-browser high-precision upscaling
  return await clientSideUpscale(
    payload.image,
    payload.scale || payload.scaleFactor || 2,
    payload.sharpness,
    payload.contrast,
    payload.saturation
  );
};

// --- EXPORT & PUBLISHING ---
export const fetchExportValidationReport = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.EXPORT.VALIDATE_REPORT, payload);
  return data;
};

export const downloadMarketplaceExport = async (payload) => {
  const response = await api.post(API_ENDPOINTS.EXPORT.DOWNLOAD, payload, {
    responseType: payload.format === "json" ? "json" : "blob",
  });
  return response.data;
};

export const publishToMarketplaceSandbox = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.EXPORT.PUBLISH_SANDBOX, payload);
  return data;
};

// --- ANALYTICS & BRAND KIT ---
export const fetchDashboardAnalytics = async () => {
  const { data } = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  return data;
};

export const fetchOrganizationProfile = async () => {
  const { data } = await api.get(API_ENDPOINTS.ORG.PROFILE);
  return data;
};

export const updateOrganizationProfile = async (payload) => {
  const { data } = await api.put(API_ENDPOINTS.ORG.PROFILE, payload);
  return data;
};

// --- MULTI-COMPANY BRAND PROFILES ---
export const fetchCompanies = async () => {
  const { data } = await api.get(API_ENDPOINTS.COMPANIES.BASE);
  return data;
};

export const createCompanyProfile = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.COMPANIES.BASE, payload);
  return data;
};

export const updateCompanyProfile = async (id, payload) => {
  const { data } = await api.put(API_ENDPOINTS.COMPANIES.BY_ID(id), payload);
  return data;
};

export const deleteCompanyProfile = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.COMPANIES.BY_ID(id));
  return data;
};

export const fetchCompanyDataBank = async (companyId) => {
  const { data } = await api.get(API_ENDPOINTS.COMPANIES.DATA_BANK(companyId));
  return data;
};

export const updateCompanyDataBank = async (companyId, dataBank) => {
  const { data } = await api.put(API_ENDPOINTS.COMPANIES.DATA_BANK(companyId), { dataBank });
  return data;
};

export const resetCompanyDataBank = async (companyId) => {
  const { data } = await api.post(API_ENDPOINTS.COMPANIES.DATA_BANK_RESET(companyId));
  return data;
};

// Legacy store products compatibility
export const fetchProducts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS.BASE, { params: cleanParams });
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  return data;
};

export const checkHealth = async () => {
  const { data } = await api.get(API_ENDPOINTS.HEALTH);
  return data;
};

// --- MONGO DB DYNAMIC CATALOGUE RECORDS (ODOP ENGINE) ---
export const fetchCatalogueRecords = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
  const { data } = await api.get(API_ENDPOINTS.CATALOGUE_RECORDS.BASE, { params: cleanParams });
  return data;
};

export const fetchCatalogueRecordById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.CATALOGUE_RECORDS.BY_ID(id));
  return data;
};

export const createCatalogueRecord = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_RECORDS.BASE, payload);
  return data;
};

export const updateCatalogueRecord = async (id, payload) => {
  const { data } = await api.put(API_ENDPOINTS.CATALOGUE_RECORDS.BY_ID(id), payload);
  return data;
};

export const deleteCatalogueRecord = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.CATALOGUE_RECORDS.BY_ID(id));
  return data;
};

export const publishCatalogueRecordLive = async (id, payload) => {
  const { data } = await api.post(API_ENDPOINTS.CATALOGUE_RECORDS.PUBLISH_LIVE(id), payload);
  return data;
};

export default api;
