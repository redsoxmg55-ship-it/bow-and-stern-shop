import AboutClient from './AboutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Bow & Stern Soap Co.',
  description: 'Small-batch soap made with intention. The story behind Bow & Stern.',
};

export default function AboutPage() {
  return <AboutClient />;
}
