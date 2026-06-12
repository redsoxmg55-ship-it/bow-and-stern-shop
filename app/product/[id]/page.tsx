import ProductClient from './ProductClient';
import { BS_PRODUCTS } from '@/lib/products';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return BS_PRODUCTS.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = BS_PRODUCTS.find(x => x.id === id);
  return {
    title: p ? `${p.name} — Bow & Stern Soap Co.` : 'Product — Bow & Stern Soap Co.',
    description: p?.note,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductClient id={id} />;
}
