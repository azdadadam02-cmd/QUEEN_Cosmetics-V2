'use client';
import { useEffect, useMemo } from 'react';

export default function ImageInput({ file, onChange, current, label = 'Image' }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const shown = preview || current;
  return (
    <div className="field">
      <label>{label} <small>(JPG, PNG, WEBP · 3 Mo max{current ? ' · vide = image actuelle' : ''})</small></label>
      <label className="drop">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {shown ? <img src={shown} alt="Aperçu" /> : <span>Cliquer pour choisir une image</span>}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
      </label>
    </div>
  );
}
