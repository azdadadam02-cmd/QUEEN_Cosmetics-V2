'use client';
import Image from 'next/image';
import { useState } from 'react';
import { initial } from '@/lib/format';

export default function ProductGallery({ images, name, brand, promo }) {
  const [index, setIndex] = useState(0);
  const move = (step) => setIndex((i) => (i + step + images.length) % images.length);

  return (
    <div className="pd-gallery">
      {images.length > 1 && (
        <div className="pd-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" className={i === index ? 'on' : ''} onClick={() => setIndex(i)} aria-label={`Image ${i + 1}`}>
              <Image src={src} alt="" fill sizes="110px" />
            </button>
          ))}
        </div>
      )}
      <div className="pd-main">
        {brand && <span className="pd-brand">{brand}</span>}
        <div className="pd-image">
          <span className="ph" aria-hidden="true">{initial(name)}</span>
          {images[index] && <Image src={images[index]} alt={name} fill sizes="(max-width: 860px) 100vw, 40vw" priority onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
          {promo > 0 && <span className="pc-promo">-{promo}%</span>}
          {images.length > 1 && (
            <>
              <button type="button" className="pd-arrow prev" onClick={() => move(-1)} aria-label="Image précédente">&lt;</button>
              <button type="button" className="pd-arrow next" onClick={() => move(1)} aria-label="Image suivante">&gt;</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
