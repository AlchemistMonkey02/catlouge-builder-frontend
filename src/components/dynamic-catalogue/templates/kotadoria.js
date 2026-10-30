/* Kota Doria & Luxury Saree Catalogue Templates
   Includes 8 Traditional Craft Templates PLUS:
   - Parampara Wholesale Powerloom Suite (exact recreation of parampara-threads-wholesale-catalogue.pdf)
   - Silken Saga Celebration & Wedding Lookbook (exact recreation of Silken_Saga_Banarasi_Sarees.pdf)
*/

const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => (s || '').toUpperCase();
const pn = n => String(n).padStart(2, '0');
const getImgUrl = u => {
  if (!u) return '';
  if (typeof u === 'string') return u;
  return u.img || u.image || (u.images && u.images[0] && (u.images[0].url || u.images[0])) || u.angle1 || u.url || '';
};
const bg = u => {
  const url = getImgUrl(u);
  return url ? `background-image:url("${url}")` : '';
};
const fmtPrice = p => {
  if (p == null || p === '') return '₹4,200';
  const s = String(p).trim();
  if (s.startsWith('₹')) return s;
  const num = Number(s.replace(/[^0-9.]/g, ''));
  if (!isNaN(num) && num > 0) return `₹${num.toLocaleString('en-IN')}`;
  return `₹${s}`;
};

const th = (name, bg, ink, muted, acc, dark, soft, line, onDark) => ({ name, bg, ink, muted, acc, dark, soft, line, onDark });

