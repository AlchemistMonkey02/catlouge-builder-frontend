/* Dynamic Catalogue Engine adapted from odop-kritika.
   Combines 4 template suites (41 distinct designs):
   - Simple & Classic (20 templates)
   - Editorial Luxury Lookbook (12 templates)
   - Architectural Brochure (3 templates)
   - Trade & Export (6 templates)
   Provides aspect-ratio safe photo fitting (ODOP_FIT.fitImg),
   live multi-page preview rendering, design edits reapplication,
   QR code page generation, and multi-page A4 PDF downloading. */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import CATALOGUE_TEMPLATES from "./templates/templates.js";
import EDITORIAL_TEMPLATES from "./templates/editorial.js";
import KOTASTONE_TEMPLATES from "./templates/kotastone.js";
import STONECAT_TEMPLATES from "./templates/stonecatalogs.js";
import GARLIC_TEMPLATES from "./templates/garlic.js";
import SANDSTONE_TEMPLATES from "./templates/sandstone.js";
import KOTADORIA_TEMPLATES from "./templates/kotadoria.js";
import { formatProductPrice, formatProductPriceRange } from "./priceUtils.js";
import { recolorTheme } from "./colour.js";
import { getCopy } from "./content.js";
import { applyAll, onRendered } from "./editor.js";

const FAMS = [
  ['garlic', GARLIC_TEMPLATES, 'Garlic Specialty (8 Templates)'],
  ['kotastone', KOTASTONE_TEMPLATES, 'Kota Stone Specialty (8 Templates)'],
  ['sandstone', SANDSTONE_TEMPLATES, 'Sand Stone Specialty (8 Templates)'],
  ['kotadoria', KOTADORIA_TEMPLATES, 'Kota Doria Specialty (10 Templates)'],
  ['editorial', EDITORIAL_TEMPLATES, 'Editorial Luxury Lookbook'],
  ['stonecat', STONECAT_TEMPLATES, 'Trade & Export Catalogue'],
  ['simple', CATALOGUE_TEMPLATES, 'Modern & Clean']
];

export const TEMPLATE_REGISTRY = [];
let injectedCss = false;

export function initTemplateRegistry() {
  TEMPLATE_REGISTRY.length = 0;

  let combinedCss = '';
  FAMS.forEach(([key, mod, label]) => {
    if (!mod || !mod.list) return;
    combinedCss += (mod.css || '');
    mod.list.forEach(t => {
      TEMPLATE_REGISTRY.push({
        uid: key + ':' + t.id,
        fam: key,
        label,
        mod,
        t,
        name: t.name,
        title: t.name,
        desc: t.desc || '',
        badge: t.badge || '',
        cat: t.cat || label,
        size: t.size || [794, 1123],
        theme: t.theme
      });
    });
  });

  if (typeof document !== 'undefined') {
    let st = document.getElementById('dynamic-tpl-css');
    if (!st) {
      st = document.createElement('style');
      st.id = 'dynamic-tpl-css';
      document.head.appendChild(st);
    }
    st.textContent = combinedCss;
    injectedCss = true;
  }

  if (typeof window !== 'undefined') {
    window.TEMPLATE_REGISTRY = TEMPLATE_REGISTRY;
  }
  return TEMPLATE_REGISTRY;
}

initTemplateRegistry();

export function byUid(uid) {
  initTemplateRegistry();
  if (!uid) return TEMPLATE_REGISTRY[0];
  const exact = TEMPLATE_REGISTRY.find(r => r.uid === uid);
  if (exact) return exact;
  const fam = uid.split(':')[0];
  const sameFam = TEMPLATE_REGISTRY.find(r => r.fam === fam);
  if (sameFam) return sameFam;
  return TEMPLATE_REGISTRY[0];
}

/* ---------------- aspect ratio safe image fitting ---------------- */
const sqCache = new Map();
const fitMeta = new Map();
let lastItems = [];

const imgCache = new Map();
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src || typeof Image === 'undefined') return resolve(null);
    const im = new Image();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      im.crossOrigin = 'anonymous';
    }
    im.onload = () => resolve(im);
    im.onerror = () => {
      if (im.crossOrigin) {
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () => resolve(null);
        fallback.src = src;
      } else {
        resolve(null);
      }
    };
    im.src = src;
  });
}

async function ensureImg(src) {
  if (!src) return null;
  if (imgCache.has(src)) return imgCache.get(src);
  const im = await loadImage(src);
  if (im) {
    imgCache.set(src, im);
    if (imgCache.size > 40) imgCache.delete(imgCache.keys().next().value);
  }
  return im;
}

