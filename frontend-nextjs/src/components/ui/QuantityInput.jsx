'use client';
import { useEffect, useRef, useState } from 'react';
import { clampQty, typedQty } from '@/lib/quantity';

/**
 * Une seule case de quantité : − / +, saisie au clavier, flèches haut / bas, molette.
 * La molette n'agit que si la case est active (cliquée) : faire défiler la page en passant dessus ne change rien.
 */
export default function QuantityInput({ value, max, onChange, disabled = false, label = 'Quantité' }) {
  const [draft, setDraft] = useState(null);
  const inputRef = useRef(null);
  const top = clampQty(max, max);
  const set = (n) => {
    setDraft(null);
    onChange(clampQty(n, top));
  };

  // Écouteur non passif : sinon preventDefault est ignoré et la page défile en même temps
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (document.activeElement !== el || disabled) return;
      e.preventDefault();
      onChange(clampQty(value + (e.deltaY < 0 ? 1 : -1), top));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [value, top, disabled, onChange]);

  return (
    <div className="qty-input" data-lenis-prevent>
      <button type="button" aria-label="Diminuer la quantité" disabled={disabled || value <= 1} onClick={() => set(value - 1)}>−</button>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={top}
        role="spinbutton"
        aria-valuenow={value}
        disabled={disabled}
        value={draft ?? String(value)}
        onChange={(e) => {
          const n = typedQty(e.target.value, top);
          setDraft(n === null ? '' : String(n));
          if (n !== null) onChange(n);
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            set(value + (e.key === 'ArrowUp' ? 1 : -1));
          }
        }}
      />
      <button type="button" aria-label="Augmenter la quantité" disabled={disabled || value >= top} onClick={() => set(value + 1)}>+</button>
    </div>
  );
}
