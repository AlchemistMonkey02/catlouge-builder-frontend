/* Interactive In-Place Design Editor adapted from odop-kritika.
   Provides direct single-click text editing (contentEditable, bold, color, font scale),
   click-to-swap photos from variants (including SVG images and background-images),
   photo shapes (original, square, rounded, circle, arch),
   interactive drag-to-move, and drag-handles / slider resize.
   Edits are stored per template in window.DesignEdits and faithfully applied to both the live preview
   and the exported PDF. */

const $ = id => document.getElementById(id);
const EDITS = (typeof window !== 'undefined' && (window.DesignEdits = window.DesignEdits || {})) || {};
const orig = new WeakMap();
const SHAPES = {
  original: null,
  square: '0',
  rounded: '28px',
  circle: '50%',
  arch: '999px 999px 0 0',
  pill: '9999px',
  leaf: '40px 0 40px 0',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  hex: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  shield: 'polygon(50% 0%, 100% 0%, 100% 68%, 50% 100%, 0% 68%, 0% 0%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
};
let uid = null, on = false, sel = null, editingEl = null, undo = [], cyc = { x: -99, y: -99, i: 0 }, drag = null;
let box = null, hov = null, bar = null, layers = [], base = null;

/* ---------------- helpers ---------------- */
const pathOf = (el, pg) => {
  const p = [];
  while (el && el !== pg) {
    const par = el.parentElement;
    if (!par) break;
    p.unshift([...par.children].indexOf(el));
    el = par;
  }
  return p;
};

const byPath = (pg, path) => {
  let e = pg;
  for (const i of path) {
    e = e && e.children && e.children[i];
  }
  return e || null;
};

