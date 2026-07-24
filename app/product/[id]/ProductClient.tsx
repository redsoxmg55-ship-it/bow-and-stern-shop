'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import { GlyphSvg } from '@/components/GlyphSvg';
import { BS_PRODUCTS, FORM_GLYPH } from '@/lib/products';
import ProductCarousel from '@/components/ProductCarousel';

export default function ProductClient({ id }: { id: string }) {
  const p = BS_PRODUCTS.find(x => x.id === id);
  const related = BS_PRODUCTS.filter(x => x.id !== id && x.form === p?.form).slice(0, 3);
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState<'single' | 'bulk'>('single');
  const [engrave, setEngrave] = useState('');
  const [engraveEnabled, setEngraveEnabled] = useState(false);
  const [colorMode, setColorMode] = useState<'solid' | 'swirl'>('solid');
  const [colorKey, setColorKey] = useState('white');
  const [carouselSlide, setCarouselSlide] = useState(0);

  const SOLID_COLORS = [
    { key: 'white',      label: 'Plain White',  hex: '#ffffff', slide: 0 },
    { key: 'lemon',      label: 'Lemon Yellow', hex: '#f9e84e', slide: 0 },
    { key: 'ocean-wave', label: 'Ocean Wave',   hex: '#2E86AB', slide: 0 },
    { key: 'pink-rose',  label: 'Pink Rose',    hex: '#F4A0B0', slide: 0 },
  ] as const;

  const SWIRL_COLORS = [
    { key: 'ocean',  label: 'Ocean Swirl',  hex1: '#4a9eca', hex2: '#0D1F2D', slide: 1 },
    { key: 'lemon',  label: 'Lemon Swirl',  hex1: '#f9e84e', hex2: '#fff8c2', slide: 0 },
    { key: 'orange', label: 'Orange Swirl', hex1: '#f97316', hex2: '#fed7aa', slide: 0 },
    { key: 'pink',   label: 'Pink Swirl',   hex1: '#f472b6', hex2: '#fce7f3', slide: 0 },
  ] as const;

  const activeSolid = SOLID_COLORS.find(c => c.key === colorKey);
  const activeSwirl = SWIRL_COLORS.find(c => c.key === colorKey);
  const colorLabel = activeSolid?.label ?? activeSwirl?.label ?? 'Plain White';

  const SINGLE_BASE = 7.00;
  const ENGRAVE_FEE = 1.00;
  const SINGLE_PRICE = SINGLE_BASE + (orderType === 'single' && engraveEnabled ? ENGRAVE_FEE : 0);
  const BULK_QTY = 100;
  const BULK_PRICE = 5.50;
  const activeQty = orderType === 'bulk' ? BULK_QTY : qty;
  const activePrice = orderType === 'bulk' ? BULK_PRICE * BULK_QTY : SINGLE_PRICE * qty;
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
      else cart.push({ id: p.id, name: p.name, price: orderType === 'bulk' ? BULK_PRICE : SINGLE_PRICE, form: p.form, qty: activeQty, engrave: engraveEnabled ? engrave : '', orderType, color: colorLabel });
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
          <div data-fade>
            <ProductCarousel glyph={FORM_GLYPH[p.form]} label={p.form} tag={p.tag} activeSlide={carouselSlide} onSlideChange={setCarouselSlide} />
          </div>

          {/* Details */}
          <div>
            <div className="eyebrow" data-fade>{p.form} &middot; {p.scent}</div>
            <h1 data-fade style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', marginBottom: 8 }}>{p.name}</h1>
            <div data-fade style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>${SINGLE_PRICE.toFixed(2)}</span>
              {engraveEnabled && orderType === 'single' && <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-light)' }}>incl. $1 engraving</span>}
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-light)', letterSpacing: '0.06em' }}>or $5.50/bar · MOQ 100</span>
            </div>

            <p data-fade style={{ color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 32 }}>{p.blurb}</p>

            {/* Notes */}
            <div data-fade style={{ marginBottom: 32 }}>
              <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12 }}>SCENT NOTES</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.notes.map(n => (
                  <span key={n} style={{ padding: '4px 12px', border: '1px solid var(--gold-line)', borderRadius: 2, fontSize: '0.85rem', color: 'var(--text-mid)' }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Specs */}
            <dl data-fade style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 32, fontSize: '0.9rem' }}>
              {[['Weight', p.weight], ['Best For', p.best], ['Form', p.form]].map(([k, v]) => (
                <div key={k}>
                  <dt style={{ color: 'var(--text-light)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{k}</dt>
                  <dd style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{v}</dd>
                </div>
              ))}
            </dl>

            {/* Colour */}
            <div data-fade style={{ marginBottom: 28 }}>
              <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>Colour</div>
              {orderType === 'bulk' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <button
                    onClick={() => { setColorMode('solid'); setColorKey('white'); setCarouselSlide(0); }}
                    className={colorMode === 'solid' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  >Solid</button>
                  <button
                    onClick={() => { setColorMode('swirl'); setColorKey('ocean'); setCarouselSlide(1); }}
                    className={colorMode === 'swirl' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  >Swirl</button>
                </div>
              )}
              {colorMode === 'solid' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SOLID_COLORS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => { setColorKey(s.key); setCarouselSlide(s.slide); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
                        border: `1.5px solid ${colorKey === s.key ? 'var(--navy)' : 'var(--gold-line)'}`,
                        background: colorKey === s.key ? 'var(--navy)' : '#fff',
                        transition: 'all 0.18s',
                      }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: s.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: colorKey === s.key ? '#fff' : 'var(--text-dark)' }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {colorMode === 'swirl' && orderType === 'bulk' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SWIRL_COLORS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => { setColorKey(s.key); setCarouselSlide(s.slide); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
                        border: `1.5px solid ${colorKey === s.key ? 'var(--navy)' : 'var(--gold-line)'}`,
                        background: colorKey === s.key ? 'var(--navy)' : '#fff',
                        transition: 'all 0.18s',
                      }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${s.hex1} 50%, ${s.hex2} 50%)`, border: '1px solid rgba(0,0,0,0.08)' }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: colorKey === s.key ? '#fff' : 'var(--text-dark)' }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Engraving */}
            <div data-fade style={{ marginBottom: 28 }}>
              <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>
                Engraving {orderType === 'single' ? <span style={{ color: 'var(--gold)', fontWeight: 400 }}>— +$1.00</span> : <span style={{ color: 'var(--gold)', fontWeight: 400 }}>— Included</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button
                  onClick={() => setEngraveEnabled(false)}
                  className={!engraveEnabled ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >Keep Blank</button>
                <button
                  onClick={() => setEngraveEnabled(true)}
                  className={engraveEnabled ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >Add Engraving</button>
              </div>
              {engraveEnabled && (
                <div>
                  <input
                    type="text"
                    placeholder="Up to 3 letters (e.g. J M G)"
                    value={engrave}
                    onChange={e => setEngrave(e.target.value.slice(0, 3).toUpperCase())}
                    maxLength={3}
                    style={{
                      width: '100%', padding: '12px 14px', background: 'var(--light-gray)',
                      border: '1px solid var(--gold-line)', borderRadius: 3, color: 'var(--text-dark)',
                      fontFamily: 'var(--font-mono)', fontSize: '0.85rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'right' }}>{engrave.length}/3</div>
                </div>
              )}
            </div>

            {/* Order type toggle */}
            <div data-fade style={{ marginBottom: 20 }}>
              <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>Order Type</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setOrderType('single'); setColorMode('solid'); setColorKey('white'); setCarouselSlide(0); }}
                  className={orderType === 'single' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Single Bar — ${SINGLE_PRICE.toFixed(2)}
                </button>
                <button
                  onClick={() => setOrderType('bulk')}
                  className={orderType === 'bulk' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Bulk (100) — $550.00
                </button>
              </div>
              {orderType === 'bulk' && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Minimum order quantity: 100 bars &middot; $5.50 per bar
                </div>
              )}
            </div>

            {/* Qty + add */}
            {orderType === 'single' && (
              <div data-fade style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gold-line)', borderRadius: 2 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>−</button>
                  <span style={{ width: 36, textAlign: 'center', fontSize: '0.95rem' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>+</button>
                </div>
                <button className="btn btn-primary" onClick={addToCart} style={{ flex: 1 }}>
                  Add to Cart — ${(SINGLE_PRICE * qty).toFixed(2)}
                </button>
              </div>
            )}
            {orderType === 'bulk' && (
              <div data-fade style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" onClick={addToCart} style={{ width: '100%' }}>
                  Add Bulk Order (100 bars) — $550.00
                </button>
                <Link href="/private-clients" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', background: 'var(--navy)',
                  borderRadius: 3, textDecoration: 'none',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fff', marginBottom: 2 }}>Want custom colors, scents, or engraving?</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Join the Private Client Program →</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>
              </div>
            )}
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
                  <ProductCarousel glyph={FORM_GLYPH[r.form]} label={r.form} tag={r.tag} href={`/product/${r.id}`} />
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
