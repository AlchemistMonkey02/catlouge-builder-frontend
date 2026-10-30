/* Editorial catalogue templates (12 luxury lookbook layouts) adapted from odop-kritika */
const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bgi = (u, pos) => `background-image:url(${u});background-position:${pos || 'center'}`;
const spec = it => [it.colour, it.material, it.size].filter(Boolean).join(' · ');
const pn = n => String(n).padStart(2, '0');
const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mixHex = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const fsz = (txt, big, small, limit) => (txt.length > limit ? small : big);
const cap = s => (s || '').toUpperCase();

const th = (name, bg, ink, acc, gold, line, soft) => ({ name, bg, ink, muted: mixHex(ink, bg, .42), acc, gold, line, soft });
const T = (id, cat, name, theme, o) => Object.assign({ id, cat, name, theme, editorial: true }, o);

const TEMPLATES = [
  T('ed-kd1', 'Luxury & Fashion', 'Classic Lookbook', th('Ivory & Maroon', '#faf5ee', '#2d2422', '#7b2d34', '#b08d57', '#e0d3c0', '#efe6d8'),
    { cover: 'arch', heroSide: 'L', grid: 2, deco: 'none', story: ['Crafted by hand,', 'with dedication.'], hero: ['Artistry,', 'woven with passion.'], dense: ['Signature', 'pieces.'], edit: 'The Heritage Edit' }),
  T('ed-kd2', 'Luxury & Fashion', 'Framed Lookbook', th('Sage & Gold', '#f5f6f0', '#26302a', '#4a6a55', '#b59a5a', '#d9ddcf', '#e8ebdf'),
    { cover: 'frame', heroSide: 'R', grid: 3, deco: 'frame', story: ['Light as a', 'breath of air.'], hero: ['Pure texture,', 'finer weave.'], dense: ['Designed', 'with purpose.'], edit: 'The Sage Edit' }),
  T('ed-kd3', 'Luxury & Fashion', 'Soft Lookbook', th('Blush & Plum', '#fdf4f2', '#34222c', '#8e3b5f', '#c28a6b', '#ecd5d0', '#f6e3df'),
    { cover: 'bleed', heroSide: 'L', grid: 2, deco: 'corner', story: ['Made for', 'every moment.'], hero: ['Soft as', 'a memory.'], dense: ['Dressed', 'in grace.'], edit: 'The Blush Edit' }),
  T('ed-ks1', 'Architecture & Decor', 'Architectural Lookbook', th('Bone & Slate', '#f6f4ef', '#222b2a', '#3f6561', '#a98f5f', '#dcd8cc', '#ebe7dc'),
    { cover: 'frame', heroSide: 'R', grid: 2, deco: 'none', story: ['Built to last,', 'cut with precision.'], hero: ['Cool underfoot,', 'strong for life.'], dense: ['Profiles &', 'formats.'], edit: 'The Architectural Edit' }),
  T('ed-ks2', 'Architecture & Decor', 'Dark Lookbook', th('Charcoal & Brass', '#1b1d1f', '#efe9dc', '#d4a85a', '#d4a85a', '#3a3d40', '#26292c'),
    { cover: 'bleed', heroSide: 'L', grid: 3, deco: 'none', story: ['Material with', 'a quiet strength.'], hero: ['Honed by time,', 'finished by hand.'], dense: ['Every', 'finish.'], edit: 'The Dark Edit' }),
  T('ed-ks3', 'Architecture & Decor', 'Fresh Lookbook', th('Limestone & Teal', '#f3f1ea', '#1f2e30', '#1f6f74', '#b59b62', '#d9d6ca', '#e6e3d6'),
    { cover: 'frame', heroSide: 'L', grid: 2, deco: 'band', story: ['Natural origin,', 'honestly told.'], hero: ['Texture you', 'can feel.'], dense: ['The', 'collection.'], edit: 'The Teal Edit' }),
  T('ed-ss1', 'Heritage & Craft', 'Warm Lookbook', th('Sand & Terracotta', '#f7efe2', '#2f2620', '#a54d32', '#b58a4f', '#e1d2b9', '#efe2cc'),
    { cover: 'arch', heroSide: 'R', grid: 2, deco: 'corner', story: ['Shaped by hand,', 'one cut at a time.'], hero: ['Crafted by hand,', 'kept for ages.'], dense: ['Curated &', 'made to order.'], edit: 'The Artisan Edit' }),
  T('ed-ss2', 'Heritage & Craft', 'Royal Lookbook', th('Maroon & Gold', '#3f1019', '#f5e6c8', '#e0b45c', '#e0b45c', '#6a2b37', '#4d1a25'),
    { cover: 'arch', heroSide: 'L', grid: 3, deco: 'frame', story: ['A grand vision', 'in fine form.'], hero: ['Fit for', 'royalty.'], dense: ['The royal', 'collection.'], edit: 'The Royal Edit' }),
  T('ed-ss3', 'Heritage & Craft', 'Earthy Lookbook', th('Dune & Olive', '#f4f0e6', '#2d2b22', '#6b6f37', '#b49a61', '#ddd6c0', '#e9e3d0'),
    { cover: 'bleed', heroSide: 'R', grid: 2, deco: 'band', story: ['Grounded in', 'the earth.'], hero: ['Grain, shade', 'and shadow.'], dense: ['Living &', 'outdoor.'], edit: 'The Dune Edit' }),
  T('ed-gl1', 'Produce & Living', 'Farm Lookbook', th('Cream & Forest', '#f8f4ea', '#1f2b22', '#2f6b3a', '#b59a4e', '#ded8c3', '#ece6d3'),
    { cover: 'arch', heroSide: 'R', grid: 3, deco: 'band', story: ['Grown with care,', 'packed fresh.'], hero: ['Rich flavour,', 'honest farming.'], dense: ['From source', 'to your doorstep.'], edit: 'The Harvest Edit' }),
  T('ed-gl2', 'Produce & Living', 'Garden Lookbook', th('Orchid & Ivory', '#fbf7fb', '#2e2234', '#7a4a8a', '#b890a8', '#e8d9ea', '#f1e5f3'),
    { cover: 'frame', heroSide: 'L', grid: 3, deco: 'corner', story: ['Pure, natural', 'and fresh.'], hero: ['Hand-sorted,', 'finest grade.'], dense: ['Our', 'complete range.'], edit: 'The Orchid Edit' }),
  T('ed-gl3', 'Produce & Living', 'Rustic Lookbook', th('Harvest Gold & Brown', '#fbf3e0', '#3a2b17', '#8a5222', '#c0932f', '#e8d8b0', '#f2e4c0'),
    { cover: 'bleed', heroSide: 'R', grid: 3, deco: 'frame', story: ['Direct from source,', 'to your hands.'], hero: ['Sun-cured,', 'sorted by hand.'], dense: ['Retail &', 'wholesale.'], edit: 'The Golden Edit' })
];