const TEMPLATES = [
  {
    id: 'kd-parampara',
    cat: 'Kota Doria Specialty',
    name: 'Parampara Wholesale Powerloom Suite',
    desc: 'Exact Parampara Threads layout: Deep chocolate & gold cover, own powerloom story, split model & flatlay hero with complete fabric/work/drape/occasion specs',
    theme: th('Parampara Chocolate & Gold', '#fdfbf7', '#221610', '#635348', '#c5a059', '#281a14', '#f5eee2', '#e5d7c0', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Parampara Wholesale Suite',
    isParampara: true
  },
  {
    id: 'kd-silken',
    cat: 'Kota Doria Specialty',
    name: 'Silken Saga Celebration & Wedding Lookbook',
    desc: 'Exact Silken Saga layout: Glassmorphic celebration cover, heartfelt founder story, wedding collection polaroids, torn paper mosaic & WhatsApp customer testimonials',
    theme: th('Silken Celebration Blush', '#fcf7f5', '#2a0e1b', '#6b4353', '#800020', '#420815', '#faeae6', '#ecd4cc', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Silken Saga Celebration Lookbook',
    isSilken: true
  },
  {
    id: 'kd-1',
    cat: 'Kota Doria Specialty',
    name: 'Royal Gossamer Handloom Lookbook',
    desc: 'Imperial magenta & antique gold, translucent square khat weave, royal Rajasthani heritage',
    theme: th('Imperial Magenta & Antique Gold', '#fdf7f9', '#2a0e1b', '#6d3c52', '#b81d66', '#540b30', '#fae8f0', '#ecc6d8', '#fff5f8'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Authentic GI Tagged Handloom'
  },
  {
    id: 'kd-2',
    cat: 'Kota Doria Specialty',
    name: 'Pure Zari & Silk-Cotton Saree Collection',
    desc: 'Emerald green & rich gold zari borders, lustrous silk-cotton blend, festive bridal drapes',
    theme: th('Emerald Silk & Golden Thread', '#f4fbf7', '#0e2918', '#385c44', '#047857', '#064e3b', '#e0f4ea', '#bfe7d3', '#ffffff'),
    hf: "'Cormorant Garamond', serif",
    bf: "'Inter', sans-serif",
    badge: 'Pure Zari Woven'
  },
  {
    id: 'kd-3',
    cat: 'Kota Doria Specialty',
    name: 'Artisanal Khat Weave Masterpiece',
    desc: 'Raw silk ivory & midnight indigo, high-density 300+ khat grid close-up, Kaithun master weavers',
    theme: th('Raw Silk Ivory & Indigo', '#faf8f5', '#131b2e', '#45506b', '#1d4ed8', '#0f172a', '#edf0f7', '#d5dced', '#ffffff'),
    hf: "'Cinzel', serif",
    bf: "'Inter', sans-serif",
    badge: 'Signature Khat Weave'
  },
  {
    id: 'kd-4',
    cat: 'Kota Doria Specialty',
    name: 'Contemporary Pastel Festive Drapes',
    desc: 'Blush rose & champagne gold, featherweight 350g drape, block-printed florals, summer elegance',
    theme: th('Pastel Rose & Champagne', '#fdf8f9', '#2d151e', '#774758', '#db2777', '#621034', '#fce8ef', '#f7cbd9', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Lightweight Festive'
  },
  {
    id: 'kd-5',
    cat: 'Kota Doria Specialty',
    name: 'Handcrafted Dupattas & Stoles Suite',
    desc: 'Peacock teal & warm gold, artisanal hand block prints, resham tassels, versatile styling',
    theme: th('Peacock Teal & Warm Gold', '#f2fbf9', '#0d2726', '#325754', '#0d9488', '#115e59', '#daf3f0', '#b6e7e1', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Artisan Dupattas'
  },
  {
    id: 'kd-6',
    cat: 'Kota Doria Specialty',
    name: 'Natural Vegetable Dye Heritage',
    desc: 'Indigo, madder red & turmeric yellow hand-dyed yarns, eco-friendly sustainable slow fashion',
    theme: th('Natural Ochre & Madder', '#faf6f0', '#2a1a11', '#6b4d3a', '#c2410c', '#572209', '#f4e9dc', '#e5d1bc', '#ffffff'),
    hf: "'Cormorant Garamond', serif",
    bf: "'Inter', sans-serif",
    badge: 'Natural Vegetable Dyes'
  },
  {
    id: 'kd-7',
    cat: 'Kota Doria Specialty',
    name: 'Boutiques & Royal Couture Catalogue',
    desc: 'High-fashion editorial dark theme, bridal trousseau sets, custom bespoke weave commissions',
    theme: th('Royal Noir & Gilded Thread', '#131215', '#f8fafc', '#a1a1aa', '#eab308', '#0c0a0d', '#221f27', '#34303d', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Royal Couture'
  },
  {
    id: 'kd-8',
    cat: 'Kota Doria Specialty',
    name: 'Weaver Guild Origin & Global GI Export',
    desc: 'Kaithun weaver collective story, warp-weft yarn counts, GI certified export packing standards',
    theme: th('Heritage Terracotta & Cream', '#fbf8f4', '#261a14', '#665043', '#9a3412', '#452011', '#f3eae1', '#e2d3c2', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Kaithun Weaver Guild'
  }
];

// Header & Footer for Standard KD templates
const head = (c, label, no) => `
  <div class="kd-head">
    <div class="kd-head-brand">
      <span class="kd-loom-icon">🥻</span>
      <strong>${E(c.info.ent || 'KOTA DORIA HANDLOOM')}</strong>
    </div>
    <span class="kd-head-tag">${E(label)}</span>
    <span class="kd-head-num">${pn(no)}</span>
  </div>
`;

const foot = c => `
  <div class="kd-foot">
    <span>${E(c.info.ent || '')} &bull; Authentic Geographical Indication (GI) Kota Doria</span>
    <span>☎ ${E(c.info.mobile || '')} ${c.info.email ? `&bull; ${E(c.info.email)}` : ''}</span>
  </div>
`;

// ============================================================================
// PARAMPARA THREADS WHOLESALE SUITE (Exact recreation of Parampara PDF)
// ============================================================================

// ============================================================================
// PARAMPARA THREADS WHOLESALE SUITE (Elevated Luxury Manufacturer Lookbook)
// ============================================================================

function paramparaCover(c) {
  const brand = c.info.ent || 'PARAMPARA THREADS';
  const heroImg = c.hero || (c.items[0] && c.items[0].img) || '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
  const count = c.items.length || 31;

  return `
    <div class="parampara-cover-wrap">
      <div class="parampara-cover-backdrop">
        <div class="parampara-hero-window">
          <div class="parampara-hero-art" style="${bg(heroImg)}">
            <div class="parampara-gold-mesh-overlay"></div>
            <div class="parampara-hero-seal">
              <span>ESTD 2026</span>
              <strong>POWERLOOM ATELIER</strong>
            </div>
          </div>
        </div>

        <div class="parampara-cover-card">
          <div class="parampara-crest">
            <svg viewBox="0 0 60 60" class="parampara-crest-svg">
              <circle cx="30" cy="30" r="26" stroke="#c5a059" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/>
              <circle cx="30" cy="30" r="20" stroke="#c5a059" stroke-width="1" fill="none"/>
              <path d="M30 14 L30 46 M14 30 L46 30 M19 19 L41 41 M19 41 L41 19" stroke="#c5a059" stroke-width="1"/>
              <circle cx="30" cy="30" r="4" fill="#c5a059"/>
            </svg>
            <div class="parampara-crest-label">TRADITION &bull; COMMERCE</div>
          </div>

          <h1 class="parampara-logo-title">${E(brand)}</h1>
          <div class="parampara-edition-badge">WHOLESALE TRADE LOOKBOOK &bull; 2026</div>

          <div class="parampara-quote-card">
            <p>“Direct manufacturer access to high-count silk-cotton powerloom sarees. Consistent quality, master craftsmanship, and volume profit margins for business partners.”</p>
          </div>

          <div class="parampara-advantage-grid">
            <div class="parampara-adv-pill">
              <b>100% In-House</b>
              <small>Own Powerloom Unit</small>
            </div>
            <div class="parampara-adv-pill">
              <b>Direct Pricing</b>
              <small>Zero Middlemen Markup</small>
            </div>
            <div class="parampara-adv-pill">
              <b>Set Packs</b>
              <small>6-Color Assortment</small>
            </div>
            <div class="parampara-adv-pill">
              <b>${count}+ Weaves</b>
              <small>Ready For Dispatch</small>
            </div>
          </div>

          <div class="parampara-bottom-assurance">
            <span>✦ FACTORY-DIRECT DISPATCH</span>
            <span>✦ PRE-PACKED ASSORTMENT SETS</span>
            <span>✦ B2B TRADE ONLY</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function paramparaStory(c, no) {
  const brand = c.info.ent || 'Parampara Threads';
  const hero1 = (c.items[0] && (c.items[0].angle3 || c.items[0].img)) || '/assets/kota-doria/3E9A1251.jpg';
  const hero2 = (c.items[1] && (c.items[1].angle2 || c.items[1].img)) || '/assets/kota-doria/0X2A0415.jpg';

  return `
    <div class="parampara-page-body">
      <div class="parampara-sec-header">
        <span>MANUFACTURING PROVENANCE</span>
        <span>SECTION 01</span>
      </div>

      <div class="parampara-story-banner">
        <h2>“Spun in Tradition, Engineered for Commerce.”</h2>
        <p>Built for high-volume retail partners, boutiques, and nationwide wholesalers</p>
      </div>

      <div class="parampara-story-layout">
        <div class="parampara-story-text">
          <p class="parampara-lead-p">
            ${E(brand)} bridges the timeless artistry of Indian heritage weaving with the efficiency of modern precision powerlooms. Every saree in this collection is produced entirely at our own manufacturing units in Rajasthan.
          </p>

          <div class="parampara-feature-cards">
            <div class="parampara-fcard">
              <div class="fcard-icon">🏭</div>
              <div class="fcard-body">
                <strong>In-House Powerloom Operations</strong>
                <p>Complete control over yarn count, zari tension, and uniform fabric density for zero-defect production.</p>
              </div>
            </div>
            <div class="parampara-fcard">
              <div class="fcard-icon">💎</div>
              <div class="fcard-body">
                <strong>Direct Mill Pricing</strong>
                <p>Eliminate distributor and commission agent markups to ensure maximum retail profit margins.</p>
              </div>
            </div>
            <div class="parampara-fcard">
              <div class="fcard-icon">📦</div>
              <div class="fcard-body">
                <strong>6-Color Assortment Set Packs</strong>
                <p>Pre-packed sets in customer-favorite festive shades ready for immediate counter display.</p>
              </div>
            </div>
            <div class="parampara-fcard">
              <div class="fcard-icon">⚡</div>
              <div class="fcard-body">
                <strong>Rapid Bulk Fulfillment</strong>
                <p>Standardized carton packaging with reliable 48-hour dispatch for repeat orders.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="parampara-story-gallery">
          <div class="parampara-frame-loom top" style="${bg(hero1)}">
            <span class="loom-label">Powerloom Weave Facility</span>
          </div>
          <div class="parampara-frame-loom btm" style="${bg(hero2)}">
            <span class="loom-label">Goti Zari Detail Inspection</span>
          </div>
        </div>
      </div>

      <div class="parampara-pullquote">
        <em>“Tradition is our foundation. Precision engineering is our standard.”</em>
      </div>

      <div class="parampara-page-foot">
        <span>${E(brand)} &bull; DIRECT MANUFACTURER LOOKBOOK</span>
        <span>PAGE ${pn(no)}</span>
      </div>
    </div>
  `;
}

function paramparaProductPage(c, it, idx, total, pageNum) {
  const brand = c.info.ent || 'PARAMPARA THREADS';
  const modelImg = it.angle1 || it.img || (it.images && it.images[0] && it.images[0].url) || '';
  const macroImg = it.angle2 || (it.images && it.images[1] && it.images[1].url) || modelImg;
  const basePrice = it.price || 1400;

  // Wholesale Volume Discount Tiers
  const setPrice = Math.round(basePrice * 0.95);
  const cartonPrice = Math.round(basePrice * 0.88);

  const fabric = it.specifications?.['Fabric'] || it.materialComposition || 'Soft art-silk satin with high-count cotton weft';
  const work = it.specifications?.['Work'] || it.description || 'Full-body goti zari floral jaal with delicate stone embellishment';
  const drape = it.specifications?.['Drape'] || 'Lustrous, fluid handfeel; pleats effortlessly without stiffness';
  const occasion = it.specifications?.['Occasion'] || 'Bridal trousseau, festive wedding receptions, premium gifting';

  return `
    <div class="parampara-page-body">
      <div class="parampara-prod-top-bar">
        <div class="parampara-top-title">
          <span class="parampara-sub-cat">EXCLUSIVE POWERLOOM WEAVE</span>
          <h2 class="parampara-prod-h2">${E(it.name || 'Art Silk Banarasi Saree')}</h2>
        </div>
        <div class="parampara-top-code">
          <span class="design-label">DESIGN SPEC</span>
          <strong>#SAREE-${it.sku || pn(idx + 1)}</strong>
        </div>
      </div>

      <div class="parampara-spread-grid">
        <div class="parampara-left-hero">
          <div class="parampara-portrait-frame" style="${bg(modelImg)}">
            <div class="parampara-corner-flourish tl"></div>
            <div class="parampara-corner-flourish br"></div>
            <span class="parampara-view-tag">Hero Drape Presentation</span>
          </div>
        </div>

        <div class="parampara-right-details">
          <div class="parampara-macro-card" style="${bg(macroImg)}">
            <span class="macro-label">Macro Texture &bull; Zari &amp; Border Weave</span>
          </div>

          <div class="parampara-tiers-card">
            <div class="tiers-header">
              <span>WHOLESALE PRICING TIERS</span>
              <small>GST As Applicable</small>
            </div>
            <div class="tiers-grid">
              <div class="tier-box">
                <span class="tier-name">Sample Piece</span>
                <b class="tier-val">₹${basePrice}</b>
                <small>Trial Orders</small>
              </div>
              <div class="tier-box highlight">
                <div class="rec-badge">RECOMMENDED</div>
                <span class="tier-name">Set Pack (6 Pcs)</span>
                <b class="tier-val">₹${setPrice}</b>
                <small>Assorted Colors</small>
              </div>
              <div class="tier-box">
                <span class="tier-name">Carton (30+ Pcs)</span>
                <b class="tier-val">₹${cartonPrice}</b>
                <small>Volume Rate</small>
              </div>
            </div>
          </div>

          <div class="parampara-color-assortment">
            <div class="color-head">
              <span>PRE-PACKED 6-COLOR ASSORTMENT PALETTE</span>
            </div>
            <div class="color-swatches">
              <div class="c-swatch"><span style="background:#8b0000"></span><small>Crimson</small></div>
              <div class="c-swatch"><span style="background:#0f52ba"></span><small>Peacock</small></div>
              <div class="c-swatch"><span style="background:#004d40"></span><small>Emerald</small></div>
              <div class="c-swatch"><span style="background:#d4af37"></span><small>Mustard</small></div>
              <div class="c-swatch"><span style="background:#4a0e17"></span><small>Wine</small></div>
              <div class="c-swatch"><span style="background:#e07a5f"></span><small>Rose</small></div>
            </div>
          </div>
        </div>
      </div>

      <div class="parampara-tech-footer">
        <div class="tech-item">
          <b>FABRIC COMPOSITION</b>
          <p>${E(fabric)}</p>
        </div>
        <div class="tech-item">
          <b>EMBELLISHMENT &amp; WORK</b>
          <p>${E(work)}</p>
        </div>
        <div class="tech-item">
          <b>DRAPE &amp; PLEATING</b>
          <p>${E(drape)}</p>
        </div>
        <div class="tech-item">
          <b>TARGET OCCASION</b>
          <p>${E(occasion)}</p>
        </div>
      </div>

      <div class="parampara-page-foot">
        <span>${E(brand)} &bull; WOVEN AT OWN POWERLOOM</span>
        <span>PAGE ${pn(pageNum)} OF ${pn(total + 3)}</span>
      </div>
    </div>
  `;
}

function paramparaWholesaleEnquiry(c, pageNum) {
  const brand = c.info.ent || 'PARAMPARA THREADS';
  const mobile = c.info.mobile || '+91 99115 03020';
  const email = c.info.email || 'paramparathreads.wholesale@gmail.com';
  const gst = c.info.gst || '07TXRPS8791D1Z4';
  const udyam = c.info.udyam || 'UDYAM-DL-09-0050772';
  const qrs = c.qrs || [];

  return `
    <div class="parampara-cover-wrap">
      <div class="parampara-trade-desk-card">
        <div class="trade-desk-header">
          <div class="trade-crest">⚖️</div>
          <h2>B2B Trade Agreement &amp; Procurement Desk</h2>
          <p>Partnering with verified retailers, boutique owners, and regional distributors nationwide</p>
        </div>

        <div class="trade-credential-grid">
          <div class="trade-cred-box">
            <span class="cred-tag">REGISTERED ENTITY</span>
            <strong>${E(brand)}</strong>
            <p>Direct Powerloom Saree Manufacturer</p>
          </div>
          <div class="trade-cred-box">
            <span class="cred-tag">TAX &amp; MSME REGISTRATION</span>
            <strong>GSTIN: ${E(gst)}</strong>
            <p>UDYAM: ${E(udyam)}</p>
          </div>
          <div class="trade-cred-box">
            <span class="cred-tag">DIRECT PROCUREMENT HOTLINE</span>
            <strong>WhatsApp / Call: ${E(mobile)}</strong>
            <p>Email: ${E(email)}</p>
          </div>
          <div class="trade-cred-box">
            <span class="cred-tag">DISPATCH LOGISTICS</span>
            <strong>48-Hour Factory Gate Dispatch</strong>
            <p>Pan-India Transport &bull; Sea Container FOB</p>
          </div>
        </div>

        <div class="trade-steps-bar">
          <div class="trade-step">
            <b>1. Select Designs</b>
            <small>Quote design numbers</small>
          </div>
          <div class="trade-arrow">→</div>
          <div class="trade-step">
            <b>2. Stock Confirm</b>
            <small>Live inventory WhatsApp</small>
          </div>
          <div class="trade-arrow">→</div>
          <div class="trade-step">
            <b>3. Invoice &amp; Pack</b>
            <small>Pre-sorted 6-color boxes</small>
          </div>
          <div class="trade-arrow">→</div>
          <div class="trade-step">
            <b>4. Fast Dispatch</b>
            <small>Tracking shared on dispatch</small>
          </div>
        </div>

        <div class="trade-qr-section">
          <div class="trade-qr-content">
            <h3>Instant Digital B2B Desk &amp; Live Catalogues</h3>
            <p>Point your smartphone camera to connect directly with our wholesale trade directors for instant proforma invoices and sample requests.</p>
          </div>
          <div class="trade-qr-holder">
            ${qrs[0] ? `
              <img src="${qrs[0].img}" class="trade-qr-img" alt="QR" />
              <b>Scan for WhatsApp</b>
            ` : `
              <div class="trade-qr-box">🥻</div>
              <b>Direct WhatsApp Desk</b>
            `}
          </div>
        </div>

        <div class="trade-closing-tag">
          <span>${E(brand)} &bull; THIS CATALOGUE IS RESERVED STRICTLY FOR WHOLESALE TRADE &bull; ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </div>
  `;
}

function renderParamparaSuite(t, c) {
  const style = `
    --bg:#fdfbf7;
    --ink:#221610;
    --muted:#635348;
    --acc:#c5a059;
    --dark:#240c14;
    --soft:#f7f0e4;
    --line:#e5d5be;
    --onDark:#ffffff;
    --hf:'Playfair Display', serif;
    --bf:'Inter', sans-serif;
    background-color:#fdfbf7;
    font-family:'Inter', sans-serif;
  `;

  const wrap = (h, dark = false) => `
    <div class="pg kotadoria-pg parampara-pg ${dark ? 'parampara-dark-theme' : ''}" style="${style}">${h}</div>
  `;

  const P = [wrap(paramparaCover(c), true)];
  let pageNum = 2;
  P.push(wrap(paramparaStory(c, pageNum++)));

  c.items.forEach((it, idx) => {
    P.push(wrap(paramparaProductPage(c, it, idx, c.items.length, pageNum++)));
  });

  P.push(wrap(paramparaWholesaleEnquiry(c, pageNum), true));
  return P;
}

// ============================================================================
// SILKEN SAGA CELEBRATION & WEDDING LOOKBOOK (Vogue Haute Couture Monograph)
// ============================================================================

function silkenCover(c) {
  const brand = c.info.ent || 'Silken Saga';
  const heroImg = c.hero || (c.items[0] && c.items[0].img) || '/assets/kota-doria/3E9A3098_b15c9d83-4fac-46af-b126-7bb8ad88357d.jpg';

  return `
    <div class="silken-cover-wrap" style="${bg(heroImg)}">
      <div class="silken-cover-gradient"></div>
      <div class="silken-top-brand-band">
        <span class="silken-band-tag">HERITAGE WEDDING &bull; VOL. 2026</span>
        <span class="silken-band-loc">BANARASI &amp; KOTA DORIA ATELIER</span>
      </div>

      <div class="silken-glass-monograph-card">
        <div class="silken-crest-motif">
          <span class="motif-leaf">❧</span>
          <span class="motif-center">❀</span>
          <span class="motif-leaf">☙</span>
        </div>

        <h1 class="silken-title">${E(brand)}</h1>
        <div class="silken-edition-sub">The Fabric of Celebration &bull; Wedding Lookbook</div>

        <div class="silken-card-divider"></div>

        <p class="silken-cover-poetry">
          Woven for unforgettable moments, sacred vows, and the quiet grace of a woman in her element.
        </p>

        <div class="silken-trousseau-chips">
          <span>✦ PURE HANDLOOM SILK</span>
          <span>✦ FEATHERLIGHT DRAPE</span>
          <span>✦ BRIDAL ARCHIVE</span>
        </div>
      </div>

      <div class="silken-cover-bottom-bar">
        <span>Curated Saree Collection &bull; Available for Worldwide Concierge Delivery</span>
      </div>
    </div>
  `;
}

function silkenStory(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';
  const modelImg = (c.items[0] && (c.items[0].angle1 || c.items[0].img)) || '/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg';

  return `
    <div class="silken-page-body silken-story-page">
      <div class="silken-story-left-col">
        <div class="silken-arched-portrait" style="${bg(modelImg)}">
          <div class="silken-portrait-tag">Bridal Trousseau &bull; Kaithun Weave</div>
        </div>
      </div>

      <div class="silken-story-right-col">
        <div class="silken-chap-header">
          <span>CHAPTER 01</span>
          <div class="chap-line"></div>
        </div>

        <h2 class="silken-serif-h1">The Heart Behind<br>Every Weave</h2>
        <div class="silken-hearts-deco">❦ ❀ ❦</div>

        <div class="silken-story-body">
          <p class="dropcap-p">
            <span class="dropcap">W</span>e have always believed that a saree is more than six yards of spun yarn — it is a canvas of emotion, heirloom heritage, and festive celebrations passed down from grandmother to bride.
          </p>
          <p class="story-emp">
            ${E(brand)} was founded to make true luxury accessible to every woman, ensuring she feels radiant, cherished, and effortless on the most memorable days of her life.
          </p>
          <p class="story-muted">
            From the handlooms of Varanasi and Kota to your personal trousseau trunk, every saree is finished by hand with love, pure tested zari, and meticulous attention to drape.
          </p>
        </div>

        <div class="silken-founder-sign">
          <div class="sign-label">With warmth &amp; devotion,</div>
          <div class="sign-name">${E(c.info.person || 'The Atelier Collective')}</div>
          <small>Founder &amp; Creative Curator</small>
        </div>
      </div>
    </div>
  `;
}

function silkenWeddingCollection(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';
  const it0 = (c.items[0] && c.items[0].img) || '';
  const it1 = (c.items[1] && c.items[1].img) || it0;
  const it2 = (c.items[2] && c.items[2].img) || it0;

  return `
    <div class="silken-page-body silken-collection-page">
      <div class="silken-coll-left">
        <div class="silken-coll-badge">HAUTE BRIDAL EDITION</div>
        <h2 class="silken-coll-h1">Celebration &amp;<br>Wedding Saree Suite</h2>
        <div class="silken-gold-rule"></div>

        <p class="silken-coll-quote">
          “Whether it is a sacred pooja at home, a joyous sangeet night, or the wedding vows of a lifetime… your saree wraps you in weightless grace and quiet celebration.”
        </p>

        <div class="silken-coll-highlights">
          <div class="coll-point">
            <b>Featherlight Breathability</b>
            <p>Designed to be worn comfortably through long wedding rituals without fatigue.</p>
          </div>
          <div class="coll-point">
            <b>Tested Zari Radiance</b>
            <p>Subtle antique gold shimmer that gleams gracefully under wedding chandeliers.</p>
          </div>
        </div>
      </div>

      <div class="silken-coll-right-grid">
        <div class="silken-polaroid-frame p1">
          <div class="polaroid-img" style="${bg(it0)}"></div>
          <span class="polaroid-cap">The Morning Pooja Drape</span>
        </div>
        <div class="silken-polaroid-frame p2">
          <div class="polaroid-img" style="${bg(it1)}"></div>
          <span class="polaroid-cap">Reception Silk Majesty</span>
        </div>
        <div class="silken-polaroid-frame p3">
          <div class="polaroid-img" style="${bg(it2)}"></div>
          <span class="polaroid-cap">Intricate Pallu Zari</span>
        </div>
      </div>
    </div>
  `;
}

function silkenServices(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';
  const circleImg = (c.items[1] && c.items[1].img) || (c.items[0] && c.items[0].img) || '';
  const mobile = c.info.mobile || '+91 76193 72385';
  const website = c.info.website || 'www.silkensaga.com';

  return `
    <div class="silken-page-body silken-services-page">
      <div class="silken-serv-header">
        <span class="serv-tag">BESPOKE CONCIERGE EXPERIENCE</span>
        <h2>Explore What ${E(brand)} Can Do For You</h2>
        <p>Private VIP consultations designed around your personal style and wedding schedule</p>
      </div>

      <div class="silken-serv-layout">
        <div class="silken-serv-grid">
          <div class="serv-card">
            <div class="serv-icon">🏡</div>
            <div class="serv-text">
              <strong>Private Home Draping Service</strong>
              <p>Curated trunk selections brought directly to your home for family bridal trials.</p>
            </div>
          </div>
          <div class="serv-card">
            <div class="serv-icon">🎁</div>
            <div class="serv-text">
              <strong>Custom Velvet Gifting Trunks</strong>
              <p>Handcrafted trousseau packaging, brass embossed tags, and personal handwritten message cards.</p>
            </div>
          </div>
          <div class="serv-card">
            <div class="serv-icon">📹</div>
            <div class="serv-text">
              <strong>1-on-1 4K Video Consultations</strong>
              <p>Live drape demos over WhatsApp video with our senior stylists to inspect real texture.</p>
            </div>
          </div>
          <div class="serv-card">
            <div class="serv-icon">✈️</div>
            <div class="serv-text">
              <strong>Insured Worldwide Express Courier</strong>
              <p>Doorstep delivery to USA, UK, Canada, UAE, Singapore &amp; Australia with tracking.</p>
            </div>
          </div>
        </div>

        <div class="silken-serv-visual">
          <div class="silken-circle-frame">
            <div class="silken-circle-photo" style="${bg(circleImg)}"></div>
            <div class="silken-seal-gold">VIP CONCIERGE</div>
          </div>
        </div>
      </div>

      <div class="silken-bottom-maroon-bar">
        <span>📸 Instagram: @${(brand || 'silken_saga').toLowerCase().replace(/[^a-z0-9]/g, '_')}</span>
        <span>🌐 Website: ${E(website)}</span>
        <span>💬 Direct Concierge: ${E(mobile)}</span>
      </div>
    </div>
  `;
}

function silkenTornProducts(c, pageNum) {
  const it = c.items;

  return `
    <div class="silken-page-body silken-mosaic-page">
      <div class="silken-mosaic-header">
        <span class="mosaic-tag">EDITORIAL MOODBOARD</span>
        <h2>Most Loved Celebration Classics</h2>
        <p>A curated retrospective of our most coveted bridal and festive creations</p>
      </div>

      <div class="silken-mosaic-grid">
        ${[0, 1, 2, 3, 4, 5].map(idx => {
          const item = it[idx] || it[0] || {};
          return `
            <div class="mosaic-card">
              <div class="mosaic-photo" style="${bg(item.img)}">
                <span class="mosaic-badge">CLASSIC #${pn(idx + 1)}</span>
              </div>
              <div class="mosaic-meta">
                <h4>${E(item.name || 'Kota Doria Saree')}</h4>
                <div class="mosaic-price">${item.price ? `₹${item.price}` : 'Inquire Boutique'}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="silken-mosaic-footer-quote">
        “Every saree is woven to make an ordinary day feel extraordinary, and a festive day feel eternal.”
      </div>
    </div>
  `;
}

function silkenWhyBuyers(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';

  return `
    <div class="silken-page-body silken-why-buyers-page">
      <div class="silken-why-left">
        <span class="why-tag">THE SILKEN SAGA PROMISE</span>
        <h2 class="silken-why-h1">Why Discerning Brides Choose Us</h2>
        <div class="why-divider"></div>

        <div class="why-editorial-text">
          <p class="why-highlight">We listen. We guide. We tailor every recommendation to the woman wearing it.</p>
          <p>
            Finding a wedding saree is not an ordinary purchase — it is an emotional milestone. At ${E(brand)}, you are never handed a generic recommendation. We take the time to understand your jewelry, your venue lighting, and how you wish to move and celebrate.
          </p>
        </div>

        <div class="why-three-pillars">
          <div class="pillar-box">
            <b>01. Genuine Craft</b>
            <p>100% authentic woven zari on artisan looms.</p>
          </div>
          <div class="pillar-box">
            <b>02. Color Fidelity</b>
            <p>Exact shade matching under natural daylight.</p>
          </div>
          <div class="pillar-box">
            <b>03. Effortless Return</b>
            <p>Total peace of mind with our client guarantee.</p>
          </div>
        </div>
      </div>

      <div class="silken-why-right-quote-card">
        <div class="quote-card-inner">
          <div class="quote-stars">★★★★★</div>
          <div class="quote-mark">“</div>
          <p class="quote-text">
            I ordered three sarees for my sister's wedding across video call from the US. When the parcel arrived, the fabric was even more magnificent in person — so soft, so grand, and lightweight beyond belief!
          </p>
          <div class="quote-author">
            <strong>Ananya Deshmukh</strong>
            <small>San Francisco &bull; Verified Client</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function silkenFeedbackScrapbook(c, pageNum) {
  const it0 = (c.items[0] && c.items[0].img) || '';
  const it1 = (c.items[1] && c.items[1].img) || it0;

  return `
    <div class="silken-page-body silken-scrapbook-page">
      <div class="silken-scrapbook-title-box">
        <span class="scrap-tag">WHISPERS OF CELEBRATION</span>
        <h2 class="silken-scrap-h1">Loved by Women Across the Globe</h2>
        <p class="scrap-subscript">Real stories, cherished celebrations, and wedding memories</p>
      </div>

      <div class="silken-reviews-grid">
        <div class="silken-review-card">
          <div class="stars">★★★★★</div>
          <p>“The color did not bleed after gentle care, and the gold zari still looks fresh and regal like day one.”</p>
          <strong>Divya Verma</strong>
          <small>Delhi &bull; Festive Order</small>
        </div>
        <div class="silken-review-card">
          <div class="stars">★★★★★</div>
          <p>“Feels light to wear for 8+ hours during rituals but still gives a royal silhouette in photography.”</p>
          <strong>Divya Reddy</strong>
          <small>Hyderabad &bull; Wedding Guest</small>
        </div>
        <div class="silken-review-card">
          <div class="stars">★★★★★</div>
          <p>“The fall and drape are incredibly graceful. The pleats stay crisp without slipping or needing dozens of pins.”</p>
          <strong>Divya Khosla</strong>
          <small>Bangalore &bull; Bridal Trousseau</small>
        </div>
      </div>

      <div class="silken-polaroid-row">
        <div class="scrap-polaroid">
          <div class="polaroid-crop" style="${bg(it0)}"></div>
          <div class="polaroid-text">Family Wedding Sangeet ❤️</div>
        </div>
        <div class="scrap-polaroid">
          <div class="polaroid-crop" style="${bg(it1)}"></div>
          <div class="polaroid-text">Mom's Golden Anniversary ✨</div>
        </div>
      </div>
    </div>
  `;
}

function silkenPackaging(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';
  const pkg1 = (c.items[0] && (c.items[0].angle2 || c.items[0].img)) || '';
  const pkg2 = (c.items[1] && (c.items[1].angle2 || c.items[1].img)) || pkg1;
  const pkg3 = (c.items[2] && (c.items[2].angle2 || c.items[2].img)) || pkg1;

  return `
    <div class="silken-page-body silken-packaging-page">
      <div class="silken-pkg-header">
        <span class="pkg-tag">THE ART OF UNBOXING</span>
        <h2>Presented as Royalty, Wrapped with Love</h2>
        <p>Every saree arrives in rigid velvet magnetic boxes designed to preserve delicate handlooms for generations</p>
      </div>

      <div class="silken-pkg-gallery">
        <div class="pkg-tile" style="${bg(pkg1)}">
          <span class="tile-caption">Magnetic Rigid Box</span>
        </div>
        <div class="pkg-tile" style="${bg(pkg2)}">
          <span class="tile-caption">Brass Wax Seal</span>
        </div>
        <div class="pkg-tile" style="${bg(pkg3)}">
          <span class="tile-caption">Handwritten Calligraphy Card</span>
        </div>
      </div>

      <div class="silken-pkg-footer">
        <div class="silken-pkg-card">
          <div class="pkg-lotus">🪷</div>
          <div class="pkg-brand">${E(brand)}</div>
          <p class="pkg-quote">“May this saree wrap you in beauty, softness, and every little joy you deserve.”</p>
          <div class="pkg-love">With everlasting love &bull; The Atelier</div>
        </div>
      </div>
    </div>
  `;
}

function silkenClosing(c, pageNum) {
  const brand = c.info.ent || 'Silken Saga';
  const heroImg = c.hero || (c.items[0] && c.items[0].img) || '';
  const mobile = c.info.mobile || '+91 76193 72385';
  const website = c.info.website || 'www.silkensaga.com';

  return `
    <div class="silken-page-body silken-closing-page" style="${bg(heroImg)}">
      <div class="silken-closing-overlay"></div>
      <div class="silken-closing-glass-box">
        <div class="closing-crest">❧ ❀ ❧</div>
        <h2 class="silken-closing-h2">Come, find your story in our collection.</h2>
        <p class="silken-closing-p">
          Take your time, browse, ask questions — we are here for you.<br><br>
          And when you finally drape your saree, we hope you feel what every ${E(brand)} woman feels:<br><br>
          <span class="grace-span">grace, confidence, and quiet joy.</span>
        </p>

        <div class="silken-closing-btn">
          <span>Schedule a Personal Consultation</span>
        </div>
      </div>

      <div class="silken-bottom-maroon-bar">
        <span>📸 Instagram: @${(brand || 'silken_saga').toLowerCase().replace(/[^a-z0-9]/g, '_')}</span>
        <span>🌐 Website: ${E(website)}</span>
        <span>💬 Direct Concierge: ${E(mobile)}</span>
      </div>
    </div>
  `;
}

function renderSilkenSagaSuite(t, c) {
  const style = `
    --bg:#fcf7f5;
    --ink:#2a0e1b;
    --muted:#6b4353;
    --acc:#800020;
    --dark:#420815;
    --soft:#faeae6;
    --line:#ecd4cc;
    --onDark:#ffffff;
    --hf:'Playfair Display', serif;
    --bf:'Inter', sans-serif;
    background-color:#fcf7f5;
    font-family:'Inter', sans-serif;
  `;

  const wrap = h => `<div class="pg kotadoria-pg silken-pg" style="${style}">${h}</div>`;
  const P = [wrap(silkenCover(c))];
  let pageNum = 2;

  P.push(wrap(silkenStory(c, pageNum++)));
  P.push(wrap(silkenWeddingCollection(c, pageNum++)));
  P.push(wrap(silkenServices(c, pageNum++)));
  P.push(wrap(silkenTornProducts(c, pageNum++)));
  P.push(wrap(silkenWhyBuyers(c, pageNum++)));
  P.push(wrap(silkenFeedbackScrapbook(c, pageNum++)));
  P.push(wrap(silkenPackaging(c, pageNum++)));
  P.push(wrap(silkenClosing(c, pageNum++)));

  return P;
}

// ============================================================================
// DEDICATED KOTA DORIA TEMPLATE SUITES (kd-1 through kd-8)
// Each template features 100% unique base designs, DOM structures, and layouts
// ============================================================================

const wrapKd = (h, t, extraCls = '') => {
  const th = t.theme;
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
  return `<div class="pg kotadoria-pg ${t.id}-mode ${extraCls}" style="${style}">${h}</div>`;
};

// ----------------------------------------------------------------------------
// 1. TEMPLATE kd-1: ROYAL RAJPUTANA MEDALLION & COURT FRAME
// ----------------------------------------------------------------------------
function kd1_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd1-cover-container">
      <div class="kd1-court-border">
        <div class="kd1-cov-header">
          <div class="kd1-regal-insignia">👑 ROYAL RAJPUTANA HANDLOOM HERITAGE</div>
          <div class="kd1-gi-stamp">GI APPLICATION NO. 84 &bull; KAITHUN CLUSTER</div>
        </div>
        <div class="kd1-arch-medallion">
          <div class="kd1-arch-window" style="${bg(hero)}">
            <div class="kd1-gold-mesh"></div>
            <div class="kd1-seal-floating">TESTED ZARI PALLU</div>
          </div>
        </div>
        <div class="kd1-cov-details">
          <h1 class="kd1-royal-title">${E(i.ent || 'RAJPUTANA KOTA DORIA')}</h1>
          <div class="kd1-royal-tagline">${E(c.textOverrides?.tagline || i.tagline || 'Gossamer Mulberry Silk-Cotton Handwoven Masterpieces')}</div>
          <div class="kd1-court-decree">
            ${E(i.desc || 'Woven under royal court patronage since the 17th century by master pit-loom artisans of Kaithun. Featuring intricate real gold electroplated electro-tested zari borders and signatures square khat aeration.')}
          </div>
          <div class="kd1-heraldic-pillars">
            <div class="kd1-pillar"><span>300+</span><small>Square Khats</small></div>
            <div class="kd1-pillar"><span>Real Gold</span><small>Tested Zari</small></div>
            <div class="kd1-pillar"><span>Mulberry</span><small>Pure Silk Warp</small></div>
            <div class="kd1-pillar"><span>320g</span><small>Featherlight</small></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function kd1_story(c, no) {
  const hero = (c.items[1] && c.items[1].img) || c.hero || '';
  return `
    ${head(c, 'IMPERIAL PATRONAGE & LOOM HISTORY', no)}
    <div class="kd1-story-wrap">
      <div class="kd1-story-col-text">
        <span class="kd1-story-kicker">COURT ARCHIVES OF MAHARASHTRA &amp; KOTA</span>
        <h2>The Imperial Pit-Looms of Kaithun</h2>
        <p class="kd1-story-lead">In the mid-17th century, Prince Rao Kishore Singh brought expert weavers from Mysore to Kota, establishing a unique cross-pollination of royal handcraft that birthed the world-renowned Kota Doria weave.</p>
        <div class="kd1-charter-box">
          <h4>The Royal Khat Geometry</h4>
          <p>Each authentic Kota Doria saree is distinguished by its micro-square grid (Khat). A single khat is an exact interlacing of 14 combed cotton yarns with 8 fine mulberry silk filaments, yielding sheer gossamer lightness paired with tensile grandeur.</p>
        </div>
        <div class="kd1-audit-badges">
          <div>✦ Pure Onion-Juice Loom Starch</div>
          <div>✦ Throw-Shuttle Pit Weaving</div>
          <div>✦ Non-Tarnishing Tested Zari</div>
          <div>✦ Certified Geographical Indication</div>
        </div>
      </div>
      <div class="kd1-story-col-art">
        <div class="kd1-palace-arch-frame" style="${bg(hero)}">
          <div class="kd1-arch-caption">Pit-Loom Artisan Workshop &bull; Kaithun Village</div>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd1_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `ROYAL ZARI COLLECTION &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd1-head">
      <h2>Imperial Tested Zari Saree Ensembles</h2>
      <p>Interwoven real gold electroplated zari borders on sheer gossamer mulberry silk-cotton</p>
    </div>
    <div class="kd1-grid">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
        const cardPrice = fmtPrice(it.price || 4200);
        return `
        <div class="kd1-card">
          <div class="kd1-img" style="${bg(cardImg)}">
            <span class="kd1-tag">ROYAL ZARI PALLU</span>
          </div>
          <div class="kd1-details">
            <div class="kd1-sku-chip">${E(it.sku || it.code || `#KD1-${pn(idx + 1)}`)}</div>
            <h3>${E(it.name || it.title || 'Royal Zari Saree')}</h3>
            <p class="kd1-desc">${E(it.shortDescription || it.description || 'Intricate zari pallu with micro square khat weave on pit-loom.')}</p>
            <div class="kd1-pills">
              <span>✦ 320g Weight &bull; Featherlight</span>
              <span>✦ Real Tested Electro-Zari</span>
              <span>✦ 6.3m Complete with Blouse Piece</span>
            </div>
            <div class="kd1-foot">
              <span class="kd1-price">${E(cardPrice)}</span>
              <span class="kd1-craft">Royal Kaithun Atelier</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd1_tech(c, no) {
  return `
    ${head(c, 'ROYAL WEAVE TECHNICAL SPECIFICATIONS', no)}
    <div class="kd1-tech-wrap">
      <div class="kd1-tech-hero">
        <h3>Certified Pit-Loom Textile Architecture</h3>
        <p>Stringent handloom benchmark specifications conforming to the Geographical Indication (GI) Act of India.</p>
      </div>
      <div class="kd1-matrix-grid">
        <div class="kd1-matrix-card">
          <h4>Warp Configuration</h4>
          <div class="kd1-spec-line"><span>Fiber:</span><b>100% Pure Mulberry Silk</b></div>
          <div class="kd1-spec-line"><span>Count:</span><b>20/22 Denier (Unprocessed)</b></div>
          <div class="kd1-spec-line"><span>Function:</span><b>High Tensile Rigidity &amp; Sheen</b></div>
        </div>
        <div class="kd1-matrix-card">
          <h4>Weft Configuration</h4>
          <div class="kd1-spec-line"><span>Fiber:</span><b>Combed Giza Egyptian Cotton</b></div>
          <div class="kd1-spec-line"><span>Count:</span><b>100s to 120s Superfine</b></div>
          <div class="kd1-spec-line"><span>Function:</span><b>Soft Breathability &amp; Aeration</b></div>
        </div>
        <div class="kd1-matrix-card">
          <h4>Zari Metallics</h4>
          <div class="kd1-spec-line"><span>Alloy:</span><b>Silver Base Electro-Gilded</b></div>
          <div class="kd1-spec-line"><span>Purity:</span><b>Tested Non-Tarnishing Micro-Wire</b></div>
          <div class="kd1-spec-line"><span>Motifs:</span><b>Kairi, Paisley &amp; Royal Crests</b></div>
        </div>
        <div class="kd1-matrix-card">
          <h4>Physical Parameters</h4>
          <div class="kd1-spec-line"><span>Net Saree Weight:</span><b>310g &ndash; 360g</b></div>
          <div class="kd1-spec-line"><span>Khat Check Dimension:</span><b>1.2mm x 1.2mm Micro-Squares</b></div>
          <div class="kd1-spec-line"><span>Length &amp; Breadth:</span><b>6.30m x 1.15m</b></div>
        </div>
      </div>
      <div class="kd1-seal-banner">
        <span class="kd1-seal-icon">🏛️</span>
        <div>
          <strong>Government of India GI Certified Handloom</strong>
          <small>Registered under Geographical Indications of Goods Act 1999 (Registration No. 84, Kaithun Cluster).</small>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd1_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd1-closing-wrap">
      <div class="kd1-closing-frame">
        <div class="kd1-closing-crown">👑</div>
        <h2 class="kd1-closing-title">Imperial Atelier &amp; Direct Loom Orders</h2>
        <div class="kd1-closing-divider"></div>
        <p class="kd1-closing-sub">Supplying royalty, luxury bridal houses, and high-end boutique showrooms across India and globally.</p>
        <div class="kd1-closing-details">
          <div class="kd1-contact-entry">
            <span class="kd1-entry-lbl">Atelier Address</span>
            <b>${E(i.addr || 'Kaithun Loom Hub, Kota District, Rajasthan 325001')}</b>
          </div>
          <div class="kd1-contact-entry">
            <span class="kd1-entry-lbl">Direct Loom Representative</span>
            <b>${E(i.contact || i.ent || 'Master Weaver Council')}</b>
          </div>
          <div class="kd1-contact-entry">
            <span class="kd1-entry-lbl">Telephone &amp; WhatsApp Concierge</span>
            <b>${E(i.mobile || '+91 98290 XXXXX')}</b>
          </div>
          <div class="kd1-contact-entry">
            <span class="kd1-entry-lbl">Institutional Trade Email</span>
            <b>${E(i.email || 'concierge@kotadoria-royal.in')}</b>
          </div>
        </div>
        <div class="kd1-closing-guarantee">
          <span>✦ 100% Hand-Woven Authenticity</span>
          <span>✦ Insured Wooden Gift Packaging</span>
          <span>✦ Worldwide Express Courier</span>
        </div>
      </div>
    </div>
  `;
}

function renderKd1Suite(t, c) {
  const P = [wrapKd(kd1_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd1_story(c, no++), t));
  const perPage = 4;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd1_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd1_tech(c, no++), t));
  P.push(wrapKd(kd1_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 2. TEMPLATE kd-2: ARTISANAL WOODBLOCK STAMP & DECKLE-EDGE CARDS
// ----------------------------------------------------------------------------
function kd2_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd2-cov-wrap">
      <div class="kd2-parchment-border">
        <div class="kd2-cov-header">
          <div class="kd2-seal-circle">HAND CRAFTED</div>
          <span class="kd2-header-text">SHEESHAM WOODBLOCK PRINTS ON GOSSAMER KHAT</span>
        </div>
        <div class="kd2-stamp-hero-grid">
          <div class="kd2-hero-img-box" style="${bg(hero)}">
            <div class="kd2-stamp-badge-diag">NATURAL DYES</div>
          </div>
          <div class="kd2-cov-body">
            <span class="kd2-artisanal-label">BOTANICAL HERITAGE SERIES</span>
            <h1 class="kd2-cov-title">${E(i.ent || 'Artisanal Hand-Block Kota')}</h1>
            <p class="kd2-cov-desc">${E(i.desc || 'Hand-carved wooden blocks stamped using organic madder root, natural indigo, and harda yellow onto lightweight Kaithun doria weaves.')}</p>
            <div class="kd2-swatch-ribbon">
              <span class="kd2-swatch-pip" style="background:#8b263e">Madder</span>
              <span class="kd2-swatch-pip" style="background:#1b3b6f">Indigo</span>
              <span class="kd2-swatch-pip" style="background:#c69214">Harda</span>
              <span class="kd2-swatch-pip" style="background:#2d4a22">Kashish</span>
            </div>
          </div>
        </div>
        <div class="kd2-cov-foot">
          <span>🌿 Zero Synthetic Chemicals</span>
          <span>🪵 Sheesham Block Carving</span>
          <span>💧 Chambal River Washing</span>
        </div>
      </div>
    </div>
  `;
}

function kd2_story(c, no) {
  const hero = (c.items[1] && c.items[1].img) || c.hero || '';
  return `
    ${head(c, 'WOODBLOCK CARVING & NATURAL DYE CRAFT', no)}
    <div class="kd2-story-wrap">
      <div class="kd2-story-header">
        <span class="kd2-tag">CENTURY-OLD LIVING ART</span>
        <h2>Carved in Sheesham, Stamped by Hand</h2>
        <p>Every impression on Kota Doria requires rhythmic precision. Unlike solid cotton, the gossamer khat weave absorbs dye rapidly, demanding an artisan with decades of muscle memory.</p>
      </div>
      <div class="kd2-steps-grid">
        <div class="kd2-step-card">
          <div class="kd2-step-num">01</div>
          <h4>Block Chiseling</h4>
          <p>Master carpenters hand-carve seasoned Sheesham and Teakwood blocks with deep air-relief channels.</p>
        </div>
        <div class="kd2-step-card">
          <div class="kd2-step-num">02</div>
          <h4>Botanical Boiling</h4>
          <p>Roots, bark, and pomegranate rind are slow-boiled in copper cauldrons to extract rich, lightfast pigments.</p>
        </div>
        <div class="kd2-step-card">
          <div class="kd2-step-num">03</div>
          <h4>Point-Matching Stamp</h4>
          <p>Artisans strike the wooden block with a clenched fist, perfectly registering 1,200 impressions per saree.</p>
        </div>
      </div>
      <div class="kd2-artisan-quote">
        <div class="kd2-quote-art" style="${bg(hero)}"></div>
        <div class="kd2-quote-text">
          <p>&ldquo;When the wooden block touches the gossamer khat, the fabric sings. No two sarees carry the exact same impression &mdash; that irregularity is the soul of human handloom.&rdquo;</p>
          <small>&mdash; Ustad Ramzan Ali, 4th Generation Master Printer</small>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd2_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `HAND-BLOCK PRINT COLLECTION &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd2-head">
      <h2>Artisanal Woodblock Botanical Prints</h2>
      <p>Hand-stamped natural vegetable dye motifs on featherweight Kota Doria</p>
    </div>
    <div class="kd2-grid">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg';
        const cardPrice = fmtPrice(it.price || 2850);
        return `
        <div class="kd2-card">
          <div class="kd2-img" style="${bg(cardImg)}">
            <span class="kd2-stamp-badge">WOODBLOCK PRINT</span>
          </div>
          <div class="kd2-body">
            <div class="kd2-code">${E(it.sku || it.code || `#KD2-${pn(idx + 1)}`)}</div>
            <h3>${E(it.name || it.title || 'Block Printed Saree')}</h3>
            <div class="kd2-color-chip">Natural Indigo &amp; Madder Dye</div>
            <div class="kd2-foot">
              <span class="kd2-price">${E(cardPrice)}</span>
              <span class="kd2-tag">Deckle Craft</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd2_tech(c, no) {
  return `
    ${head(c, 'BOTANICAL FORMULATION & DYE INTEGRITY', no)}
    <div class="kd2-tech-container">
      <div class="kd2-tech-lead">
        <h3>100% Plant-Derived Colorfastness Architecture</h3>
        <p>Laboratory tested natural dye formulations yielding skin-neutral pH and sun-safe chromatic retention.</p>
      </div>
      <div class="kd2-tech-cards">
        <div class="kd2-tech-card">
          <span class="kd2-tech-icon">🧪</span>
          <h4>Dye Recipe Standard</h4>
          <p>Extract of Manjistha root for reds, fermented Indigofera tinctoria for blues, and iron rust (Kashish) for deep blacks.</p>
        </div>
        <div class="kd2-tech-card">
          <span class="kd2-tech-icon">☀️</span>
          <h4>Sun &amp; Wash Fastness</h4>
          <p>Grade 4.5+ colorfastness rating under standard ISO 105-C06 wash test with zero bleeding onto contrast blouse fabrics.</p>
        </div>
        <div class="kd2-tech-card">
          <span class="kd2-tech-icon">🍃</span>
          <h4>Zero Carcinogen Certification</h4>
          <p>100% AZO-free and chemical-free. Hypoallergenic profile tested safe for humid climate all-day wedding wear.</p>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd2_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd2-closing-wrap">
      <div class="kd2-ledger-box">
        <div class="kd2-ledger-stamp">ARTISAN REGISTERED</div>
        <h2>Artisan Studio Direct Orders</h2>
        <p>Support rural master printers and weaver collectives directly with transparent fair-trade wholesale rates.</p>
        <div class="kd2-ledger-fields">
          <div><span>Workshop Address:</span> <b>${E(i.addr || 'Kaithun Printing Guild, Kota, Rajasthan')}</b></div>
          <div><span>Contact Weaver:</span> <b>${E(i.contact || i.ent || 'Artisan Direct Desk')}</b></div>
          <div><span>Phone / WhatsApp:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Catalogue Orders:</span> <b>${E(i.email || 'orders@artisan-kotadoria.in')}</b></div>
        </div>
        <div class="kd2-ledger-footer">
          <span>🌿 Handcrafted with love in Kaithun &bull; Shipped in recycled unbleached cotton pouches</span>
        </div>
      </div>
    </div>
  `;
}

function renderKd2Suite(t, c) {
  const P = [wrapKd(kd2_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd2_story(c, no++), t));
  const perPage = 6;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd2_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd2_tech(c, no++), t));
  P.push(wrapKd(kd2_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 3. TEMPLATE kd-3: CONTEMPORARY RUNWAY VOGUE MINIMALIST FULL-BLEED
// ----------------------------------------------------------------------------
function kd3_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd3-vogue-cover">
      <div class="kd3-vogue-hero" style="${bg(hero)}">
        <div class="kd3-vogue-overlay">
          <div class="kd3-vogue-masthead">
            <span class="kd3-vogue-sub">HIGH FASHION LOOKBOOK &bull; EDITION 2026</span>
            <h1 class="kd3-vogue-title">${E(i.ent || 'GOSSAMER')}</h1>
          </div>
          <div class="kd3-vogue-footer-block">
            <div class="kd3-vogue-callout">
              <b>THE RUNWAY COLLECTION</b>
              <p>${E(i.desc || 'Architectural drapes and sheer minimalism for modern global runways.')}</p>
            </div>
            <div class="kd3-vogue-meta">
              <span>ISSUE 14</span>
              <span>PARIS / MILAN / MUMBAI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function kd3_story(c, no) {
  const hero = (c.items[1] && c.items[1].img) || c.hero || '';
  return `
    ${head(c, 'EDITORIAL RUNWAY ESSAY', no)}
    <div class="kd3-editorial-wrap">
      <div class="kd3-editorial-hero-col" style="${bg(hero)}">
        <div class="kd3-caption-pill">Runway Silhouette &bull; Fall/Winter Showcase</div>
      </div>
      <div class="kd3-editorial-text-col">
        <span class="kd3-kicker">THE REINVENTION OF ANCIENT TEXTILES</span>
        <h2>Featherweight Architectural Drapery</h2>
        <p class="kd3-drop-cap">Kota Doria transcends traditional occasion-wear. Its sheer geometric grid provides modern fashion designers with a translucent architectural canvas that moves with atmospheric fluidity.</p>
        <blockquote class="kd3-quote">&ldquo;When layered over sharp tailored silhouettes, Kota Doria creates a dialogue between ethereal fragility and modern power dressing.&rdquo;</blockquote>
        <div class="kd3-curator-notes">
          <h4>Runway Styling Directives</h4>
          <ul>
            <li>Pair with structured monochrome trench corsets</li>
            <li>Floor-length fluid pallu styling with exaggerated train</li>
            <li>Minimalist brushed brass and silver architectural jewellery</li>
          </ul>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd3_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `BOUTIQUE RUNWAY LOOKBOOK &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd3-head">
      <h2>Contemporary Runway Gossamer Looks</h2>
      <p>High-fashion editorial silhouettes with sheer micro-khat transparency</p>
    </div>
    <div class="kd3-grid">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg';
        const cardPrice = fmtPrice(it.price || 4800);
        return `
        <div class="kd3-card">
          <div class="kd3-img" style="${bg(cardImg)}">
            <span class="kd3-look-num">LOOK #${pn(idx + 1)}</span>
          </div>
          <div class="kd3-info">
            <div class="kd3-code">${E(it.sku || it.code || `#KD3-${pn(idx + 1)}`)}</div>
            <h3>${E(it.name || it.title || 'Runway Gossamer Saree')}</h3>
            <p class="kd3-notes">${E(it.shortDescription || it.description || 'Editorial sheer drape with silver border and modern minimalist fall.')}</p>
            <div class="kd3-foot">
              <span class="kd3-price">${E(cardPrice)}</span>
              <span class="kd3-label">Editorial Sample Available</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd3_tech(c, no) {
  return `
    ${head(c, 'TEXTILE AERODYNAMICS & TENSILE SPECS', no)}
    <div class="kd3-tech-wrap">
      <div class="kd3-tech-header">
        <h3>Physical Physics of Gossamer Aeration</h3>
        <p>Quantitative benchmarks demonstrating superior thermal conductivity and drape angle coefficient.</p>
      </div>
      <div class="kd3-tech-row">
        <div class="kd3-metric-box">
          <span class="kd3-val">180 CFM</span>
          <label>Air Permeability</label>
          <small>ASTM D737 airflow benchmark</small>
        </div>
        <div class="kd3-metric-box">
          <span class="kd3-val">0.24</span>
          <label>Drape Coefficient</label>
          <small>Extremely fluid dynamic fall</small>
        </div>
        <div class="kd3-metric-box">
          <span class="kd3-val">310 GSM</span>
          <label>Total Weft Mass</label>
          <small>Ultra-low fabric bulk index</small>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd3_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd3-closing-editorial">
      <div class="kd3-closing-box">
        <span class="kd3-badge-editorial">PRESS &amp; BUYER INQUIRIES</span>
        <h2>Fashion Week Showroom &amp; Consignment</h2>
        <p>For stylist lookbook loans, editorial sample requests, and luxury boutique wholesale orders:</p>
        <div class="kd3-closing-table">
          <div><span>Press Desk:</span> <b>${E(i.contact || i.ent || 'Runway Communications')}</b></div>
          <div><span>Direct Phone:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Showroom:</span> <b>${E(i.addr || 'Kaithun Haute Couture Division, Rajasthan')}</b></div>
          <div><span>Inquiries:</span> <b>${E(i.email || 'press@gossamer-runway.com')}</b></div>
        </div>
        <div class="kd3-disclaimer">Samples dispatched via DHL Express worldwide within 48 hours for accredited editorial shoots.</div>
      </div>
    </div>
  `;
}

function renderKd3Suite(t, c) {
  const P = [wrapKd(kd3_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd3_story(c, no++), t));
  const perPage = 4;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd3_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd3_tech(c, no++), t));
  P.push(wrapKd(kd3_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 4. TEMPLATE kd-4: PASTEL FESTIVE SUMMER TROUSSEAU MOSAIC
// ----------------------------------------------------------------------------
function kd4_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd4-summer-cover">
      <div class="kd4-scallop-frame">
        <div class="kd4-cover-top">
          <span class="kd4-festive-badge">🌸 SUMMER BRIDAL TROUSSEAU</span>
          <h1 class="kd4-pastel-title">${E(i.ent || 'Pastel Festive Kota Doria')}</h1>
          <div class="kd4-pastel-sub">${E(c.textOverrides?.tagline || i.tagline || 'Light As Morning Dew &bull; Peach, Pistachio &amp; Blush Handlooms')}</div>
        </div>
        <div class="kd4-oval-cameo-frame">
          <div class="kd4-oval-cameo-img" style="${bg(hero)}"></div>
        </div>
        <div class="kd4-cover-bottom">
          <p>${E(i.desc || 'Curated lightweight trousseau ensembles for summer destination weddings, mehendi ceremonies, and festive celebrations.')}</p>
          <div class="kd4-chips-row">
            <span>✨ Scalloped Zari Borders</span>
            <span>🌿 100% Breathable</span>
            <span>🎀 Bridal Gift Ready</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function kd4_story(c, no) {
  const hero = (c.items[1] && c.items[1].img) || c.hero || '';
  return `
    ${head(c, 'SUMMER TROUSSEAU INSPIRATION', no)}
    <div class="kd4-story-wrap">
      <div class="kd4-story-header">
        <h2>Light as Morning Breeze: The Summer Trousseau</h2>
        <p>Heavy silks overwhelm in summer heat. Our Kota Doria bridal ensembles deliver pure royal opulence without the weight.</p>
      </div>
      <div class="kd4-mosaic-grid">
        <div class="kd4-mosaic-card" style="${bg(hero)}">
          <div class="kd4-mosaic-tag">Rosewater Pink</div>
        </div>
        <div class="kd4-mosaic-card kd4-card-text">
          <h4>Mehendi &amp; Sangeet Elegance</h4>
          <p>Featherlight drape allows effortless dancing and day-long comfort in tropical temperatures.</p>
        </div>
        <div class="kd4-mosaic-card kd4-card-text">
          <h4>Zari Scallop Detailing</h4>
          <p>Micro-cutwork zari borders hand-embroidered along sheer khat edges for subtle sparkle.</p>
        </div>
        <div class="kd4-mosaic-card" style="${bg((c.items[2] || {}).img || hero)}">
          <div class="kd4-mosaic-tag">Mint Pistachio</div>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd4_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `PASTEL TROUSSEAU CURATION &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd4-head">
      <h2>Festive Summer Wedding Ensembles</h2>
      <p>Soft pastel hues with silver and gold tested zari work on sheer khat cotton-silk</p>
    </div>
    <div class="kd4-products-mosaic">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
        const cardPrice = fmtPrice(it.price || 3400);
        return `
        <div class="kd4-product-card">
          <div class="kd4-product-img" style="${bg(cardImg)}">
            <span class="kd4-festive-tag">TROUSSEAU PICK</span>
          </div>
          <div class="kd4-product-body">
            <span class="kd4-code">${E(it.sku || it.code || `#KD4-${pn(idx + 1)}`)}</span>
            <h3>${E(it.name || it.title || 'Festive Pastel Saree')}</h3>
            <p>${E(it.shortDescription || it.description || 'Gentle pastel drape with delicate woven border and pure cotton weft.')}</p>
            <div class="kd4-product-foot">
              <span class="kd4-price">${E(cardPrice)}</span>
              <span class="kd4-gift-badge">Gift Box Included</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd4_tech(c, no) {
  return `
    ${head(c, 'FABRIC COMFORT & WEIGHT COMPARISON', no)}
    <div class="kd4-tech-wrap">
      <h3>Summer Wedding Fabric Comparison Matrix</h3>
      <table class="kd4-tbl">
        <thead>
          <tr>
            <th>Textile Type</th>
            <th>Weight (Saree)</th>
            <th>Breathability</th>
            <th>Luster Index</th>
            <th>Heat Comfort</th>
          </tr>
        </thead>
        <tbody>
          <tr class="kd4-highlight">
            <td><b>Kota Doria Silk-Cotton</b></td>
            <td><b>320 grams</b></td>
            <td><b>98% (Khat Aeration)</b></td>
            <td><b>Soft Royal Sheen</b></td>
            <td><b>★★★★★ (Optimal)</b></td>
          </tr>
          <tr>
            <td>Heavy Banarasi Silk</td>
            <td>850 - 1100g</td>
            <td>35%</td>
            <td>Heavy Metallic</td>
            <td>★★☆☆☆ (Stifling)</td>
          </tr>
          <tr>
            <td>Chiffon Synthetic</td>
            <td>400g</td>
            <td>50%</td>
            <td>Dull / Static</td>
            <td>★★★☆☆ (Clingy)</td>
          </tr>
          <tr>
            <td>Organza Crisp</td>
            <td>380g</td>
            <td>70%</td>
            <td>Crisp Translucent</td>
            <td>★★★☆☆ (Rigid)</td>
          </tr>
        </tbody>
      </table>
    </div>
    ${foot(c)}
  `;
}

function kd4_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd4-closing-wrap">
      <div class="kd4-closing-card">
        <span class="kd4-flower">🌸</span>
        <h2>Bridal Trousseau Concierge &amp; Bulk Gifting</h2>
        <p>Curating personalized trousseau hampers, wedding favor collections, and bespoke bridesmaid sarees.</p>
        <div class="kd4-contact-list">
          <div><span>Personal Trousseau Advisor:</span> <b>${E(i.contact || i.ent || 'Bridal Concierge')}</b></div>
          <div><span>Phone / WhatsApp:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Boutique Address:</span> <b>${E(i.addr || 'Kaithun Festive Studio, Kota, Rajasthan')}</b></div>
          <div><span>Email:</span> <b>${E(i.email || 'bridal@festive-kotadoria.in')}</b></div>
        </div>
        <div class="kd4-gift-promo">
          <span>🎁 Complimentary embroidered satin dust-bags and custom monogram gift cards on orders over 10 sarees.</span>
        </div>
      </div>
    </div>
  `;
}

function renderKd4Suite(t, c) {
  const P = [wrapKd(kd4_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd4_story(c, no++), t));
  const perPage = 4;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd4_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd4_tech(c, no++), t));
  P.push(wrapKd(kd4_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 5. TEMPLATE kd-5: DUPATTA ATELIER 4-STRIP VERTICAL SPLIT & SQUARE SWATCHES
// ----------------------------------------------------------------------------
function kd5_cover(c, t) {
  const i = c.info;
  const items = c.items || [];
  const img1 = (items[0] && items[0].img) || c.hero || '';
  const img2 = (items[1] && items[1].img) || img1;
  const img3 = (items[2] && items[2].img) || img1;
  const img4 = (items[3] && items[3].img) || img1;
  return `
    <div class="kd5-accordion-cover">
      <div class="kd5-strip-container">
        <div class="kd5-strip" style="${bg(img1)}"><span class="kd5-strip-tag">ZARI BORDER</span></div>
        <div class="kd5-strip" style="${bg(img2)}"><span class="kd5-strip-tag">TIE-DYE BANDHANI</span></div>
        <div class="kd5-strip" style="${bg(img3)}"><span class="kd5-strip-tag">BLOCK PRINT</span></div>
        <div class="kd5-strip" style="${bg(img4)}"><span class="kd5-strip-tag">TASSEL EDGING</span></div>
      </div>
      <div class="kd5-floating-banner">
        <span class="kd5-atelier-kicker">THE DUPATTA SPECIALTY ATELIER</span>
        <h1 class="kd5-atelier-h1">${E(i.ent || 'Kota Doria Dupattas')}</h1>
        <p>${E(i.desc || 'Handwoven 2.5m luxury stoles and dupattas crafted with artisan latkan tassels and ornate zari selvages.')}</p>
        <div class="kd5-banner-stats">
          <span>✦ 2.5m Standard Cut</span>
          <span>✦ 36" Full Width</span>
          <span>✦ Hand-Knotted Tassels</span>
        </div>
      </div>
    </div>
  `;
}

function kd5_story(c, no) {
  return `
    ${head(c, 'THE ART OF DUPATTA DRAPING', no)}
    <div class="kd5-story-wrap">
      <h2>Versatile Draping Dynamics</h2>
      <p>A Kota Doria dupatta transforms any simple kurta, lehenga, or evening dress into an ensemble of sheer regal splendor.</p>
      <div class="kd5-styles-grid">
        <div class="kd5-style-card">
          <div class="kd5-style-icon">01</div>
          <h4>The Royal Shoulder Pleat</h4>
          <p>Neatly pleated along the shoulder to highlight the rich woven zari border, cascading effortlessly to the ankles.</p>
        </div>
        <div class="kd5-style-card">
          <div class="kd5-style-icon">02</div>
          <h4>The Floating Scarf Drape</h4>
          <p>Wrapped casually around the neck as a summer statement stole, offering airy breathability with rich color accents.</p>
        </div>
        <div class="kd5-style-card">
          <div class="kd5-style-icon">03</div>
          <h4>Double Dupatta Veil</h4>
          <p>Used as the secondary lightweight sheer head veil in bridal lehengas, staying in place with zero hairpins tension.</p>
        </div>
        <div class="kd5-style-card">
          <div class="kd5-style-icon">04</div>
          <h4>Belted Runway Cinch</h4>
          <p>Draped symmetrically over both shoulders and cinched at the waist with an embroidered or metallic belt.</p>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd5_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `DUPATTA ATELIER COLLECTION &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd5-head">
      <h2>Handloom Dupatta &amp; Stole Edits</h2>
      <p>Finely finished with pure silk fringe tassels, contrast piping, and antique gold zari borders</p>
    </div>
    <div class="kd5-grid">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg';
        const cardPrice = fmtPrice(it.price || 1650);
        return `
        <div class="kd5-card">
          <div class="kd5-img" style="${bg(cardImg)}">
            <span class="kd5-tassel-badge">HAND-KNOTTED TASSELS</span>
          </div>
          <div class="kd5-body">
            <div class="kd5-code">${E(it.sku || it.code || `#KD5-${pn(idx + 1)}`)}</div>
            <h3>${E(it.name || it.title || 'Artisan Dupatta')}</h3>
            <p>${E(it.shortDescription || it.description || 'Featherlight 2.5m stole with woven borders and decorative fringes.')}</p>
            <div class="kd5-specs">
              <span>Dim: 2.5m x 0.9m</span>
              <span>Weight: 140g</span>
            </div>
            <div class="kd5-foot">
              <span class="kd5-price">${E(cardPrice)}</span>
              <span class="kd5-moq">Min Order: 5 Pcs</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd5_tech(c, no) {
  return `
    ${head(c, 'BORDER INTEGRITY & FINISHING SPECS', no)}
    <div class="kd5-tech-wrap">
      <h3>Dupatta Finish &amp; Selvage Quality Standards</h3>
      <div class="kd5-finishing-grid">
        <div class="kd5-finishing-box">
          <h4>Hand-Knotted Silk Latkan</h4>
          <p>Every dupatta edge is hand-knotted by women artisans in Kaithun using matching mulberry silk yarns for zero fraying.</p>
        </div>
        <div class="kd5-finishing-box">
          <h4>Interlocked Zari Selvage</h4>
          <p>Side borders are woven with reinforced double-weft selvages to prevent curling or tearing during daily draping.</p>
        </div>
        <div class="kd5-finishing-box">
          <h4>Precision Pre-Shrinking</h4>
          <p>Pre-washed in filtered well water to eliminate shrinkage, guaranteeing stable 2.50m finished length after hand-washing.</p>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd5_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd5-closing-wrap">
      <div class="kd5-closing-card">
        <h2>Dupatta Wholesale &amp; Custom Sizing Orders</h2>
        <p>Supplying multi-designer boutiques, fabric houses, and custom wedding party sets.</p>
        <div class="kd5-contacts">
          <div><span>Atelier Desk:</span> <b>${E(i.contact || i.ent || 'Dupatta Division')}</b></div>
          <div><span>WhatsApp:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Location:</span> <b>${E(i.addr || 'Kaithun Handloom Cluster, Kota, Rajasthan')}</b></div>
          <div><span>Wholesale Email:</span> <b>${E(i.email || 'wholesale@dupatta-kotadoria.in')}</b></div>
        </div>
      </div>
    </div>
  `;
}

function renderKd5Suite(t, c) {
  const P = [wrapKd(kd5_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd5_story(c, no++), t));
  const perPage = 4;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd5_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd5_tech(c, no++), t));
  P.push(wrapKd(kd5_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 6. TEMPLATE kd-6: NATURAL VEGETABLE DYE HEXAGONAL FRAME & HORIZONTAL RIBBON CARDS
// ----------------------------------------------------------------------------
function kd6_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd6-eco-cover">
      <div class="kd6-leaf-border">
        <div class="kd6-top-badge">🌿 100% BOTANICAL &amp; ECO-CERTIFIED</div>
        <h1 class="kd6-h1">${E(i.ent || 'Organic Dye Kota Doria')}</h1>
        <div class="kd6-sub">${E(c.textOverrides?.tagline || i.tagline || 'Naturally Dyed with Forest Herbs, Bark &amp; River Clay')}</div>
        <div class="kd6-hex-frame">
          <div class="kd6-hex-inner" style="${bg(hero)}"></div>
        </div>
        <div class="kd6-eco-manifesto">
          <p>${E(i.desc || 'Zero chemical effluent handloom weaving. Cotton yarns starched with organic wild onion juice and dyed using indigenous plants.')}</p>
        </div>
        <div class="kd6-badges-row">
          <span>✦ GOTS Organic Cotton</span>
          <span>✦ Zero Chemical Runoff</span>
          <span>✦ Skin Friendly pH 6.8</span>
        </div>
      </div>
    </div>
  `;
}

function kd6_story(c, no) {
  return `
    ${head(c, 'INDIGENOUS BOTANICAL INGREDIENTS', no)}
    <div class="kd6-story-wrap">
      <h2>Roots, Bark &amp; Minerals: Pure Earth Chemistry</h2>
      <p>Our artisans harvest seasonal botanical ingredients sustainably from the Chambal river basin:</p>
      <div class="kd6-ingredients-grid">
        <div class="kd6-ing-card">
          <div class="kd6-ing-color" style="background:#b91c1c"></div>
          <h4>Rubia Cordifolia (Manjistha)</h4>
          <p>Indian madder root yielding deep crimson and terracotta reds with extraordinary sunlight longevity.</p>
        </div>
        <div class="kd6-ing-card">
          <div class="kd6-ing-color" style="background:#1d4ed8"></div>
          <h4>Indigofera Tinctoria</h4>
          <p>Naturally fermented organic indigo leaves yielding royal lapis lazuli and celestial blues.</p>
        </div>
        <div class="kd6-ing-card">
          <div class="kd6-ing-color" style="background:#ca8a04"></div>
          <h4>Punica Granatum (Pomegranate)</h4>
          <p>Sundried pomegranate rind combined with turmeric for golden yellows and khaki hues.</p>
        </div>
        <div class="kd6-ing-card">
          <div class="kd6-ing-color" style="background:#1e293b"></div>
          <h4>Kasimi (Iron Extract)</h4>
          <p>Fermented sugarcane molasses with scrap iron creating non-bleeding slate greys and rich blacks.</p>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd6_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `BOTANICAL DYE DOSSIER &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd6-head">
      <h2>Naturally Pigmented Handloom Doria Slices</h2>
      <p>Horizontal ribbon presentation highlighting specific botanical dye recipes</p>
    </div>
    <div class="kd6-ribbon-list">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg';
        const cardPrice = fmtPrice(it.price || 3100);
        return `
        <div class="kd6-ribbon-row">
          <div class="kd6-ribbon-thumb" style="${bg(cardImg)}">
            <span class="kd6-eco-tag">ORGANIC</span>
          </div>
          <div class="kd6-ribbon-details">
            <div class="kd6-code">${E(it.sku || it.code || `#KD6-${pn(idx + 1)}`)}</div>
            <h3>${E(it.name || it.title || 'Botanical Dye Saree')}</h3>
            <p>${E(it.shortDescription || it.description || 'Naturally pigmented silk-cotton with organic harda mordant.')}</p>
            <div class="kd6-pills">
              <span>Extract: Indigo &amp; Madder</span>
              <span>Mordant: Natural Alum</span>
            </div>
          </div>
          <div class="kd6-ribbon-action">
            <span class="kd6-price">${E(cardPrice)}</span>
            <small>Direct Loom Rate</small>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd6_tech(c, no) {
  return `
    ${head(c, 'ENVIRONMENTAL & SAFETY CERTIFICATIONS', no)}
    <div class="kd6-tech-wrap">
      <h3>Zero-Chemical Ecological Impact Matrix</h3>
      <div class="kd6-eco-metrics">
        <div class="kd6-metric">
          <b>0%</b>
          <span>Synthetic Heavy Metals</span>
        </div>
        <div class="kd6-metric">
          <b>100%</b>
          <span>Biodegradable Fibers</span>
        </div>
        <div class="kd6-metric">
          <b>6.8</b>
          <span>Skin Neutral pH</span>
        </div>
        <div class="kd6-metric">
          <b>90%</b>
          <span>Water Recycling Rate</span>
        </div>
      </div>
      <p class="kd6-eco-note">Tested and certified free from formaldehyde, pentachlorophenol, and aromatic amines in accordance with global organic textile standards.</p>
    </div>
    ${foot(c)}
  `;
}

function kd6_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd6-closing-wrap">
      <div class="kd6-closing-box">
        <h2>Eco-Conscious Wholesale Partnerships</h2>
        <p>Supplying sustainable lifestyle brands, ethical fashion boutiques, and fair-trade retailers worldwide.</p>
        <div class="kd6-contact-grid">
          <div><span>Cooperative Apex:</span> <b>${E(i.contact || i.ent || 'Organic Weavers Society')}</b></div>
          <div><span>Direct Hotline:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Headquarters:</span> <b>${E(i.addr || 'Kaithun Eco-Textile Park, Kota, Rajasthan')}</b></div>
          <div><span>Inquiries:</span> <b>${E(i.email || 'eco@organic-kotadoria.in')}</b></div>
        </div>
      </div>
    </div>
  `;
}

function renderKd6Suite(t, c) {
  const P = [wrapKd(kd6_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd6_story(c, no++), t));
  const perPage = 4;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd6_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd6_tech(c, no++), t));
  P.push(wrapKd(kd6_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 7. TEMPLATE kd-7: SAPPHIRE VELVET ROYAL COUTURE MASTERPIECE 2-PER-PAGE SPREAD
// ----------------------------------------------------------------------------
function kd7_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd7-noir-cover">
      <div class="kd7-stars-grid"></div>
      <div class="kd7-couture-content">
        <div class="kd7-crest">⚜️ HAUTE COUTURE EDITION</div>
        <h1 class="kd7-gold-title">${E(i.ent || 'Royal Noir Couture')}</h1>
        <div class="kd7-gold-line"></div>
        <div class="kd7-tagline">${E(c.textOverrides?.tagline || i.tagline || 'Master Artisan Commissioned Pure Zari Gossamer Saree Masterpieces')}</div>
        <div class="kd7-hero-window" style="${bg(hero)}">
          <div class="kd7-gold-border-corner tl"></div>
          <div class="kd7-gold-border-corner tr"></div>
          <div class="kd7-gold-border-corner bl"></div>
          <div class="kd7-gold-border-corner br"></div>
        </div>
        <div class="kd7-provenance">
          <span>LIMITED EDITION OF 25 PIECES PER DESIGN &bull; NUMBERED &amp; CERTIFIED</span>
        </div>
      </div>
    </div>
  `;
}

function kd7_story(c, no) {
  const hero = (c.items[1] && c.items[1].img) || c.hero || '';
  return `
    ${head(c, 'THE MASTER WEAVER GUILD DOSSIER', no)}
    <div class="kd7-noir-story">
      <div class="kd7-story-left">
        <span class="kd7-gold-badge">NATIONAL AWARD ARTISANS</span>
        <h2>Midnight in Kaithun: The 400-Khat Masterpiece</h2>
        <p>While standard commercial Kota Doria weaves feature 250 to 300 khat checks, our Royal Noir Couture edition is woven at an unprecedented 420 micro-khats per square decimeter.</p>
        <p>A single master weaver produces no more than 8 inches of fabric per 10-hour working day, using pure silver bullion zari electroplated with 24-karat gold.</p>
        <div class="kd7-hallmark-box">
          <h4>The Royal Seal of Authenticity</h4>
          <p>Every saree in this edition is accompanied by an embossed copper hallmark certificate bearing the signature of the master weaver and the official loom serial registration.</p>
        </div>
      </div>
      <div class="kd7-story-right" style="${bg(hero)}">
        <div class="kd7-portrait-caption">Ustad Ghulam Nabi &bull; National Master Craftsman Awardee</div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd7_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `HAUTE COUTURE CATALOGUE &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd7-noir-head">
      <h2>Master Artisan Couture Showcases</h2>
      <p>Oversized dual-spread master pieces featuring pure gold bullion zari pallus</p>
    </div>
    <div class="kd7-couture-grid">
      ${slice.map((it, idx) => {
        const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
        const cardPrice = fmtPrice(it.price || 9500);
        return `
        <div class="kd7-couture-card">
          <div class="kd7-couture-img" style="${bg(cardImg)}">
            <span class="kd7-edition-chip">EDITION SERIAL #${pn(idx + 1)}/25</span>
          </div>
          <div class="kd7-couture-body">
            <div class="kd7-meta-row">
              <span class="kd7-code">${E(it.sku || it.code || `#KD7-NOIR-${pn(idx + 1)}`)}</span>
              <span class="kd7-khat-tag">420 KHAT DENSITY</span>
            </div>
            <h3>${E(it.name || it.title || 'Haute Couture Saree')}</h3>
            <p>${E(it.shortDescription || it.description || 'Commissioned master pit-loom weave with gold bullion zari and unweighted mulberry silk warp.')}</p>
            <div class="kd7-specs-grid">
              <div><span>Weave Duration:</span> 45 Days on Pit-Loom</div>
              <div><span>Zari Purity:</span> 24K Gold Electroplate</div>
              <div><span>Total Weight:</span> 330 Grams</div>
              <div><span>Blouse Piece:</span> Included (80cm)</div>
            </div>
            <div class="kd7-couture-foot">
              <span class="kd7-price">${E(cardPrice)}</span>
              <span class="kd7-bespoke-tag">Bespoke Commission</span>
            </div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${foot(c)}
  `;
}

function kd7_tech(c, no) {
  return `
    ${head(c, 'METALLURGIC & WEAVE AUDIT METRICS', no)}
    <div class="kd7-noir-tech">
      <h3>Micro-Khat Precision Weave Density Matrix</h3>
      <div class="kd7-tech-metrics-grid">
        <div class="kd7-spec-panel">
          <h4>Khat Count Verification</h4>
          <div class="kd7-spec-item"><span>Warp Density:</span><b>120 Ends per Inch</b></div>
          <div class="kd7-spec-item"><span>Weft Density:</span><b>110 Picks per Inch</b></div>
          <div class="kd7-spec-item"><span>Total Grid Count:</span><b>420 Khats / dm²</b></div>
        </div>
        <div class="kd7-spec-panel">
          <h4>Zari Metallurgic Spectrum</h4>
          <div class="kd7-spec-item"><span>Core Filament:</span><b>Mulberry Silk Core</b></div>
          <div class="kd7-spec-item"><span>Silver Layer:</span><b>99.5% Fine Silver Lametta</b></div>
          <div class="kd7-spec-item"><span>Gold Gilding:</span><b>0.5 Micron 24K Gold</b></div>
        </div>
      </div>
      <div class="kd7-hallmark-badge">
        <span>⚜️ Certified Archival Longevity: Guaranteed Non-Tarnishing for 50+ Years</span>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd7_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd7-noir-closing">
      <div class="kd7-vip-box">
        <div class="kd7-crest-small">⚜️</div>
        <h2>Private Atelier Commissioning</h2>
        <p>Private appointments, bespoke heirloom bridal orders, and global white-glove courier deliveries.</p>
        <div class="kd7-vip-contacts">
          <div><span>Private Concierge:</span> <b>${E(i.contact || i.ent || 'Haute Couture Director')}</b></div>
          <div><span>VIP WhatsApp Desk:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Private Salon:</span> <b>${E(i.addr || 'Kaithun Royal Couture Salon, Kota, Rajasthan')}</b></div>
          <div><span>Commission Inquiries:</span> <b>${E(i.email || 'vip@royalkotadoria.com')}</b></div>
        </div>
        <div class="kd7-courier-note">Each creation is delivered in a handcrafted velvet-lined Sheesham wood heirloom chest with certificate of authenticity.</div>
      </div>
    </div>
  `;
}

function renderKd7Suite(t, c) {
  const P = [wrapKd(kd7_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd7_story(c, no++), t));
  const perPage = 2;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd7_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd7_tech(c, no++), t));
  P.push(wrapKd(kd7_closing(c, no), t));
  return P;
}

// ----------------------------------------------------------------------------
// 8. TEMPLATE kd-8: KAITHUN WEAVER GUILD OFFICIAL GI MAP DOSSIER & EXPORT TABLE
// ----------------------------------------------------------------------------
function kd8_cover(c, t) {
  const i = c.info;
  const hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="kd8-dossier-cover">
      <div class="kd8-govt-bar">
        <span>GEOGRAPHICAL INDICATION REGISTRATION NO. 84 &bull; GOVERNMENT OF INDIA</span>
        <span>KAITHUN HANDLOOM TEXTILE CLUSTER</span>
      </div>
      <div class="kd8-dossier-split">
        <div class="kd8-dossier-left">
          <div class="kd8-emblem">🏛️</div>
          <span class="kd8-doc-kicker">OFFICIAL TRADE &amp; EXPORT DOSSIER</span>
          <h1 class="kd8-h1">${E(i.ent || 'Kaithun Weaver Guild Export')}</h1>
          <p class="kd8-doc-desc">${E(i.desc || 'Comprehensive institutional catalog of authentic Geographical Indication registered Kota Doria handloom textiles, technical warp-weft specifications, and bulk container export rates.')}</p>
          <div class="kd8-meta-table">
            <div><span>GI Jurisdiction:</span> <b>Kaithun, Kota, Rajasthan</b></div>
            <div><span>GPS Coordinates:</span> <b>25.1287° N, 75.8456° E</b></div>
            <div><span>Primary HS Code:</span> <b>5007.20.10 / 5208.11.90</b></div>
            <div><span>Audited Looms:</span> <b>1,450 Registered Pit-Looms</b></div>
          </div>
        </div>
        <div class="kd8-dossier-right" style="${bg(hero)}">
          <div class="kd8-map-stamp">OFFICIAL GI STAMP</div>
        </div>
      </div>
    </div>
  `;
}

function kd8_story(c, no) {
  return `
    ${head(c, 'GEOGRAPHICAL INDICATION HERITAGE & AUDIT', no)}
    <div class="kd8-dossier-story">
      <h2>Legal Provenance &amp; Loom Registration (GI-84)</h2>
      <p>Under the Geographical Indications of Goods (Registration and Protection) Act, only textiles woven on traditional throw-shuttle pit-looms within the demarcated Kaithun cluster may legally carry the name &lsquo;Kota Doria&rsquo;.</p>
      <div class="kd8-audit-grid">
        <div class="kd8-audit-card">
          <div class="kd8-audit-icon">📋</div>
          <h4>Loom Audit &amp; QR Tagging</h4>
          <p>Every active pit-loom is assigned a unique government biometric registration ID, preventing powerloom counterfeits.</p>
        </div>
        <div class="kd8-audit-card">
          <div class="kd8-audit-icon">🌾</div>
          <h4>Indigenous Sizing Starch</h4>
          <p>Local Chambal river water combined with indigenous onion paste starch gives genuine Kota Doria its signature crisp hand-feel.</p>
        </div>
        <div class="kd8-audit-card">
          <div class="kd8-audit-icon">🚢</div>
          <h4>Global Export Compliance</h4>
          <p>All bulk consignments are verified by the Textiles Committee of India with certificate of origin documentation.</p>
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd8_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `EXPORT SPECIFICATION TABLE &bull; (${pn(pageIdx)}/${pn(totalPages)})`, no)}
    <div class="kd8-head">
      <h2>Export Fabric &amp; Saree Batch Inventory</h2>
      <p>Official technical matrix for container load shipments and wholesale boutique stockists</p>
    </div>
    <div class="kd8-table-wrap">
      <table class="kd8-export-tbl">
        <thead>
          <tr>
            <th>Product Preview</th>
            <th>Item Code &amp; Title</th>
            <th>Warp / Weft Specs</th>
            <th>Khat Density</th>
            <th>HS Code</th>
            <th>FOB Rate</th>
          </tr>
        </thead>
        <tbody>
          ${slice.map((it, idx) => {
            const cardImg = it.img || it.image || (it.images && it.images[0] && (it.images[0].url || it.images[0])) || it.angle1 || '/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg';
            const cardPrice = fmtPrice(it.price || 3200);
            return `
            <tr>
              <td>
                <div class="kd8-tbl-thumb" style="${bg(cardImg)}"></div>
              </td>
              <td>
                <b>${E(it.name || it.title || 'Export Saree Batch')}</b>
                <small>${E(it.sku || it.code || `#KD8-EXP-${pn(idx + 1)}`)}</small>
              </td>
              <td>
                <span>Warp: 20/22D Silk</span>
                <small>Weft: 100s Egyptian Cotton</small>
              </td>
              <td>
                <b>300 Khats / dm²</b>
                <small>Tested Throw-Shuttle</small>
              </td>
              <td>
                <code>5007.20.10</code>
              </td>
              <td>
                <span class="kd8-price-pill">${E(cardPrice)}</span>
              </td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
    ${foot(c)}
  `;
}

function kd8_tech(c, no) {
  return `
    ${head(c, 'TEXTILE COMMITTEE TESTING BENCHMARKS', no)}
    <div class="kd8-dossier-tech">
      <h3>Official Quality Inspection &amp; Loom Audit Criteria</h3>
      <div class="kd8-tech-table-box">
        <table class="kd8-spec-tbl">
          <tr><td>Fiber Composition Purity</td><td>Minimum 75% Cotton &bull; 25% Pure Mulberry Silk</td></tr>
          <tr><td>Zari Metallurgic Standard</td><td>Silver gilded electroplated with zero lead content</td></tr>
          <tr><td>Tensile Warp Strength</td><td>Exceeds 45 N/cm under ISO 13934 test parameters</td></tr>
          <tr><td>Export Packaging Protocol</td><td>ISPM-15 moisture barrier lined export master cartons</td></tr>
        </table>
      </div>
    </div>
    ${foot(c)}
  `;
}

function kd8_closing(c, no) {
  const i = c.info;
  return `
    <div class="kd8-dossier-closing">
      <div class="kd8-govt-panel">
        <h2>Weaver Cooperative Apex Society &bull; Trade Desk</h2>
        <p>Authorized commercial export liaison for government-certified handloom cooperatives.</p>
        <div class="kd8-trade-grid">
          <div><span>Apex Office:</span> <b>${E(i.addr || 'Kaithun Weaver Cooperative Federation, Kota, Rajasthan')}</b></div>
          <div><span>Trade Liaison Officer:</span> <b>${E(i.contact || i.ent || 'Secretary, Handloom Board')}</b></div>
          <div><span>Direct Telephone:</span> <b>${E(i.mobile || '+91 98290 XXXXX')}</b></div>
          <div><span>Export Clearing Email:</span> <b>${E(i.email || 'export@kaithun-handloom.gov.in')}</b></div>
        </div>
      </div>
    </div>
  `;
}

function renderKd8Suite(t, c) {
  const P = [wrapKd(kd8_cover(c, t), t)];
  let no = 2;
  P.push(wrapKd(kd8_story(c, no++), t));
  const perPage = 6;
  const totalPages = Math.ceil(c.items.length / perPage) || 1;
  for (let k = 0; k < c.items.length; k += perPage) {
    P.push(wrapKd(kd8_products(c, no++, c.items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), t));
  }
  P.push(wrapKd(kd8_tech(c, no++), t));
  P.push(wrapKd(kd8_closing(c, no), t));
  return P;
}

// ============================================================================
// MAIN PAGE COUNT & RENDER DISPATCHER
// ============================================================================
function pageCount(t, n) {
  if (t.id === 'kd-parampara' || t.id === 'kd-silken') return 8;
  const perPage = (t.id === 'kd-1' || t.id === 'kd-3' || t.id === 'kd-4' || t.id === 'kd-5' || t.id === 'kd-6') ? 4 : (t.id === 'kd-7' ? 2 : 6);
  return 1 + 1 + Math.ceil(Math.max(1, n) / perPage) + 1 + 1; // cover + story + products + tech + closing
}

function render(t, ctx) {
  const items = (ctx.items || []).map((it, k) => Object.assign({ code: `#KD-${pn(k + 1)}` }, it));
  const c = Object.assign({}, ctx, {
    items,
    th: t.theme,
    copy: ctx.copy || {},
    hero: ctx.heroImg || (items[0] && items[0].img) || ''
  });

  // Dedicated Parampara Wholesale Monograph Suite
  if (t.id === 'kd-parampara') {
    return renderParamparaSuite(t, c);
  }

  // Dedicated Silken Saga Celebration Brochure Suite
  if (t.id === 'kd-silken') {
    return renderSilkenSagaSuite(t, c);
  }

  // Dedicated Suites for kd-1 through kd-8
  if (t.id === 'kd-1') return renderKd1Suite(t, c);
  if (t.id === 'kd-2') return renderKd2Suite(t, c);
  if (t.id === 'kd-3') return renderKd3Suite(t, c);
  if (t.id === 'kd-4') return renderKd4Suite(t, c);
  if (t.id === 'kd-5') return renderKd5Suite(t, c);
  if (t.id === 'kd-6') return renderKd6Suite(t, c);
  if (t.id === 'kd-7') return renderKd7Suite(t, c);
  if (t.id === 'kd-8') return renderKd8Suite(t, c);

  return renderKd1Suite(t, c);
}

const CSS = `
/* ========================================================================== */
/* DEDICATED TEMPLATE STRUCTURAL STYLES (kd-1 to kd-8)                       */
/* ========================================================================== */

.pg.kotadoria-pg {
  width: 794px;
  height: 1123px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
  color: var(--ink);
  font-family: var(--bf);
  font-size: 11.5px;
  margin-bottom: 24px;
  box-sizing: border-box;
  padding: 44px;
}

/* Common Header & Footer for Standard KD */
.kd-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1.5px solid var(--line); padding-bottom: 12px; margin-bottom: 20px;
}
.kd-head-brand { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink); }
.kd-loom-icon { font-size: 16px; }
.kd-head-tag { font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); }
.kd-head-num { font-size: 11px; font-weight: 800; background: var(--soft); color: var(--acc); padding: 3px 8px; border-radius: 4px; }
.kd-foot {
  position: absolute; bottom: 20px; left: 44px; right: 44px;
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid var(--line); padding-top: 8px; font-size: 9.5px; color: var(--muted);
  z-index: 5;
}

/* -------------------------------------------------------------------------- */
/* kd-1: ROYAL RAJPUTANA MEDALLION & COURT FRAME                              */
/* -------------------------------------------------------------------------- */
.kd1-cover-container { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.kd1-court-border {
  border: 3px double var(--acc, #c5a059);
  padding: 34px; border-radius: 16px; background: rgba(255,255,255,0.7);
  box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: center;
}
.kd1-cov-header { margin-bottom: 20px; }
.kd1-regal-insignia { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; color: var(--acc); margin-bottom: 4px; }
.kd1-gi-stamp { font-size: 9.5px; color: var(--muted); letter-spacing: 0.1em; }
.kd1-arch-medallion { width: 280px; height: 340px; margin: 0 auto 24px; position: relative; }
.kd1-arch-window {
  width: 100%; height: 100%; border-radius: 140px 140px 16px 16px;
  background-size: cover; background-position: center; border: 3px solid var(--acc);
  box-shadow: 0 12px 28px rgba(0,0,0,0.18); position: relative; overflow: hidden;
}
.kd1-gold-mesh {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(197,160,89,0.15) 1px, transparent 1px);
  background-size: 8px 8px;
}
.kd1-seal-floating {
  position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
  background: var(--dark); color: #fff; font-size: 9px; font-weight: 800;
  padding: 4px 14px; border-radius: 20px; letter-spacing: 0.12em; border: 1px solid var(--acc);
}
.kd1-royal-title { font-family: var(--hf); font-size: 32px; margin: 0 0 6px; color: var(--ink); }
.kd1-royal-tagline { font-size: 12.5px; font-weight: 600; color: var(--acc); margin-bottom: 14px; }
.kd1-court-decree { font-size: 11px; line-height: 1.6; color: var(--muted); max-width: 540px; margin: 0 auto 20px; }
.kd1-heraldic-pillars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 540px; margin: 0 auto; }
.kd1-pillar { background: var(--soft); padding: 10px; border-radius: 8px; border: 1px solid var(--line); }
.kd1-pillar span { display: block; font-size: 15px; font-weight: 800; color: var(--acc); }
.kd1-pillar small { font-size: 9.5px; color: var(--muted); }

.kd1-story-wrap { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 26px; height: 860px; }
.kd1-story-kicker { font-size: 10px; font-weight: 800; color: var(--acc); letter-spacing: 0.14em; }
.kd1-story-wrap h2 { font-family: var(--hf); font-size: 26px; margin: 6px 0 14px; }
.kd1-story-lead { font-size: 12px; line-height: 1.65; color: var(--ink); margin-bottom: 16px; }
.kd1-charter-box { background: var(--soft); border-left: 3px solid var(--acc); padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 18px; }
.kd1-charter-box h4 { font-size: 13px; margin: 0 0 6px; color: var(--dark); }
.kd1-charter-box p { font-size: 11px; line-height: 1.6; color: var(--muted); margin: 0; }
.kd1-audit-badges { display: flex; flex-direction: column; gap: 8px; font-size: 11px; font-weight: 700; color: var(--ink); }
.kd1-palace-arch-frame {
  height: 100%; border-radius: 180px 180px 16px 16px; background-size: cover; background-position: center;
  border: 2px solid var(--acc); position: relative; box-shadow: 0 10px 24px rgba(0,0,0,0.12);
}
.kd1-arch-caption {
  position: absolute; bottom: 16px; left: 16px; right: 16px;
  background: rgba(0,0,0,0.75); color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 9.5px; text-align: center;
}

.kd1-head { margin-bottom: 12px; }
.kd1-head h2 { font-family: var(--hf); font-size: 22px; margin: 0 0 3px; color: var(--ink); line-height: 1.2; }
.kd1-head p { font-size: 11px; color: var(--muted); margin: 0; }
.kd1-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.kd1-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid var(--acc);
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 410px;
  max-height: 410px;
  box-sizing: border-box;
}
.kd1-img {
  height: 185px;
  min-height: 185px;
  max-height: 185px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: var(--soft);
}
.kd1-tag { position: absolute; top: 10px; left: 10px; background: var(--acc); color: #fff; font-size: 8.5px; font-weight: 800; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.08em; }
.kd1-details {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  box-sizing: border-box;
}
.kd1-sku-chip { font-size: 8.5px; font-weight: 800; color: var(--acc); margin-bottom: 3px; }
.kd1-details h3 {
  font-family: var(--hf);
  font-size: 14.5px;
  margin: 0 0 4px;
  line-height: 1.25;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd1-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd1-pills {
  display: flex;
  flex-direction: column;
  gap: 2.5px;
  font-size: 9px;
  color: var(--ink);
  margin-bottom: 6px;
  line-height: 1.3;
}
.kd1-pills span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kd1-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 6px; margin-top: auto; }
.kd1-price { font-size: 15px; font-weight: 800; color: var(--acc); line-height: 1; }
.kd1-craft { font-size: 9px; color: var(--muted); font-weight: 700; text-transform: uppercase; }

.kd1-tech-wrap { height: 860px; display: flex; flex-direction: column; justify-content: space-between; }
.kd1-tech-hero h3 { font-family: var(--hf); font-size: 24px; margin: 0 0 6px; }
.kd1-tech-hero p { font-size: 12px; color: var(--muted); margin: 0; }
.kd1-matrix-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 24px 0; }
.kd1-matrix-card { background: var(--soft); border: 1px solid var(--line); border-radius: 12px; padding: 18px; }
.kd1-matrix-card h4 { font-size: 14px; margin: 0 0 12px; color: var(--acc); border-bottom: 1px solid var(--line); padding-bottom: 6px; }
.kd1-spec-line { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; }
.kd1-spec-line span { color: var(--muted); }
.kd1-spec-line b { color: var(--ink); }
.kd1-seal-banner { display: flex; align-items: center; gap: 14px; background: #fff; border: 2px solid var(--acc); border-radius: 12px; padding: 16px 20px; }
.kd1-seal-icon { font-size: 28px; }
.kd1-seal-banner strong { display: block; font-size: 13px; color: var(--ink); }
.kd1-seal-banner small { font-size: 10px; color: var(--muted); }

.kd1-closing-wrap { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd1-closing-frame {
  border: 3px double var(--acc); padding: 44px; border-radius: 18px; background: #fff;
  text-align: center; max-width: 620px; width: 100%; box-shadow: 0 12px 36px rgba(0,0,0,0.08);
}
.kd1-closing-crown { font-size: 32px; margin-bottom: 10px; }
.kd1-closing-title { font-family: var(--hf); font-size: 26px; margin: 0 0 10px; }
.kd1-closing-divider { width: 60px; height: 2px; background: var(--acc); margin: 0 auto 14px; }
.kd1-closing-sub { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd1-closing-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; margin-bottom: 24px; }
.kd1-contact-entry { background: var(--soft); padding: 12px 14px; border-radius: 8px; }
.kd1-entry-lbl { display: block; font-size: 9.5px; color: var(--muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
.kd1-contact-entry b { font-size: 11.5px; color: var(--ink); }
.kd1-closing-guarantee { display: flex; justify-content: space-around; font-size: 10.5px; font-weight: 700; color: var(--acc); border-top: 1px solid var(--line); padding-top: 14px; }

/* -------------------------------------------------------------------------- */
/* kd-2: ARTISANAL WOODBLOCK STAMP & DECKLE-EDGE CARDS                        */
/* -------------------------------------------------------------------------- */
.kd2-cov-wrap { height: 100%; display: flex; align-items: center; }
.kd2-parchment-border {
  border: 2px dashed #9c6644; background: #fffdfa; padding: 36px; border-radius: 14px;
  width: 100%; box-shadow: 0 8px 24px rgba(156,102,68,0.08);
}
.kd2-cov-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid #e6ccb2; padding-bottom: 12px; }
.kd2-seal-circle { background: #7f4f24; color: #fff; font-size: 8px; font-weight: 800; padding: 6px; border-radius: 50%; letter-spacing: 0.08em; }
.kd2-header-text { font-size: 10px; font-weight: 800; letter-spacing: 0.16em; color: #7f4f24; }
.kd2-stamp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; margin-bottom: 24px; }
.kd2-hero-img-box {
  height: 380px; border-radius: 12px; background-size: cover; background-position: center;
  position: relative; border: 2px solid #b08968; box-shadow: 0 10px 24px rgba(0,0,0,0.12);
}
.kd2-stamp-badge-diag {
  position: absolute; top: 16px; left: -10px; background: #8b263e; color: #fff;
  font-size: 9px; font-weight: 800; padding: 4px 14px; border-radius: 4px; transform: rotate(-5deg); box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.kd2-artisanal-label { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: #b08968; }
.kd2-cov-title { font-family: var(--hf); font-size: 34px; margin: 6px 0 12px; color: #43281c; }
.kd2-cov-desc { font-size: 12px; line-height: 1.65; color: #6a4a3a; margin-bottom: 20px; }
.kd2-swatch-ribbon { display: flex; gap: 10px; }
.kd2-swatch-pip { color: #fff; font-size: 9px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.kd2-cov-foot { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 700; color: #7f4f24; border-top: 1px solid #e6ccb2; padding-top: 14px; }

.kd2-story-wrap { height: 860px; }
.kd2-story-header { text-align: center; max-width: 580px; margin: 0 auto 28px; }
.kd2-story-header .kd2-tag { font-size: 9.5px; font-weight: 800; color: var(--acc); letter-spacing: 0.16em; }
.kd2-story-header h2 { font-family: var(--hf); font-size: 26px; margin: 4px 0 10px; }
.kd2-story-header p { font-size: 11.5px; line-height: 1.6; color: var(--muted); }
.kd2-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
.kd2-step-card { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 18px; text-align: center; }
.kd2-step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--soft); color: var(--acc); font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
.kd2-step-card h4 { font-size: 13px; margin: 0 0 6px; }
.kd2-step-card p { font-size: 10.5px; line-height: 1.5; color: var(--muted); margin: 0; }
.kd2-artisan-quote { display: grid; grid-template-columns: 200px 1fr; gap: 20px; background: var(--soft); border-radius: 12px; overflow: hidden; align-items: center; }
.kd2-quote-art { height: 160px; background-size: cover; background-position: center; }
.kd2-quote-text { padding: 20px; }
.kd2-quote-text p { font-family: var(--hf); font-size: 13.5px; font-style: italic; line-height: 1.6; margin: 0 0 8px; color: var(--ink); }
.kd2-quote-text small { font-size: 10.5px; font-weight: 700; color: var(--acc); }

.kd2-head { margin-bottom: 20px; text-align: center; }
.kd2-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.kd2-head p { font-size: 11.5px; color: var(--muted); }
.kd2-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
.kd2-card { background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.kd2-img { height: 160px; background-size: cover; background-position: center; position: relative; }
.kd2-stamp-badge { position: absolute; bottom: 8px; left: 8px; background: var(--dark); color: #fff; font-size: 8.5px; padding: 3px 8px; border-radius: 4px; font-weight: 700; }
.kd2-body { padding: 12px 14px; }
.kd2-code { font-size: 9px; font-weight: 800; color: var(--acc); margin-bottom: 2px; }
.kd2-body h3 { font-family: var(--hf); font-size: 14px; margin: 0 0 4px; }
.kd2-color-chip { font-size: 9.5px; color: var(--muted); margin-bottom: 8px; }
.kd2-foot { display: flex; justify-content: space-between; align-items: center; }
.kd2-price { font-size: 14px; font-weight: 800; color: var(--acc); }
.kd2-tag { font-size: 9px; background: var(--soft); padding: 2px 6px; border-radius: 4px; font-weight: 600; }

.kd2-tech-container { height: 860px; }
.kd2-tech-lead h3 { font-family: var(--hf); font-size: 24px; margin: 0 0 6px; }
.kd2-tech-lead p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd2-tech-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.kd2-tech-card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 22px 18px; text-align: center; }
.kd2-tech-icon { font-size: 28px; display: block; margin-bottom: 12px; }
.kd2-tech-card h4 { font-size: 14px; margin: 0 0 8px; color: var(--ink); }
.kd2-tech-card p { font-size: 11px; line-height: 1.6; color: var(--muted); margin: 0; }

.kd2-closing-wrap { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd2-ledger-box { border: 2px dashed #b08968; background: #fffdfa; padding: 40px; border-radius: 14px; max-width: 580px; width: 100%; text-align: center; }
.kd2-ledger-stamp { display: inline-block; background: #7f4f24; color: #fff; font-size: 9px; font-weight: 800; padding: 4px 12px; border-radius: 4px; letter-spacing: 0.12em; margin-bottom: 12px; }
.kd2-ledger-box h2 { font-family: var(--hf); font-size: 24px; margin: 0 0 8px; }
.kd2-ledger-box p { font-size: 11.5px; color: var(--muted); margin-bottom: 22px; }
.kd2-ledger-fields { display: flex; flex-direction: column; gap: 10px; text-align: left; background: #fbf5ee; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; }
.kd2-ledger-fields div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd2-ledger-fields span { color: #7f4f24; font-weight: 600; }
.kd2-ledger-fields b { color: var(--ink); }
.kd2-ledger-footer { font-size: 10px; color: var(--muted); }

/* -------------------------------------------------------------------------- */
/* kd-3: CONTEMPORARY RUNWAY VOGUE MINIMALIST FULL-BLEED                      */
/* -------------------------------------------------------------------------- */
.kd3-vogue-cover { width: 100%; height: 100%; margin: -44px; padding: 0; position: relative; }
.kd3-vogue-hero { width: 794px; height: 1123px; background-size: cover; background-position: center; position: relative; }
.kd3-vogue-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 60px 48px; box-sizing: border-box; }
.kd3-vogue-sub { font-size: 11px; letter-spacing: 0.35em; color: rgba(255,255,255,0.9); font-weight: 700; display: block; margin-bottom: 8px; }
.kd3-vogue-title { font-family: var(--hf); font-size: 64px; font-weight: 300; letter-spacing: 0.12em; color: #ffffff; margin: 0; text-transform: uppercase; }
.kd3-vogue-footer-block { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 24px; }
.kd3-vogue-callout b { font-size: 13px; letter-spacing: 0.18em; color: #fff; display: block; margin-bottom: 4px; }
.kd3-vogue-callout p { font-size: 11.5px; color: rgba(255,255,255,0.8); margin: 0; max-width: 360px; }
.kd3-vogue-meta { display: flex; flex-direction: column; gap: 4px; font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.85); text-align: right; }

.kd3-editorial-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; height: 860px; align-items: center; }
.kd3-editorial-hero-col { height: 780px; border-radius: 8px; background-size: cover; background-position: center; position: relative; }
.kd3-caption-pill { position: absolute; bottom: 16px; left: 16px; background: rgba(0,0,0,0.75); color: #fff; font-size: 9px; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.1em; }
.kd3-kicker { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: var(--acc); }
.kd3-editorial-text-col h2 { font-family: var(--hf); font-size: 32px; font-weight: 400; margin: 8px 0 16px; }
.kd3-drop-cap { font-size: 12.5px; line-height: 1.7; color: var(--ink); margin-bottom: 18px; }
.kd3-quote { font-family: var(--hf); font-size: 16px; font-style: italic; line-height: 1.6; border-left: 2px solid var(--acc); padding-left: 16px; margin: 20px 0; color: var(--ink); }
.kd3-curator-notes h4 { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 8px; }
.kd3-curator-notes ul { font-size: 11px; color: var(--muted); line-height: 1.6; padding-left: 18px; margin: 0; }

.kd3-head { margin-bottom: 12px; }
.kd3-head h2 { font-family: var(--hf); font-size: 22px; margin: 0 0 3px; line-height: 1.2; }
.kd3-head p { font-size: 11px; color: var(--muted); margin: 0; }
.kd3-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.kd3-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  height: 410px;
  max-height: 410px;
  box-sizing: border-box;
}
.kd3-img {
  height: 185px;
  min-height: 185px;
  max-height: 185px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: var(--soft);
}
.kd3-look-num { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: #fff; font-size: 8.5px; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.12em; }
.kd3-info { padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; box-sizing: border-box; }
.kd3-code { font-size: 8.5px; font-weight: 800; color: var(--acc); margin-bottom: 3px; }
.kd3-info h3 {
  font-family: var(--hf);
  font-size: 14.5px;
  margin: 0 0 4px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd3-notes {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.35;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd3-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 6px; margin-top: auto; }
.kd3-price { font-size: 15px; font-weight: 800; color: var(--acc); line-height: 1; }
.kd3-label { font-size: 9px; color: var(--muted); font-weight: 700; text-transform: uppercase; }

.kd3-tech-wrap { height: 860px; display: flex; flex-direction: column; justify-content: center; }
.kd3-tech-header { text-align: center; margin-bottom: 40px; }
.kd3-tech-header h3 { font-family: var(--hf); font-size: 28px; margin: 0 0 8px; }
.kd3-tech-header p { font-size: 12px; color: var(--muted); }
.kd3-tech-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.kd3-metric-box { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 32px 20px; text-align: center; }
.kd3-val { font-size: 32px; font-weight: 300; font-family: var(--hf); color: var(--acc); display: block; margin-bottom: 6px; }
.kd3-metric-box label { font-size: 12px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px; }
.kd3-metric-box small { font-size: 10px; color: var(--muted); }

.kd3-closing-editorial { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd3-closing-box { border: 1px solid var(--line); background: #fff; padding: 48px; border-radius: 12px; max-width: 600px; width: 100%; text-align: center; }
.kd3-badge-editorial { font-size: 10px; letter-spacing: 0.25em; font-weight: 800; color: var(--acc); }
.kd3-closing-box h2 { font-family: var(--hf); font-size: 28px; font-weight: 400; margin: 10px 0 10px; }
.kd3-closing-box p { font-size: 12px; color: var(--muted); margin-bottom: 28px; }
.kd3-closing-table { display: flex; flex-direction: column; gap: 12px; text-align: left; background: var(--soft); padding: 20px; border-radius: 8px; margin-bottom: 24px; }
.kd3-closing-table div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd3-closing-table span { color: var(--muted); }
.kd3-closing-table b { color: var(--ink); }
.kd3-disclaimer { font-size: 10px; color: var(--muted); font-style: italic; }

/* -------------------------------------------------------------------------- */
/* kd-4: PASTEL FESTIVE SUMMER TROUSSEAU MOSAIC                              */
/* -------------------------------------------------------------------------- */
.kd4-summer-cover { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd4-scallop-frame {
  border: 2px solid #fecdd3; background: #fffafb; padding: 36px; border-radius: 20px;
  text-align: center; width: 100%; box-shadow: 0 12px 30px rgba(244,114,182,0.08);
}
.kd4-festive-badge { background: #ffe4e6; color: #be123c; font-size: 9.5px; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.1em; display: inline-block; margin-bottom: 10px; }
.kd4-pastel-title { font-family: var(--hf); font-size: 32px; color: #881337; margin: 0 0 6px; }
.kd4-pastel-sub { font-size: 12px; color: #be123c; font-weight: 600; margin-bottom: 22px; }
.kd4-oval-cameo-frame { width: 220px; height: 300px; border-radius: 110px; margin: 0 auto 22px; border: 4px solid #f43f5e; overflow: hidden; box-shadow: 0 8px 24px rgba(244,63,94,0.2); }
.kd4-oval-cameo-img { width: 100%; height: 100%; background-size: cover; background-position: center; }
.kd4-cover-bottom p { font-size: 11.5px; line-height: 1.6; color: #9f1239; max-width: 480px; margin: 0 auto 16px; }
.kd4-chips-row { display: flex; justify-content: center; gap: 14px; font-size: 10.5px; font-weight: 700; color: #be123c; }

.kd4-story-wrap { height: 860px; }
.kd4-story-header { text-align: center; margin-bottom: 28px; }
.kd4-story-header h2 { font-family: var(--hf); font-size: 26px; color: #881337; margin: 0 0 6px; }
.kd4-story-header p { font-size: 12px; color: var(--muted); }
.kd4-mosaic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.kd4-mosaic-card { height: 280px; border-radius: 16px; background-size: cover; background-position: center; position: relative; overflow: hidden; }
.kd4-mosaic-tag { position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.65); color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
.kd4-card-text { background: #fff; border: 1px solid #fecdd3; padding: 24px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.03); }
.kd4-card-text h4 { font-family: var(--hf); font-size: 18px; color: #881337; margin: 0 0 8px; }
.kd4-card-text p { font-size: 11.5px; line-height: 1.6; color: var(--muted); margin: 0; }

.kd4-head { margin-bottom: 12px; }
.kd4-head h2 { font-family: var(--hf); font-size: 22px; color: #881337; margin: 0 0 3px; line-height: 1.2; }
.kd4-head p { font-size: 11px; color: var(--muted); margin: 0; }
.kd4-products-mosaic { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.kd4-product-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #fecdd3;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  height: 410px;
  max-height: 410px;
  box-sizing: border-box;
}
.kd4-product-img {
  height: 185px;
  min-height: 185px;
  max-height: 185px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: #fff1f2;
}
.kd4-festive-tag { position: absolute; top: 10px; left: 10px; background: #be123c; color: #fff; font-size: 8.5px; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.08em; }
.kd4-product-body { padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; box-sizing: border-box; }
.kd4-code { font-size: 8.5px; font-weight: 800; color: #be123c; margin-bottom: 3px; }
.kd4-product-body h3 {
  font-family: var(--hf);
  font-size: 14.5px;
  margin: 0 0 4px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd4-product-body p {
  font-size: 10px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd4-product-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #fecdd3; padding-top: 6px; margin-top: auto; }
.kd4-price { font-size: 15px; font-weight: 800; color: #be123c; line-height: 1; }
.kd4-gift-badge { font-size: 9px; color: #059669; font-weight: 700; }

.kd4-tech-wrap { height: 860px; }
.kd4-tech-wrap h3 { font-family: var(--hf); font-size: 24px; color: #881337; margin: 0 0 16px; }
.kd4-tbl { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #fecdd3; font-size: 11.5px; }
.kd4-tbl th { background: #ffe4e6; color: #881337; padding: 12px 14px; text-align: left; font-size: 11px; }
.kd4-tbl td { padding: 12px 14px; border-bottom: 1px solid #fecdd3; }
.kd4-highlight { background: #fff1f2; }

.kd4-closing-wrap { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd4-closing-card { border: 2px solid #fecdd3; background: #fffafb; padding: 40px; border-radius: 18px; text-align: center; max-width: 580px; width: 100%; }
.kd4-flower { font-size: 32px; display: block; margin-bottom: 10px; }
.kd4-closing-card h2 { font-family: var(--hf); font-size: 26px; color: #881337; margin: 0 0 8px; }
.kd4-closing-card p { font-size: 12px; color: var(--muted); margin-bottom: 22px; }
.kd4-contact-list { display: flex; flex-direction: column; gap: 10px; text-align: left; background: #fff; padding: 18px; border-radius: 10px; border: 1px solid #fecdd3; margin-bottom: 18px; }
.kd4-contact-list div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd4-contact-list span { color: #be123c; font-weight: 600; }
.kd4-contact-list b { color: var(--ink); }
.kd4-gift-promo { font-size: 10.5px; color: #be123c; font-weight: 600; }

/* -------------------------------------------------------------------------- */
/* kd-5: DUPATTA ATELIER 4-STRIP VERTICAL SPLIT & SQUARE SWATCHES             */
/* -------------------------------------------------------------------------- */
.kd5-accordion-cover { height: 100%; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
.kd5-strip-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; height: 580px; }
.kd5-strip { border-radius: 12px; background-size: cover; background-position: center; position: relative; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.1); }
.kd5-strip-tag { position: absolute; bottom: 12px; left: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 8px; font-weight: 800; padding: 4px; text-align: center; border-radius: 4px; letter-spacing: 0.08em; }
.kd5-floating-banner { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: center; margin-top: 24px; }
.kd5-atelier-kicker { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: var(--acc); display: block; margin-bottom: 4px; }
.kd5-atelier-h1 { font-family: var(--hf); font-size: 32px; margin: 0 0 6px; }
.kd5-floating-banner p { font-size: 12px; color: var(--muted); max-width: 480px; margin: 0 auto 16px; }
.kd5-banner-stats { display: flex; justify-content: center; gap: 20px; font-size: 11px; font-weight: 700; color: var(--ink); }

.kd5-story-wrap { height: 860px; }
.kd5-story-wrap h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 6px; }
.kd5-story-wrap p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd5-styles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.kd5-style-card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 22px; position: relative; }
.kd5-style-icon { font-size: 24px; font-weight: 800; color: var(--acc); margin-bottom: 8px; }
.kd5-style-card h4 { font-size: 14px; margin: 0 0 6px; }
.kd5-style-card p { font-size: 11px; line-height: 1.6; color: var(--muted); margin: 0; }

.kd5-head { margin-bottom: 12px; }
.kd5-head h2 { font-family: var(--hf); font-size: 22px; margin: 0 0 3px; line-height: 1.2; }
.kd5-head p { font-size: 11px; color: var(--muted); margin: 0; }
.kd5-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.kd5-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  height: 410px;
  max-height: 410px;
  box-sizing: border-box;
}
.kd5-img {
  height: 185px;
  min-height: 185px;
  max-height: 185px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: var(--soft);
}
.kd5-tassel-badge { position: absolute; top: 10px; right: 10px; background: var(--dark); color: #fff; font-size: 8.5px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
.kd5-body { padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; box-sizing: border-box; }
.kd5-code { font-size: 8.5px; font-weight: 800; color: var(--acc); margin-bottom: 3px; }
.kd5-body h3 {
  font-family: var(--hf);
  font-size: 14.5px;
  margin: 0 0 4px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd5-body p {
  font-size: 10px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kd5-specs { display: flex; gap: 12px; font-size: 9.5px; color: var(--muted); margin-bottom: 6px; }
.kd5-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 6px; margin-top: auto; }
.kd5-price { font-size: 15px; font-weight: 800; color: var(--acc); line-height: 1; }
.kd5-moq { font-size: 9px; color: var(--muted); font-weight: 700; }

.kd5-tech-wrap { height: 860px; }
.kd5-tech-wrap h3 { font-family: var(--hf); font-size: 24px; margin: 0 0 20px; }
.kd5-finishing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.kd5-finishing-box { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 22px 18px; }
.kd5-finishing-box h4 { font-size: 14px; color: var(--acc); margin: 0 0 8px; }
.kd5-finishing-box p { font-size: 11px; line-height: 1.6; color: var(--muted); margin: 0; }

.kd5-closing-wrap { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd5-closing-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 40px; max-width: 580px; width: 100%; text-align: center; }
.kd5-closing-card h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 8px; }
.kd5-closing-card p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd5-contacts { display: flex; flex-direction: column; gap: 10px; text-align: left; background: var(--soft); padding: 18px; border-radius: 8px; }
.kd5-contacts div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd5-contacts span { color: var(--muted); }
.kd5-contacts b { color: var(--ink); }

/* -------------------------------------------------------------------------- */
/* kd-6: NATURAL VEGETABLE DYE HEXAGONAL FRAME & HORIZONTAL RIBBON CARDS     */
/* -------------------------------------------------------------------------- */
.kd6-eco-cover { height: 100%; display: flex; align-items: center; }
.kd6-leaf-border { border: 2px solid #52796f; background: #fdfbf7; padding: 36px; border-radius: 16px; text-align: center; width: 100%; }
.kd6-top-badge { color: #2d6a4f; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; margin-bottom: 8px; }
.kd6-h1 { font-family: var(--hf); font-size: 34px; color: #1b4332; margin: 0 0 6px; }
.kd6-sub { font-size: 12px; color: #40916c; font-weight: 600; margin-bottom: 22px; }
.kd6-hex-frame { width: 280px; height: 320px; margin: 0 auto 22px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: #2d6a4f; padding: 4px; }
.kd6-hex-inner { width: 100%; height: 100%; background-size: cover; background-position: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
.kd6-eco-manifesto p { font-size: 11.5px; line-height: 1.6; color: #2d6a4f; max-width: 480px; margin: 0 auto 18px; }
.kd6-badges-row { display: flex; justify-content: center; gap: 16px; font-size: 10.5px; font-weight: 700; color: #1b4332; }

.kd6-story-wrap { height: 860px; }
.kd6-story-wrap h2 { font-family: var(--hf); font-size: 26px; color: #1b4332; margin: 0 0 6px; }
.kd6-story-wrap p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd6-ingredients-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.kd6-ing-card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 20px; position: relative; }
.kd6-ing-color { width: 28px; height: 28px; border-radius: 50%; margin-bottom: 10px; }
.kd6-ing-card h4 { font-size: 14px; margin: 0 0 6px; color: #1b4332; }
.kd6-ing-card p { font-size: 11px; line-height: 1.6; color: var(--muted); margin: 0; }

.kd6-head { margin-bottom: 20px; }
.kd6-head h2 { font-family: var(--hf); font-size: 26px; color: #1b4332; margin: 0 0 4px; }
.kd6-head p { font-size: 11.5px; color: var(--muted); }
.kd6-ribbon-list { display: flex; flex-direction: column; gap: 14px; }
.kd6-ribbon-row { display: flex; gap: 16px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; align-items: center; }
.kd6-ribbon-thumb { width: 90px; height: 90px; border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; position: relative; }
.kd6-eco-tag { position: absolute; bottom: 4px; left: 4px; background: #2d6a4f; color: #fff; font-size: 7.5px; font-weight: 800; padding: 2px 6px; border-radius: 3px; }
.kd6-ribbon-details { flex: 1; }
.kd6-code { font-size: 9px; font-weight: 800; color: #2d6a4f; margin-bottom: 2px; }
.kd6-ribbon-details h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 4px; }
.kd6-ribbon-details p { font-size: 11px; color: var(--muted); margin: 0 0 6px; }
.kd6-pills { display: flex; gap: 10px; font-size: 9.5px; color: #40916c; font-weight: 600; }
.kd6-ribbon-action { text-align: right; flex-shrink: 0; padding-left: 12px; border-left: 1px solid var(--line); }
.kd6-price { font-size: 16px; font-weight: 800; color: #2d6a4f; display: block; }
.kd6-ribbon-action small { font-size: 9px; color: var(--muted); }

.kd6-tech-wrap { height: 860px; }
.kd6-tech-wrap h3 { font-family: var(--hf); font-size: 24px; color: #1b4332; margin: 0 0 20px; }
.kd6-eco-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.kd6-metric { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 20px 14px; text-align: center; }
.kd6-metric b { font-size: 28px; color: #2d6a4f; display: block; margin-bottom: 4px; }
.kd6-metric span { font-size: 10px; font-weight: 700; color: var(--ink); }
.kd6-eco-note { font-size: 11px; line-height: 1.6; color: var(--muted); }

.kd6-closing-wrap { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd6-closing-box { border: 2px solid #52796f; background: #fff; padding: 40px; border-radius: 16px; text-align: center; max-width: 580px; width: 100%; }
.kd6-closing-box h2 { font-family: var(--hf); font-size: 26px; color: #1b4332; margin: 0 0 8px; }
.kd6-closing-box p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd6-contact-grid { display: flex; flex-direction: column; gap: 10px; text-align: left; background: #edf5ef; padding: 18px; border-radius: 8px; }
.kd6-contact-grid div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd6-contact-grid span { color: #2d6a4f; font-weight: 600; }
.kd6-contact-grid b { color: var(--ink); }

/* -------------------------------------------------------------------------- */
/* kd-7: SAPPHIRE VELVET ROYAL COUTURE MASTERPIECE 2-PER-PAGE SPREAD          */
/* -------------------------------------------------------------------------- */
.kd7-noir-cover { height: 100%; display: flex; align-items: center; justify-content: center; position: relative; background: radial-gradient(circle at center, #1e1b2e 0%, #0c0a14 100%); margin: -44px; padding: 44px; box-sizing: border-box; }
.kd7-stars-grid { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(234,179,8,0.15) 1px, transparent 1px); background-size: 16px 16px; }
.kd7-couture-content { position: relative; text-align: center; max-width: 620px; width: 100%; border: 1px solid rgba(234,179,8,0.4); padding: 44px; border-radius: 18px; background: rgba(12,10,20,0.85); box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
.kd7-crest { font-size: 12px; font-weight: 800; letter-spacing: 0.25em; color: #eab308; margin-bottom: 8px; }
.kd7-gold-title { font-family: var(--hf); font-size: 38px; color: #ffffff; margin: 0 0 6px; letter-spacing: 0.08em; }
.kd7-gold-line { width: 80px; height: 2px; background: #eab308; margin: 0 auto 12px; }
.kd7-tagline { font-size: 12px; color: #d4d4d8; font-weight: 500; margin-bottom: 24px; }
.kd7-hero-window { width: 340px; height: 380px; border-radius: 12px; margin: 0 auto 24px; background-size: cover; background-position: center; border: 2px solid #eab308; position: relative; }
.kd7-gold-border-corner { position: absolute; width: 14px; height: 14px; border-color: #eab308; border-style: solid; }
.kd7-gold-border-corner.tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; }
.kd7-gold-border-corner.tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; }
.kd7-gold-border-corner.bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; }
.kd7-gold-border-corner.br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; }
.kd7-provenance { font-size: 9.5px; letter-spacing: 0.16em; color: #a1a1aa; font-weight: 700; }

.kd7-noir-story { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 26px; height: 860px; align-items: center; color: #f4f4f5; }
.kd7-gold-badge { font-size: 9.5px; font-weight: 800; letter-spacing: 0.2em; color: #eab308; }
.kd7-story-left h2 { font-family: var(--hf); font-size: 30px; margin: 8px 0 16px; color: #fff; }
.kd7-story-left p { font-size: 12px; line-height: 1.7; color: #d4d4d8; margin-bottom: 14px; }
.kd7-hallmark-box { background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.3); border-radius: 10px; padding: 18px; margin-top: 20px; }
.kd7-hallmark-box h4 { font-size: 13px; color: #eab308; margin: 0 0 6px; }
.kd7-hallmark-box p { font-size: 11px; color: #e4e4e7; margin: 0; }
.kd7-story-right { height: 740px; border-radius: 14px; background-size: cover; background-position: center; border: 2px solid #eab308; position: relative; }
.kd7-portrait-caption { position: absolute; bottom: 16px; left: 16px; right: 16px; background: rgba(0,0,0,0.85); color: #eab308; padding: 8px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; text-align: center; }

.kd7-noir-head { margin-bottom: 20px; }
.kd7-noir-head h2 { font-family: var(--hf); font-size: 26px; color: #fff; margin: 0 0 4px; }
.kd7-noir-head p { font-size: 11.5px; color: #a1a1aa; }
.kd7-couture-grid { display: flex; flex-direction: column; gap: 24px; }
.kd7-couture-card { display: grid; grid-template-columns: 280px 1fr; background: rgba(255,255,255,0.04); border: 1px solid rgba(234,179,8,0.35); border-radius: 14px; overflow: hidden; }
.kd7-couture-img { height: 340px; background-size: cover; background-position: center; position: relative; }
.kd7-edition-chip { position: absolute; top: 12px; left: 12px; background: #eab308; color: #000; font-size: 8.5px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
.kd7-couture-body { padding: 24px 28px; display: flex; flex-direction: column; justify-content: space-between; color: #f4f4f5; }
.kd7-meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.kd7-code { font-size: 10px; font-weight: 800; color: #eab308; }
.kd7-khat-tag { font-size: 9px; background: rgba(234,179,8,0.15); color: #eab308; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.kd7-couture-body h3 { font-family: var(--hf); font-size: 20px; color: #fff; margin: 0 0 6px; }
.kd7-couture-body p { font-size: 11.5px; line-height: 1.6; color: #a1a1aa; margin: 0 0 14px; }
.kd7-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10.5px; color: #d4d4d8; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin-bottom: 14px; }
.kd7-specs-grid span { color: #a1a1aa; }
.kd7-couture-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
.kd7-price { font-size: 18px; font-weight: 800; color: #eab308; }
.kd7-bespoke-tag { font-size: 10px; color: #a1a1aa; font-weight: 700; }

.kd7-noir-tech { height: 860px; color: #f4f4f5; }
.kd7-noir-tech h3 { font-family: var(--hf); font-size: 24px; color: #fff; margin: 0 0 20px; }
.kd7-tech-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.kd7-spec-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(234,179,8,0.3); border-radius: 12px; padding: 22px; }
.kd7-spec-panel h4 { font-size: 14px; color: #eab308; margin: 0 0 14px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
.kd7-spec-item { display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 10px; }
.kd7-spec-item span { color: #a1a1aa; }
.kd7-spec-item b { color: #fff; }
.kd7-hallmark-badge { background: rgba(234,179,8,0.1); border: 1px solid #eab308; border-radius: 10px; padding: 16px; text-align: center; color: #eab308; font-weight: 700; font-size: 11.5px; }

.kd7-noir-closing { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd7-vip-box { border: 1px solid rgba(234,179,8,0.5); background: rgba(18,16,25,0.9); padding: 44px; border-radius: 16px; text-align: center; max-width: 600px; width: 100%; color: #fff; box-shadow: 0 14px 36px rgba(0,0,0,0.5); }
.kd7-crest-small { font-size: 28px; margin-bottom: 8px; }
.kd7-vip-box h2 { font-family: var(--hf); font-size: 26px; color: #fff; margin: 0 0 8px; }
.kd7-vip-box p { font-size: 12px; color: #a1a1aa; margin-bottom: 24px; }
.kd7-vip-contacts { display: flex; flex-direction: column; gap: 10px; text-align: left; background: rgba(255,255,255,0.05); padding: 18px; border-radius: 8px; margin-bottom: 20px; }
.kd7-vip-contacts div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd7-vip-contacts span { color: #eab308; }
.kd7-vip-contacts b { color: #fff; }
.kd7-courier-note { font-size: 10.5px; color: #d4d4d8; font-style: italic; }

/* -------------------------------------------------------------------------- */
/* kd-8: KAITHUN WEAVER GUILD OFFICIAL GI MAP DOSSIER & EXPORT TABLE          */
/* -------------------------------------------------------------------------- */
.kd8-dossier-cover { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.kd8-govt-bar { background: #452011; color: #fff; display: flex; justify-content: space-between; font-size: 9px; font-weight: 800; padding: 8px 14px; border-radius: 6px 6px 0 0; letter-spacing: 0.1em; }
.kd8-dossier-split { display: grid; grid-template-columns: 1.2fr 0.8fr; border: 2px solid #452011; border-top: none; background: #fffdf9; border-radius: 0 0 12px 12px; padding: 28px; gap: 24px; align-items: center; box-shadow: 0 10px 24px rgba(0,0,0,0.06); }
.kd8-emblem { font-size: 28px; margin-bottom: 6px; }
.kd8-doc-kicker { font-size: 10px; font-weight: 800; letter-spacing: 0.16em; color: #9a3412; }
.kd8-h1 { font-family: var(--hf); font-size: 30px; color: #261a14; margin: 4px 0 10px; }
.kd8-doc-desc { font-size: 11.5px; line-height: 1.6; color: #665043; margin-bottom: 18px; }
.kd8-meta-table { display: flex; flex-direction: column; gap: 6px; background: #f5ebe1; padding: 14px; border-radius: 8px; font-size: 11px; }
.kd8-meta-table div { display: flex; justify-content: space-between; }
.kd8-meta-table span { color: #9a3412; font-weight: 600; }
.kd8-meta-table b { color: #261a14; }
.kd8-dossier-right { height: 380px; border-radius: 8px; background-size: cover; background-position: center; border: 2px solid #9a3412; position: relative; }
.kd8-map-stamp { position: absolute; bottom: 12px; right: 12px; background: #9a3412; color: #fff; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 4px; }

.kd8-dossier-story { height: 860px; }
.kd8-dossier-story h2 { font-family: var(--hf); font-size: 26px; color: #261a14; margin: 0 0 6px; }
.kd8-dossier-story p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd8-audit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.kd8-audit-card { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 20px 16px; text-align: center; }
.kd8-audit-icon { font-size: 24px; margin-bottom: 8px; }
.kd8-audit-card h4 { font-size: 13px; color: #9a3412; margin: 0 0 6px; }
.kd8-audit-card p { font-size: 11px; line-height: 1.5; color: var(--muted); margin: 0; }

.kd8-head { margin-bottom: 20px; }
.kd8-head h2 { font-family: var(--hf); font-size: 26px; color: #261a14; margin: 0 0 4px; }
.kd8-head p { font-size: 11.5px; color: var(--muted); }
.kd8-table-wrap { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.kd8-export-tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
.kd8-export-tbl th { background: #452011; color: #fff; padding: 12px 14px; text-align: left; font-size: 10px; letter-spacing: 0.1em; }
.kd8-export-tbl td { padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.kd8-tbl-thumb { width: 50px; height: 50px; border-radius: 6px; background-size: cover; background-position: center; border: 1px solid var(--line); }
.kd8-export-tbl td b { display: block; font-size: 12px; color: var(--ink); }
.kd8-export-tbl td small { font-size: 9.5px; color: var(--muted); display: block; }
.kd8-price-pill { background: var(--soft); color: var(--acc); font-weight: 800; padding: 4px 8px; border-radius: 4px; font-size: 11.5px; }

.kd8-dossier-tech { height: 860px; }
.kd8-dossier-tech h3 { font-family: var(--hf); font-size: 24px; color: #261a14; margin: 0 0 18px; }
.kd8-spec-tbl { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; font-size: 11.5px; }
.kd8-spec-tbl td { padding: 14px 18px; border-bottom: 1px solid var(--line); }
.kd8-spec-tbl tr td:first-child { font-weight: 700; color: #9a3412; width: 35%; background: var(--soft); }

.kd8-dossier-closing { height: 100%; display: flex; align-items: center; justify-content: center; }
.kd8-govt-panel { border: 2px solid #452011; background: #fffdf9; padding: 40px; border-radius: 14px; text-align: center; max-width: 600px; width: 100%; }
.kd8-govt-panel h2 { font-family: var(--hf); font-size: 24px; color: #261a14; margin: 0 0 8px; }
.kd8-govt-panel p { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
.kd8-trade-grid { display: flex; flex-direction: column; gap: 10px; text-align: left; background: #f5ebe1; padding: 18px; border-radius: 8px; }
.kd8-trade-grid div { display: flex; justify-content: space-between; font-size: 11.5px; }
.kd8-trade-grid span { color: #9a3412; font-weight: 600; }
.kd8-trade-grid b { color: #261a14; }


/* ========================================================================== */
/* PARAMPARA THREADS WHOLESALE SUITE CSS (Elevated B2B Powerloom Lookbook)    */
/* ========================================================================== */
.parampara-pg {
  background-color: #fdfbf7 !important;
  color: #221610;
  font-family: 'Inter', sans-serif;
}
.parampara-pg.parampara-dark-theme {
  background-color: #240c14 !important;
  color: #ffffff;
}

/* Parampara Cover */
.parampara-cover-wrap {
  width: 100%; height: 100%;
  padding: 36px; box-sizing: border-box;
}
.parampara-cover-backdrop {
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
  height: 100%; align-items: stretch;
}
.parampara-hero-window {
  position: relative; border-radius: 16px; overflow: hidden;
  border: 2px solid #c5a059; box-shadow: 0 16px 36px rgba(0,0,0,0.35);
}
.parampara-hero-art {
  width: 100%; height: 100%; background-size: cover; background-position: center top; position: relative;
}
.parampara-gold-mesh-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(36,12,20,0.2) 0%, rgba(36,12,20,0.7) 100%);
}
.parampara-hero-seal {
  position: absolute; bottom: 24px; left: 24px;
  background: rgba(36,12,20,0.88); border: 1.5px solid #c5a059;
  padding: 10px 16px; border-radius: 8px; backdrop-filter: blur(8px);
}
.parampara-hero-seal span {
  font-size: 10px; letter-spacing: 0.2em; color: #c5a059; display: block; font-weight: 700;
}
.parampara-hero-seal strong {
  font-size: 12px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;
}
.parampara-cover-card {
  display: flex; flex-direction: column; justify-content: space-between;
  background: rgba(255,255,255,0.06); border: 1.5px solid rgba(197,160,89,0.35);
  border-radius: 16px; padding: 34px; backdrop-filter: blur(10px);
}
.parampara-crest {
  display: flex; align-items: center; gap: 12px;
}
.parampara-crest-svg {
  width: 44px; height: 44px;
}
.parampara-crest-label {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #c5a059; text-transform: uppercase;
}
.parampara-logo-title {
  font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700;
  color: #fdfbf7; margin: 16px 0 6px; line-height: 1.1; letter-spacing: 0.08em;
}
.parampara-edition-badge {
  display: inline-block; font-size: 11px; font-weight: 800;
  letter-spacing: 0.25em; color: #c5a059; text-transform: uppercase;
  padding: 4px 0 14px; border-bottom: 1px solid rgba(197,160,89,0.3);
}
.parampara-quote-card {
  background: rgba(0,0,0,0.25); border-left: 3px solid #c5a059;
  padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 18px 0;
}
.parampara-quote-card p {
  font-size: 12px; line-height: 1.6; color: #e5d7c0; margin: 0; font-style: italic;
}
.parampara-advantage-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;
}
.parampara-adv-pill {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(197,160,89,0.25);
  padding: 10px 14px; border-radius: 8px;
}
.parampara-adv-pill b {
  display: block; font-size: 13px; color: #c5a059; font-weight: 700;
}
.parampara-adv-pill small {
  font-size: 10.5px; color: #d0c0b4;
}
.parampara-bottom-assurance {
  display: flex; justify-content: space-between; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.15em; color: #c5a059;
  padding-top: 14px; border-top: 1px solid rgba(197,160,89,0.3); text-transform: uppercase;
}

/* Parampara Story Page */
.parampara-page-body {
  position: absolute; inset: 40px;
  display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;
}
.parampara-sec-header {
  display: flex; justify-content: space-between; font-size: 10px;
  font-weight: 800; letter-spacing: 0.25em; color: #c5a059;
  text-transform: uppercase; border-bottom: 1px solid #e5d5be; padding-bottom: 8px; margin-bottom: 16px;
}
.parampara-story-banner {
  background: #f7f0e4; border-left: 4px solid #c5a059;
  padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 18px;
}
.parampara-story-banner h2 {
  font-family: 'Playfair Display', serif; font-size: 24px; color: #221610; margin: 0 0 4px; font-style: italic;
}
.parampara-story-banner p {
  font-size: 12px; color: #635348; margin: 0; font-weight: 500;
}
.parampara-story-layout {
  display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; flex: 1; align-items: stretch;
}
.parampara-lead-p {
  font-size: 12.5px; line-height: 1.65; color: #423028; margin: 0 0 18px;
}
.parampara-feature-cards {
  display: flex; flex-direction: column; gap: 12px;
}
.parampara-fcard {
  display: flex; gap: 12px; align-items: flex-start;
  background: #ffffff; border: 1px solid #e5d5be; padding: 12px 14px;
  border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.fcard-icon {
  font-size: 20px; line-height: 1;
}
.fcard-body strong {
  display: block; font-size: 12px; color: #221610; font-weight: 700; margin-bottom: 2px;
}
.fcard-body p {
  margin: 0; font-size: 11px; color: #635348; line-height: 1.45;
}
.parampara-story-gallery {
  display: flex; flex-direction: column; gap: 14px; height: 100%;
}
.parampara-frame-loom {
  flex: 1; background-size: cover; background-position: center;
  border-radius: 12px; border: 1.5px solid #c5a059; position: relative;
  overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06); min-height: 170px;
}
.loom-label {
  position: absolute; bottom: 10px; left: 10px; right: 10px;
  background: rgba(34,22,16,0.85); color: #ffffff; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.1em; padding: 6px 10px;
  border-radius: 6px; text-transform: uppercase; text-align: center;
}
.parampara-pullquote {
  text-align: center; font-family: 'Playfair Display', serif;
  font-size: 15px; color: #6e503f; padding: 10px 0;
  border-top: 1px solid #e5d5be; border-bottom: 1px solid #e5d5be; margin: 12px 0;
}
.parampara-page-foot {
  display: flex; justify-content: space-between; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.2em; color: #8c7662; text-transform: uppercase;
}

/* Parampara Saree Product Layout (Split Showcase with Assortment Palette) */
.parampara-prod-top-bar {
  display: flex; justify-content: space-between; align-items: flex-end;
  border-bottom: 1.5px solid #e5d5be; padding-bottom: 10px; margin-bottom: 16px;
}
.parampara-sub-cat {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #c5a059;
  text-transform: uppercase; display: block; margin-bottom: 2px;
}
.parampara-prod-h2 {
  font-family: 'Playfair Display', serif; font-size: 26px; color: #221610;
  margin: 0; font-weight: 700; line-height: 1.15;
}
.parampara-top-code {
  text-align: right;
}
.design-label {
  font-size: 9px; font-weight: 800; letter-spacing: 0.2em; color: #8c7662;
  text-transform: uppercase; display: block;
}
.parampara-top-code strong {
  font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; color: #240c14; letter-spacing: 0.05em;
}
.parampara-spread-grid {
  display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: stretch;
}
.parampara-portrait-frame {
  height: 480px; background-size: cover; background-position: center top;
  border: 2.5px solid #c5a059; border-radius: 12px; position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08); overflow: hidden;
}
.parampara-corner-flourish {
  position: absolute; width: 24px; height: 24px; border: 2px solid #c5a059;
}
.parampara-corner-flourish.tl {
  top: 10px; left: 10px; border-right: none; border-bottom: none;
}
.parampara-corner-flourish.br {
  bottom: 10px; right: 10px; border-left: none; border-top: none;
}
.parampara-view-tag {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  background: rgba(34,22,16,0.85); color: #fff; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.12em; padding: 6px 12px;
  border-radius: 6px; text-align: center; text-transform: uppercase;
}
.parampara-right-details {
  display: flex; flex-direction: column; justify-content: space-between;
}
.parampara-macro-card {
  height: 180px; background-size: cover; background-position: center;
  border-radius: 10px; border: 1.5px solid #e5d5be; position: relative;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04); overflow: hidden;
}
.macro-label {
  position: absolute; bottom: 8px; left: 8px; right: 8px;
  background: rgba(255,255,255,0.92); color: #221610; font-size: 9px;
  font-weight: 700; padding: 5px 10px; border-radius: 4px;
  text-transform: uppercase; letter-spacing: 0.1em;
}
.parampara-tiers-card {
  background: #ffffff; border: 1.5px solid #c5a059; border-radius: 12px;
  padding: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}
.tiers-header {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 10.5px; font-weight: 800; letter-spacing: 0.2em; color: #240c14;
  text-transform: uppercase; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #f0e6d6;
}
.tiers-header small {
  font-size: 9.5px; color: #8c7662; font-weight: 600; text-transform: none;
}
.tiers-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}
.tier-box {
  border: 1px solid #e5d5be; border-radius: 8px; padding: 10px 8px;
  text-align: center; position: relative; background: #faf7f2;
}
.tier-box.highlight {
  border: 2px solid #c5a059; background: #fffdf9; box-shadow: 0 4px 12px rgba(197,160,89,0.2);
}
.rec-badge {
  position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
  background: #c5a059; color: #fff; font-size: 8px; font-weight: 800;
  letter-spacing: 0.1em; padding: 2px 6px; border-radius: 4px; white-space: nowrap;
}
.tier-name {
  display: block; font-size: 9.5px; font-weight: 700; color: #635348;
  margin-bottom: 4px; text-transform: uppercase;
}
.tier-val {
  display: block; font-size: 20px; font-weight: 800; color: #240c14; letter-spacing: -0.02em;
}
.tier-box small {
  display: block; font-size: 9px; color: #8c7662; margin-top: 2px;
}
.parampara-color-assortment {
  background: #fdfbf7; border: 1px solid #e5d5be; border-radius: 10px; padding: 12px 14px;
}
.color-head {
  font-size: 9.5px; font-weight: 800; letter-spacing: 0.18em; color: #635348;
  text-transform: uppercase; margin-bottom: 8px; text-align: center;
}
.color-swatches {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; text-align: center;
}
.c-swatch span {
  display: block; width: 28px; height: 28px; border-radius: 50%;
  margin: 0 auto 4px; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}
.c-swatch small {
  font-size: 9px; font-weight: 600; color: #423028;
}
.parampara-tech-footer {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
  background: #f7f0e4; border: 1px solid #e5d5be; border-radius: 10px;
  padding: 12px 16px; margin: 16px 0 10px;
}
.tech-item b {
  display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.15em;
  color: #8c7662; text-transform: uppercase; margin-bottom: 2px;
}
.tech-item p {
  margin: 0; font-size: 10.5px; color: #221610; line-height: 1.35; font-weight: 500;
}

/* Parampara Wholesale Enquiry / Trade Agreement Desk */
.parampara-trade-desk-card {
  background: rgba(36, 12, 20, 0.92); border: 2px solid #c5a059;
  border-radius: 18px; padding: 36px 40px; box-shadow: 0 20px 48px rgba(0,0,0,0.4);
  display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;
}
.trade-desk-header {
  text-align: center; margin-bottom: 20px;
}
.trade-crest {
  font-size: 32px; margin-bottom: 6px;
}
.trade-desk-header h2 {
  font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700;
  color: #fdfbf7; margin: 0 0 6px; letter-spacing: 0.05em;
}
.trade-desk-header p {
  font-size: 12.5px; color: #d0c0b4; margin: 0;
}
.trade-credential-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px;
}
.trade-cred-box {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(197,160,89,0.3);
  border-radius: 10px; padding: 14px 18px;
}
.cred-tag {
  font-size: 9px; font-weight: 800; letter-spacing: 0.2em; color: #c5a059;
  text-transform: uppercase; display: block; margin-bottom: 4px;
}
.trade-cred-box strong {
  display: block; font-size: 13.5px; color: #ffffff; font-weight: 700; margin-bottom: 2px;
}
.trade-cred-box p {
  margin: 0; font-size: 11px; color: #d0c0b4; line-height: 1.4;
}
.trade-steps-bar {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(197,160,89,0.25);
  border-radius: 10px; padding: 12px 18px; margin-bottom: 22px;
}
.trade-step {
  text-align: center; flex: 1;
}
.trade-step b {
  display: block; font-size: 11px; color: #c5a059; font-weight: 700;
}
.trade-step small {
  font-size: 9.5px; color: #d0c0b4;
}
.trade-arrow {
  color: #c5a059; font-size: 14px; padding: 0 6px;
}
.trade-qr-section {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(197,160,89,0.3);
  border-radius: 12px; padding: 18px 24px;
}
.trade-qr-content h3 {
  font-family: 'Playfair Display', serif; font-size: 18px; color: #fdfbf7; margin: 0 0 4px;
}
.trade-qr-content p {
  font-size: 11px; color: #d0c0b4; margin: 0; max-width: 440px; line-height: 1.5;
}
.trade-qr-holder {
  text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.trade-qr-holder .trade-qr-img {
  width: 85px; height: 85px; border-radius: 6px; background: #fff; padding: 4px;
}
.trade-qr-holder .trade-qr-box {
  width: 75px; height: 75px; border-radius: 8px; background: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 32px;
}
.trade-qr-holder b {
  font-size: 9.5px; color: #c5a059; letter-spacing: 0.1em; text-transform: uppercase;
}
.trade-closing-tag {
  text-align: center; border-top: 1px solid rgba(197,160,89,0.25);
  padding-top: 14px; font-size: 9px; letter-spacing: 0.2em; color: #a89486; text-transform: uppercase;
}

/* ========================================================================== */
/* SILKEN SAGA CELEBRATION & WEDDING LOOKBOOK (Editorial Monograph Suite)      */
/* ========================================================================== */
.silken-pg {
  background-color: #fcf7f5 !important;
  color: #2a0e1b;
  font-family: 'Inter', sans-serif;
}
.silken-page-body {
  position: absolute; inset: 40px;
  box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;
}

/* Silken Cover */
.silken-cover-wrap {
  width: 100%; height: 100%; position: relative; background-size: cover;
  background-position: center; display: flex; flex-direction: column;
  justify-content: space-between; padding: 40px; box-sizing: border-box;
}
.silken-cover-gradient {
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, rgba(42,14,27,0.3) 0%, rgba(42,14,27,0.82) 100%);
}
.silken-top-brand-band {
  position: relative; z-index: 10; display: flex; justify-content: space-between;
  font-size: 10px; font-weight: 800; letter-spacing: 0.3em; color: #ffd700;
  text-transform: uppercase; border-bottom: 1px solid rgba(255,215,0,0.35); padding-bottom: 10px;
}
.silken-glass-monograph-card {
  position: relative; z-index: 10;
  background: rgba(255,255,255,0.18); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,255,255,0.4); border-radius: 24px;
  padding: 44px 56px; text-align: center; max-width: 650px; margin: auto;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}
.silken-crest-motif {
  font-size: 24px; color: #ffd700; margin-bottom: 8px;
  display: flex; justify-content: center; align-items: center; gap: 12px;
}
.silken-title {
  font-family: 'Playfair Display', serif; font-size: 54px; font-weight: 700;
  color: #ffffff; margin: 0 0 6px; letter-spacing: 0.08em; text-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
.silken-edition-sub {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px;
  color: #fce4ec; margin-bottom: 18px;
}
.silken-card-divider {
  width: 80px; height: 1.5px; background: #ffd700; margin: 0 auto 18px;
}
.silken-cover-poetry {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 14.5px;
  line-height: 1.6; color: #ffffff; margin: 0 0 24px; max-width: 480px;
  margin-left: auto; margin-right: auto;
}
.silken-trousseau-chips {
  display: flex; justify-content: center; gap: 14px; font-size: 9.5px;
  font-weight: 800; letter-spacing: 0.2em; color: #ffd700; text-transform: uppercase;
}
.silken-cover-bottom-bar {
  position: relative; z-index: 10; text-align: center; font-size: 10px;
  font-weight: 700; letter-spacing: 0.2em; color: #ffffff; text-transform: uppercase;
  border-top: 1px solid rgba(255,255,255,0.25); padding-top: 10px;
}

/* Silken Story Page */
.silken-story-page {
  display: grid; grid-template-columns: 360px 1fr; gap: 36px; align-items: stretch; height: 100%;
}
.silken-story-left-col {
  height: 100%;
}
.silken-arched-portrait {
  width: 100%; height: 100%; border-radius: 180px 180px 20px 20px;
  background-size: cover; background-position: center top;
  border: 3px solid #c5a059; box-shadow: 0 14px 36px rgba(42,14,27,0.18);
  position: relative; overflow: hidden;
}
.silken-portrait-tag {
  position: absolute; bottom: 18px; left: 16px; right: 16px;
  background: rgba(42,14,27,0.85); color: #fff; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.15em; padding: 7px 12px;
  border-radius: 6px; text-align: center; text-transform: uppercase;
}
.silken-story-right-col {
  display: flex; flex-direction: column; justify-content: space-between; padding: 10px 0;
}
.silken-chap-header {
  display: flex; align-items: center; gap: 12px; font-size: 10px;
  font-weight: 800; letter-spacing: 0.25em; color: #800020; text-transform: uppercase;
}
.chap-line {
  flex: 1; height: 1px; background: #e5c583;
}
.silken-serif-h1 {
  font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700;
  color: #2a0e1b; margin: 12px 0 6px; line-height: 1.15;
}
.silken-hearts-deco {
  font-size: 18px; color: #c5a059; margin-bottom: 16px;
}
.silken-story-body {
  font-size: 12.5px; line-height: 1.7; color: #4a2835;
}
.dropcap-p {
  position: relative;
}
.dropcap {
  float: left; font-family: 'Playfair Display', serif; font-size: 46px;
  line-height: 0.8; font-weight: 700; color: #800020; padding-right: 10px; padding-top: 4px;
}
.story-emp {
  font-weight: 600; color: #2a0e1b; margin: 12px 0;
}
.story-muted {
  color: #6d4b58; font-size: 12px;
}
.silken-founder-sign {
  border-top: 1px solid #ebd9d2; padding-top: 16px; margin-top: 20px;
}
.sign-label {
  font-size: 11px; font-style: italic; color: #800020; margin-bottom: 2px;
}
.sign-name {
  font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;
  color: #2a0e1b; font-style: italic;
}
.silken-founder-sign small {
  font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: #c5a059;
  text-transform: uppercase; display: block; margin-top: 2px;
}

/* Silken Wedding Collection */
.silken-collection-page {
  display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; height: 100%;
}
.silken-coll-badge {
  display: inline-block; font-size: 9.5px; font-weight: 800; letter-spacing: 0.25em;
  color: #800020; background: #faeae6; padding: 4px 10px; border-radius: 4px;
  text-transform: uppercase; margin-bottom: 10px;
}
.silken-coll-h1 {
  font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700;
  color: #2a0e1b; margin: 0 0 14px; line-height: 1.15;
}
.silken-gold-rule {
  width: 60px; height: 2px; background: #c5a059; margin-bottom: 16px;
}
.silken-coll-quote {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 14.5px;
  line-height: 1.6; color: #5c3545; margin-bottom: 24px;
}
.silken-coll-highlights {
  display: flex; flex-direction: column; gap: 14px;
}
.coll-point b {
  display: block; font-size: 12.5px; color: #800020; font-weight: 700; margin-bottom: 2px;
}
.coll-point p {
  margin: 0; font-size: 11.5px; color: #52313e; line-height: 1.5;
}
.silken-coll-right-grid {
  display: flex; flex-direction: column; gap: 16px;
}
.silken-polaroid-frame {
  background: #ffffff; padding: 10px 10px 14px; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(42,14,27,0.1); border: 1px solid #ebd9d2;
}
.silken-polaroid-frame.p1 { transform: rotate(-2deg); }
.silken-polaroid-frame.p2 { transform: rotate(2deg); margin-left: 24px; }
.silken-polaroid-frame.p3 { transform: rotate(-1deg); }
.polaroid-img {
  height: 160px; background-size: cover; background-position: center top; border-radius: 6px;
}
.polaroid-cap {
  display: block; font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 12px; text-align: center; color: #2a0e1b; margin-top: 8px;
}

/* Silken Services */
.silken-services-page {
  height: 100%; display: flex; flex-direction: column; justify-content: space-between;
}
.silken-serv-header {
  text-align: center; margin-bottom: 24px;
}
.serv-tag {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #800020;
  text-transform: uppercase; display: block; margin-bottom: 6px;
}
.silken-serv-header h2 {
  font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #2a0e1b; margin: 0 0 6px;
}
.silken-serv-header p {
  font-size: 12.5px; color: #6d4b58; margin: 0;
}
.silken-serv-layout {
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: center; flex: 1;
}
.silken-serv-grid {
  display: flex; flex-direction: column; gap: 14px;
}
.serv-card {
  display: flex; gap: 14px; align-items: flex-start;
  background: #ffffff; border: 1px solid #ebd9d2; padding: 14px 18px;
  border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);
}
.serv-icon {
  font-size: 24px; line-height: 1;
}
.serv-text strong {
  display: block; font-size: 13px; color: #2a0e1b; font-weight: 700; margin-bottom: 3px;
}
.serv-text p {
  margin: 0; font-size: 11px; color: #5c3545; line-height: 1.45;
}
.silken-serv-visual {
  display: flex; justify-content: center; align-items: center;
}
.silken-circle-frame {
  width: 260px; height: 260px; border-radius: 50%;
  border: 4px solid #ffffff; box-shadow: 0 12px 32px rgba(42,14,27,0.18);
  position: relative; overflow: hidden;
}
.silken-circle-photo {
  width: 100%; height: 100%; background-size: cover; background-position: center;
}
.silken-seal-gold {
  position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
  background: #800020; color: #ffd700; font-size: 9px; font-weight: 800;
  letter-spacing: 0.15em; padding: 5px 14px; border-radius: 20px;
  border: 1.5px solid #ffd700; white-space: nowrap;
}
.silken-bottom-maroon-bar {
  background: #800020; color: #ffffff; padding: 14px 24px; border-radius: 10px;
  display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
}

/* Silken Torn Paper / Curated Retrospective Moodboard */
.silken-mosaic-page {
  height: 100%; display: flex; flex-direction: column; justify-content: space-between;
}
.silken-mosaic-header {
  text-align: center; margin-bottom: 18px;
}
.mosaic-tag {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #800020;
  text-transform: uppercase; display: block; margin-bottom: 4px;
}
.silken-mosaic-header h2 {
  font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #2a0e1b; margin: 0 0 4px;
}
.silken-mosaic-header p {
  font-size: 12px; color: #6d4b58; margin: 0;
}
.silken-mosaic-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; flex: 1;
}
.mosaic-card {
  background: #ffffff; border: 1px solid #ebd9d2; border-radius: 10px;
  overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  display: flex; flex-direction: column;
}
.mosaic-photo {
  height: 190px; background-size: cover; background-position: center top; position: relative;
}
.mosaic-badge {
  position: absolute; top: 8px; left: 8px;
  background: rgba(42,14,27,0.8); color: #fff; font-size: 8.5px;
  font-weight: 800; letter-spacing: 0.1em; padding: 3px 6px; border-radius: 4px;
}
.mosaic-meta {
  padding: 10px; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;
}
.mosaic-meta h4 {
  font-family: 'Playfair Display', serif; font-size: 13px; margin: 0 0 3px; color: #2a0e1b;
}
.mosaic-price {
  font-size: 12px; font-weight: 800; color: #800020;
}
.silken-mosaic-footer-quote {
  text-align: center; font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 13px; color: #6d4b58; padding-top: 12px; border-top: 1px solid #ebd9d2;
}

/* Silken Why Buyers Choose Us */
.silken-why-buyers-page {
  height: 100%; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 32px; align-items: center;
}
.why-tag {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #800020;
  text-transform: uppercase; display: block; margin-bottom: 6px;
}
.silken-why-h1 {
  font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700;
  color: #2a0e1b; margin: 0 0 10px; line-height: 1.15;
}
.why-divider {
  width: 50px; height: 2px; background: #c5a059; margin-bottom: 16px;
}
.why-editorial-text p {
  font-size: 12px; line-height: 1.65; color: #52313e; margin: 0 0 12px;
}
.why-highlight {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 14.5px; font-weight: 700; color: #800020;
}
.why-three-pillars {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px;
}
.pillar-box {
  background: #ffffff; border: 1px solid #ebd9d2; border-radius: 8px; padding: 10px; text-align: center;
}
.pillar-box b {
  display: block; font-size: 11px; color: #800020; margin-bottom: 4px;
}
.pillar-box p {
  margin: 0; font-size: 10px; color: #6d4b58; line-height: 1.35;
}
.silken-why-right-quote-card {
  background: #ffffff; border: 2px solid #c5a059; border-radius: 16px;
  padding: 28px; box-shadow: 0 12px 32px rgba(42,14,27,0.08); position: relative;
}
.quote-stars {
  color: #f59e0b; font-size: 16px; margin-bottom: 10px;
}
.quote-mark {
  font-family: 'Playfair Display', serif; font-size: 48px; color: #ebd9d2; line-height: 0.6; margin-bottom: 10px;
}
.quote-text {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px;
  line-height: 1.7; color: #2a0e1b; margin: 0 0 18px;
}
.quote-author strong {
  display: block; font-size: 13px; color: #800020; font-weight: 700;
}
.quote-author small {
  font-size: 10.5px; color: #7a5060;
}

/* Silken Scrapbook & Feedback */
.silken-scrapbook-page {
  height: 100%; display: flex; flex-direction: column; justify-content: space-between;
}
.silken-scrapbook-title-box {
  text-align: center; margin-bottom: 16px;
}
.scrap-tag {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #800020;
  text-transform: uppercase; display: block; margin-bottom: 4px;
}
.silken-scrap-h1 {
  font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700;
  color: #2a0e1b; margin: 0 0 4px;
}
.scrap-subscript {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: #c5a059; margin: 0;
}
.silken-reviews-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 16px 0;
}
.silken-review-card {
  background: #ffffff; border: 1px solid #ebd9d2; border-radius: 10px;
  padding: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.silken-review-card .stars {
  color: #f59e0b; font-size: 12px; margin-bottom: 6px;
}
.silken-review-card p {
  font-size: 11px; line-height: 1.5; color: #42202c; margin: 0 0 8px; font-style: italic;
}
.silken-review-card strong {
  display: block; font-size: 11px; color: #800020;
}
.silken-review-card small {
  font-size: 9.5px; color: #7a5060;
}
.silken-polaroid-row {
  display: flex; justify-content: center; gap: 24px;
}
.scrap-polaroid {
  background: #fff; padding: 8px 8px 14px; border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08); border: 1px solid #ebd9d2;
}
.scrap-polaroid .polaroid-crop {
  width: 220px; height: 160px; background-size: cover; background-position: center; border-radius: 4px;
}
.scrap-polaroid .polaroid-text {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 12.5px;
  text-align: center; margin-top: 8px; color: #2a0e1b;
}

/* Silken Packaging */
.silken-packaging-page {
  height: 100%; display: flex; flex-direction: column; justify-content: space-between;
}
.silken-pkg-header {
  text-align: center; margin-bottom: 18px;
}
.pkg-tag {
  font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #800020;
  text-transform: uppercase; display: block; margin-bottom: 4px;
}
.silken-pkg-header h2 {
  font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #2a0e1b; margin: 4px 0;
}
.silken-pkg-header p {
  font-size: 12px; color: #6d4b58; margin: 0;
}
.silken-pkg-gallery {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; flex: 1;
}
.pkg-tile {
  background-size: cover; background-position: center; border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08); position: relative;
  border: 1px solid #ebd9d2; overflow: hidden;
}
.tile-caption {
  position: absolute; bottom: 10px; left: 10px; right: 10px;
  background: rgba(42,14,27,0.85); color: #fff; font-size: 9.5px;
  font-weight: 700; letter-spacing: 0.1em; padding: 6px 10px;
  border-radius: 6px; text-align: center; text-transform: uppercase;
}
.silken-pkg-footer {
  display: flex; justify-content: center; align-items: center;
  border-top: 1px solid #ebd9d2; padding-top: 14px; margin-top: 16px;
}
.silken-pkg-card {
  background: #ffffff; border: 1.5px solid #c5a059; padding: 14px 28px;
  border-radius: 12px; max-width: 500px; text-align: center;
}
.pkg-lotus {
  font-size: 24px; margin-bottom: 4px;
}
.pkg-brand {
  font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #800020;
}
.pkg-quote {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 12px;
  color: #42202c; margin: 6px 0;
}
.pkg-love {
  font-size: 9.5px; letter-spacing: 0.15em; color: #c5a059; text-transform: uppercase; font-weight: 700;
}

/* Silken Closing */
.silken-closing-page {
  position: relative; width: 100%; height: 100%; background-size: cover;
  background-position: center; display: flex; flex-direction: column;
  justify-content: space-between; padding: 40px; box-sizing: border-box;
}
.silken-closing-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(circle, rgba(42,14,27,0.5) 0%, rgba(42,14,27,0.88) 100%);
}
.silken-closing-glass-box {
  position: relative; z-index: 10;
  background: rgba(255,255,255,0.18); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,255,255,0.38); border-radius: 20px;
  padding: 40px 50px; text-align: center; color: #ffffff; max-width: 620px; margin: auto;
  box-shadow: 0 20px 48px rgba(0,0,0,0.4);
}
.closing-crest {
  font-size: 28px; color: #ffd700; margin-bottom: 12px;
}
.silken-closing-h2 {
  font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700;
  margin: 0 0 16px; letter-spacing: 0.05em;
}
.silken-closing-p {
  font-size: 13px; line-height: 1.7; color: #fdf2f4; margin: 0 0 24px;
}
.grace-span {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: #ffd700;
}
.silken-closing-btn {
  display: inline-block; background: #ffd700; color: #2a0e1b;
  font-size: 11px; font-weight: 800; letter-spacing: 0.2em;
  text-transform: uppercase; padding: 12px 28px; border-radius: 30px;
  box-shadow: 0 6px 18px rgba(255,215,0,0.35); cursor: pointer;
}
`;

const KOTADORIA_TEMPLATES = { list: TEMPLATES, css: CSS, render, pageCount };
if (typeof window !== 'undefined') { window.KOTADORIA_TEMPLATES = KOTADORIA_TEMPLATES; }
export default KOTADORIA_TEMPLATES;
export { TEMPLATES, CSS, render, pageCount };
