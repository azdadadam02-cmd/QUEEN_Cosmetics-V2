import Link from 'next/link';
import PackCard from './PackCard';

const SHOWN = 3;

/** Les packs de l'accueil : une seule section titrée (3 cartes), avec un lien vers tous s'il y en a davantage */
export default function PacksSection({ packs }) {
  return (
    <section className="packs-section" aria-labelledby="packs-title">
      <div className="packs-head">
        <div>
          <h2 id="packs-title">Nos packs</h2>
          <p>Plusieurs produits, un seul prix.</p>
        </div>
        {packs.length > SHOWN && <Link href="/packs">Voir tous les packs &gt;</Link>}
      </div>
      <div className="pack-grid">{packs.slice(0, SHOWN).map((k) => <PackCard key={k.id} pack={k} />)}</div>
    </section>
  );
}