export const isPhoto = e => {
  if (!e || !e.tagName) return false;
  const tag = e.tagName.toUpperCase();
  if (tag === 'IMG') {
    return Boolean(e.getAttribute('src'));
  }
  if (tag === 'IMAGE') {
    return Boolean(e.getAttribute('href') || e.getAttribute('xlink:href'));
  }
  if (tag === 'SVG' && (e.querySelector('image') || (e.getAttribute('class') || '').includes('cut'))) {
    return true;
  }
  if (e.classList && (
    e.classList.contains('e-arch') ||
    e.classList.contains('k-feat') ||
    e.classList.contains('sw') ||
    e.classList.contains('e-fphoto') ||
    e.classList.contains('e-wide') ||
    e.classList.contains('e-bleedph')
  )) {
    return true;
  }
  return /url\(["']?(data:image|https?:|\/)/.test(e.getAttribute('style') || '');
};

export const isText = e => {
  if (!e || !e.tagName) return false;
  const tag = e.tagName.toUpperCase();
  if (/^(SCRIPT|STYLE|IMG|IMAGE|SVG|BR|INPUT|TEXTAREA|SELECT|BUTTON)$/i.test(tag)) return false;
  if (e.classList && (e.classList.contains('dz-sel') || e.classList.contains('dz-bar') || e.classList.contains('pvtag'))) return false;
  if (e.classList && (e.classList.contains('e-arch') || e.classList.contains('k-feat') || e.classList.contains('sw') || e.classList.contains('e-fphoto') || e.classList.contains('e-bleedph'))) return false;
  return Boolean(e.textContent && e.textContent.trim().length > 0);
};

function photoFrame(el, pg) {
  if (!el) return null;
  if (el.tagName && el.tagName.toUpperCase() === 'IMAGE') {
    const svg = el.closest('svg');
    if (svg && pg.contains(svg)) return svg;
  }
  let cur = el;
  for (let i = 0; i < 4; i++) {
    const par = cur.parentElement;
    if (!par || par === pg || !pg.contains(par)) break;
    const a = cur.getBoundingClientRect(), b = par.getBoundingClientRect(), s = (pg.getBoundingClientRect().width / (pg.offsetWidth || 1)) || 1;
    const tol = 36 * s;
    if (Math.abs(b.width - a.width) > tol || Math.abs(b.height - a.height) > tol) break;
    if ([...par.querySelectorAll('*')].some(n => !cur.contains(n) && n !== cur && isText(n))) break;
    cur = par;
  }
  return cur;
}

const firstPhotoIn = el => (isPhoto(el) ? el : [...el.querySelectorAll('*')].find(isPhoto) || null);
const rec = () => {
  if (!uid) return {};
  EDITS[uid] = EDITS[uid] || {};
  return EDITS[uid];
};

const hex = c => {
  const m = /(\d+)[, ]+(\d+)[, ]+(\d+)/.exec(c || '');
  return m ? '#' + [1, 2, 3].map(i => (+m[i]).toString(16).padStart(2, '0')).join('') : '#000000';
};

function clean(node) {
  let out = '';
  if (!node || !node.childNodes) return out;
  node.childNodes.forEach(n => {
    if (n.nodeType === 3) {
      out += n.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    } else if (n.nodeType === 1) {
      const t = n.tagName.toLowerCase();
      if (t === 'br') {
        out += '<br>';
      } else if (['i', 'b', 'em', 'strong', 'span', 'u', 'font', 'mark', 'small'].includes(t)) {
        let attrs = '';
        if (n.getAttribute('style')) attrs += ` style="${n.getAttribute('style').replace(/"/g, '&quot;')}"`;
        if (n.getAttribute('class')) attrs += ` class="${n.getAttribute('class')}"`;
        if (n.getAttribute('color')) attrs += ` color="${n.getAttribute('color')}"`;
        if (n.getAttribute('face')) attrs += ` face="${n.getAttribute('face')}"`;
        out += `<${t}${attrs}>${clean(n)}</${t}>`;
      } else {
        out += clean(n);
      }
    }
  });
  return out;
}

const isEmpty = ed => !ed || !Object.keys(ed).some(k => ed[k] !== undefined && ed[k] !== null && ed[k] !== false && k !== 'kind' && !((k === 'dx' || k === 'dy') && ed[k] === 0) && !(k === 'fsMul' && ed[k] === 1));

/* ---------------- apply one edit to one element (works on preview and PDF pages) ---------------- */
export function applyEdit(el, ed, photoUrl) {
  if (!el) return;
  if (!photoUrl && ed && ed.customImg) photoUrl = ed.customImg;
  let o = orig.get(el);
  if (!o) {
    o = { style: el.getAttribute('style') || '', html: el.innerHTML, htmlChanged: false };
    orig.set(el, o);
  }

  // 1. Photo swapping across ANY element or child img/svg
  if (photoUrl) {
    if (el.tagName === 'IMG') {
      el.setAttribute('src', photoUrl);
    } else if (el.tagName && el.tagName.toLowerCase() === 'image') {
      el.setAttribute('href', photoUrl);
      el.setAttribute('xlink:href', photoUrl);
    } else {
      const allImgs = el.querySelectorAll ? el.querySelectorAll('img') : [];
      allImgs.forEach(img => img.setAttribute('src', photoUrl));
      const allSvgImgs = el.querySelectorAll ? el.querySelectorAll('image') : [];
      allSvgImgs.forEach(si => {
        si.setAttribute('href', photoUrl);
        si.setAttribute('xlink:href', photoUrl);
      });
      let st = el.getAttribute('style') || '';
      if (/url\(/.test(st)) {
        el.setAttribute('style', st.replace(/url\(["']?[^"')]+["']?\)/, () => `url("${photoUrl}")`));
      }
    }
  }

  // 2. HTML Text edits
  if (ed.html != null) {
    if (el.innerHTML !== ed.html) el.innerHTML = ed.html;
    o.htmlChanged = true;
  } else if (o.htmlChanged) {
    el.innerHTML = o.html;
    o.htmlChanged = false;
  }

  const cs = getComputedStyle(el), s = el.style;

  // 3. Font Scale & Typography
  if (ed.fsMul && ed.fsMul !== 1) {
    s.fontSize = (parseFloat(cs.fontSize) * ed.fsMul) + 'px';
    if (/px$/.test(cs.lineHeight)) s.lineHeight = (parseFloat(cs.lineHeight) * ed.fsMul) + 'px';
  }
  if (ed.fontFamily !== undefined) {
    s.fontFamily = ed.fontFamily || '';
  }
  if (ed.color) s.color = ed.color;
  if (ed.bold !== undefined) {
    s.fontWeight = ed.bold ? '700' : 'normal';
  }
  if (ed.italic !== undefined) {
    s.fontStyle = ed.italic ? 'italic' : 'normal';
  }
  if (ed.underline !== undefined) {
    s.textDecoration = ed.underline ? 'underline' : 'none';
  }
  if (ed.transform !== undefined) {
    s.textTransform = ed.transform || 'none';
  }
  if (ed.align !== undefined) {
    s.textAlign = ed.align || '';
  }
  if (ed.letterSpacing !== undefined) {
    s.letterSpacing = ed.letterSpacing || 'normal';
  }

  // 4. Width and Height
  if (ed.w != null || ed.h != null) {
    if (cs.display === 'inline') {
      s.display = 'inline-block';
    }
    s.boxSizing = 'border-box';
  }
  if (ed.w != null) {
    s.width = ed.w + 'px';
    s.maxWidth = 'none';
    s.minWidth = '0';
    s.flex = 'none';
    if (el.tagName === 'SVG' || el.tagName === 'svg') el.setAttribute('width', ed.w);
    const svg = el.querySelector && el.querySelector('svg');
    if (svg) svg.setAttribute('width', ed.w);
  }
  if (ed.h != null) {
    s.height = ed.h + 'px';
    s.maxHeight = 'none';
    s.minHeight = '0';
    if (el.tagName === 'SVG' || el.tagName === 'svg') el.setAttribute('height', ed.h);
    const svg = el.querySelector && el.querySelector('svg');
    if (svg) svg.setAttribute('height', ed.h);
  }

  // 5. Shape functionality: circle, rounded, square, arch, pill, leaf, diamond, hex, octagon, shield, star, original
  const childImgs = el.querySelectorAll ? el.querySelectorAll('img, image, svg, div[style*="url"]') : [];
  if (ed.shape && SHAPES[ed.shape]) {
    const shapeVal = SHAPES[ed.shape];
    if (shapeVal.startsWith('polygon')) {
      s.clipPath = shapeVal;
      s.borderRadius = '0';
      s.overflow = 'hidden';
      if (cs.position === 'static') s.position = 'relative';

      childImgs.forEach(ci => {
        ci.style.clipPath = shapeVal;
        ci.style.borderRadius = '0';
        ci.style.overflow = 'hidden';
        if (ci.tagName === 'IMG') {
          ci.style.objectFit = 'cover';
        }
      });
    } else {
      // Border radius shape: square, rounded, circle, arch, pill, leaf
      s.borderRadius = shapeVal;
      s.clipPath = '';
      s.overflow = 'hidden';
      if (cs.position === 'static') s.position = 'relative';

      childImgs.forEach(ci => {
        ci.style.borderRadius = shapeVal;
        ci.style.overflow = 'hidden';
        ci.style.clipPath = '';
        if (ci.tagName === 'IMG') {
          ci.style.objectFit = 'cover';
        }
        if (ci.tagName && ci.tagName.toLowerCase() === 'image') {
          if (ed.shape === 'circle') {
            ci.style.clipPath = 'circle(50% at 50% 50%)';
          } else if (ed.shape === 'arch') {
            ci.style.clipPath = 'inset(0 0 0 0 round 999px 999px 0 0)';
          } else if (ed.shape === 'pill') {
            ci.style.clipPath = 'inset(0 0 0 0 round 9999px)';
          } else if (ed.shape === 'leaf') {
            ci.style.clipPath = 'inset(0 0 0 0 round 40px 0 40px 0)';
          } else if (ed.shape === 'rounded') {
            ci.style.clipPath = 'inset(0 0 0 0 round 28px)';
          } else if (ed.shape === 'square') {
            ci.style.clipPath = 'none';
          }
        }
      });
    }
  } else {
    // Shape = original or reset
    s.borderRadius = '';
    s.clipPath = '';
    s.overflow = '';
    childImgs.forEach(ci => {
      ci.style.borderRadius = '';
      ci.style.clipPath = '';
      ci.style.overflow = '';
    });
  }

  // 6. Hide / Show
  if (ed.hide) {
    s.visibility = 'hidden';
  } else {
    s.visibility = 'visible';
  }

  // 7. Drag-to-move translation
  if (ed.dx || ed.dy) {
    s.transform = `translate(${ed.dx || 0}px,${ed.dy || 0}px)`;
  } else {
    s.transform = '';
  }
}

// Called by page builder to apply all stored edits of this template onto pages
export async function applyAll(host, templateId, items) {
  const edits = EDITS[templateId];
  if (!edits || !host) return;
  for (const key of Object.keys(edits)) {
    const [pi, p] = key.split('|'), pg = host.children[+pi];
    if (!pg) continue;
    const el = byPath(pg, p ? p.split('.').map(Number) : []);
    if (!el) continue;
    const ed = edits[key], it = ed.photo != null ? (items && items[ed.photo]) : null;
    applyEdit(el, ed, (it && it.img) || ed.customImg);
  }
}

/* ---------------- live editing in the preview ---------------- */
const pageOf = el => el.closest('.pvpage'), pgOf = pv => (pv ? pv.firstElementChild : null);
const scaleOf = pv => parseFloat(pv.dataset.s) || 1;
export const keyFor = (el, pv) => pv.dataset.i + '|' + pathOf(el, pgOf(pv)).join('.');
const cur = () => (sel ? rec()[sel.key] : null);

function snapshot() {
  if (!uid) return;
  undo.push(JSON.stringify(EDITS[uid] || {}));
  if (undo.length > 60) undo.shift();
}

export function setEdit(patch, live = true, quiet = false) {
  if (!sel) return;
  if (sel.photo) patch = Object.assign({ kind: 'photo' }, patch);
  const all = rec(), ed = Object.assign({}, all[sel.key] || {}, patch);
  if (isEmpty(ed)) delete all[sel.key]; else all[sel.key] = ed;
  if (live) {
    applyEdit(sel.el, ed, patch.photo != null || ed.photo != null ? currentPhotoUrl(ed) : null);
    refit(sel.inner || sel.el);
  }
  place();
  if (!quiet) drawPanel();
}

const currentPhotoUrl = ed => {
  if (ed && ed.customImg) return ed.customImg;
  const items = (window.ODOP_FIT && window.ODOP_FIT.items && window.ODOP_FIT.items()) || [];
  return ed.photo != null && items[ed.photo] ? items[ed.photo].img : null;
};

async function refit(el) {
  if (!isPhoto(el) || !window.ODOP_FIT) return;
  const url = el.tagName === 'IMG' ? el.getAttribute('src') : ((/url\(["']?(data:image[^"')]+)/.exec(el.getAttribute('style') || '') || [])[1]);
  const meta = url && window.ODOP_FIT.meta && window.ODOP_FIT.meta.get(url);
  if (!meta) return;
  const r = el.getBoundingClientRect();
  if (r.width < 20 || r.height < 20) return;
  const nu = await window.ODOP_FIT.fitImg(meta.src, meta.fit, r.width / r.height);
  if (nu === url) return;
  if (el.tagName === 'IMG') el.setAttribute('src', nu);
  else el.setAttribute('style', el.getAttribute('style').split(url).join(nu));
  const o = orig.get(el);
  if (o) o.style = o.style.split(url).join(nu);
}

/* ---------------- selection box & drag handles ---------------- */
function ensureBox(pv) {
  if (box && box.parentElement === pv) return;
  killBox();
  box = document.createElement('div');
  box.className = 'dz-sel';
  box.innerHTML = 
    // Edge draggable hit areas (along the full length of each edge)
    '<div data-h="n" class="dz-border dz-border-n" title="Drag top edge to resize height ↕"></div>' +
    '<div data-h="s" class="dz-border dz-border-s" title="Drag bottom edge to resize height ↕"></div>' +
    '<div data-h="w" class="dz-border dz-border-w" title="Drag left edge to resize width ↔"></div>' +
    '<div data-h="e" class="dz-border dz-border-e" title="Drag right edge to resize width ↔"></div>' +
    // 4 Corner resize handles
    '<i data-h="nw" class="dz-corner" title="Resize corner ↖"></i>' +
    '<i data-h="ne" class="dz-corner" title="Resize corner ↗"></i>' +
    '<i data-h="sw" class="dz-corner" title="Resize corner ↙"></i>' +
    '<i data-h="se" class="dz-corner" title="Resize corner ↘"></i>' +
    // 4 Edge handle badges with visible directional arrows
    '<i data-h="e" class="dz-edge dz-edge-e" title="Drag right edge to resize width ↔"><span>↔</span></i>' +
    '<i data-h="w" class="dz-edge dz-edge-w" title="Drag left edge to resize width ↔"><span>↔</span></i>' +
    '<i data-h="n" class="dz-edge dz-edge-n" title="Drag top edge to resize height ↕"><span>↕</span></i>' +
    '<i data-h="s" class="dz-edge dz-edge-s" title="Drag bottom edge to resize height ↕"><span>↕</span></i>' +
    // Move pill
    '<div data-h="move" class="dz-move-handle" title="Drag to reposition anywhere on the page">✢ Drag to Move</div>';
  pv.appendChild(box);
}

function killBox() {
  if (box) box.remove();
  box = null;
}

function place() {
  if (!sel || !box) return;
  const pv = pageOf(sel.el);
  if (!pv) return;
  const r = sel.el.getBoundingClientRect(), p = pv.getBoundingClientRect();
  Object.assign(box.style, {
    left: (r.left - p.left) + 'px',
    top: (r.top - p.top) + 'px',
    width: r.width + 'px',
    height: r.height + 'px'
  });
  box.classList.toggle('noedit', !!editingEl);

  let swapBtn = box.querySelector('.dz-swap-handle');
  if (sel.photo) {
    box.classList.add('is-photo');
    if (!swapBtn) {
      swapBtn = document.createElement('div');
      swapBtn.className = 'dz-swap-handle';
      swapBtn.dataset.act = 'swap-photo-handle';
      swapBtn.innerHTML = '🔄 Swap Image';
      swapBtn.title = 'Click to swap this image with another photo';
      box.appendChild(swapBtn);
    }
  } else {
    box.classList.remove('is-photo');
    if (swapBtn) swapBtn.remove();
  }

  positionBar();
}

function candidatesAt(x, y, pv) {
  const pg = pgOf(pv);
  if (!pg) return [];
  const raw = document.elementsFromPoint(x, y);
  const matched = [];
  for (const e of raw) {
    if (e === pg || !pg.contains(e)) continue;
    if (e.classList.contains('dz-sel') || e.classList.contains('dz-bar') || e.classList.contains('pvtag')) continue;
    if (isPhoto(e)) {
      matched.push(e);
      continue;
    }
    const svgImg = e.querySelector && e.querySelector('image');
    if (svgImg) {
      matched.push(e);
      continue;
    }
    if (isText(e) && e.getBoundingClientRect().width > 4) {
      matched.push(e);
    }
  }
  return matched;
}

export function select(el, pv, keepLayers) {
  if (el && pv) {
    const photo = isPhoto(el) || Boolean(el.querySelector && el.querySelector('image')), t = photo ? photoFrame(el, pgOf(pv)) : el;
    sel = { el: t, inner: photo ? el : null, photo, pv, key: keyFor(t, pv) };
  } else {
    sel = null;
  }
  if (!keepLayers) layers = [];
  if (sel) {
    ensureBox(pv);
    box.style.display = 'block';
    place();
    updateBase();
  } else {
    killBox();
  }
  drawPanel();
}

function showHover(el, pv) {
  if (!hov) {
    hov = document.createElement('div');
    hov.className = 'dz-hov';
  }
  if (!el || (sel && (sel.el === el || sel.inner === el))) {
    hov.remove();
    return;
  }
  if (hov.parentElement !== pv) pv.appendChild(hov);
  if (isPhoto(el)) el = photoFrame(el, pgOf(pv));
  const r = el.getBoundingClientRect(), p = pv.getBoundingClientRect();
  Object.assign(hov.style, { left: (r.left - p.left) + 'px', top: (r.top - p.top) + 'px', width: r.width + 'px', height: r.height + 'px' });
}

/* ---------------- pointer handling ---------------- */
function host() { return $('previewHost'); }

function onDown(e) {
  if (!on) return;
  const pv = e.target.closest && e.target.closest('.pvpage');
  if (!pv) return;
  if (editingEl && editingEl.contains(e.target)) return;

  const swapEl = e.target.closest ? e.target.closest('[data-act="swap-photo-handle"]') : null;
  if (swapEl && sel) {
    e.preventDefault();
    e.stopPropagation();
    if (window.onTriggerPhotoSwap) {
      window.onTriggerPhotoSwap(sel);
    }
    return;
  }

  const handleEl = e.target.closest ? e.target.closest('[data-h]') : null;
  const h = handleEl ? handleEl.dataset.h : (e.target.dataset && e.target.dataset.h);
  if (h === 'move' && sel) { snapshot(); startDrag(e, 'move'); return; }
  if (h && sel) { snapshot(); startDrag(e, 'resize:' + h); return; }
  if (e.target === box && sel) { snapshot(); startDrag(e, 'move'); return; }

  const list = candidatesAt(e.clientX, e.clientY, pv);
  if (!list.length) { select(null); return; }

  // Deepest match
  let target = list.find(el => el === e.target) || list[0];
  const photo = isPhoto(target) || Boolean(target.querySelector && target.querySelector('image'));

  layers = list;
  select(target, pv, true);

  // If text: START INLINE EDITING INSTANTLY ON SINGLE CLICK!
  if (!photo && isText(target)) {
    startText(target);
    return; // Don't prevent default so cursor caret positions naturally!
  }

  snapshot();
  startDrag(e, 'move', true);
  e.preventDefault();
}

function startDrag(e, mode) {
  if (!sel) return;
  if (editingEl) stopText();
  const ed = cur() || {}, r = sel.el.getBoundingClientRect(), s = scaleOf(sel.pv);
  drag = { mode, x: e.clientX, y: e.clientY, dx: ed.dx || 0, dy: ed.dy || 0, w: r.width / s, h: r.height / s, s, moved: false, onBox: e.target === box };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp, { once: true });
  e.preventDefault();
}

function onMove(e) {
  if (!drag || !sel) return;
  const ddx = (e.clientX - drag.x) / drag.s, ddy = (e.clientY - drag.y) / drag.s;
  if (Math.abs(ddx) + Math.abs(ddy) > 0.5) drag.moved = true;
  if (drag.mode === 'move') {
    setEdit({ dx: Math.round(drag.dx + ddx), dy: Math.round(drag.dy + ddy) });
  } else {
    const h = drag.mode.split(':')[1], lock = e.shiftKey, ratio = drag.w / drag.h;
    let ddw = 0, ddh = 0;
    if (h.includes('e')) ddw = ddx;
    else if (h.includes('w')) ddw = -ddx;

    if (h.includes('s')) ddh = ddy;
    else if (h.includes('n')) ddh = -ddy;

    let w = drag.w + ddw;
    let hh = drag.h + ddh;
    w = Math.max(24, w);
    hh = Math.max(16, hh);

    if (lock && h.length === 2) {
      hh = w / ratio;
    }

    const dx = drag.dx + (h.includes('w') ? drag.w - w : 0);
    const dy = drag.dy + (h.includes('n') ? drag.h - hh : 0);
    setEdit({ w: Math.round(w), h: Math.round(hh), dx: Math.round(dx), dy: Math.round(dy) });
  }
}

function onUp(e) {
  window.removeEventListener('pointermove', onMove);
  const d = drag;
  drag = null;
  if (d && !d.moved) {
    undo.pop();
    if (d.onBox && sel) {
      const pv = sel.pv;
      box.style.pointerEvents = 'none';
      const list = candidatesAt(e.clientX, e.clientY, pv), at = list.indexOf(sel.inner || sel.el);
      box.style.pointerEvents = '';
      layers = list;
      if (list.length > 1) select(list[(at + 1) % list.length], pv, true);
    }
  } else {
    refitSel().then(updateBase);
  }
}

const refitSel = () => (sel ? refit(sel.inner || sel.el).then(place) : Promise.resolve());

function onHover(e) {
  if (!on || drag || editingEl) return;
  const pv = e.target.closest && e.target.closest('.pvpage');
  if (!pv) { showHover(null); return; }
  const list = candidatesAt(e.clientX, e.clientY, pv);
  showHover(list[0] || null, pv);
}

function onDbl(e) {
  if (!on || !sel) return;
  if (!sel.photo && isText(sel.el)) startText(sel.el);
}

function onKey(e) {
  if (editingEl && e.key === 'Escape') { stopText(); return; }
  if (!on || !sel || editingEl || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName)) return;
  const st = e.shiftKey ? 10 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
  if (d) {
    e.preventDefault();
    snapshot();
    const ed = cur() || {};
    setEdit({ dx: (ed.dx || 0) + d[0], dy: (ed.dy || 0) + d[1] });
  } else if (e.key === 'Escape') {
    select(null);
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    snapshot();
    const elToRemove = sel.el;
    select(null);
    if (elToRemove && elToRemove.parentNode) {
      elToRemove.remove();
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    }
  }
}

/* ---------------- text editing ---------------- */
export function startText(targetEl) {
  const el = targetEl || (sel && sel.el);
  if (!el || !isText(el)) return;
  if (editingEl && editingEl !== el) stopText();
  editingEl = el;
  editingEl.contentEditable = 'true';
  editingEl.style.outline = '2px dashed #3b82f6';
  editingEl.style.outlineOffset = '2px';
  editingEl.style.cursor = 'text';
  editingEl.focus();

  editingEl.onkeydown = (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && !editingEl.textContent.trim()) {
      e.preventDefault();
      const elToRemove = editingEl;
      editingEl = null;
      elToRemove.remove();
      select(null);
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    } else if (e.key === 'Escape') {
      stopText();
    }
  };

  editingEl.oninput = () => {
    if (window.onCatalogueTextEdited) {
      window.onCatalogueTextEdited(el);
    }
    place();
  };

  editingEl.addEventListener('blur', stopText, { once: true });
  place();
  drawPanel();
}

export function stopText() {
  if (!editingEl) return;
  const el = editingEl;
  editingEl = null;
  el.contentEditable = 'false';
  el.style.outline = '';
  el.style.cursor = '';
  el.oninput = null;
  el.onkeydown = null;

  // If user emptied text completely, delete the element!
  const txt = (el.textContent || '').trim();
  if (txt.length === 0) {
    if (el.parentNode) {
      el.remove();
      select(null);
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
      return;
    }
  }

  const html = clean(el);
  snapshot();
  const all = rec();
  const pv = pageOf(el);
  const key = sel ? sel.key : (pv ? keyFor(el, pv) : null);
  if (key) {
    all[key] = Object.assign({}, all[key] || {}, { html });
  }
  if (window.onCatalogueTextSaved) {
    window.onCatalogueTextSaved(el, html);
  }
  if (sel) { place(); drawPanel(); }
}

/* ---------------- top panel ---------------- */
function panel() {
  let p = $('editPanel');
  if (p) return p;
  p = document.createElement('div');
  p.id = 'editPanel';
  p.className = 'editpanel hidden';
  const pi = $('pageInfo');
  if (pi) {
    pi.insertAdjacentElement('beforebegin', p);
  } else if (host()) {
    host().insertAdjacentElement('beforebegin', p);
  }
  p.addEventListener('click', onPanel);
  return p;
}

const labelOf = el => {
  if (!el) return 'Element';
  if (el.tagName === 'IMG') return 'Product Photo';
  if (el.tagName === 'SVG' || el.tagName === 'svg' || (el.querySelector && el.querySelector('image'))) return 'Cut Frame';
  if (isPhoto(el)) return 'Photo';
  return 'Text: ' + (el.textContent.trim().slice(0, 16) || '…');
};
const safe = t => String(t || '').replace(/</g, '&lt;');

function drawPanel() {
  const p = panel();
  if (!p) return;
  p.classList.toggle('hidden', !on);
  p.style.display = on ? 'block' : 'none';
  if (!on) { drawBar(); return; }
  p.innerHTML = '<div class="ep-line"><b>✏️ Interactive Customizer Active</b><span class="ep-hint">' +
    (sel ? 'Selected: <b>' + safe(sel.photo ? 'Photo' : labelOf(sel.el)) + '</b>. Type inline to edit text, or use toolbar below.' : 'Click ANY headline, text, or photo on any page to edit directly.') + '</span></div>' +
    '<div class="ep-line"><button type="button" data-act="undo" ' + (undo.length ? '' : 'disabled') + '>↶ Undo</button><button type="button" data-act="resetall">Reset all</button><button type="button" data-act="done" class="done">✔ Done</button></div>';
  drawBar();
}

function onPanel(e) {
  const b = e.target.closest('button');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  if (editingEl) stopText();
  if (b.dataset.act === 'undo') {
    if (undo.length) {
      const prev = JSON.parse(undo.pop());
      if (uid) {
        if (typeof window !== 'undefined' && window.DesignEdits) {
          window.DesignEdits[uid] = prev;
        }
        EDITS[uid] = prev;
      }
      rerender();
    }
  } else if (b.dataset.act === 'resetall') {
    snapshot();
    if (uid) {
      if (typeof window !== 'undefined' && window.DesignEdits) {
        delete window.DesignEdits[uid];
      }
      delete EDITS[uid];
    }
    stopText();
    select(null);
    rerender();
  } else if (b.dataset.act === 'done') {
    stopText();
    select(null);
    setMode(false);
  }
}

/* ---------------- floating toolbar ---------------- */
function ensureBar() {
  if (bar) return bar;
  bar = document.createElement('div');
  bar.className = 'dz-bar';
  bar.style.display = 'none';
  document.body.appendChild(bar);
  
  // Prevent blur when clicking toolbar buttons so toolbar is not re-drawn before click event!
  bar.addEventListener('mousedown', ev => {
    ev.stopPropagation();
    if (ev.target.id !== 'bTextInput' && ev.target.tagName !== 'INPUT' && ev.target.tagName !== 'SELECT') {
      ev.preventDefault();
    }
    if (ev.target.id === 'bSize') snapshot();
  });
  
  bar.addEventListener('pointerdown', ev => {
    ev.stopPropagation();
  });

  bar.addEventListener('click', onBar);
  bar.addEventListener('input', onBarInput);
  bar.addEventListener('change', onBarChange);
  const pos = () => positionBar();
  window.addEventListener('scroll', pos, true);
  window.addEventListener('resize', pos);
  return bar;
}

function updateBase() {
  if (!sel) { base = null; return; }
  const ed = cur() || {};
  const r = sel.el.getBoundingClientRect(), s = scaleOf(sel.pv);
  const currentW = Math.round(r.width / s), currentH = Math.round(r.height / s);
  let o = orig.get(sel.el);
  if (!o) {
    o = { style: sel.el.getAttribute('style') || '', html: sel.el.innerHTML, initialW: currentW, initialH: currentH };
    orig.set(sel.el, o);
  } else if (!o.initialW) {
    o.initialW = currentW;
    o.initialH = currentH;
  }
  const initW = o.initialW || currentW, initH = o.initialH || currentH;
  base = { w: initW, h: initH, dx: ed.dx || 0, dy: ed.dy || 0 };
}

const FONTS = [
  ['', 'Default / Template Font'],
  ["'Playfair Display', serif", 'Playfair Display (Luxury Serif)'],
  ["'Cinzel', serif", 'Cinzel (Classical Heritage)'],
  ["'Cormorant Garamond', serif", 'Cormorant Garamond (Editorial Serif)'],
  ["'Lora', serif", 'Lora (Book & Literature)'],
  ["'Montserrat', sans-serif", 'Montserrat (Modern Bold Sans)'],
  ["'Outfit', sans-serif", 'Outfit (Modern Clean SaaS)'],
  ["'Inter', sans-serif", 'Inter (Neutral Clean Sans)'],
  ["'Poppins', sans-serif", 'Poppins (Geometric Friendly Sans)'],
  ["'Plus Jakarta Sans', sans-serif", 'Plus Jakarta Sans (Contemporary)'],
  ["'Jost', sans-serif", 'Jost (Futura Inspired)'],
  ["'JetBrains Mono', monospace", 'JetBrains Mono (Technical / Code)'],
  ["Georgia, serif", 'Georgia (Classic Serif)'],
  ["'Times New Roman', serif", 'Times New Roman (Formal)'],
  ["Arial, sans-serif", 'Arial (Standard Sans)']
];

const SHP = [
  ['original', 'Original shape'],
  ['square', 'Square corners'],
  ['rounded', 'Rounded rectangle'],
  ['circle', 'Circle medallion'],
  ['arch', 'Roman arch'],
  ['pill', 'Capsule / Pill'],
  ['leaf', 'Organic leaf'],
  ['diamond', 'Diamond rhombus'],
  ['hex', 'Hexagon tile'],
  ['octagon', 'Octagon gemstone'],
  ['shield', 'Shield badge'],
  ['star', 'Star badge']
];

function drawBar() {
  ensureBar();
  if (!on || !sel) { bar.style.display = 'none'; return; }
  const ed = cur() || {}, items = (window.ODOP_FIT && window.ODOP_FIT.items && window.ODOP_FIT.items()) || [], photo = sel.photo;
  const curScale = (ed.w && base && base.w) ? Math.round((ed.w / base.w) * 100) : 100;
  let h = '';
  if (layers.length > 1) {
    h += '<div class="bar-row bar-layers"><span>Layers:</span>' + layers.map((l, i) => '<button type="button" data-layer="' + i + '" class="' + (l === (sel.inner || sel.el) ? 'on' : '') + '">' + safe(labelOf(l)) + '</button>').join('') + '</div>';
  }
  if (photo) {
    h += '<div class="bar-row" style="margin-bottom:8px;">' +
      '<button type="button" data-act="openswapmodal" style="width:100%;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#ffffff;font-weight:800;font-size:12px;padding:6px 14px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 3px 10px rgba(109,40,217,0.4);">' +
        '🔄 Swap Image (Photo Bank & Products)' +
      '</button>' +
    '</div>' +
    '<div class="bar-row bar-row-shapes"><span>Shape</span><div class="shp-grid">' + SHP.map(([k, t]) => '<button type="button" class="shp shp-' + k + ' ' + ((ed.shape || 'original') === k ? 'on' : '') + '" data-shape="' + k + '" title="' + t + '"><i></i></button>').join('') + '</div></div>' +
      '<div class="bar-row"><span>Size</span><input type="range" id="bSize" min="30" max="200" value="' + curScale + '" title="Make photo smaller or bigger"><em id="bSizeV">' + curScale + '%</em></div>' +
      '<div class="bar-row"><span>Photo</span><select id="bPhoto" title="Swap with another product photo"><option value="">Keep current photo</option>' +
      items.map((it, i) => '<option value="' + i + '" ' + (ed.photo === i ? 'selected' : '') + '>Item ' + (i + 1) + ': ' + safe((it.name || '').slice(0, 26)) + '</option>').join('') + '</select></div>' +
      '<div class="bar-row"><span>Custom</span><button type="button" data-act="uploadphoto" style="font-size:11px;padding:3px 8px;border-radius:6px;border:1px solid #3b82f6;background:#eff6ff;color:#1d4ed8;font-weight:700;cursor:pointer;">📁 Upload File</button><input type="file" id="dzPhotoFile" accept="image/*" style="display:none;" /></div>';
  } else {
    const curFont = ed.fontFamily || '';
    const cs = getComputedStyle(sel.el);
    const isBold = ed.bold === true || (ed.bold === undefined && (cs.fontWeight >= 600 || cs.fontWeight === 'bold'));
    const isItalic = ed.italic === true || (ed.italic === undefined && cs.fontStyle === 'italic');
    const isUnderline = ed.underline === true || (ed.underline === undefined && (cs.textDecorationLine || '').includes('underline'));
    const curTransform = ed.transform || cs.textTransform || 'none';
    const curAlign = ed.align || cs.textAlign || 'left';
    const curSpacing = ed.letterSpacing || 'normal';

    h += 
      // 1. Direct text editing input
      '<div class="bar-row" style="margin-bottom:6px;">' +
        '<input type="text" id="bTextInput" placeholder="Edit text directly here" value="' + safe(sel.el.textContent.trim()) + '" style="width:100%;padding:6px 9px;font-size:12px;border:1.5px solid #cbd5e1;border-radius:7px;font-weight:600;box-sizing:border-box;" />' +
      '</div>' +

      // 2. Font Family Selector
      '<div class="bar-row">' +
        '<span>Font</span>' +
        '<select id="bFontFamily" title="Change typography font family" style="font-weight:600;">' +
          FONTS.map(([fVal, fLabel]) => '<option value="' + safe(fVal) + '" ' + (curFont === fVal ? 'selected' : '') + '>' + safe(fLabel) + '</option>').join('') +
        '</select>' +
      '</div>' +

      // 3. Size, Emphasis & Color
      '<div class="bar-row">' +
        '<span>Style</span>' +
        '<button type="button" data-fs="0.9" title="Decrease font size" style="font-weight:700;">A&minus;</button>' +
        '<button type="button" data-fs="1.1" title="Increase font size" style="font-weight:700;">A+</button>' +
        '<button type="button" data-act="bold" class="' + (isBold ? 'on' : '') + '" title="Bold (B)" style="font-weight:800;"><b>B</b></button>' +
        '<button type="button" data-act="italic" class="' + (isItalic ? 'on' : '') + '" title="Italic / Emphasis (I)" style="font-style:italic;font-family:serif;font-weight:700;"><i>I</i></button>' +
        '<button type="button" data-act="underline" class="' + (isUnderline ? 'on' : '') + '" title="Underline (U)"><u>U</u></button>' +
        '<input type="color" id="bColor" value="' + (ed.color || hex(cs.color)) + '" title="Text color">' +
      '</div>' +

      // 4. Text Casing (Uppercase, Lowercase, Capitalize, Normal)
      '<div class="bar-row">' +
        '<span>Case</span>' +
        '<button type="button" data-case="uppercase" class="' + (curTransform === 'uppercase' ? 'on' : '') + '" title="UPPERCASE (all caps)" style="font-weight:800;font-size:11px;">AA</button>' +
        '<button type="button" data-case="lowercase" class="' + (curTransform === 'lowercase' ? 'on' : '') + '" title="lowercase (all small)" style="font-weight:700;font-size:11px;">aa</button>' +
        '<button type="button" data-case="capitalize" class="' + (curTransform === 'capitalize' ? 'on' : '') + '" title="Capitalize Each Word (Title Case)" style="font-weight:800;font-size:11px;">Aa</button>' +
        '<button type="button" data-case="none" class="' + (curTransform === 'none' ? 'on' : '') + '" title="Normal case (Reset casing)" style="font-size:10.5px;padding:4px 6px;">Abc</button>' +
      '</div>' +

      // 5. Text Alignment
      '<div class="bar-row">' +
        '<span>Align</span>' +
        '<button type="button" data-align="left" class="' + (curAlign === 'left' ? 'on' : '') + '" title="Align text left">⫷ Left</button>' +
        '<button type="button" data-align="center" class="' + (curAlign === 'center' ? 'on' : '') + '" title="Align text center">≡ Center</button>' +
        '<button type="button" data-align="right" class="' + (curAlign === 'right' ? 'on' : '') + '" title="Align text right">⫸ Right</button>' +
      '</div>' +

      // 6. Letter Spacing Tracking
      '<div class="bar-row">' +
        '<span>Space</span>' +
        '<button type="button" data-spacing="normal" class="' + (curSpacing === 'normal' || !ed.letterSpacing ? 'on' : '') + '" title="Normal tracking">Normal</button>' +
        '<button type="button" data-spacing="1.5px" class="' + (curSpacing === '1.5px' ? 'on' : '') + '" title="Letter spacing (+1.5px)">Spaced</button>' +
        '<button type="button" data-spacing="3.5px" class="' + (curSpacing === '3.5px' ? 'on' : '') + '" title="Wide luxury letter spacing (+3.5px)">Wide</button>' +
      '</div>' +

      // 7. Width slider
      '<div class="bar-row">' +
        '<span>Width</span>' +
        '<input type="range" id="bSize" min="40" max="200" value="' + curScale + '" title="Make text box narrower or wider">' +
        '<em id="bSizeV">' + curScale + '%</em>' +
      '</div>';
  }
  h += '<div class="bar-row bar-end"><button type="button" data-act="cloneel" style="color:#2563eb;font-weight:700;background:#eff6ff;border-color:rgba(37,99,235,0.25);" title="Duplicate/Clone this element on the page">⎘ Duplicate</button><button type="button" data-act="deleteel" style="color:#ef4444;font-weight:700;background:#fef2f2;border-color:rgba(239,68,68,0.25);" title="Delete this element from the page">🗑 Delete</button><button type="button" data-act="hide">' + (ed.hide ? 'Show again' : 'Hide') + '</button><button type="button" data-act="resetone">Reset element</button><button type="button" data-act="close" title="Deselect">✕</button></div>';
  bar.innerHTML = h;
  bar.style.display = 'block';
  positionBar();
}

function positionBar() {
  if (!bar || bar.style.display === 'none' || !sel) return;
  const r = sel.el.getBoundingClientRect();
  const bw = bar.offsetWidth || 330, bh = bar.offsetHeight || 120, W = window.innerWidth, H = window.innerHeight;
  let top = r.top - bh - 38;
  if (top < 10) top = r.bottom + 15;
  if (top + bh > H - 10) top = Math.max(10, Math.min(H - bh - 10, r.top + 10));
  let left = r.left + r.width / 2 - bw / 2;
  left = Math.max(10, Math.min(W - bw - 10, left));
  bar.style.top = top + 'px';
  bar.style.left = left + 'px';
  bar.style.visibility = 'visible';
}

function onBar(ev) {
  const b = ev.target.closest('button');
  if (!b) return;
  ev.preventDefault();
  ev.stopPropagation();

  const ed = cur() || {}, d = b.dataset;

  // Process deleteel FIRST before stopText or anything else
  if (d.act === 'deleteel') {
    snapshot();
    const elToRemove = editingEl || (sel && sel.el);
    if (editingEl) {
      editingEl.onblur = null;
      editingEl = null;
    }
    select(null);
    if (elToRemove && elToRemove.parentNode) {
      elToRemove.remove();
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    }
    return;
  }

  // Process cloneel
  if (d.act === 'cloneel') {
    snapshot();
    const elToClone = editingEl || (sel && sel.el);
    if (elToClone && elToClone.parentNode) {
      const clone = elToClone.cloneNode(true);
      clone.classList.add('custom-user-el');
      clone.setAttribute('data-custom-el', 'true');
      const curTop = parseFloat(clone.style.top) || 120;
      clone.style.top = (curTop + 35) + 'px';
      elToClone.parentNode.appendChild(clone);
      select(clone, sel ? sel.pv : pageOf(elToClone));
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    }
    return;
  }

  if (d.layer != null) {
    const el = layers[+d.layer];
    if (el) { stopText(); select(el, sel.pv, true); }
    return;
  }
  if (d.act === 'openswapmodal') {
    if (window.onTriggerPhotoSwap && sel) {
      window.onTriggerPhotoSwap(sel);
    }
    return;
  }
  if (editingEl && d.act !== 'edittext') stopText();
  if (d.act === 'uploadphoto') {
    const fInput = $('dzPhotoFile');
    if (fInput) {
      fInput.value = '';
      fInput.onchange = () => {
        if (fInput.files && fInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (rev) => {
            snapshot();
            setEdit({ customImg: rev.target.result, photo: undefined });
          };
          reader.readAsDataURL(fInput.files[0]);
        }
      };
      fInput.click();
    }
    return;
  }
  if (d.shape) {
    snapshot();
    const p = { shape: d.shape === 'original' ? undefined : d.shape };
    if (d.shape === 'original') {
      if (base && base.w && base.h) {
        p.w = base.w;
        p.h = base.h;
        p.dx = base.dx || 0;
        p.dy = base.dy || 0;
      }
    } else if (['circle', 'square', 'diamond', 'hex', 'octagon', 'shield', 'star'].includes(d.shape)) {
      const r = sel.el.getBoundingClientRect(), s = scaleOf(sel.pv), m = Math.round(Math.min(r.width, r.height) / s);
      Object.assign(p, { w: m, h: m, dx: (ed.dx || 0) + Math.round((r.width / s - m) / 2), dy: (ed.dy || 0) + Math.round((r.height / s - m) / 2) });
    }
    setEdit(p);
    refitSel().then(updateBase);
  } else if (d.fs) {
    snapshot();
    setEdit({ fsMul: Math.round((ed.fsMul || 1) * +d.fs * 100) / 100 });
  } else if (d.act === 'bold') {
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      document.execCommand('bold', false, null);
      snapshot();
      const all = rec();
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
      place();
      return;
    }
    snapshot();
    const cs = getComputedStyle(sel.el);
    const curBold = ed.bold !== undefined ? ed.bold : (cs.fontWeight >= 600 || cs.fontWeight === 'bold');
    setEdit({ bold: !curBold });
    return;
  } else if (d.act === 'italic') {
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      document.execCommand('italic', false, null);
      snapshot();
      const all = rec();
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
      place();
      return;
    }
    snapshot();
    const cs = getComputedStyle(sel.el);
    const curItalic = ed.italic !== undefined ? ed.italic : (cs.fontStyle === 'italic');
    setEdit({ italic: !curItalic });
    return;
  } else if (d.act === 'underline') {
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      document.execCommand('underline', false, null);
      snapshot();
      const all = rec();
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
      place();
      return;
    }
    snapshot();
    const cs = getComputedStyle(sel.el);
    const curUnderline = ed.underline !== undefined ? ed.underline : (cs.textDecorationLine || '').includes('underline');
    setEdit({ underline: !curUnderline });
    return;
  } else if (d.case) {
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      const range = selObj.getRangeAt(0);
      const text = range.toString();
      if (text) {
        let transformed = text;
        if (d.case === 'uppercase') transformed = text.toUpperCase();
        else if (d.case === 'lowercase') transformed = text.toLowerCase();
        else if (d.case === 'capitalize') transformed = text.replace(/\b\w/g, c => c.toUpperCase());
        range.deleteContents();
        const textNode = document.createTextNode(transformed);
        range.insertNode(textNode);
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selObj.removeAllRanges();
        selObj.addRange(newRange);

        snapshot();
        const all = rec();
        all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
        if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
        place();
        return;
      }
    }
    snapshot();
    const nextVal = (ed.transform === d.case && d.case !== 'none') ? 'none' : d.case;
    setEdit({ transform: nextVal });
    return;
  } else if (d.align) {
    snapshot();
    setEdit({ align: d.align });
    return;
  } else if (d.spacing) {
    snapshot();
    const nextVal = (ed.letterSpacing === d.spacing && d.spacing !== 'normal') ? 'normal' : d.spacing;
    setEdit({ letterSpacing: nextVal });
    return;
  } else if (d.act === 'cloneel') {
    snapshot();
    const elToClone = sel.el;
    if (elToClone && elToClone.parentNode) {
      const clone = elToClone.cloneNode(true);
      clone.classList.add('custom-user-el');
      clone.setAttribute('data-custom-el', 'true');
      const curTop = parseFloat(clone.style.top) || 120;
      clone.style.top = (curTop + 35) + 'px';
      elToClone.parentNode.appendChild(clone);
      select(clone, sel.pv);
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    }
    return;
  } else if (d.act === 'deleteel') {
    snapshot();
    const elToRemove = sel.el;
    select(null);
    if (elToRemove && elToRemove.parentNode) {
      elToRemove.remove();
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited();
    }
    return;
  } else if (d.act === 'hide') {
    snapshot();
    setEdit({ hide: !ed.hide });
  } else if (d.act === 'resetone') {
    snapshot();
    delete rec()[sel.key];
    const o = orig.get(sel.el);
    if (o) {
      sel.el.setAttribute('style', o.style);
      sel.el.innerHTML = o.html;
    }
    const childImgs = sel.el.querySelectorAll ? sel.el.querySelectorAll('img, image, svg') : [];
    childImgs.forEach(ci => {
      ci.style.borderRadius = '';
      ci.style.overflow = '';
      if (ci.tagName && ci.tagName.toLowerCase() === 'image') ci.style.clipPath = '';
    });
    place();
    drawBar();
    rerender();
  } else if (d.act === 'close') {
    select(null);
  }
}

