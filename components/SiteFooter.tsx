'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useGsapReveal } from '@/hooks/useGsapReveal';

const InstaSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.16 15.6 2.15 15.2 2.15 12s0-3.58.07-4.85C2.37 3.92 3.88 2.38 7.14 2.23 8.41 2.18 8.79 2.16 12 2.16zm0 3.68A6.12 6.12 0 1 0 18.12 12 6.12 6.12 0 0 0 12 5.88zm0 10.1A3.98 3.98 0 1 1 15.98 12 3.98 3.98 0 0 1 12 15.98zm6.4-10.56a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/>
  </svg>
);
const LiSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z"/>
  </svg>
);

export default function SiteFooter() {
  const ctaRef = useRef<HTMLDivElement>(null);
  useGsapReveal(ctaRef);

  return (
    <footer className="site-footer">
      <div className="footer-cta" ref={ctaRef}>
        <h2>Let&rsquo;s craft something with intention.</h2>
        <p>Whether you&rsquo;re a business looking for a partner or an individual after the perfect bar, every order gets the same level of care.</p>
        <Link className="btn btn-gold" href="/private-clients">Request a Quote</Link>
      </div>

      <div className="footer-main">
        <div className="footer-col footer-brand-col">
          <Image src="/logo.png" alt="Bow & Stern Soap Co." width={64} height={64} style={{ height: 64, width: 'auto', marginBottom: 14 }} />
          <div className="footer-tag">Handcrafted soap,<br />made with intention.</div>
          <div className="footer-socials">
            <a href="https://www.instagram.com/stickyymat" target="_blank" rel="noopener" aria-label="Instagram"><InstaSVG /></a>
            <a href="https://www.linkedin.com/in/mateo-griffen-32b8a5263/" target="_blank" rel="noopener" aria-label="LinkedIn"><LiSVG /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link href="/shop">All Soaps</Link>
          <Link href="/shop">Bar Soap</Link>
          <Link href="/shop">Circle Soap</Link>
          <Link href="/collections">Collections</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="mailto:bowandsternsoapco@gmail.com">Wholesale</a>
          <a href="mailto:bowandsternsoapco@gmail.com">Get in Touch</a>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <a href="tel:6176317175">617-631-7175</a>
          <a href="mailto:bowandsternsoapco@gmail.com">bowandsternsoapco@gmail.com</a>
          <p>New England, USA</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">&copy; {new Date().getFullYear()} Bow &amp; Stern Soap Co. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textDecoration: 'none' }}>Terms of Service</Link>
          <span className="footer-made">Made in the USA 🇺🇸</span>
        </span>
      </div>
    </footer>
  );
}
