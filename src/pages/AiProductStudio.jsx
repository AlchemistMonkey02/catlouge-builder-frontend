import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Camera,
  Upload,
  Download,
  Sliders,
  CheckCircle,
  Sun,
  Layers,
  Wand2,
  RefreshCw,
  FolderPlus,
  ArrowRight,
  Eye,
  SplitSquareVertical,
  Scissors,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Plus,
  RotateCcw,
  MousePointer,
  Zap,
  Key,
  Bot,
  Lightbulb,
  Maximize2,
  Compass,
  Move,
  RotateCw,
  Search,
  Package,
} from "lucide-react";
import {
  fetchCompanies,
  fetchCatalogueProducts,
  applyStudioImageToProduct,
  createProductFromStudio,
  generateAiStudioBackground,
  neuralAiCutout,
  fetchGeminiStudioPlan,
  upscaleAndEnhanceImage,
} from "../services/api";
import demoCutouts from "../data/demoCutouts.json";

// Curated demo products with pre-cached transparent PNG cutouts for instant 0ms rendering
const DEMO_PHONE_SHOTS = [
  {
    id: "watch",
    name: "Luxury Chronograph Watch",
    category: "Accessories",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
    cutout: demoCutouts.watch,
  },
  {
    id: "sneaker",
    name: "Performance Running Sneaker",
    category: "Footwear",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80",
    cutout: demoCutouts.sneaker,
  },
  {
    id: "cosmetics",
    name: "Luxury Serum Dropper",
    category: "Beauty",
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&fit=crop&q=80",
    cutout: demoCutouts.cosmetics,
  },
  {
    id: "headphones",
    name: "Wireless Studio Headphones",
    category: "Electronics",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
    cutout: demoCutouts.headphones,
  },
  {
    id: "mug",
    name: "Ceramic Artisan Coffee Mug",
    category: "Home & Kitchen",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
    cutout: demoCutouts.mug,
  },
];

// Curated Studio Stages
const STUDIO_STAGES = [
  {
    id: "carrara_marble",
    name: "Carrara White Marble",
    tag: "Luxury / Premium",
    desc: "Polished Italian marble countertop with delicate grey veins, soft studio ambient rim light, and glossy ground reflection.",
    type: "marble",
    badgeColor: "#4f46e5",
  },
  {
    id: "amazon_pure_white",
    name: "Amazon Pure White",
    tag: "Marketplace Strict",
    desc: "Pure #FFFFFF seamless cyc wall with physics ground contact shadow. 100% compliant with Amazon, Flipkart, Google Shopping.",
    type: "white",
    badgeColor: "#059669",
  },
  {
    id: "architectural_podium",
    name: "Minimalist Pastel Podium",
    tag: "Modern D2C",
    desc: "Cylindrical geometric pedestal with soft studio fill light and clean contemporary gradient backdrop.",
    type: "podium",
    badgeColor: "#0284c7",
  },
  {
    id: "warm_oak",
    name: "Scandinavian Warm Oak",
    tag: "Organic / Natural",
    desc: "Rich textured timber wood surface with warm morning sunlight beams and gentle organic contact shadows.",
    type: "wood",
    badgeColor: "#d97706",
  },
  {
    id: "obsidian_neon",
    name: "Obsidian Dark & Neon Rim",
    tag: "Tech / Gaming",
    desc: "Deep matte black obsidian pedestal with dual cyan and magenta edge rim glow. High drama aesthetic.",
    type: "dark_neon",
    badgeColor: "#7c3aed",
  },
  {
    id: "botanical_sun",
    name: "Sunlit Botanical Stone",
    tag: "Eco / Wellness",
    desc: "Natural limestone slab with soft tropical monstera leaf dappled shadows and morning golden hour illumination.",
    type: "botanical",
    badgeColor: "#16a34a",
  },
  {
    id: "luxury_silk",
    name: "Royal Emerald Velvet",
    tag: "Editorial / Fashion",
    desc: "Deep jewel-toned folded silk velvet stage with cinematic spotlight falloff.",
    type: "velvet",
    badgeColor: "#047857",
  },
  {
    id: "pastel_dream",
    name: "Cosmetic Studio Gradient",
    tag: "Skincare / Lifestyle",
    desc: "Ultra-clean pastel gradient studio backdrop with dual diffused softboxes.",
    type: "gradient",
    badgeColor: "#db2777",
  },
  {
    id: "odop_kota_stone",
    name: "ODOP Kota Stone Slab",
    tag: "ODOP Heritage",
    desc: "Polished greenish-buff Kota limestone slab with clean architectural studio lighting and refined surface reflection.",
    type: "kota_stone",
    badgeColor: "#059669",
  },
  {
    id: "odop_sandstone",
    name: "ODOP Jodhpur Sandstone",
    tag: "ODOP Heritage",
    desc: "Warm golden Jodhpur sandstone slab with natural earthy sunlit texture and organic contact shadows.",
    type: "sandstone",
    badgeColor: "#d97706",
  },
  {
    id: "odop_kota_doria",
    name: "ODOP Kota Doria Silk",
    tag: "ODOP Handloom",
    desc: "Ethereal translucent sheer Kota Doria gold-zari handloom fabric drape with soft morning studio sunlight.",
    type: "kota_doria",
    badgeColor: "#ec4899",
  },
  {
    id: "odop_garlic",
    name: "ODOP Garlic Farm Table",
    tag: "ODOP Agriculture",
    desc: "Organic culinary farm tabletop with rustic textured burlap jute and weathered timber daylight staging.",
    type: "garlic",
    badgeColor: "#84cc16",
  },
  {
    id: "solid_color",
    name: "Custom Studio Color",
    tag: "Studio Cyc",
    desc: "Single solid color studio cyc background with physics ground contact shadow.",
    type: "solid_color",
    badgeColor: "#6366f1",
  },
  {
    id: "studio_gradient",
    name: "Softbox Studio Gradient",
    tag: "Commercial Lighting",
    desc: "Smooth duo-tone commercial lighting gradient across background and ground floor.",
    type: "gradient",
    badgeColor: "#8b5cf6",
  },
  {
    id: "custom_backdrop",
    name: "Upload Custom Backdrop",
    tag: "Custom Texture",
    desc: "Upload your own high-resolution studio surface, wooden tabletop, or architectural texture.",
    type: "upload",
    badgeColor: "#0ea5e9",
  },
];

