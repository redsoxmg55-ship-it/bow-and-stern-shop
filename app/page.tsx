import HomeClient from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bow & Stern Soap Co. — Small-Batch Soap from Coastal Maine',
  description: 'Hand-poured, cold-process soap made with intention. Bars, circles and bunnies from coastal Maine.',
};

export default function HomePage() {
  return <HomeClient />;
}
