'use client';
import { useEffect } from 'react';

/** Une fiche s'ouvre toujours tout en haut, même quand on arrive d'une page déjà défilée (sauf lien avec #ancre) */
export default function ScrollTop() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);
  return null;
}