export default function AiProductStudio() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initial image if passed via state
  const initialImage = location.state?.image || DEMO_PHONE_SHOTS[0].url;
  const initialCutout = location.state?.cutout || demoCutouts.watch || null;
  const initialProductId = location.state?.productId || null;

  // Source & Cutout State
  const [sourceImage, setSourceImage] = useState(initialImage);
  const [cutoutImage, setCutoutImage] = useState(initialCutout);
  const [useCutout, setUseCutout] = useState(true);
  const [isProcessingCutout, setIsProcessingCutout] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [magicWandActive, setMagicWandActive] = useState(false);
  const [tolerance, setTolerance] = useState(25);
  const [feather, setFeather] = useState(2);

  // Gemini AI Director State
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
  });
  const [isConfiguringApiKey, setIsConfiguringApiKey] = useState(false);
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState(false);
  const [geminiPlan, setGeminiPlan] = useState(null);

  // Studio Stage State
  const [selectedStage, setSelectedStage] = useState("carrara_marble");
  const [solidColor, setSolidColor] = useState("#f8fafc");
  const [gradientStart, setGradientStart] = useState("#ffffff");
  const [gradientEnd, setGradientEnd] = useState("#e2e8f0");
  const [customBackdropImage, setCustomBackdropImage] = useState(null);

  // Studio Lighting & Physics Shadow Controls
  const [contactShadowIntensity, setContactShadowIntensity] = useState(75);
  const [contactShadowBlur, setContactShadowBlur] = useState(12);
  const [castShadowIntensity, setCastShadowIntensity] = useState(40);
  const [castShadowAngle, setCastShadowAngle] = useState(45);
  const [groundReflection, setGroundReflection] = useState(25);
  const [rimGlowIntensity, setRimGlowIntensity] = useState(25); // 0 to 100% specular edge glow

  // Super-Resolution HD Upscale & Sharpening
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isUpscaled, setIsUpscaled] = useState(false);
  const [upscaleScale, setUpscaleScale] = useState(2); // 2x HD or 4x Ultra-HD
  const [upscaleStats, setUpscaleStats] = useState(null);

  // Compact Zero-Scroll Workbench Tabs
  const [leftActiveTab, setLeftActiveTab] = useState("photo"); // 'photo', 'framing', 'upscale', 'gemini'
  const [rightActiveTab, setRightActiveTab] = useState("stages"); // 'stages', 'lighting', 'retouch'
  const [expandAllPanels, setExpandAllPanels] = useState(false);

  // Phone Shot Image Correction Filters
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(112);
  const [saturation, setSaturation] = useState(105);
  const [temperature, setTemperature] = useState(0); // -30 (cool) to +30 (warm)

  // Camera Angle, Tilt & Framing
  const [rotationAngle, setRotationAngle] = useState(0); // -45 to +45 deg (roll / level rotation)
  const [perspectiveTilt, setPerspectiveTilt] = useState(0); // -30 to +30 deg (camera pitch / tilt)
  const [offsetX, setOffsetX] = useState(0); // -150 to +150 px
  const [offsetY, setOffsetY] = useState(15); // -100 to +100 px
  const [productScale, setProductScale] = useState(105); // 50% - 180% (heroic commercial presence)
  const [aspectRatio, setAspectRatio] = useState("1:1"); // "1:1", "4:5", "3:4", "16:9"
  const [badgeText, setBadgeText] = useState("");
  const [showAmazonGuidelines, setShowAmazonGuidelines] = useState(false);

  // Before / After Comparison Split View
  const [isSplitView, setIsSplitView] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // 0 to 100%
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Placement & Catalogue Modals
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedTargetProductId, setSelectedTargetProductId] = useState(initialProductId || "");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [isSavingToCatalogue, setIsSavingToCatalogue] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  // New Product Modal Form
  const [newProductForm, setNewProductForm] = useState({
    name: "Studio Photographed Product",
    sku: `STU-${Date.now().toString(36).toUpperCase()}`,
    brand: "ai Studio",
    category: "General",
    price: 1999,
    mrp: 2999,
  });

  // Canvas Refs
  const outputCanvasRef = useRef(null);
  const containerRef = useRef(null);

  // Load Companies and Catalogue Products
  useEffect(() => {
    loadCatalogueData();
    // Auto-isolate default product on mount
    if (initialImage) {
      // Gemini auto-shoot disabled
      // handleGeminiAutoStudio(initialImage);
    }
  }, []);

  const loadCatalogueData = async () => {
    try {
      const [compRes, prodRes] = await Promise.all([
        fetchCompanies(),
        fetchCatalogueProducts({ limit: 100 }),
      ]);
      if (compRes.data && compRes.data.length > 0) {
        setCompanies(compRes.data);
        setSelectedCompanyId(compRes.data[0]._id);
      }
      if (prodRes.data?.products) {
        setProducts(prodRes.data.products);
        if (!selectedTargetProductId && prodRes.data.products.length > 0) {
          setSelectedTargetProductId(prodRes.data.products[0]._id);
        }
      }
    } catch (err) {
      console.error("Error loading catalogue data:", err);
    }
  };

  const handleSaveGeminiKey = (key) => {
    let normalized = (key || "").trim();
    setGeminiApiKey(normalized);
    localStorage.setItem("gemini_api_key", normalized);
    setIsConfiguringApiKey(false);
  };

  // Gemini Vision Auto-Studio Shoot commented out - AI features disabled
  /*
  const handleGeminiAutoStudio = async (overrideImg = null) => {
    ...
  };
  */
  const handleGeminiAutoStudio = async () => {};

  // Run 1-Click Neural AI Transformation
  const handleTransformToStudioShoot = async (overrideImage = null) => {
    const imgToProcess = overrideImage || sourceImage;
    if (!imgToProcess) return;

    try {
      setIsTransforming(true);
      const res = await neuralAiCutout({ image: imgToProcess });
      if (res.success && res.cutout) {
        setCutoutImage(res.cutout);
        setUseCutout(true);

        setContactShadowIntensity(78);
        setCastShadowIntensity(40);
        setGroundReflection(25);
        setBrightness(105);
        setContrast(112);
        setSaturation(105);
        setProductScale(88);
        setOffsetY(15);
      } else {
        handlePerformCutout();
      }
    } catch (err) {
      console.warn("Neural cutout API failed, using fallback:", err);
      handlePerformCutout();
    } finally {
      setIsTransforming(false);
    }
  };

  // Run Smart Background Cutout (Fallback)
  const handlePerformCutout = (sampleX = null, sampleY = null, overrideImg = null) => {
    const targetSrc = overrideImg || sourceImage;
    if (!targetSrc) return;
    setIsProcessingCutout(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = targetSrc;
    img.onload = () => {
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 800;

      const offCanvas = document.createElement("canvas");
      offCanvas.width = w;
      offCanvas.height = h;
      const ctx = offCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let targetR = 255, targetG = 255, targetB = 255;
      if (sampleX !== null && sampleY !== null) {
        const sx = Math.max(0, Math.min(w - 1, Math.round(sampleX)));
        const sy = Math.max(0, Math.min(h - 1, Math.round(sampleY)));
        const idx = (sy * w + sx) * 4;
        targetR = data[idx];
        targetG = data[idx + 1];
        targetB = data[idx + 2];
      } else {
        const corners = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
          [Math.floor(w / 2), 0],
          [0, Math.floor(h / 2)],
          [w - 1, Math.floor(h / 2)],
        ];
        let rSum = 0, gSum = 0, bSum = 0;
        corners.forEach(([cx, cy]) => {
          const idx = (cy * w + cx) * 4;
          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
        });
        targetR = Math.round(rSum / corners.length);
        targetG = Math.round(gSum / corners.length);
        targetB = Math.round(bSum / corners.length);
      }

      const colorThreshold = tolerance * 2.2;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(
          Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2)
        );

        if (dist < colorThreshold) {
          data[i + 3] = 0;
        } else if (dist < colorThreshold + feather * 5) {
          const alpha = (dist - colorThreshold) / (feather * 5);
          data[i + 3] = Math.round(alpha * 255);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const resUrl = offCanvas.toDataURL("image/png");
      setCutoutImage(resUrl);
      setUseCutout(true);
      setIsProcessingCutout(false);
    };

    img.onerror = () => {
      setIsProcessingCutout(false);
      alert("Failed to load source image for cutout processing.");
    };
  };

  const handleResetCutout = () => {
    setUseCutout(false);
  };

  const handleNeuralCutoutOnly = async (imgToProcess) => {
    if (!imgToProcess) return;
    try {
      setIsProcessingCutout(true);
      const res = await neuralAiCutout({ image: imgToProcess });
      if (res.success && res.cutout) {
        setCutoutImage(res.cutout);
        setUseCutout(true);
      } else {
        handlePerformCutout(null, null, imgToProcess);
      }
    } catch (err) {
      console.warn("Neural cutout API failed, using canvas fallback:", err);
      handlePerformCutout(null, null, imgToProcess);
    } finally {
      setIsProcessingCutout(false);
    }
  };

  // Trigger Server-side Super-Resolution HD Upscale (Lanczos + Unsharp Sharpening + HDR)
  const handleUpscaleAndEnhance = async (scaleMultiplier = 2) => {
    const targetImg = useCutout && cutoutImage ? cutoutImage : sourceImage;
    if (!targetImg) return;

    try {
      setIsUpscaling(true);
      setUpscaleScale(scaleMultiplier);
      const res = await upscaleAndEnhanceImage({
        image: targetImg,
        scale: scaleMultiplier,
      });

      const upscaledData = res.image || res.upscaled;
      if (res.success && upscaledData) {
        if (useCutout && cutoutImage) {
          setCutoutImage(upscaledData);
        } else {
          setSourceImage(upscaledData);
        }
        setIsUpscaled(true);
        setUpscaleStats(
          res.stats || {
            from: `${res.originalWidth}x${res.originalHeight}`,
            to: `${res.width}x${res.height}`,
            scale: `${scaleMultiplier}x`,
          }
        );
        // Ensure product is scaled prominently and clearly visible
        if (productScale < 100) {
          setProductScale(108);
        }
        setActionSuccessMessage(
          `🚀 Super-Resolution HD Applied (${scaleMultiplier}x Lanczos + Dual-pass Unsharp Sharpening + HDR Clarity)!`
        );
        setTimeout(() => setActionSuccessMessage(""), 5000);
      } else {
        alert("Upscale failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Super-Resolution upscale failed:", err);
      alert("Upscale error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result;
      setSourceImage(b64);
      setCutoutImage(null);
      setUseCutout(true);
      setIsUpscaled(false);
      setUpscaleStats(null);
      setRotationAngle(0);
      setPerspectiveTilt(0);
      setOffsetX(0);
      // Fast neural cutout in background
      handleNeuralCutoutOnly(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBackdropUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomBackdropImage(reader.result);
      setSelectedStage("custom_backdrop");
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // MAIN COMPOSITE RENDER ENGINE
  // =========================================================================
  useEffect(() => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let targetW = 1200;
    let targetH = 1200;
    if (aspectRatio === "4:5") {
      targetW = 1080;
      targetH = 1350;
    } else if (aspectRatio === "3:4") {
      targetW = 1200;
      targetH = 1600;
    } else if (aspectRatio === "16:9") {
      targetW = 1920;
      targetH = 1080;
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // STEP 1: RENDER VIRTUAL STUDIO STAGE
    const renderStudioStage = () => {
      const groundY = targetH * 0.72;

      if (selectedStage === "custom_backdrop" && customBackdropImage) {
        const bgImg = new Image();
        if (!customBackdropImage.startsWith("data:")) {
          bgImg.crossOrigin = "anonymous";
        }
        bgImg.src = customBackdropImage;
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, targetW, targetH);
          drawForeground();
        };
        bgImg.onerror = () => {
          drawProceduralStage(groundY);
          drawForeground();
        };
      } else {
        drawProceduralStage(groundY);
        drawForeground();
      }
    };

    // Photorealistic Procedural Stages
    const drawProceduralStage = (groundY) => {
      ctx.save();
      const w = targetW;
      const h = targetH;

      if (selectedStage === "amazon_pure_white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        const whiteGrad = ctx.createLinearGradient(0, groundY - 80, 0, h);
        whiteGrad.addColorStop(0, "#ffffff");
        whiteGrad.addColorStop(0.6, "#fcfcfd");
        whiteGrad.addColorStop(1, "#f4f4f6");
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0, groundY - 80, w, h - (groundY - 80));
      } else if (selectedStage === "carrara_marble") {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#f8fafc");
        wallGrad.addColorStop(0.7, "#f1f5f9");
        wallGrad.addColorStop(1, "#e2e8f0");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const marbleGrad = ctx.createLinearGradient(0, groundY, 0, h);
        marbleGrad.addColorStop(0, "#ffffff");
        marbleGrad.addColorStop(0.3, "#f8fafc");
        marbleGrad.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = marbleGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();

        ctx.strokeStyle = "rgba(100, 116, 139, 0.18)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(w * 0.15, groundY);
        ctx.bezierCurveTo(w * 0.3, groundY + 60, w * 0.45, groundY + 110, w * 0.65, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.55, groundY);
        ctx.bezierCurveTo(w * 0.7, groundY + 45, w * 0.8, groundY + 130, w * 0.92, h);
        ctx.stroke();
      } else if (selectedStage === "architectural_podium") {
        const bgGrad = ctx.createRadialGradient(w / 2, h * 0.35, 40, w / 2, h * 0.35, w * 0.75);
        bgGrad.addColorStop(0, "#fbf7ff");
        bgGrad.addColorStop(0.6, "#f5e8ff");
        bgGrad.addColorStop(1, "#e9d5ff");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "rgba(107, 33, 168, 0.1)";
        ctx.beginPath();
        ctx.ellipse(w / 2, groundY + 140, w * 0.36, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        const podiumGrad = ctx.createLinearGradient(w * 0.15, 0, w * 0.85, 0);
        podiumGrad.addColorStop(0, "#f5d0fe");
        podiumGrad.addColorStop(0.4, "#ffffff");
        podiumGrad.addColorStop(1, "#e879f9");
        ctx.fillStyle = podiumGrad;

        ctx.beginPath();
        ctx.ellipse(w / 2, groundY, w * 0.32, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(w * 0.18, groundY, w * 0.64, 140);
        ctx.beginPath();
        ctx.ellipse(w / 2, groundY + 140, w * 0.32, 45, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedStage === "warm_oak") {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#fafaf9");
        wallGrad.addColorStop(1, "#e7e5e4");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const woodGrad = ctx.createLinearGradient(0, groundY, 0, h);
        woodGrad.addColorStop(0, "#d97706");
        woodGrad.addColorStop(0.5, "#b45309");
        woodGrad.addColorStop(1, "#78350f");
        ctx.fillStyle = woodGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const py = groundY + (h - groundY) * (i / 5);
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
          ctx.stroke();
        }
      } else if (selectedStage === "obsidian_neon") {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, w, h);

        const neonCyan = ctx.createRadialGradient(w * 0.2, groundY, 20, w * 0.2, groundY, w * 0.5);
        neonCyan.addColorStop(0, "rgba(6, 182, 212, 0.32)");
        neonCyan.addColorStop(1, "transparent");
        ctx.fillStyle = neonCyan;
        ctx.fillRect(0, 0, w, h);

        const neonMag = ctx.createRadialGradient(w * 0.8, groundY, 20, w * 0.8, groundY, w * 0.5);
        neonMag.addColorStop(0, "rgba(236, 72, 153, 0.32)");
        neonMag.addColorStop(1, "transparent");
        ctx.fillStyle = neonMag;
        ctx.fillRect(0, 0, w, h);

        const platGrad = ctx.createLinearGradient(0, groundY, 0, h);
        platGrad.addColorStop(0, "#1e293b");
        platGrad.addColorStop(1, "#0f172a");
        ctx.fillStyle = platGrad;
        ctx.fillRect(0, groundY, w, h - groundY);
      } else if (selectedStage === "botanical_sun") {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#fef3c7");
        wallGrad.addColorStop(1, "#fde68a");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        ctx.fillStyle = "#f5f5f4";
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.fillStyle = "rgba(120, 53, 15, 0.14)";
        ctx.beginPath();
        ctx.ellipse(w * 0.22, groundY - 70, 160, 240, 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(w * 0.78, groundY - 110, 180, 260, -0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedStage === "luxury_silk") {
        const silkGrad = ctx.createLinearGradient(0, 0, w, h);
        silkGrad.addColorStop(0, "#064e3b");
        silkGrad.addColorStop(0.3, "#047857");
        silkGrad.addColorStop(0.7, "#065f46");
        silkGrad.addColorStop(1, "#022c22");
        ctx.fillStyle = silkGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (selectedStage === "pastel_dream") {
        // High-end cosmetics & beauty studio softbox gradient
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#fdf2f8");
        wallGrad.addColorStop(0.5, "#fce7f3");
        wallGrad.addColorStop(1, "#fbcfe8");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
        floorGrad.addColorStop(0, "#ffffff");
        floorGrad.addColorStop(0.4, "#fdf2f8");
        floorGrad.addColorStop(1, "#f472b6");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        // Soft dual-studio fill light
        const softFill = ctx.createRadialGradient(w * 0.35, groundY - 80, 40, w * 0.35, groundY - 80, w * 0.55);
        softFill.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        softFill.addColorStop(1, "transparent");
        ctx.fillStyle = softFill;
        ctx.fillRect(0, 0, w, h);
      } else if (selectedStage === "odop_kota_stone") {
        // Honed greenish-buff Kota Stone pedestal stage
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#f8fafc");
        wallGrad.addColorStop(0.7, "#e2e8f0");
        wallGrad.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const stoneGrad = ctx.createLinearGradient(0, groundY, 0, h);
        stoneGrad.addColorStop(0, "#475569");
        stoneGrad.addColorStop(0.3, "#334155");
        stoneGrad.addColorStop(0.8, "#1e293b");
        stoneGrad.addColorStop(1, "#0f172a");
        ctx.fillStyle = stoneGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        // Center polished stone pedestal slab
        const pedW = w * 0.74;
        const pedX = (w - pedW) / 2;
        const pedTopY = groundY - 24;
        const pedGrad = ctx.createLinearGradient(pedX, pedTopY, pedX + pedW, groundY + 80);
        pedGrad.addColorStop(0, "#64748b");
        pedGrad.addColorStop(0.4, "#475569");
        pedGrad.addColorStop(1, "#334155");
        ctx.fillStyle = pedGrad;
        ctx.fillRect(pedX, pedTopY, pedW, 70);

        ctx.strokeStyle = "rgba(203, 213, 225, 0.6)";
        ctx.lineWidth = 2;
        ctx.strokeRect(pedX, pedTopY, pedW, 70);
      } else if (selectedStage === "odop_sandstone") {
        // Natural warm golden Jodhpur Sandstone slab
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#fef3c7");
        wallGrad.addColorStop(0.7, "#fde68a");
        wallGrad.addColorStop(1, "#fcd34d");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const sandGrad = ctx.createLinearGradient(0, groundY, 0, h);
        sandGrad.addColorStop(0, "#d97706");
        sandGrad.addColorStop(0.4, "#b45309");
        sandGrad.addColorStop(1, "#78350f");
        ctx.fillStyle = sandGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.strokeStyle = "rgba(254, 243, 199, 0.4)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();
      } else if (selectedStage === "odop_kota_doria") {
        // Translucent sheer royal silk drape
        const silkGrad = ctx.createLinearGradient(0, 0, w, h);
        silkGrad.addColorStop(0, "#fdf4ff");
        silkGrad.addColorStop(0.3, "#fae8ff");
        silkGrad.addColorStop(0.7, "#f5d0fe");
        silkGrad.addColorStop(1, "#e879f9");
        ctx.fillStyle = silkGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(234, 179, 8, 0.22)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 45) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 45) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      } else if (selectedStage === "odop_garlic") {
        // Organic farm & culinary rustic staging
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#fefce8");
        wallGrad.addColorStop(0.7, "#fef08a");
        wallGrad.addColorStop(1, "#fde047");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);

        const woodGrad = ctx.createLinearGradient(0, groundY, 0, h);
        woodGrad.addColorStop(0, "#92400e");
        woodGrad.addColorStop(0.4, "#78350f");
        woodGrad.addColorStop(1, "#451a03");
        ctx.fillStyle = woodGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.fillStyle = "rgba(217, 119, 6, 0.35)";
        ctx.fillRect(w * 0.15, groundY, w * 0.7, h - groundY);
      } else if (selectedStage === "solid_color") {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, w, h);

        const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
        floorGrad.addColorStop(0, "rgba(0, 0, 0, 0.02)");
        floorGrad.addColorStop(1, "rgba(0, 0, 0, 0.08)");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();
      } else if (selectedStage === "studio_gradient") {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        bgGrad.addColorStop(0, gradientStart);
        bgGrad.addColorStop(1, gradientEnd);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, groundY);

        const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
        floorGrad.addColorStop(0, gradientEnd);
        floorGrad.addColorStop(1, gradientStart);
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();
      } else if (selectedStage === "custom_backdrop") {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        bgGrad.addColorStop(0, "#f8fafc");
        bgGrad.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, groundY);

        const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
        floorGrad.addColorStop(0, "#ffffff");
        floorGrad.addColorStop(1, "#94a3b8");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, groundY, w, h - groundY);
      } else {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        wallGrad.addColorStop(0, "#f8fafc");
        wallGrad.addColorStop(1, "#e2e8f0");
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, groundY);
        const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
        floorGrad.addColorStop(0, "#ffffff");
        floorGrad.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, groundY, w, h - groundY);
      }
      ctx.restore();
    };

    // STEP 2: DRAW PRODUCT, LIGHTING & CONTACT SHADOWS
    const drawForeground = () => {
      if (useCutout && !cutoutImage) {
        if (isProcessingCutout || isTransforming || isAnalyzingGemini) {
          ctx.save();
          ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px 'Inter', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("✨ Isolating Product Foreground...", targetW / 2, targetH / 2 - 10);
          ctx.font = "16px 'Inter', sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillText("Removing casual photo background & staging 3D product", targetW / 2, targetH / 2 + 25);
          ctx.restore();
          return;
        }
      }

      const activeImgSrc = useCutout && cutoutImage ? cutoutImage : sourceImage;
      if (!activeImgSrc) return;

      const pImg = new Image();
      pImg.crossOrigin = "anonymous";
      pImg.src = activeImgSrc;
      pImg.onload = () => {
        const groundY = targetH * 0.72;

        // Commercial framing: ensure product is boldly scaled and clearly visible
        const baseCoverage = 0.84;
        const scaleMult = productScale / 100;
        const maxAllowedW = targetW * baseCoverage * scaleMult;
        const maxAllowedH = targetH * baseCoverage * scaleMult;
        const aspect = pImg.naturalWidth / (pImg.naturalHeight || 1);

        let renderW, renderH;
        if (aspect >= 1) {
          renderW = maxAllowedW;
          renderH = renderW / aspect;
          if (renderH > maxAllowedH) {
            renderH = maxAllowedH;
            renderW = renderH * aspect;
          }
        } else {
          renderH = maxAllowedH;
          renderW = renderH * aspect;
          if (renderW > maxAllowedW) {
            renderW = maxAllowedW;
            renderH = renderW / aspect;
          }
        }

        const renderX = (targetW - renderW) / 2 + offsetX;
        const renderY = groundY - renderH + offsetY;
        const centerX = renderX + renderW / 2;
        const centerY = renderY + renderH / 2;

        // A. GROUND REFLECTION
        if (groundReflection > 0 && selectedStage !== "amazon_pure_white") {
          ctx.save();
          const offRefl = document.createElement("canvas");
          offRefl.width = Math.max(1, Math.ceil(renderW));
          offRefl.height = Math.max(1, Math.ceil(renderH));
          const offCtx = offRefl.getContext("2d");

          offCtx.save();
          offCtx.translate(0, renderH);
          offCtx.scale(1, -1);
          offCtx.drawImage(pImg, 0, 0, renderW, renderH);
          offCtx.restore();

          offCtx.globalCompositeOperation = "destination-in";
          const reflMask = offCtx.createLinearGradient(0, 0, 0, renderH * 0.5);
          reflMask.addColorStop(0, "rgba(0,0,0,0.85)");
          reflMask.addColorStop(1, "rgba(0,0,0,0)");
          offCtx.fillStyle = reflMask;
          offCtx.fillRect(0, 0, renderW, renderH);

          ctx.globalAlpha = (groundReflection / 100) * 0.45;
          ctx.drawImage(offRefl, renderX, groundY + offsetY * 0.2);
          ctx.restore();
        }

        // B. DIRECTIONAL CAST SHADOW
        if (castShadowIntensity > 0) {
          ctx.save();
          const rad = (castShadowAngle * Math.PI) / 180;
          const shadowDist = 32;
          const sx = Math.cos(rad) * shadowDist;
          const sy = Math.sin(rad) * shadowDist;

          ctx.fillStyle = `rgba(15, 23, 42, ${(castShadowIntensity / 100) * 0.4})`;
          ctx.beginPath();
          ctx.ellipse(
            centerX + sx,
            groundY + 16 + sy * 0.3,
            renderW * 0.4,
            15,
            rad * 0.2,
            0,
            Math.PI * 2
          );
          ctx.filter = `blur(${contactShadowBlur + 6}px)`;
          ctx.fill();
          ctx.filter = "none";
          ctx.restore();
        }

        // C. REALISTIC GROUND CONTACT SHADOW
        if (contactShadowIntensity > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(15, 23, 42, ${(contactShadowIntensity / 100) * 0.75})`;
          ctx.beginPath();
          ctx.ellipse(
            centerX,
            groundY + offsetY * 0.2 + 8,
            renderW * 0.35,
            10,
            0,
            0,
            Math.PI * 2
          );
          ctx.filter = `blur(${contactShadowBlur}px)`;
          ctx.fill();
          ctx.filter = "none";
          ctx.restore();
        }

        // D. DRAW PRODUCT FOREGROUND WITH CAMERA LEVEL/ROTATION, PERSPECTIVE PITCH & STUDIO RIM GLOW
        ctx.save();
        ctx.translate(centerX, centerY);

        // 1. Camera Level / Roll Rotation (straighten tilted shots)
        if (rotationAngle !== 0) {
          ctx.rotate((rotationAngle * Math.PI) / 180);
        }

        // 2. Camera Perspective Pitch / Tilt (correct steep top-down handheld phone angle)
        if (perspectiveTilt !== 0) {
          const tiltRad = (perspectiveTilt * Math.PI) / 180;
          const skewX = Math.sin(tiltRad) * 0.14;
          ctx.transform(1, 0, skewX, Math.cos(tiltRad), 0, 0);
        }

        // 3. Studio Lighting Filters & Specular Rim Glow
        const rimPx = Math.round((rimGlowIntensity / 100) * 12);
        const rimAlpha = ((rimGlowIntensity / 100) * 0.55).toFixed(2);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) drop-shadow(0 0 ${rimPx}px rgba(255,255,255,${rimAlpha}))`;
        ctx.drawImage(pImg, -renderW / 2, -renderH / 2, renderW, renderH);
        ctx.filter = "none";

        // E. WHITE BALANCE TINT
        if (temperature !== 0) {
          ctx.globalCompositeOperation = temperature > 0 ? "screen" : "color";
          ctx.fillStyle =
            temperature > 0
              ? `rgba(251, 191, 36, ${Math.abs(temperature) * 0.003})`
              : `rgba(96, 165, 250, ${Math.abs(temperature) * 0.003})`;
          ctx.fillRect(-renderW / 2, -renderH / 2, renderW, renderH);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.restore();

        // F. STUDIO CALLOUT BADGE
        if (badgeText.trim()) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
          const badgeW = Math.min(440, badgeText.length * 15 + 60);
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(50, targetH - 120, badgeW, 60, 14);
          } else {
            ctx.fillRect(50, targetH - 120, badgeW, 60);
          }
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 22px 'Inter', sans-serif";
          ctx.fillText(`✓ ${badgeText.toUpperCase()}`, 75, targetH - 82);
        }

        // G. AMAZON 85% FRAME GUIDELINE
        if (showAmazonGuidelines) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          const pad = targetW * 0.075;
          ctx.strokeRect(pad, pad, targetW - pad * 2, targetH - pad * 2);
          ctx.setLineDash([]);

          ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
          ctx.font = "14px 'Inter', sans-serif";
          ctx.fillText("Amazon 85% Safe Frame Zone", pad + 10, pad + 25);
        }

        // H. BEFORE / AFTER SPLIT COMPARISON SLIDER
        if (isSplitView && sourceImage) {
          const splitX = (targetW * splitPos) / 100;
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, targetH);
          ctx.clip();

          const rawImg = new Image();
          rawImg.crossOrigin = "anonymous";
          rawImg.src = sourceImage;
          rawImg.onload = () => {
            ctx.drawImage(rawImg, 0, 0, targetW, targetH);

            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(30, 30, 180, 38);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px 'Inter', sans-serif";
            ctx.fillText("📷 RAW PHONE SHOT", 45, 54);

            ctx.restore();
            ctx.save();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(splitX, 0);
            ctx.lineTo(splitX, targetH);
            ctx.stroke();

            ctx.fillStyle = "rgba(79, 70, 229, 0.85)";
            ctx.fillRect(targetW - 220, 30, 190, 38);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px 'Inter', sans-serif";
            ctx.fillText("✨ AI STUDIO SHOOT", targetW - 205, 54);
            ctx.restore();
          };
          return;
        }

        ctx.restore();
      };
    };

    renderStudioStage();
  }, [
    sourceImage,
    cutoutImage,
    useCutout,
    selectedStage,
    solidColor,
    gradientStart,
    gradientEnd,
    customBackdropImage,
    contactShadowIntensity,
    contactShadowBlur,
    castShadowIntensity,
    castShadowAngle,
    groundReflection,
    rimGlowIntensity,
    brightness,
    contrast,
    saturation,
    temperature,
    rotationAngle,
    perspectiveTilt,
    offsetX,
    offsetY,
    productScale,
    aspectRatio,
    badgeText,
    showAmazonGuidelines,
    isSplitView,
    splitPos,
  ]);

  const handleCanvasClick = (e) => {
    if (!magicWandActive) return;
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasClickX = (e.clientX - rect.left) * scaleX;
    const canvasClickY = (e.clientY - rect.top) * scaleY;

    handlePerformCutout(canvasClickX, canvasClickY);
    setMagicWandActive(false);
  };

  const handleDownload = (format = "jpeg") => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    const mime = format === "png" ? "image/png" : "image/jpeg";
    const ext = format === "png" ? "png" : "jpg";
    const quality = format === "png" ? undefined : 0.95;

    const link = document.createElement("a");
    link.download = `Studio_Shoot_${selectedStage}_${Date.now()}.${ext}`;
    link.href = canvas.toDataURL(mime, quality);
    link.click();
  };

  const handleDownloadCutout = () => {
    if (!cutoutImage) return;
    const link = document.createElement("a");
    link.download = `Transparent_Product_Cutout_${Date.now()}.png`;
    link.href = cutoutImage;
    link.click();
  };

  const handleConfirmPlaceOnProduct = async () => {
    if (!selectedTargetProductId) {
      alert("Please select a target product in the catalogue.");
      return;
    }
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    try {
      setIsSavingToCatalogue(true);
      const studioDataUrl = canvas.toDataURL("image/jpeg", 0.92);

      const res = await applyStudioImageToProduct({
        productId: selectedTargetProductId,
        imageUrl: studioDataUrl,
        backgroundType: selectedStage === "amazon_pure_white" ? "white" : "studio",
      });

      setActionSuccessMessage(
        res.message || "Studio photo successfully placed onto catalogue product!"
      );
      setIsPlaceModalOpen(false);
      setTimeout(() => setActionSuccessMessage(""), 5000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      alert("Failed to place image on catalogue product: " + errMsg);
    } finally {
      setIsSavingToCatalogue(false);
    }
  };

  const handleConfirmCreateProduct = async () => {
    if (!newProductForm.name) {
      alert("Product name is required.");
      return;
    }
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    try {
      setIsSavingToCatalogue(true);
      const studioDataUrl = canvas.toDataURL("image/jpeg", 0.92);

      const res = await createProductFromStudio({
        ...newProductForm,
        companyId: selectedCompanyId,
        imageUrl: studioDataUrl,
      });

      setActionSuccessMessage(
        res.message || `New product '${res.data?.name}' created successfully in catalogue!`
      );
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccessMessage(""), 5000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      alert("Failed to create product from studio: " + errMsg);
    } finally {
      setIsSavingToCatalogue(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="main-content" style={{ maxWidth: "1680px", margin: "0 auto", padding: "0.75rem 1.25rem" }}>
      {/* Studio Header Bar */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "0.75rem",
          padding: "0.55rem 1rem",
          background: "linear-gradient(135deg, rgba(67, 56, 202, 0.08) 0%, rgba(126, 34, 206, 0.08) 100%)",
          border: "1px solid rgba(67, 56, 202, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span
            style={{
              background: "var(--primary-gradient)",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            <Sparkles size={14} /> AI STUDIO PRO
          </span>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Commercial Product Photography Suite
          </span>
          {/* Gemini Vision AI badge commented out */}
          {/*
          <span className="status-pill approved" style={{ fontSize: "0.72rem", padding: "2px 8px" }}>
            ✨ Gemini Vision AI
          </span>
          */}
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setExpandAllPanels(!expandAllPanels)}
            title="Toggle between compact tabbed inspectors and all panels"
            style={{ fontSize: "0.78rem" }}
          >
            <Layers size={13} /> {expandAllPanels ? "Tabs View" : "Expand All"}
          </button>
          {/* Gemini API Key button commented out */}
          {/*
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsConfiguringApiKey(true)}
            style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem" }}
            title="Configure optional custom Gemini API Key"
          >
            <Key size={13} /> {geminiApiKey ? "Key Set" : "Add Key"}
          </button>
          */}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsPlaceModalOpen(true)}
            style={{ fontWeight: 600, fontSize: "0.78rem" }}
          >
            <FolderPlus size={14} /> Place on Product
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ fontWeight: 600, fontSize: "0.78rem" }}
          >
            <Plus size={14} /> Create Product
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleDownload("jpeg")}
            style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem" }}
          >
            <Download size={14} /> Download Master
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div
          className="card"
          style={{
            background: "rgba(4, 120, 87, 0.12)",
            border: "1px solid rgba(4, 120, 87, 0.4)",
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.25rem",
            marginBottom: "1.5rem",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{actionSuccessMessage}</span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/companies/${selectedCompanyId}/catalogue`)}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            View in Catalogue <ExternalLink size={13} />
          </button>
        </div>
      )}

      {/* 3-COLUMN STUDIO WORKBENCH */}
      <div className="ai-studio-layout">
        {/* ========================================================
            LEFT COLUMN: SOURCE IMAGE & GEMINI DIRECTOR
           ======================================================== */}
        <div className="studio-scroll-panel" style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto", paddingRight: "4px" }}>
          {/* Left Inspector Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px",
              padding: "4px",
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "0.25rem",
            }}
          >
            {[
              { id: "photo", label: "Photo & Cut", icon: Camera },
              { id: "framing", label: "Framing", icon: Move },
              { id: "upscale", label: "HD Res", icon: Maximize2 },
              // { id: "gemini", label: "AI Director", icon: Bot }, // Gemini AI Director commented out
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = leftActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLeftActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "6px 2px",
                    fontSize: "0.74rem",
                    fontWeight: isActive ? 750 : 600,
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 🌟 GEMINI AI VISION DIRECTOR HERO CARD (Commented out - AI features disabled) */}
          {/*
          {(expandAllPanels || leftActiveTab === "gemini") && (
            <div className="card">...</div>
          )}
          */}

          {/* 1. Upload or Select Phone Shot & 2. Cutout */}
          {(expandAllPanels || leftActiveTab === "photo") && (
            <>
              <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                1. Select or Upload Phone Photo
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>JPG / PNG</span>
            </div>

            <label
              style={{
                border: "2px dashed var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                background: "var(--bg-surface-elevated)",
              }}
            >
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
              <Camera size={26} color="var(--primary)" />
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Click to upload phone photo
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Gemini automatically detects &amp; stages the product
              </div>
            </label>

            {/* Quick Demo Samples */}
            <div style={{ marginTop: "1rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Or test with sample product photos:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.4rem" }}>
                {DEMO_PHONE_SHOTS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    title={demo.name}
                    onClick={() => {
                      setSourceImage(demo.url);
                      setCutoutImage(demo.cutout || null);
                      setUseCutout(true);
                      setIsUpscaled(false);
                      setUpscaleStats(null);
                      setRotationAngle(0);
                      setPerspectiveTilt(0);
                      setOffsetX(0);
                      if (!demo.cutout) {
                        handleNeuralCutoutOnly(demo.url);
                      }
                    }}
                    style={{
                      padding: 0,
                      border: sourceImage === demo.url ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      cursor: "pointer",
                      height: "48px",
                      background: "transparent",
                    }}
                  >
                    <img src={demo.url} alt={demo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. AI Cutout / Background Extraction Controls */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                2. Background Cutout
              </label>
              <span
                className={`status-pill ${useCutout ? "approved" : "draft"}`}
                style={{
                  fontSize: "0.70rem",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  padding: "3px 8px",
                  lineHeight: "1.2",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {useCutout ? "Cutout Active" : "Full Photo"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.85rem" }}>
              <button
                type="button"
                className={`btn btn-sm ${!useCutout ? "btn-primary" : "btn-outline"}`}
                onClick={() => setUseCutout(false)}
                style={{ fontSize: "0.78rem", fontWeight: 650 }}
              >
                📸 Full Photo
              </button>
              <button
                type="button"
                className={`btn btn-sm ${useCutout ? "btn-primary" : "btn-outline"}`}
                onClick={() => {
                  if (!cutoutImage) {
                    handleTransformToStudioShoot();
                  } else {
                    setUseCutout(true);
                  }
                }}
                style={{ fontSize: "0.78rem", fontWeight: 650 }}
              >
                ✨ AI Cutout
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.85rem" }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleTransformToStudioShoot()}
                disabled={isTransforming || isProcessingCutout}
                style={{ justifyContent: "center" }}
              >
                <Scissors size={14} />
                <span>{isTransforming ? "Neural Processing..." : "Re-Extract with Neural AI"}</span>
              </button>

              <button
                className={`btn btn-sm ${magicWandActive ? "btn-primary" : "btn-outline"}`}
                onClick={() => setMagicWandActive(!magicWandActive)}
                style={{ justifyContent: "center" }}
              >
                <MousePointer size={14} />
                <span>{magicWandActive ? "Click on Background in Canvas..." : "Magic Wand (Click background to erase)"}</span>
              </button>

              {cutoutImage && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleResetCutout}
                  style={{ justifyContent: "center", color: "var(--text-muted)" }}
                >
                  <RotateCcw size={13} /> Reset to Original Photo
                </button>
              )}
            </div>

            {cutoutImage && (
              <button
                className="btn btn-outline btn-sm"
                onClick={handleDownloadCutout}
                style={{ width: "100%", fontSize: "0.78rem", justifyContent: "center", marginTop: "4px" }}
              >
                <Download size={13} /> Download Transparent PNG
              </button>
            )}
              </div>
            </>
          )}

          {/* 3. Super-Resolution HD Upscale & Sharpening */}
          {(expandAllPanels || leftActiveTab === "upscale") && (
            <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                <Maximize2 size={16} color="var(--primary)" />
                3. HD Upscale Engine
              </label>
              <span
                className={`status-pill ${isUpscaled ? "approved" : "draft"}`}
                style={{
                  fontSize: "0.70rem",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  padding: "3px 8px",
                  lineHeight: "1.2",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {isUpscaled ? `HD (${upscaleScale}x)` : "Native Res"}
              </span>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0 0 0.75rem 0", lineHeight: 1.4 }}>
              Upscales product foreground using sub-pixel Lanczos interpolation, dual-pass unsharp masking, and HDR tone contrast for crystal-clear catalogue presentation.
            </p>

            {/* Scale Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <button
                type="button"
                className={`btn btn-sm ${upscaleScale === 2 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setUpscaleScale(2)}
                style={{ fontSize: "0.78rem", fontWeight: 700 }}
              >
                ⚡ 2x High-Def
              </button>
              <button
                type="button"
                className={`btn btn-sm ${upscaleScale === 4 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setUpscaleScale(4)}
                style={{ fontSize: "0.78rem", fontWeight: 700 }}
              >
                💎 4x Ultra-HD
              </button>
            </div>

            {/* Action Buttons */}
            <button
              className="btn btn-primary btn-sm"
              style={{ width: "100%", justifyContent: "center", fontWeight: 750, padding: "8px 12px", marginBottom: "0.5rem" }}
              onClick={() => handleUpscaleAndEnhance(upscaleScale)}
              disabled={isUpscaling || isTransforming || isProcessingCutout}
            >
              {isUpscaling ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Enhancing Micro-Textures &amp; HD...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>{isUpscaled ? `Re-Enhance ${upscaleScale}x HD Details` : `Upscale Product to ${upscaleScale}x HD`}</span>
                </>
              )}
            </button>

            {/* Status / Reset */}
            {isUpscaled && (
              <div
                style={{
                  padding: "0.5rem 0.65rem",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.74rem",
                }}
              >
                <div style={{ color: "#059669", fontWeight: 650 }}>
                  ✓ {upscaleScale}x HD Texture Sharpened
                  {upscaleStats && (
                    <div style={{ fontSize: "0.68rem", opacity: 0.85, fontWeight: 400 }}>
                      {upscaleStats.from} → {upscaleStats.to} ({upscaleStats.durationMs}ms)
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setIsUpscaled(false);
                    setUpscaleStats(null);
                  }}
                  style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                >
                  Reset
                </button>
              </div>
            )}
            </div>
          )}

          {/* 4. Camera Angle, Tilt & Framing */}
          {(expandAllPanels || leftActiveTab === "framing") && (
            <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Compass size={16} color="var(--primary)" />
                4. Camera Angle, Tilt &amp; Framing
              </label>
              {(rotationAngle !== 0 || perspectiveTilt !== 0 || offsetX !== 0) && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setRotationAngle(0);
                    setPerspectiveTilt(0);
                    setOffsetX(0);
                  }}
                  style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                >
                  Reset Angles
                </button>
              )}
            </div>

            {/* Camera Level / Roll Rotation */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Level Rotation (Roll):</span>
                <span style={{ fontWeight: 700, color: rotationAngle !== 0 ? "var(--primary)" : "inherit" }}>
                  {rotationAngle > 0 ? `+${rotationAngle}°` : `${rotationAngle}°`}
                </span>
              </div>
              <input
                type="range"
                min={-45}
                max={45}
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                <span>-45° Tilt Left</span>
                <span style={{ cursor: "pointer", color: "var(--primary)" }} onClick={() => setRotationAngle(0)}>
                  0° Level
                </span>
                <span>+45° Tilt Right</span>
              </div>
            </div>

            {/* Camera Perspective Pitch / Tilt */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Camera Perspective Tilt (Pitch):</span>
                <span style={{ fontWeight: 700, color: perspectiveTilt !== 0 ? "var(--primary)" : "inherit" }}>
                  {perspectiveTilt > 0 ? `+${perspectiveTilt}° (Upright)` : perspectiveTilt < 0 ? `${perspectiveTilt}° (Down)` : "0° Eye-Level"}
                </span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                value={perspectiveTilt}
                onChange={(e) => setPerspectiveTilt(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                <span>Top-Down Phone Shot</span>
                <span style={{ cursor: "pointer", color: "var(--primary)" }} onClick={() => setPerspectiveTilt(0)}>
                  0° Eye-Level
                </span>
                <span>Low-Angle Hero</span>
              </div>
            </div>

            {/* Horizontal Alignment */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Horizontal Center (X):</span>
                <span style={{ fontWeight: 700 }}>{offsetX > 0 ? `+${offsetX}` : offsetX}px</span>
              </div>
              <input
                type="range"
                min={-150}
                max={150}
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            {/* Vertical Grounding */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Ground Elevation (Y):</span>
                <span style={{ fontWeight: 700 }}>{offsetY > 0 ? `+${offsetY}` : offsetY}px</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            {/* Product Zoom Scale */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Product Zoom Scale:</span>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>{productScale}% (Clearly Visible)</span>
              </div>
              <input
                type="range"
                min={50}
                max={180}
                value={productScale}
                onChange={(e) => setProductScale(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                {[
                  { label: "Fit 85%", val: 85 },
                  { label: "Hero 105%", val: 105 },
                  { label: "Bold 130%", val: 130 },
                  { label: "Macro 155%", val: 155 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setProductScale(s.val)}
                    className="btn btn-outline btn-sm"
                    style={{
                      flex: 1,
                      fontSize: "0.68rem",
                      padding: "2px 4px",
                      background: productScale === s.val ? "rgba(79, 70, 229, 0.15)" : undefined,
                      borderColor: productScale === s.val ? "var(--primary)" : undefined,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Aspect Ratio */}
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Catalogue Aspect Ratio:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.35rem" }}>
                {[
                  { id: "1:1", label: "1:1 Square", note: "Amazon / Flipkart" },
                  { id: "4:5", label: "4:5 Portrait", note: "Instagram / D2C" },
                  { id: "3:4", label: "3:4 Vertical", note: "Lookbook" },
                  { id: "16:9", label: "16:9 Banner", note: "Web Hero" },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`btn btn-sm ${aspectRatio === ratio.id ? "btn-primary" : "btn-outline"}`}
                    style={{ flexDirection: "column", padding: "5px 3px", fontSize: "0.75rem" }}
                  >
                    <span style={{ fontWeight: 700 }}>{ratio.label}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>{ratio.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* ========================================================
            CENTER COLUMN: LIVE INTERACTIVE CANVAS STAGE (STICKY & ZERO-SCROLL)
           ======================================================== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "center", position: "sticky", top: "70px" }}>
          {/* Viewport Control Bar */}
          <div
            className="card"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.45rem 0.85rem",
              background: "var(--bg-glass)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                className={`btn btn-sm ${isSplitView ? "btn-primary" : "btn-outline"}`}
                onClick={() => setIsSplitView(!isSplitView)}
                title="Toggle Before vs After comparison split"
                style={{ fontSize: "0.74rem", padding: "3px 8px" }}
              >
                <SplitSquareVertical size={13} />
                <span>Split View</span>
              </button>

              <button
                className={`btn btn-sm ${showAmazonGuidelines ? "btn-primary" : "btn-outline"}`}
                onClick={() => setShowAmazonGuidelines(!showAmazonGuidelines)}
                title="Show 85% safe frame guideline"
                style={{ fontSize: "0.74rem", padding: "3px 8px" }}
              >
                <Eye size={13} />
                <span>Safe Frame</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span className="studio-badge-pill" style={{ fontSize: "0.70rem", padding: "2px 8px" }}>
                📐 {aspectRatio} ({aspectRatio === "1:1" ? "1200x1200" : aspectRatio === "4:5" ? "1080x1350" : aspectRatio === "3:4" ? "1200x1600" : "1920x1080"})
              </span>
            </div>
          </div>

          {/* Interactive Live Canvas Stage */}
          <div
            ref={containerRef}
            className="studio-canvas-stage"
            style={{
              width: "100%",
              maxWidth: "420px",
              maxHeight: "calc(100vh - 235px)",
              aspectRatio:
                aspectRatio === "1:1"
                  ? "1/1"
                  : aspectRatio === "4:5"
                  ? "4/5"
                  : aspectRatio === "3:4"
                  ? "3/4"
                  : "16/9",
              position: "relative",
              cursor: magicWandActive ? "crosshair" : "default",
            }}
            onClick={handleCanvasClick}
            onMouseMove={(e) => {
              if (isDraggingSplit && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSplitPos(Math.max(5, Math.min(95, pos)));
              }
            }}
            onMouseUp={() => setIsDraggingSplit(false)}
            onMouseLeave={() => setIsDraggingSplit(false)}
          >
            <canvas
              ref={outputCanvasRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />

            {/* Split Slider Handle */}
            {isSplitView && (
              <div
                className="split-slider-line"
                style={{ left: `${splitPos}%` }}
                onMouseDown={() => setIsDraggingSplit(true)}
              >
                <div className="split-slider-handle">
                  <SplitSquareVertical size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Feature Badge Ribbon Box */}
          <div className="card" style={{ width: "100%", padding: "0.6rem 0.85rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                Feature Ribbon:
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 100% PURE TITANIUM, 1-YEAR WARRANTY"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                style={{ flex: 1, padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
              />
              {badgeText && (
                <button className="btn btn-outline btn-sm" onClick={() => setBadgeText("")} title="Clear Ribbon" style={{ padding: "3px 6px" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Quick Preset Badges */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Presets:
              </span>
              {[
                "100% Titanium",
                "Waterproof IP68",
                "Luxury Grade",
                "Official Warranty",
              ].map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setBadgeText(badge.toUpperCase())}
                  className="btn btn-sm"
                  style={{
                    fontSize: "0.66rem",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-full)",
                    background: badgeText === badge.toUpperCase() ? "var(--primary-light)" : "var(--bg-surface-elevated)",
                    color: badgeText === badge.toUpperCase() ? "var(--primary)" : "var(--text-secondary)",
                    border: badgeText === badge.toUpperCase() ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                    fontWeight: 650,
                  }}
                >
                  + {badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: STAGE PRESETS & LIGHTING RIGS
           ======================================================== */}
        <div className="ai-studio-right-panel studio-scroll-panel" style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto", paddingRight: "4px" }}>
          {/* Right Inspector Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px",
              padding: "4px",
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "0.25rem",
            }}
          >
            {[
              { id: "stages", label: "Stages (15)", icon: Layers },
              { id: "lighting", label: "Lighting Rig", icon: Sun },
              { id: "retouch", label: "Color & HDR", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = rightActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRightActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "6px 2px",
                    fontSize: "0.74rem",
                    fontWeight: isActive ? 750 : 600,
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 5. Studio Stage Selection */}
          {(expandAllPanels || rightActiveTab === "stages") && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  5. Studio Environment &amp; Stage
                </label>
                <span className="status-pill validated" style={{ fontSize: "0.7rem" }}>
                  {STUDIO_STAGES.length} Presets
                </span>
            </div>

            <div className="studio-scene-grid">
              {STUDIO_STAGES.map((stg) => {
                const isSelected = selectedStage === stg.id;
                return (
                  <div
                    key={stg.id}
                    className={`studio-scene-pill ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedStage(stg.id);
                      if (stg.id === "custom_ai" && !customAiBgUrl) {
                        handleGenerateAiScene();
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {stg.name}
                      </span>
                      {isSelected && <Check size={14} color="var(--primary)" />}
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "1px 6px",
                        borderRadius: "var(--radius-sm)",
                        background: `${stg.badgeColor}22`,
                        color: stg.badgeColor,
                        fontWeight: 650,
                      }}
                    >
                      {stg.tag}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Custom Studio Color Controls */}
            {selectedStage === "solid_color" && (
              <div
                style={{
                  marginTop: "0.85rem",
                  padding: "0.85rem",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Studio Cyclorama Backdrop Color:
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    style={{ width: "40px", height: "34px", padding: 0, border: "none", cursor: "pointer", borderRadius: "4px" }}
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="input-field"
                    style={{ fontSize: "0.8rem", textTransform: "uppercase" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#fef3c7", "#ecfdf5", "#eff6ff", "#0f172a"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSolidColor(c)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: c,
                        border: solidColor === c ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Studio Duo-Tone Gradient Controls */}
            {selectedStage === "studio_gradient" && (
              <div
                style={{
                  marginTop: "0.85rem",
                  padding: "0.85rem",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Studio Softbox Gradient Colors:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>Top Wall:</span>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        style={{ width: "28px", height: "28px", padding: 0, border: "none", cursor: "pointer" }}
                      />
                      <input
                        type="text"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="input-field"
                        style={{ fontSize: "0.74rem", padding: "3px 6px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>Floor Horizon:</span>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        style={{ width: "28px", height: "28px", padding: 0, border: "none", cursor: "pointer" }}
                      />
                      <input
                        type="text"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="input-field"
                        style={{ fontSize: "0.74rem", padding: "3px 6px" }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {[
                    { label: "Studio Soft", start: "#ffffff", end: "#e2e8f0" },
                    { label: "Warm Gold", start: "#fef3c7", end: "#d97706" },
                    { label: "Rose Luxe", start: "#fdf2f8", end: "#ec4899" },
                    { label: "Dark Cyber", start: "#1e1b4b", end: "#0f172a" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setGradientStart(preset.start);
                        setGradientEnd(preset.end);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Backdrop Image Upload */}
            {selectedStage === "custom_backdrop" && (
              <div
                style={{
                  marginTop: "0.85rem",
                  padding: "0.85rem",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Upload Custom Studio Surface / Backdrop:
                </div>
                <label
                  className="upload-dropzone"
                  style={{
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    border: "1px dashed var(--border-medium)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBackdropUpload}
                    style={{ display: "none" }}
                  />
                  <Upload size={18} color="var(--primary)" />
                  <span style={{ fontSize: "0.76rem", fontWeight: 600 }}>Click to upload surface image</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>JPEG, PNG, or WEBP</span>
                </label>
                {customBackdropImage && (
                  <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 600 }}>Custom backdrop active</span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setCustomBackdropImage(null)}
                      style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {/* 6. Physics Ground Shadow & Lighting Engine */}
          {(expandAllPanels || rightActiveTab === "lighting") && (
            <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <Sun size={16} color="var(--primary)" />
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                6. Lighting Rig &amp; Contact Shadows
              </label>
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span>Contact Occlusion Shadow:</span>
                <span style={{ fontWeight: 700 }}>{contactShadowIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={contactShadowIntensity}
                onChange={(e) => setContactShadowIntensity(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span>Directional Softbox Shadow:</span>
                <span style={{ fontWeight: 700 }}>{castShadowIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={castShadowIntensity}
                onChange={(e) => setCastShadowIntensity(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span>Floor Reflection Sheen:</span>
                <span style={{ fontWeight: 700 }}>{groundReflection}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={groundReflection}
                onChange={(e) => setGroundReflection(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span>Specular Rim Light Glow:</span>
                <span style={{ fontWeight: 700 }}>{rimGlowIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={rimGlowIntensity}
                onChange={(e) => setRimGlowIntensity(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            </div>
          )}

          {/* 7. Color Grading & HDR Engine */}
          {(expandAllPanels || rightActiveTab === "retouch") && (
            <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <Sliders size={16} color="var(--primary)" />
              <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                7. Color Grading &amp; HDR Engine
              </label>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Studio Key Light Brightness:</span>
                <span style={{ fontWeight: 700 }}>{brightness}%</span>
              </div>
              <input
                type="range"
                min={80}
                max={130}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>HDR Texture Contrast &amp; Depth:</span>
                <span style={{ fontWeight: 700 }}>{contrast}%</span>
              </div>
              <input
                type="range"
                min={80}
                max={135}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>Color Vibrance / Saturation:</span>
                <span style={{ fontWeight: 700 }}>{saturation}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={140}
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>
                <span>White Balance Daylight Tint:</span>
                <span style={{ fontWeight: 700 }}>{temperature > 0 ? "Warm 3200K" : temperature < 0 ? "Cool 6500K" : "Neutral 5500K"}</span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MODAL: CONFIGURE GEMINI API KEY (Commented out - AI disabled)
         ======================================================== */}
      {/*
      {isConfiguringApiKey && (
        <div className="drawer-backdrop" onClick={() => setIsConfiguringApiKey(false)}>
          ...
        </div>
      )}
      */}

      {/* ========================================================
          MODAL: PLACE ON EXISTING CATALOGUE PRODUCT
         ======================================================== */}
      {isPlaceModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsPlaceModalOpen(false)}>
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "680px",
              width: "100%",
              margin: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-medium)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "rgba(79, 70, 229, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FolderPlus size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    Place Studio Photo on Catalogue Product
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Select target listing from your catalogue to update with this enhanced master image
                  </span>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsPlaceModalOpen(false)}
                style={{ padding: "6px", borderRadius: "var(--radius-full)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Studio Image Live Preview Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  border: "1px solid var(--border-medium)",
                  background: "#ffffff",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {outputCanvasRef.current ? (
                  <img
                    src={outputCanvasRef.current.toDataURL("image/jpeg", 0.7)}
                    alt="New Studio Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Sparkles size={20} color="var(--primary)" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span className="status-pill approved" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>
                    ✓ Studio Master Ready
                  </span>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    {aspectRatio} Stage • {selectedStage.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)" }}>
                  This studio photo will replace the primary image for the selected product.
                </div>
              </div>
            </div>

            {/* Search Input Filter */}
            <div style={{ marginBottom: "0.85rem", position: "relative" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Search catalogue by product name, SKU, or brand..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="input-field"
                  style={{
                    paddingLeft: "36px",
                    paddingRight: productSearchQuery ? "32px" : "12px",
                    fontSize: "0.85rem",
                    width: "100%",
                  }}
                />
                {productSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setProductSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", padding: "0 2px" }}>
                <span>Showing {filteredProducts.length} of {products.length} products</span>
                {selectedTargetProductId && (
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>1 product selected</span>
                )}
              </div>
            </div>

            {/* Scrollable Visual Product Picker List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                maxHeight: "260px",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
                paddingRight: "4px",
                marginBottom: "1.25rem",
              }}
            >
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <Package size={32} style={{ margin: "0 auto 8px auto", opacity: 0.4, display: "block" }} />
                  No products found matching "{productSearchQuery}"
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedTargetProductId === p._id;
                  const thumb = p.image || (p.images && p.images[0]?.url);
                  return (
                    <div
                      key={p._id}
                      onClick={() => setSelectedTargetProductId(p._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 0.85rem",
                        borderRadius: "var(--radius-md)",
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                        background: isSelected ? "rgba(79, 70, 229, 0.06)" : "var(--bg-surface)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "var(--radius-sm)",
                          background: "#ffffff",
                          border: "1px solid var(--border-subtle)",
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {thumb ? (
                          <img src={thumb} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Package size={18} color="var(--text-muted)" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? "var(--primary)" : "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={p.name}
                        >
                          {p.name}
                        </div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              fontFamily: "monospace",
                              padding: "1px 5px",
                              borderRadius: "var(--radius-sm)",
                              background: "rgba(100, 116, 139, 0.1)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {p.sku}
                          </span>
                          <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            ₹{p.price?.toLocaleString()}
                          </span>
                          {p.brand && (
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                              • {p.brand}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Radio / Selection Indicator */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: isSelected ? "2px solid var(--primary)" : "2px solid var(--border-medium)",
                          background: isSelected ? "var(--primary)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsPlaceModalOpen(false)}
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmPlaceOnProduct}
                disabled={isSavingToCatalogue || !selectedTargetProductId}
                style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px" }}
              >
                {isSavingToCatalogue ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Applying to Product...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Confirm &amp; Place on Selected Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE NEW PRODUCT WITH STUDIO PHOTO
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "580px",
              width: "100%",
              margin: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-medium)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={20} color="#059669" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 750, color: "var(--text-primary)" }}>
                    Create New Product in Catalogue
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Save this studio master photo as a brand new catalogue listing
                  </span>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsCreateModalOpen(false)} style={{ padding: "6px", borderRadius: "var(--radius-full)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  border: "1px solid var(--border-medium)",
                  background: "#ffffff",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {outputCanvasRef.current ? (
                  <img
                    src={outputCanvasRef.current.toDataURL("image/jpeg", 0.7)}
                    alt="New Studio Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Sparkles size={20} color="var(--primary)" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Primary Image Attachment
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  1200px High-Res Studio Master ({selectedStage.replace(/_/g, " ").toUpperCase()})
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.25rem" }}>
              {/* Product Title */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Product Title:
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Handcrafted Wooden Incense Dhoop Box"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* SKU & Brand */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    SKU Identifier:
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    style={{ width: "100%", fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Brand Name:
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Selling Price (₹):
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 650, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Category:
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem" }}>
              <button className="btn btn-outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmCreateProduct}
                disabled={isSavingToCatalogue}
                style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px" }}
              >
                {isSavingToCatalogue ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Creating Product...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Create &amp; Publish in Catalogue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
