import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Izinkan teks membungkus ke dua baris (dipakai di tabel padat). */
  wrap?: boolean;
  title?: string;
}

export function Badge({ children, className, wrap = false, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-block max-w-full rounded-full border px-2.5 py-[3px] text-[11.5px] leading-[1.3] font-medium',
        wrap ? 'break-words whitespace-normal' : 'truncate whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  );
}
