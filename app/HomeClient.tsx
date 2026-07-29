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

const ARRIVALS = [
  BS_PRODUCTS.find(p => p.form === 'Bar')!,
  BS_PRODUCTS.find(p => p.form === 'Roundstone')!,
];

export default function HomeClient() {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (n: number) => {
    setSlide(((n % 2) + 2) % 2);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSlide(s => (s + 1) % 2), 6000);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => setSlide(s => (s + 1) % 2), 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Scroll reveal on sections
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('.reveal').forEach(el => {
          gsap.set(el, { opacity: 0, y: 32, filter: 'blur(6px)' });
          gsap.to(el, {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          });
        });
      });
    });
  }, []);

  const addToCart = (p: typeof BS_PRODUCTS[0]) => {
    try {
      const cart = JSON.parse(localStorage.getItem('bs-cart') || '[]');
      const existing = cart.find((i: { id: string }) => i.id === p.id);
      if (existing) existing.qty++;
      else cart.push({ id: p.id, name: p.name, price: p.price, form: p.form, qty: 1 });
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

      {/* ── Hero carousel ── */}
      <section className="vv-hero">
        {/* Slide 1 */}
        <div className={`vv-slide${slide === 0 ? ' active' : ''}`}>
          <div className="vv-slide-bg">
            <div className="hero-bg" />
            <span className="corner corner-lg tl" /><span className="corner corner-lg tr" />
            <span className="corner corner-lg bl" /><span className="corner corner-lg br" />
            <span className="vv-slide-glyph"><GlyphSvg type="bar" /></span>
            <span className="vv-slide-caption">Lifestyle Campaign Photo</span>
          </div>
          <div className="vv-slide-content">
            <div className="vv-eyebrow">Summer on the Coast</div>
            <h2 className="vv-title">The Harbor Series</h2>
            <Link className="btn-pill" href="/collections">Shop the Collection</Link>
          </div>
        </div>
        {/* Slide 2 */}
        <div className={`vv-slide${slide === 1 ? ' active' : ''}`}>
          <div className="vv-slide-bg">
            <div className="hero-bg" style={{ background: 'radial-gradient(120% 90% at 72% 8%, rgba(184,149,90,.18), transparent 58%), linear-gradient(160deg, #0D1F2D 0%, #1B3A4B 130%)' }} />
            <span className="corner corner-lg tl" /><span className="corner corner-lg tr" />
            <span className="corner corner-lg bl" /><span className="corner corner-lg br" />
            <span className="vv-slide-glyph"><GlyphSvg type="voyager" /></span>
            <span className="vv-slide-caption">Lifestyle Campaign Photo</span>
          </div>
          <div className="vv-slide-content">
            <div className="vv-eyebrow">For Business</div>
            <h2 className="vv-title">Your brand,<br />our craft.</h2>
            <Link className="btn-pill" href="/private-clients">Start a Custom Order</Link>
          </div>
        </div>

        <button className="vv-arrow prev" onClick={() => goTo(slide - 1)} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <button className="vv-arrow next" onClick={() => goTo(slide + 1)} aria-label="Next slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        <div className="vv-dots">
          <button className={`vv-dot${slide === 0 ? ' active' : ''}`} onClick={() => goTo(0)} aria-label="Slide 1" />
          <button className={`vv-dot${slide === 1 ? ' active' : ''}`} onClick={() => goTo(1)} aria-label="Slide 2" />
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="band off">
        <div className="inner">
          <div className="arrivals-head reveal">
            <div className="arrivals-title">New Arrivals Are Here</div>
          </div>
          <div className="grid-4">
            {ARRIVALS.map((p, i) => (
              <article key={p.id} className="product reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCarousel glyph={FORM_GLYPH[p.form]} label={p.form} tag={p.tag} href={`/product/${p.id}`} />
                <Link className="product-link" href={`/product/${p.id}`}>
                  <div className="product-top">
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">$7.00 <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-light)', letterSpacing: '0.04em' }}>or $5.50/bar · MOQ 100</span></div>
                  </div>
                  <div className="product-form">{p.form} &middot; {p.scent}</div>
                </Link>
                <button className="btn btn-primary btn-sm product-add" onClick={() => addToCart(p)}>Add to Cart</button>
              </article>
            ))}
          </div>
          <div className="shop-all-row reveal">
            <Link className="btn btn-outline" href="/shop">Shop All Soaps</Link>
          </div>
        </div>
      </section>

      {/* ── Shop by Form ── */}
      <section className="band gray">
        <div className="inner">
          <div className="section-head center reveal">
            <div className="section-label section-label-red" style={{ fontWeight: 500, fontSize: 20 }}>The Founders Collection</div>
            <h2 className="section-heading">Shop by form</h2>
          </div>
          <div className="cat-tiles">
            {([
              { form: 'Bar', glyph: 'bar' as const, label: 'The Bar', photo: null },
              { form: 'Roundstone', glyph: 'circle' as const, label: 'Roundstone Soap', photo: '/products/circle-soap.png' },
              { form: 'Voyager Boat', glyph: 'voyager' as const, label: 'Voyager Boat', photo: null },
            ]).map((t, i) => (
              <Link key={t.form} className={`cat-tile reveal${i > 0 ? ` d${i + 1}` : ''}`} href="/shop">
                <div className="frame">
                  <span className="corner tl" /><span className="corner tr" />
                  <span className="corner bl" /><span className="corner br" />
                  {t.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={t.photo} alt={t.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <span className="frame-glyph"><GlyphSvg type={t.glyph} /></span>
                      <span className="frame-caption">{t.form} Soap Photo</span>
                    </>
                  )}
                </div>
                <div className="cat-tile-label">
                  <div className="cat-tile-name">{t.label}</div>
                  <div className="cat-tile-cta">Shop {t.form} Soap &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="promo reveal" style={{
        backgroundImage: 'linear-gradient(rgba(13,31,45,0.65) 0%, rgba(13,31,45,0.55) 100%), url(/promo-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div className="hero-bg" style={{ opacity: 0 }} />
        <div className="vv-eyebrow">Custom &amp; Wholesale</div>
        <h2>Soap that carries your brand — made bar by bar.</h2>
        <p>Custom-branded guest bars, corporate gifts, and event favors. Your mark, our craft, with minimums lower than you&rsquo;d expect.</p>
        <Link className="btn btn-gold" href="/private-clients">Request a Quote</Link>
      </section>

      {/* ── Philosophy Quote ── */}
      <section className="band navy tight">
        <div className="inner-narrow">
          <div className="quote-wrap reveal">
            <div className="quote-mark">&ldquo;</div>
            <p className="quote-text">Every order — whether it&rsquo;s one bar or one thousand — gets the same level of care. That&rsquo;s not a policy. That&rsquo;s just how we work.</p>
            <div className="quote-attr">Mateo Griffen — Founder &amp; CEO</div>
          </div>
        </div>
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
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseout', onOut); cancelAnimationFrame(rafId); };
  }, []);
  return null;
}
