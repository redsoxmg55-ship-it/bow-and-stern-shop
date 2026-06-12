'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let firstVisit = true;
    try { firstVisit = !sessionStorage.getItem('bs-visited'); sessionStorage.setItem('bs-visited', '1'); } catch {}
    const minTime = firstVisit ? 1500 : 600;
    const t = setTimeout(() => {
      setHidden(true);
      setTimeout(() => setGone(true), 700);
    }, minTime);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div id="bs-loader" className={hidden ? 'hidden' : ''}>
      <Image className="bs-loader-logo" src="/logo.png" alt="Bow & Stern Soap Co." width={230} height={230} priority />
      <div className="bs-loader-bar"><span /></div>
      <div className="bs-loader-label">Handcrafted with intention</div>
    </div>
  );
}
