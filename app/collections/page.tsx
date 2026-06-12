import CollectionsClient from './CollectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections — Bow & Stern Soap Co.',
  description: 'Edits of our bars grouped by scent and intention — each poured from the same small-batch craft.',
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
