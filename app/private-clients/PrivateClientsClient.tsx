'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';

const PERKS = [
  {
    title: 'Custom Engraving & Logo',
    body: 'Your initials, logo, or short message stamped directly into each bar. A one-time $35 design fee applies per unique design — reuse the same design anytime at no extra cost.',
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}><path d="M10 30 L20 10 L30 30"/><path d="M13 24 h14"/><circle cx="20" cy="34" r="2" fill="currentColor" stroke="none"/></svg>,
  },
  {
    title: 'Custom Colors',
    body: 'Choose from our palette or describe your aesthetic — we blend to match your exact vision.',
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}><circle cx="20" cy="20" r="12"/><path d="M20 8 Q28 14 28 20 Q28 26 20 32 Q12 26 12 20 Q12 14 20 8Z" strokeWidth="1"/><circle cx="20" cy="20" r="3" fill="currentColor" stroke="none"/></svg>,
  },
  {
    title: 'Custom Scent Profiles',
    body: 'Work with us to develop a signature scent blend that is exclusively yours.',
    svg: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ width: 36, height: 36 }}><path d="M20 32 Q20 24 14 18 Q10 13 14 9 Q16 15 20 16 Q24 15 26 9 Q30 13 26 18 Q20 24 20 32Z"/><path d="M16 34 h8" strokeWidth="1.1"/></svg>,
  },
];

const SOAP_FORMS = ['Bar', 'Roundstone', 'Voyager Boat'];

const inputBase: React.CSSProperties = {
  width: '100%', padding: '13px 16px', background: '#fff',
  border: '1px solid var(--gold-line)', borderRadius: 3,
  color: 'var(--text-dark)', fontFamily: 'var(--font-display)',
  fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--text-light)',
  fontFamily: 'var(--font-mono)', marginBottom: 8,
};

