import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

export interface Column<T> {
  id: string;
  label: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
  /** Sembunyikan kolom ini dari tampilan kartu mobile (mis. kolom aksi ikon tanpa label yang berguna). */
  hideOnCard?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Nilai `grid-template-columns`; gunakan `minmax(0,…)` agar sel bisa menyusut. */
  gridTemplate: string;
  dense?: boolean;
  empty?: string;
  /** Data belum datang — tampilkan loader, bukan teks `empty` yang menyesatkan. */
  loading?: boolean;
  /** Gagal memuat — tampilkan pesan gagal, bukan teks `empty`. */
  error?: boolean;
  rowClassName?: (row: T) => string | undefined;
  renderExpanded?: (row: T) => ReactNode;
  isExpanded?: (row: T) => boolean;
  footer?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  gridTemplate,
  dense = false,
  empty = 'Tidak ada data.',
  loading = false,
  error = false,
  rowClassName,
  renderExpanded,
  isExpanded,
  footer,
  className,
}: DataTableProps<T>) {
  const padX = dense ? 'px-3' : 'px-4';
  const grid = { gridTemplateColumns: gridTemplate };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-white',
        !dense && 'animate-ams-in',
        className,
      )}
    >
      <div
        style={grid}
        className={cn(
          'hidden border-b border-line bg-canvas md:grid',
          dense ? 'gap-2 py-[7px]' : 'gap-3 py-2.5',
          padX,
        )}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn(
              'truncate font-medium tracking-[0.05em] text-ink-muted uppercase',
              dense ? 'text-[10.5px]' : 'text-[11px]',
              column.align === 'right' && 'text-right',
            )}
          >
            {column.label}
          </div>
        ))}
      </div>

      {rows.map((row) => {
        const open = isExpanded?.(row) ?? false;
        const [primary, ...rest] = columns;
        const cardRest = rest.filter((column) => !column.hideOnCard);
        return (
          <div key={rowKey(row)} className={cn('border-b border-line-soft', rowClassName?.(row))}>
            <div
              style={grid}
              className={cn('hidden items-center md:grid', dense ? 'gap-2 py-2.5' : 'gap-3 py-2.5', padX)}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={cn(
                    'flex min-w-0 items-center',
                    column.align === 'right' && 'justify-end',
                  )}
                >
                  {column.render(row)}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 p-3.5 md:hidden">
              {primary && <div className="min-w-0">{primary.render(row)}</div>}
              {cardRest.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t border-line-soft pt-2">
                  {cardRest.map((column) => (
                    <div key={column.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                      <span className="shrink-0 text-ink-faint">{column.label}</span>
                      <span className="min-w-0">{column.render(row)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {open && renderExpanded && (
              <div className={cn('animate-ams-in pb-3.5', padX)}>{renderExpanded(row)}</div>
            )}
          </div>
        );
      })}

      {rows.length === 0 &&
        (loading ? (
          <Spinner />
        ) : error ? (
          <EmptyState className="py-8">Gagal memuat data. Coba muat ulang halaman.</EmptyState>
        ) : (
          <EmptyState className="py-8">{empty}</EmptyState>
        ))}
      {footer && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 bg-canvas py-2.5',
            padX,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
