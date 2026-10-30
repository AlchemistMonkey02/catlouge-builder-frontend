/* Product & Industry Catalogue Copy Generator adapted from odop-kritika */
const TOKEN = (s, d) => String(s || '').replace(/\{district\}/g, d);
const hash = s => {
  let x = 2166136261;
  for (const ch of String(s || '')) {
    x ^= ch.charCodeAt(0);
    x = Math.imul(x, 16777619);
  }
  x ^= x >>> 15;
  x = Math.imul(x, 2246822507);
  x ^= x >>> 13;
  x = Math.imul(x, 3266489909);
  x ^= x >>> 16;
  return x >>> 0;
};
const pick = (arr, seed, off) => arr[(seed + (off || 0)) % arr.length];

const PACKS = {
  'Kota Doria': {
    key: 'textile', badge: 'Handwoven',
    tagline: ['Handcrafted elegance, light as air.', 'Fine fabric and craftsmanship, created the honest way.', 'Authentic design with a signature feel.'],
    story: [['Handcrafted with,', 'timeless care.'], ['Light as a', 'breath of air.'], ['Threads of', 'heritage & passion.']],
    hero: [['Created slowly,', 'with pride.'], ['Finest materials,', 'refined texture.'], ['Soft as', 'a memory.']],
    dense: [['Printed', 'by hand.'], ['Drawn', 'thread by thread.'], ['Made for', 'every celebration.']],
    edit: ['The Signature Edit', "The Artisan Edit", 'The Festive Edit'],
    values: [[['By hand', 'Crafted and finished by skilled artisans of {district}.'], ['Honestly told', 'Clear fabric, dimensions and price. No surprises.'], ['With care', 'Carefully checked, folded and dispatched.']],
             [['Authentic', 'Every piece made with genuine dedication.'], ['True to colour', 'We show every product as it truly is.'], ['Made to last', 'Durable, beautiful and easy to care for.']]],
    why: ['Authentic craftsmanship', 'Direct from the source', 'Clear dimensions and pricing', 'Fine finish and borders', 'Small or bulk volume orders', 'Protective packaging'],
    what: ['Apparel and textiles', 'Fabric sets & material', 'Stoles & decorative wraps', 'Custom orders welcome', 'Export quantities'],
    legacy: 'Built on years of dedicated craft, {ent} stands for honest production, fair prices and quality you can feel.',
    isText: 'Our textiles are created with dedicated weaving and printing traditions. Open breathable textures provide natural comfort, vibrant look and enduring drape.',
    understand: 'UNDERSTANDING OUR FABRIC',
    benefits: [['leaf', 'Light & breathable', 'Open weave keeps fabric airy and comfortable in all conditions.'], ['shield', 'Durable strength', 'Selected yarns hold their shape over prolonged use.'], ['drop', 'Easy care', 'Gentle wash preserves texture and soft luster.']],
    fin: { title: ['Weaves &', 'Finishes'], intro: 'Explore our finishes and textures. Ask our specialists which one matches your needs.', items: [['Plain Classic', 'Classic weave in a refined solid tone.'], ['Hand Block Print', 'Artisan hand-printed motifs on natural base.'], ['Zari Accents', 'Fine metallic thread detailing.'], ['Custom Dyed', 'Even, rich saturated colour across the piece.']] },
    appsTitle: 'WAYS TO WEAR IT', apps: ['Festive wear', 'Daily elegance', 'Designer apparel', 'Home furnishings', 'Bespoke tailoring'],
    steps: ['Yarn selected', 'Woven on loom', 'Finished & packed'], process: [['Yarn', 'Pure cotton & silk'], ['Weave', 'Precision loom'], ['Check', 'Piece by piece'], ['Pack', 'Folded with care']],
    seal: ['HAND', 'CRAFTED'], coverLine: 'Handcrafted quality, supplied across India with careful protective packing.',
    promise: { title: ['Carefully checked,', 'delivered with care.'], text: 'Every piece is verified before dispatch from {district}. We pack it to arrive pristine, and we tell you plainly what you are buying.' },
    care: [['Care instructions', 'Wash gently in cold water and dry in shade. Iron on low setting.'], ['Exchange', 'If a piece is not as described, tell us within 7 days and we will make it right.'], ['Honest pictures', 'Colours can vary slightly depending on display screens. Natural variations are authentic.']],
    note: 'Handcrafted items may show subtle natural variations in shade and weave. Photos are indicative.', formats: null
  },
  'Kota Stone': {
    key: 'stone', badge: 'Quarry-Direct', stone: true,
    tagline: ['Natural. Durable. Timeless.', 'Solid quality, honest prices.', 'Strong material with a timeless look.'],
    story: [['Quarried from Hadoti,', 'built to last.'], ['Natural stone,', 'honestly told.'], ['Cool underfoot,', 'strong for generations.']],
    hero: [['Cool underfoot,', 'strong for life.'], ['Texture you', 'can feel.'], ['Honed by time,', 'finished by hand.']],
    dense: [['Slabs &', 'tiles.'], ['Every', 'finish.'], ['The', 'collection.']],
    edit: ['The Floor Edit', 'The Stone Edit', 'The Architectural Edit'],
    values: [[['Natural', 'Quarried and cut from genuine regional stone.'], ['Honestly told', 'Clear dimensions, thickness and finish.'], ['Delivered with care', 'Packed to arrive safely, right on schedule.']],
             [['Built to last', 'Resilient material for heavy commercial & domestic use.'], ['Clear details', 'Size, thickness and finish listed for every piece.'], ['On schedule', 'We coordinate dispatch around your project site.']]],
    why: ['Quality assurance', 'Timely dispatch', 'Durable material', 'Competitive pricing', 'Customer satisfaction', 'Eco-friendly practices'],
    what: ['Residential projects', 'Hospitality developments', 'Commercial complexes', 'Landscaping & pathways', 'Architectural elements'],
    legacy: 'Built on experience, {ent} stands for reliability, honest dealing and materials that last.',
    isText: 'Kota Stone is a fine-grained limestone formed in natural layers. Quarried directly from the earth, it is renowned for its durability, cooling properties and subtle grey-green tones.',
    understand: 'UNDERSTANDING THE MATERIAL',
    benefits: [['shield', 'Exceptional durability', 'Engineered to withstand heavy foot traffic and outdoor weather.'], ['foot', 'Naturally non-slip', 'Maintains grip even when wet, ideal for walkways and terraces.'], ['leaf', 'Eco-friendly & cooling', 'A natural material that stays cool under sunlight with low environmental impact.']],
    fin: { title: ['Surface', 'Finishes'], intro: 'Our surface finishes bring out the natural character of the stone and provide the right look for every architectural space.', items: [['Leather finish', 'Refined matte texture with superior grip and modern feel.'], ['Semi-polish', 'Soft sheen that accentuates color while maintaining natural touch.'], ['Mirror polish', 'High-gloss reflective finish for luxury commercial spaces.'], ['Natural split', 'Raw textured face straight from the quarry, ideal for outdoor paths.']] },
    finAll: [['Natural / Cleft', 'The raw split face with a textured look.'], ['Sawn', 'Machine cut with a flat, even surface.'], ['Honed', 'Smooth matte surface with no shine.'], ['Brushed', 'Soft, aged feel with light texture.'], ['Flamed', 'Heat-treated for an anti-slip finish.'], ['Tumbled', 'Softened edges and an antique look.'], ['Sandblasted', 'Fine textured, matte surface.'], ['Bush-hammered', 'Coarse textured surface for good grip.'], ['Polished', 'Glossy surface that shows colour and grain.']],
    appsTitle: 'VERSATILE APPLICATIONS', apps: ['Staircases & risers', 'Interior flooring', 'Hospitality & resorts', 'Outdoor pathways & plazas', 'Commercial spaces'],
    steps: ['Quarried & selected', 'Cut & finished', 'Checked & dispatched'], process: [['Quarry', 'Selected blocks'], ['Cut', 'Calibrated sizes'], ['Check', 'Every slab'], ['Pack', 'Crate dispatch']],
    seal: ['FACTORY', 'CALIBRATED'], coverLine: 'Supplied directly across India with careful grading from quarry to site.',
    promise: { title: ['Packed with care,', 'delivered on time.'], text: 'Every lot is checked before it leaves {district}. We pack with wooden crates and foam to arrive safely.' },
    care: [['Maintenance', 'Clean with mild water and neutral detergent. Seal porous outdoor finishes if desired.'], ['Allowance', 'Order 10-15% extra for cuts and breakage during installation.'], ['Natural variation', 'Shade, veining and size vary naturally in genuine stone. Samples are indicative.']],
    note: 'Natural stone varies in shade, grain and size from piece to piece. Photos and samples are indicative.',
    formats: [['Paving Slabs', 'Custom dimensions'], ['Steps & Risers', '100 - 200 x 35 x 15 cm'], ['Kerbstones', '100 x 20 x 5 - 7 cm'], ['Wall Cladding', '20 - 40 x 20 x 10 / 15 cm'], ['Cobbles / Tumbled', '10 x 10, 14 x 14, 20 x 20 cm'], ['Palisades', '230 x 50 x 5 - 7 cm']],
    patterns: ['Radial X Pattern', 'Diamond Layout', 'Plus Pattern', 'Single Diagonal', 'Brick Strips', 'Square Grid']
  },
  'Sandstone': {
    key: 'sandstone', badge: 'Hand-Carved', stone: true,
    tagline: ['Carved by hand, cut to precision.', 'Warm natural stone with a story.', 'Cut, carved and finished to custom orders.'],
    story: [['Carved with care,', 'one cut at a time.'], ['A palace', 'in stone.'], ['Formed from', 'the earth.']],
    hero: [['Shaped by hand,', 'kept for ages.'], ['Fit for', 'architectural wonder.'], ['Grain, shade', 'and shadow.']],
    dense: [['Carved &', 'cut to order.'], ['The royal', 'collection.'], ['Gardens &', 'facades.']],
    edit: ['The Carved Edit', 'The Royal Edit', 'The Architectural Edit'],
    values: [[['By hand', 'Cut and carved by master craftsmen.'], ['Honestly told', 'Clear colour, size and unit pricing.'], ['With care', 'Packed securely in protective crates.']],
             [['Made to order', 'Share your drawings or dimensions for bespoke quoting.'], ['True colours', 'We present the stone texture as it truly is.'], ['Weather resistant', 'Resilient material that endures sun and rain.']]],
    why: ['Direct from quarry', 'Skilled carving', 'Custom sizes & CAD designs', 'Careful packing', 'Fair pricing', 'On-time dispatch'],
    what: ['Facades & wall cladding', 'Jali lattice screens & relief carvings', 'Pillars, brackets & arches', 'Garden sculptures & landscape pieces', 'Flooring & paving'],
    legacy: 'Built on generations of craft, {ent} stands for honest stonework and pieces that stand the test of time.',
    isText: 'Sandstone is formed from natural compressed quartz grains over millennia. Featuring rich red, buff, beige and chocolate tones, it offers easy carveability alongside weather-tested strength.',
    understand: 'UNDERSTANDING SANDSTONE',
    benefits: [['shield', 'Strong & enduring', 'Solid material that handles harsh sun, frost and rain.'], ['leaf', 'Warm aesthetic appeal', 'Natural warm grains give every facade a distinctive character.'], ['star', 'Custom carving', 'Lattice jali work and bas-relief can be cut by hand or CNC to your design.']],
    fin: { title: ['Surface', 'Finishes'], intro: 'Surface finishes tailored to your aesthetic. Tell us your concept and our team will recommend the right cut.', items: [['Natural cleft', 'Split face with organic textured appearance.'], ['Honed smooth', 'Silky matte surface with no glare.'], ['Sandblasted', 'Finely textured surface with high anti-slip grip.'], ['Hand-carved', 'Traditional motifs and dimensional relief.']] },
    finAll: [['Natural / Cleft', 'The raw split face with a textured look.'], ['Sawn', 'Machine cut with a flat, even surface.'], ['Honed', 'Smooth matte surface with no shine.'], ['Brushed', 'Soft, aged feel with light texture.'], ['Flamed', 'Heat-treated for an anti-slip finish.'], ['Tumbled', 'Softened edges and an antique look.'], ['Sandblasted', 'Fine textured, matte surface.'], ['Bush-hammered', 'Coarse textured surface for good grip.'], ['Polished', 'Glossy surface that shows colour and grain.']],
    appsTitle: 'WHERE IT IS USED', apps: ['Building facades & cladding', 'Jali lattice screens', 'Pillars & entrance gates', 'Garden fountains & benches', 'Flooring & outdoor paving'],
    steps: ['Selected from quarry', 'Hand-carved & cut', 'Finished & dispatched'], process: [['Quarry', 'Selected blocks'], ['Carve', 'Craftsmen & CNC'], ['Check', 'Every piece'], ['Pack', 'Crate dispatch']],
    seal: ['MASTER', 'CRAFTED'], coverLine: 'Supplied across India and internationally with careful protective packing.',
    promise: { title: ['Packed with care,', 'delivered intact.'], text: 'Every architectural piece is bubble-wrapped and crated before dispatch from {district}.' },
    care: [['Care instructions', 'Wash with plain water and soft brush. Apply stone impregnator for outdoor installations.'], ['Transit claim', 'Report any damaged pieces within 7 days and we will promptly replace them.'], ['Natural variation', 'Veining, quartz lines and color variations are authentic characteristics of natural sandstone.']],
    note: 'Natural stone varies in shade, veining and dimension from piece to piece. Photos are indicative.',
    formats: [['Paving Slabs', 'Custom sizes'], ['Cobble / Tumble', '10 x 10, 14 x 14, 20 x 20 cm'], ['Step Stones', '50 - 200 x 35 x 15 cm'], ['Wall Cladding', '20 - 40 x 20 x 10 / 15 cm'], ['Kerbstones', '100 x 20 x 5 - 7 cm'], ['Palisades', '230 x 50 x 5 - 7 cm']],
    patterns: ['Floral Jali Lattice', 'Diamond Pattern', 'Star Inlay', 'Arch Border Relief', 'Lotus Carving', 'Geometric Screen']
  },
  'Generic': {
    key: 'general', badge: 'Certified Quality',
    tagline: ['Crafted with precision, delivered with care.', 'Premium products engineered for everyday living.', 'Consistency, transparency, and superior finish.'],
    story: [['Thoughtfully curated,', 'built to satisfy.'], ['Modern design,', 'enduring value.'], ['Quality products,', 'transparent service.']],
    hero: [['Engineered for life,', 'finished to impress.'], ['Attention to detail,', 'reliable performance.'], ['Smart choice,', 'guaranteed satisfaction.']],
    dense: [['The full range,', 'at a glance.'], ['Every variant,', 'every option.'], ['Designed for you,', 'ready to ship.']],
    edit: ['The Signature Edit', 'The Curated Edit', 'The Essential Edit'],
    values: [[['Superior Grade', 'Meticulous manufacturing and inspection before dispatch.'], ['Honest Pricing', 'Transparent pricing with no hidden charges.'], ['Dedicated Care', 'Customer support and warranty assistance on every order.']],
             [['Reliable Supply', 'Consistent batches and dependable order fulfillment.'], ['Real Specifications', 'Exact materials, dimensions and tolerances listed.'], ['On-Time Dispatch', 'Safe packaging and tracked transport to your location.']]],
    why: ['Quality assurance', 'Prompt delivery', 'Durable build', 'Competitive wholesale pricing', 'Customer satisfaction', 'Tailored options'],
    what: ['Commercial requirements', 'Retail distribution', 'Corporate gifting', 'Wholesale orders', 'Custom branding'],
    legacy: 'Built on dedication to customer satisfaction, {ent} delivers reliable products and lasting business relationships.',
    isText: 'Our product catalogue is curated with focus on durability, modern finish and dependable functionality. Every product conforms to stringent quality benchmarks.',
    understand: 'PRODUCT SPECIFICATIONS & FEATURES',
    benefits: [['shield', 'Tested durability', 'Engineered to withstand rigorous daily use and long lifecycle.'], ['star', 'Modern styling', 'Refined aesthetics that complement contemporary settings.'], ['box', 'Protective packaging', 'Secured with high-strength cartons to ensure safe arrival.']],
    fin: { title: ['Options &', 'Variations'], intro: 'Discover the available options and finishes. Speak to our sales team for bespoke configurations.', items: [['Standard Option', 'Dependable finish for routine application.'], ['Premium Polish', 'Enhanced texture with refined visual appeal.'], ['Heavy Duty', 'Reinforced grade for high-demand environments.'], ['Customized Spec', 'Made according to client specifications.']] },
    finAll: [['Standard', 'Base specification.'], ['Polished', 'High gloss sheen.'], ['Matte', 'Non-reflective satin touch.'], ['Textured', 'Tactile grip finish.'], ['Custom', 'Made to client specification.']],
    appsTitle: 'POPULAR APPLICATIONS', apps: ['Commercial projects', 'Domestic use', 'Institutional supply', 'Hospitality sector', 'Wholesale trading'],
    steps: ['Material selection', 'Precision manufacture', 'Quality inspection & dispatch'], process: [['Source', 'Selected grade'], ['Make', 'Precision tooling'], ['Inspect', '100% check'], ['Pack', 'Shockproof packing']],
    seal: ['PREMIUM', 'CERTIFIED'], coverLine: 'Supplied across India with dedicated support and reliable dispatch.',
    promise: { title: ['Carefully inspected,', 'delivered on schedule.'], text: 'Every shipment is verified before leaving our warehouse. We guarantee transparent service and authentic specifications.' },
    care: [['Care instructions', 'Handle with care. Refer to the product user guide for optimal maintenance.'], ['Returns policy', 'Notify us within 7 days if any item arrives damaged or not as specified.'], ['Product photos', 'Actual color tones may vary slightly depending on monitor color calibration.']],
    note: 'Specifications and dimensions are indicative and may vary slightly due to continuous improvement.', formats: null
  }
};

