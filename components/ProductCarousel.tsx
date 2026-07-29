'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlyphSvg } from '@/components/GlyphSvg';

type GlyphType = 'bar' | 'circle' | 'voyager';

interface Props {
  glyph: GlyphType;
  label: string;
  tag?: string;
  images?: (string | null)[];
  activeSlide?: number;
  onSlideChange?: (i: number) => void;
  href?: string;
  colorHex?: string;
  colorHex2?: string;
}

const PRODUCT_IMAGES: Partial<Record<GlyphType, (string | null)[]>> = {
  circle: ['/products/circle-soap.png', '/products/circle-soap-3.png', '/products/circle-soap-2.png'],
};

export default function ProductCarousel({ glyph, label, tag, images, activeSlide, onSlideChange, href, colorHex, colorHex2 }: Props) {
  const [internalSlide, setInternalSlide] = useState(0);
  const slide = activeSlide !== undefined ? activeSlide : internalSlide;
  const slides = images ?? PRODUCT_IMAGES[glyph] ?? [null, null];
  const router = useRouter();

  const go = (next: number) => {
    setInternalSlide(next);
    onSlideChange?.(next);
  };

  return (
    <div className="prod-carousel">
      <div className="prod-carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
        {slides.map((img, i) => (
          <div
            key={i}
            className="prod-carousel-slide"
            onClick={href ? () => router.push(href) : undefined}
            style={href ? { cursor: 'pointer' } : undefined}
          >
            <div className="frame" style={{
              aspectRatio: '1/1', marginBottom: 0, width: '100%', overflow: 'hidden',
              ...(!img && colorHex ? {
                background: colorHex2
                  ? `linear-gradient(135deg, ${colorHex} 50%, ${colorHex2} 50%)`
                  : colorHex,
                transition: 'background 0.3s ease',
              } : {}),
            }}>
              {tag && i === 0 && <span className="product-tag">{tag}</span>}
              <span className="corner tl"/><span className="corner tr"/>
              <span className="corner bl"/><span className="corner br"/>
              {img ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={img} alt={`${label} photo ${i + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span className="frame-glyph" style={colorHex ? { color: 'rgba(0,0,0,0.2)' } : undefined}><GlyphSvg type={glyph} /></span>
                  <span className="frame-caption">{label} — Photo {i + 1}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="prod-carousel-btn prev"
        onClick={e => { e.preventDefault(); e.stopPropagation(); go(slide === 0 ? slides.length - 1 : slide - 1); }}
        aria-label="Previous photo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <button
        className="prod-carousel-btn next"
        onClick={e => { e.preventDefault(); e.stopPropagation(); go(slide === slides.length - 1 ? 0 : slide + 1); }}
        aria-label="Next photo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
      </button>

      <div className="prod-carousel-dots">
        {slides.map((_, i) => (
          <button key={i} className={`prod-carousel-dot${slide === i ? ' active' : ''}`} onClick={e => { e.preventDefault(); e.stopPropagation(); go(i); }} aria-label={`Photo ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
