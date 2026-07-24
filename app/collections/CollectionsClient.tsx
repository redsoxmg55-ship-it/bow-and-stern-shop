'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import ProductCarousel from '@/components/ProductCarousel';

// SVG glyphs matching the original bs-chrome.js
const GLYPHS = {
  bar: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M10 26 L32 18 L54 26 L32 34 Z"/>
      <path d="M10 26 V40 L32 48 V34"/>
      <path d="M54 26 V40 L32 48"/>
      <path d="M18 28 Q24 31 32 29" opacity=".55"/>
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="32" cy="32" r="19"/>
      <circle cx="32" cy="32" r="11.5" opacity=".55"/>
      <path d="M19 24 Q21 20 26 18" opacity=".5"/>
    </svg>
  ),
};

interface Collection {
  id: string;
  name: string;
  glyph: keyof typeof GLYPHS;
  theme: string;
  count: number;
  note: string;
  tag: string;
}

const COLLECTIONS: Collection[] = [
  { id: 'founders', name: 'The Founders Collection', glyph: 'bar', theme: 'All Forms', count: 12, note: 'Three signature forms, one intention-led recipe — the edit that started it all.', tag: 'Cornerstone' },
  { id: 'harborside', name: 'Harborside Collection', glyph: 'bar', theme: 'Woods', count: 3, note: 'Cedar, bay rum & driftwood — the deep, grounding scents of the working waterfront.', tag: 'Bestseller' },
];

type SortKey = 'featured' | 'size-desc' | 'size-asc' | 'name';

function sorted(list: Collection[], key: SortKey): Collection[] {
  const c = [...list];
  if (key === 'size-desc') c.sort((a, b) => b.count - a.count);
  else if (key === 'size-asc') c.sort((a, b) => a.count - b.count);
  else if (key === 'name') c.sort((a, b) => a.name.localeCompare(b.name));
  return c;
}

// Individual collection card with per-card GSAP entrance
function CollectionCard({ c, index }: { c: Collection; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = cardRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.set(el, { opacity: 0, y: 36, filter: 'blur(6px)' });

        const anim = gsap.to(el, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.7,
          delay: (index % 3) * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });

        // Subtle hover tilt
        const handleEnter = () => { gsap.to(el, { scale: 1.015, duration: 0.35, ease: 'power2.out' }); };
        const handleLeave = () => { gsap.to(el, { scale: 1, duration: 0.35, ease: 'power2.out' }); };
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);

        cleanup = () => {
          anim.kill();
          el.removeEventListener('mouseenter', handleEnter);
          el.removeEventListener('mouseleave', handleLeave);
        };
      });
    });
    return () => cleanup?.();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="product"
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={() => window.location.href = '/shop'}
    >
      <ProductCarousel glyph={c.glyph} label={c.name} tag={c.tag} />
      <div className="product-top">
        <div className="product-name">{c.name}</div>
      </div>
      <div className="product-form">{c.theme} &middot; {c.count} Soaps</div>
      <p className="product-scent" style={{ flex: 1 }}>{c.note}</p>
      <span className="btn btn-primary btn-sm product-add" onClick={e => { e.stopPropagation(); window.location.href = '/shop'; }}>Shop the Collection</span>
    </div>
  );
}

export default function CollectionsClient() {
  const [sortKey, setSortKey] = useState<SortKey>('featured');
  const [list, setList] = useState<Collection[]>(COLLECTIONS);

  // Hero GSAP animation
  const crumbsRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const headBarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setList(sorted(COLLECTIONS, sortKey));
  }, [sortKey]);

  // Animate the page header in on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set([crumbsRef.current, eyebrowRef.current, h1Ref.current, subRef.current], { opacity: 0, y: 24, filter: 'blur(8px)' })
        .to(crumbsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, 0.2)
        .to(eyebrowRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, 0.35)
        .to(h1Ref.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75 }, 0.45)
        .to(subRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65 }, 0.58);
    });
  }, []);

  // Animate shop head when sort changes (subtle)
  useEffect(() => {
    if (!headBarRef.current) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(headBarRef.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    });
  }, [list]);

  return (
    <>
      <Preloader />

      {/* Custom sailboat cursor */}
      <div id="boat-cursor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sailboat-cursor.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      <SiteNav />

      {/* Page header */}
      <header className="page-head">
        <div className="hero-bg" />
        <div className="crumbs" ref={crumbsRef}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; Collections
        </div>
        <div className="eyebrow" ref={eyebrowRef}>Curated by Purpose</div>
        <h1 ref={h1Ref}>Soap, by the collection</h1>
        <p ref={subRef}>Edits of our bars grouped by scent and intention — each poured from the same small-batch craft.</p>
      </header>

      {/* Collections grid */}
      <div className="shop-wrap">
        <div className="shop-inner">
          {/* Sort/count bar */}
          <div className="shop-main-head" ref={headBarRef}>
            <div className="shop-count">
              <strong>{list.length}</strong> {list.length === 1 ? 'collection' : 'collections'}
            </div>
            <div className="shop-sort">
              <label htmlFor="sort">Sort</label>
              <select id="sort" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
                <option value="featured">Featured</option>
                <option value="size-desc">Size — Largest</option>
                <option value="size-asc">Size — Smallest</option>
                <option value="name">Name — A to Z</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className="collections-grid" ref={gridRef}>
            {list.map((c, i) => (
              <CollectionCard key={c.id} c={c} index={i} />
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
      <CartDrawer />

      {/* Cursor + dark mode init */}
      <CursorInit />
    </>
  );
}

// Tiny client component that initialises the custom cursor
function CursorInit() {
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const el = document.getElementById('boat-cursor');
    if (!el) return;
    document.body.classList.add('has-cursor');
    let tx = -100, ty = -100, x = -100, y = -100, active = false;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; active = true; };
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget) active = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onOut);
    let rafId: number;
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate(${x - 8}px,${y - 6}px)${active ? '' : ' scale(0)'}`;
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return null;
}