function onBarInput(ev) {
  if (!sel) return;
  if (ev.target.id === 'bTextInput') {
    sel.el.textContent = ev.target.value;
    snapshot();
    const all = rec();
    all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
    if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
    place();
    return;
  }
  if (ev.target.id === 'bSize') {
    if (!base) updateBase();
    if (!base || !base.w) return;
    const v = +ev.target.value / 100, photo = sel.photo;
    const vEl = $('bSizeV');
    if (vEl) vEl.textContent = ev.target.value + '%';
    const w = Math.max(24, Math.round(base.w * v)), h = Math.max(24, Math.round(base.h * v));
    setEdit(photo ? { w, h, dx: Math.round(base.dx - (w - base.w) / 2), dy: Math.round(base.dy - (h - base.h) / 2) } : { w, dx: Math.round(base.dx - (w - base.w) / 2) }, true, true);
    return;
  }
  if (ev.target.id === 'bColor') {
    const colorVal = ev.target.value;
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      document.execCommand('foreColor', false, colorVal);
      return;
    }
    setEdit({ color: colorVal }, true, true);
    return;
  }
}

function onBarChange(ev) {
  if (!sel) return;
  if (ev.target.id === 'bFontFamily') {
    const fontVal = ev.target.value;
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      const range = selObj.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontFamily = fontVal;
      try {
        range.surroundContents(span);
      } catch (_) {
        document.execCommand('fontName', false, fontVal);
      }
      snapshot();
      const all = rec();
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
      place();
      return;
    }
    snapshot();
    setEdit({ fontFamily: fontVal });
    return;
  } else if (ev.target.id === 'bColor') {
    const colorVal = ev.target.value;
    const selObj = window.getSelection();
    const hasSelection = selObj && !selObj.isCollapsed && sel.el.contains(selObj.anchorNode);
    if (hasSelection) {
      document.execCommand('foreColor', false, colorVal);
      snapshot();
      const all = rec();
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { html: clean(sel.el) });
      if (window.onCatalogueTextEdited) window.onCatalogueTextEdited(sel.el);
      place();
      return;
    }
    snapshot();
    setEdit({ color: colorVal });
  } else if (ev.target.id === 'bPhoto') {
    snapshot();
    const v = ev.target.value;
    setEdit({ photo: v === '' ? undefined : +v, customImg: undefined });
  }
}