const run = (c, label, no) => `<div class="e-run"><span>${E(cap(c.info.ent))}</span><span>${label}</span><span>${pn(no)}</span></div>`;
const eyebrow = (txt, style) => `<div class="e-eye" ${style ? `style="${style}"` : ''}>${txt}</div>`;
const para = txt => `<p class="e-p">${E(txt)}</p>`;
const sentences = s => (s || '').split(/(?<=[.!?])\s+/).filter(Boolean);

function cover(c, t){
  const i = c.info, big = fsz(i.ent, 46, 32, 18);
  if (t.cover === 'bleed') return `<div class="e-bleedph" style="${bgi(c.hero)}"></div>
    <div class="e-bleedcard"><div class="e-run2"><span>VOLUME I</span><span>${E(cap(i.district || 'COLLECTION'))}</span><span>${c.year}</span></div>
    <div class="e-brand" style="font-size:${big}px">${E(cap(i.ent))}</div><div class="e-rule"></div><div class="e-tag">${E(c.tagline)}</div>
    <div class="e-bot">THE ${E(cap(i.product || 'PRODUCT'))} EDIT · CATALOGUE<br><span>${E(c.useShort)}</span></div></div>`;
  if (t.cover === 'frame') return `<div class="e-frame"></div><div class="e-run2" style="position:absolute;left:46px;right:46px;top:44px"><span>VOLUME I</span><span>CRAFTED IN ${E(cap(i.district || 'INDIA'))}</span><span>${c.year}</span></div>
    <div class="e-fphoto" style="${bgi(c.hero)}"></div><div class="e-brand" style="top:760px;font-size:${big}px">${E(cap(i.ent))}</div>
    <div class="e-sub" style="top:850px">${E(cap(i.product || 'COLLECTION'))}</div><div class="e-rule" style="top:890px"></div><div class="e-tag" style="top:915px">${E(c.tagline)}</div>
    <div class="e-bot" style="bottom:62px">THE ${E(cap(i.product || 'PRODUCT'))} EDIT · CATALOGUE<br><span>${E(c.useShort)}</span></div>`;
  return `<div class="e-frame"></div><div class="e-run2" style="position:absolute;left:46px;right:46px;top:44px"><span>VOLUME I</span><span>SIGNATURE COLLECTION</span><span>${c.year}</span></div>
    <div class="e-arch"><div style="${bgi(c.hero)}"></div></div><div class="e-brand" style="top:690px;font-size:${big}px">${E(cap(i.ent))}</div>
    <div class="e-sub" style="top:768px">${E(cap(i.district || ''))} · ${E(cap(i.product || 'CATALOGUE'))}</div><div class="e-rule" style="top:812px"></div>
    <div class="e-tag" style="top:836px">${E(c.tagline)}</div><div class="e-bot" style="bottom:70px">THE ${E(cap(i.product || 'PRODUCT'))} EDIT · CATALOGUE<br><span>${E(c.useShort)}</span></div>`;
}

