import HomeClient from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bow & Stern Soap Co. — Small-Batch Handcrafted Soap',
  description: 'Hand-poured, cold-process soap made with intention. Bar, Roundstone, and Voyager Boat forms — crafted in New England.',
};

export default function HomePage() {
  return <HomeClient />;
}
