/* Garlic Catalogue Templates (8 dedicated structurally distinct professional templates)
   Specialized for Fresh Garlic Bulbs, Export Grades, Peeled Cloves, Flakes & Agri-Commodity */

const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => (s || '').toUpperCase();
const pn = n => String(n).padStart(2, '0');
const bg = u => (u && typeof u === 'string') ? `background-image:url('${u.replace(/'/g, "%27")}')` : '';
const fmtWa = w => {
  if (!w) return '';
  let s = String(w).trim();
  s = s.replace(/^(\+?91\s*)+/gi, '').replace(/^\+/, '').trim();
  return `+91 ${s}`;
};
const fmtPrice = p => {
  if (p == null || p === '') return '₹180 / kg';
  const s = String(p).trim();
  if (s.startsWith('₹')) return s;
  const num = Number(s.replace(/[^0-9.]/g, ''));
  if (!isNaN(num) && num > 0) return `₹${num.toLocaleString('en-IN')} / kg`;
  return 'Price on Request';
};

const th = (name, bg, ink, muted, acc, dark, soft, line, onDark) => ({ name, bg, ink, muted, acc, dark, soft, line, onDark });

const TEMPLATES = [
  {
    id: 'garlic-1',
    cat: 'Garlic Specialty',
    name: 'Farm Fresh Organic Harvest',
    desc: 'Emerald green & warm soil gold, fresh bulb hero, sizing scale 40-60mm, nutrient profile',
    theme: th('Organic Earth & Gold', '#fbfbf7', '#1a2e1f', '#4d6352', '#2d6a4f', '#1b4332', '#edf5ef', '#d3e2d6', '#f0fdf4'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: '100% Organic Farm Fresh'
  },
  {
    id: 'garlic-2',
    cat: 'Garlic Specialty',
    name: 'Export-Grade Bulb Specification',
    desc: 'Sleek agro-export dossier, diameter grading A/B/C, mesh bag packaging, phytosanitary standards',
    theme: th('Agro Export Navy & Amber', '#f8fafc', '#0f172a', '#475569', '#d97706', '#1e293b', '#f1f5f9', '#e2e8f0', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Global Export Grade'
  },
  {
    id: 'garlic-3',
    cat: 'Garlic Specialty',
    name: 'Pure Cloves & Dehydrated Flakes',
    desc: 'Terracotta kitchen warmth, peeled cloves, dehydrated flakes, minced paste food service',
    theme: th('Warm Terracotta & Ivory', '#fef8f4', '#291811', '#785647', '#b45309', '#632c12', '#fae8dc', '#ecd0be', '#fffbeb'),
    hf: "'Cormorant Garamond', serif",
    bf: "'Inter', sans-serif",
    badge: 'Culinary & Commercial'
  },
  {
    id: 'garlic-4',
    cat: 'Garlic Specialty',
    name: 'B2B Commodity Wholesale Matrix',
    desc: 'High-density pricing grid, 20ft/40ft reefer container volume, moisture metrics & cold logistics',
    theme: th('Commercial Slate & Jade', '#f4f6f8', '#111827', '#4b5563', '#059669', '#1f2937', '#e5e7eb', '#d1d5db', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'B2B Wholesale'
  },
  {
    id: 'garlic-5',
    cat: 'Garlic Specialty',
    name: 'Heritage Farm Provenance',
    desc: 'Story of soil health, pesticide-free verification, farmer collective, seasonal harvest calendar',
    theme: th('Rustic Sage & Raw Cotton', '#f5f7f2', '#222920', '#546150', '#52796f', '#2f3e35', '#e3ebd9', '#c9d9bd', '#f4fbf0'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Artisanal Harvest'
  },
  {
    id: 'garlic-6',
    cat: 'Garlic Specialty',
    name: 'Gourmet Black Garlic & Derivatives',
    desc: 'Deep obsidian luxury spread, aged black garlic cloves, cold-pressed oil, health allicin potency',
    theme: th('Obsidian & Antique Brass', '#121417', '#f1f5f9', '#94a3b8', '#d4af37', '#090a0c', '#1e232a', '#2d3748', '#ffffff'),
    hf: "'Cinzel', serif",
    bf: "'Inter', sans-serif",
    badge: 'Gourmet Specialty'
  },
  {
    id: 'garlic-7',
    cat: 'Garlic Specialty',
    name: 'Global Cold-Chain Export Catalogue',
    desc: 'Deep marine export catalogue, temperature control 0°C to -2°C, HS 07032000, sea logistics',
    theme: th('Marine Blue & Pure White', '#f0f4f8', '#0b192c', '#334155', '#0284c7', '#081729', '#e0e8f0', '#cbd5e1', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Cold-Chain Certified'
  },
  {
    id: 'garlic-8',
    cat: 'Garlic Specialty',
    name: 'Artisanal Producers Showcase',
    desc: 'Modern grower collective, braided garlic bunches, direct farm pricing, sustainable agricultural cycle',
    theme: th('Warm Olive & Terracotta', '#f9f8f3', '#1e2417', '#5a634e', '#c2410c', '#39422b', '#eae8dc', '#dad6c3', '#fefcf8'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Growers Guild'
  }
];

/* Common Header & Footer builders */
const head = (c, label, no) => `
  <div class="g-head">
    <div class="g-head-brand">
      <span class="g-leaf-icon">🧄</span>
      <strong>${E(c.info.ent || 'PREMIUM GARLIC')}</strong>
      <span class="g-head-district" style="font-size:10px; color:var(--muted); font-weight:600; margin-left:8px;">&bull; District: ${E(c.info.district || 'Baran, Rajasthan')} [ODOP: ${E(c.info.odopProduct || 'Garlic')}]</span>
    </div>
    <span class="g-head-tag">${E(label)}</span>
    <span class="g-head-num">${pn(no)}</span>
  </div>
`;

const foot = c => `
  <div class="g-foot">
    <span><b>${E(c.info.ent || '')}</b> &bull; 📍 District: ${E(c.info.district || 'Baran, Rajasthan')} &bull; 🏷️ ODOP: ${E(c.info.odopProduct || 'Garlic')}</span>
    <span>💬 WhatsApp: <b>${E(fmtWa(c.info.whatsapp || c.info.mobile))}</b> ${c.info.email ? `&bull; ${E(c.info.email)}` : ''}</span>
  </div>
`;

/* Common Contact Page */
function contactPage(c, no) {
  const i = c.info, qrs = c.qrs || [];
  return `
    ${head(c, 'DIRECT PROCUREMENT & ENQUIRIES', no)}
    <div class="g-contact-wrap">
      <div class="g-contact-banner">
        <span class="g-badge-gold">B2B SUPPLY &amp; GLOBAL CONTRACTS</span>
        <h2 class="g-contact-h2">Partner with ${E(i.ent || 'Us')}</h2>
        <p class="g-contact-p">
          We service wholesale distributors, supermarkets, food processing units, and international importers with consistent volume, scheduled deliveries, and verified inspection certificates.
        </p>
      </div>

      <div class="g-contact-details-grid">
        <div class="g-detail-card">
          <h3>📍 Operating Base &amp; Facilities</h3>
          <p><strong>Entity:</strong> ${E(i.ent || 'Agri Commodity Pvt Ltd')}</p>
          <p><strong>Address:</strong> ${E(i.addr || 'Garlic Mandi Industrial Area, Kota / Mandsaur')}</p>
          ${i.gst ? `<p><strong>GST / Mandi Code:</strong> ${E(i.gst)}</p>` : ''}
        </div>

        <div class="g-detail-card">
          <h3>📞 Trade &amp; Export Desk</h3>
          <p><strong>Primary Contact:</strong> ${E(i.person || 'Export Sales Director')}</p>
          <p><strong>Mobile / WhatsApp:</strong> ${E(i.mobile || '+91 98765 43210')}</p>
          ${i.email ? `<p><strong>Email:</strong> ${E(i.email)}</p>` : ''}
          <p><strong>HS Code:</strong> 07032000 (Fresh / Chilled Garlic)</p>
        </div>
      </div>

      <div class="g-qr-section">
        <h3>Digital Access &amp; Instant Catalogues</h3>
        <div class="g-qr-row">
          ${qrs.length ? qrs.map(q => `
            <div class="g-qr-pill">
              <img src="${q.img}" class="qrimg" alt="${q.label}" />
              <b>${E(q.label)}</b>
              <small>Scan with phone camera</small>
            </div>
          `).join('') : `
            <div class="g-qr-pill">
              <div class="g-qr-placeholder">🧄</div>
              <b>Direct WhatsApp Ordering</b>
              <small>${E(i.mobile || 'Connect with procurement team')}</small>
            </div>
          `}
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 1: FARM FRESH ORGANIC HARVEST (2-Column Panoramic Cards + Organic Seal)
   ========================================================================= */
function t1_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t1-cover">
      <div class="g-odop-gov-banner">
        <span class="g-gov-emblem">🏛️</span>
        <div class="g-gov-text">
          <strong>GOVERNMENT OF INDIA &bull; ONE DISTRICT ONE PRODUCT (ODOP) INITIATIVE</strong>
          <span>DISTRICT: <b>${E(i.district || 'Baran, Rajasthan')}</b> &bull; ODOP PRODUCT: <b>${E(i.odopProduct || 'Garlic')}</b></span>
        </div>
      </div>
      <div class="t1-hero" style="${bg(hero)}">
        <div class="t1-hero-overlay"></div>
        <div class="t1-seal">🌱 100% ORGANIC CERTIFIED</div>
        <div class="t1-hero-text">
          <span class="t1-sub">DISTRICT: ${E(cap(i.district || 'Baran, Rajasthan'))} &bull; ODOP: ${E(cap(i.odopProduct || 'Garlic'))}</span>
          <h1 class="t1-h1">${E(i.ent || 'Fresh Garlic Harvest')}</h1>
        </div>
      </div>
      <div class="t1-body">
        <div class="t1-intro">
          <h2>Sun-Cured White Bulbs &bull; Direct Farm Origin</h2>
          <p>${E(i.desc || 'Direct farm procurement featuring high allicin pungency, pesticide-free soil cultivation, and strict multi-stage mechanical caliber sorting.')}</p>
        </div>
        <div class="t1-metrics">
          <div class="t1-metric-pill"><b>40-65mm</b><small>Calibrated Sizing</small></div>
          <div class="t1-metric-pill"><b>&lt;65%</b><small>Moisture Tested</small></div>
          <div class="t1-metric-pill"><b>90 Days+</b><small>Storage Stability</small></div>
        </div>
      </div>
    </div>
  `;
}


function renderGarlicProductCard(it, idx, c, prefix = 'grl') {
  let rawImg = it.img || it.image;
  if (rawImg && typeof rawImg === 'object') {
    rawImg = rawImg.url || rawImg.img || (Array.isArray(rawImg.images) && rawImg.images[0]) || '';
  }
  if (!rawImg || typeof rawImg !== 'string') {
    if (Array.isArray(it.images) && it.images[0]) {
      const f = it.images[0];
      rawImg = typeof f === 'string' ? f : (f?.url || f?.img || '');
    }
    if (!rawImg || typeof rawImg !== 'string') rawImg = it.angle1 || '/assets/garlic/garlic-01.jpeg';
  }
  const cardImg = typeof rawImg === 'string' && rawImg ? rawImg : '/assets/garlic/garlic-01.jpeg';
  const cardPrice = fmtPrice(it.price || it.formattedPrice || 180);
  const cardSku = it.sku || it.code || `#${prefix.toUpperCase()}-${pn(idx + 1)}`;
  const cardName = (it.name || it.title || 'Grade-A Export Fresh Garlic Bulbs').replace(/\s*\([^)]*Angle[^)]*\)/gi, '').trim();
  const cardDesc = it.shortDescription || it.description || 'Sun-cured large caliber garlic bulbs from Malwa soil with papery white skins and rich aromatic allicin.';
  const cardTag = it.subcategory || it.productType || 'EXPORT GARLIC';
  const cardCraft = (c.info && c.info.ent) || it.brand || 'Malwa Agro Producer Co.';

  const specSize = it.size || '50 - 65 mm (Grade A+ Large)';
  const specMaterial = it.material || it.materialComposition || '100% Organically Grown Malwa Garlic';
  const specFinish = it.finish || 'Sun-Cured Export Clean White Skin';
  const specApp = it.application || it.useApplication || 'Commercial Culinary, Dehydration & Export';
  const specPriceRange = it.priceRange || `${cardPrice} – ₹240 / kg`;
  const specMoq = it.moq || '500 kg (Wholesale Lot)';

  const safeImg = typeof cardImg === 'string' ? cardImg.replace(/'/g, '%27') : '/assets/garlic/garlic-01.jpeg';

  return `
    <div class="g-odop-card">
      <div class="g-odop-img" style="${bg(cardImg)}">
        <img src="${safeImg}" alt="${E(cardName)}" class="g-odop-img-el" onerror="this.onerror=null; this.src='/assets/garlic/garlic-01.jpeg';" />
        <span class="g-odop-tag">${E(cap(cardTag))}</span>
        <span class="g-odop-district-chip">ODOP ${E(c.info.district ? c.info.district.split(',')[0].trim() : 'Baran')}</span>
      </div>
      <div class="g-odop-details">
        <div class="g-odop-meta-row">
          <span class="g-odop-sku-chip">SKU: ${E(cardSku)}</span>
          <span class="g-odop-moq-chip">MOQ: ${E(specMoq)}</span>
        </div>
        <h3>${E(cardName)}</h3>
        <div class="g-odop-desc-row">
          <p class="g-odop-desc">${E(cardDesc)}</p>
        </div>
        
        <div class="g-odop-spec-matrix">
          <div class="g-odop-spec-item" title="${E(specSize)}">
            <span class="g-odop-spec-lbl">📏 Size:</span>
            <span class="g-odop-spec-val">${E(specSize)}</span>
          </div>
          <div class="g-odop-spec-item" title="${E(specMaterial)}">
            <span class="g-odop-spec-lbl">🌱 Material:</span>
            <span class="g-odop-spec-val">${E(specMaterial)}</span>
          </div>
          <div class="g-odop-spec-item" title="${E(specFinish)}">
            <span class="g-odop-spec-lbl">✨ Finish:</span>
            <span class="g-odop-spec-val">${E(specFinish)}</span>
          </div>
          <div class="g-odop-spec-item" title="${E(specApp)}">
            <span class="g-odop-spec-lbl">🎯 Use:</span>
            <span class="g-odop-spec-val">${E(specApp)}</span>
          </div>
        </div>

        <div class="g-odop-foot">
          <div class="g-odop-price-block">
            <span class="g-odop-price">${E(cardPrice)}</span>
            <span class="g-odop-range">Range: ${E(specPriceRange)}</span>
          </div>
          <div class="g-odop-contact-block">
            <span class="g-odop-craft">${E(cardCraft)}</span>
            <span class="g-odop-wa">💬 WA: ${E(fmtWa(c.info.whatsapp || c.info.mobile))}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function t1_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `ORGANIC HARVEST RANGE (PAGE ${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Naturally Sun-Cured Bulb Varieties</h2>
      <p>Graded by diameter caliber, clove density, and skin layer tightness</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'org')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 2: EXPORT-GRADE BULB SPECIFICATION (Technical B2B Blueprint Dossier)
   ========================================================================= */
function t2_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t2-cover">
      <div class="t2-dossier-bar">
        <span>AGRO-COMMODITY EXPORT DOSSIER</span>
        <span>HS CODE: 07032000</span>
        <span>STANDARDS: GLOBAL G.A.P.</span>
      </div>
      <div class="t2-split">
        <div class="t2-left">
          <span class="t2-stamp">INSPECTED &amp; APPROVED</span>
          <h1 class="t2-h1">${E(i.ent || 'Export Garlic Specifications')}</h1>
          <div class="t2-divider"></div>
          <p class="t2-desc">${E(i.desc || 'Engineered grading dossiers for international maritime containerized garlic logistics. Rigorous phytosanitary compliance, strict diameter calibration and moisture control.')}</p>
          <div class="t2-calipers">
            <div class="t2-cbox"><b>GRADE A+</b><span>55mm - 65mm+</span></div>
            <div class="t2-cbox"><b>GRADE A</b><span>45mm - 55mm</span></div>
            <div class="t2-cbox"><b>GRADE B</b><span>40mm - 45mm</span></div>
          </div>
        </div>
        <div class="t2-right" style="${bg(hero)}">
          <div class="t2-badge-marine">REEFER COMPATIBLE</div>
        </div>
      </div>
    </div>
  `;
}

function t2_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `TECHNICAL SPECIFICATION MATRIX (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Calibrated Export Sizing &amp; Bulk Packing</h2>
      <p>Optical mechanical sorting &bull; Mesh bag &amp; carton box packings</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'exp')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 3: PURE CLOVES & DEHYDRATED FLAKES (Culinary / HoReCa Food-Service)
   ========================================================================= */
function t3_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t3-cover">
      <div class="t3-top-band">
        <span>GASTRONOMY &bull; FOOD PROCESSING &bull; HORECA BULK</span>
      </div>
      <div class="t3-circle-wrap">
        <div class="t3-circle-img" style="${bg(hero)}"></div>
        <div class="t3-chef-seal">🧑‍🍳 CHEF'S CHOICE</div>
      </div>
      <h1 class="t3-title">${E(i.ent || 'Pure Cloves &amp; Dehydrated Garlic')}</h1>
      <p class="t3-sub">${E(i.desc || 'Premium peeled cloves, toasted flakes, granulated powders, and ready-to-use culinary pastes for commercial kitchens and global food manufacturers.')}</p>
      <div class="t3-culinary-strip">
        <div>🍲 Dehydrated Flakes</div>
        <div>🧄 Vacuum Peeled Cloves</div>
        <div>🧂 Pure Garlic Powder</div>
        <div>🥫 Food-Grade Paste</div>
      </div>
    </div>
  `;
}

function t3_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `CULINARY & FOOD SERVICE SELECTION (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Commercial Kitchen &amp; Food-Processing Formats</h2>
      <p>Cleaned, sorted, and hygienic packaging for instant culinary integration</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'cul')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 4: B2B COMMODITY WHOLESALE MATRIX (High-Density Tabular Pricing Grid)
   ========================================================================= */
function t4_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t4-cover">
      <div class="t4-header-bar">
        <span>COMMODITY EXCHANGE &bull; BULK WHOLESALE TERMINAL</span>
        <span>MANDI PRICE INDEX 2026</span>
      </div>
      <div class="t4-hero-banner" style="${bg(hero)}">
        <div class="t4-dark-grad"></div>
        <div class="t4-hero-content">
          <span class="t4-tag">B2B COMMODITY SUPPLY</span>
          <h1>${E(i.ent || 'Commercial Garlic Wholesale')}</h1>
          <p>${E(i.desc || 'High-volume mandi supply contracts, containerized reefer shipments, direct mandi auction lots, and certified industrial agro-processing raw material.')}</p>
        </div>
      </div>
      <div class="t4-matrix-summary">
        <div class="t4-sum-box"><b>28 MT</b><span>Per 40ft Reefer FCL</span></div>
        <div class="t4-sum-box"><b>-1°C to 0°C</b><span>Chilled Transit Temp</span></div>
        <div class="t4-sum-box"><b>10/20/25 KG</b><span>Mesh Bag Packing</span></div>
        <div class="t4-sum-box"><b>FOB / CIF</b><span>Global Delivery Terms</span></div>
      </div>
    </div>
  `;
}

function t4_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `WHOLESALE COMMODITY MATRIX (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Wholesale Rate &amp; Container Specification Grid</h2>
      <p>Real-time FOB quotes &bull; Standardized commercial export grading</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'whs')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 5: HERITAGE FARM PROVENANCE (Rustic Editorial Magazine Story Layout)
   ========================================================================= */
function t5_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t5-cover">
      <div class="t5-vintage-masthead">
        <span class="t5-vol">THE HERITAGE HARVEST JOURNAL &bull; VOL. IV</span>
        <h1 class="t5-title">${E(i.ent || 'Heirloom Garlic Collective')}</h1>
        <span class="t5-origin">ORIGIN: ${E(cap(i.district || 'CHAMBAL VALLEY'))} FERTILE ALLUVIAL PLAINS</span>
      </div>
      <div class="t5-photo-frame" style="${bg(hero)}">
        <div class="t5-stamp">PROVENANCE GUARANTEED</div>
      </div>
      <div class="t5-editorial-col">
        <p class="t5-lead">
          ${E(i.desc || 'Rooted in generations of agrarian craftsmanship. Our heirloom garlic bulbs are nurtured in mineral-rich black cotton soils, hand-lifted at peak maturity, and cured slowly under winter sunlight.')}
        </p>
      </div>
    </div>
  `;
}

function t5_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `HEIRLOOM HARVEST SELECTION (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Rare Heirloom &amp; High-Allicin Strains</h2>
      <p>Heritage seed lines cultivated in mineral-rich Chambal and Malwa alluvial black soil</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'hrl')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 6: GOURMET BLACK GARLIC MONOGRAPH (Dark Obsidian Luxury & Gold Foil)
   ========================================================================= */
function t6_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t6-cover">
      <div class="t6-gold-border"></div>
      <div class="t6-masthead">
        <span class="t6-sub">FERMENTED BOTANICAL LUXURY</span>
        <h1 class="t6-title">${E(i.ent || 'The Black Garlic Monograph')}</h1>
        <div class="t6-gold-divider"></div>
      </div>
      <div class="t6-spotlight-wrap">
        <div class="t6-spotlight" style="${bg(hero)}"></div>
        <div class="t6-gold-seal">90 DAYS MAILLARD AGED</div>
      </div>
      <p class="t6-lead">
        ${E(i.desc || 'A culinary masterpiece born of patience. Fermented whole bulbs transformed into rich, sweet, balsamic-like black cloves packed with 10x antioxidant polyphenol potency.')}
      </p>
      <div class="t6-purity-row">
        <div><span>100%</span> Natural Fermentation</div>
        <div><span>Zero</span> Preservatives</div>
        <div><span>High</span> S-Allyl-Cysteine</div>
      </div>
    </div>
  `;
}

function t6_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `GOURMET SPECIALTY COLLECTION (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Aged Black Garlic &amp; Infusions</h2>
      <p>Artisanal culinary treasures for Michelin-starred dining and nutraceuticals</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'gld')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 7: GLOBAL COLD-CHAIN EXPORT CATALOGUE (Marine Blue Logistics Layout)
   ========================================================================= */
function t7_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t7-cover">
      <div class="t7-ocean-bar">
        <span>GLOBAL SEA LOGISTICS &bull; REFRIGERATED FREIGHT</span>
        <span>TEMPERATURE: -1°C TO 0°C</span>
      </div>
      <div class="t7-split-hero">
        <div class="t7-hero-img" style="${bg(hero)}">
          <div class="t7-temp-dial">
            <b>-1.5°C</b>
            <small>Transit Temp</small>
          </div>
        </div>
        <div class="t7-hero-text">
          <span class="t7-marine-tag">EXPORT PROTOCOL HS 07032000</span>
          <h1>${E(i.ent || 'Cold-Chain Garlic Exports')}</h1>
          <p>${E(i.desc || 'End-to-end refrigerated export shipping ensuring dormancy preservation, zero sprouting, and maximum shelf life at destination ports in Europe, Middle East, and Southeast Asia.')}</p>
          <div class="t7-ports">
            <div>⚓ Mundra Port</div>
            <div>⚓ Nhava Sheva (JNPT)</div>
            <div>⚓ Chennai Port</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function t7_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `CONTAINER LOAD SPECIFICATIONS (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Marine Container Graded Shipments</h2>
      <p>Packed in UV-resistant high-ventilation polypropylene mesh bags</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'bay')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 8: ARTISANAL PRODUCERS SHOWCASE & GUILD (Grower Collective Layout)
   ========================================================================= */
function t8_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="t8-cover">
      <div class="t8-guild-banner">
        <span>🌱 GROWER GUILD &bull; DIRECT PRODUCER ALLIANCE</span>
      </div>
      <div class="t8-hero-split">
        <div class="t8-left">
          <div class="t8-guild-crest">🧄</div>
          <h1>${E(i.ent || 'Artisanal Garlic Guild')}</h1>
          <p>${E(i.desc || 'Connecting progressive garlic growers directly with commercial culinary buyers. Transparent fair pricing, pesticide-free practices, and verified harvest lot traceability.')}</p>
          <div class="t8-badges">
            <span>✓ Direct Farmer Gate</span>
            <span>✓ Chemical-Free Curing</span>
            <span>✓ Braided Stalk Bundles</span>
          </div>
        </div>
        <div class="t8-right" style="${bg(hero)}">
          <div class="t8-braid-tag">BRAIDED BUNCH SPECIALTY</div>
        </div>
      </div>
    </div>
  `;
}

function t8_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `ARTISAN GROWERS CATALOGUE (${pageIdx}/${totalPages})`, no)}
    <div class="t1-prod-header">
      <h2>Direct Producer Batches &amp; Braided Bundles</h2>
      <p>Harvested, cured, and hand-bundled by our certified grower collective</p>
    </div>
    <div class="g-odop-grid">
      ${slice.map((it, idx) => renderGarlicProductCard(it, idx, c, 'grw')).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   PAGE COUNT & MAIN RENDER DISPATCHER
   ========================================================================= */
function pageCount(t, n) {
  return 1 + Math.ceil(Math.max(1, n) / 4) + 1;
}

function render(t, ctx) {
  const th = t.theme;
  const items = (ctx.items || []).map((it, k) => Object.assign({ code: `#GAR-${pn(k + 1)}` }, it));
  const c = Object.assign({}, ctx, {
    items,
    th,
    copy: ctx.copy || {},
    hero: ctx.heroImg || (items[0] && items[0].img) || ''
  });

  const style = `
    --bg:${th.bg};
    --ink:${th.ink};
    --muted:${th.muted};
    --acc:${th.acc};
    --dark:${th.dark};
    --soft:${th.soft};
    --line:${th.line};
    --onDark:${th.onDark};
    --hf:${t.hf};
    --bf:${t.bf};
    background-color:${th.bg};
    font-family:${t.bf};
  `;

  const wrap = (h, extraCls = '') => `<div class="pg garlic-pg ${extraCls}" style="${style}">${h}</div>`;
  const P = [];
  let no = 1;

  // Render distinct structure based on t.id
  if (t.id === 'garlic-1') {
    P.push(wrap(t1_cover(c, t), 'g1-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t1_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g1-mode'));
    }
  } else if (t.id === 'garlic-2') {
    P.push(wrap(t2_cover(c, t), 'g2-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t2_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g2-mode'));
    }
  } else if (t.id === 'garlic-3') {
    P.push(wrap(t3_cover(c, t), 'g3-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t3_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g3-mode'));
    }
  } else if (t.id === 'garlic-4') {
    P.push(wrap(t4_cover(c, t), 'g4-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t4_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g4-mode'));
    }
  } else if (t.id === 'garlic-5') {
    P.push(wrap(t5_cover(c, t), 'g5-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t5_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g5-mode'));
    }
  } else if (t.id === 'garlic-6') {
    P.push(wrap(t6_cover(c, t), 'g6-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t6_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g6-mode'));
    }
  } else if (t.id === 'garlic-7') {
    P.push(wrap(t7_cover(c, t), 'g7-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t7_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g7-mode'));
    }
  } else {
    // garlic-8
    P.push(wrap(t8_cover(c, t), 'g8-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t8_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'g8-mode'));
    }
  }

  // Final Contact page
  const modeTag = (t.id || 'garlic-1').replace('garlic-', 'g') + '-mode';
  P.push(wrap(contactPage(c, ++no, t), modeTag));

  return P;
}

