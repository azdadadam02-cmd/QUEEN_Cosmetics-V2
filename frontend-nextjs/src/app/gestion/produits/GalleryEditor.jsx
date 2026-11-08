'use client';
import Image from 'next/image';

/** Galerie : les images retirées ne partent qu'à l'enregistrement (removed), les nouvelles aussi (newImages) */
export default function GalleryEditor({ gallery, removed, onRemove, newImages, onAdd, errors }) {
  const visible = gallery.filter((g) => !removed.includes(g.id));
  const error = Object.entries(errors).find(([k]) => k.startsWith('gallery'))?.[1];

  return (
    <fieldset className="form-group">
      <legend>Galerie <small>(10 images maximum)</small></legend>
      {visible.length > 0 && (
        <div className="gallery-edit">
          {visible.map((g) => (
            <div key={g.id}>
              <Image src={g.url} alt="" fill sizes="80px" />
              <button type="button" onClick={() => onRemove(g.id)} aria-label="Retirer cette image">×</button>
            </div>
          ))}
        </div>
      )}
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => onAdd([...e.target.files])} aria-label="Ajouter des images à la galerie" />
      {newImages.length > 0 && <small>{newImages.length} image(s) à ajouter</small>}
      {error && <span className="error-text">{error}</span>}
    </fieldset>
  );
}
