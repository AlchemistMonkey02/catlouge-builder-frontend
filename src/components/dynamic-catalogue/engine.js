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
  return TEMPLATE_REGISTRY.find(r => r.uid === uid) || TEMPLATE_REGISTRY[0];
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
    im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
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
  if (!src) return '';
  ar = ar || 1;
  const key = src.length + ':' + src.slice(-40) + ':' + (fit || 'auto') + ':' + ar.toFixed(2);
  if (sqCache.has(key)) return sqCache.get(key);

  if (typeof document === 'undefined') return src;
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
}

export const squareImg = (src, fit) => fitImg(src, fit, 1);

if (typeof window !== 'undefined') {
  window.ODOP_FIT = {
    meta: fitMeta,
    items: () => lastItems,
    get fitImg() { return fitImg; }
  };
}

export async function prepareItems(products) {
  const out = [];
  const list = products && products.length ? products : [];

  // When products are less than 5, collect all multi-angle photos from each product listing
  // and spread them across the catalogue design layouts so all slots are richly populated
  const isLessThanFive = list.length > 0 && list.length < 5;

  if (isLessThanFive) {
    const anglePool = [];
    
    list.forEach((v, pIdx) => {
      const photos = [];
      // 1. Check direct angle fields
      if (v.angle1) photos.push({ src: v.angle1, label: 'Hero / Front View', angleNum: 1 });
      if (v.angle2) photos.push({ src: v.angle2, label: 'Close-up Texture & Grain', angleNum: 2 });
      if (v.angle3) photos.push({ src: v.angle3, label: 'Perspective & Application', angleNum: 3 });

      // 2. Check images array
      if (Array.isArray(v.images) && v.images.length > 0) {
        v.images.forEach((im, imIdx) => {
          const u = typeof im === 'string' ? im : (im && im.url);
          const altLabel = typeof im === 'object' && (im.alt || im.angle);
          if (u && !photos.some(p => p.src === u)) {
            const defLabel = imIdx === 0 ? 'Front Presentation' : imIdx === 1 ? 'Surface & Texture' : 'Installed / In-Use';
            photos.push({ src: u, label: altLabel || defLabel, angleNum: imIdx + 1 });
          }
        });
      }

      // 3. Fallback to single image
      if (v.image && !photos.some(p => p.src === v.image)) {
        photos.push({ src: v.image, label: 'Primary View', angleNum: 1 });
      }

      // If product has photos, map them with product details
      if (photos.length > 0) {
        photos.forEach(ph => {
          anglePool.push({
            ...v,
            _anglePhoto: ph.src,
            _angleLabel: ph.label,
            _angleNum: ph.angleNum,
            _prodName: v.name || ('Product ' + (pIdx + 1)),
            _pIdx: pIdx
          });
        });
      } else {
        anglePool.push({
          ...v,
          _anglePhoto: '',
          _angleLabel: 'Standard View',
          _angleNum: 1,
          _prodName: v.name || ('Product ' + (pIdx + 1)),
          _pIdx: pIdx
        });
      }
    });

    // Spread the multi-angle photos across catalogue designs
    // Ensure at least 6-12 rich items are available for multi-page templates
    const targetCount = Math.max(6, Math.min(12, anglePool.length * 2));
    const spreadItems = [];
    for (let i = 0; i < targetCount; i++) {
      const base = anglePool[i % anglePool.length];
      const cycle = Math.floor(i / anglePool.length);
      spreadItems.push({
        ...base,
        _displayIndex: i + 1,
        _cycle: cycle
      });
    }

    for (let k = 0; k < spreadItems.length; k++) {
      const v = spreadItems[k];
      const src = v._anglePhoto || v.image || '';
      const rawName = (v._prodName || v.name || '').replace(/\s*\([^)]*Angle[^)]*\)/gi, '').trim();
      const name = rawName;
      const price = v.price != null ? (typeof v.price === 'number' ? `₹${v.price.toLocaleString('en-IN')}` : String(v.price)) : '';
      
      let size = v.size;
      if (!size || size === 'x cm' || size === 'nullxnull cm') {
        if (v.dimensions && v.dimensions.length && v.dimensions.width) {
          size = `${v.dimensions.length}x${v.dimensions.width} cm`;
        } else if ((v.category || '').toLowerCase().includes('garlic')) {
          size = '50 - 65 mm Caliber';
        } else if ((v.category || '').toLowerCase().includes('stone')) {
          size = '2 ft x 2 ft [Calibrated]';
        } else {
          size = 'Standard Format';
        }
      }

      const material = v.material || v.materialComposition || v.category || '';
      const colour = v.color || v.colour || '';
      const moq = v.moq || (v.wholesalePrice ? '50 pcs' : '');
      const code = (v.sku || '#PRD') + `-${String(k + 1).padStart(2, '0')}`;
      
      let finish = v.finish;
      if (!finish || finish.toLowerCase().includes('angle')) {
        if (v.technicalSpecifications && Array.isArray(v.technicalSpecifications)) {
          const spec = v.technicalSpecifications.find(s => s.key === 'Grade' || s.key === 'Bulb Diameter' || s.key === 'Texture');
          if (spec) finish = spec.value;
        }
      }
      if (!finish || finish.toLowerCase().includes('angle')) {
        finish = ((v.category || '').toLowerCase().includes('garlic')) ? 'A+ Export Grade' : (v.pattern || 'Standard Finish');
      }

      const thickness = v.thickness || '';

      const fitted = src ? await squareImg(src, v.fit || 'auto') : '';
      out.push({
        name,
        size,
        material,
        colour,
        price,
        moq,
        code,
        finish,
        thickness,
        img: fitted,
        _src: src,
        _fit: v.fit || 'auto'
      });
    }
  } else {
    // Normal 1-to-1 processing when 5 or more products are listed
    for (let k = 0; k < list.length; k++) {
      const v = list[k];
      const src = v.image || (v.images && v.images[0] && (v.images[0].url || v.images[0])) || '';
      const name = (v.name || ('Product ' + (k + 1))).replace(/\s*\([^)]*Angle[^)]*\)/gi, '').trim();
      const price = v.price != null ? (typeof v.price === 'number' ? `₹${v.price.toLocaleString('en-IN')}` : String(v.price)) : '';
      
      let size = v.size;
      if (!size || size === 'x cm' || size === 'nullxnull cm') {
        if (v.dimensions && v.dimensions.length && v.dimensions.width) {
          size = `${v.dimensions.length}x${v.dimensions.width} cm`;
        } else if ((v.category || '').toLowerCase().includes('garlic')) {
          size = '50 - 65 mm Caliber';
        } else if ((v.category || '').toLowerCase().includes('stone')) {
          size = '2 ft x 2 ft';
        } else {
          size = 'Standard Format';
        }
      }

      const material = v.material || v.materialComposition || v.category || '';
      const colour = v.color || v.colour || '';
      const moq = v.moq || (v.wholesalePrice ? '50 pcs' : '');
      const code = v.sku || v.code || ('#SKU-' + String(k + 1).padStart(2, '0'));
      
      let finish = v.finish;
      if (!finish || finish.toLowerCase().includes('angle')) {
        finish = ((v.category || '').toLowerCase().includes('garlic')) ? 'A+ Export Grade' : (v.pattern || 'Standard Finish');
      }
      const thickness = v.thickness || '';

      const fitted = src ? await squareImg(src, v.fit || 'auto') : '';
      out.push({
        name,
        size,
        material,
        colour,
        price,
        moq,
        code,
        finish,
        thickness,
        img: fitted,
        _src: src,
        _fit: v.fit || 'auto'
      });
    }
  }

  out.forEach(it => {
    if (it.img && it._src) fitMeta.set(it.img, { src: it._src, fit: it._fit });
  });
  lastItems = out;
  return out;
}