function rerender() {
  if (window.renderDynamicCatalogue) window.renderDynamicCatalogue();
}

/* ---------------- public API ---------------- */
export function setMode(active) {
  on = active;
  document.body.classList.toggle('editing', on);
  const p = $('editPanel') || panel();
  if (p) {
    p.classList.toggle('hidden', !on);
    p.style.display = on ? 'block' : 'none';
  }
  if (!on) {
    stopText();
    select(null);
    showHover(null);
    if (bar) bar.style.display = 'none';
  }
  drawPanel();
  if (typeof window !== 'undefined' && window.onCatalogueModeChanged) {
    window.onCatalogueModeChanged(on);
  }
}

export function isEditing() { return on; }

/* ---------------- Drag and Drop Photo Swap onto Canvas ---------------- */
function findDropPhotoTarget(x, y) {
  const raw = document.elementsFromPoint(x, y);
  for (const e of raw) {
    if (e.classList && (e.classList.contains('dz-sel') || e.classList.contains('dz-bar') || e.classList.contains('dz-hov') || e.classList.contains('dz-move-handle'))) continue;
    if (isPhoto(e)) return e;
    const svgImg = e.querySelector && e.querySelector('image');
    if (svgImg) return svgImg;
    const parImg = e.closest && e.closest('img, image, svg, [style*="url"]');
    if (parImg) return parImg;
  }
  return null;
}

