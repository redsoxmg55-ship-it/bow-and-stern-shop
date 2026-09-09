'use client';
import { useState, useEffect } from 'react';

export default function MaintenancePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show every visit
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(13,31,45,0.82)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 6, maxWidth: 480, width: '90%',
        padding: '48px 40px', textAlign: 'center',
        boxShadow: '0 32px 80px rgba(13,31,45,0.28)',
        position: 'relative',
      }}>
        {/* Corner accents */}
        <span style={{ position:'absolute', top:12, left:12, width:14, height:14, borderTop:'1.5px solid var(--gold)', borderLeft:'1.5px solid var(--gold)' }} />
        <span style={{ position:'absolute', top:12, right:12, width:14, height:14, borderTop:'1.5px solid var(--gold)', borderRight:'1.5px solid var(--gold)' }} />
        <span style={{ position:'absolute', bottom:12, left:12, width:14, height:14, borderBottom:'1.5px solid var(--gold)', borderLeft:'1.5px solid var(--gold)' }} />
        <span style={{ position:'absolute', bottom:12, right:12, width:14, height:14, borderBottom:'1.5px solid var(--gold)', borderRight:'1.5px solid var(--gold)' }} />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-transparent.png" alt="Bow & Stern Soap Co." style={{ width: 90, height: 90, objectFit: 'contain', margin: '0 auto 20px', display: 'block' }} />

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
          Bow &amp; Stern Soap Co.
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--navy)', marginBottom: 16, lineHeight: 1.2 }}>
          We&rsquo;re currently under<br />maintenance.
        </h2>

        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#666', lineHeight: 1.7, marginBottom: 32 }}>
          Our site is being updated. We&rsquo;ll be back shortly — crafting something worth the wait.
        </p>

        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'var(--navy)', color: '#fff', border: 'none',
            padding: '13px 36px', borderRadius: 3, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}
        >
          Enter Site Anyway
        </button>

        <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#bbb', textTransform: 'uppercase' }}>
          bowandsternsoapco@gmail.com
        </div>
      </div>
    </div>
  );
}