export default function PrivateClientsClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState('');
  const [engraveMode, setEngraveMode] = useState<'text' | 'logo'>('text');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    soapForm: '', scent1: '', scent2: '', color: '', engraving: '',
    qty: '100',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const focus = (k: string) => () => setActiveField(k);
  const blur = () => setActiveField('');

  const fieldStyle = (k: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: activeField === k ? 'var(--gold)' : 'var(--gold-line)',
    boxShadow: activeField === k ? '0 0 0 3px rgba(184,149,90,0.1)' : 'none',
  });

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('[data-pc-fade]').forEach((el, i) => {
          gsap.set(el, { opacity: 0, y: 28, filter: 'blur(6px)' });
          gsap.to(el, {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7,
            delay: i * 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          });
        });
      });
    });
  }, []);

  const submit = async () => {
    if (!form.email || !form.firstName) { setError('Please fill in your name and email.'); return; }
    setSending(true); setError('');
    try {
      let logoBase64 = '';
      if (engraveMode === 'logo' && logoFile) {
        logoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
      }

      const res = await fetch('/api/private-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, engraveMode, logoFileName: logoFile?.name ?? '', logoBase64 }),
      });
      const data = await res.json();
      if (data.ok) setSubmitted(true);
      else setError('Something went wrong. Please try again.');
    } catch { setError('Network error. Please try again.'); }
    finally { setSending(false); }
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
        <div className="crumbs"><Link href="/">Home</Link> &nbsp;/&nbsp; Private Clients</div>
        <div className="eyebrow">Bespoke · Custom · Confidential</div>
        <h1>Private Client<br/>Program</h1>
        <p>For brands, events, and individuals who want something truly their own — from formula to finish.</p>
      </header>

      {/* Perks */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div data-pc-fade style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>What's Available</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', color: 'var(--navy)' }}>Three ways to make it yours.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {PERKS.map((p, i) => (
              <div key={p.title} data-pc-fade style={{
                padding: '48px 36px',
                background: i === 1 ? 'var(--navy)' : '#fff',
                border: '1px solid var(--gold-line)',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                <div style={{ color: i === 1 ? 'var(--gold)' : 'var(--navy)', opacity: 0.9 }}>{p.svg}</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                    color: i === 1 ? '#fff' : 'var(--navy)', marginBottom: 10,
                  }}>{p.title}</h3>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                    color: i === 1 ? 'rgba(255,255,255,0.65)' : 'var(--text-mid)', lineHeight: 1.7,
                  }}>{p.body}</p>
                </div>
                <div style={{
                  marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${i === 1 ? 'rgba(255,255,255,0.12)' : 'var(--gold-line)'}`,
                  fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)', color: i === 1 ? 'var(--gold)' : 'var(--text-light)',
                }}>Included in every private order</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section style={{ background: 'var(--off-white)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div data-pc-fade style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Why Join</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', color: 'var(--navy)' }}>Better price. Full control.</h2>
            <p style={{ color: 'var(--text-mid)', marginTop: 14, maxWidth: 480, margin: '14px auto 0', lineHeight: 1.7 }}>
              Private clients get our bulk rate and unlock every customization option — colors, scents, and engraving — all in one order.
            </p>
          </div>

          <div data-pc-fade style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Standard */}
            <div style={{
              padding: '40px 36px', border: '1px solid var(--gold-line)',
              borderRadius: 4, background: '#fff',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-light)' }}>Standard — Single Bar</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', color: 'var(--text-dark)', lineHeight: 1 }}>
                $7.00 <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/bar</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Choose your soap form',
                  'Select your scent',
                  'Choose solid or swirl colour',
                  'Engraving up to 3 characters',
                  'Order any quantity',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--gold-line)', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Private Client */}
            <div style={{
              padding: '40px 36px', border: '2px solid var(--gold)',
              borderRadius: 4, background: 'var(--navy)',
              display: 'flex', flexDirection: 'column', gap: 20, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -13, left: 28,
                background: 'var(--gold)', color: 'var(--navy)',
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '3px 12px', borderRadius: 2,
              }}>Recommended</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Private Client — MOQ 100 bars</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', color: 'var(--gold)', lineHeight: 1 }}>
                $5.50 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/bar</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Choose your soap form',
                  'Select up to 2 custom scents',
                  'Custom solid or swirl colours',
                  'Engraving or PNG logo ($35 design fee)',
                  'Minimum 100 bars per order',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--gold)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 12 12" fill="none" style={{ width: 9, height: 9 }}>
                        <path d="M2 6l3 3 5-5" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>
                Save $1.50 per bar vs. single pricing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOQ callout */}
      <div style={{ background: 'var(--navy)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--gold)', fontWeight: 600 }}>100</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', marginBottom: 2 }}>Minimum Order Quantity</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>$5.50 per bar · private client pricing</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', maxWidth: 320, lineHeight: 1.6 }}>
            Every bar hand-poured and cured to order. We respond to all inquiries within 48 hours.
          </div>
        </div>
      </div>

      {/* Form */}
      <section style={{ background: 'var(--off-white)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          <div data-pc-fade style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            {/* Left: context */}
            <div style={{ position: 'sticky', top: 120 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Start Your Project</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 20 }}>
                Tell us what you&rsquo;re building.
              </h2>
              <p style={{ fontFamily: 'var(--font-display)', color: 'var(--text-mid)', lineHeight: 1.75, marginBottom: 36 }}>
                Fill out the form and we&rsquo;ll reach out within 48 hours. All inquiries are handled personally — no automated replies.
              </p>

              {/* Mini recap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Engraving', value: form.engraving || '—' },
                  { label: 'Color', value: form.color || '—' },
                  { label: 'Scent 1', value: form.scent1 || '—' },
                  { label: 'Scent 2', value: form.scent2 || '—' },
                  { label: 'Form', value: form.soapForm || '—' },
                  { label: 'Quantity', value: form.qty ? `${form.qty} bars` : '—' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 12, borderBottom: '1px solid var(--gold-line)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: r.value === '—' ? 'var(--text-light)' : 'var(--navy)', maxWidth: 180, textAlign: 'right', wordBreak: 'break-word' }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)' }}>Est. Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 600 }}>
                    {form.qty ? `$${(parseFloat(form.qty) * 5.50).toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: form */}
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '72px 40px', background: '#fff', border: '1px solid var(--gold-line)', borderRadius: 4 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" style={{ width: 26, height: 26 }}><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 12 }}>Request received.</h3>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--text-mid)', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 32px' }}>
                  We&rsquo;ll review your project and be in touch within 48 hours at <strong>{form.email}</strong>.
                </p>
                <Link href="/" className="btn btn-outline">Back to Home</Link>
              </div>
            ) : (
              <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                {/* Section: Contact */}
                <div style={{ background: '#fff', border: '1px solid var(--gold-line)', borderRadius: '4px 4px 0 0', padding: '32px 32px 28px', borderBottom: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fff' }}>01</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', fontWeight: 500 }}>Contact</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <div>
                      <label style={label}>First Name *</label>
                      <input style={fieldStyle('firstName')} value={form.firstName} onChange={set('firstName')} onFocus={focus('firstName')} onBlur={blur} />
                    </div>
                    <div>
                      <label style={label}>Last Name</label>
                      <input style={fieldStyle('lastName')} value={form.lastName} onChange={set('lastName')} onFocus={focus('lastName')} onBlur={blur} />
                    </div>
                    <div>
                      <label style={label}>Email *</label>
                      <input style={fieldStyle('email')} type="email" value={form.email} onChange={set('email')} onFocus={focus('email')} onBlur={blur} />
                    </div>
                    <div>
                      <label style={label}>Phone</label>
                      <input style={fieldStyle('phone')} type="tel" value={form.phone} onChange={set('phone')} onFocus={focus('phone')} onBlur={blur} />
                    </div>
                  </div>
                </div>

                {/* Section: Customizations */}
                <div style={{ background: '#fff', border: '1px solid var(--gold-line)', padding: '32px 32px 28px', borderBottom: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fff' }}>02</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', fontWeight: 500 }}>Customizations</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Soap form tiles */}
                    <div>
                      <label style={label}>Soap Form</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {SOAP_FORMS.map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, soapForm: prev.soapForm === f ? '' : f }))}
                            style={{
                              padding: '8px 16px', borderRadius: 2, cursor: 'pointer',
                              fontFamily: 'var(--font-display)', fontSize: '0.82rem',
                              border: `1px solid ${form.soapForm === f ? 'var(--navy)' : 'var(--gold-line)'}`,
                              background: form.soapForm === f ? 'var(--navy)' : '#fff',
                              color: form.soapForm === f ? '#fff' : 'var(--text-mid)',
                              transition: 'all 0.18s',
                            }}
                          >{f}</button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, soapForm: prev.soapForm === 'Undecided' ? '' : 'Undecided' }))}
                          style={{
                            padding: '8px 16px', borderRadius: 2, cursor: 'pointer',
                            fontFamily: 'var(--font-display)', fontSize: '0.82rem',
                            border: `1px solid ${form.soapForm === 'Undecided' ? 'var(--navy)' : 'var(--gold-line)'}`,
                            background: form.soapForm === 'Undecided' ? 'var(--navy)' : '#fff',
                            color: form.soapForm === 'Undecided' ? '#fff' : 'var(--text-mid)',
                            transition: 'all 0.18s',
                          }}
                        >Undecided</button>
                      </div>
                    </div>

                    <div>
                      <label style={label}>Custom Scent Profile <span style={{ color: 'var(--gold)' }}>— up to 2 scents</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '0.08em', pointerEvents: 'none' }}>01</span>
                          <input style={{ ...fieldStyle('scent1'), paddingLeft: 36 }} value={form.scent1} onChange={set('scent1')} onFocus={focus('scent1')} onBlur={blur} placeholder="First scent — e.g. Lemon Verbena" />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '0.08em', pointerEvents: 'none' }}>02</span>
                          <input style={{ ...fieldStyle('scent2'), paddingLeft: 36 }} value={form.scent2} onChange={set('scent2')} onFocus={focus('scent2')} onBlur={blur} placeholder="Second scent (optional)" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={label}>Custom Color</label>
                      <input style={fieldStyle('color')} value={form.color} onChange={set('color')} onFocus={focus('color')} onBlur={blur} placeholder="Hex code, brand color, or describe the aesthetic…" />
                    </div>
                    <div>
                      <label style={label}>Engraving / Logo</label>
                      {/* Fee notice */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: '#fdf9f3', border: '1px solid var(--gold-line)', borderRadius: 3, marginBottom: 10 }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>◆</span>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 }}>
                          A <strong>one-time $35 design fee</strong> applies per unique engraving or logo. Once your design is on file, reuse it on any future order at no extra charge.
                        </p>
                      </div>
                      {/* Mode toggle */}
                      <div style={{ display: 'flex', gap: 0, marginBottom: 10, border: '1px solid var(--gold-line)', borderRadius: 3, overflow: 'hidden', width: 'fit-content' }}>
                        {(['text', 'logo'] as const).map(mode => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => {
                              setEngraveMode(mode);
                              if (mode === 'logo') {
                                setForm(f => ({ ...f, engraving: '' }));
                              } else {
                                setLogoFile(null);
                                setLogoPreview(null);
                                if (fileRef.current) fileRef.current.value = '';
                              }
                            }}
                            style={{
                              padding: '7px 18px', border: 'none', cursor: 'pointer',
                              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                              background: engraveMode === mode ? 'var(--navy)' : '#fff',
                              color: engraveMode === mode ? '#fff' : 'var(--text-light)',
                              transition: 'all 0.18s',
                            }}
                          >{mode === 'text' ? 'Engrave Text' : 'Upload Logo'}</button>
                        ))}
                      </div>

                      {engraveMode === 'text' ? (
                        <div>
                          <input
                            style={fieldStyle('engraving')}
                            value={form.engraving}
                            onChange={e => setForm(f => ({ ...f, engraving: e.target.value.slice(0, 3).toUpperCase() }))}
                            onFocus={focus('engraving')} onBlur={blur}
                            maxLength={3}
                            placeholder="Up to 3 characters — e.g. J M G"
                          />
                          <div style={{ marginTop: 5, textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>{form.engraving.length}/3</div>
                        </div>
                      ) : (
                        <div>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/png"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files?.[0] ?? null;
                              setLogoFile(file);
                              if (file) setLogoPreview(URL.createObjectURL(file));
                              else setLogoPreview(null);
                            }}
                          />
                          {logoPreview ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', border: '1px solid var(--gold-line)', borderRadius: 3, background: '#fafaf8' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logoPreview} alt="Logo preview" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 2, background: '#fff', border: '1px solid var(--gold-line)' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{logoFile?.name}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-light)', marginTop: 3 }}>{logoFile ? (logoFile.size / 1024).toFixed(1) + ' KB' : ''}</div>
                              </div>
                              <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); if (fileRef.current) fileRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Remove</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              style={{
                                width: '100%', padding: '20px 16px', border: '1px dashed var(--gold-line)', borderRadius: 3,
                                background: '#fafaf8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                              </svg>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: 'var(--text-mid)' }}>Click to upload PNG</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '0.06em' }}>PNG only · We'll use this as your stamp</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Order */}
                <div style={{ background: '#fff', border: '1px solid var(--gold-line)', padding: '32px 32px 28px', borderBottom: 'none', borderTop: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fff' }}>03</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', fontWeight: 500 }}>Order Size</span>
                  </div>
                  <div>
                    <label style={label}>Number of Bars <span style={{ color: 'var(--gold)' }}>— minimum 100</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--gold-line)', borderRadius: 3, overflow: 'hidden', width: 'fit-content' }}>
                      <button type="button" onClick={() => setForm(f => ({ ...f, qty: String(Math.max(100, parseInt(f.qty || '100') - 1)) }))} style={{ width: 44, height: 48, background: 'none', border: 'none', borderRight: '1px solid var(--gold-line)', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>−</button>
                      <input
                        type="number" min="100"
                        value={form.qty}
                        onChange={e => setForm(f => ({ ...f, qty: String(Math.max(100, parseInt(e.target.value) || 100)) }))}
                        style={{ width: 80, height: 48, textAlign: 'center', border: 'none', outline: 'none', fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-dark)' }}
                      />
                      <button type="button" onClick={() => setForm(f => ({ ...f, qty: String(parseInt(f.qty || '100') + 1) }))} style={{ width: 44, height: 48, background: 'none', border: 'none', borderLeft: '1px solid var(--gold-line)', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-dark)' }}>+</button>
                    </div>
                    <div style={{ marginTop: 10, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-light)' }}>
                      {form.qty} bars × $5.50 = <span style={{ color: 'var(--gold)', fontWeight: 600 }}>${(parseFloat(form.qty || '100') * 5.50).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div style={{ background: '#fff', border: '1px solid var(--gold-line)', borderRadius: '0 0 4px 4px', padding: '28px 32px' }}>
                  {error && <div style={{ marginBottom: 12, fontSize: '0.82rem', color: '#c0392b', fontFamily: 'var(--font-mono)' }}>{error}</div>}
                  <button
                    className="btn btn-primary"
                    onClick={submit}
                    disabled={sending}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px 24px' }}
                  >
                    {sending ? 'Submitting…' : 'Submit Private Client Request'}
                  </button>
                  <p style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)', textAlign: 'center', letterSpacing: '0.06em' }}>
                    We respond within 48 hours &nbsp;·&nbsp; All inquiries are confidential
                  </p>
                </div>

              </div>
            )}
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
