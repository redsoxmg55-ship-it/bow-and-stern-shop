import CustomizeClient from './CustomizeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize — Bow & Stern Soap Co.',
  description: 'Design your own custom soap — choose form, scent, color and engraving.',
};

export default function CustomizePage() {
  return <CustomizeClient />;
}
