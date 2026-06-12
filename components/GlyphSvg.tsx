export function GlyphSvg({ type }: { type: 'bar' | 'circle' | 'ribbed' | 'bunny' }) {
  if (type === 'ribbed') return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="32" cy="32" r="19"/>
      <path d="M13.5 24 Q32 21 50.5 24" opacity=".6"/>
      <path d="M13 28 Q32 25 51 28" opacity=".5"/>
      <path d="M13 32 Q32 29 51 32" opacity=".5"/>
      <path d="M13.5 36 Q32 33 50.5 36" opacity=".5"/>
      <path d="M14.5 40 Q32 37 49.5 40" opacity=".6"/>
    </svg>
  );
  if (type === 'circle') return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="32" cy="32" r="19"/>
      <circle cx="32" cy="32" r="11.5" opacity=".55"/>
      <path d="M19 24 Q21 20 26 18" opacity=".5"/>
    </svg>
  );
  if (type === 'bunny') return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 40 C7 33 12 29 18 29 C20 25 23 25 25 29 C28 31 29 31 32 29 C40 20 53 24 56 34 C59 40 55 45 47 45 L15 45 C9 45 8 45 8 40 Z"/>
      <path d="M25 28 Q27 20 32 25" opacity=".7"/>
      <circle cx="16.5" cy="36" r="1.2" fill="currentColor" stroke="none"/>
      <path d="M8 39 Q11 41 13.5 39.5" opacity=".5"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M10 26 L32 18 L54 26 L32 34 Z"/>
      <path d="M10 26 V40 L32 48 V34"/>
      <path d="M54 26 V40 L32 48"/>
      <path d="M18 28 Q24 31 32 29" opacity=".55"/>
    </svg>
  );
}
