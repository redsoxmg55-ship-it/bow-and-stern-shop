'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import { GlyphSvg } from '@/components/GlyphSvg';
import { BS_PRODUCTS, FORM_GLYPH } from '@/lib/products';

export default function ProductClient({ id }: { id: string }) {
  const p = BS_PRODUCTS.find(x => x.id === id);
  const related = BS_PRODUCTS.filter(x => x.id !== id && x.form === p?.form).slice(0, 3);
  const [qty, setQty] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    import('gsap').then(({ gsap }) => {
      const els = heroRef.current!.querySelectorAll('[data-fade]');
      gsap.set(els, { opacity: 0, y: 24, filter: 'blur(6px)' });
      gsap.to(els, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
    });
  }, [id]);

  const addToCart = () => {
    if (!p) return;
    try {
      const cart = JSON.parse(localStorage.getItem('bs-cart') || '[]');
      const existing = cart.find((i: { id: string }) => i.id === p.id);
      if (existing) existing.qty += qty;
      else cart.push({ id: p.id, name: p.name, price: p.price, form: p.form, qty });
      localStorage.setItem('bs-cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('bs-cart-updated'));
    } catch {}
  };

  if (!p) return (
    <>
      <SiteNav />
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-block' }}>Back to Shop</Link>
      </div>
      <SiteFooter />
    </>
  );

  return (
    <>
      <Preloader />
      <div id="boat-cursor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sailboat-cursor.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <SiteNav />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Breadcrumbs */}
        <div className="crumbs" data-fade style={{ marginBottom: 40 }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp;
          <Link href="/shop">Shop</Link> &nbsp;/&nbsp;
          {p.name}
        </div>

        {/* Main product layout */}
        <div ref={heroRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          {/* Gallery */}
          <div>
            <div className="frame" data-fade style={{ aspectRatio: '1/1', marginBottom: 16 }}>
              {p.tag && <span className="product-tag">{p.tag}</span>}
              <span className="corner tl"/><span className="corner tr"/>
              <span className="corner bl"/><span className="corner br"/>
              <span className="frame-glyph" style={{ width: 96, height: 96 }}>
                <GlyphSvg type={FORM_GLYPH[p.form]} />
              </span>
              <span className="frame-caption">{p.form} — {p.scent}</span>
            </div>
            {/* Thumbnails row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="frame" data-fade style={{ aspectRatio: '1/1' }}>
                  <span className="corner tl"/><span className="corner tr"/>
                  <span className="corner bl"/><span className="corner br"/>
                  <span className="frame-caption" style={{ fontSize: '0.6rem' }}>Photo {n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="eyebrow" data-fade>{p.form} &middot; {p.scent}</div>
            <h1 data-fade style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', marginBottom: 8 }}>{p.name}</h1>
            <div data-fade style={{ fontSize: '1.5rem', fontFamily: 'var(--bs-serif)', color: 'var(--bs-gold)', marginBottom: 24 }}>${p.price}</div>

            <p data-fade style={{ color: 'var(--bs-text-2)', lineHeight: 1.7, marginBottom: 32 }}>{p.blurb}</p>

            {/* Notes */}
            <div data-fade style={{ marginBottom: 32 }}>
              <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--bs-text-3)', marginBottom: 12 }}>SCENT NOTES</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.notes.map(n => (
                  <span key={n} style={{ padding: '4px 12px', border: '1px solid var(--bs-border)', borderRadius: 2, fontSize: '0.85rem', color: 'var(--bs-text-2)' }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Specs */}
            <dl data-fade style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 32, fontSize: '0.9rem' }}>
              {[['Weight', p.weight], ['Cure', p.cure], ['Best For', p.best], ['Form', p.form]].map(([k, v]) => (
                <div key={k}>
                  <dt style={{ color: 'var(--bs-text-3)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{k}</dt>
                  <dd style={{ color: 'var(--bs-text-1)', fontWeight: 500 }}>{v}</dd>
                </div>
              ))}
            </dl>

            {/* Qty + add */}
            <div data-fade style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bs-border)', borderRadius: 2 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--bs-text-1)' }}>−</button>
                <span style={{ width: 36, textAlign: 'center', fontSize: '0.95rem' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--bs-text-1)' }}>+</button>
              </div>
              <button className="btn btn-primary" onClick={addToCart} style={{ flex: 1 }}>Add to Cart — ${p.price * qty}</button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: 96 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>More {p.form} Soaps</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 40 }}>You might also like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {related.map(r => (
                <Link key={r.id} href={`/product/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="product">
                  <div className="frame" style={{ aspectRatio: '1/1', marginBottom: 16 }}>
                    {r.tag && <span className="product-tag">{r.tag}</span>}
                    <span className="corner tl"/><span className="corner tr"/>
                    <span className="corner bl"/><span className="corner br"/>
                    <span className="frame-glyph"><GlyphSvg type={FORM_GLYPH[r.form]} /></span>
                  </div>
                  <div className="product-top">
                    <div className="product-name">{r.name}</div>
                    <div className="product-price">${r.price}</div>
                  </div>
                  <p className="product-scent">{r.note}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
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
