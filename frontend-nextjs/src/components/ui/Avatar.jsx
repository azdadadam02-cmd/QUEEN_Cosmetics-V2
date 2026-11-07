import Image from 'next/image';
import { initial } from '@/lib/format';

/** Photo de l'utilisateur, ou l'initiale de son nom s'il n'en a pas */
export default function Avatar({ src, name, className = 'avatar' }) {
  return (
    <span className={`${className} has-photo-slot`}>
      {src ? <Image src={src} alt="" fill sizes="96px" /> : initial(name)}
    </span>
  );
}