function story(c, t, no){
  const s = sentences(c.info.desc), half = Math.ceil(s.length / 2) || 1;
  const col1 = s.slice(0, half).join(' ') || c.info.desc || 'Premium craftsmanship and dedication to quality defines our approach.', col2 = s.slice(half).join(' ') || (c.info.use ? 'Designed for: ' + c.info.use + '.' : 'Every product is created to the highest standards.');
  const idx = c.items.slice(0, 4);
  const storyTitle = c.copy.storyTitle || ['Curated with Care,', 'Made to Endure.'];
  const values = c.copy.values || [['Quality', 'Meticulous inspection of every unit.'], ['Integrity', 'Clear specifications, no surprises.'], ['Support', 'Dedicated post-delivery assistance.']];
  return `${run(c, 'OUR STORY', no)}${eyebrow(E(cap(c.info.district || 'SIGNATURE')) + ' · PRODUCT RANGE', 'top:92px')}
    <h2 class="e-h" style="position:absolute;left:46px;top:114px;width:640px;font-size:46px">${E(storyTitle[0])} <i>${E(storyTitle[1])}</i></h2>
    <div class="e-cols"><p>${E(col1)}</p><p>${E(col2)}</p></div>
    <div class="e-wide" style="${bgi(((c.items[1] || c.items[0]) || {}).img)}"></div><div class="e-capt" style="top:700px">${E(((c.items[1] || c.items[0]) || {}).name || '')}, ${E(c.info.district || 'Collection')}.</div>
    <div class="e-idxh"><span>The range</span><em>${c.items.length} PIECES IN THIS EDIT</em></div>
    <div class="e-idx">${idx.map((it, k) => `<div class="${k === 0 ? 'on' : ''}"><b>${E((it.name || '').split(' ').slice(0, 3).join(' '))}</b><small>${E(it.price || '')}</small><u>${k === 0 ? 'NOW OPEN' : 'SEE INSIDE'}</u></div>`).join('')}</div>
    <div class="e-vals">${values.map(v => `<div><i>${E(v[0])}</i><span>${E(v[1])}</span></div>`).join('')}</div>`;
}

