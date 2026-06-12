'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import { GlyphSvg } from '@/components/GlyphSvg';
import { BS_PRODUCTS, FORM_GLYPH, type Product } from '@/lib/products';

type FormFilter = 'All' | 'Bar' | 'Circle' | 'Bunny';

interface CatalogEntry {
  id: string;
  imageUrl?: string;
}

function CatalogCard({ p, entry, onImageChange }: { p: Product; entry: CatalogEntry; onImageChange: (id: string, url: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(el, { opacity: 0, y: 32, filter: 'blur(6px)' });
        const anim = gsap.to(el, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        });
        cleanup = () => anim.kill();
      });
    });
    return () => cleanup?.();
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => { if (e.target?.result) onImageChange(p.id, e.target.result as string); };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div ref={ref} style={{ border: '1px solid var(--bs-border)', borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Photo drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="frame"
        style={{
          aspectRatio: '1/1', cursor: 'pointer',
          outline: dragging ? '2px dashed var(--bs-gold)' : 'none',
          outlineOffset: 2,
          backgroundImage: entry.imageUrl ? `url(${entry.imageUrl})` : undefined,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        <span className="corner tl"/><span className="corner tr"/>
        <span className="corner bl"/><span className="corner br"/>
        {!entry.imageUrl && (
          <>
            <span className="frame-glyph"><GlyphSvg type={FORM_GLYPH[p.form]} /></span>
            <span className="frame-caption">Click or drag to add photo</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

      <div>
        <div className="product-name" style={{ marginBottom: 4 }}>{p.name}</div>
        <div className="product-form">{p.form} &middot; {p.scent} &middot; ${p.price}</div>
        <p className="product-scent" style={{ marginTop: 6 }}>{p.note}</p>
      </div>
      {entry.imageUrl && (
        <button className="btn btn-ghost btn-sm" onClick={() => onImageChange(p.id, '')}>Remove Photo</button>
      )}
    </div>
  );
}

export default function CatalogClient() {
  const [filter, setFilter] = useState<FormFilter>('All');
  const [entries, setEntries] = useState<Record<string, CatalogEntry>>({});
  const crumbsRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  // Load saved images from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bs-catalog') || '{}');
      setEntries(saved);
    } catch {}

    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set([crumbsRef.current, h1Ref.current, subRef.current], { opacity: 0, y: 24, filter: 'blur(8px)' })
        .to(crumbsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, 0.2)
        .to(h1Ref.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, 0.35)
        .to(subRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65 }, 0.5);
    });
  }, []);

  const handleImageChange = (id: string, url: string) => {
    setEntries(prev => {
      const next = { ...prev, [id]: { id, imageUrl: url || undefined } };
      try { localStorage.setItem('bs-catalog', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const visibleProducts = filter === 'All' ? BS_PRODUCTS : BS_PRODUCTS.filter(p => p.form === filter);

  return (
    <>
      <Preloader />
      <div id="boat-cursor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sailboat-cursor.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <SiteNav />

      <header className="page-head">
        <div className="hero-bg" />
        <div className="crumbs" ref={crumbsRef}><Link href="/">Home</Link> &nbsp;/&nbsp; Catalog</div>
        <div className="eyebrow">Your Product Catalog</div>
        <h1 ref={h1Ref}>Add photos,<br/>build your catalog.</h1>
        <p ref={subRef}>Upload or drag product photos to each soap below. Photos are saved locally in your browser.</p>
      </header>

      <div className="shop-wrap">
        <div className="shop-inner">
          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {(['All', 'Bar', 'Circle', 'Bunny'] as FormFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                style={{ minWidth: 72 }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="shop-grid">
            {visibleProducts.map(p => (
              <CatalogCard
                key={p.id}
                p={p}
                entry={entries[p.id] || { id: p.id }}
                onImageChange={handleImageChange}
              />
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
      <CartDrawer />
      <CursorInit />
    </>
  );
}

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
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseout', onOut); cancelAnimationFrame(rafId); };
  }, []);
  return null;
}
