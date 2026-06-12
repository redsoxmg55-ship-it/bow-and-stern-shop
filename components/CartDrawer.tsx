'use client';
import { useEffect, useState } from 'react';

interface CartItem { id: string; name: string; form: string; price: number; qty: number; }

const BAR_GLYPH = <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M10 26 L32 18 L54 26 L32 34 Z"/><path d="M10 26 V40 L32 48 V34"/><path d="M54 26 V40 L32 48"/><path d="M18 28 Q24 31 32 29" opacity=".55"/></svg>;
const CIRCLE_GLYPH = <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="32" cy="32" r="19"/><circle cx="32" cy="32" r="11.5" opacity=".55"/><path d="M19 24 Q21 20 26 18" opacity=".5"/></svg>;

function glyphFor(form: string) {
  const f = (form || '').toLowerCase();
  if (f.includes('circle') || f.includes('round')) return CIRCLE_GLYPH;
  return BAR_GLYPH;
}

function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('bs-cart') || '[]'); } catch { return []; }
}
function writeCart(c: CartItem[]) {
  try { localStorage.setItem('bs-cart', JSON.stringify(c)); } catch {}
  window.dispatchEvent(new CustomEvent('bs-cart-updated'));
}
function money(n: number) { return '$' + n.toFixed(2); }

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => setItems(readCart());

  useEffect(() => {
    refresh();
    const openHandler = () => { setOpen(true); refresh(); };
    window.addEventListener('bs-open-cart', openHandler);
    window.addEventListener('bs-cart-updated', refresh);
    return () => {
      window.removeEventListener('bs-open-cart', openHandler);
      window.removeEventListener('bs-cart-updated', refresh);
    };
  }, []);

  const close = () => setOpen(false);
  const changeQty = (idx: number, d: number) => {
    const c = readCart();
    if (!c[idx]) return;
    c[idx].qty += d;
    if (c[idx].qty < 1) c.splice(idx, 1);
    writeCart(c); refresh();
  };
  const remove = (idx: number) => { const c = readCart(); c.splice(idx, 1); writeCart(c); refresh(); };
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <div className={`cart-overlay${open ? ' open' : ''}`} onClick={close} />
      <aside className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-head">
          <h3>Your Hold</h3>
          <button className="cart-close" onClick={close} aria-label="Close cart">&times;</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">Your hold is empty.<br />Every order — one bar or ten thousand — gets the same care.</div>
          ) : items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--gold-line)', alignItems: 'center' }}>
              <div className="frame" style={{ width: 64, height: 64 }}>
                <span className="corner tl"/><span className="corner tr"/><span className="corner bl"/><span className="corner br"/>
                <span className="frame-glyph" style={{ width: 34, height: 34 }}>{glyphFor(it.form)}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--navy)' }}>{it.name}</div>
                <div style={{ fontSize: '.7rem', letterSpacing: '.08em', color: 'var(--text-light)', textTransform: 'uppercase', marginTop: 2 }}>{it.form}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <button onClick={() => changeQty(idx, -1)} style={{ width: 24, height: 24, border: '1px solid var(--gold-line-mid)', background: 'transparent', cursor: 'pointer', color: 'var(--navy)' }}>−</button>
                  <span style={{ fontSize: '.85rem', minWidth: 18, textAlign: 'center' }}>{it.qty}</span>
                  <button onClick={() => changeQty(idx, 1)} style={{ width: 24, height: 24, border: '1px solid var(--gold-line-mid)', background: 'transparent', cursor: 'pointer', color: 'var(--navy)' }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 500 }}>{money(it.price * it.qty)}</div>
                <button onClick={() => remove(idx)} style={{ background: 'none', border: 'none', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-subtotal">
              <span className="cs-label">Subtotal</span>
              <span className="cs-val">{money(subtotal)}</span>
            </div>
            <div className="cart-note">Shipping &amp; taxes calculated at checkout.</div>
            <a className="btn btn-primary" href="#" onClick={e => { e.preventDefault(); }}>Proceed to Checkout</a>
          </div>
        )}
      </aside>
    </>
  );
}
