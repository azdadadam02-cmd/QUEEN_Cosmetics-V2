import Link from 'next/link';
import Button from '@/components/ui/Button';
import { money } from '@/lib/format';

/** Récapitulatif + bouton de commande. checked = panier revérifié par Laravel ; le personnel ne peut pas commander. */
export default function CartSummary({ items, user, checked }) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <aside className="summary">
      <h3 className="h-serif">Récapitulatif</h3>
      <dl>
        <div><dt>Articles</dt><dd>{count}</dd></div>
        <div><dt>Livraison</dt><dd>Offerte</dd></div>
        <div><dt>Paiement</dt><dd>À la livraison</dd></div>
      </dl>
      <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
      {user && user.role !== 'client' ? (
        <p className="sum-link">Connecté en tant que personnel : la commande est réservée aux comptes clients.</p>
      ) : (
        <Button href={user ? '/checkout' : '/login?next=/checkout'} target={user ? undefined : '_blank'} rel={user ? undefined : 'noopener'} block aria-disabled={!checked}>Confirmer la commande</Button>
      )}
      <Link href="/products" className="sum-link">Continuer mes achats</Link>
    </aside>
  );
}
