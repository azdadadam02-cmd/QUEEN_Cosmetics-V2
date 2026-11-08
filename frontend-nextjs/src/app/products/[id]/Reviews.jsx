'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Stars from '@/components/ui/Stars';
import { api, errorMessage } from '@/lib/api';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

export default function Reviews({ productId, reviews }) {
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [sending, setSending] = useState(false);
  const [mine, setMine] = useState(null);   // l'avis du client : il le voit même avant la validation
  const isClient = hydrated && user?.role === 'client';

  useEffect(() => {
    if (!isClient) return;
    api.get(`/products/${productId}/reviews/mine`).then(({ data }) => {
      if (!data) return;
      setMine(data);
      setNote(data.rating);
      setCommentaire(data.comment || '');
    }).catch(() => {});
  }, [isClient, productId]);

  async function submit(e) {
    e.preventDefault();
    if (!note) return toast.error('Choisissez une note de 1 à 5.');
    setSending(true);
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { note, commentaire });
      toast.success(data.message);
      setMine({ rating: note, comment: commentaire, approved: false });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="pd-section" id="avis">
      <h2>Avis</h2>
      {reviews.length === 0 && !mine && <p className="muted">Pas encore d’avis sur ce produit.</p>}
      <div className="review-grid">
        {mine && !mine.approved && (
          <article className="review">
            <header>
              <strong>Votre avis</strong>
              <span className="pill pill-role">En attente de validation</span>
              <Stars value={mine.rating} count={1} className="stars-sm" />
            </header>
            {mine.comment && <p>{mine.comment}</p>}
          </article>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="review">
            <header>
              <Avatar src={r.author_image} name={r.author} className="review-photo" />
              <strong>{r.author}</strong>
              <Stars value={r.rating} count={1} className="stars-sm" />
            </header>
            {r.comment && <p>{r.comment}</p>}
          </article>
        ))}
      </div>

      {isClient && (
        <form className="review-form" onSubmit={submit}>
          <strong>{mine ? 'Modifier votre avis' : 'Donnez votre avis'}</strong>
          <div className="star-pick" role="radiogroup" aria-label="Note">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" className={i <= note ? 'on' : ''} onClick={() => setNote(i)} aria-label={`${i} sur 5`}>★</button>
            ))}
          </div>
          <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} maxLength={1000} placeholder="Votre commentaire (optionnel)" />
          <div><Button type="submit" size="sm" loading={sending}>{mine ? 'Mettre à jour' : 'Envoyer mon avis'}</Button></div>
          <small className="muted">Les avis sont publiés après validation{mine ? ' : une modification repasse en attente' : ''}.</small>
        </form>
      )}
      {hydrated && !user && <p className="muted" style={{ marginTop: 22 }}><Link href="/login" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>Connectez-vous</Link> pour laisser un avis.</p>}
    </section>
  );
}
