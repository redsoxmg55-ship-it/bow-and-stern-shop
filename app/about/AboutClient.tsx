'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import { useGsapReveal } from '@/hooks/useGsapReveal';

const PILLARS = [
  { title: 'Quality', body: 'Every batch is hand-poured in small runs and cold-process cured for a minimum of four weeks — never rushed, never rushed.' },
  { title: 'Consistency', body: 'The same recipe, every time. We weigh ingredients to the gram so the bar you love today is the bar you get next year.' },
  { title: 'Transparency', body: "Full ingredient disclosure on every label. If it's in the soap, you know about it." },
];

const STEPS = [
  { n: '01', label: 'Weigh', body: 'Oils and lye are measured to the gram before anything touches heat.' },
  { n: '02', label: 'Mix', body: 'Saponification happens at trace — we work fast and pour clean.' },
  { n: '03', label: 'Cure', body: 'Bars rest in open air for four to six weeks until hard and mild.' },
  { n: '04', label: 'Inspect', body: 'Every bar is checked by hand before it ships. No exceptions.' },
];

export default function AboutClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGsapReveal(pillarsRef as React.RefObject<HTMLElement>, { childSelector: '.about-pillar', stagger: 0.12 });
  useGsapReveal(stepsRef as React.RefObject<HTMLElement>, { childSelector: '.about-step', stagger: 0.1 });
  useGsapReveal(statsRef as React.RefObject<HTMLElement>, { childSelector: '.about-stat', stagger: 0.12 });
  useGsapReveal(quoteRef as React.RefObject<HTMLElement>);
  useGsapReveal(ctaRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const els = heroRef.current?.querySelectorAll('[data-hero]');
      if (!els) return;
      gsap.set(els, { opacity: 0, y: 28, filter: 'blur(8px)' });
      tl.to(els, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.12 }, 0.2);
    });
  }, []);

  return (
    <>
      <Preloader />
      <div id="boat-cursor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sailboat-cursor.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <SiteNav />

      {/* Hero */}
      <header className="page-head" ref={heroRef}>
        <div className="hero-bg" />
        <div className="crumbs" data-hero><Link href="/">Home</Link> &nbsp;/&nbsp; About</div>
        <div className="eyebrow" data-hero>Small-batch. Intentional. Honest.</div>
        <h1 data-hero>Made by hand,<br/>sold by the bar.</h1>
        <p data-hero>Bow &amp; Stern started on a kitchen counter in coastal Maine. It&apos;s still essentially that — just with a proper curing rack.</p>
      </header>

      {/* Founder split */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div className="frame" style={{ aspectRatio: '4/5' }}>
            <span className="corner tl"/><span className="corner tr"/>
            <span className="corner bl"/><span className="corner br"/>
            <span className="frame-glyph" style={{ width: 72, height: 72 }}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                <path d="M10 26 L32 18 L54 26 L32 34 Z"/>
                <path d="M10 26 V40 L32 48 V34"/>
                <path d="M54 26 V40 L32 48"/>
                <path d="M18 28 Q24 31 32 29" opacity=".55"/>
              </svg>
            </span>
            <span className="frame-caption">Founder Portrait</span>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>The Founder</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', lineHeight: 1.2, marginBottom: 24 }}>
            Built from a recipe,<br/>not a business plan.
          </h2>
          <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 16 }}>
            The first batch was a gift. The second was to see if we could repeat it. By the tenth we had a process, and by the hundredth we had a company. Still the same recipe.
          </p>
          <p style={{ color: 'var(--text-mid)', lineHeight: 1.7 }}>
            Every bar is hand-poured in coastal Maine using cold-process saponification — the slow method that preserves more of the glycerin your skin actually wants.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ background: 'var(--off-white)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>What We Stand For</div>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', marginBottom: 56 }}>Three principles, no exceptions.</h2>
          <div ref={pillarsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {PILLARS.map(p => (
              <div key={p.title} className="about-pillar" style={{ padding: '36px 28px', border: '1px solid var(--gold-line)', borderRadius: 4 }}>
                <div className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 16 }}>◆</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, fontSize: '0.95rem' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>The Process</div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', marginBottom: 56 }}>Four steps, every batch.</h2>
        <div ref={stepsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {STEPS.map(s => (
            <div key={s.n} className="about-step">
              <div className="mono" style={{ fontSize: '2rem', color: 'var(--gold-line)', marginBottom: 16, fontWeight: 500 }}>{s.n}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{s.label}</h3>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.65, fontSize: '0.9rem' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--navy)', color: 'var(--off-white)', padding: '72px 24px' }}>
        <div ref={statsRef} style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
          {[['100%', 'USA-Sourced Ingredients'], ['3', 'Soap Forms'], ['1 → 10,000', 'Bars and Counting']].map(([n, l]) => (
            <div key={l} className="about-stat">
              <div style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>{n}</div>
              <div style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section ref={quoteRef} style={{ maxWidth: 800, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--text-dark)', marginBottom: 24 }}>
          &ldquo;The bar doesn&rsquo;t lie. If something is off in the process, you&rsquo;ll know it at the cure rack.&rdquo;
        </p>
        <div className="mono" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-light)' }}>— Founder, Bow &amp; Stern Soap Co.</div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} style={{ background: 'var(--off-white)', padding: '72px 24px', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Ready to Try One?</div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', marginBottom: 24 }}>Shop the full catalog.</h2>
        <Link href="/shop" className="btn btn-primary">Shop All Soaps</Link>
      </section>

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
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return null;
}
