import Button from '@/components/ui/Button';

export default function DialogActions({ onCancel, busy }) {
  return (
    <div className="dialog-actions">
      <button type="button" className="btn-ghost" onClick={onCancel}>Annuler</button>
      <Button type="submit" size="sm" loading={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</Button>
    </div>
  );
}