function hero(c, t, no, it, chapter){
  if (!it) return '';
  const L = t.heroSide === 'L', imgX = L ? 46 : 794 - 46 - 320, txX = L ? 396 : 46, d = (c.items[1] || c.items[0] || it);
  const heroTitle = c.copy.heroTitle || ['Pure Form,', 'Distinctive Character.'];
  return `${run(c, 'THE ' + E(cap(c.info.product || 'SIGNATURE')) + ' EDIT', no)}
    <div class="e-hph" style="left:${imgX}px;${bgi(it.img)}"></div><div class="e-capt" style="left:${imgX}px;top:752px;width:320px">${E(it.name)}, ${E(c.info.district || '')}.</div>
    <div class="e-facts" style="left:${imgX}px">${[['SIZE', it.size], ['MATERIAL', it.material], ['COLOUR', it.colour]].filter(r => r[1]).map(r => `<div><u>${r[0]}</u>${E(r[1])}</div>`).join('')}</div>
    <div class="e-hx" style="left:${txX}px">${eyebrow(pn(chapter) + ' · ' + E(cap(c.info.district || 'EXCLUSIVE')))}
      <h2 class="e-h" style="font-size:42px;margin-top:8px">${E(heroTitle[0])}<br><i>${E(heroTitle[1])}</i></h2>
      ${para(sentences(c.info.desc).slice(0, 2).join(' ') || c.info.desc || 'Refined details created with precision and care.')}
      <div class="e-inset" style="${bgi(d.img, 'center 30%')}"></div><div class="e-capt" style="position:static;margin-top:8px">A closer look: ${E(d.name)}.</div></div>
    <div class="e-sig" style="left:${txX}px"><div class="e-eye">THE SIGNATURE PIECE</div><div class="e-signm">${E(it.name)}</div><div class="e-sigsp">${E(spec(it))}</div>
      <div class="e-sigrow"><span class="e-sigpr">${E(it.price)}</span><em>${it.moq ? 'MOQ ' + E(it.moq) : E(cap(c.info.product || 'IN STOCK'))}</em></div></div>
    <div class="e-pfoot"><span>${E(cap(c.info.district || 'INDIA'))}</span><span>${E(c.info.mobile || '')}</span></div>`;
}

function grid2(c, t, no, items, title){
  return `${run(c, E(cap(c.info.product || 'PRODUCTS')) + ' · ' + E(cap(title)), no)}<h2 class="e-gt">${E(title)}</h2><div class="e-gtag">${E(cap((c.info.use || 'Premium Range').split(',').slice(0, 2).join(' · ')))}</div>
    <div class="e-g2">${items.map(it => `<div><div class="e-gp" style="${bgi(it.img)}"></div><div class="e-gn"><span>${E(it.name)}</span><b>${E(it.price)}</b></div><div class="e-gs">${E(spec(it))}</div></div>`).join('')}</div>
    <div class="e-pfoot"><span>${E(cap(c.info.ent))}</span><span>${E(c.info.mobile || '')}</span></div>`;
}

function grid3(c, t, no, items, title){
  return `${run(c, E(cap(c.info.product || 'PRODUCTS')) + ' · ' + E(cap(title)), no)}<h2 class="e-gt">${E(title)}</h2><div class="e-gtag">${E(cap(c.info.district || 'COLLECTION'))}</div>
    <div class="e-g3">${items.map(it => `<div><div class="e-gp3" style="${bgi(it.img)}"></div><div class="e-gn3">${E(it.name)}</div><div class="e-gs">${E(spec(it))}</div><div class="e-gpr">${E(it.price)}</div></div>`).join('')}</div>
    <div class="e-pfoot"><span>${E(cap(c.info.ent))}</span><span>${E(c.info.mobile || '')}</span></div>`;
}

