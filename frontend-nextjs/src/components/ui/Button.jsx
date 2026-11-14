import Link from 'next/link';

export default function Button({ variant = 'gold', size, block, href, loading, className = '', children, ...props }) {
  const base = ['ghost', 'ok', 'danger'].includes(variant) ? `btn-${variant}` : `btn btn-${variant}`;
  const cls = [base, size === 'sm' && 'btn-sm', block && 'btn-block', loading && 'loading', className].filter(Boolean).join(' ');

  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} disabled={loading || props.disabled} {...props}>
      {children}
    </button>
  );
}
