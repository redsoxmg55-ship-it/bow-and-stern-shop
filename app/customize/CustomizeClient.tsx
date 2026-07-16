'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';

// Three.js component — SSR disabled (WebGL requires browser)
const Soap3D = dynamic(() => import('@/components/Soap3D'), { ssr: false });

type Form = 'Bar' | 'Circle' | 'Bunny';
const FORMS: { key: Form; label: string; price: number; desc: string }[] = [
  { key: 'Bar', label: 'Bar', price: 5.50, desc: '4.5 oz cold-process bar' },
  { key: 'Circle', label: 'Circle', price: 5.50, desc: '3.5 oz river-stone round' },
  { key: 'Bunny', label: 'Bunny', price: 5.50, desc: '2.5 oz molded bunny' },
];

const SCENTS = [
  { key: 'lemon-verbena', label: 'Lemon Verbena' },
];

const SOLID_COLORS: { key: string; label: string; hex: string }[] = [
  { key: 'lemon-solid',  label: 'Lemon Yellow', hex: '#f9e84e' },
  { key: 'blue-solid',   label: 'Light Blue',   hex: '#aad4f5' },
];

const SWIRL_COLORS: { key: string; label: string; hex1: string; hex2: string }[] = [
  { key: 'ocean',  label: 'Ocean Swirl',  hex1: '#4a9eca', hex2: '#0D1F2D' },
  { key: 'lemon',  label: 'Lemon Swirl',  hex1: '#f9e84e', hex2: '#fff8c2' },
  { key: 'orange', label: 'Orange Swirl', hex1: '#f97316', hex2: '#fed7aa' },
  { key: 'pink',   label: 'Pink Swirl',   hex1: '#f472b6', hex2: '#fce7f3' },
];

const BASE_PRICE = 5.50;

export default function CustomizeClient() {
  const [form, setForm] = useState<Form>('Bar');
  const [scent, setScent] = useState('lemon-verbena');
  const [colorMode, setColorMode] = useState<'solid' | 'swirl'>('solid');
  const [colorKey, setColorKey] = useState('lemon-solid');
  const [engrave, setEngrave] = useState('');
  const [qty, setQty] = useState(100);
  const heroRef = useRef<HTMLDivElement>(null);

  const MOQ = 100;
  const PRICE_PER_BAR = 5.50;

  const solidMatch = SOLID_COLORS.find(c => c.key === colorKey);
  const swirlMatch = SWIRL_COLORS.find(c => c.key === colorKey);
  const selectedColor = solidMatch
    ? { label: solidMatch.label, hex: solidMatch.hex }
    : { label: swirlMatch!.label, hex: swirlMatch!.hex1 };
  const swirl: [string, string] | null = swirlMatch ? [swirlMatch.hex1, swirlMatch.hex2] : null;
  const selectedScent = SCENTS.find(s => s.key === scent)?.label || '';

  const total = PRICE_PER_BAR * qty;

  useEffect(() => {
    if (!heroRef.current) return;
    import('gsap').then(({ gsap }) => {
      const els = heroRef.current!.querySelectorAll('[data-fade]');
      gsap.set(els, { opacity: 0, y: 24, filter: 'blur(8px)' });
      gsap.to(els, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
    });
  }, []);

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('bs-cart') || '[]');
      const id = `custom-${Date.now()}`;
      const name = `Custom ${form} — ${selectedScent}`;
      cart.push({ id, name, price: PRICE_PER_BAR, form, qty, engrave: engrave.trim().toUpperCase(), color: selectedColor.label, scent: selectedScent, orderType: 'bulk', custom: true });
      localStorage.setItem('bs-cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('bs-cart-updated'));
    } catch {}
  };

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
        <div className="crumbs"><Link href="/">Home</Link> &nbsp;/&nbsp; Customize</div>
        <div className="eyebrow">Design Your Soap</div>
        <h1>Make it yours.</h1>
        <p>Choose form, scent, colour and optional engraving — from ${BASE_PRICE.toFixed(2)} per bar.</p>
      </header>

      <div ref={heroRef} style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

        {/* ── 3D Preview ── */}
        <div data-fade>
          <div style={{
            width: '100%', aspectRatio: '1/1',
            background: 'var(--navy-mid)',
            border: '1px solid var(--gold-line)',
            borderRadius: 6, overflow: 'hidden', position: 'relative',
          }}>
            <Soap3D
              form={form}
              color={selectedColor.hex}
              swirl={swirl}
              scent={selectedScent}
              initials={engrave.trim().slice(0, 3).toUpperCase()}
            />
            {/* drag hint */}
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              Drag to rotate
            </div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)' }}>
            {form} · {selectedScent} · {selectedColor.label}{swirl ? ' (swirl)' : ''}
          </div>
        </div>

        {/* ── Configurator ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* Form */}
          <div data-fade>
            <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>Form</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {FORMS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setForm(f.key)}
                  className={form === f.key ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scent */}
          <div data-fade>
            <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>Scent</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SCENTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setScent(s.key)}
                  className={scent === s.key ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div data-fade>
            <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>Colour</div>
            {/* Solid / Swirl toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => { setColorMode('solid'); setColorKey('lemon-solid'); }}
                className={colorMode === 'solid' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              >Solid</button>
              <button
                onClick={() => { setColorMode('swirl'); setColorKey('ocean'); }}
                className={colorMode === 'swirl' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              >Swirl</button>
            </div>
            {/* Solid options */}
            {colorMode === 'solid' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SOLID_COLORS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setColorKey(c.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
                      border: `1.5px solid ${colorKey === c.key ? 'var(--navy)' : 'var(--gold-line)'}`,
                      background: colorKey === c.key ? 'var(--navy)' : '#fff',
                      transition: 'all 0.18s',
                    }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: c.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: colorKey === c.key ? '#fff' : 'var(--text-dark)' }}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Swirl options */}
            {colorMode === 'swirl' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SWIRL_COLORS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setColorKey(c.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
                      border: `1.5px solid ${colorKey === c.key ? 'var(--navy)' : 'var(--gold-line)'}`,
                      background: colorKey === c.key ? 'var(--navy)' : '#fff',
                      transition: 'all 0.18s',
                    }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${c.hex1} 50%, ${c.hex2} 50%)`, border: '1px solid rgba(0,0,0,0.08)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: colorKey === c.key ? '#fff' : 'var(--text-dark)' }}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Engraving */}
          <div data-fade>
            <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>
              Engraving <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>Included</span>
            </div>
            <input
              type="text"
              placeholder="Name, date, or short message (optional)"
              value={engrave}
              onChange={e => setEngrave(e.target.value.slice(0, 3))}
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

          {/* MOQ qty */}
          <div data-fade>
            <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 12, textTransform: 'uppercase' }}>
              Quantity <span style={{ color: 'var(--gold)' }}>— MOQ {MOQ} bars</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gold-line)', borderRadius: 2 }}>
                <button onClick={() => setQty(q => Math.max(MOQ, q - 1))} style={{ width: 40, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>−</button>
                <span style={{ minWidth: 48, textAlign: 'center', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 44, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>+</button>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>minimum {MOQ} bars</span>
            </div>
          </div>

          {/* Summary + CTA */}
          <div data-fade style={{ borderTop: '1px solid var(--gold-line)', paddingTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
              <span>Price per bar</span><span>$5.50</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
              <span>Quantity</span><span>{qty} bars</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
              <span>Total</span><span style={{ color: 'var(--gold)' }}>${total.toFixed(2)}</span>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={addToCart}>
              Add to Cart — {qty} bars · ${total.toFixed(2)}
            </button>
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
