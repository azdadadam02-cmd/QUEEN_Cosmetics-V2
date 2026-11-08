'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CLEAR = 'transform,opacity,visibility,transition';
const FROM = { autoAlpha: 0, y: 24, transition: 'none' };
const TO = { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: CLEAR };
const OK_MOTION = '(prefers-reduced-motion: no-preference)';

export function useScrollReveal(scope, selector, dependencies = []) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(OK_MOTION, () => {
      const items = gsap.utils.toArray(scope.current?.querySelectorAll(selector) ?? []);
      if (items.length === 0) return;
      ScrollTrigger.batch(items, {
        start: 'top 94%',
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, FROM, { ...TO, stagger: 0.06 }),
      });
    });
    return () => mm.revert();
  }, { scope, dependencies, revertOnUpdate: true });
}

export function useEntrance(scope, selector) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(OK_MOTION, () => {
      gsap.fromTo(selector, FROM, { ...TO, stagger: 0.1, delay: 0.1 });
    });
    return () => mm.revert();
  }, { scope });
}