export async function fitImg(src, fit, ar) {
  if (!src || typeof src !== 'string') return '';
  ar = ar || 1;
  const key = src.length + ':' + src.slice(-40) + ':' + (fit || 'auto') + ':' + ar.toFixed(2);
  if (sqCache.has(key)) return sqCache.get(key);

  if (typeof document === 'undefined') return src;
  try {
    const im = await ensureImg(src);
    if (!im || !im.naturalWidth || !im.naturalHeight) return src;

    const iw = im.naturalWidth, ih = im.naturalHeight, pa = iw / ih;
    const L = Math.min(1500, Math.max(1000, Math.max(iw, ih)));
    const W = Math.round(ar >= 1 ? L : L * ar), H = Math.round(ar >= 1 ? L / ar : L);
    const mode = fit === 'fill' ? 'fill' : fit === 'full' ? 'full' : (Math.abs(Math.log(pa / ar)) < 0.5 ? 'fill' : 'full');

    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';

    if (mode === 'fill') {
      const s = Math.max(W / iw, H / ih);
      x.drawImage(im, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
    } else {
      // blurred backdrop with centered crisp photo
      const sm = document.createElement('canvas');
      const k = 24 / Math.min(iw, ih);
      sm.width = Math.max(2, Math.round(iw * k));
      sm.height = Math.max(2, Math.round(ih * k));
      sm.getContext('2d').drawImage(im, 0, 0, sm.width, sm.height);

      const mw = 160, mh = Math.max(40, Math.round(160 / ar));
      const mid = document.createElement('canvas');
      mid.width = mw;
      mid.height = mh;
      const mx = mid.getContext('2d');
      mx.imageSmoothingQuality = 'high';
      const cv = Math.max(mw / sm.width, mh / sm.height);
      mx.drawImage(sm, (mw - sm.width * cv) / 2, (mh - sm.height * cv) / 2, sm.width * cv, sm.height * cv);

      x.drawImage(mid, 0, 0, W, H);
      x.fillStyle = 'rgba(255,255,255,.22)';
      x.fillRect(0, 0, W, H);
      const s = Math.min(W * 0.96 / iw, H * 0.96 / ih);
      x.drawImage(im, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
    }

    const url = c.toDataURL('image/jpeg', 0.94);
    sqCache.set(key, url);
    fitMeta.set(url, { src, fit });
    if (sqCache.size > 80) sqCache.delete(sqCache.keys().next().value);
    return url;
  } catch (err) {
    console.warn("fitImg error fallback:", err);
    return src;
  }
}

export const squareImg = (src, fit) => fitImg(src, fit, 1);

if (typeof window !== 'undefined') {
  window.ODOP_FIT = {
    meta: fitMeta,
    items: () => lastItems,
    get fitImg() { return fitImg; }
  };
}

export async function prepareItems(products, fam = '') {
  const out = [];
  const list = products && products.length ? products : [];

  for (let k = 0; k < list.length; k++) {
    const v = list[k];
    if (!v) continue;

    // c) Product photographs: Primary image resolution with multi-source fallback
    let src = '';
    if (typeof v === 'string') {
      src = v;
    } else if (v && typeof v === 'object') {
      if (typeof v.img === 'string' && v.img) {
        src = v.img;
      } else if (typeof v.image === 'string' && v.image) {
        src = v.image;
      } else if (v.image && typeof v.image === 'object') {
        src = typeof v.image.url === 'string' ? v.image.url : (typeof v.image.img === 'string' ? v.image.img : '');
      } else if (Array.isArray(v.images) && v.images.length > 0) {
        const first = v.images[0];
        if (typeof first === 'string') src = first;
        else if (first && typeof first === 'object') {
          src = typeof first.url === 'string' ? first.url : (typeof first.img === 'string' ? first.img : '');
        }
      } else if (typeof v.angle1 === 'string' && v.angle1) {
        src = v.angle1;
      }
    }
    if (typeof src !== 'string') src = '';

    // Enforce strict category image alignment
    const srcLower = src.toLowerCase();
    if (fam === 'garlic') {
      if (srcLower.includes('kota-doria') || srcLower.includes('stone') || !src) {
        const garlicFallbacks = [
          '/assets/garlic/garlic-01.jpeg',
          '/assets/garlic/garlic-02.jpeg',
          '/assets/garlic/garlic-03.jpeg',
          '/assets/garlic/garlic-04.jpeg',
        ];
        src = garlicFallbacks[k % garlicFallbacks.length];
      }
    } else if (fam === 'kotastone') {
      if (srcLower.includes('kota-doria') || srcLower.includes('garlic') || (srcLower.includes('sand-stone') && !srcLower.includes('kota')) || !src) {
        const stoneFallbacks = [
          '/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg',
          '/assets/kota-stone/Brown-Kota-Stone-Tiles-2.jpg',
          '/assets/kota-stone/Kota-Stone-Tiles-3.jpg',
          '/assets/kota-stone/blue kota stone 1.jpg',
        ];
        src = stoneFallbacks[k % stoneFallbacks.length];
      }
    } else if (fam === 'sandstone') {
      if (srcLower.includes('kota-doria') || srcLower.includes('garlic') || srcLower.includes('kota-stone') || !src) {
        const sandFallbacks = [
          '/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg',
          '/assets/sand-stone/Teakwood-Sandstone-Honed.jpg',
          '/assets/sand-stone/Rainbow-Sandstone-Honed.jpg',
          '/assets/sand-stone/Dholpur-Beige-Sandstone.jpg',
        ];
        src = sandFallbacks[k % sandFallbacks.length];
      }
    } else if (fam === 'kotadoria') {
      if (srcLower.includes('garlic') || srcLower.includes('stone') || !src) {
        src = '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
      }
    }

    // d) Product name
    const rawName = (v.name || v.title || ('Product ' + (k + 1))).replace(/\s*\([^)]*Angle[^)]*\)/gi, '').trim();
    const name = rawName;
    const catLower = (v.category || '').toLowerCase();
    const subLower = (v.subcategory || v.productType || '').toLowerCase();

    // f) Size / specification
    let size = v.size;
    if (!size || size === 'x cm' || size === 'nullxnull cm' || size === 'Standard Format') {
      if (v.dimensions && v.dimensions.length && v.dimensions.width) {
        size = `${v.dimensions.length}x${v.dimensions.width} ${v.dimensions.unit || 'cm'}`;
      } else if (catLower.includes('doria') || subLower.includes('saree')) {
        size = '6.5m (Includes 80cm Running Blouse Piece)';
      } else if (subLower.includes('dupatta')) {
        size = '2.5m Length x 36 Inches Width';
      } else if (subLower.includes('suit') || subLower.includes('dress')) {
        size = 'Top 2.5m, Bottom 2.0m, Dupatta 2.5m';
      } else if (catLower.includes('garlic')) {
        size = '50 - 65 mm Caliber (Grade A)';
      } else if (catLower.includes('stone') || catLower.includes('sand')) {
        size = '2 ft x 2 ft [Calibrated 20mm]';
      } else {
        size = 'Standard Dimensional Format';
      }
    }

    // g) Material / finish
    let material = v.material || v.materialComposition || '';
    if (!material) {
      if (catLower.includes('doria') || subLower.includes('saree')) {
        material = 'Pure Mulberry Silk Warp, Fine Cotton Weft';
      } else if (subLower.includes('dupatta')) {
        material = 'Pure Cotton-Silk Kota Doria Weave';
      } else if (subLower.includes('suit')) {
        material = '100% Breathable Kota Doria Cotton';
      } else if (catLower.includes('garlic')) {
        material = '100% Organic Farm-Fresh Whole Garlic';
      } else if (catLower.includes('sand')) {
        material = 'Sedimentary Quartz Sandstone (High Silica)';
      } else if (catLower.includes('stone') || catLower.includes('kota')) {
        material = 'Calibrated Indurated Limestone (Kota Stone)';
      } else {
        material = 'Premium Natural Grade Raw Material';
      }
    }

    let finish = v.finish || '';
    if (!finish || finish.toLowerCase().includes('angle')) {
      if (v.technicalSpecifications && Array.isArray(v.technicalSpecifications)) {
        const spec = v.technicalSpecifications.find(s => s.key === 'Grade' || s.key === 'Bulb Diameter' || s.key === 'Texture' || s.key === 'Finish' || s.key === 'Zari Quality');
        if (spec) finish = spec.value;
      }
    }
    if (!finish || finish.toLowerCase().includes('angle')) {
      if (catLower.includes('doria')) {
        finish = 'Tested Electro-Zari & Starch Crisp Khat Weave';
      } else if (catLower.includes('garlic')) {
        finish = 'Sun-Cured Export Cleaned';
      } else if (catLower.includes('sand')) {
        finish = 'Natural Split / Sandblasted / Hand-Carved';
      } else if (catLower.includes('stone') || catLower.includes('kota')) {
        finish = 'Mirror Polished / Honed Leather';
      } else {
        finish = 'Export Quality Standard Finish';
      }
    }

    // h) Use / application of the product
    let application = v.application || v.useApplication || v.usageInstructions || '';
    if (!application) {
      if (subLower.includes('dupatta')) {
        application = 'Layering over festive kurtas, lehengas & contemporary stoles';
      } else if (subLower.includes('suit') || subLower.includes('dress')) {
        application = 'Boutique bespoke tailoring, daytime celebrations & office ethnics';
      } else if (catLower.includes('doria') || subLower.includes('saree')) {
        application = 'Bridal ensembles, wedding celebrations & luxury festive drapes';
      } else if (catLower.includes('garlic')) {
        application = 'Commercial food processing, hospitality dining & pharmaceutical use';
      } else if (catLower.includes('sand')) {
        application = 'Exterior facade cladding, jali lattice screens & heritage paving';
      } else if (catLower.includes('stone') || catLower.includes('kota')) {
        application = 'Heavy commercial flooring, staircases, corridors & outdoor paving';
      } else {
        application = 'Wholesale procurement, boutique retail & institutional supply';
      }
    }

    // Unit resolution & Pricing
    let resolvedUnit = v.unit !== undefined ? v.unit : (v.pricingUnit ?? v.priceUnit);
    if (resolvedUnit === undefined || resolvedUnit === null) {
      if (
        catLower.includes('doria') ||
        subLower.includes('saree') ||
        subLower.includes('dupatta') ||
        subLower.includes('suit') ||
        catLower.includes('apparel') ||
        catLower.includes('fashion') ||
        catLower.includes('cloth') ||
        catLower.includes('audio') ||
        catLower.includes('tech')
      ) {
        resolvedUnit = ''; // Clothes, sarees, fashion, audio -> NO UNIT
      } else if (catLower.includes('stone') || catLower.includes('sand') || catLower.includes('granite') || catLower.includes('limestone')) {
        resolvedUnit = 'sq.ft';
      } else if (catLower.includes('garlic')) {
        resolvedUnit = 'kg';
      } else {
        resolvedUnit = '';
      }
    }
    resolvedUnit = String(resolvedUnit || '').trim();
    if (/^(none|null|undefined|-|no unit)$/i.test(resolvedUnit)) resolvedUnit = '';

    const priceNum = v.price != null && !isNaN(Number(v.price)) ? Number(v.price) : 0;
    const mrpNum = v.mrp != null && !isNaN(Number(v.mrp)) ? Number(v.mrp) : (priceNum ? Math.round(priceNum * 1.35) : 0);
    const priceFormatted = formatProductPrice(priceNum || v.price, resolvedUnit, v);
    const priceRange = formatProductPriceRange(v.priceRange, priceNum, mrpNum, resolvedUnit, v);

    // MOQ removed per catalogue requirements
    const moq = '';

    // e) Short product description, preferably AI-assisted and participant-verified
    let shortDescription = v.shortDescription || v.description || '';
    if (!shortDescription) {
      shortDescription = `Authentic handloom ${rawName} conforming to certified Geographical Indication (GI Tag) and ODOP benchmark excellence.`;
    }

    const colour = v.color || v.colour || '';
    const code = v.sku || v.code || ('#PRD-' + String(k + 1).padStart(2, '0'));
    const thickness = v.thickness || '';

    const fitted = src ? await squareImg(src, v.fit || 'auto') : '';
    out.push({
      ...v, // Retain all rich model properties
      name,
      title: name,
      unit: resolvedUnit,
      pricingUnit: resolvedUnit,
      shortDescription,
      description: v.description || shortDescription,
      verifiedCopy: true,
      size,
      material,
      materialComposition: material,
      finish,
      application,
      useApplication: application,
      use: application,
      price: priceFormatted,
      rawPrice: priceNum,
      formattedPrice: priceFormatted,
      mrp: mrpNum,
      priceRange,
      moq,
      colour,
      color: colour,
      code,
      sku: v.sku || code,
      thickness,
      img: fitted || src,
      image: src,
      _src: src,
      _fit: v.fit || 'auto'
    });
  }

  out.forEach(it => {
    if (it.img && it._src) fitMeta.set(it.img, { src: it._src, fit: it._fit });
  });
  lastItems = out;
  return out;
}

