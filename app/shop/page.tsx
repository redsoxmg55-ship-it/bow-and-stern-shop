import ShopClient from './ShopClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop — Bow & Stern Soap Co.',
  description: 'Browse every bar, circle and bunny — small-batch soap made with intention.',
};

export default function ShopPage() {
  return <ShopClient />;
}
