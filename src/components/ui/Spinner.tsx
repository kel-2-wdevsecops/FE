import { cn } from '@/lib/cn';

/** `compact` = tanpa ruang kosong besar, untuk di dalam popup/baris kecil. */
export function Spinner({
  label = 'Memuat…',
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-ink-muted',
        compact ? 'py-1 text-[11.5px]' : 'px-4 py-8 text-[13px]',
      )}
    >
      <span className="size-3 animate-spin rounded-full border-2 border-line border-t-zinc-500" />
      {label}
    </div>
  );
}