function dense(c, t, no, items){
  const n = items.length, few = n <= 4, cols = few ? Math.max(2, n) : 4, ph = few ? 560 : 280;
  const rows = few ? [items] : [items.slice(0, 4), items.slice(4, 8)].filter(r => r.length);
  const denseTitle = c.copy.denseTitle || ['The Collection,', 'Form & Function.'];
  return `${run(c, E(cap(c.info.product || 'CATALOGUE')), no)}${eyebrow(E(cap(c.info.product || 'COLLECTION')) + ' · MORE', 'top:92px')}
    <h2 class="e-h" style="position:absolute;left:46px;right:46px;top:108px;font-size:38px;white-space:nowrap">${E(denseTitle[0])} <i>${E(denseTitle[1])}</i></h2>
    <div class="e-dtx">${E(c.info.use ? 'Made for: ' + c.info.use + '.' : '')}</div>
    ${rows.map((r, k) => `<div class="e-g4" style="top:${200 + k * 440}px;grid-template-columns:repeat(${cols},1fr);gap:${few ? 22 : 16}px">${r.map(it => `<div><div class="e-gp4" style="height:${ph}px;${bgi(it.img)}"></div><div class="e-gn4">${E(it.name)}</div><div class="e-gs">${E(spec(it))}</div><div class="e-gpr">${E(it.price)}</div></div>`).join('')}</div>`).join('')}
    <div class="e-pfoot"><span>${E(cap(c.info.ent))}</span><span>${E(c.info.mobile || '')}</span></div>`;
}

function care(c, t, no){
  const it = c.items[c.items.length - 1] || c.items[0] || {};
  const promise = c.copy.promise || { title: ['Packed with Care,', 'Delivered on Schedule.'], text: 'Every order is thoroughly inspected before dispatch. We take pride in clean packing and transparent service.' };
  const careList = c.copy.care || [['Customer Care', 'Contact our support team for any custom requests or order queries.'], ['Quality Guarantee', 'If an item is not as specified, notify us within 7 days.'], ['Natural Nuances', 'Finishes and colors may show subtle natural variations.']];
  return `${run(c, 'THE PROMISE', no)}<div class="e-cph" style="${bgi(it.img)}"></div>
    <div class="e-cx">${eyebrow('YOUR ORDER')}<h2 class="e-h" style="font-size:40px;margin-top:8px">${E(promise.title[0])}<br><i>${E(promise.title[1])}</i></h2>${para(promise.text)}</div>
    <div class="e-vals" style="top:700px">${careList.map(v => `<div><i>${E(v[0])}</i><span>${E(v[1])}</span></div>`).join('')}</div>
    <div class="e-pfoot"><span>${E(cap(c.info.ent))}</span><span>${E(c.info.mobile || '')}</span></div>`;
}

function closing(c, t, no){
  const i = c.info;
  return `<div class="e-frame"></div><div class="e-endw"><div class="e-brand" style="position:static;font-size:${fsz(i.ent, 40, 28, 18)}px">${E(cap(i.ent))}</div><div class="e-sub" style="position:static;margin-top:10px">${E(cap(i.district || ''))} · ${E(cap(i.product || 'CATALOGUE'))}</div>
    <div class="e-rule" style="position:static;margin:22px auto"></div><div class="e-tag" style="position:static">${E(c.tagline)}</div>
    <div class="e-endinfo">${[i.person && `<b>${E(i.person)}</b>`, i.mobile && `☎ ${E(i.mobile)}`, i.wa && i.wa !== i.mobile ? `WhatsApp ${E(i.wa)}` : (i.mobile ? 'WhatsApp on the same number' : ''), i.email && `✉ ${E(i.email)}`, i.addr && `⌂ ${E(i.addr)}`, i.gst && `GSTIN ${E(i.gst)}`].filter(Boolean).map(x => `<div>${x}</div>`).join('')}</div>
    ${(i.socials || []).length ? `<div class="e-soc">${i.socials.map(s => `<span class="soc" data-url="${E(s[1])}"><b>${s[0]}</b> ${E(c.socialLabel ? c.socialLabel(s[1]) : s[1])}</span>`).join('')}</div>` : ''}
    ${c.qr ? `<div class="e-qr"><img class="qrimg" src="${c.qr}"><div>Scan to connect<br>${E(c.pf || 'with us')}</div></div>` : ''}
    <div class="e-note">Prices in INR · ${c.year} · subject to change</div></div>`;
}