const CSS = `
/* ODOP Baran Card Matrix Styles */
.g-odop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  margin-top: 4px;
  margin-bottom: 24px;
}
.g-odop-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  height: 370px;
  max-height: 370px;
  min-height: 0;
  box-sizing: border-box;
}
.g-odop-img {
  height: 140px;
  min-height: 140px;
  max-height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  background-color: var(--soft, #f0fdf4);
}
.g-odop-img-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.g-odop-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--dark, #14532d);
  color: #fff;
  font-size: 8.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}
.g-odop-district-chip {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 8.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
.g-odop-details {
  padding: 6px 10px 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  justify-content: space-between;
}
.g-odop-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.g-odop-sku-chip {
  font-size: 8.5px;
  font-family: monospace;
  font-weight: 700;
  color: var(--acc, #15803d);
}
.g-odop-moq-chip {
  font-size: 8px;
  background: rgba(22, 101, 52, 0.08);
  color: #166534;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.g-odop-details h3 {
  font-family: var(--hf, serif);
  font-size: 13.5px;
  margin: 0 0 2px;
  color: var(--ink, #1f2937);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-odop-desc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.g-odop-desc {
  font-size: 9.5px;
  color: var(--muted, #4b5563);
  margin: 0;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.g-odop-spec-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px 6px;
  background: rgba(22, 101, 52, 0.04);
  border: 1px solid rgba(22, 101, 52, 0.12);
  border-radius: 6px;
  padding: 5px 8px;
  margin: 4px 0 6px 0;
  font-size: 9.5px;
}
.g-odop-spec-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.g-odop-spec-lbl {
  font-weight: 700;
  color: #166534;
  font-size: 9px;
}
.g-odop-spec-val {
  color: #1f2937;
  font-weight: 600;
  font-size: 9.5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-odop-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line, #e5e7eb);
  padding-top: 6px;
  margin-top: 2px;
}
.g-odop-price-block {
  display: flex;
  flex-direction: column;
}
.g-odop-price {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--acc, #15803d);
  line-height: 1;
}
.g-odop-range {
  font-size: 8px;
  color: var(--muted, #6b7280);
  margin-top: 2px;
  font-weight: 600;
}
.g-odop-contact-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.g-odop-craft {
  font-size: 8.5px;
  font-weight: 700;
  color: var(--ink, #374151);
  white-space: nowrap;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-odop-wa {
  font-size: 8px;
  color: #166534;
  font-weight: 700;
  margin-top: 2px;
}


.pg.garlic-pg {
  width: 794px;
  height: 1123px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
  color: var(--ink);
  font-family: var(--bf);
  box-sizing: border-box;
  padding: 44px;
  margin-bottom: 16px;
}

/* Header & Footer */
.garlic-pg .g-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1.5px solid var(--line);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.garlic-pg .g-head-brand { display: flex; align-items: center; gap: 6px; color: var(--ink); }
.garlic-pg .g-leaf-icon { font-size: 14px; }
.garlic-pg .g-head-tag { color: var(--acc); font-weight: 700; }
.garlic-pg .g-head-num { font-weight: 800; color: var(--ink); }

.garlic-pg .g-foot {
  position: absolute;
  bottom: 16px;
  left: 44px;
  right: 44px;
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--line);
  font-size: 9.5px;
  color: var(--muted);
  letter-spacing: 0.06em;
}

.g-odop-gov-banner {
  background: linear-gradient(90deg, #1b4332, #2d6a4f);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  border: 1px solid #52b788;
}
.g-gov-emblem { font-size: 18px; }
.g-gov-text strong { display: block; font-size: 9px; letter-spacing: 0.05em; }
.g-gov-text span { font-size: 8px; opacity: 0.95; }

/* Contact Page Styles */
.garlic-pg .g-contact-wrap { margin-top: 10px; }
.garlic-pg .g-contact-banner {
  background: var(--dark);
  color: var(--onDark);
  border-radius: 18px;
  padding: 34px 40px;
  margin-bottom: 24px;
}
.garlic-pg .g-badge-gold {
  display: inline-block;
  background: var(--acc);
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.16em;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
}
.garlic-pg .g-contact-h2 {
  font-family: var(--hf);
  font-size: 34px;
  margin: 0 0 10px;
  color: var(--onDark, #ffffff);
}
.garlic-pg .g-contact-p {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.88;
  max-width: 600px;
  margin: 0;
}
.garlic-pg .g-contact-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.garlic-pg .g-detail-card {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
}
.garlic-pg .g-detail-card h3 {
  font-size: 14px;
  margin: 0 0 12px;
  color: var(--acc);
  letter-spacing: 0.04em;
}
.garlic-pg .g-detail-card p {
  font-size: 11.5px;
  margin: 0 0 8px;
  color: var(--ink);
  line-height: 1.5;
}
.garlic-pg .g-qr-section {
  background: var(--soft);
  border-radius: 16px;
  padding: 22px 28px;
  border: 1px solid var(--line);
}
.garlic-pg .g-qr-section h3 {
  font-size: 13px;
  letter-spacing: 0.08em;
  margin: 0 0 16px;
  color: var(--ink);
  text-align: center;
}
.garlic-pg .g-qr-row {
  display: flex;
  justify-content: center;
  gap: 28px;
}
.garlic-pg .g-qr-pill {
  text-align: center;
  background: #ffffff;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.garlic-pg .g-qr-pill img.qrimg {
  width: 90px;
  height: 90px;
  display: block;
  margin: 0 auto 8px;
}
.garlic-pg .g-qr-placeholder { font-size: 44px; margin-bottom: 4px; }
.garlic-pg .g-qr-pill b { display: block; font-size: 12px; color: #111827; }
.garlic-pg .g-qr-pill small { font-size: 9.5px; color: #6b7280; }

/* =========================================================================
   STYLE SUITE 1: FARM FRESH ORGANIC (g1-mode)
   ========================================================================= */
.g1-mode .t1-cover { height: 100%; display: flex; flex-direction: column; }
.g1-mode .t1-hero {
  position: relative;
  height: 600px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px;
}
.g1-mode .t1-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%);
}
.g1-mode .t1-seal {
  position: relative;
  z-index: 2;
  align-self: flex-start;
  background: #2d6a4f;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 30px;
  letter-spacing: 0.1em;
}
.g1-mode .t1-hero-text { position: relative; z-index: 2; color: #fff; }
.g1-mode .t1-sub { font-size: 12px; letter-spacing: 0.24em; opacity: 0.9; }
.g1-mode .t1-h1 { font-family: var(--hf); font-size: 52px; margin: 8px 0 0; line-height: 1.05; }
.g1-mode .t1-body { padding: 36px 12px; }
.g1-mode .t1-intro h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 10px; color: var(--dark); }
.g1-mode .t1-intro p { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin: 0 0 24px; }
.g1-mode .t1-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.g1-mode .t1-metric-pill {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 20px;
  text-align: center;
}
.g1-mode .t1-metric-pill b { display: block; font-size: 20px; color: var(--dark); font-weight: 800; }
.g1-mode .t1-metric-pill small { font-size: 11px; color: var(--muted); }
.g1-mode .t1-prod-header { margin-bottom: 12px; }
.g1-mode .t1-prod-header h2 { font-family: var(--hf); font-size: 24px; margin: 0 0 2px; }
.g1-mode .t1-prod-header p { font-size: 11.5px; color: var(--muted); margin: 0; }
.g1-mode .t1-prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.g1-mode .t1-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.g1-mode .t1-card-img {
  height: 170px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.g1-mode .t1-code {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.65);
  color: #fff;
  font-size: 9.5px;
  padding: 3px 8px;
  border-radius: 10px;
}
.g1-mode .t1-card-info { padding: 12px 16px; flex: 1; display: flex; flex-direction: column; }
.g1-mode .t1-card-info h3 {
  font-family: var(--hf);
  font-size: 15px;
  line-height: 1.25;
  margin: 0 0 6px;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.g1-mode .t1-tags { display: flex; gap: 6px; margin-bottom: 8px; }
.g1-mode .t1-tag { font-size: 9px; background: var(--soft); color: var(--acc); padding: 2px 7px; border-radius: 5px; font-weight: 600; }
.g1-mode .t1-specs { font-size: 11px; color: var(--muted); line-height: 1.45; margin-bottom: 10px; }
.g1-mode .t1-specs b { color: var(--ink); }
.g1-mode .t1-price-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}
.g1-mode .t1-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.g1-mode .t1-moq { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 2: EXPORT-GRADE BULB DOSSIER (g2-mode Blueprint)
   ========================================================================= */
.g2-mode .t2-cover { height: 100%; display: flex; flex-direction: column; }
.g2-mode .t2-dossier-bar {
  display: flex;
  justify-content: space-between;
  background: var(--dark);
  color: var(--onDark);
  padding: 10px 18px;
  font-size: 10px;
  letter-spacing: 0.16em;
  font-weight: 700;
  border-radius: 8px;
  margin-bottom: 24px;
}
.g2-mode .t2-split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; flex: 1; }
.g2-mode .t2-left { display: flex; flex-direction: column; justify-content: center; }
.g2-mode .t2-stamp {
  align-self: flex-start;
  border: 1.5px solid var(--acc);
  color: var(--acc);
  font-size: 10px;
  font-weight: 800;
  padding: 4px 12px;
  letter-spacing: 0.2em;
  margin-bottom: 14px;
}
.g2-mode .t2-h1 { font-family: var(--hf); font-size: 46px; margin: 0 0 16px; line-height: 1.05; color: var(--ink); }
.g2-mode .t2-divider { width: 60px; height: 3px; background: var(--acc); margin-bottom: 18px; }
.g2-mode .t2-desc { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 28px; }
.g2-mode .t2-calipers { display: flex; flex-direction: column; gap: 10px; }
.g2-mode .t2-cbox {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--soft);
  border-left: 4px solid var(--acc);
  font-size: 12px;
}
.g2-mode .t2-cbox b { color: var(--dark); }
.g2-mode .t2-right {
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.g2-mode .t2-badge-marine {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  padding: 8px 16px;
  font-size: 10px;
  letter-spacing: 0.16em;
  font-weight: 700;
  border-radius: 6px;
}
.g2-mode .t2-blueprint-head { margin-bottom: 20px; border-bottom: 2px solid var(--ink); padding-bottom: 8px; }
.g2-mode .t2-blueprint-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.g2-mode .t2-blueprint-head span { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
.g2-mode .t2-prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.g2-mode .t2-spec-card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}
.g2-mode .t2-card-head {
  display: flex;
  justify-content: space-between;
  background: var(--dark);
  color: #fff;
  padding: 8px 14px;
  font-size: 10px;
  font-weight: 700;
}
.g2-mode .t2-img { height: 160px; background-size: cover; background-position: center; }
.g2-mode .t2-card-body { padding: 14px 16px; }
.g2-mode .t2-name {
  font-family: var(--hf);
  font-size: 15px;
  line-height: 1.25;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.g2-mode .t2-tbl { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
.g2-mode .t2-tbl td { padding: 4px 0; border-bottom: 1px dotted var(--line); color: var(--muted); }
.g2-mode .t2-tbl td b { color: var(--ink); }
.g2-mode .t2-foot { display: flex; justify-content: space-between; align-items: center; }
.g2-mode .t2-rate { font-size: 15px; font-weight: 800; color: var(--acc); }
.g2-mode .t2-moq { font-size: 10px; background: var(--soft); padding: 4px 8px; border-radius: 4px; font-weight: 700; }

/* =========================================================================
   STYLE SUITE 3: PURE CLOVES & DEHYDRATED FLAKES (g3-mode Culinary)
   ========================================================================= */
.g3-mode .t3-cover { text-align: center; padding: 20px 0; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.g3-mode .t3-top-band { font-size: 11px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 30px; }
.g3-mode .t3-circle-wrap { position: relative; width: 340px; height: 340px; margin-bottom: 30px; }
.g3-mode .t3-circle-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 12px 30px rgba(180, 83, 9, 0.2);
  border: 8px solid var(--soft);
}
.g3-mode .t3-chef-seal {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--dark);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
.g3-mode .t3-title { font-family: var(--hf); font-size: 42px; margin: 0 0 14px; color: var(--ink); }
.g3-mode .t3-sub { font-size: 13.5px; line-height: 1.7; color: var(--muted); max-width: 580px; margin: 0 0 34px; }
.g3-mode .t3-culinary-strip {
  display: flex;
  gap: 20px;
  background: var(--soft);
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  color: var(--dark);
}
.g3-mode .t3-header { text-align: center; margin-bottom: 24px; }
.g3-mode .t3-header h2 { font-family: var(--hf); font-size: 30px; margin: 0 0 6px; color: var(--ink); }
.g3-mode .t3-header p { font-size: 12px; color: var(--muted); margin: 0; }
.g3-mode .t3-prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.g3-mode .t3-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 20px;
  border: 1px solid var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  text-align: center;
}
.g3-mode .t3-plate {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}
.g3-mode .t3-pill {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--acc);
  color: #fff;
  font-size: 9px;
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
}
.g3-mode .t3-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.g3-mode .t3-desc { font-size: 11px; color: var(--muted); line-height: 1.5; margin: 0 0 12px; }
.g3-mode .t3-spec-row { display: flex; justify-content: space-around; font-size: 10.5px; color: var(--ink); padding: 8px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin-bottom: 12px; }
.g3-mode .t3-bottom { display: flex; justify-content: space-between; align-items: center; }
.g3-mode .t3-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.g3-mode .t3-moq { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 4: B2B COMMODITY WHOLESALE (g4-mode Tabular Matrix)
   ========================================================================= */
.g4-mode .t4-cover { height: 100%; display: flex; flex-direction: column; }
.g4-mode .t4-header-bar {
  display: flex;
  justify-content: space-between;
  background: var(--dark);
  color: #fff;
  padding: 10px 18px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.16em;
  border-radius: 6px;
  margin-bottom: 20px;
}
.g4-mode .t4-hero-banner {
  position: relative;
  height: 480px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 40px;
  margin-bottom: 24px;
}
.g4-mode .t4-dark-grad { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(17, 24, 39, 0.9) 100%); }
.g4-mode .t4-hero-content { position: relative; z-index: 2; color: #fff; }
.g4-mode .t4-tag { font-size: 11px; letter-spacing: 0.2em; color: #34d399; font-weight: 800; }
.g4-mode .t4-hero-content h1 { font-family: var(--hf); font-size: 46px; margin: 8px 0 12px; }
.g4-mode .t4-hero-content p { font-size: 13.5px; line-height: 1.6; opacity: 0.9; max-width: 600px; margin: 0; }
.g4-mode .t4-matrix-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.g4-mode .t4-sum-box {
  background: var(--soft);
  border: 1px solid var(--line);
  padding: 16px 14px;
  border-radius: 10px;
  text-align: center;
}
.g4-mode .t4-sum-box b { display: block; font-size: 18px; color: var(--dark); font-weight: 800; }
.g4-mode .t4-sum-box span { font-size: 10.5px; color: var(--muted); }
.g4-mode .t4-matrix-head { margin-bottom: 18px; border-bottom: 2px solid var(--acc); padding-bottom: 10px; }
.g4-mode .t4-matrix-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.g4-mode .t4-matrix-head span { font-size: 11px; color: var(--muted); }
.g4-mode .t4-table-wrap { background: #ffffff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.g4-mode .t4-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
.g4-mode .t4-table th { background: var(--dark); color: #fff; padding: 12px 14px; text-align: left; font-size: 10px; letter-spacing: 0.1em; }
.g4-mode .t4-table td { padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.g4-mode .t4-thumb { width: 50px; height: 50px; border-radius: 8px; background-size: cover; background-position: center; }
.g4-mode .t4-table td b { display: block; font-size: 12px; color: var(--ink); }
.g4-mode .t4-table td small { font-size: 10px; color: var(--muted); }
.g4-mode .t4-price-badge { background: var(--soft); color: var(--acc); font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.g4-mode .t4-reefer-note { font-size: 11px; background: #fffbeb; color: #92400e; padding: 12px 18px; border-radius: 8px; border-left: 4px solid #d97706; }

/* =========================================================================
   STYLE SUITE 5: HERITAGE PROVENANCE (g5-mode Editorial Magazine)
   ========================================================================= */
.g5-mode .t5-cover { height: 100%; display: flex; flex-direction: column; text-align: center; }
.g5-mode .t5-vintage-masthead { border-bottom: 2px solid var(--ink); padding-bottom: 16px; margin-bottom: 24px; }
.g5-mode .t5-vol { font-size: 10px; letter-spacing: 0.32em; color: var(--muted); font-weight: 700; }
.g5-mode .t5-title { font-family: var(--hf); font-size: 48px; margin: 8px 0; color: var(--ink); }
.g5-mode .t5-origin { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.g5-mode .t5-photo-frame {
  position: relative;
  height: 520px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 24px;
}
.g5-mode .t5-stamp {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--dark);
  color: #fff;
  padding: 6px 14px;
  font-size: 9.5px;
  letter-spacing: 0.2em;
  font-weight: 800;
}
.g5-mode .t5-editorial-col { max-width: 600px; margin: 0 auto; }
.g5-mode .t5-lead { font-family: var(--hf); font-size: 15px; line-height: 1.8; color: var(--ink); font-style: italic; }
.g5-mode .t5-journal-head { margin-bottom: 24px; text-align: center; }
.g5-mode .t5-journal-head h2 { font-family: var(--hf); font-size: 30px; margin: 0 0 6px; }
.g5-mode .t5-journal-head p { font-size: 12px; color: var(--muted); font-style: italic; }
.g5-mode .t5-polaroid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px 24px; }
.g5-mode .t5-polaroid {
  background: #ffffff;
  padding: 14px 14px 20px;
  border: 1px solid var(--line);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  border-radius: 4px;
}
.g5-mode .t5-polaroid-photo { height: 210px; background-size: cover; background-position: center; position: relative; margin-bottom: 12px; }
.g5-mode .t5-seal-pin { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 18px; }
.g5-mode .t5-polaroid-caption h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 4px; }
.g5-mode .t5-desc-note { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
.g5-mode .t5-price-tag { font-size: 14px; font-weight: 800; color: var(--acc); }

/* =========================================================================
   STYLE SUITE 6: GOURMET BLACK GARLIC MONOGRAPH (g6-mode Dark Obsidian Luxury)
   ========================================================================= */
.g6-mode { background-color: #121417 !important; color: #f1f5f9 !important; }
.g6-mode .g-head { border-bottom-color: rgba(212, 175, 55, 0.3); }
.g6-mode .g-head-brand strong { color: #f1f5f9; }
.g6-mode .g-head-tag { color: #d4af37; }
.g6-mode .g-foot { border-top-color: rgba(212, 175, 55, 0.3); color: #94a3b8; }
.g6-mode .t6-cover { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.g6-mode .t6-masthead { margin-bottom: 30px; }
.g6-mode .t6-sub { font-size: 11px; letter-spacing: 0.36em; color: #d4af37; font-weight: 700; }
.g6-mode .t6-title { font-family: var(--hf); font-size: 46px; color: #ffffff; margin: 12px 0; }
.g6-mode .t6-gold-divider { width: 80px; height: 2px; background: #d4af37; margin: 0 auto; }
.g6-mode .t6-spotlight-wrap { position: relative; width: 340px; height: 340px; margin-bottom: 30px; }
.g6-mode .t6-spotlight {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 4px solid #d4af37;
  box-shadow: 0 0 35px rgba(212, 175, 55, 0.25);
}
.g6-mode .t6-gold-seal {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #d4af37;
  color: #121417;
  font-size: 10px;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 20px;
  letter-spacing: 0.12em;
  white-space: nowrap;
}
.g6-mode .t6-lead { font-size: 13.5px; line-height: 1.8; color: #cbd5e1; max-width: 580px; margin: 0 0 32px; }
.g6-mode .t6-purity-row { display: flex; gap: 32px; }
.g6-mode .t6-purity-row div { font-size: 11px; color: #94a3b8; }
.g6-mode .t6-purity-row span { color: #d4af37; font-weight: 800; font-size: 14px; display: block; }
.g6-mode .t6-head-dark { margin-bottom: 24px; text-align: center; }
.g6-mode .t6-head-dark h2 { font-family: var(--hf); font-size: 30px; color: #ffffff; margin: 0 0 6px; }
.g6-mode .t6-head-dark p { font-size: 12px; color: #94a3b8; }
.g6-mode .t6-spotlight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.g6-mode .t6-card {
  background: #1e232a;
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 14px;
  overflow: hidden;
}
.g6-mode .t6-img { height: 200px; background-size: cover; background-position: center; position: relative; }
.g6-mode .t6-code-gold { position: absolute; top: 12px; left: 12px; background: #d4af37; color: #121417; font-size: 9.5px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
.g6-mode .t6-info { padding: 18px 20px; }
.g6-mode .t6-prod-name { font-family: var(--hf); font-size: 17px; color: #ffffff; margin: 0 0 8px; }
.g6-mode .t6-notes { font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0 0 12px; }
.g6-mode .t6-details { font-size: 11px; color: #cbd5e1; margin-bottom: 14px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; }
.g6-mode .t6-details b { color: #d4af37; }
.g6-mode .t6-foot { display: flex; justify-content: space-between; align-items: center; }
.g6-mode .t6-price { font-size: 16px; font-weight: 800; color: #d4af37; }
.g6-mode .t6-badge { font-size: 10px; border: 1px solid #d4af37; color: #d4af37; padding: 3px 8px; border-radius: 6px; }

/* =========================================================================
   STYLE SUITE 7: GLOBAL COLD-CHAIN LOGISTICS (g7-mode Marine)
   ========================================================================= */
.g7-mode .t7-cover { height: 100%; display: flex; flex-direction: column; }
.g7-mode .t7-ocean-bar {
  display: flex;
  justify-content: space-between;
  background: var(--dark);
  color: #fff;
  padding: 10px 18px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  border-radius: 6px;
  margin-bottom: 24px;
}
.g7-mode .t7-split-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: center; }
.g7-mode .t7-hero-img {
  height: 520px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.g7-mode .t7-temp-dial {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(11, 25, 44, 0.9);
  color: #38bdf8;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid #0284c7;
}
.g7-mode .t7-temp-dial b { display: block; font-size: 22px; font-weight: 800; }
.g7-mode .t7-temp-dial small { font-size: 10px; color: #fff; }
.g7-mode .t7-marine-tag { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.g7-mode .t7-hero-text h1 { font-family: var(--hf); font-size: 46px; margin: 10px 0 16px; line-height: 1.1; color: var(--ink); }
.g7-mode .t7-hero-text p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.g7-mode .t7-ports { display: flex; flex-direction: column; gap: 8px; }
.g7-mode .t7-ports div { background: var(--soft); padding: 10px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--dark); }
.g7-mode .t7-marine-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 10px; }
.g7-mode .t7-marine-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.g7-mode .t7-marine-head p { font-size: 11.5px; color: var(--muted); margin: 0; }
.g7-mode .t7-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.g7-mode .t7-bay-card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.g7-mode .t7-bay-header {
  display: flex;
  justify-content: space-between;
  background: #0b192c;
  color: #fff;
  padding: 8px 14px;
  font-size: 10px;
  font-weight: 700;
}
.g7-mode .t7-img { height: 160px; background-size: cover; background-position: center; }
.g7-mode .t7-bay-body { padding: 14px 16px; }
.g7-mode .t7-bay-body h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 8px; }
.g7-mode .t7-bay-specs { font-size: 11px; line-height: 1.6; color: var(--muted); margin-bottom: 12px; }
.g7-mode .t7-bay-specs span { color: var(--ink); font-weight: 600; }
.g7-mode .t7-bay-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.g7-mode .t7-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.g7-mode .t7-lead { font-size: 10px; background: var(--soft); padding: 3px 8px; border-radius: 4px; font-weight: 600; }

/* =========================================================================
   STYLE SUITE 8: ARTISANAL PRODUCERS GUILD (g8-mode Collective)
   ========================================================================= */
.g8-mode .t8-cover { height: 100%; display: flex; flex-direction: column; }
.g8-mode .t8-guild-banner { text-align: center; padding: 10px; background: var(--soft); border-radius: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: var(--acc); margin-bottom: 24px; }
.g8-mode .t8-hero-split { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: center; }
.g8-mode .t8-guild-crest { font-size: 40px; margin-bottom: 12px; }
.g8-mode .t8-left h1 { font-family: var(--hf); font-size: 44px; margin: 0 0 16px; color: var(--ink); line-height: 1.1; }
.g8-mode .t8-left p { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.g8-mode .t8-badges { display: flex; flex-direction: column; gap: 8px; }
.g8-mode .t8-badges span { font-size: 12px; font-weight: 700; color: var(--dark); }
.g8-mode .t8-right { height: 500px; border-radius: 20px; background-size: cover; background-position: center; position: relative; }
.g8-mode .t8-braid-tag { position: absolute; bottom: 20px; left: 20px; background: var(--acc); color: #fff; padding: 8px 16px; font-size: 10px; font-weight: 800; border-radius: 20px; }
.g8-mode .t8-head { margin-bottom: 20px; text-align: center; }
.g8-mode .t8-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.g8-mode .t8-head p { font-size: 12px; color: var(--muted); }
.g8-mode .t8-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.g8-mode .t8-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.g8-mode .t8-card-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.g8-mode .t8-batch-tag { position: absolute; top: 12px; right: 12px; background: var(--dark); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 12px; }
.g8-mode .t8-card-content { padding: 18px 20px; }
.g8-mode .t8-card-content h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 4px; }
.g8-mode .t8-farm-loc { font-size: 11px; color: var(--muted); margin: 0 0 12px; }
.g8-mode .t8-spec-chips { display: flex; gap: 8px; margin-bottom: 14px; }
.g8-mode .t8-spec-chips span { background: var(--soft); font-size: 10px; padding: 4px 8px; border-radius: 6px; font-weight: 600; }
.g8-mode .t8-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.g8-mode .t8-rate { font-size: 15px; font-weight: 800; color: var(--acc); }
.g8-mode .t8-fair { font-size: 10px; color: #15803d; font-weight: 700; }
`;

const GARLIC_TEMPLATES = { list: TEMPLATES, css: CSS, render, pageCount };
if (typeof window !== 'undefined') { window.GARLIC_TEMPLATES = GARLIC_TEMPLATES; }
export default GARLIC_TEMPLATES;
export { TEMPLATES, CSS, render, pageCount };
