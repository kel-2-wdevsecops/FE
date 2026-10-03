import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface CellLinkProps {
  label: string;
  sub?: string;
  /** Path halaman detail (navigasi SPA). Ambil dari `lib/entityLinks.ts`. */
  to: string;
  /** Untuk teks panjang: tampil sampai dua baris, bukan dipotong satu baris. */
  multiline?: boolean;
}

/** Sel pertama tabel daftar: nama entity yang menuju halaman detailnya. */
export function CellLink({ label, sub, to, multiline = false }: CellLinkProps) {
  return (
    <span className="flex min-w-0 flex-col gap-px">
      <Link
        to={to}
        title={label}
        className={cn(
          'block max-w-full text-left text-[13.5px] font-medium text-ink underline decoration-zinc-300 decoration-1 underline-offset-[3px] hover:text-ink hover:decoration-zinc-500',
          multiline ? 'line-clamp-2 text-pretty' : 'truncate',
        )}
      >
        {label}
      </Link>
      {sub && <span className="truncate text-[12px] text-ink-muted">{sub}</span>}
    </span>
  );
}