function plan(t, n){
  const gN = t.grid === 3 ? 3 : 4, steps = []; let left = n, i = 0;
  while (left >= gN + 1){ steps.push({ k: 'hero', i }); steps.push({ k: 'grid', from: i + 1, to: i + 1 + gN }); i += 1 + gN; left -= 1 + gN; }
  while (left > 0){ const take = Math.min(8, left); steps.push({ k: 'dense', from: i, to: i + take }); i += take; left -= take; }
  return steps;
}
const pageCount = (t, n) => 2 + plan(t, n).length + 2;

function render(t, ctx){
  const th = t.theme, items = (ctx.items || []).map((it, n) => Object.assign({ _n: n + 1 }, it)), copy = ctx.copy || (window.getCopy && window.getCopy(ctx.info)) || {};
  const c = Object.assign({}, ctx, { items, year: new Date().getFullYear(), hero: ctx.heroImg || (items[0] && items[0].img) || '',
    copy, tagline: copy.tagline || (ctx.info && ctx.info.tagline) || 'Refined aesthetics and timeless value.',
    useShort: (ctx.info.use || '').split(',').slice(0, 3).join(' · ') });
  const style = `--bg:${th.bg};--ink:${th.ink};--muted:${th.muted};--acc:${th.acc};--gold:${th.gold};--line:${th.line};--soft:${th.soft};background-color:${th.bg}`;
  const deco = t.deco && t.deco !== 'none' ? `<div class="e-deco e-d-${t.deco}"></div>` : '';
  const wrap = (html, first) => `<div class="pg ed" style="${style}">${first && t.deco === 'frame' ? '' : deco}${html}</div>`;
  const pages = [wrap(cover(c, t), true)]; let no = 2;
  pages.push(wrap(story(c, t, no++)));
  let chapter = 1;
  for (const s of plan(t, items.length)){
    if (s.k === 'hero') pages.push(wrap(hero(c, t, no++, items[s.i], chapter++)));
    else if (s.k === 'grid') pages.push(wrap((t.grid === 3 ? grid3 : grid2)(c, t, no++, items.slice(s.from, s.to), copy.editTitle || 'The Collection')));
    else pages.push(wrap(dense(c, t, no++, items.slice(s.from, s.to))));
  }
  pages.push(wrap(care(c, t, no++)));
  pages.push(wrap(closing(c, t, no)));
  return pages;
}

