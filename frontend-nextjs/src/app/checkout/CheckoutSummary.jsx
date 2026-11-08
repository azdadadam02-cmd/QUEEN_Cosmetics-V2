import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import { money } from '@/lib/format';

/** Total, case « +18 » (revérifiée par Laravel) et envoi. ready = panier revérifié par l'API. */
export default function CheckoutSummary({ total, adult, onAdult, adultError, error, sending, ready }) {
  return (
    <aside className="summary">
      <h3 className="h-serif">Total à payer</h3>
      <div className="total"><span>À la livraison</span><strong>{money(total)}</strong></div>
      <label className="check">
        <input type="checkbox" checked={adult} onChange={onAdult} />
        <span className="box" />
        <span className="check-txt"><b>+18</b>Je confirme avoir 18 ans ou plus.</span>
      </label>
      {adultError && <span className="error-text" style={{ color: '#ffb4ab' }}>{adultError}</span>}
      <FormError message={error} />
      <Button type="submit" block loading={sending} disabled={!ready || sending}>
        {sending ? 'Envoi…' : 'Valider ma commande'}
      </Button>
    </aside>
  );
}
