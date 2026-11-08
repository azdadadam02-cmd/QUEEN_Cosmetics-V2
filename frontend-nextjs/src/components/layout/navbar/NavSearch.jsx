'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import NavIcon from './NavIcon';

/** Recherche de la navbar : s'élargit au focus (onOpenChange), envoie vers /products?q=… */
export default function NavSearch({ onOpenChange }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  function close() {
    onOpenChange(false);
    setQ('');
  }

  function onSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/products?q=${encodeURIComponent(term)}`);
    inputRef.current?.blur();
  }

  return (
    <form role="search" onSubmit={onSubmit}>
      <label className="cnav-searchbox">
        <NavIcon name="search" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Rechercher"
          aria-label="Rechercher un produit"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => onOpenChange(true)}
          onBlur={close}
          onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()}
        />
      </label>
    </form>
  );
}
