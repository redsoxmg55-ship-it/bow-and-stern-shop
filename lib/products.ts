export interface Product {
  id: string;
  name: string;
  form: 'Bar' | 'Circle' | 'Ribbed Circle' | 'Bunny';
  scent: string;
  price: number;
  tag: string;
  note: string;
  blurb: string;
  notes: string[];
  weight: string;
  cure: string;
  best: string;
}

export const BS_PRODUCTS: Product[] = [
  { id: 'bar-harbor-cedar', name: 'Harbor Cedar', form: 'Bar', scent: 'Woods', price: 12, tag: '', note: 'Cedarwood, vetiver & a whisper of sea air.', blurb: 'A grounding everyday bar built around dry cedarwood and smoky vetiver, lifted by a clean note of cold ocean air. It cures hard, lathers slow and creamy, and finishes the way the working waterfront smells at first light.', notes: ['Cedarwood', 'Vetiver', 'Sea Air'], weight: '4.5 oz', cure: '6 weeks', best: 'Daily bar' },
  { id: 'bar-sea-salt-sage', name: 'Sea Salt & Sage', form: 'Bar', scent: 'Marine', price: 12, tag: '', note: 'Bright ocean salt grounded by garden sage.', blurb: 'Bright mineral sea salt meets the herbal calm of garden sage for a bar that feels like a clear morning on the water. A touch of sea clay gives it a gentle, polishing lather.', notes: ['Sea Salt', 'Sage', 'Sea Clay'], weight: '4.5 oz', cure: '6 weeks', best: 'Morning wash' },
  { id: 'bar-captains-bay-rum', name: "Captain's Bay Rum", form: 'Bar', scent: 'Woods', price: 14, tag: 'Bestseller', note: 'Warm bay rum, clove & worn leather.', blurb: 'Our most-requested bar. Warm bay rum and clove sit over a base of worn leather and aged oak — a classic barbershop finish, hand-poured and cured the slow way.', notes: ['Bay Rum', 'Clove', 'Leather'], weight: '4.5 oz', cure: '6 weeks', best: 'Post-shave' },
  { id: 'bar-driftwood-amber', name: 'Driftwood & Amber', form: 'Bar', scent: 'Woods', price: 13, tag: '', note: 'Sun-bleached driftwood over soft amber.', blurb: 'Sun-bleached driftwood laid over soft, resinous amber — warm without being sweet. A quietly luxurious bar that lingers on the skin long after the wash.', notes: ['Driftwood', 'Amber', 'Musk'], weight: '4.5 oz', cure: '6 weeks', best: 'Evening bar' },
  { id: 'circle-tide-pool-mint', name: 'Tide Pool Mint', form: 'Circle', scent: 'Marine', price: 11, tag: '', note: 'Cool peppermint & kelp — a clean wake-up.', blurb: 'A bracing palm-round of cool peppermint and green kelp — the closest thing to a tide-pool plunge you can keep by the sink. Tingles awake, rinses clean.', notes: ['Peppermint', 'Kelp', 'Eucalyptus'], weight: '3.5 oz', cure: '5 weeks', best: 'Wake-up wash' },
  { id: 'circle-sailors-lime', name: "Sailor's Lime", form: 'Circle', scent: 'Citrus', price: 11, tag: '', note: 'Sharp lime, basil & a salt-rimmed finish.', blurb: 'Sharp Key lime and fresh basil with a salt-rimmed finish — sun-warmed and unmistakably summer. A smooth river-stone round with no edges to waste.', notes: ['Lime', 'Basil', 'Sea Salt'], weight: '3.5 oz', cure: '5 weeks', best: 'Hand soap' },
  { id: 'circle-naked-hull', name: 'Naked Hull', form: 'Circle', scent: 'Unscented', price: 10, tag: '', note: 'Pure, fragrance-free. Just honest soap.', blurb: 'No fragrance, no dye, no story to tell — just honest soap. A pure olive-and-coconut round for the most sensitive skin, exactly as it comes out of the mold.', notes: ['Fragrance-Free', 'Olive Oil', 'Coconut'], weight: '3.5 oz', cure: '5 weeks', best: 'Sensitive skin' },
  { id: 'circle-coastal-lavender', name: 'Coastal Lavender', form: 'Circle', scent: 'Floral', price: 12, tag: '', note: 'Maine lavender softened with sweet cream.', blurb: 'Maine-grown lavender softened with a pour of sweet cream — calming without being old-fashioned. The round to keep beside the tub.', notes: ['Lavender', 'Sweet Cream', 'Vanilla'], weight: '3.5 oz', cure: '5 weeks', best: 'Bath soap' },
  { id: 'ribbed-coastal-fog', name: 'Coastal Fog', form: 'Ribbed Circle', scent: 'Marine', price: 13, tag: '', note: 'Cool sea mist & white cedar — textured for grip.', blurb: 'Sea mist and white cedar pressed into a ridged circle that fits the palm perfectly. The ribbed profile gives it a natural grip and leaves the lather extra airy.', notes: ['Sea Mist', 'White Cedar', 'Driftwood'], weight: '3.5 oz', cure: '5 weeks', best: 'Shower bar' },
  { id: 'ribbed-dark-rum', name: 'Dark Rum & Oakmoss', form: 'Ribbed Circle', scent: 'Woods', price: 13, tag: 'New', note: 'Dark rum, oakmoss & a slow resinous finish.', blurb: 'A deep, resinous round with ridged sides — dark rum and oakmoss in a bar that feels as good in the hand as it smells. Cures to a hard, long-lasting finish.', notes: ['Dark Rum', 'Oakmoss', 'Resin'], weight: '3.5 oz', cure: '5 weeks', best: 'Daily bar' },
  { id: 'ribbed-wild-mint', name: 'Wild Mint & Charcoal', form: 'Ribbed Circle', scent: 'Marine', price: 12, tag: '', note: 'Activated charcoal & wild mint — deep clean.', blurb: 'Activated charcoal and wild mint in our ribbed circle — a detoxifying bar with a cooling finish. The ridged surface exfoliates lightly with every wash.', notes: ['Wild Mint', 'Activated Charcoal', 'Eucalyptus'], weight: '3.5 oz', cure: '5 weeks', best: 'Deep cleanse' },
  { id: 'bunny-little-marlin', name: 'Little Marlin', form: 'Bunny', scent: 'Unscented', price: 9, tag: 'New', note: 'Gentle, fragrance-free — made for small hands.', blurb: 'A molded bunny bar made for small hands and first gifts. Completely fragrance-free and extra mild, with a featherlight lather that rinses clean.', notes: ['Fragrance-Free', 'Shea Butter', 'Extra Mild'], weight: '2.5 oz', cure: '4 weeks', best: 'Kids & gifts' },
  { id: 'bunny-honey-oat', name: 'Honey & Oat Bunny', form: 'Bunny', scent: 'Floral', price: 10, tag: '', note: 'Colloidal oat & raw honey. Calm and creamy.', blurb: 'Colloidal oat and raw New England honey make this molded bunny calm, creamy and soothing — a favorite for dry-skin little ones and gift baskets alike.', notes: ['Raw Honey', 'Colloidal Oat', 'Cream'], weight: '2.5 oz', cure: '4 weeks', best: 'Dry skin' },
  { id: 'bunny-lemon-buoy', name: 'Lemon Buoy Bunny', form: 'Bunny', scent: 'Citrus', price: 10, tag: '', note: 'Cheerful lemon zest — a favorite for favors.', blurb: 'Cheerful cold-pressed lemon zest in our molded bunny form — bright, clean and impossible not to smile at. A go-to for party favors and welcome baskets.', notes: ['Lemon Zest', 'Litsea', 'Sweet Orange'], weight: '2.5 oz', cure: '4 weeks', best: 'Favors' },
  { id: 'bunny-sea-foam', name: 'Sea Foam Bunny', form: 'Bunny', scent: 'Marine', price: 10, tag: '', note: 'Soft sea breeze & aloe. Featherlight lather.', blurb: 'A soft sea-breeze scent over cooling aloe, molded into our charming bunny bar. Gentle enough for everyday, light enough for the most delicate skin.', notes: ['Sea Breeze', 'Aloe', 'Cucumber'], weight: '2.5 oz', cure: '4 weeks', best: 'Everyday gift' },
];

export const FORM_GLYPH: Record<string, 'bar' | 'circle' | 'ribbed' | 'bunny'> = {
  Bar: 'bar', Circle: 'circle', 'Ribbed Circle': 'ribbed', Bunny: 'bunny',
};