let activeDropTarget = null;

export function applyDroppedPhoto(targetEl, photoUrl, photoIdx) {
  if (!targetEl) return;
  const pv = pageOf(targetEl);
  if (!pv) return;
  select(targetEl, pv);
  snapshot();
  if (photoIdx !== undefined && photoIdx !== null) {
    setEdit({ photo: photoIdx });
  } else if (photoUrl) {
    const all = rec();
    if (sel && sel.key) {
      all[sel.key] = Object.assign({}, all[sel.key] || {}, { kind: 'photo', customImg: photoUrl });
      applyEdit(sel.el, all[sel.key], photoUrl);
      refit(sel.inner || sel.el);
      place();
      drawPanel();
    }
  }
}

function initDragAndDrop(h) {
  if (!h || h._dndInit) return;
  h._dndInit = true;

  h.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    const target = findDropPhotoTarget(e.clientX, e.clientY);
    if (activeDropTarget && activeDropTarget !== target) {
      activeDropTarget.classList.remove('dz-drop-target');
      activeDropTarget = null;
    }
    if (target) {
      target.classList.add('dz-drop-target');
      activeDropTarget = target;
    }
  });

  h.addEventListener('dragleave', (e) => {
    if (activeDropTarget && (!h.contains(e.relatedTarget) || e.relatedTarget === null)) {
      activeDropTarget.classList.remove('dz-drop-target');
      activeDropTarget = null;
    }
  });

  h.addEventListener('drop', (e) => {
    e.preventDefault();
    if (activeDropTarget) {
      activeDropTarget.classList.remove('dz-drop-target');
    }
    const target = activeDropTarget || findDropPhotoTarget(e.clientX, e.clientY);
    activeDropTarget = null;
    if (!target) return;

    // Check for JSON product data from sidebar
    try {
      const rawJson = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      if (rawJson && (rawJson.startsWith('{') || rawJson.startsWith('['))) {
        const data = JSON.parse(rawJson);
        if (data.type === 'product-photo') {
          applyDroppedPhoto(target, data.url, data.index);
          return;
        }
      }
    } catch (_) {}

    // Check for dropped local files (desktop image dropped directly)
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (rev) => {
        applyDroppedPhoto(target, rev.target.result, null);
      };
      reader.readAsDataURL(files[0]);
    }
  });
}

export function onRendered(selTemplate) {
  uid = selTemplate ? (selTemplate.fam + ':' + selTemplate.id) : null;
  const h = host();
  if (!h) return;
  initDragAndDrop(h);

  h.removeEventListener('pointerdown', onDown);
  h.removeEventListener('pointermove', onHover);
  h.removeEventListener('dblclick', onDbl);
  window.removeEventListener('keydown', onKey);

  h.addEventListener('pointerdown', onDown);
  h.addEventListener('pointermove', onHover);
  h.addEventListener('dblclick', onDbl);
  window.addEventListener('keydown', onKey);

  const p = panel();
  if (p) {
    p.removeEventListener('click', onPanel);
    p.addEventListener('click', onPanel);
  }
  if (sel) {
    const pv = sel.pv;
    const pg = pgOf(pv);
    const key = sel.key;
    if (pg && key) {
      const parts = key.split('|');
      const el = byPath(pg, parts[1] ? parts[1].split('.').map(Number) : []);
      if (el) select(el, pv);
      else select(null);
    } else {
      select(null);
    }
  }
}

if (typeof window !== 'undefined') {
  window.DesignEditor = {
    applyAll,
    applyEdit,
    setMode,
    isEditing,
    select
  };
}

