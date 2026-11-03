'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Bandeau publicitaire à défilement automatique (table « publicites ») */
export default function AdsCarousel({ ads }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const slides = ads.length ? ads : [{ id: 0, title: "L'élégance royale au cœur de votre beauté", reduction: 0, image_url: null, fallback: true }];
  const multi = slides.length > 1;

  const go = useCallback(
    (i) => {
      const n = (i + slides.length) % slides.length;
      track.current?.scrollTo({ left: n * track.current.clientWidth, behavior: 'smooth' });
      setIndex(n);
    },
    [slides.length]
  );

  useEffect(() => {
    if (!multi) return;
    const t = setInterval(() => go(index + 1), 5500);
    return () => clearInterval(t);
  }, [index, multi, go]);

  return (
    <section className="ads" aria-roledescription="carrousel" aria-label="Offres QUEEN">
      <div className="ads-track" ref={track}>
        {slides.map((ad, i) => (
          <article className="ad-slide" key={ad.id}>
            {ad.image_url && <Image src={ad.image_url} alt="" fill sizes="100vw" priority={i === 0} style={{ zIndex: -2, objectFit: 'cover' }} />}
            <div className="ad-shade" />
            <div className="ad-content">
              <span className="eyebrow gold">{ad.fallback ? 'Haute beauté & parfums' : 'Offre exclusive'}</span>
              <h2>{ad.title}</h2>
              <Link href={ad.product_id ? `/products/${ad.product_id}` : '/products'} className="btn btn-light">
                {ad.product_id ? 'Voir le produit' : 'Découvrir la collection'}
              </Link>
            </div>
            {ad.reduction > 0 && (
              <div className="ad-badge">
                <small>jusqu&apos;à</small>
                <strong>-{ad.reduction}%</strong>
              </div>
            )}
          </article>
        ))}
      </div>
      {multi && (
        <>
          <button type="button" className="ads-arrow prev" aria-label="Publicité précédente" onClick={() => go(index - 1)}>‹</button>
          <button type="button" className="ads-arrow next" aria-label="Publicité suivante" onClick={() => go(index + 1)}>›</button>
          <div className="ads-dots">
            {slides.map((ad, i) => (
              <button key={ad.id} type="button" className={i === index ? 'on' : ''} aria-label={`Publicité ${i + 1}`} onClick={() => go(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
