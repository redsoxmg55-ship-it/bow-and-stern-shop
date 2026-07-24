export function GlyphSvg({ type }: { type: 'bar' | 'circle' | 'voyager' }) {
  if (type === 'voyager') return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 42 Q20 36 32 38 Q44 40 56 42 L50 48 Q40 52 32 52 Q24 52 14 48 Z"/>
      <path d="M32 38 L32 18"/>
      <path d="M32 18 L46 34"/>
      <path d="M32 18 L22 30" opacity=".55"/>
      <path d="M10 44 Q32 40 54 44" opacity=".4"/>
    </svg>
  );
  if (type === 'circle') return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="32" cy="32" r="19"/>
      <circle cx="32" cy="32" r="11.5" opacity=".55"/>
      <path d="M19 24 Q21 20 26 18" opacity=".5"/>
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
