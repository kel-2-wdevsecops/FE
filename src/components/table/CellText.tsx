import { cn } from '@/lib/cn';

interface CellTextProps {
  value: string;
  sub?: string;
  strong?: boolean;
  muted?: boolean;
  align?: 'left' | 'right';
  title?: string;
}

export function CellText({ value, sub, strong, muted, align = 'left', title }: CellTextProps) {
  return (
    <span className={cn('flex min-w-0 flex-col gap-px', align === 'right' && 'items-end')}>
      <span
        title={title ?? value}
        className={cn(
          'tnum truncate text-[13.5px]',
          strong && 'font-medium',
          muted ? 'text-ink-muted' : 'text-ink',
        )}
      >
        {value}
      </span>
      {sub && <span className="tnum truncate text-[12px] text-ink-muted">{sub}</span>}
    </span>
  );
}