export async function fitPages(pages, items, templateUid) {
  if (typeof document === 'undefined') return pages;
  const bySq = new Map(items.filter(i => i.img && i._src).map(i => [i.img, i]));
  if (!bySq.size && !templateUid) return pages;

  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none';
  host.innerHTML = pages.join('');
  document.body.appendChild(host);

  try {
    if (templateUid && window.DesignEditor) {
      await window.DesignEditor.applyAll(host, templateUid, items);
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
    return [...host.children].map(p => p.outerHTML);
  } finally {
    host.remove();
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

  const th = (window.TplColor && sel.theme ? recolorTheme(sel.theme, window.TplColor) : sel.theme) || {};
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

  const ent = company ? (company.name || company.brandName || 'Brand Company') : 'Catalogue Studio';
  const district = (company && company.contact && (company.contact.city || company.contact.state)) || 'India';
  const person = (company && company.contact && (company.contact.contactPerson || company.contact.person)) || '';
  const mobile = (company && company.contact && (company.contact.phone || company.contact.mobile)) || '';
  const email = (company && company.contact && company.contact.email) || '';
  const addr = (company && company.contact && company.contact.address) || '';
  const website = (company && company.contact && company.contact.website) || '';
  const gst = (company && company.tax && (company.tax.gstNumber || company.tax.gstin)) || '';
  const logo = (company && company.branding && company.branding.logoUrl) || (company && company.logoUrl) || '';
  const desc = (company && (company.description || company.tagline)) || (products && products[0] && products[0].description) || 'Premium curated catalogue collection with precision engineering and superior materials.';
  const use = (company && (company.industry || company.category)) || 'Commercial, Residential, Architectural & Custom supply';
  const tagline = (company && company.tagline) || (textOverrides && textOverrides.tagline) || 'Excellence in every detail.';

  const info = {
    ent,
    district,
    person,
    mobile,
    email,
    addr,
    website,
    gst,
    logo,
    desc,
    use,
    tagline,
    link: website || (mobile ? `https://wa.me/91${mobile.replace(/\D/g, '')}` : '')
  };

  const copy = getCopy(info, textOverrides);
  const items = await prepareItems(products);

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
      if (info.link) {
        const qrImg = await qrDataUrl(info.link);
        qrs.push({ label: 'Digital Profile', url: info.link, img: qrImg, note: 'Scan to connect' });
      }
      if (mobile) {
        const waLink = `https://wa.me/91${mobile.replace(/\D/g, '')}`;
        const qrImg = await qrDataUrl(waLink);
        qrs.push({ label: 'WhatsApp Direct', url: waLink, img: qrImg, note: 'Instant inquiries' });
      }
      if (website && website !== info.link) {
        const qrImg = await qrDataUrl(website);
        qrs.push({ label: 'Official Website', url: website, img: qrImg, note: 'Visit online portal' });
      }
    }
  }

  const themedSel = colorOverride && sel.theme
    ? Object.assign({}, sel.t, { theme: recolorTheme(sel.theme, colorOverride) })
    : (sel.t || sel);

  const ctx = {
    info,
    items,
    copy,
    qr: qrs[0] ? qrs[0].img : '',
    qrs,
    pf: 'Digital Profile'
  };

  const pgs = sel.mod.render(themedSel, ctx);
  if (includeQr && qrs.length > 0) {
    const qp = qrPageHtml(info, sel, qrs);
    if (qp) pgs.push(qp);
  }

  const finalPages = await fitPages(pgs, items, sel.uid);
  return { sel, pages: finalPages, items, info };
}