const CSS = `
.ed .e-deco{position:absolute;pointer-events:none}
.ed .e-d-frame{left:22px;top:22px;right:22px;bottom:22px;border:1px solid var(--line)}
.ed .e-d-band{left:0;top:0;bottom:0;width:14px;background:var(--acc)}
.ed .e-d-corner{right:0;top:0;width:0;height:0;border-style:solid;border-width:0 120px 120px 0;border-color:transparent var(--acc) transparent transparent;opacity:.9}
.pg.ed{width:794px;height:1123px;position:relative;overflow:hidden;background-color:var(--bg);color:var(--ink);font-family:'Jost','Noto Sans Devanagari',sans-serif;font-weight:300;font-size:11px;margin-bottom:16px}
.ed h2{margin:0;font-family:'Cormorant Garamond','Noto Serif Devanagari',serif;font-weight:400}
.ed i{font-style:italic;color:var(--acc)}
.ed .e-run{position:absolute;left:46px;right:46px;top:36px;display:flex;justify-content:space-between;font-size:8.5px;letter-spacing:.26em;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:10px}
.ed .e-run2{display:flex;justify-content:space-between;font-size:9px;letter-spacing:.3em;color:var(--muted)}
.ed .e-eye{font-size:9px;letter-spacing:.26em;color:var(--gold);font-weight:400}
.ed .e-h{line-height:1.08;color:var(--ink)}
.ed .e-p{font-size:11.5px;line-height:1.85;color:var(--muted);margin:16px 0 0;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}
.ed .e-pfoot{position:absolute;left:46px;right:46px;bottom:30px;display:flex;justify-content:space-between;font-size:8px;letter-spacing:.22em;color:var(--muted);border-top:1px solid var(--line);padding-top:10px}
.ed .e-capt{position:absolute;left:46px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12px;color:var(--muted)}
.ed .e-frame{position:absolute;left:20px;right:20px;top:20px;bottom:20px;border:1px solid var(--gold)}
.ed .e-arch{position:absolute;left:207px;top:92px;width:380px;height:500px;border:1px solid var(--gold);border-radius:190px 190px 0 0;padding:7px;overflow:hidden}
.ed .e-arch div{width:364px;height:484px;border-radius:182px 182px 0 0;background-size:cover;background-position:center}
.ed .e-brand{position:absolute;left:30px;right:30px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:400;letter-spacing:.26em;padding-left:.26em;line-height:1.15}
.ed .e-sub{position:absolute;left:0;right:0;text-align:center;font-size:10px;letter-spacing:.42em;color:var(--gold);font-weight:400}
.ed .e-rule{position:absolute;left:377px;width:40px;height:1px;background:var(--gold)}
.ed .e-tag{position:absolute;left:60px;right:60px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:26px;color:var(--acc);line-height:1.25}
.ed .e-bot{position:absolute;left:0;right:0;text-align:center;font-size:9px;letter-spacing:.34em;line-height:2.2;color:var(--ink);font-weight:400}
.ed .e-bot span{letter-spacing:.1em;font-weight:300;color:var(--muted);font-size:10px}
.ed .e-fphoto{position:absolute;left:70px;top:84px;width:654px;height:620px;background-size:cover;background-position:center;border:1px solid var(--gold);box-sizing:content-box;padding:0}
.ed .e-bleedph{position:absolute;left:0;top:0;width:794px;height:720px;background-size:cover;background-position:center}
.ed .e-bleedcard{position:absolute;left:60px;right:60px;top:560px;height:500px;background:var(--bg);border:1px solid var(--gold);padding:34px 40px;text-align:center}
.ed .e-bleedcard .e-brand{position:static;margin-top:70px}
.ed .e-bleedcard .e-rule{position:static;margin:20px auto}
.ed .e-bleedcard .e-tag{position:static}
.ed .e-bleedcard .e-bot{position:static;margin-top:44px}
.ed .e-cols{position:absolute;left:46px;right:46px;top:262px;display:grid;grid-template-columns:1fr 1fr;gap:34px;font-size:11.5px;line-height:1.85;color:var(--muted)}
.ed .e-cols p{margin:0;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
.ed .e-wide{position:absolute;left:46px;right:46px;top:392px;height:290px;background-size:cover;background-position:center}
.ed .e-idxh{position:absolute;left:46px;right:46px;top:760px;display:flex;justify-content:space-between;align-items:baseline}
.ed .e-idxh span{font-family:'Cormorant Garamond',serif;font-size:26px}
.ed .e-idxh em{font-style:normal;font-size:8.5px;letter-spacing:.24em;color:var(--gold)}
.ed .e-idx{position:absolute;left:46px;right:46px;top:810px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.ed .e-idx div{border-top:1px solid var(--line);padding-top:12px}
.ed .e-idx div.on{border-top:2px solid var(--acc)}
.ed .e-idx b{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:400;font-size:17px;color:var(--acc);line-height:1.15}
.ed .e-idx small{display:block;margin-top:5px;font-size:9.5px;color:var(--muted)}
.ed .e-idx u{display:block;text-decoration:none;margin-top:5px;font-size:8px;letter-spacing:.24em;color:var(--gold);font-weight:500}
.ed .e-vals{position:absolute;left:46px;right:46px;top:930px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px;border-top:1px solid var(--line);padding-top:18px}
.ed .e-vals i{display:block;font-family:'Cormorant Garamond',serif;font-size:18px;margin-bottom:5px}
.ed .e-vals span{font-size:10.5px;line-height:1.7;color:var(--muted)}
.ed .e-hph{position:absolute;top:92px;width:320px;height:650px;background-size:cover;background-position:center}
.ed .e-hx{position:absolute;top:92px;width:352px}
.ed .e-inset{margin-top:26px;width:100%;height:250px;background-size:cover;background-position:center}
.ed .e-facts{position:absolute;top:832px;width:320px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;border-top:1px solid var(--line);padding-top:12px;font-size:10px;line-height:1.5;color:var(--ink)}
.ed .e-facts u{display:block;text-decoration:none;font-size:7.5px;letter-spacing:.22em;color:var(--gold);margin-bottom:4px}
.ed .e-sig{position:absolute;top:860px;width:352px;border-top:1px solid var(--line);padding-top:14px}
.ed .e-signm{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:26px;line-height:1.15;margin:8px 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ed .e-sigsp{font-size:10.5px;color:var(--muted)}
.ed .e-sigrow{display:flex;justify-content:space-between;align-items:baseline;margin-top:14px}
.ed .e-sigpr{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--acc)}
.ed .e-sigrow em{font-style:normal;font-size:8px;letter-spacing:.24em;color:var(--gold)}
.ed .e-gt{position:absolute;left:46px;top:92px;font-size:38px}
.ed .e-gtag{position:absolute;right:46px;top:112px;font-size:8.5px;letter-spacing:.24em;color:var(--gold)}
.ed .e-g2{position:absolute;left:46px;right:46px;top:166px;display:grid;grid-template-columns:1fr 1fr;gap:26px 24px}
.ed .e-gp{height:368px;background-size:cover;background-position:center}
.ed .e-gn{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px}
.ed .e-gn span{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.15}
.ed .e-gn b{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:18px;color:var(--acc)}
.ed .e-gs{font-size:9.5px;color:var(--muted);margin-top:4px;line-height:1.5}
.ed .e-g3{position:absolute;left:46px;right:46px;top:166px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.ed .e-gp3{height:700px;background-size:cover;background-position:center}
.ed .e-gn3{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;line-height:1.15;margin-top:12px}
.ed .e-gpr{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--acc);margin-top:6px}
.ed .e-g4{position:absolute;left:46px;right:46px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ed .e-gp4{background-size:cover;background-position:center}
.ed .e-gn4{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;line-height:1.15;margin-top:10px}
.ed .e-dtx{position:absolute;left:46px;right:46px;top:160px;height:36px;overflow:hidden;font-size:11px;line-height:1.6;color:var(--muted)}
.ed .e-cph{position:absolute;left:46px;top:92px;width:330px;height:420px;background-size:cover;background-position:center}
.ed .e-cx{position:absolute;left:420px;top:92px;width:330px}
.ed .e-endw{position:absolute;left:60px;right:60px;top:210px;text-align:center}
.ed .e-endinfo div{margin:6px 0;font-size:13px;color:var(--ink)}
.ed .e-endinfo{margin-top:34px}
.ed .e-soc{margin-top:14px}
.ed .soc{display:inline-block;border:1px solid var(--gold);color:var(--ink);border-radius:99px;padding:2px 11px;font-size:10px;margin:3px 4px 0}
.ed .e-qr{margin-top:34px;font-size:9.5px;color:var(--muted);letter-spacing:.08em}
.ed .e-qr img{width:120px;height:120px;display:block;margin:0 auto 8px;background:#fff;padding:8px;border:1px solid var(--line);box-sizing:content-box}
.ed .e-note{margin-top:40px;font-size:8.5px;letter-spacing:.26em;color:var(--muted)}
`;

const EDITORIAL_TEMPLATES = { list: TEMPLATES, css: CSS, render, pageCount };
if (typeof window !== 'undefined') { window.EDITORIAL_TEMPLATES = EDITORIAL_TEMPLATES; }
export default EDITORIAL_TEMPLATES;
export { TEMPLATES, CSS, render, pageCount };
