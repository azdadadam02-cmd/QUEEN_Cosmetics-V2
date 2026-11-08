import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

/** Les 3 gestes sur un produit : chacun passe par une confirmation Oui / Non */
export const ACTIONS = {
  delete: {
    title: 'Supprimer le produit',
    text: (p) => `Voulez-vous supprimer « ${p.name} » ? Il disparaît de la boutique et va dans les supprimés, où vous pourrez le restaurer.`,
    run: (p) => api.delete(`/manage/products/${p.id}`),
  },
  restore: {
    title: 'Restaurer le produit',
    text: (p) => `Voulez-vous restaurer « ${p.name} » ? Il redevient visible dans la boutique.`,
    run: (p) => api.post(`/manage/products/${p.id}/restore`),
  },
  force: {
    title: 'Supprimer définitivement',
    text: (p) => `Voulez-vous supprimer « ${p.name} » définitivement ? Action irréversible : ses variantes, sa galerie, ses avis et ses favoris seront effacés.`,
    run: (p) => api.delete(`/manage/products/${p.id}/force`),
    danger: true,
  },
};

export default function ProductActionDialog({ ask, busy, onCancel, onConfirm }) {
  const action = ask && ACTIONS[ask.kind];
  return (
    <Modal open={!!ask} onClose={() => !busy && onCancel()} title={action?.title}>
      {ask && <p>{action.text(ask.p)}</p>}
      <div className="dialog-actions">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={busy}>Non</button>
        <Button variant={action?.danger ? 'danger' : 'gold'} size="sm" loading={busy} onClick={onConfirm}>Oui</Button>
      </div>
    </Modal>
  );
}
