'use client';
import Image from 'next/image';
import { initial } from '@/lib/format';

export default function Thumb({ src, name, size = '' }) {
  const px = { '': 96, sm: 64, xs: 46 }[size] ?? 96;
  return (
    <span className={`thumb ${size}`}>
      <span className="ph" aria-hidden="true">{initial(name)}</span>
      {src && <Image src={src} alt={name || ''} width={px * 2} height={px * 2} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
    </span>
  );
}
