'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { page: 'home', href: '/', label: 'Home' },
  { page: 'shop', href: '/shop', label: 'Shop' },
  { page: 'customize', href: '/customize', label: 'Customize' },
  { page: 'collections', href: '/collections', label: 'Collections' },
  { page: 'catalog', href: '/catalog', label: 'Catalog' },
  { page: 'about', href: '/about', label: 'About' },
];

const AB_MESSAGES = [
  'Now taking custom & wholesale orders — request a quote ›',
  'Handcrafted in small batches off the New England coast ›',
  'New: The Harbor Series — shop the seasonal collection ›',
];

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

export default function SiteNav() {
  const pathname = usePathname();
  const [abIdx, setAbIdx] = useState(0);
  const [abVisible, setAbVisible] = useState(true);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bs-dark');
      if (saved === '1') { setDark(true); document.body.classList.add('dark-mode'); }
    } catch {}
    const updateCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem('bs-cart') || '[]');
        setCartCount(c.reduce((n: number, i: { qty: number }) => n + i.qty, 0));
      } catch {}
    };
    updateCart();
    window.addEventListener('bs-cart-updated', updateCart);
    return () => window.removeEventListener('bs-cart-updated', updateCart);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAbVisible(false);
      setTimeout(() => { setAbIdx(i => (i + 1) % AB_MESSAGES.length); setAbVisible(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle('dark-mode', next);
    try { localStorage.setItem('bs-dark', next ? '1' : '0'); } catch {}
  };

  const openCart = () => window.dispatchEvent(new CustomEvent('bs-open-cart'));

  return (
    <>
      {/* Announcement bar */}
      <div className="announce-bar">
        <a href="#">
          <span id="ab-text" style={{ opacity: abVisible ? 1 : 0 }}>{AB_MESSAGES[abIdx]}</span>
        </a>
      </div>

      {/* Nav */}
      <nav className="site-nav">
        <Link className="nav-brand" href="/">
          <Image className="nav-logo" src="/logo.png" alt="Bow & Stern Soap Co." width={54} height={54} style={{ height: 54, width: 'auto' }} />
          <span className="nav-wordmark">Bow&nbsp;&amp;&nbsp;Stern</span>
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.page} href={l.href} className={`nav-link${pathname === l.href || (l.page === 'collections' && pathname.startsWith('/collections')) ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="nav-tools">
            <button className="icon-btn" onClick={toggleDark} aria-label="Toggle dark mode">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="icon-btn" onClick={openCart} aria-label="Open cart">
              <CartIcon />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="icon-btn nav-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobile-menu">
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">&times;</button>
        {NAV_LINKS.map(l => (
          <Link key={l.page} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
        ))}
      </div>
    </>
  );
}
