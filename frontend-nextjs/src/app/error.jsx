'use client';
import Button from '@/components/ui/Button';

export default function Error({ reset }) {
  return (
    <div className="empty-state mt">
      <span className="empty-ico">✦</span>
      <h3>Le service est momentanément indisponible</h3>
      <p>Vérifiez que l&apos;API Laravel est lancée (php artisan serve), puis réessayez.</p>
      <Button onClick={() => reset()}>Réessayer</Button>
    </div>
  );
}
