/* Sand Stone Catalogue Templates (8 dedicated structurally distinct architectural templates)
   Specialized for Jodhpur Sandstone, Teakwood, Rainbow, Dholpur, Hand-chiseled rockface & Cladding */

const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => (s || '').toUpperCase();
const pn = n => String(n).padStart(2, '0');
const bg = u => u ? `background-image:url(${u})` : '';

const th = (name, bg, ink, muted, acc, dark, soft, line, onDark) => ({ name, bg, ink, muted, acc, dark, soft, line, onDark });

const TEMPLATES = [
  {
    id: 'ss-1',
    cat: 'Sand Stone Specialty',
    name: 'Royal Jodhpur Desert Gold Heritage',
    desc: 'Warm golden ochre, palace facades, hand-carved arches, heritage temple architecture',
    theme: th('Desert Gold & Regal Sand', '#fcf8f0', '#2d2013', '#6e543c', '#c27803', '#4a2c0f', '#f4ebd8', '#e2cfaf', '#fffdf9'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Heritage Jodhpur Gold'
  },
  {
    id: 'ss-2',
    cat: 'Sand Stone Specialty',
    name: 'Rainbow & Teakwood Exotic Veined Slabs',
    desc: 'Vibrant natural swirl patterns, bookmatched luxury feature walls, high-honed & polished finishes',
    theme: th('Teakwood Brown & Crimson', '#fbf5f2', '#311910', '#76493b', '#b91c1c', '#4a1506', '#f6e7e1', '#e8cec3', '#ffffff'),
    hf: "'Cormorant Garamond', serif",
    bf: "'Inter', sans-serif",
    badge: 'Exotic Vein Patterns'
  },
  {
    id: 'ss-3',
    cat: 'Sand Stone Specialty',
    name: 'Dholpur Beige & Crimson Facade Cladding',
    desc: 'Classic imperial beige & red stone, ventilated wall cladding, freeze-thaw certified durability',
    theme: th('Imperial Dholpur Cream', '#fdfbf7', '#252119', '#63594b', '#9a3412', '#3c2415', '#f2ece0', '#ddd2be', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Facade Engineering'
  },
  {
    id: 'ss-4',
    cat: 'Sand Stone Specialty',
    name: 'Hand-Chiseled Rustic Rockface & Strips',
    desc: 'Natural split textured rockface, dry-stacked boundary masonry, rustic luxury resort aesthetic',
    theme: th('Rustic Ochre & Slate', '#f7f6f2', '#21241f', '#585c54', '#78350f', '#363a32', '#e8e7de', '#cfcec2', '#ffffff'),
    hf: "'Playfair Display', serif",
    bf: "'Inter', sans-serif",
    badge: 'Hand-Chiseled Craft'
  },
  {
    id: 'ss-5',
    cat: 'Sand Stone Specialty',
    name: 'Calibrated Patio Flagstones & Pool Coping',
    desc: 'Precision sawn patio paving, tumbled edges, bullnose pool copings, anti-slip water resistant',
    theme: th('Warm Sand & Mediterranean', '#f9f7f4', '#1f2421', '#545c57', '#0284c7', '#1b3b36', '#e7edea', '#cad6d0', '#ffffff'),
    hf: "'Inter', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Patio & Pool Coping'
  },
  {
    id: 'ss-6',
    cat: 'Sand Stone Specialty',
    name: 'Monolithic Landscape Steps & Cobbles',
    desc: 'Solid quarry-cut steps, garden walkways, heavy vehicular driveway cobbles, timeless landscape',
    theme: th('Earth Stone & Forest', '#f5f7f3', '#1c2419', '#4d5947', '#15803d', '#283824', '#e2ebd9', '#c4d7b7', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'Heavy Landscaping'
  },
  {
    id: 'ss-7',
    cat: 'Sand Stone Specialty',
    name: 'Artisanal Jali Screens, Fountains & Brackets',
    desc: 'High-intricacy CNC & hand-carved stone screens, fountains, pillar capitals, balustrades',
    theme: th('Palatial Sand & Amber', '#fcf6ec', '#322214', '#79583b', '#d97706', '#52341b', '#fae9d0', '#e9cba3', '#ffffff'),
    hf: "'Cinzel', serif",
    bf: "'Inter', sans-serif",
    badge: 'Artisanal Carvings'
  },
  {
    id: 'ss-8',
    cat: 'Sand Stone Specialty',
    name: 'International Stone Export & Technical Dossier',
    desc: 'Global architectural dossier, ASTM C616 standard, sea-worthy wooden crate packing, density metrics',
    theme: th('Global Marine Slate', '#f3f6f9', '#0f172a', '#475569', '#2563eb', '#1e293b', '#e2e8f0', '#cbd5e1', '#ffffff'),
    hf: "'Outfit', sans-serif",
    bf: "'Inter', sans-serif",
    badge: 'ASTM Certified Export'
  }
];

const head = (c, label, no) => `
  <div class="ss-head">
    <div class="ss-head-brand">
      <span class="ss-stone-icon">🏛️</span>
      <strong>${E(c.info.ent || 'NATURAL SANDSTONE')}</strong>
    </div>
    <span class="ss-head-tag">${E(label)}</span>
    <span class="ss-head-num">${pn(no)}</span>
  </div>
`;

const foot = c => `
  <div class="ss-foot">
    <span>${E(c.info.ent || '')} &bull; Natural Architectural Sandstone &amp; Quarry Works</span>
    <span>☎ ${E(c.info.mobile || '')} ${c.info.email ? `&bull; ${E(c.info.email)}` : ''}</span>
  </div>
`;

function contactPage(c, no) {
  const i = c.info, qrs = c.qrs || [];
  return `
    ${head(c, 'ARCHITECTURAL DESK & PROCUREMENT', no)}
    <div class="ss-contact-wrap">
      <div class="ss-contact-banner">
        <span class="ss-badge-arch">PROJECT CONSULTATION &amp; QUARRY SUPPLY</span>
        <h2 class="ss-contact-h2">Architectural Procurement Desk</h2>
        <p class="ss-contact-p">
          We partner with architects, landscape planners, heritage restoration bodies, and facade contractors to supply custom-sawn dimension stone, carved jalis, and calibrated paving with guaranteed ASTM C616 structural compliance.
        </p>
      </div>

      <div class="ss-contact-details-grid">
        <div class="ss-detail-card">
          <h3>🏛️ Quarry &amp; Processing Yards</h3>
          <p><strong>Enterprise:</strong> ${E(i.ent || 'Heritage Sandstone Works')}</p>
          <p><strong>Quarry Base:</strong> ${E(i.addr || 'Stone Industrial Area, Jodhpur / Dholpur / Kota')}</p>
          ${i.gst ? `<p><strong>GST / Mining ID:</strong> ${E(i.gst)}</p>` : ''}
        </div>

        <div class="ss-detail-card">
          <h3>📐 Project Desk &amp; Quotations</h3>
          <p><strong>Consultant:</strong> ${E(i.person || 'Chief Stone Specialist')}</p>
          <p><strong>Direct Line:</strong> ${E(i.mobile || '+91 98765 43210')}</p>
          ${i.email ? `<p><strong>Email:</strong> ${E(i.email)}</p>` : ''}
          <p><strong>Standards:</strong> ASTM C616 &bull; IS 3622 Certified</p>
        </div>
      </div>

      <div class="ss-qr-section">
        <h3>Digital Architectural Catalogue &amp; 3D Textures</h3>
        <div class="ss-qr-row">
          ${qrs.length ? qrs.map(q => `
            <div class="ss-qr-pill">
              <img src="${q.img}" class="qrimg" alt="${q.label}" />
              <b>${E(q.label)}</b>
              <small>Scan to download drawings</small>
            </div>
          `).join('') : `
            <div class="ss-qr-pill">
              <div class="ss-qr-placeholder">🏛️</div>
              <b>Direct WhatsApp Desk</b>
              <small>${E(i.mobile || 'Connect for BOQ estimation')}</small>
            </div>
          `}
        </div>
      </div>
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 1: ROYAL JODHPUR DESERT GOLD (Arched Palace Heritage Frame)
   ========================================================================= */
function t1_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss1-cover">
      <div class="ss1-arch-header">
        <span class="ss1-tag">ROYAL RAJASTHAN STONE HERITAGE</span>
        <h1 class="ss1-h1">${E(i.ent || 'Jodhpur Desert Gold Sandstone')}</h1>
        <div class="ss1-gold-line"></div>
      </div>
      <div class="ss1-arch-portal">
        <div class="ss1-portal-img" style="${bg(hero)}">
          <div class="ss1-palace-seal">IMPERIAL QUARRY HERITAGE</div>
        </div>
      </div>
      <div class="ss1-arch-footer">
        <p class="ss1-lead">${E(i.desc || 'Celebrated across royal palaces, historic forts, and luxury modern retreats. Prized for its glowing desert gold hue, fine grain consistency, and centuries-long weather resistance.')}</p>
        <div class="ss1-pills">
          <span>✓ Hand-Selected Slabs</span>
          <span>✓ Zero Weather Discoloration</span>
          <span>✓ Hand-Carved Arch Specialists</span>
        </div>
      </div>
    </div>
  `;
}

function t1_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `ROYAL HERITAGE DIMENSION RANGE (${pageIdx}/${totalPages})`, no)}
    <div class="ss1-head">
      <h2>Desert Gold Architectural Formats</h2>
      <p>Precision calibrated slabs, palace jharokhas, and hand-chiseled masonry blocks</p>
    </div>
    <div class="ss1-grid">
      ${slice.map((it, idx) => `
        <div class="ss1-card">
          <div class="ss1-card-img" style="${bg(it.img)}">
            <span class="ss1-code">${E(it.code || `#JDH-${pn(idx + 1)}`)}</span>
          </div>
          <div class="ss1-card-body">
            <h3>${E(it.name)}</h3>
            <div class="ss1-finish-tag">Heritage Jodhpur Sawn / Honed</div>
            <div class="ss1-specs">
              <div><b>Thickness:</b> ${E(it.thickness || '25 - 40 mm')}</div>
              <div><b>Standard:</b> ASTM C616 Certified</div>
            </div>
            <div class="ss1-foot">
              <span class="ss1-price">${E(it.price || 'Inquire Quote')}</span>
              <span class="ss1-moq">Project Ready</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 2: RAINBOW & TEAKWOOD EXOTIC (Bookmatched Symmetrical Feature Spread)
   ========================================================================= */
function t2_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss2-cover">
      <div class="ss2-top-bar">
        <span>BOOKMATCHED EXOTIC VEINS &bull; ARCHITECTURAL LUXURY</span>
      </div>
      <div class="ss2-butterfly-wrap">
        <div class="ss2-butterfly-slab left" style="${bg(hero)}"></div>
        <div class="ss2-butterfly-slab right" style="${bg(hero)}"></div>
        <div class="ss2-butterfly-badge">BOOKMATCHED SYMMETRY</div>
      </div>
      <div class="ss2-hero-info">
        <span class="ss2-sub">NATURAL MINERAL WAVE PATTERNS</span>
        <h1>${E(i.ent || 'Teakwood &amp; Rainbow Sandstone')}</h1>
        <p>${E(i.desc || 'Dramatic flowing grain patterns mimicking organic woodgrain and desert sand dunes. Sawn with micro-millimeter precision for spectacular bookmatched feature walls and luxury hospitality foyers.')}</p>
      </div>
    </div>
  `;
}

function t2_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `EXOTIC VEINED SLAB SELECTION (${pageIdx}/${totalPages})`, no)}
    <div class="ss2-head">
      <h2>Continuous Vein Slabs &amp; Accent Panels</h2>
      <p>Sequential quarry gangsaw slabs calibrated for bookmatched installation</p>
    </div>
    <div class="ss2-grid">
      ${slice.map((it, idx) => `
        <div class="ss2-card">
          <div class="ss2-img" style="${bg(it.img)}">
            <span class="ss2-pattern-tag">Flowing Veins</span>
          </div>
          <div class="ss2-info">
            <h3>${E(it.name)}</h3>
            <p class="ss2-note">Natural mineral swirls &bull; Honed satin smooth touch &bull; 6-side precision sawn.</p>
            <div class="ss2-spec-row">
              <span><b>Density:</b> 2.45 g/cm³</span>
              <span><b>Finish:</b> Honed / Polished</span>
            </div>
            <div class="ss2-foot">
              <span class="ss2-price">${E(it.price || 'Wholesale Inquire')}</span>
              <span class="ss2-status">Gangsaw Ready</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 3: DHOLPUR BEIGE & CRIMSON FACADE (Engineered Rain-screen Grid)
   ========================================================================= */
function t3_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss3-cover">
      <div class="ss3-eng-header">
        <span>VENTILATED FACADE ENGINEERING &bull; ASTM C616 COMPLIANT</span>
        <span>THERMAL BARRIER RATING: CLASS A</span>
      </div>
      <div class="ss3-split">
        <div class="ss3-left">
          <span class="ss3-code-tag">DHOLPUR STONE SPEC</span>
          <h1>${E(i.ent || 'Dholpur Beige &amp; Crimson Facades')}</h1>
          <div class="ss3-rule"></div>
          <p>${E(i.desc || 'Engineered rainscreen cladding panels. Calibrated for stainless steel anchor pin dry-hanging systems. Resistant to harsh freeze-thaw cycles, solar UV radiation, and atmospheric pollutants.')}</p>
          <div class="ss3-bracket-specs">
            <div><b>Compression:</b> 75 MPa</div>
            <div><b>Absorption:</b> &lt;1.8%</div>
            <div><b>Density:</b> 2.40 g/cm³</div>
          </div>
        </div>
        <div class="ss3-right" style="${bg(hero)}">
          <div class="ss3-cladding-badge">DRY CLADDING CERTIFIED</div>
        </div>
      </div>
    </div>
  `;
}

function t3_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `FACADE CLADDING PANELS (${pageIdx}/${totalPages})`, no)}
    <div class="ss3-head">
      <h2>Calibrated Exterior Wall Cladding Formats</h2>
      <p>Precision grooved edges for SS 316 dry-cladding Z-brackets and anchors</p>
    </div>
    <div class="ss3-grid">
      ${slice.map((it, idx) => `
        <div class="ss3-card">
          <div class="ss3-card-head">
            <span>PANEL REF #${pn(idx + 1)}</span>
            <span>${E(it.finish || 'Shotblasted / Honed')}</span>
          </div>
          <div class="ss3-img" style="${bg(it.img)}"></div>
          <div class="ss3-body">
            <h3>${E(it.name)}</h3>
            <table class="ss3-tbl">
              <tr><td>Sizes:</td><td><b>${E(it.size || '600x300 / 600x600 mm')}</b></td></tr>
              <tr><td>Edge Profile:</td><td>Calibrated &amp; Chamfered</td></tr>
              <tr><td>Anchor System:</td><td>Undercut / Kerf Slot Ready</td></tr>
            </table>
            <div class="ss3-foot">
              <span class="ss3-price">${E(it.price || 'Project Rate')}</span>
              <span class="ss3-sqft">Per Sq. Ft / Meter</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 4: HAND-CHISELED RUSTIC ROCKFACE (Textured 3D Ledger Stone)
   ========================================================================= */
function t4_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss4-cover">
      <div class="ss4-masthead">
        <span>RUSTIC LUXURY &bull; HAND-CHISELED ARTISANAL MASONRY</span>
        <h1>${E(i.ent || 'Natural Rockface &amp; Split Wall Strips')}</h1>
      </div>
      <div class="ss4-split-rock">
        <div class="ss4-rock-hero" style="${bg(hero)}">
          <div class="ss4-craft-seal">HAND-DRESSED NATURAL CLEFT</div>
        </div>
        <div class="ss4-rock-text">
          <p class="ss4-p">${E(i.desc || 'Hand-chiseled by hereditary stone masons. Rich relief textures with dramatic organic shadow play, bringing tactile earthiness to modern villa boundary walls, fireplaces, and resort facades.')}</p>
          <div class="ss4-chisel-points">
            <div>⚒️ 100% Solid Natural Split</div>
            <div>⚒️ Interlocking Z-Panels Available</div>
            <div>⚒️ Zero Maintenance Natural Finish</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function t4_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `RUSTIC ROCKFACE WALL SELECTION (${pageIdx}/${totalPages})`, no)}
    <div class="ss4-head">
      <h2>Hand-Split Ledger Stone &amp; Masonry Strips</h2>
      <p>Natural cleft relief surface &bull; Suitable for interior accent walls and heavy exterior cladding</p>
    </div>
    <div class="ss4-grid">
      ${slice.map((it, idx) => `
        <div class="ss4-card">
          <div class="ss4-img" style="${bg(it.img)}">
            <span class="ss4-relief">3D Natural Relief</span>
          </div>
          <div class="ss4-info">
            <h3>${E(it.name)}</h3>
            <p class="ss4-desc">Hand-chiseled face &bull; Sawn flat back for rapid adhesive installation.</p>
            <div class="ss4-specs">
              <span><b>Thickness:</b> 20-35 mm varied relief</span>
              <span><b>Type:</b> Split Face</span>
            </div>
            <div class="ss4-foot">
              <span class="ss4-price">${E(it.price || 'Direct Yard Price')}</span>
              <span class="ss4-stock">In Stock</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 5: CALIBRATED PATIO & POOL COPING (Landscape & Poolside Layout)
   ========================================================================= */
function t5_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss5-cover">
      <div class="ss5-top-strip">
        <span>OUTDOOR LIVING &bull; POOLSIDE &bull; CALIBRATED PAVING</span>
      </div>
      <div class="ss5-hero-landscape" style="${bg(hero)}">
        <div class="ss5-overlay"></div>
        <div class="ss5-hero-title">
          <span class="ss5-water-tag">ANTI-SLIP &bull; WATER RESISTANT</span>
          <h1>${E(i.ent || 'Patio Flagstones &amp; Pool Coping')}</h1>
        </div>
      </div>
      <div class="ss5-summary-row">
        <div class="ss5-box"><b>SRT 65+</b><span>Anti-Skid Wet Friction</span></div>
        <div class="ss5-box"><b>Calibrated</b><span>Exact 22mm Thickness</span></div>
        <div class="ss5-box"><b>Bullnose</b><span>Hand-Finished Pool Edges</span></div>
      </div>
      <p class="ss5-desc">${E(i.desc || 'Premium thermal-resistant patio pavers that remain comfortably cool under direct sunlight. Salt-water pool certified with hand-finished bullnose and drop-face copings.')}</p>
    </div>
  `;
}

function t5_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `PATIO PAVERS & POOL COPING (${pageIdx}/${totalPages})`, no)}
    <div class="ss5-head">
      <h2>Calibrated Outdoor Paving &amp; Edge Profiles</h2>
      <p>Precision 6-side sawn pavers with anti-skid sandblasted or tumbled texture</p>
    </div>
    <div class="ss5-grid">
      ${slice.map((it, idx) => `
        <div class="ss5-card">
          <div class="ss5-img" style="${bg(it.img)}">
            <span class="ss5-edge-badge">${E(it.finish || 'Tumbled / Bullnose')}</span>
          </div>
          <div class="ss5-body">
            <h3>${E(it.name)}</h3>
            <div class="ss5-specs-pill">
              <span>Size: ${E(it.size || '600x900 mm')}</span>
              <span>Calibrated: 22 mm</span>
            </div>
            <p class="ss5-note">Cool-touch surface under summer heat &bull; Salt and chlorine resistant.</p>
            <div class="ss5-foot">
              <span class="ss5-price">${E(it.price || 'Wholesale Paving')}</span>
              <span class="ss5-pallet">Crate Packed</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 6: MONOLITHIC LANDSCAPE STEPS & COBBLES (Heavy Dimension Stone)
   ========================================================================= */
function t6_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss6-cover">
      <div class="ss6-header">
        <span>HEAVY INFRASTRUCTURE &bull; SOLID MONOLITHIC DIMENSION STONE</span>
        <span>LOAD RATING: CLASS D400</span>
      </div>
      <div class="ss6-split">
        <div class="ss6-text">
          <span class="ss6-tag">QUARRY CUT DIMENSIONS</span>
          <h1>${E(i.ent || 'Monolithic Steps &amp; Paving Cobbles')}</h1>
          <p>${E(i.desc || 'Solid quarry-cut massive stone steps, curbs, and heavy vehicular driveway cobblestones. Engineered to withstand decades of foot and vehicle traffic without cracking or deterioration.')}</p>
          <div class="ss6-caps">
            <div><b>Solid Steps:</b> 1000x350x150 mm</div>
            <div><b>Cobblestones:</b> 100x100x80 mm</div>
            <div><b>Curbs:</b> Radius &amp; Straight Sawn</div>
          </div>
        </div>
        <div class="ss6-img-col" style="${bg(hero)}">
          <div class="ss6-stamp">HEAVY VEHICULAR DUTY</div>
        </div>
      </div>
    </div>
  `;
}

function t6_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `MONOLITHIC STEPS & COBBLES (${pageIdx}/${totalPages})`, no)}
    <div class="ss6-head">
      <h2>Dimensional Steps, Curbs &amp; Driveway Sets</h2>
      <p>Solid quarry blocks &bull; Flame-textured or natural split top for non-skid vehicular traction</p>
    </div>
    <div class="ss6-grid">
      ${slice.map((it, idx) => `
        <div class="ss6-card">
          <div class="ss6-img" style="${bg(it.img)}">
            <span class="ss6-code">#MST-${pn(idx + 1)}</span>
          </div>
          <div class="ss6-info">
            <h3>${E(it.name)}</h3>
            <div class="ss6-data">
              <div><b>Format:</b> Solid Quarry Cut</div>
              <div><b>Dimensions:</b> ${E(it.size || 'Standard Specification')}</div>
            </div>
            <div class="ss6-foot">
              <span class="ss6-price">${E(it.price || 'Bulk Quarry Rate')}</span>
              <span class="ss6-moq">Full Truckload</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 7: ARTISANAL JALI SCREENS & CARVINGS (Intricate Pierced Lattice)
   ========================================================================= */
function t7_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss7-cover">
      <div class="ss7-masthead">
        <span class="ss7-sub">TRADITIONAL STONE ATELIER &bull; CNC &amp; HAND CRAFT</span>
        <h1 class="ss7-h1">${E(i.ent || 'Hand-Carved Jalis &amp; Stone Screens')}</h1>
        <div class="ss7-gold-line"></div>
      </div>
      <div class="ss7-jali-hero">
        <div class="ss7-jali-photo" style="${bg(hero)}">
          <div class="ss7-jali-overlay"></div>
          <div class="ss7-jali-seal">PIERCED LATTICE SCREENS</div>
        </div>
      </div>
      <p class="ss7-p">${E(i.desc || 'Exquisite geometric and floral pierced stone jali screens, monumental fountain bowls, pillar brackets, and temple balustrades. Providing natural breeze ventilation, ambient daylight diffusion, and eternal regal privacy.')}</p>
    </div>
  `;
}

function t7_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `CARVED JALIS & ARCHITECTURAL MOTIFS (${pageIdx}/${totalPages})`, no)}
    <div class="ss7-head">
      <h2>Pierced Stone Screens &amp; Ornamentation</h2>
      <p>Custom CNC precision cutting combined with hereditary artisan hand-chiseling</p>
    </div>
    <div class="ss7-grid">
      ${slice.map((it, idx) => `
        <div class="ss7-card">
          <div class="ss7-img" style="${bg(it.img)}">
            <span class="ss7-lattice-tag">Pierced Jali</span>
          </div>
          <div class="ss7-info">
            <h3>${E(it.name)}</h3>
            <p class="ss7-note">Custom pattern designs &bull; 40-50mm thick solid natural sandstone panel.</p>
            <div class="ss7-specs">
              <span>Thickness: ${E(it.thickness || '40-50 mm')}</span>
              <span>Craft: Hand &amp; CNC</span>
            </div>
            <div class="ss7-foot">
              <span class="ss7-price">${E(it.price || 'Custom Drawing Quote')}</span>
              <span class="ss7-craft">Atelier Made</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${foot(c)}
  `;
}

/* =========================================================================
   TEMPLATE 8: INTERNATIONAL STONE EXPORT DOSSIER (ASTM C616 Blueprint)
   ========================================================================= */
function t8_cover(c, t) {
  const i = c.info, hero = c.hero || (c.items[0] && c.items[0].img) || '';
  return `
    <div class="ss8-cover">
      <div class="ss8-marine-bar">
        <span>GLOBAL CONTAINERIZED STONE EXPORT DOSSIER</span>
        <span>ISPM-15 CERTIFIED FUMIGATION</span>
      </div>
      <div class="ss8-hero-grid">
        <div class="ss8-left">
          <span class="ss8-stamp">EXPORT COMPLIANCE ASTM C616</span>
          <h1>${E(i.ent || 'International Sandstone Export')}</h1>
          <p>${E(i.desc || 'Containerized natural sandstone export to European, North American, and GCC markets. Gangsaw sawn slabs, calibrated paving tiles, and steps packed in heavy fumigated wooden crates with moisture-barrier wrapping.')}</p>
          <div class="ss8-matrix">
            <div class="ss8-mbox"><b>27 - 28 MT</b><span>Container Payload</span></div>
            <div class="ss8-mbox"><b>ISPM-15</b><span>Fumigated Wood</span></div>
            <div class="ss8-mbox"><b>ASTM C616</b><span>Standard Spec</span></div>
            <div class="ss8-mbox"><b>FOB / CIF</b><span>Incoterms 2020</span></div>
          </div>
        </div>
        <div class="ss8-right" style="${bg(hero)}">
          <div class="ss8-crate-tag">SEAWORTHY PACKING</div>
        </div>
      </div>
    </div>
  `;
}

function t8_products(c, no, slice, pageIdx, totalPages) {
  return `
    ${head(c, `EXPORT SPECIFICATION MATRIX (${pageIdx}/${totalPages})`, no)}
    <div class="ss8-head">
      <h2>Export Crated Stone Formats &amp; Loading Specs</h2>
      <p>Precision calibration tolerance &plusmn;1mm &bull; Seaworthy reinforced crate packaging</p>
    </div>
    <div class="ss8-grid">
      ${slice.map((it, idx) => `
        <div class="ss8-card">
          <div class="ss8-card-head">
            <span>EXPORT BATCH #${pn(idx + 1)}</span>
            <span>ASTM COMPLIANT</span>
          </div>
          <div class="ss8-img" style="${bg(it.img)}"></div>
          <div class="ss8-body">
            <h3>${E(it.name)}</h3>
            <table class="ss8-tbl">
              <tr><td>Finish:</td><td><b>${E(it.finish || 'Honed / Sawn')}</b></td></tr>
              <tr><td>Density:</td><td>2.45 - 2.50 g/cm³</td></tr>
              <tr><td>Water Abs:</td><td>&lt;1.9%</td></tr>
              <tr><td>Packaging:</td><td>Fumigated Wooden Crates</td></tr>
            </table>
            <div class="ss8-foot">
              <span class="ss8-price">${E(it.price || 'FOB Mundra Rate')}</span>
              <span class="ss8-moq">1x20ft FCL</span>
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
  return 1 + Math.ceil(Math.max(1, n) / 4) + 1;
}

function render(t, ctx) {
  const th = t.theme;
  const items = (ctx.items || []).map((it, k) => Object.assign({ code: `#SS-${pn(k + 1)}` }, it));
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

  const wrap = (h, extraCls = '') => `<div class="pg sandstone-pg ${extraCls}" style="${style}">${h}</div>`;
  const P = [];
  let no = 1;

  if (t.id === 'ss-1') {
    P.push(wrap(t1_cover(c, t), 'ss1-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t1_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss1-mode'));
    }
  } else if (t.id === 'ss-2') {
    P.push(wrap(t2_cover(c, t), 'ss2-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t2_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss2-mode'));
    }
  } else if (t.id === 'ss-3') {
    P.push(wrap(t3_cover(c, t), 'ss3-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t3_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss3-mode'));
    }
  } else if (t.id === 'ss-4') {
    P.push(wrap(t4_cover(c, t), 'ss4-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t4_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss4-mode'));
    }
  } else if (t.id === 'ss-5') {
    P.push(wrap(t5_cover(c, t), 'ss5-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t5_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss5-mode'));
    }
  } else if (t.id === 'ss-6') {
    P.push(wrap(t6_cover(c, t), 'ss6-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t6_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss6-mode'));
    }
  } else if (t.id === 'ss-7') {
    P.push(wrap(t7_cover(c, t), 'ss7-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t7_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss7-mode'));
    }
  } else {
    // ss-8
    P.push(wrap(t8_cover(c, t), 'ss8-mode'));
    const perPage = 4;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    for (let k = 0; k < items.length; k += perPage) {
      P.push(wrap(t8_products(c, ++no, items.slice(k, k + perPage), Math.floor(k / perPage) + 1, totalPages), 'ss8-mode'));
    }
  }

  const modeTag = (t.id || 'ss-1').replace('ss-', 'ss') + '-mode';
  P.push(wrap(contactPage(c, ++no, t), modeTag));
  return P;
}

