import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import { money } from '@/lib/format';
import { lineKey } from '@/store/cartStore';

/** Articles : les lignes revérifiées par Laravel (prix réels) dès qu'elles arrivent, le panier local en attendant */
export default function OrderLines({ lines, warnings = [], error }) {
  return (
    <section className="panel">
      <h3>Articles</h3>
      {lines.map((l) => (
        <div className="mini-line" key={lineKey(l)}>
          <Thumb src={l.image_url} name={l.name} size="sm" />
          <div className="ml-info"><strong>{l.name}</strong><VariantTag color={l.variant_color} size={l.variant_size} /><small>{l.quantity} × {money(l.price)}</small></div>
          <span className="ml-total">{money(l.price * l.quantity)}</span>
        </div>
      ))}
      {warnings.map((w) => <p key={w} className="error-text form-error">{w}</p>)}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
