'use client';
import { useMemo, useState } from 'react';
import { money, norm } from '@/lib/format';

/**
 * Produits du pack : recherche, ajout, quantités, valeur séparée.
 * lines = [{ id, quantite }] ; productOf(id) retrouve le produit (catalogue, ou pack en cours s'il n'y est plus).
 */
export default function PackProductsPicker({ catalog, lines, onChange, productOf, error }) {
  const [pq, setPq] = useState('');
  const [picked, setPicked] = useState('');

  // Chaque mot cherché doit se trouver dans le nom, la marque ou les catégories ; ceux déjà dans le pack sont exclus
  const options = useMemo(() => {
    const terms = norm(pq).split(/\s+/).filter(Boolean);
    return catalog.filter((p) => !lines.some((l) => l.id === p.id)
      && terms.every((t) => norm([p.name, p.brand, p.category, p.sub_category].join(' ')).includes(t)));
  }, [catalog, lines, pq]);

  function add(id) {
    if (!id || lines.some((l) => l.id === id)) return;
    onChange([...lines, { id, quantite: 1 }]);
    setPq('');
    setPicked('');
  }
  const setQty = (id, quantite) => onChange(lines.map((x) => (x.id === id ? { ...x, quantite } : x)));
  const remove = (id) => onChange(lines.filter((x) => x.id !== id));
  const value = lines.reduce((s, l) => s + (productOf(l.id)?.price || 0) * l.quantite, 0);

  return (
    <fieldset className="form-group">
      <legend>Produits du pack</legend>
      <div className="pack-pick">
        <input
          type="search"
          value={pq}
          placeholder="Rechercher un produit (nom, marque, catégorie)…"
          aria-label="Rechercher un produit à ajouter au pack"
          autoComplete="off"
          onChange={(e) => { setPq(e.target.value); setPicked(''); }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();   // Entrée ajoute le premier produit de la liste, sans envoyer le formulaire
            if (options[0] && pq.trim()) add(options[0].id);
          }}
        />
        <div className="pack-pick-row">
          <select value={picked} onChange={(e) => setPicked(e.target.value)} aria-label="Choisir un produit">
            <option value="">{options.length ? `Choisir un produit… (${options.length})` : 'Aucun produit trouvé'}</option>
            {options.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.category || 'Sans catégorie'} — {money(p.price)}</option>)}
          </select>
          <button type="button" className="btn-ghost" onClick={() => add(Number(picked))}>Ajouter</button>
        </div>
      </div>
      {lines.map((l) => (
        <div className="pack-line" key={l.id}>
          <span>{productOf(l.id)?.name}</span>
          <input type="number" min="1" max="20" value={l.quantite} aria-label="Quantité" onChange={(e) => setQty(l.id, Number(e.target.value))} />
          <button type="button" className="btn-danger" onClick={() => remove(l.id)} aria-label="Retirer ce produit">×</button>
        </div>
      ))}
      {error && <span className="error-text">{error}</span>}
      {lines.length > 0 && <small className="muted">Valeur séparée : {money(value)}</small>}
    </fieldset>
  );
}