/* ---------------- High Definition PDF Generation ---------------- */
export async function exportDynamicPdf({
  pages,
  info,
  sel,
  items,
  onProgress
}) {
  if (!pages || !pages.length) return false;

  const off = document.createElement('div');
  off.id = 'dynamic-pdf-export-host';
  // Position behind the page at (0, 0) with high negative z-index so it's 100% visible to html2canvas without showing to user
  off.style.cssText = 'position:fixed;left:0;top:0;width:auto;height:auto;background:#ffffff;z-index:-99999;pointer-events:none;';
  off.innerHTML = pages.join('');
  document.body.appendChild(off);

  try {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Apply any customized text edits, repositioned elements, and swapped photos to the export container
    if (sel && sel.uid) {
      await applyAll(off, sel.uid, items);
    }

    // Wait for all images inside the export container to load
    const imgs = [...off.querySelectorAll('img')];
    if (imgs.length) {
      await Promise.all(imgs.map(im => {
        if (im.complete) return Promise.resolve();
        return new Promise(res => {
          im.onload = res;
          im.onerror = res;
          setTimeout(res, 2000);
        });
      }));
    }

    let els = [...off.querySelectorAll('.pg')];
    if (!els.length) {
      els = [...off.children];
    }
    const K = 25.4 / 96; // convert px to mm for A4
    let pdf = null;

    for (let i = 0; i < els.length; i++) {
      if (onProgress) onProgress(i + 1, els.length);

      // Only display the current page so it sits cleanly at top: 0, left: 0
      els.forEach((pEl, pIdx) => {
        pEl.style.display = (pIdx === i) ? 'block' : 'none';
      });

      const el = els[i];
      const w = el.offsetWidth || (sel && sel.size ? sel.size[0] : 794);
      const h = el.offsetHeight || (sel && sel.size ? sel.size[1] : 1123);
      const orient = w > h ? 'l' : 'p';
      el.style.position = 'relative';
      el.style.left = '0';
      el.style.top = '0';
      el.style.margin = '0';

      const canvas = await html2canvas(el, {
        scale: 2.0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        x: 0,
        y: 0,
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

      el.querySelectorAll('.qrimg').forEach(q => link(q, info && (info.link || info.website)));
      el.querySelectorAll('.soc').forEach(s => {
        if (s.dataset.url) link(s, s.dataset.url);
      });
    }

    const cleanName = (info && info.ent ? info.ent : 'Catalogue').replace(/[^\w\s-]+/g, '_').slice(0, 32);
    const fname = `${cleanName}_Catalogue.pdf`;
    pdf.save(fname);
    return true;
  } finally {
    off.remove();
  }
}