const CSS = `
.pg.sandstone-pg {
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
.sandstone-pg .ss-head {
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
.sandstone-pg .ss-head-brand { display: flex; align-items: center; gap: 6px; color: var(--ink); }
.sandstone-pg .ss-stone-icon { font-size: 14px; }
.sandstone-pg .ss-head-tag { color: var(--acc); font-weight: 700; }
.sandstone-pg .ss-head-num { font-weight: 800; color: var(--ink); }

.sandstone-pg .ss-foot {
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
.sandstone-pg .ss-contact-wrap { margin-top: 10px; }
.sandstone-pg .ss-contact-banner {
  background: var(--dark);
  color: var(--onDark);
  border-radius: 18px;
  padding: 34px 40px;
  margin-bottom: 24px;
}
.sandstone-pg .ss-badge-arch {
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
.sandstone-pg .ss-contact-h2 {
  font-family: var(--hf);
  font-size: 34px;
  margin: 0 0 10px;
}
.sandstone-pg .ss-contact-p {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.88;
  max-width: 600px;
  margin: 0;
}
.sandstone-pg .ss-contact-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.sandstone-pg .ss-detail-card {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
}
.sandstone-pg .ss-detail-card h3 {
  font-size: 14px;
  margin: 0 0 12px;
  color: var(--acc);
  letter-spacing: 0.04em;
}
.sandstone-pg .ss-detail-card p {
  font-size: 11.5px;
  margin: 0 0 8px;
  color: var(--ink);
  line-height: 1.5;
}
.sandstone-pg .ss-qr-section {
  background: var(--soft);
  border-radius: 16px;
  padding: 22px 28px;
  border: 1px solid var(--line);
}
.sandstone-pg .ss-qr-section h3 {
  font-size: 13px;
  letter-spacing: 0.08em;
  margin: 0 0 16px;
  color: var(--ink);
  text-align: center;
}
.sandstone-pg .ss-qr-row {
  display: flex;
  justify-content: center;
  gap: 28px;
}
.sandstone-pg .ss-qr-pill {
  text-align: center;
  background: #ffffff;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.sandstone-pg .ss-qr-pill img.qrimg {
  width: 90px;
  height: 90px;
  display: block;
  margin: 0 auto 8px;
}
.sandstone-pg .ss-qr-placeholder { font-size: 44px; margin-bottom: 4px; }
.sandstone-pg .ss-qr-pill b { display: block; font-size: 12px; color: #111827; }
.sandstone-pg .ss-qr-pill small { font-size: 9.5px; color: #6b7280; }

/* =========================================================================
   STYLE SUITE 1: ROYAL JODHPUR DESERT GOLD (ss1-mode)
   ========================================================================= */
.ss1-mode .ss1-cover { height: 100%; display: flex; flex-direction: column; text-align: center; }
.ss1-mode .ss1-arch-header { margin-bottom: 24px; }
.ss1-mode .ss1-tag { font-size: 11px; letter-spacing: 0.32em; color: var(--acc); font-weight: 800; }
.ss1-mode .ss1-h1 { font-family: var(--hf); font-size: 46px; margin: 8px 0; color: var(--ink); }
.ss1-mode .ss1-gold-line { width: 80px; height: 3px; background: var(--acc); margin: 0 auto; }
.ss1-mode .ss1-arch-portal {
  position: relative;
  height: 520px;
  border-radius: 200px 200px 16px 16px;
  overflow: hidden;
  border: 6px solid var(--acc);
  margin-bottom: 24px;
}
.ss1-mode .ss1-portal-img { width: 100%; height: 100%; background-size: cover; background-position: center; position: relative; }
.ss1-mode .ss1-palace-seal {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 6px 18px;
  border-radius: 20px;
  letter-spacing: 0.16em;
  white-space: nowrap;
}
.ss1-mode .ss1-lead { font-size: 13.5px; line-height: 1.7; color: var(--muted); max-width: 600px; margin: 0 auto 16px; }
.ss1-mode .ss1-pills { display: flex; justify-content: center; gap: 16px; }
.ss1-mode .ss1-pills span { font-size: 11px; color: var(--dark); font-weight: 700; background: var(--soft); padding: 5px 12px; border-radius: 12px; }
.ss1-mode .ss1-head { margin-bottom: 14px; text-align: center; }
.ss1-mode .ss1-head h2 { font-family: var(--hf); font-size: 24px; margin: 0 0 3px; }
.ss1-mode .ss1-head p { font-size: 11px; color: var(--muted); }
.ss1-mode .ss1-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
.ss1-mode .ss1-card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 4px 14px rgba(0,0,0,0.04); display: flex; flex-direction: column; height: 410px; max-height: 410px; box-sizing: border-box; }
.ss1-mode .ss1-card-img { height: 180px; min-height: 180px; max-height: 180px; background-size: cover; background-position: center; position: relative; }
.ss1-mode .ss1-code { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #fff; font-size: 8.5px; padding: 3px 8px; border-radius: 6px; }
.ss1-mode .ss1-card-body { padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; box-sizing: border-box; }
.ss1-mode .ss1-card-body h3 { font-family: var(--hf); font-size: 14.5px; margin: 0 0 4px; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ss1-mode .ss1-finish-tag { font-size: 10px; color: var(--acc); font-weight: 700; margin-bottom: 6px; }
.ss1-mode .ss1-specs { font-size: 10.5px; color: var(--muted); line-height: 1.4; margin-bottom: 8px; }
.ss1-mode .ss1-specs b { color: var(--ink); }
.ss1-mode .ss1-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 6px; margin-top: auto; }
.ss1-mode .ss1-price { font-size: 15px; font-weight: 800; color: var(--acc); line-height: 1; }
.ss1-mode .ss1-moq { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 2: RAINBOW & TEAKWOOD EXOTIC (ss2-mode Butterfly Bookmatch)
   ========================================================================= */
.ss2-mode .ss2-cover { height: 100%; display: flex; flex-direction: column; }
.ss2-mode .ss2-top-bar { text-align: center; font-size: 11px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; margin-bottom: 24px; }
.ss2-mode .ss2-butterfly-wrap {
  position: relative;
  height: 480px;
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
}
.ss2-mode .ss2-butterfly-slab {
  flex: 1;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
}
.ss2-mode .ss2-butterfly-slab.right { transform: scaleX(-1); }
.ss2-mode .ss2-butterfly-badge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 20px;
  letter-spacing: 0.16em;
  white-space: nowrap;
}
.ss2-mode .ss2-hero-info { text-align: center; max-width: 620px; margin: 0 auto; }
.ss2-mode .ss2-sub { font-size: 11px; letter-spacing: 0.2em; color: var(--muted); font-weight: 700; }
.ss2-mode .ss2-hero-info h1 { font-family: var(--hf); font-size: 44px; margin: 8px 0 12px; color: var(--ink); }
.ss2-mode .ss2-hero-info p { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0; }
.ss2-mode .ss2-head { margin-bottom: 20px; text-align: center; }
.ss2-mode .ss2-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ss2-mode .ss2-head p { font-size: 12px; color: var(--muted); }
.ss2-mode .ss2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ss2-mode .ss2-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); }
.ss2-mode .ss2-img { height: 190px; background-size: cover; background-position: center; position: relative; }
.ss2-mode .ss2-pattern-tag { position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.65); color: #fff; font-size: 9.5px; padding: 4px 10px; border-radius: 8px; }
.ss2-mode .ss2-info { padding: 18px 20px; }
.ss2-mode .ss2-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ss2-mode .ss2-note { font-size: 11px; color: var(--muted); line-height: 1.5; margin: 0 0 10px; }
.ss2-mode .ss2-spec-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink); padding: 6px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin-bottom: 12px; }
.ss2-mode .ss2-foot { display: flex; justify-content: space-between; align-items: center; }
.ss2-mode .ss2-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss2-mode .ss2-status { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 3: DHOLPUR BEIGE & CRIMSON FACADE (ss3-mode Rainscreen)
   ========================================================================= */
.ss3-mode .ss3-cover { height: 100%; display: flex; flex-direction: column; }
.ss3-mode .ss3-eng-header {
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
.ss3-mode .ss3-split { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: center; }
.ss3-mode .ss3-code-tag { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.ss3-mode .ss3-left h1 { font-family: var(--hf); font-size: 42px; margin: 10px 0 14px; line-height: 1.1; color: var(--ink); }
.ss3-mode .ss3-rule { width: 50px; height: 3px; background: var(--acc); margin-bottom: 16px; }
.ss3-mode .ss3-left p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ss3-mode .ss3-bracket-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ss3-mode .ss3-bracket-specs div { background: var(--soft); padding: 10px 8px; border-radius: 6px; text-align: center; font-size: 10.5px; color: var(--muted); }
.ss3-mode .ss3-bracket-specs b { display: block; font-size: 12px; color: var(--dark); margin-bottom: 2px; }
.ss3-mode .ss3-right { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ss3-mode .ss3-cladding-badge { position: absolute; bottom: 20px; right: 20px; background: var(--acc); color: #fff; padding: 8px 16px; font-size: 10px; font-weight: 800; border-radius: 6px; }
.ss3-mode .ss3-head { margin-bottom: 20px; border-bottom: 2px solid var(--line); padding-bottom: 8px; }
.ss3-mode .ss3-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ss3-mode .ss3-head p { font-size: 11.5px; color: var(--muted); }
.ss3-mode .ss3-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ss3-mode .ss3-card { background: #ffffff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.ss3-mode .ss3-card-head { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 8px 12px; font-size: 9.5px; font-weight: 700; }
.ss3-mode .ss3-img { height: 160px; background-size: cover; background-position: center; }
.ss3-mode .ss3-body { padding: 14px 16px; }
.ss3-mode .ss3-body h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 10px; }
.ss3-mode .ss3-tbl { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
.ss3-mode .ss3-tbl td { padding: 4px 0; border-bottom: 1px dotted var(--line); color: var(--muted); }
.ss3-mode .ss3-tbl td b { color: var(--ink); }
.ss3-mode .ss3-foot { display: flex; justify-content: space-between; align-items: center; }
.ss3-mode .ss3-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss3-mode .ss3-sqft { font-size: 10px; color: var(--muted); }

/* =========================================================================
   STYLE SUITE 4: HAND-CHISELED RUSTIC ROCKFACE (ss4-mode 3D Texture)
   ========================================================================= */
.ss4-mode .ss4-cover { height: 100%; display: flex; flex-direction: column; }
.ss4-mode .ss4-masthead { text-align: center; margin-bottom: 24px; }
.ss4-mode .ss4-masthead span { font-size: 10.5px; letter-spacing: 0.28em; color: var(--acc); font-weight: 800; }
.ss4-mode .ss4-masthead h1 { font-family: var(--hf); font-size: 42px; margin: 8px 0 0; color: var(--ink); }
.ss4-mode .ss4-split-rock { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; flex: 1; align-items: center; }
.ss4-mode .ss4-rock-hero { height: 500px; border-radius: 16px; background-size: cover; background-position: center; position: relative; }
.ss4-mode .ss4-craft-seal { position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: #fff; font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 6px; letter-spacing: 0.14em; }
.ss4-mode .ss4-p { font-size: 13.5px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ss4-mode .ss4-chisel-points { display: flex; flex-direction: column; gap: 10px; }
.ss4-mode .ss4-chisel-points div { background: var(--soft); padding: 12px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--dark); }
.ss4-mode .ss4-head { margin-bottom: 20px; text-align: center; }
.ss4-mode .ss4-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ss4-mode .ss4-head p { font-size: 12px; color: var(--muted); }
.ss4-mode .ss4-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ss4-mode .ss4-card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.ss4-mode .ss4-img { height: 190px; background-size: cover; background-position: center; position: relative; }
.ss4-mode .ss4-relief { position: absolute; top: 12px; right: 12px; background: var(--acc); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
.ss4-mode .ss4-info { padding: 18px 20px; }
.ss4-mode .ss4-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ss4-mode .ss4-desc { font-size: 11px; color: var(--muted); line-height: 1.5; margin: 0 0 10px; }
.ss4-mode .ss4-specs { font-size: 11px; color: var(--ink); margin-bottom: 12px; }
.ss4-mode .ss4-specs span { display: block; margin-bottom: 2px; }
.ss4-mode .ss4-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ss4-mode .ss4-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss4-mode .ss4-stock { font-size: 10px; color: #15803d; font-weight: 700; }

/* =========================================================================
   STYLE SUITE 5: CALIBRATED PATIO & POOL COPING (ss5-mode Landscape)
   ========================================================================= */
.ss5-mode .ss5-cover { height: 100%; display: flex; flex-direction: column; }
.ss5-mode .ss5-top-strip { text-align: center; font-size: 11px; letter-spacing: 0.24em; color: var(--acc); font-weight: 800; margin-bottom: 20px; }
.ss5-mode .ss5-hero-landscape { height: 440px; border-radius: 16px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 36px; margin-bottom: 20px; }
.ss5-mode .ss5-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%); border-radius: 16px; }
.ss5-mode .ss5-hero-title { position: relative; z-index: 2; color: #fff; }
.ss5-mode .ss5-water-tag { font-size: 10.5px; letter-spacing: 0.2em; font-weight: 800; color: #38bdf8; }
.ss5-mode .ss5-hero-title h1 { font-family: var(--hf); font-size: 42px; margin: 6px 0 0; }
.ss5-mode .ss5-summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
.ss5-mode .ss5-box { background: var(--soft); padding: 14px 18px; border-radius: 10px; text-align: center; }
.ss5-mode .ss5-box b { display: block; font-size: 18px; color: var(--dark); }
.ss5-mode .ss5-box span { font-size: 10.5px; color: var(--muted); }
.ss5-mode .ss5-desc { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0; }
.ss5-mode .ss5-head { margin-bottom: 20px; text-align: center; }
.ss5-mode .ss5-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ss5-mode .ss5-head p { font-size: 12px; color: var(--muted); }
.ss5-mode .ss5-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ss5-mode .ss5-card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.ss5-mode .ss5-img { height: 180px; background-size: cover; background-position: center; position: relative; }
.ss5-mode .ss5-edge-badge { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9.5px; padding: 4px 10px; border-radius: 8px; }
.ss5-mode .ss5-body { padding: 18px 20px; }
.ss5-mode .ss5-body h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 8px; }
.ss5-mode .ss5-specs-pill { display: flex; gap: 8px; margin-bottom: 8px; }
.ss5-mode .ss5-specs-pill span { background: var(--soft); font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 600; }
.ss5-mode .ss5-note { font-size: 11px; color: var(--muted); margin: 0 0 12px; line-height: 1.4; }
.ss5-mode .ss5-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ss5-mode .ss5-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss5-mode .ss5-pallet { font-size: 10px; color: var(--muted); font-weight: 600; }

/* =========================================================================
   STYLE SUITE 6: MONOLITHIC STEPS & COBBLES (ss6-mode Infrastructure)
   ========================================================================= */
.ss6-mode .ss6-cover { height: 100%; display: flex; flex-direction: column; }
.ss6-mode .ss6-header { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 10px 18px; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; border-radius: 6px; margin-bottom: 24px; }
.ss6-mode .ss6-split { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: center; }
.ss6-mode .ss6-tag { font-size: 11px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; }
.ss6-mode .ss6-text h1 { font-family: var(--hf); font-size: 42px; margin: 8px 0 14px; line-height: 1.1; color: var(--ink); }
.ss6-mode .ss6-text p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ss6-mode .ss6-caps { display: flex; flex-direction: column; gap: 8px; }
.ss6-mode .ss6-caps div { background: var(--soft); padding: 10px 14px; border-radius: 8px; font-size: 11.5px; color: var(--ink); }
.ss6-mode .ss6-img-col { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ss6-mode .ss6-stamp { position: absolute; bottom: 20px; left: 20px; background: var(--acc); color: #fff; padding: 6px 14px; font-size: 10px; font-weight: 800; border-radius: 4px; }
.ss6-mode .ss6-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 8px; }
.ss6-mode .ss6-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ss6-mode .ss6-head p { font-size: 11.5px; color: var(--muted); }
.ss6-mode .ss6-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ss6-mode .ss6-card { background: #ffffff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.ss6-mode .ss6-img { height: 160px; background-size: cover; background-position: center; position: relative; }
.ss6-mode .ss6-code { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9.5px; padding: 3px 8px; border-radius: 6px; }
.ss6-mode .ss6-info { padding: 16px 18px; }
.ss6-mode .ss6-info h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 8px; }
.ss6-mode .ss6-data { font-size: 11px; color: var(--muted); margin-bottom: 12px; line-height: 1.5; }
.ss6-mode .ss6-data b { color: var(--ink); }
.ss6-mode .ss6-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ss6-mode .ss6-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss6-mode .ss6-moq { font-size: 10px; background: var(--soft); padding: 3px 8px; border-radius: 4px; font-weight: 700; }

/* =========================================================================
   STYLE SUITE 7: ARTISANAL JALI SCREENS (ss7-mode Lattice)
   ========================================================================= */
.ss7-mode .ss7-cover { height: 100%; display: flex; flex-direction: column; text-align: center; }
.ss7-mode .ss7-masthead { margin-bottom: 24px; }
.ss7-mode .ss7-sub { font-size: 10.5px; letter-spacing: 0.3em; color: var(--acc); font-weight: 800; }
.ss7-mode .ss7-h1 { font-family: var(--hf); font-size: 44px; margin: 8px 0; color: var(--ink); }
.ss7-mode .ss7-gold-line { width: 70px; height: 3px; background: var(--acc); margin: 0 auto; }
.ss7-mode .ss7-jali-hero { position: relative; height: 500px; border-radius: 16px; overflow: hidden; margin-bottom: 24px; }
.ss7-mode .ss7-jali-photo { width: 100%; height: 100%; background-size: cover; background-position: center; position: relative; }
.ss7-mode .ss7-jali-seal { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: var(--dark); color: #fff; font-size: 10px; font-weight: 800; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.16em; }
.ss7-mode .ss7-p { font-size: 13.5px; line-height: 1.7; color: var(--muted); max-width: 600px; margin: 0 auto; }
.ss7-mode .ss7-head { margin-bottom: 20px; text-align: center; }
.ss7-mode .ss7-head h2 { font-family: var(--hf); font-size: 28px; margin: 0 0 4px; }
.ss7-mode .ss7-head p { font-size: 12px; color: var(--muted); }
.ss7-mode .ss7-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ss7-mode .ss7-card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); }
.ss7-mode .ss7-img { height: 190px; background-size: cover; background-position: center; position: relative; }
.ss7-mode .ss7-lattice-tag { position: absolute; top: 12px; right: 12px; background: var(--acc); color: #fff; font-size: 9.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
.ss7-mode .ss7-info { padding: 18px 20px; }
.ss7-mode .ss7-info h3 { font-family: var(--hf); font-size: 17px; margin: 0 0 6px; }
.ss7-mode .ss7-note { font-size: 11px; color: var(--muted); margin: 0 0 10px; line-height: 1.4; }
.ss7-mode .ss7-specs { font-size: 10.5px; color: var(--ink); display: flex; justify-content: space-between; margin-bottom: 12px; }
.ss7-mode .ss7-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 10px; }
.ss7-mode .ss7-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss7-mode .ss7-craft { font-size: 10px; color: var(--muted); font-weight: 700; }

/* =========================================================================
   STYLE SUITE 8: INTERNATIONAL STONE EXPORT DOSSIER (ss8-mode ASTM Blueprint)
   ========================================================================= */
.ss8-mode .ss8-cover { height: 100%; display: flex; flex-direction: column; }
.ss8-mode .ss8-marine-bar { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 10px 18px; font-size: 10px; font-weight: 800; letter-spacing: 0.16em; border-radius: 6px; margin-bottom: 24px; }
.ss8-mode .ss8-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; flex: 1; align-items: center; }
.ss8-mode .ss8-stamp { font-size: 10.5px; letter-spacing: 0.2em; color: var(--acc); font-weight: 800; display: block; margin-bottom: 10px; }
.ss8-mode .ss8-left h1 { font-family: var(--hf); font-size: 44px; margin: 0 0 14px; line-height: 1.1; color: var(--ink); }
.ss8-mode .ss8-left p { font-size: 13px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
.ss8-mode .ss8-matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ss8-mode .ss8-mbox { background: var(--soft); padding: 12px 14px; border-radius: 8px; text-align: center; }
.ss8-mode .ss8-mbox b { display: block; font-size: 16px; color: var(--dark); font-weight: 800; }
.ss8-mode .ss8-mbox span { font-size: 10px; color: var(--muted); }
.ss8-mode .ss8-right { height: 500px; border-radius: 14px; background-size: cover; background-position: center; position: relative; }
.ss8-mode .ss8-crate-tag { position: absolute; bottom: 20px; right: 20px; background: rgba(15, 23, 42, 0.9); color: #fff; padding: 8px 16px; font-size: 10px; font-weight: 800; border-radius: 6px; }
.ss8-mode .ss8-head { margin-bottom: 20px; border-bottom: 2px solid var(--acc); padding-bottom: 8px; }
.ss8-mode .ss8-head h2 { font-family: var(--hf); font-size: 26px; margin: 0 0 4px; }
.ss8-mode .ss8-head p { font-size: 11.5px; color: var(--muted); }
.ss8-mode .ss8-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ss8-mode .ss8-card { background: #ffffff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.ss8-mode .ss8-card-head { display: flex; justify-content: space-between; background: var(--dark); color: #fff; padding: 8px 12px; font-size: 9.5px; font-weight: 700; }
.ss8-mode .ss8-img { height: 160px; background-size: cover; background-position: center; }
.ss8-mode .ss8-body { padding: 14px 16px; }
.ss8-mode .ss8-body h3 { font-family: var(--hf); font-size: 16px; margin: 0 0 10px; }
.ss8-mode .ss8-tbl { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
.ss8-mode .ss8-tbl td { padding: 4px 0; border-bottom: 1px dotted var(--line); color: var(--muted); }
.ss8-mode .ss8-tbl td b { color: var(--ink); }
.ss8-mode .ss8-foot { display: flex; justify-content: space-between; align-items: center; }
.ss8-mode .ss8-price { font-size: 15px; font-weight: 800; color: var(--acc); }
.ss8-mode .ss8-moq { font-size: 10px; background: var(--soft); padding: 3px 8px; border-radius: 4px; font-weight: 700; }
`;

const SANDSTONE_TEMPLATES = { list: TEMPLATES, css: CSS, render, pageCount };
if (typeof window !== 'undefined') { window.SANDSTONE_TEMPLATES = SANDSTONE_TEMPLATES; }
export default SANDSTONE_TEMPLATES;
export { TEMPLATES, CSS, render, pageCount };
