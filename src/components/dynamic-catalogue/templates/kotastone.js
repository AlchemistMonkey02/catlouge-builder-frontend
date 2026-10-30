/* Kota Stone Catalogue Templates (8 dedicated structurally distinct architectural templates)
   Specialized for Blue-Green Limestone, Mirror Polish, Leather Finish, Commercial Paving & Cobbles */

const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => (s || '').toUpperCase();
const pn = n => String(n).padStart(2, '0');
const bg = u => u ? `background-image:url(${u})` : '';

let uid = 0;
const cut = (img, x, y, w, h, pts, extra) => {
  const id = 'k' + (++uid), p = pts.map(q => `${q[0] * w / 100},${q[1] * h / 100}`).join(' ');
  return `<svg style="position:absolute;left:${x}px;top:${y}px" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><polygon points="${p}"/></clipPath></defs><image href="${img}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>${extra || ''}</svg>`;
};

const th = (name, bg, ink, muted, acc, dark, soft, line, onDark) => ({ name, bg, ink, muted, acc, dark, soft, line, onDark });

const TEMPLATES = [
  {
    id: 'ks-b1',
    cat: 'Kota Stone Specialty',
    name: 'Classic Architectural Brochure',
    desc: 'Geometric diagonal cuts, swatch matrices, surface finishes & application layouts',
    theme: th('Sage Olive', '#edeee6', '#22251e', '#656a5a', '#8a8a55', '#4e5230', '#e0e2d6', '#cfd2c1', '#f1f2e8'),
    hf: "'Playfair Display', serif",
    bf: "'Lora', serif",
    badge: 'Architectural Geometric'
  },
  {
    id: 'ks-b2',
    cat: 'Kota Stone Specialty',
    name: 'Mirror Polish & Leather Finish Suite',
    desc: 'Deep greenish-blue tones, high-reflectivity mirror polish vs tactile leather texture dossier',
    theme: th('Obsidian & Blue-Green Limestone', '#10171d', '#f1f5f9', '#94a3b8', '#0ea5e9', '#082f49', '#1e293b', '#334155', '#ffffff'),
    hf: "'Cinzel', serif",
    bf: "'Inter', sans-serif",
    badge: 'Mirror & Leather Finishes'
  },
  {
    id: 'ks-b3',
    cat: 'Kota Stone Specialty',
    name: 'Warm Terracotta Courtyard Brochure',
    desc: 'Warm earthy sand tones, heritage courtyard paving, natural non-slip corridors',
    theme: th('Warm Sand & Terracotta', '#f3ece0', '#2c241d', '#7a6b5c', '#b0643d', '#6b3d28', '#e8dcc8', '#d8c9ae', '#f7efe2'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Courtyard & Patios'
  },
  {
    id: 'ks-b4',
    cat: 'Kota Stone Specialty',
    name: 'Heavy Commercial Traffic Paving Matrix',
    desc: 'High compressive strength 140 MPa, metro station & public infrastructure durability spec',
    theme: th('Commercial Slate & Teal', '#f1f5f9', '#0f172a', '#475569', '#0d9488', '#134e4a', '#e2e8f0', '#cbd5e1', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Heavy Infrastructure 140 MPa'
  },
  {
    id: 'ks-b5',
    cat: 'Kota Stone Specialty',
    name: 'Luxury Villa Landscaping & Pool Coping',
    desc: 'Natural cleft, anti-skid wet grip, exterior landscaping stepped pathway monograph',
    theme: th('Forest Green & Natural Jade', '#f4f7f4', '#172317', '#4b5e4b', '#15803d', '#14532d', '#e1eae1', '#c7d7c7', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Landscape Sanctuary'
  },
  {
    id: 'ks-b6',
    cat: 'Kota Stone Specialty',
    name: 'Dimensional Slabs & Wall Cladding Dossier',
    desc: 'Precision calibrated 18-25mm thickness, ventilated facade brackets & interior accent walls',
    theme: th('Graphite & Pearl White', '#f8fafc', '#18181b', '#52525b', '#3b82f6', '#27272a', '#e4e4e7', '#d4d4d8', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Precision Calibrated Slabs'
  },
  {
    id: 'ks-b7',
    cat: 'Kota Stone Specialty',
    name: 'Fortress Chequer & Hand-Cut Cobbles',
    desc: 'Heavy vehicle driveways, traditional chequered grip ramps, river-washed rustic cobblestones',
    theme: th('Rustic Basalt & Earth Ochre', '#f6f4ee', '#26221c', '#60584c', '#b45309', '#451a03', '#ebe5d8', '#d5cbba', '#ffffff'),
    hf: "'Cinzel', serif",
    bf: "'Inter', sans-serif",
    badge: 'Cobbles & Chequered Ramps'
  },
  {
    id: 'ks-b8',
    cat: 'Kota Stone Specialty',
    name: 'Global Limestone Export Dossier',
    desc: 'International ocean container loading matrix, seaworthy fumigated wooden bundles, export pallet payload',
    theme: th('Maritime Export Slate', '#f0f4f8', '#0b192c', '#334155', '#0284c7', '#081729', '#e0e8f0', '#cbd5e1', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Global Maritime Export'
  }
];

const head = (c, label, no) => `
  <div class="ks-head">
    <div class="ks-head-brand">
      <span>🏛️</span>
      <strong>${E(c.info.ent || 'KOTA BLUE-GREEN LIMESTONE')}</strong>
    </div>
    <span class="ks-head-tag">${E(label)}</span>
    <span class="ks-head-num">${pn(no)}</span>
  </div>
`;

const foot = c => `
  <div class="ks-foot">
    <span>${E(c.info.ent || '')} &bull; Natural Kota Stone Limestone Works</span>
    <span>☎ ${E(c.info.mobile || '')} ${c.info.email ? `&bull; ${E(c.info.email)}` : ''}</span>
  </div>
`;

function contactPage(c, no) {
  const i = c.info, qrs = c.qrs || [];
  return `
    ${head(c, 'DIRECT QUARRY & ESTIMATION DESK', no)}
    <div class="ks-contact-wrap">
      <div class="ks-contact-banner">
        <span class="ks-badge-arch">QUARRY SUPPLY &bull; ARCHITECTURAL SPECIFICATION</span>
        <h2 class="ks-contact-h2">Direct Project Supply Desk</h2>
        <p class="ks-contact-p">
          We service architects, metro rail transit projects, hospital contractors, and commercial developers with quarry-direct Kota Stone. High compressive strength, non-porous naturally dense limestone, precision sawn or hand chiseled.
        </p>
      </div>

      <div class="ks-contact-details-grid">
        <div class="ks-detail-card">
          <h3>🏛️ Quarry &amp; Processing Base</h3>
          <p><strong>Entity:</strong> ${E(i.ent || 'Kota Stone Processing Pvt Ltd')}</p>
          <p><strong>Address:</strong> ${E(i.addr || 'Stone Industrial Area, Ramganjmandi, Kota, Rajasthan')}</p>
          ${i.gst ? `<p><strong>GSTIN:</strong> ${E(i.gst)}</p>` : ''}
        </div>

        <div class="ks-detail-card">
          <h3>📞 Trade &amp; Dispatch Desk</h3>
          <p><strong>Manager:</strong> ${E(i.person || 'Chief Quarry Dispatch Officer')}</p>
          <p><strong>Phone / WhatsApp:</strong> ${E(i.mobile || '+91 98765 43210')}</p>
          ${i.email ? `<p><strong>Email:</strong> ${E(i.email)}</p>` : ''}
          <p><strong>Specification:</strong> IS 1121 &bull; Compressive 140 MPa</p>
        </div>
      </div>

      <div class="ks-qr-section">
        <h3>Digital Access &amp; Instant Estimation</h3>
        <div class="ks-qr-row">
          ${qrs.length ? qrs.map(q => `
            <div class="ks-qr-pill">
              <img src="${q.img}" class="qrimg" alt="${q.label}" />
              <b>${E(q.label)}</b>
              <small>Scan with phone camera</small>
            </div>
          `).join('') : `
            <div class="ks-qr-pill">
              <div class="ks-qr-placeholder">🏛️</div>
              <b>Direct WhatsApp Desk</b>
              <small>${E(i.mobile || 'Connect with quarry dispatch')}</small>
            </div>
          `}
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 1: CLASSIC ARCHITECTURAL BROCHURE (Polygon Geometric Cut Cover)
   ========================================================================= */
function t1_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks1-cover">
      <div class="ks1-cut-hero">
        ${cut(hero, 0, 0, 706, 540, [[0, 0], [100, 0], [100, 80], [0, 100]])}
        <div class="ks1-badge-abs">ARCHITECTURAL LIMESTONE</div>
      </div>
      <div class="ks1-body">
        <span class="ks1-sub">NATURAL FINE-GRAINED CALCAREOUS STONE</span>
        <h1 class="ks1-title">${E(i.ent || 'Classic Kota Stone Architectural Collection')}</h1>
        <p class="ks1-p">${E(i.desc || 'Celebrated across government complexes, railway stations, and residential estates. Exceptionally dense natural limestone renowned for its non-porous structure, cooling thermal properties, and centuries of wear resistance.')}</p>
        <div class="ks1-metric-row">
          <div><b>140 MPa</b><span>Compressive Strength</span></div>
          <div><b>&lt;0.3%</b><span>Water Absorption</span></div>
          <div><b>Cool</b><span>Natural Thermal Comfort</span></div>
        </div>
      </div>
    </div>
  `;
}

function t1_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `ARCHITECTURAL STONE RANGE (${pageIdx}/${totalPages})`, no)}
    <div class="ks1-head">
      <h2>Naturally Split &amp; Calibrated Slabs</h2>
      <p>Precision calibrated 18mm / 25mm thickness for uniform mortar and adhesive bedding</p>
    </div>
    <div class="ks1-grid">
      ${slice.map((it, idx) => `
        <div class="ks1-card">
          <div class="ks1-img" style="${bg(it.img)}">
            <span class="ks1-code">${E(it.code || `#KTS-${pn(idx + 1)}`)}</span>
          </div>
          <div class="ks1-info">
            <h3>${E(it.name)}</h3>
            <div class="ks1-tags">
              <span>${E(it.finish || 'Mirror Polish / Honed')}</span>
              <span>${E(it.size || '600x600 mm')}</span>
            </div>
            <p class="ks1-note">Fine-grained dense matrix with zero surface flaking &bull; Non-slip traction.</p>
            <div class="ks1-foot">
              <span class="ks1-price">${E(it.price || 'Quarry Rate')}</span>
              <span class="ks1-stock">Ready Stock</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 2: MIRROR POLISH & LEATHER FINISH SUITE (Dual Split Comparison Layout)
   ========================================================================= */
function t2_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks2-cover">
      <div class="ks2-top-tag">FINISH INNOVATION &bull; MIRROR REFLECTIVITY VS TACTILE LEATHER</div>
      <div class="ks2-split-duo">
        <div class="ks2-half mirror" style="${bg(hero)}">
          <div class="ks2-label">HIGH GLOSS MIRROR POLISH</div>
        </div>
        <div class="ks2-half leather" style="${bg(hero)}">
          <div class="ks2-label">BRUSHED TACTILE LEATHER</div>
        </div>
      </div>
      <div class="ks2-info">
        <h1>${E(i.ent || 'Mirror Polish &amp; Leather Finish Suite')}</h1>
        <p>${E(i.desc || 'Transforming traditional Kota limestone into haute luxury. High-reflectivity diamond mirror polish for luminous interior atriums, contrasted with velvety brushed leather finishes for barefoot spa sanctuaries.')}</p>
        <div class="ks2-specs">
          <div><span>Mirror Gloss:</span> 85+ Lux Reflectivity</div>
          <div><span>Leather Feel:</span> Textured Velvet Grip</div>
          <div><span>Colors:</span> Kota Green &amp; Kota Brown</div>
        </div>
      </div>
    </div>
  `;
}

function t2_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `SURFACE FINISH COLLECTION (${pageIdx}/${totalPages})`, no)}
    <div class="ks2-head">
      <h2>Mirror, Honed &amp; Leathered Slabs</h2>
      <p>Precision automated polishing lines delivering glass-like flatness and velvety relief</p>
    </div>
    <div class="ks2-grid">
      ${slice.map((it, idx) => `
        <div class="ks2-card">
          <div class="ks2-card-img" style="${bg(it.img)}">
            <span class="ks2-finish-badge">${E(it.finish || 'Mirror Gloss')}</span>
          </div>
          <div class="ks2-card-body">
            <h3>${E(it.name)}</h3>
            <p class="ks2-card-p">Diamond head polished &bull; Zero micropores &bull; Stain resistant seal ready.</p>
            <div class="ks2-card-specs">
              <span><b>Thickness:</b> ${E(it.thickness || '20 mm Sawn')}</span>
              <span><b>Edges:</b> Machine Chamfered</span>
            </div>
            <div class="ks2-card-foot">
              <span class="ks2-price">${E(it.price || 'Wholesale Quote')}</span>
              <span class="ks2-status">Calibrated</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 3: WARM TERRACOTTA COURTYARD (Colonnade & Courtyard Paving)
   ========================================================================= */
function t3_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks3-cover">
      <div class="ks3-banner">COURTYARD PAVING &bull; HERITAGE HAVELI ARCHITECTURE</div>
      <div class="ks3-hero" style="${bg(hero)}">
        <div class="ks3-overlay"></div>
        <div class="ks3-hero-content">
          <span class="ks3-tag">KOTA BROWN &amp; NATURAL BLUE</span>
          <h1>${E(i.ent || 'Warm Courtyard Paving Slabs')}</h1>
        </div>
      </div>
      <div class="ks3-lead-wrap">
        <p class="ks3-lead">${E(i.desc || 'Drawing inspiration from royal Rajasthan courtyards. Warm earthy limestone slabs that stay cool under blistering summer sun, providing peaceful cloisters and shaded garden verandas.')}</p>
        <div class="ks3-pattern-tags">
          <span>🌿 Herringbone Paving</span>
          <span>🌿 Natural Cleft Walkways</span>
          <span>🌿 Courtyard Basketweave</span>
        </div>
      </div>
    </div>
  `;
}

function t3_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `COURTYARD & PATIO TILES (${pageIdx}/${totalPages})`, no)}
    <div class="ks3-head">
      <h2>Courtyard Slabs &amp; Natural Walkways</h2>
      <p>Hand-cut and machine-cut tiles calibrated for traditional outdoor courtyards</p>
    </div>
    <div class="ks3-grid">
      ${slice.map((it, idx) => `
        <div class="ks3-card">
          <div class="ks3-img" style="${bg(it.img)}">
            <span class="ks3-badge">${E(it.finish || 'Natural Split')}</span>
          </div>
          <div class="ks3-info">
            <h3>${E(it.name)}</h3>
            <p class="ks3-desc">Earthy warm tones &bull; Hand-dressed edges for heritage authenticity.</p>
            <div class="ks3-meta">
              <span><b>Size:</b> ${E(it.size || '560x560 mm')}</span>
              <span><b>Type:</b> Kota Brown / Blue</span>
            </div>
            <div class="ks3-foot">
              <span class="ks3-price">${E(it.price || 'Yard Pricing')}</span>
              <span class="ks3-ready">Bulk Available</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 4: HEAVY COMMERCIAL TRAFFIC PAVING MATRIX (Infrastructure 140 MPa)
   ========================================================================= */
function t4_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks4-cover">
      <div class="ks4-eng-bar">
        <span>INFRASTRUCTURE GRADE &bull; METRO RAIL &amp; AIRPORT CERTIFIED</span>
        <span>TEST STANDARD: IS 1121 / ASTM C170</span>
      </div>
      <div class="ks4-split">
        <div class="ks4-left">
          <span class="ks4-spec-code">140 MPa COMPRESSION RATING</span>
          <h1>${E(i.ent || 'Heavy Commercial Traffic Paving')}</h1>
          <div class="ks4-line"></div>
          <p>${E(i.desc || 'Engineered for relentless public footfalls and heavy vehicular corridors. Installed across major airports, high-speed rail terminals, and hospitals requiring extreme abrasion resistance and zero chemical erosion.')}</p>
          <div class="ks4-matrix-boxes">
            <div><b>140 MPa</b><span>Compressive Strength</span></div>
            <div><b>&lt;0.25%</b><span>Water Absorption</span></div>
            <div><b>Class 4</b><span>Heavy Abrasion Index</span></div>
            <div><b>Anti-Skid</b><span>High Traction Wet/Dry</span></div>
          </div>
        </div>
        <div class="ks4-right" style="${bg(hero)}">
          <div class="ks4-cert-stamp">PUBLIC INFRASTRUCTURE CERTIFIED</div>
        </div>
      </div>
    </div>
  `;
}

function t4_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `COMMERCIAL INFRASTRUCTURE SPECIFICATION (${pageIdx}/${totalPages})`, no)}
    <div class="ks4-head">
      <h2>High-Density Paving Slabs &amp; Platform Copings</h2>
      <p>Precision calibrated 25mm to 35mm thickness for high-impact commercial installations</p>
    </div>
    <div class="ks4-table-wrap">
      <table class="ks4-table">
        <thead>
          <tr>
            <th style="width:70px">Photo</th>
            <th>Designation &amp; Code</th>
            <th>Thickness</th>
            <th>Compressive</th>
            <th>Surface Finish</th>
            <th>Rate / Sq Ft</th>
          </tr>
        </thead>
        <tbody>
          ${slice.map((it, idx) => `
            <tr>
              <td><div class="ks4-thumb" style="${bg(it.img)}"></div></td>
              <td>
                <b>${E(it.name)}</b>
                <small>${E(it.code || `#INF-${pn(idx + 1)}`)} &bull; Standard Blue Limestone</small>
              </td>
              <td><b>${E(it.thickness || '25-30 mm')}</b></td>
              <td>140 MPa Verified</td>
              <td>${E(it.finish || 'Honed Non-Skid')}</td>
              <td><span class="ks4-price">${E(it.price || 'Contract Rate')}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="ks4-infra-note">
      <b>📌 Project Logistics:</b> High-capacity rail and truck container dispatch available directly from Ramganjmandi mining railhead.
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 5: LUXURY VILLA LANDSCAPING & POOL COPING (Landscape Sanctuary)
   ========================================================================= */
function t5_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks5-cover">
      <div class="ks5-tag">LANDSCAPE ARCHITECTURE &bull; SPA &amp; SANCTUARY DESIGN</div>
      <div class="ks5-hero" style="${bg(hero)}">
        <div class="ks5-overlay"></div>
        <div class="ks5-hero-title">
          <span class="ks5-pool-sub">NATURAL WET-TRACTION LIMESTONE</span>
          <h1>${E(i.ent || 'Landscape Slabs &amp; Pool Sanctuary')}</h1>
        </div>
      </div>
      <div class="ks5-body">
        <p class="ks5-lead">${E(i.desc || 'Harmonizing natural organic garden pathways with barefoot poolside luxury. Naturally honed Kota stone surfaces that absorb minimal solar heat and maintain safe anti-skid grip even when saturated.')}</p>
        <div class="ks5-pills">
          <div>🏊‍♂️ Salt &amp; Chlorine Proof</div>
          <div>🌿 Stepped Grass Path Slabs</div>
          <div>💧 Bullnose Pool Edges</div>
        </div>
      </div>
    </div>
  `;
}

function t5_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `LANDSCAPE & POOLSIDE TILES (${pageIdx}/${totalPages})`, no)}
    <div class="ks5-head">
      <h2>Landscape Steppers, Copings &amp; Tumbled Pavers</h2>
      <p>Precision tumbled edges &bull; Cool barefoot feel under direct sunlight</p>
    </div>
    <div class="ks5-grid">
      ${slice.map((it, idx) => `
        <div class="ks5-card">
          <div class="ks5-img" style="${bg(it.img)}">
            <span class="ks5-finish">${E(it.finish || 'Tumbled Edge')}</span>
          </div>
          <div class="ks5-info">
            <h3>${E(it.name)}</h3>
            <p class="ks5-note">Slip-resistant wet texture &bull; Organic softened bullnose coping.</p>
            <div class="ks5-specs">
              <span><b>Thickness:</b> 25 mm Calibrated</span>
              <span><b>Grip:</b> SRT 70+</span>
            </div>
            <div class="ks5-foot">
              <span class="ks5-price">${E(it.price || 'Inquire Price')}</span>
              <span class="ks5-ready">Villa Grade</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 6: DIMENSIONAL SLABS & WALL CLADDING DOSSIER (Facade Cladding)
   ========================================================================= */
function t6_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks6-cover">
      <div class="ks6-top-strip">
        <span>DIMENSIONAL GANGSAW SLABS &bull; VENTILATED FACADE CLADDING</span>
      </div>
      <div class="ks6-split">
        <div class="ks6-text">
          <span class="ks6-code">CALIBRATED FACADE ENGINEERING</span>
          <h1>${E(i.ent || 'Dimensional Slabs &amp; Wall Cladding')}</h1>
          <p>${E(i.desc || 'Gangsaw sawn dimension slabs calibrated to precise 18mm thickness. Engineered for interior feature cladding and exterior ventilated curtain walls using stainless steel undercut anchor brackets.')}</p>
          <div class="ks6-specs-box">
            <div><b>Thickness:</b> Exact 18mm &plusmn;0.5mm</div>
            <div><b>Dimensions:</b> Up to 2400x1200 mm</div>
            <div><b>Weight:</b> 48 kg/m² @ 18mm</div>
          </div>
        </div>
        <div class="ks6-hero-img" style="${bg(hero)}">
          <div class="ks6-badge">FACADE ANCHOR READY</div>
        </div>
      </div>
    </div>
  `;
}

function t6_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `DIMENSIONAL CLADDING SLABS (${pageIdx}/${totalPages})`, no)}
    <div class="ks6-head">
      <h2>Calibrated Wall Cladding &amp; Feature Panels</h2>
      <p>Precision edge chamfered and grooved for mechanical anchor installation</p>
    </div>
    <div class="ks6-grid">
      ${slice.map((it, idx) => `
        <div class="ks6-card">
          <div class="ks6-img" style="${bg(it.img)}">
            <span class="ks6-cal">Calibrated 18mm</span>
          </div>
          <div class="ks6-info">
            <h3>${E(it.name)}</h3>
            <p class="ks6-p">Uniform gauge thickness &bull; Micro-honed velvety surface.</p>
            <div class="ks6-meta">
              <span><b>Finish:</b> ${E(it.finish || 'Honed Satin')}</span>
              <span><b>Size:</b> ${E(it.size || 'Sawn Slabs')}</span>
            </div>
            <div class="ks6-foot">
              <span class="ks6-price">${E(it.price || 'Gangsaw Rate')}</span>
              <span class="ks6-moq">Project Sawn</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 7: FORTRESS CHEQUER & HAND-CUT COBBLES (Vehicular Cobblestones)
   ========================================================================= */
function t7_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks7-cover">
      <div class="ks7-badge-top">HEAVY TRACTION &bull; VEHICULAR RAMPS &bull; COBBLESTONE PAVING</div>
      <div class="ks7-split">
        <div class="ks7-left">
          <span class="ks7-tag">CHISELED SPLIT STONE</span>
          <h1>${E(i.ent || 'Chequered Ramps &amp; Hand-Cut Cobbles')}</h1>
          <p>${E(i.desc || 'Heavy duty hand-cut cobblestones and grooved chequered tiles designed for steep basement ramps, driveway entrances, and heavy vehicular zones requiring permanent tire traction.')}</p>
          <div class="ks7-chips">
            <div>🛡️ Anti-Skid Grooved Chequers</div>
            <div>🛡️ 100x100x60mm Chiseled Cobbles</div>
            <div>🛡️ 100% Weatherproof Natural Limestone</div>
          </div>
        </div>
        <div class="ks7-right" style="${bg(hero)}">
          <div class="ks7-ramp-tag">HEAVY VEHICULAR DUTY</div>
        </div>
      </div>
    </div>
  `;
}

function t7_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `COBBLES & CHEQUERED RAMPS (${pageIdx}/${totalPages})`, no)}
    <div class="ks7-head">
      <h2>Hand-Dressed Driveway Cobbles &amp; Grooved Tiles</h2>
      <p>Rough cleft texture for maximum tire and pedestrian grip under wet monsoon conditions</p>
    </div>
    <div class="ks7-grid">
      ${slice.map((it, idx) => `
        <div class="ks7-card">
          <div class="ks7-img" style="${bg(it.img)}">
            <span class="ks7-traction">Grip Grooved</span>
          </div>
          <div class="ks7-body">
            <h3>${E(it.name)}</h3>
            <p class="ks7-desc">Natural hand-chiseled cleft &bull; Resists oil stains and tire friction.</p>
            <div class="ks7-specs">
              <span><b>Thickness:</b> ${E(it.thickness || '40-60 mm')}</span>
              <span><b>Type:</b> Split Cobble</span>
            </div>
            <div class="ks7-foot">
              <span class="ks7-price">${E(it.price || 'Direct Yard Quote')}</span>
              <span class="ks7-unit">Per Piece / Ton</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 8: GLOBAL LIMESTONE EXPORT DOSSIER (Maritime Wooden Bundle Packing)
   ========================================================================= */
function t8_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ks8-cover">
      <div class="ks8-marine-bar">
        <span>GLOBAL OCEAN FREIGHT &bull; SEAWORTHY PACKING DOSSIER</span>
        <span>ISPM-15 COMPLIANT CRATES</span>
      </div>
      <div class="ks8-split">
        <div class="ks8-left">
          <span class="ks8-stamp">EXPORT GRADE SPECIFICATION</span>
          <h1>${E(i.ent || 'Global Limestone Export Dossier')}</h1>
          <p>${E(i.desc || 'Direct export supply of calibrated Kota limestone to UK, European, and Middle East markets. Packed in heavy-duty fumigated wooden crates with plastic inner wrap and corner protectors for damage-free sea transit.')}</p>
          <div class="ks8-matrix">
            <div class="ks8-box"><b>28 MT</b><span>Container Payload</span></div>
            <div class="ks8-box"><b>ISPM-15</b><span>Fumigated Crates</span></div>
            <div class="ks8-box"><b>&plusmn;1mm</b><span>Tolerance Control</span></div>
            <div class="ks8-box"><b>FOB / CIF</b><span>Incoterms 2020</span></div>
          </div>
        </div>
        <div class="ks8-right" style="${bg(hero)}">
          <div class="ks8-sea-tag">MUNDRA PORT DISPATCH</div>
        </div>
      </div>
    </div>
  `;
}

function t8_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `EXPORT CRATED SPECIFICATIONS (${pageIdx}/${totalPages})`, no)}
    <div class="ks8-head">
      <h2>Crated Paving Tiles &amp; Sawn Slabs</h2>
      <p>Precision calibration tolerance &plusmn;1mm &bull; Fumigated ISPM-15 wooden crate packaging</p>
    </div>
    <div class="ks8-grid">
      ${slice.map((it, idx) => `
        <div class="ks8-card">
          <div class="ks8-card-head">
            <span>EXPORT CRATE #${pn(idx + 1)}</span>
            <span>CE / ASTM TESTED</span>
          </div>
          <div class="ks8-img" style="${bg(it.img)}"></div>
          <div class="ks8-body">
            <h3>${E(it.name)}</h3>
            <table class="ks8-tbl">
              <tr><td>Format:</td><td><b>${E(it.size || '600x600 mm')}</b></td></tr>
              <tr><td>Finish:</td><td>${E(it.finish || 'Honed / Sawn')}</td></tr>
              <tr><td>Density:</td><td>2.68 g/cm³ (High Density)</td></tr>
              <tr><td>Packing:</td><td>Heavy Wooden Crates</td></tr>
            </table>
            <div class="ks8-foot">
              <span class="ks8-price">${E(it.price || 'FOB Mundra Rate')}</span>
              <span class="ks8-moq">1x20ft FCL</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   PAGE COUNT & MAIN RENDER DISPATCHER
   ========================================================================= */
function pageCount(t, n) {
  return 1 + Math.ceil(Math.max(1, n) / (t.id === 'ks-b4' ? 6 : 4)) + 1;
}

function render(t, ctx) {
  const th = t.theme;
  const items = (ctx.items || []).map((it, k) => Object.assign({ code: `#KS-${pn(k + 1)}` }, it));
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

  const wrap = (h, extraCls = '') => `<div class="pg kotastone-pg ${extraCls}" style="${style}">${h}</div>`;
  const P = [];
  let no = 1;

  if (t.id === 'ks-b1') {
    P.push(wrap(t1_cover(c, t), 'ks1-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t1_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks1-mode'));
    }
  } else if (t.id === 'ks-b2') {
    P.push(wrap(t2_cover(c, t), 'ks2-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t2_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks2-mode'));
    }
  } else if (t.id === 'ks-b3') {
    P.push(wrap(t3_cover(c, t), 'ks3-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t3_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks3-mode'));
    }
  } else if (t.id === 'ks-b4') {
    P.push(wrap(t4_cover(c, t), 'ks4-mode'));
    const perPage = 6;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t4_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks4-mode'));
    }
  } else if (t.id === 'ks-b5') {
    P.push(wrap(t5_cover(c, t), 'ks5-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t5_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks5-mode'));
    }
  } else if (t.id === 'ks-b6') {
    P.push(wrap(t6_cover(c, t), 'ks6-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t6_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks6-mode'));
    }
  } else if (t.id === 'ks-b7') {
    P.push(wrap(t7_cover(c, t), 'ks7-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t7_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks7-mode'));
    }
  } else {
    // ks-b8
    P.push(wrap(t8_cover(c, t), 'ks8-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t8_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ks8-mode'));
    }
  }

  const modeTag = (t.id || 'ks-b1').replace('ks-b', 'ks') + '-mode';
  P.push(wrap(contactPage(c, ++no, t), modeTag));
  return P;
}