const FALLBACK = 'Generic';

export function packFor(info) {
  const p = ((info && info.product) || '').toLowerCase();
  const ent = ((info && info.ent) || '').toLowerCase();
  const ind = ((info && info.industry) || '').toLowerCase();
  const haystack = `${p} ${ent} ${ind}`;

  if (haystack.includes('doria') || haystack.includes('fabric') || haystack.includes('cloth') || haystack.includes('textile') || haystack.includes('saree') || haystack.includes('fashion') || haystack.includes('garment')) {
    return ['Kota Doria', PACKS['Kota Doria']];
  }
  if (haystack.includes('sandstone') || haystack.includes('carving') || haystack.includes('jali') || haystack.includes('craft') || haystack.includes('artisan')) {
    return ['Sandstone', PACKS['Sandstone']];
  }
  if (haystack.includes('stone') || haystack.includes('granite') || haystack.includes('marble') || haystack.includes('slab') || haystack.includes('tile') || haystack.includes('floor') || haystack.includes('construction') || haystack.includes('paving')) {
    return ['Kota Stone', PACKS['Kota Stone']];
  }
  return [FALLBACK, PACKS[FALLBACK]];
}

export function getCopy(info, ov) {
  ov = ov || {};
  info = info || {};
  const [name, P] = packFor(info);
  const base = (info.ent || '') + '|' + (info.district || '');
  const sd = tag => hash(base + '#' + tag);
  const D = info.district || 'India';
  const ent = info.ent || 'Our Brand';
  const T = s => TOKEN(s, D).replace(/\{ent\}/g, ent);
  const pair = a => [T(a[0]), T(a[1])];
  const vals = pick(P.values, sd('values')).map(v => [T(v[0]), T(v[1])]);

  return {
    pack: name,
    key: P.key,
    stone: !!P.stone,
    badge: P.badge,
    tagline: ov.tagline || (info.tagline ? T(info.tagline) : T(pick(P.tagline, sd('tagline')))),
    storyTitle: pair(pick(P.story, sd('story'))),
    heroTitle: pair(pick(P.hero, sd('hero'))),
    denseTitle: pair(pick(P.dense, sd('dense'))),
    editTitle: pick(P.edit, sd('edit')),
    titlePool: [].concat(P.story, P.hero, P.dense).map(pair),
    values: (ov.values && ov.values.length === 3) ? ov.values : vals,
    why: (ov.why && ov.why.length) ? ov.why : P.why,
    what: (ov.what && ov.what.length) ? ov.what : P.what,
    legacy: T(P.legacy),
    isText: P.isText,
    understand: P.understand,
    benefits: P.benefits,
    fin: P.fin,
    finAll: P.finAll || (P.fin && P.fin.items) || [],
    appsTitle: P.appsTitle,
    apps: (ov.apps && ov.apps.length) ? ov.apps : P.apps,
    steps: P.steps,
    process: P.process.map(x => [T(x[0]), T(x[1])]),
    seal: P.seal,
    coverLine: P.coverLine,
    promise: { title: pair(P.promise.title), text: T(P.promise.text) },
    care: P.care,
    note: P.note,
    formats: P.formats,
    patterns: P.patterns || null
  };
}

if (typeof window !== 'undefined') {
  window.CONTENT = { getCopy, PACKS, hash };
  window.getCopy = getCopy;
}
export default getCopy;