export async function fitPages(pages, items, templateUid) {
  if (typeof document === 'undefined') return pages;
  try {
    const bySq = new Map(items.filter(i => i.img && i._src).map(i => [i.img, i]));
    if (!bySq.size && !templateUid) return pages;

    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none';
    host.innerHTML = pages.join('');
    document.body.appendChild(host);

    try {
      if (templateUid) {
        if (window.DesignEditor?.applyAll) {
          await window.DesignEditor.applyAll(host, templateUid, items);
        } else {
          await applyAll(host, templateUid, items);
        }
      }
      for (const pg of host.querySelectorAll(':scope > .pg')) {
        for (const e of pg.querySelectorAll('*')) {
          let url = '';
          const isImg = e.tagName === 'IMG' && (!e.classList || !e.classList.contains('qrimg') && !e.classList.contains('qrx'));
          if (isImg) {
            url = e.getAttribute('src') || '';
          } else {
            const m = /url\(["']?(data:image[^"')]+|https?:[^"')]+)["']?\)/.exec(e.getAttribute('style') || '');
            url = m ? m[1] : '';
          }
          const it = url && bySq.get(url);
          if (!it) continue;
          const b = e.getBoundingClientRect();
          if (b.width < 60 || b.height < 60) continue;
          const ar = b.width / b.height;
          if (Math.abs(Math.log(ar)) < 0.12) continue;
          const nu = await fitImg(it._src, it._fit, ar);
          if (isImg) e.setAttribute('src', nu);
          else e.setAttribute('style', e.getAttribute('style').split(url).join(nu));
        }
      }
      const children = (host && host.children) ? Array.from(host.children) : [];
      if (children.length > 0) {
        return children.map(p => p.outerHTML);
      }
      return pages;
    } finally {
      if (host && typeof host.remove === 'function') {
        host.remove();
      } else if (host && host.parentNode) {
        host.parentNode.removeChild(host);
      }
    }
  } catch (err) {
    console.warn("fitPages fallback:", err);
    return pages;
  }
}

