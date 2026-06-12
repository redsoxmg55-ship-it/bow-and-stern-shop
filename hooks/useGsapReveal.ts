import { RefObject, useEffect } from 'react';

export function useGsapReveal(ref: RefObject<HTMLElement | null>, options?: {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  childSelector?: string;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const targets = options?.childSelector
          ? el.querySelectorAll(options.childSelector)
          : [el];

        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y: options?.y ?? 28, filter: 'blur(6px)' });

        const anim = gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: options?.duration ?? 0.75,
          delay: options?.delay ?? 0,
          stagger: options?.stagger ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });

        cleanup = () => { anim.kill(); ScrollTrigger.getAll().forEach(st => st.kill()); };
      });
    });

    return () => cleanup?.();
  }, []);
}
