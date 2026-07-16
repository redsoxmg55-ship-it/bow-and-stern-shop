export interface Product {
  id: string;
  name: string;
  form: 'Bar' | 'Roundstone' | 'Bunny' | 'Voyager Boat';
  scent: string;
  price: number;
  tag: string;
  note: string;
  blurb: string;
  notes: string[];
  weight: string;
  best: string;
}

const LV_NOTE = 'Lemon Verbena';
const LV_BLURB = 'Hand-poured and slow-cured with our signature lemon verbena scent.';
const LV_NOTES = ['Lemon Verbena'];

export const BS_PRODUCTS: Product[] = [
  { id: 'bar-harbor-cedar',     name: 'Spa Bar',             form: 'Bar',          scent: LV_NOTE, price: 12, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '4.5 oz', best: 'Daily bar' },
  { id: 'bar-sea-salt-sage',    name: 'Sea Salt & Sage',     form: 'Bar',          scent: LV_NOTE, price: 12, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '4.5 oz', best: 'Morning wash' },
  { id: 'bar-captains-bay-rum', name: "Captain's Bay Rum",   form: 'Bar',          scent: LV_NOTE, price: 14, tag: 'Bestseller', note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '4.5 oz', best: 'Post-shave' },
  { id: 'bar-driftwood-amber',  name: 'Driftwood & Amber',   form: 'Bar',          scent: LV_NOTE, price: 13, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '4.5 oz', best: 'Evening bar' },
  { id: 'circle-tide-pool-mint',name: 'The Roundstone Soap', form: 'Roundstone',   scent: LV_NOTE, price: 11, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.5 oz', best: 'Wake-up wash' },
  { id: 'circle-sailors-lime',  name: "Sailor's Lime",       form: 'Roundstone',   scent: LV_NOTE, price: 11, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.5 oz', best: 'Hand soap' },
  { id: 'circle-naked-hull',    name: 'Naked Hull',          form: 'Roundstone',   scent: LV_NOTE, price: 10, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.5 oz', best: 'Sensitive skin' },
  { id: 'circle-coastal-lavender', name: 'Coastal Lavender', form: 'Roundstone',   scent: LV_NOTE, price: 12, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.5 oz', best: 'Bath soap' },
  { id: 'voyager-open-water',   name: 'Open Water',          form: 'Voyager Boat', scent: LV_NOTE, price: 14, tag: 'New',       note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.8 oz', best: 'Gift & display' },
  { id: 'voyager-north-star',   name: 'North Star',          form: 'Voyager Boat', scent: LV_NOTE, price: 14, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '3.8 oz', best: 'Gift' },
  { id: 'bunny-little-marlin',  name: 'Little Marlin',       form: 'Bunny',        scent: LV_NOTE, price: 9,  tag: 'New',       note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '2.5 oz', best: 'Kids & gifts' },
  { id: 'bunny-honey-oat',      name: 'Honey & Oat Bunny',   form: 'Bunny',        scent: LV_NOTE, price: 10, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '2.5 oz', best: 'Dry skin' },
  { id: 'bunny-lemon-buoy',     name: 'Lemon Buoy Bunny',    form: 'Bunny',        scent: LV_NOTE, price: 10, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '2.5 oz', best: 'Favors' },
  { id: 'bunny-sea-foam',       name: 'Sea Foam Bunny',       form: 'Bunny',        scent: LV_NOTE, price: 10, tag: '',          note: LV_NOTE, blurb: LV_BLURB, notes: LV_NOTES, weight: '2.5 oz', best: 'Everyday gift' },
];

export const FORM_GLYPH: Record<string, 'bar' | 'circle' | 'bunny' | 'voyager'> = {
  Bar: 'bar', Roundstone: 'circle', Bunny: 'bunny', 'Voyager Boat': 'voyager',
};
