import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="empty-state mt">
      <span className="empty-ico">✦</span>
      <h3>Page introuvable</h3>
      <p>La page demandée n&apos;existe pas.</p>
      <Button href="/">Retour à l&apos;accueil</Button>
    </div>
  );
}