/* ---------------- QR Code generation ---------------- */
const qrCache = new Map();
export async function qrDataUrl(text) {
  if (!text) return '';
  if (qrCache.has(text)) return qrCache.get(text);
  try {
    const url = await QRCode.toDataURL(text, {
      margin: 1,
      width: 320,
      color: { dark: '#000000', light: '#ffffff' }
    });
    qrCache.set(text, url);
    return url;
  } catch (e) {
    return '';
  }
}

export function qrPageHtml(info, sel, qrList) {
  const list = qrList && qrList.length ? qrList : [];
  if (!list.length) return '';

  const th = (typeof window !== 'undefined' && window.TplColor && sel.theme ? recolorTheme(sel.theme, window.TplColor) : sel.theme) || {};
  const bg = th.bg || '#fbfaf7';
  const ink = th.ink || '#1f2433';
  const acc = th.acc || th.accent || th.gold || '#2c3e91';
  const [pw, ph] = sel.size || [794, 1123];
  const land = pw > ph;

  const n = list.length;
  const gap = land ? 22 : 30;
  const per = land ? Math.min(n, 3) : (n <= 2 ? n : n <= 4 ? 2 : 3);
  const rows = Math.ceil(n / per);
  const availW = pw - 112;
  const availH = ph - (land ? 225 : 330) - (land ? 85 : 90);
  const q = Math.floor(Math.max(110, Math.min(260, (availW - (per - 1) * gap) / per - 44, (availH - (rows - 1) * gap) / rows - 92)));
  const cardW = q + 44;

  const dark = (() => {
    const m = /^#?([0-9a-f]{6})$/i.exec(bg);
    if (!m) return false;
    const v = parseInt(m[1], 16);
    return ((v >> 16) * 0.3 + ((v >> 8) & 255) * 0.59 + (v & 255) * 0.11) < 110;
  })();
  const mut = dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.55)';

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const cards = list.map(c => `<div class="soc" data-url="${esc(c.url || c.link)}" style="width:${cardW}px;background:#fff;border-radius:14px;padding:20px 18px 16px;text-align:center;box-sizing:border-box;box-shadow:0 4px 14px rgba(0,0,0,0.06);margin-bottom:8px">
      <img class="qrx" src="${c.img || c.qr}" alt="" style="display:block;width:${q}px;height:${q}px;margin:0 auto">
      <div style="font:700 ${q > 240 ? 18 : 15}px/1.2 Montserrat,sans-serif;color:#1f2433;margin-top:12px;letter-spacing:.3px">${esc(c.label || c.title)}</div>
      <div style="font:400 11px/1.4 Montserrat,sans-serif;color:#6b7280;margin-top:4px">${esc(c.note || c.subtitle || 'Scan to view link')}</div></div>`).join('');

  const contact = [info.mobile ? '+91 ' + info.mobile : '', info.email, info.addr].filter(Boolean).map(esc).join('  ·  ');

  return `<div class="pg" style="width:${pw}px;height:${ph}px;position:relative;overflow:hidden;background:${bg};color:${ink};font-family:Montserrat,sans-serif;box-sizing:border-box">
    <div style="position:absolute;left:0;top:0;right:0;height:10px;background:${acc}"></div>
    <div style="padding:${land ? 40 : 70}px 56px 0;text-align:center">
      <div style="font:600 12px/1 Montserrat,sans-serif;letter-spacing:5px;text-transform:uppercase;color:${acc}">Scan &amp; Connect</div>
      <div style="font:600 ${land ? 32 : 42}px/1.15 'Cormorant Garamond',serif;margin-top:${land ? 10 : 16}px">${esc(info.ent)}</div>
      <div style="width:56px;height:2px;background:${acc};margin:${land ? 10 : 16}px auto"></div>
      <div style="font:400 ${land ? 13 : 14}px/1.6 Montserrat,sans-serif;color:${mut};max-width:560px;margin:0 auto">Point your smartphone camera at any QR code to open our direct digital profile, view catalogues and place orders.</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:${gap}px;width:${per * cardW + (per - 1) * gap}px;margin:${land ? 20 : 36}px auto 0">${cards}</div>
    <div style="position:absolute;left:56px;right:56px;bottom:${land ? 20 : 36}px;text-align:center;font:400 12px/1.5 Montserrat,sans-serif;color:${mut}">${contact}</div></div>`;
}