const CSS = `
.pg.kotastone-pg {
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
.kotastone-pg .ks-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1.5px solid var(--line);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.kotastone-pg .ks-head-brand { display: flex; align-items: center; gap: 6px; color: var(--ink); }
.kotastone-pg .ks-head-tag { color: var(--acc); font-weight: 700; }
.kotastone-pg .ks-head-num { font-weight: 800; color: var(--ink); }

.kotastone-pg .ks-foot {
  position: absolute;
  bottom: 28px;
  left: 44px;
  right: 44px;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 10.5px;
  color: var(--muted);
  letter-spacing: 0.06em;
}

/* Contact Page Styles */
.kotastone-pg .ks-contact-wrap { margin-top: 10px; }
.kotastone-pg .ks-contact-banner {
  background: var(--dark);
  color: var(--onDark);
  border-radius: 18px;
  padding: 34px 40px;
  margin-bottom: 24px;
}
.kotastone-pg .ks-badge-arch {
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
.kotastone-pg .ks-contact-h2 {
  font-family: var(--hf);
  font-size: 34px;
  margin: 0 0 10px;
}
.kotastone-pg .ks-contact-p {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.88;
  max-width: 600px;
  margin: 0;
}
.kotastone-pg .ks-contact-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.kotastone-pg .ks-detail-card {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
}
.kotastone-pg .ks-detail-card h3 {
  font-size: 14px;
  margin: 0 0 12px;
  color: var(--acc);
  letter-spacing: 0.04em;
}
.kotastone-pg .ks-detail-card p {
  font-size: 11.5px;
  margin: 0 0 8px;
  color: var(--ink);
  line-height: 1.5;
}
.kotastone-pg .ks-qr-section {
  background: var(--soft);
  border-radius: 16px;
  padding: 22px 28px;
  border: 1px solid var(--line);
}
.kotastone-pg .ks-qr-section h3 {
  font-size: 13px;
  letter-spacing: 0.08em;
  margin: 0 0 16px;
  color: var(--ink);
  text-align: center;
}
.kotastone-pg .ks-qr-row {
  display: flex;
  justify-content: center;
  gap: 28px;
}
.kotastone-pg .ks-qr-pill {
  text-align: center;
  background: #ffffff;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.kotastone-pg .ks-qr-pill img.qrimg {
  width: 90px;
  height: 90px;
  display: block;
  margin: 0 auto 8px;
}
.kotastone-pg .ks-qr-placeholder { font-size: 44px; margin-bottom: 4px; }
.kotastone-pg .ks-qr-pill b { display: block; font-size: 12px; color: #111827; }
.kotastone-pg .ks-qr-pill small { font-size: 9.5px; color: #6b7280; }

/* =========================================================================
   STYLE SUITE 1: CLASSIC ARCHITECTURAL BROCHURE (ks1-mode)
   ========================================================================= */
.ks1-mode .ks1-cover { height: 100%; display: flex; flex-direction: column; }
.ks1-mode .ks1-cut-hero { position: relative; height: 540px; margin-bottom: 24px; }
.ks1-mode .ks1-badge-abs { position: absolute; bottom: 30px; left: 30px; background: var(--dark); color: #fff; font-size: 10.5px; font-weight: 800; padding: 8px 18px; border-radius: 20px; letter-spacing: 0.16em; }
.ks1-mode .ks1-sub { font-size: 11px; letter-spacing: 0.24em; color: var(--acc); font-weight: 800; }
.ks1-mode .ks1-title { font-family: var(--hf); font-size: 42px; margin: 8px 0 12px; color: var(--ink); }
.ks1-mode .ks1-p { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ks1-mode .ks1-metric-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ks1-mode .ks1-metric-row div { background: var(--soft); padding: 14px 16px; border-radius: 10px; text-align: center; }
.ks1-mode .ks1-metric-row b { display: block; font-size: 18px; color: var(--dark); font-weight: 800; }
.ks1-mode .ks1-metric-row span { font-size: 10.5px; color: var(--muted); }
.ks1-mode .ks1-head { margin-bottom: 20px; }
.ks1-mode .ks1-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ks1-mode .ks1-head p { font-size: 12px; color: var(--muted); }
.ks1-mode .ks1-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ks1-mode .ks1-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); }
.ks1-mode .ks1-img { height: 190px; background-size: cover; background-position: center; position: relative; }
.ks1-mode .ks1-code { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.65); color: #fff; font-size: 9.5px; padding: 4px 10px; border-radius: 8px; }
.ks1-mode .ks1-info { padding: 18px 20px; }
.ks1-mode .ks1-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 8px; }
.ks1-mode .ks1-tags { display: flex; gap: 6px; margin-bottom: 10px; }
.ks1-mode .ks1-tags span { background: var(--soft); font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 600; color: var(--acc); }
.ks1-mode .ks1-note { font-size: 11px; color: var(--muted); margin: 0 0 12px; line-height: 1.4; }
.ks1-mode .ks1-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks1-mode .ks1-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks1-mode .ks1-stock { font-size: 10px; color: #15803d; font-weight: 700; }

/* =========================================================================
   STYLE SUITE 2: MIRROR POLISH & LEATHER (ks2-mode Dual Split)
   ========================================================================= */
.ks2-mode .ks2-cover { height: 100%; display: flex; flex-direction: column; }
.ks2-mode .ks2-top-tag { font-size: 11px; letter-spacing: 0.24em; color: var(--acc); font-weight: 800; margin-bottom: 20px; text-align: center; }
.ks2-mode .ks2-split-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; height: 480px; margin-bottom: 24px; border-radius: 16px; overflow: hidden; }
.ks2-mode .ks2-half { position: relative; background-size: cover; background-position: center; }
.ks2-mode .ks2-half.mirror { filter: brightness(1.1) contrast(1.1); }
.ks2-mode .ks2-half.leather { filter: brightness(0.9) contrast(1.2); }
.ks2-mode .ks2-label { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #fff; font-size: 9.5px; font-weight: 800; padding: 6px 14px; border-radius: 20px; white-space: nowrap; }
.ks2-mode .ks2-info h1 { font-family: var(--hf); font-size: 42px; margin: 0 0 10px; color: var(--ink); }
.ks2-mode .ks2-info p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 16px; }
.ks2-mode .ks2-specs { display: flex; gap: 20px; font-size: 11px; color: var(--dark); font-weight: 700; }
.ks2-mode .ks2-specs span { color: var(--acc); }
.ks2-mode .ks2-head { margin-bottom: 20px; text-align: center; }
.ks2-mode .ks2-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ks2-mode .ks2-head p { font-size: 12px; color: var(--muted); }
.ks2-mode .ks2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ks2-mode .ks2-card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.ks2-mode .ks2-card-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.ks2-mode .ks2-finish-badge { position: absolute; bottom: 12px; left: 12px; background: var(--dark); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
.ks2-mode .ks2-card-body { padding: 18px 20px; }
.ks2-mode .ks2-card-body h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ks2-mode .ks2-card-p { font-size: 11px; color: var(--muted); margin: 0 0 10px; }
.ks2-mode .ks2-card-specs { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--ink); margin-bottom: 12px; }
.ks2-mode .ks2-card-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks2-mode .ks2-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks2-mode .ks2-status { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 3: WARM COURTYARD BROCHURE (ks3-mode)
   ========================================================================= */
.ks3-mode .ks3-cover { height: 100%; display: flex; flex-direction: column; }
.ks3-mode .ks3-banner { font-size: 11px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 20px; text-align: center; }
.ks3-mode .ks3-hero { height: 480px; border-radius: 20px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 36px; margin-bottom: 24px; }
.ks3-mode .ks3-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(44, 36, 29, 0.8) 100%); border-radius: 20px; }
.ks3-mode .ks3-hero-content { position: relative; z-index: 2; color: #fff; }
.ks3-mode .ks3-tag { font-size: 11px; letter-spacing: 0.2em; font-weight: 800; opacity: 0.9; }
.ks3-mode .ks3-hero-content h1 { font-family: var(--hf); font-size: 44px; margin: 6px 0 0; }
.ks3-mode .ks3-lead { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin-bottom: 16px; }
.ks3-mode .ks3-pattern-tags { display: flex; gap: 14px; font-size: 11.5px; font-weight: 700; color: var(--dark); }
.ks3-mode .ks3-head { margin-bottom: 20px; text-align: center; }
.ks3-mode .ks3-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ks3-mode .ks3-head p { font-size: 12px; color: var(--muted); }
.ks3-mode .ks3-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ks3-mode .ks3-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); }
.ks3-mode .ks3-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.ks3-mode .ks3-badge { position: absolute; top: 12px; left: 12px; background: var(--acc); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
.ks3-mode .ks3-info { padding: 18px 20px; }
.ks3-mode .ks3-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ks3-mode .ks3-desc { font-size: 11px; color: var(--muted); margin: 0 0 10px; }
.ks3-mode .ks3-meta { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--ink); margin-bottom: 12px; }
.ks3-mode .ks3-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks3-mode .ks3-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks3-mode .ks3-ready { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 4: HEAVY COMMERCIAL TRAFFIC MATRIX (ks4-mode 140 MPa)
   ========================================================================= */
.ks4-mode .ks4-cover { height: 100%; display: flex; flex-direction: column; }
.ks4-mode .ks4-eng-bar { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 10px 18px; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; border-radius: 6px; margin-bottom: 24px; }
.ks4-mode .ks4-split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; flex: 1; align-items: center; }
.ks4-mode .ks4-spec-code { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.ks4-mode .ks4-left h1 { font-family: var(--hf); font-size: 44px; margin: 8px 0 14px; line-height: 1.1; color: var(--ink); }
.ks4-mode .ks4-line { width: 60px; height: 3px; background: var(--acc); margin-bottom: 16px; }
.ks4-mode .ks4-left p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ks4-mode .ks4-matrix-boxes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ks4-mode .ks4-matrix-boxes div { background: var(--soft); padding: 12px 14px; border-radius: 8px; text-align: center; }
.ks4-mode .ks4-matrix-boxes b { display: block; font-size: 16px; color: var(--dark); font-weight: 800; }
.ks4-mode .ks4-matrix-boxes span { font-size: 10px; color: var(--muted); }
.ks4-mode .ks4-right { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ks4-mode .ks4-cert-stamp { position: absolute; bottom: 20px; right: 20px; background: rgba(15, 23, 42, 0.9); color: #fff; padding: 8px 16px; font-size: 10px; font-weight: 800; border-radius: 6px; }
.ks4-mode .ks4-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 8px; }
.ks4-mode .ks4-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ks4-mode .ks4-head p { font-size: 11.5px; color: var(--muted); }
.ks4-mode .ks4-table-wrap { background: #ffffff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.ks4-mode .ks4-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
.ks4-mode .ks4-table th { background: var(--dark); color: #fff; padding: 12px 14px; text-align: left; font-size: 10px; letter-spacing: 0.1em; }
.ks4-mode .ks4-table td { padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.ks4-mode .ks4-thumb { width: 50px; height: 50px; border-radius: 8px; background-size: cover; background-position: center; }
.ks4-mode .ks4-table td b { display: block; font-size: 12px; color: var(--ink); }
.ks4-mode .ks4-table td small { font-size: 10px; color: var(--muted); }
.ks4-mode .ks4-price { background: var(--soft); color: var(--acc); font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.ks4-mode .ks4-infra-note { font-size: 11px; background: var(--soft); padding: 12px 16px; border-radius: 8px; color: var(--dark); border-left: 4px solid var(--acc); }

/* =========================================================================
   STYLE SUITE 5: LUXURY VILLA LANDSCAPING (ks5-mode)
   ========================================================================= */
.ks5-mode .ks5-cover { height: 100%; display: flex; flex-direction: column; }
.ks5-mode .ks5-tag { text-align: center; font-size: 11px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 20px; }
.ks5-mode .ks5-hero { height: 480px; border-radius: 20px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 36px; margin-bottom: 24px; }
.ks5-mode .ks5-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(20, 83, 45, 0.8) 100%); border-radius: 20px; }
.ks5-mode .ks5-hero-title { position: relative; z-index: 2; color: #fff; }
.ks5-mode .ks5-pool-sub { font-size: 10.5px; letter-spacing: 0.2em; font-weight: 800; opacity: 0.9; }
.ks5-mode .ks5-hero-title h1 { font-family: var(--hf); font-size: 44px; margin: 6px 0 0; }
.ks5-mode .ks5-lead { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin-bottom: 18px; }
.ks5-mode .ks5-pills { display: flex; gap: 16px; font-size: 11.5px; font-weight: 700; color: var(--dark); }
.ks5-mode .ks5-head { margin-bottom: 20px; text-align: center; }
.ks5-mode .ks5-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ks5-mode .ks5-head p { font-size: 12px; color: var(--muted); }
.ks5-mode .ks5-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ks5-mode .ks5-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); }
.ks5-mode .ks5-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.ks5-mode .ks5-finish { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9.5px; padding: 4px 10px; border-radius: 6px; }
.ks5-mode .ks5-info { padding: 18px 20px; }
.ks5-mode .ks5-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ks5-mode .ks5-note { font-size: 11px; color: var(--muted); margin: 0 0 10px; }
.ks5-mode .ks5-specs { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--ink); margin-bottom: 12px; }
.ks5-mode .ks5-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks5-mode .ks5-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks5-mode .ks5-ready { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 6: DIMENSIONAL SLABS & CLADDING (ks6-mode)
   ========================================================================= */
.ks6-mode .ks6-cover { height: 100%; display: flex; flex-direction: column; }
.ks6-mode .ks6-top-strip { text-align: center; font-size: 10.5px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 24px; }
.ks6-mode .ks6-split { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: center; }
.ks6-mode .ks6-code { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.ks6-mode .ks6-text h1 { font-family: var(--hf); font-size: 42px; margin: 8px 0 14px; line-height: 1.1; color: var(--ink); }
.ks6-mode .ks6-text p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ks6-mode .ks6-specs-box { display: flex; flex-direction: column; gap: 8px; }
.ks6-mode .ks6-specs-box div { background: var(--soft); padding: 10px 14px; border-radius: 8px; font-size: 11.5px; color: var(--ink); }
.ks6-mode .ks6-hero-img { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ks6-mode .ks6-badge { position: absolute; bottom: 20px; right: 20px; background: var(--acc); color: #fff; padding: 6px 14px; font-size: 10px; font-weight: 800; border-radius: 6px; }
.ks6-mode .ks6-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 8px; }
.ks6-mode .ks6-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ks6-mode .ks6-head p { font-size: 11.5px; color: var(--muted); }
.ks6-mode .ks6-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ks6-mode .ks6-card { background: #ffffff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.ks6-mode .ks6-img { height: 160px; background-size: cover; background-position: center; position: relative; }
.ks6-mode .ks6-cal { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9.5px; padding: 3px 8px; border-radius: 6px; }
.ks6-mode .ks6-info { padding: 16px 18px; }
.ks6-mode .ks6-info h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 6px; }
.ks6-mode .ks6-p { font-size: 11px; color: var(--muted); margin: 0 0 10px; }
.ks6-mode .ks6-meta { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--ink); margin-bottom: 12px; }
.ks6-mode .ks6-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks6-mode .ks6-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks6-mode .ks6-moq { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 7: FORTRESS CHEQUER & COBBLES (ks7-mode)
   ========================================================================= */
.ks7-mode .ks7-cover { height: 100%; display: flex; flex-direction: column; }
.ks7-mode .ks7-badge-top { text-align: center; font-size: 10.5px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 24px; }
.ks7-mode .ks7-split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; flex: 1; align-items: center; }
.ks7-mode .ks7-tag { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.ks7-mode .ks7-left h1 { font-family: var(--hf); font-size: 44px; margin: 8px 0 14px; line-height: 1.1; color: var(--ink); }
.ks7-mode .ks7-left p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ks7-mode .ks7-chips { display: flex; flex-direction: column; gap: 8px; }
.ks7-mode .ks7-chips div { background: var(--soft); padding: 10px 14px; border-radius: 8px; font-size: 11.5px; color: var(--dark); font-weight: 700; }
.ks7-mode .ks7-right { height: 500px; border-radius: 16px; background-size: cover; background-position: center; position: relative; }
.ks7-mode .ks7-ramp-tag { position: absolute; bottom: 20px; left: 20px; background: var(--dark); color: #fff; padding: 6px 14px; font-size: 10px; font-weight: 800; border-radius: 4px; }
.ks7-mode .ks7-head { margin-bottom: 20px; text-align: center; }
.ks7-mode .ks7-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ks7-mode .ks7-head p { font-size: 12px; color: var(--muted); }
.ks7-mode .ks7-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ks7-mode .ks7-card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.ks7-mode .ks7-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.ks7-mode .ks7-traction { position: absolute; top: 12px; right: 12px; background: var(--acc); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
.ks7-mode .ks7-body { padding: 18px 20px; }
.ks7-mode .ks7-body h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ks7-mode .ks7-desc { font-size: 11px; color: var(--muted); margin: 0 0 10px; }
.ks7-mode .ks7-specs { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--ink); margin-bottom: 12px; }
.ks7-mode .ks7-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ks7-mode .ks7-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks7-mode .ks7-unit { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 8: GLOBAL LIMESTONE EXPORT DOSSIER (ks8-mode)
   ========================================================================= */
.ks8-mode .ks8-cover { height: 100%; display: flex; flex-direction: column; }
.ks8-mode .ks8-marine-bar { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 10px 18px; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; border-radius: 6px; margin-bottom: 24px; }
.ks8-mode .ks8-split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; flex: 1; align-items: center; }
.ks8-mode .ks8-stamp { font-size: 10.5px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; display: block; margin-bottom: 10px; }
.ks8-mode .ks8-left h1 { font-family: var(--hf); font-size: 44px; margin: 0 0 14px; line-height: 1.1; color: var(--ink); }
.ks8-mode .ks8-left p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ks8-mode .ks8-matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ks8-mode .ks8-box { background: var(--soft); padding: 12px 14px; border-radius: 8px; text-align: center; }
.ks8-mode .ks8-box b { display: block; font-size: 16px; color: var(--dark); font-weight: 800; }
.ks8-mode .ks8-box span { font-size: 10px; color: var(--muted); }
.ks8-mode .ks8-right { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ks8-mode .ks8-sea-tag { position: absolute; bottom: 20px; right: 20px; background: rgba(11, 25, 44, 0.9); color: #fff; padding: 8px 16px; font-size: 10px; font-weight: 800; border-radius: 6px; }
.ks8-mode .ks8-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 8px; }
.ks8-mode .ks8-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ks8-mode .ks8-head p { font-size: 11.5px; color: var(--muted); }
.ks8-mode .ks8-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ks8-mode .ks8-card { background: #ffffff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.ks8-mode .ks8-card-head { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 8px 12px; font-size: 9.5px; font-weight: 700; }
.ks8-mode .ks8-img { height: 160px; background-size: cover; background-position: center; }
.ks8-mode .ks8-body { padding: 14px 16px; }
.ks8-mode .ks8-body h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 10px; }
.ks8-mode .ks8-tbl { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
.ks8-mode .ks8-tbl td { padding: 4px 0; border-bottom: 1px dotted var(--line); color: var(--muted); }
.ks8-mode .ks8-tbl td b { color: var(--ink); }
.ks8-mode .ks8-foot { display: flex; justify-content: space-between; align-items: center; }
.ks8-mode .ks8-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ks8-mode .ks8-moq { font-size: 10px; background: var(--soft); padding: 3px 8px; border-radius: 4px; font-weight: 700; }
`;

const KOTASTONE_TEMPLATES = { list: TEMPLATES, css: CSS, render, pageCount };
if (typeof window !== 'undefined') { window.KOTASTONE_TEMPLATES = KOTASTONE_TEMPLATES; }
export default KOTASTONE_TEMPLATES;
export { TEMPLATES, CSS, render, pageCount };
