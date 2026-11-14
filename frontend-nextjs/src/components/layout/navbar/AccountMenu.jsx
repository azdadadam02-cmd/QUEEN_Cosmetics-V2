'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { logout } from '@/lib/auth';
import { toast } from '@/store/toastStore';
import NavIcon from './NavIcon';

/** Bouton « Compte » + menu (profil, déconnexion ou connexion). me = null tant que la page n'est pas hydratée. */
export default function AccountMenu({ me, pathname }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(0);
  const ref = useRef(null);
  const isClient = me?.role === 'client';

  // Badge : commandes dont le statut a changé, relu à chaque page
  useEffect(() => {
    if (!isClient) return;
    let alive = true;
    api.get('/notifications/count').then(({ data }) => alive && setNotif(data.count)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [isClient, pathname]);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  async function onLogout() {
    setOpen(false);
    await logout();
    toast.success('Vous êtes déconnecté.');
    router.refresh();
  }

  return (
    <div className="cnav-account" ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" className="cnav-link cnav-account-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="cnav-icon">
          {me?.image_url ? <Avatar src={me.image_url} name={me.name} className="cnav-photo" /> : <NavIcon name="account" />}
          {isClient && notif > 0 && <b className="badge">{notif}</b>}
        </span>
        <span className="cnav-label">Compte</span>
      </button>

      <div className={`cnav-menu${open ? ' open' : ''}`}>
        {me ? (
          <>
            <div className="cnav-user">
              <Avatar src={me.image_url} name={me.name} className="cnav-avatar" />
              <span className="cnav-email">{me.email}</span>
            </div>
            {isClient && (
              <Link href="/profile" className="cnav-item" onClick={() => setOpen(false)}>
                <NavIcon name="account" /> Profil
              </Link>
            )}
            <button type="button" className="cnav-item" onClick={onLogout}>
              <NavIcon name="logout" /> Déconnexion
            </button>
          </>
        ) : (
          <Link href="/login" target="_blank" rel="noopener" className="cnav-item" onClick={() => setOpen(false)}>
            <NavIcon name="login" /> Connexion
          </Link>
        )}
      </div>
    </div>
  );
}