/* ---------------- buildCatalogue: compiles pages & executes fits ---------------- */
export async function buildCatalogue({
  company,
  products,
  templateUid,
  colorOverride,
  textOverrides,
  includeQr = true,
  customQrList = []
}) {
  initTemplateRegistry();
  const sel = byUid(templateUid);

  // b) Name of district and ODOP product with Strict Government ODOP Alignment:
  // Strictly prioritize company's registered data over template default
  const compInd = (company?.industry || '').toLowerCase();
  const compProd = (company?.odopProduct || '').toLowerCase();
  const compName = (company?.name || '').toLowerCase();
  const compDist = (company?.district || '').toLowerCase();
  const firstCat = (products && products[0] && (products[0].category || products[0].subcategory || ''))?.toLowerCase() || '';
  const fam = (templateUid?.split(':')[0] || '').toLowerCase();

  let matchedDistrict = company?.district || 'Kota, Rajasthan';
  let matchedOdop = company?.odopProduct || 'Kota Doria';

  // 1. Explicit company category / name / products
  if (compProd.includes('sand') || compInd.includes('sand') || compName.includes('sand') || compDist.includes('bundi') || firstCat.includes('sand')) {
    matchedDistrict = company?.district || 'Bundi, Rajasthan';
    matchedOdop = 'Sandstone';
  } else if (compProd.includes('garlic') || compInd.includes('garlic') || compName.includes('garlic') || compDist.includes('baran') || firstCat.includes('garlic')) {
    matchedDistrict = company?.district || 'Baran, Rajasthan';
    matchedOdop = 'Garlic';
  } else if (compProd.includes('kota stone') || compInd.includes('kota stone') || compName.includes('stone') || compDist.includes('jhalawar') || firstCat.includes('kota stone')) {
    matchedDistrict = company?.district || 'Jhalawar, Rajasthan';
    matchedOdop = 'Kota Stone';
  } else if (compProd.includes('doria') || compInd.includes('doria') || compName.includes('threads') || compDist.includes('kota') || firstCat.includes('doria')) {
    matchedDistrict = company?.district || 'Kota, Rajasthan';
    matchedOdop = 'Kota Doria';
  } else if (fam.includes('sandstone')) {
    matchedDistrict = 'Bundi, Rajasthan';
    matchedOdop = 'Sandstone';
  } else if (fam.includes('garlic')) {
    matchedDistrict = 'Baran, Rajasthan';
    matchedOdop = 'Garlic';
  } else if (fam.includes('kotastone') || fam.includes('stonecat')) {
    matchedDistrict = 'Jhalawar, Rajasthan';
    matchedOdop = 'Kota Stone';
  } else if (fam.includes('kotadoria')) {
    matchedDistrict = 'Kota, Rajasthan';
    matchedOdop = 'Kota Doria';
  }

  // ODOP Category Default Fallbacks
  const ODOP_DEFAULTS = {
    'Garlic': {
      ent: 'Malwa Agro Fresh & Garlic Exports',
      person: 'Farmer Producer Collective Directorate',
      mobile: '+91 97521 09876',
      email: 'procurement@malwagarlic.in',
      addr: 'Krishi Upaj Mandi Yard, Mandsaur-Baran Agro Belt, Rajasthan – 325205',
      website: 'https://www.malwagarlic.in',
      gst: '08AAGCM4321P1Z8',
      udyam: 'UDYAM-RJ-23-0044551',
      giTag: 'Baran Garlic ODOP Cluster',
      desc: 'One District One Product (ODOP) certified enterprise supplying authentic Grade-A fresh garlic, peeled cloves, and dehydrated flakes.',
      use: 'Commercial mandi supply, wholesale grocery chains & export reefer containers',
      tagline: 'Sun-Cured Grade-A White Garlic • Direct Malwa Farm Collective'
    },
    'Kota Stone': {
      ent: 'Supreme Granite & Stones',
      person: 'Commercial Quarry Directorate',
      mobile: '+91 90668 04666',
      email: 'sales@supremestones.in',
      addr: 'Industrial Quarry Zone, Suket / Ramganj Mandi, Jhalawar-Kota Belt, Rajasthan – 326529',
      website: 'https://www.supremestones.in',
      gst: '08AAGCS1234F1Z9',
      udyam: 'UDYAM-RJ-29-0012345',
      giTag: 'Kota Stone Mining & Processing Hub',
      desc: 'One District One Product (ODOP) certified enterprise quarrying and calibrating authentic blue-green limestone, mirror polish slabs, and heavy paving tiles.',
      use: 'Architectural flooring, hospital and school paving, facade cladding and luxury landscape verandas',
      tagline: 'Natural • Durable • Timeless Architectural Stone'
    },
    'Sandstone': {
      ent: 'Royal Heritage Sandstones',
      person: 'Master Stone Mason Guild',
      mobile: '+91 98290 54321',
      email: 'export@royalsandstone.in',
      addr: 'Stone Heritage Industrial Estate, Bundi-Jodhpur Highway, Rajasthan – 323001',
      website: 'https://www.royalsandstone.in',
      gst: '08AAGCR5432M1Z5',
      udyam: 'UDYAM-RJ-08-0054321',
      giTag: 'Bundi Royal Sandstone Consortium',
      desc: 'One District One Product (ODOP) certified stone processing facility manufacturing royal Agra red sandstone, autumn brown calibrated tiles, and palatial stone carvings.',
      use: 'Exterior facade cladding, heritage monument restoration, luxury villa patios and garden landscaping',
      tagline: 'Palatial Jodhpur & Agra Red Sandstones'
    },
    'Kota Doria': {
      ent: 'Parampara Threads',
      person: 'Master Artisan Council',
      mobile: '+91 94600 77112',
      email: 'concierge@kotadoria-royal.in',
      addr: 'Bunkar Seva Kendra Road, Kaithun, Kota District, Rajasthan – 325001',
      website: 'https://www.kaithunkotadoria.org',
      gst: '08AAAKK3344D1Z2',
      udyam: 'UDYAM-RJ-20-0012345',
      giTag: 'GI Tag No. 37',
      desc: 'One District One Product (ODOP) certified enterprise producing authentic heritage drapes, pure zari handlooms, and lightweight khat weave fabrics.',
      use: 'Commercial, Wholesale, Boutiques & Retail supply',
      tagline: 'Royal Gossamer Handlooms • GI Tagged Atelier'
    }
  };

  const catDefaults = ODOP_DEFAULTS[matchedOdop] || ODOP_DEFAULTS['Kota Doria'];

  // a) Name of ODOP enterprise - Always prioritize user's actual registered company info
  let ent = (company && (company.name || company.brandName)) || catDefaults.ent || 'Catalogue Studio';
  const entLower = ent.toLowerCase();
  if (matchedOdop === 'Sandstone' && (entLower.includes('garlic') || entLower.includes('lahsun') || entLower.includes('saree') || entLower.includes('doria') || entLower.includes('handloom'))) {
    ent = catDefaults.ent || 'Royal Heritage Sandstones';
  } else if (matchedOdop === 'Garlic' && (entLower.includes('sandstone') || entLower.includes('stone') || entLower.includes('saree') || entLower.includes('doria') || entLower.includes('handloom'))) {
    ent = catDefaults.ent || 'Malwa Agro Fresh & Garlic Exports';
  } else if (matchedOdop === 'Kota Stone' && (entLower.includes('garlic') || entLower.includes('lahsun') || entLower.includes('saree') || entLower.includes('doria') || entLower.includes('handloom') || entLower.includes('sandstone'))) {
    ent = catDefaults.ent || 'Supreme Granite & Stones';
  } else if (matchedOdop === 'Kota Doria' && (entLower.includes('garlic') || entLower.includes('lahsun') || entLower.includes('stone') || entLower.includes('sand') || entLower.includes('granite'))) {
    ent = catDefaults.ent || 'Parampara Threads';
  }

  // District & ODOP Product - strictly preserve company registration fields
  const cName = (company?.name || '').toLowerCase();
  const cAddr = (company?.contact?.address || '').toLowerCase();
  let resolvedDistrict = (company?.district && company.district.trim() !== 'India') ? company.district.trim() : '';
  let resolvedOdop = (company?.odopProduct && company.odopProduct.trim()) ? company.odopProduct.trim() : '';

  // Clear legacy default mismatch if company clearly belongs to another sector
  if ((resolvedOdop === 'Kota Doria' || !resolvedOdop) && (cName.includes('garlic') || cName.includes('stone') || cName.includes('sand') || cAddr.includes('mandsaur') || cAddr.includes('jodhpur') || cAddr.includes('bangalore'))) {
    if (cName.includes('garlic') || cAddr.includes('mandsaur')) resolvedOdop = 'Garlic';
    else if (cName.includes('sand') || cAddr.includes('jodhpur') || cAddr.includes('bundi')) resolvedOdop = 'Sandstone';
    else if (cName.includes('stone') || cAddr.includes('jhalawar') || cAddr.includes('suket') || cAddr.includes('bangalore')) resolvedOdop = 'Kota Stone';
  }

  if ((resolvedDistrict === 'Kota' || resolvedDistrict === 'Kota, Rajasthan' || !resolvedDistrict) &&
      (cName.includes('garlic') || cAddr.includes('mandsaur') || cAddr.includes('baran') ||
       cAddr.includes('bangalore') || cAddr.includes('jigani') ||
       cAddr.includes('jodhpur') || cName.includes('marwar') || cAddr.includes('bundi') ||
       cAddr.includes('suket') || cAddr.includes('jhalawar'))) {
    if (cAddr.includes('mandsaur')) resolvedDistrict = 'Mandsaur, MP';
    else if (cAddr.includes('baran')) resolvedDistrict = 'Baran, Rajasthan';
    else if (cAddr.includes('jodhpur') || cName.includes('marwar')) resolvedDistrict = 'Jodhpur, Rajasthan';
    else if (cAddr.includes('bundi')) resolvedDistrict = 'Bundi, Rajasthan';
    else if (cAddr.includes('jhalawar') || cAddr.includes('suket')) resolvedDistrict = 'Jhalawar, Rajasthan';
    else if (cAddr.includes('bangalore') || cAddr.includes('jigani')) resolvedDistrict = 'Bangalore, Karnataka';
    else if (resolvedOdop === 'Garlic') resolvedDistrict = 'Baran, Rajasthan';
    else if (resolvedOdop === 'Kota Stone') resolvedDistrict = 'Jhalawar, Rajasthan';
    else if (resolvedOdop === 'Sandstone') resolvedDistrict = 'Bundi, Rajasthan';
  }

  const district = resolvedDistrict || (company?.contact?.address ? company.contact.address.split(',').slice(-2).join(',').trim() : (matchedDistrict || 'District Pending'));
  const odopProduct = resolvedOdop || matchedOdop || company?.industry || 'ODOP Product';

  const state = company?.state || (district && district.includes('Rajasthan') ? 'Rajasthan' : 'Rajasthan');

  // Contact details & WhatsApp / mobile number from registered company
  const person = (company?.contact && (company.contact.contactPerson || company.contact.person)) || company?.contactPerson || catDefaults.person;
  const rawMobile = company?.whatsappNumber || (company?.contact && (company.contact.phone || company.contact.mobile)) || company?.phone || catDefaults.mobile;
  const mobile = rawMobile;
  const whatsapp = mobile;
  const email = (company?.contact && company.contact.email) || company?.email || catDefaults.email;
  const addr = (company?.contact && company.contact.address) || company?.address || catDefaults.addr;
  const website = (company?.contact && company.contact.website) || company?.website || catDefaults.website;
  const gst = (company?.tax && (company.tax.gstNumber || company.tax.gstin)) || (company?.legal && (company.legal.gstNumber || company.legal.taxId)) || company?.gstNumber || catDefaults.gst;
  const udyam = company?.udyamNumber || (company?.legal && company.legal.udyamNumber) || catDefaults.udyam;
  const giTag = company?.giTagNumber || (company?.legal && company.legal.giTagNumber) || catDefaults.giTag;
  const enterpriseType = company?.enterpriseType || catDefaults.enterpriseType || 'ODOP Certified Enterprise';
  const logo = (company?.branding && company.branding.logoUrl) || company?.logoUrl || '';
  let desc = company?.description || company?.tagline || (products && products[0] && products[0].description) || catDefaults.desc;
  const descLower = (desc || '').toLowerCase();
  if (matchedOdop === 'Sandstone' && (descLower.includes('garlic') || descLower.includes('allicin') || descLower.includes('handloom') || descLower.includes('saree'))) {
    desc = catDefaults.desc;
  } else if (matchedOdop === 'Garlic' && (descLower.includes('sandstone') || descLower.includes('limestone') || descLower.includes('handloom') || descLower.includes('saree'))) {
    desc = catDefaults.desc;
  } else if (matchedOdop === 'Kota Stone' && (descLower.includes('garlic') || descLower.includes('handloom') || descLower.includes('saree'))) {
    desc = catDefaults.desc;
  } else if (matchedOdop === 'Kota Doria' && (descLower.includes('garlic') || descLower.includes('stone') || descLower.includes('quarry'))) {
    desc = catDefaults.desc;
  }

  const use = company?.industry || company?.category || catDefaults.use;
  let tagline = (textOverrides && textOverrides.tagline) || company?.tagline || catDefaults.tagline;
  const tagLower = (tagline || '').toLowerCase();
  if (matchedOdop === 'Sandstone' && (tagLower.includes('garlic') || tagLower.includes('sun-cured') || tagLower.includes('handloom') || tagLower.includes('saree'))) {
    tagline = catDefaults.tagline;
  } else if (matchedOdop === 'Garlic' && (tagLower.includes('sandstone') || tagLower.includes('stone') || tagLower.includes('handloom') || tagLower.includes('saree'))) {
    tagline = catDefaults.tagline;
  } else if (matchedOdop === 'Kota Stone' && (tagLower.includes('garlic') || tagLower.includes('handloom') || tagLower.includes('saree'))) {
    tagline = catDefaults.tagline;
  } else if (matchedOdop === 'Kota Doria' && (tagLower.includes('garlic') || tagLower.includes('stone') || tagLower.includes('sand'))) {
    tagline = catDefaults.tagline;
  }

  // m) QR code linked directly to the new prescribed account/page/profile created under Part A
  const rawDigits = String(mobile || '').replace(/\D/g, '');
  const cleanMobile = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const waUrl = cleanMobile ? `https://wa.me/${cleanMobile}` : '';
  const partALink = (company && company.qrLinks && (company.qrLinks.businessProfile || company.qrLinks.whatsapp || company.qrLinks.website)) || waUrl || website || 'https://www.catlouge.geoplanetsolution.com';
  const primaryQr = await qrDataUrl(partALink);

  const info = {
    ent,
    district,
    state,
    odopProduct,
    product: odopProduct,
    enterpriseType,
    person,
    mobile,
    whatsapp,
    email,
    addr,
    website,
    gst,
    udyam,
    giTag,
    logo,
    desc,
    use,
    tagline,
    link: partALink,
    qr: primaryQr
  };

  const copy = getCopy(info, textOverrides);
  const items = await prepareItems(products, fam);

  // Compile QR list
  const qrs = [];
  if (includeQr) {
    if (customQrList && customQrList.length) {
      for (const q of customQrList) {
        if (q.link) {
          const qrImg = q.qr || await qrDataUrl(q.link);
          qrs.push({ label: q.title || 'Digital Profile', url: q.link, img: qrImg, note: q.subtitle || 'Scan to view link' });
        }
      }
    } else {
      if (partALink) {
        qrs.push({ label: 'Prescribed Part A Profile', url: partALink, img: primaryQr, note: 'Scan to connect directly' });
      }
      if (mobile && waUrl && waUrl !== partALink) {
        const qrImg = await qrDataUrl(waUrl);
        qrs.push({ label: 'WhatsApp Business', url: waUrl, img: qrImg, note: 'Instant WhatsApp chat' });
      }
      if (website && website !== partALink) {
        const qrImg = await qrDataUrl(website);
        qrs.push({ label: 'Official Portal', url: website, img: qrImg, note: 'Visit web showroom' });
      }
    }
  }

  const effectiveColor = colorOverride || info?.brandColors?.primary || info?.brandColors?.accent || (company?.brandColors && (company.brandColors.primary || company.brandColors.accent));
  const themedSel = effectiveColor && sel.theme
    ? Object.assign({}, sel.t, { theme: recolorTheme(sel.theme, effectiveColor) })
    : (sel.t || sel);

  const ctx = {
    info,
    items,
    copy,
    qr: primaryQr,
    qrs,
    pf: 'Digital Profile',
    th: themedSel.theme || sel.theme
  };

  const pgs = sel.mod.render(themedSel, ctx);
  if (includeQr && qrs.length > 0) {
    const qp = qrPageHtml(info, sel, qrs);
    if (qp) pgs.push(qp);
  }

  const finalPages = await fitPages(pgs, items, sel.uid);
  return { sel, pages: finalPages, items, info };
}

