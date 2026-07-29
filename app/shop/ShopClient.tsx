'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import { GlyphSvg } from '@/components/GlyphSvg';
import { BS_PRODUCTS, FORM_GLYPH, type Product } from '@/lib/products';
import ProductCarousel from '@/components/ProductCarousel';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';
type FilterForm = 'All' | 'Bar' | 'Roundstone' | 'Voyager Boat';


function sorted(list: Product[], key: SortKey): Product[] {
  const c = [...list];
  if (key === 'price-asc') c.sort((a, b) => a.price - b.price);
  else if (key === 'price-desc') c.sort((a, b) => b.price - a.price);
  else if (key === 'name') c.sort((a, b) => a.name.localeCompare(b.name));
  return c;
}

function ProductCard({ p, index }: { p: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(el, { opacity: 0, y: 36, filter: 'blur(6px)' });
        const anim = gsap.to(el, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7,
          delay: (index % 4) * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
        const enter = () => gsap.to(el, { scale: 1.015, duration: 0.3, ease: 'power2.out' });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        cleanup = () => { anim.kill(); el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
      });
    });
    return () => cleanup?.();
  }, [index]);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div ref={ref} className="product" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* full-card link sits behind carousel via z-index */}
      <Link href={`/product/${p.id}`} aria-label={p.name} style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'block', textDecoration: 'none',
      }} />
      {/* carousel is z-index 2, its buttons are z-index 4 — above the link */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ProductCarousel glyph={FORM_GLYPH[p.form]} label={p.form} tag={p.tag} href={`/product/${p.id}`} />
      </div>
      <div className="product-top" style={{ position: 'relative', zIndex: 2 }}>
        <div className="product-name">{p.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <div className="product-price">$7.00</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>$5.50/bar · MOQ 100</div>
        </div>
      </div>
      <div className="product-form" style={{ position: 'relative', zIndex: 2 }}>{p.form}</div>
      <p className="product-scent" style={{ flex: 1, position: 'relative', zIndex: 2 }}>{p.note}</p>
      <button className="btn btn-primary btn-sm product-add" style={{ position: 'relative', zIndex: 2 }} onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default function ShopClient() {
  const [sortKey, setSortKey] = useState<SortKey>('featured');
  const [filter, setFilter] = useState<FilterForm>('All');
  const [list, setList] = useState<Product[]>(BS_PRODUCTS);
  const headRef = useRef<HTMLDivElement>(null);
  const crumbsRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set([crumbsRef.current, h1Ref.current, subRef.current], { opacity: 0, y: 24, filter: 'blur(8px)' })
        .to(crumbsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, 0.2)
        .to(h1Ref.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75 }, 0.35)
        .to(subRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65 }, 0.5);
    });
  }, []);

  useEffect(() => {
    const base = filter === 'All' ? BS_PRODUCTS : BS_PRODUCTS.filter(p => p.form === filter);
    setList(sorted(base, sortKey));
    if (headRef.current) {
      import('gsap').then(({ gsap }) => gsap.fromTo(headRef.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3 }));
    }
  }, [sortKey, filter]);

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
        <div className="crumbs" ref={crumbsRef}><Link href="/">Home</Link> &nbsp;/&nbsp; Shop</div>
        <h1 ref={h1Ref}>Every bar<br/>we make.</h1>
        <p ref={subRef}>Four forms. One recipe standard.</p>
      </header>

      <div className="shop-wrap" style={{
        backgroundImage: 'linear-gradient(rgba(13,31,45,0.62) 0%, rgba(13,31,45,0.48) 100%), url(/shop-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div className="shop-inner">
          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {(['All', 'Bar', 'Roundstone', 'Voyager Boat'] as FilterForm[]).map(f => (
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

          <div className="shop-main-head" ref={headRef}>
<div className="shop-sort">
              <label htmlFor="sort">Sort</label>
              <select id="sort" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price — Low to High</option>
                <option value="price-desc">Price — High to Low</option>
                <option value="name">Name — A to Z</option>
              </select>
            </div>
          </div>

          <div className="shop-grid">
            {([
              { form: 'Bar', label: 'The Bar', tag: 'Sold Out' },
              { form: 'Roundstone', label: 'Roundstone Soap', tag: 'Low Inventory' },
              { form: 'Voyager Boat', label: 'Voyager Boat', tag: 'Sold Out' },
            ] as const).map(({ form, label, tag }, i) => {
              const p = list.find(x => x.form === form) || BS_PRODUCTS.find(x => x.form === form)!;
              return p ? <ProductCard key={form} p={{ ...p, name: label, tag }} index={i} /> : null;
            })}
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
