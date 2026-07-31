'use client';
import { useEffect, useState, useRef } from 'react';

interface CartItem { id: string; name: string; form: string; price: number; qty: number; engrave?: string; orderType?: string; color?: string; scent?: string; }

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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', background: '#fff',
  border: '1px solid var(--gold-line)', borderRadius: 3,
  color: 'var(--text-dark)', fontFamily: 'var(--font-display)',
  fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--text-light)',
  fontFamily: 'var(--font-mono)', marginBottom: 6,
};

function CheckoutModal({ items, subtotal, onClose }: {
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'contact' | 'shipping'>('contact');
  const [placed, setPlaced] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [shipping, setShipping] = useState({ address1: '', address2: '', city: '', state: '', zip: '', country: 'United States' });

  const steps = ['contact', 'shipping'] as const;
  const stepIdx = steps.indexOf(step);
  const shippingCost = 5.00;
  const total = subtotal + shippingCost;

  const placeOrder = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, shipping, items, subtotal, shippingCost, total }),
      });
      const data = await res.json();
      if (data.ok) {
        writeCart([]);
        setPlaced(true);
      } else {
        setError('Could not send order email. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,31,45,0.55)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', zIndex: 1, background: '#fff',
        width: '100%', maxWidth: 860, maxHeight: '92vh',
        overflowY: 'auto', borderRadius: 4,
        boxShadow: '0 24px 80px rgba(13,31,45,0.22)',
        display: 'flex', flexDirection: 'column',
        margin: '0 16px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--gold-line)', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', letterSpacing: '-0.01em' }}>
            {placed ? 'Order Placed' : 'Checkout'}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-light)', lineHeight: 1 }}>&times;</button>
        </div>

        {placed ? (
          <div style={{ padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 12 }}>Thank you for your order!</h2>
            <p style={{ color: 'var(--text-mid)', fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
              Your order details have been sent to us. Every bar is hand-poured — we&rsquo;ll be in touch shortly.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1 }}>
            {/* Left: form */}
            <div style={{ padding: '32px 32px 40px', borderRight: '1px solid var(--gold-line)' }}>
              {/* Step indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
                {(['Contact', 'Shipping'] as const).map((s, i) => {
                  const key = s.toLowerCase() as typeof steps[number];
                  const done = stepIdx > i;
                  const active = stepIdx === i;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                      <div onClick={() => done && setStep(key)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: done ? 'pointer' : 'default' }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: done ? 'var(--gold)' : active ? 'var(--navy)' : 'transparent',
                          border: done || active ? 'none' : '1px solid var(--gold-line)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: done || active ? '#fff' : 'var(--text-light)',
                          fontSize: '0.75rem', fontFamily: 'var(--font-mono)', flexShrink: 0,
                        }}>
                          {done ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 13, height: 13 }}><path d="M20 6L9 17l-5-5"/></svg> : i + 1}
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: active ? 'var(--navy)' : done ? 'var(--gold)' : 'var(--text-light)' }}>{s}</span>
                      </div>
                      {i < 2 && <div style={{ width: 28, height: 1, background: 'var(--gold-line)', margin: '0 8px', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>

              {/* Contact step */}
              {step === 'contact' && (
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 20, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Contact Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input style={inputStyle} value={contact.firstName} onChange={e => setContact(c => ({ ...c, firstName: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input style={inputStyle} value={contact.lastName} onChange={e => setContact(c => ({ ...c, lastName: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Email Address</label>
                      <input style={inputStyle} type="email" placeholder="you@example.com" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Phone (optional)</label>
                      <input style={inputStyle} type="tel" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setStep('shipping')} style={{ marginTop: 28, width: '100%' }}>Continue to Shipping</button>
                </div>
              )}

              {/* Shipping step */}
              {step === 'shipping' && (
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 20, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Shipping Address</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Address</label>
                      <input style={inputStyle} value={shipping.address1} onChange={e => setShipping(s => ({ ...s, address1: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Apt / Suite (optional)</label>
                      <input style={inputStyle} value={shipping.address2} onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input style={inputStyle} value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>State</label>
                      <input style={inputStyle} value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>ZIP Code</label>
                      <input style={inputStyle} value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Country</label>
                      <input style={inputStyle} value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} />
                    </div>
                  </div>
                  {error && <div style={{ marginTop: 12, fontSize: '0.82rem', color: '#c0392b', fontFamily: 'var(--font-mono)' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                    <button className="btn btn-outline" onClick={() => setStep('contact')} style={{ flex: 1 }}>Back</button>
                    <button className="btn btn-primary" onClick={placeOrder} style={{ flex: 2 }} disabled={sending}>{sending ? 'Placing Order…' : `Place Order — ${money(total)}`}</button>
                  </div>
                </div>
              )}

            </div>

            {/* Right: order summary */}
            <div style={{ padding: '32px 24px', background: '#fafaf8' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-light)', marginBottom: 20, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Order Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div className="frame" style={{ width: 40, height: 40, flexShrink: 0 }}>
                      <span className="corner tl"/><span className="corner tr"/><span className="corner bl"/><span className="corner br"/>
                      <span className="frame-glyph" style={{ width: 20, height: 20 }}>{glyphFor(it.form)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: 'var(--navy)', lineHeight: 1.3 }}>{it.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)', marginTop: 3, lineHeight: 1.5 }}>
                        {it.orderType === 'bulk' ? `Bulk · ${it.qty} bars` : `Qty ${it.qty}`}
                        {it.color ? ` · ${it.color}` : ''}
                        {it.scent ? ` · ${it.scent}` : ''}
                        {it.engrave ? <><br/>Engraving: &ldquo;{it.engrave}&rdquo;</> : ''}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)', flexShrink: 0 }}>{money(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--gold-line)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([['Subtotal', money(subtotal)], ['Shipping', money(shippingCost)], ['Total', money(total)]] as [string, string][]).map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: i === 2 ? '1rem' : '0.85rem', color: i === 2 ? 'var(--navy)' : 'var(--text-mid)', fontWeight: i === 2 ? 600 : 400 }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: i === 2 ? '1rem' : '0.85rem', color: i === 2 ? 'var(--gold)' : 'var(--text-mid)', fontWeight: i === 2 ? 600 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState(false);

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
                {it.engrave && <div style={{ fontSize: '.72rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>Engraved: &ldquo;{it.engrave}&rdquo;</div>}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <button onClick={() => changeQty(idx, -1)} style={{ width: 24, height: 24, border: '1px solid var(--gold-line)', background: 'transparent', cursor: 'pointer', color: 'var(--navy)' }}>−</button>
                  <span style={{ fontSize: '.85rem', minWidth: 18, textAlign: 'center' }}>{it.qty}</span>
                  <button onClick={() => changeQty(idx, 1)} style={{ width: 24, height: 24, border: '1px solid var(--gold-line)', background: 'transparent', cursor: 'pointer', color: 'var(--navy)' }}>+</button>
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
            <div className="cart-note">Prices shown excl. tax. Shipping &amp; taxes calculated at checkout.</div>
            <button className="btn btn-primary" onClick={() => { setOpen(false); setCheckout(true); }}>Proceed to Checkout</button>
          </div>
        )}
      </aside>

      {checkout && (
        <CheckoutModal
          items={items}
          subtotal={subtotal}
          onClose={() => setCheckout(false)}
        />
      )}
    </>
  );
}