/**
 * Ensures all visual elements (SVG images, CSS clip-path cuts, <img> tags, and background images)
 * are fully preloaded, rasterized, and formatted so html2canvas renders them with 100% visibility.
 */
async function preparePdfHostForExport(container) {
  if (!container) return;

  // 1. Convert any legacy SVG <image> elements into HTML <img> elements
  const svgImages = Array.from(container.querySelectorAll('svg image'));
  svgImages.forEach(si => {
    const href = si.getAttribute('href') || si.getAttribute('xlink:href');
    if (!href) return;
    const parentSvg = si.closest('svg');
    if (parentSvg) {
      const w = si.getAttribute('width') || parentSvg.getAttribute('width') || '794';
      const h = si.getAttribute('height') || parentSvg.getAttribute('height') || '540';
      const wrapper = document.createElement('div');
      wrapper.style.cssText = parentSvg.style.cssText || `position:absolute;left:0;top:0;width:${w}px;height:${h}px;overflow:hidden;`;
      wrapper.innerHTML = `<img src="${href}" alt="Cover Image" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
      if (parentSvg.parentNode) {
        parentSvg.parentNode.replaceChild(wrapper, parentSvg);
      }
    }
  });

  // 2. Pre-render geometric cuts (e.g. diagonal/polygon clip-paths) to canvas so html2canvas renders exact angled edges
  const cutBoxes = Array.from(container.querySelectorAll('.ks1-cut-box, [style*="clip-path"]'));
  for (const box of cutBoxes) {
    try {
      const img = box.querySelector('img');
      if (!img) continue;
      const rawClip = box.style.clipPath || box.style.webkitClipPath || '';
      const m = /polygon\(([^)]+)\)/i.exec(rawClip);
      if (!m) continue;

      const w = parseFloat(box.style.width) || box.offsetWidth || 706;
      const h = parseFloat(box.style.height) || box.offsetHeight || 540;
      if (!w || !h) continue;

      // Ensure img is loaded
      if (!img.complete || img.naturalWidth === 0) {
        await new Promise(res => {
          img.onload = res;
          img.onerror = res;
          setTimeout(res, 1200);
        });
      }

      // Parse polygon points
      const pairs = m[1].split(',').map(s => s.trim().split(/\s+/));
      const pts = pairs.map(([pxStr, pyStr]) => {
        let px = parseFloat(pxStr);
        let py = parseFloat(pyStr);
        if (pxStr.includes('%')) px = (px / 100) * w;
        if (pyStr.includes('%')) py = (py / 100) * h;
        return [px, py];
      });

      if (pts.length >= 3 && img.naturalWidth > 0) {
        const dpr = 2;
        const cvs = document.createElement('canvas');
        cvs.width = Math.round(w * dpr);
        cvs.height = Math.round(h * dpr);
        const ctx = cvs.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let k = 1; k < pts.length; k++) {
          ctx.lineTo(pts[k][0], pts[k][1]);
        }
        ctx.closePath();
        ctx.clip();

        // Aspect-ratio safe object-fit: cover
        const imgRatio = (img.naturalWidth || w) / (img.naturalHeight || h);
        const boxRatio = w / h;
        let dw = w, dh = h, dx = 0, dy = 0;
        if (imgRatio > boxRatio) {
          dw = h * imgRatio;
          dx = (w - dw) / 2;
        } else {
          dh = w / imgRatio;
          dy = (h - dh) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);

        try {
          const dataUrl = cvs.toDataURL('image/png');
          img.src = dataUrl;
          box.style.clipPath = 'none';
          box.style.webkitClipPath = 'none';
          box.style.background = 'transparent';
        } catch (_) {
          // Cross-origin taint fallback: retain original img
        }
      }
    } catch (err) {
      console.warn('Clip-path canvas pre-render skipped:', err);
    }
  }

  // 3. Wait for all <img> tags to complete loading
  const imgs = Array.from(container.querySelectorAll('img'));
  if (imgs.length) {
    await Promise.all(imgs.map(im => {
      if (im.complete && im.naturalWidth > 0) return Promise.resolve();
      return new Promise(res => {
        im.onload = res;
        im.onerror = res;
        setTimeout(res, 2000);
      });
    }));
  }

  // 4. Preload any CSS background-images so html2canvas renders them without missing frames
  const bgElements = Array.from(container.querySelectorAll('*')).filter(el => {
    const bi = el.style && el.style.backgroundImage;
    return bi && bi !== 'none' && /url\(/.test(bi);
  });
  if (bgElements.length) {
    await Promise.all(bgElements.map(el => {
      const bi = el.style.backgroundImage;
      const m = /url\(["']?([^"')]+)["']?\)/i.exec(bi);
      if (!m || !m[1]) return Promise.resolve();
      const url = m[1];
      return new Promise(res => {
        const testImg = new Image();
        testImg.crossOrigin = 'anonymous';
        testImg.onload = res;
        testImg.onerror = res;
        setTimeout(res, 2000);
        testImg.src = url;
      });
    }));
  }
}

/* ---------------- High Definition PDF Generation ---------------- */
export async function exportDynamicPdf({
  pages,
  info,
  sel,
  items,
  targetContainer = null,
  onProgress
}) {
  if (!pages || !pages.length) return false;

  let off = null;
  let isCustomHost = false;

  if (targetContainer && (targetContainer.nodeType === 1 || typeof targetContainer.appendChild === 'function')) {
    off = targetContainer;
    isCustomHost = true;
    off.innerHTML = pages.join('');
  } else {
    off = document.createElement('div');
    off.id = 'dynamic-pdf-export-host';
    // Position offscreen with visible rendering so html2canvas captures full fidelity
    off.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;height:1123px;overflow:hidden;background:#ffffff;visibility:visible;opacity:1;pointer-events:none;z-index:-99999;';
    off.innerHTML = pages.join('');
    document.body.appendChild(off);
  }

  try {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Apply any customized text edits, repositioned elements, and swapped photos to the export container
    if (sel && sel.uid) {
      await applyAll(off, sel.uid, items);
    }

    // Preload, polyfill, and rasterize all cover photos, cut shapes, and images
    await preparePdfHostForExport(off);

    let els = [...off.querySelectorAll('.pg')];
    if (!els.length) {
      els = [...off.children];
    }
    const K = 25.4 / 96; // convert px to mm for A4
    let pdf = null;

    for (let i = 0; i < els.length; i++) {
      if (onProgress) onProgress(i + 1, els.length);

      // Only display the current page so it sits cleanly centered in full view
      els.forEach((pEl, pIdx) => {
        pEl.style.display = (pIdx === i) ? 'block' : 'none';
        pEl.style.margin = '0 auto';
        pEl.style.transform = 'none';
      });

      const el = els[i];
      const w = el.offsetWidth || (sel && sel.size ? sel.size[0] : 794);
      const h = el.offsetHeight || (sel && sel.size ? sel.size[1] : 1123);
      const orient = w > h ? 'l' : 'p';
      el.style.position = 'relative';
      el.style.left = '0';
      el.style.top = '0';
      el.style.margin = '0 auto';

      // Brief tick for visual paint in full view modal
      if (isCustomHost) {
        await new Promise(r => setTimeout(r, 60));
      }

      const canvas = await html2canvas(el, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: w,
        height: h
      });

      const wMm = w * K;
      const hMm = h * K;

      if (!pdf) {
        pdf = new jsPDF({ unit: 'mm', format: [wMm, hMm], orientation: orient });
      } else {
        pdf.addPage([wMm, hMm], orient);
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, wMm, hMm, undefined, 'FAST');

      // Hyperlinks
      const pr = el.getBoundingClientRect();
      const link = (node, url) => {
        if (!url || !pdf) return;
        const r = node.getBoundingClientRect();
        pdf.link((r.left - pr.left) * K, (r.top - pr.top) * K, r.width * K, r.height * K, { url });
      };

      el.querySelectorAll('.qr-click-btn, .qr-click-link, a[data-qr-url], a.qr-link-wrapper').forEach(q => {
        const url = q.getAttribute('data-qr-url') || q.getAttribute('href') || (info && (info.link || info.website));
        if (url && url !== '#') link(q, url);
      });
      el.querySelectorAll('.qrimg').forEach(q => {
        const parentLink = q.closest('a');
        const url = (parentLink && (parentLink.getAttribute('data-qr-url') || parentLink.getAttribute('href'))) || (info && (info.link || info.website));
        if (url && url !== '#') link(q, url);
      });
      el.querySelectorAll('.soc').forEach(s => {
        if (s.dataset.url) link(s, s.dataset.url);
      });
    }

    const cleanName = (info && info.ent ? info.ent : 'Catalogue').replace(/[^\w\s-]+/g, '_').slice(0, 32);
    const fname = `${cleanName}_Catalogue.pdf`;
    pdf.save(fname);
    return true;
  } finally {
    if (isCustomHost) {
      if (off) off.innerHTML = '';
    } else {
      if (off && typeof off.remove === 'function') {
        off.remove();
      } else if (off && off.parentNode) {
        off.parentNode.removeChild(off);
      }
    }
  }
}
