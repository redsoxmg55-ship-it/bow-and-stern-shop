import CatalogClient from './CatalogClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalog — Bow & Stern Soap Co.',
  description: 'Build your own soap catalog with custom photos.',
};

export default function CatalogPage() {
  return <CatalogClient />;
}
