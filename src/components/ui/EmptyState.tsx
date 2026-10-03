import { cn } from '@/lib/cn';

interface EmptyStateProps {
  children: string;
  dashed?: boolean;
  className?: string;
}

export function EmptyState({ children, dashed = false, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'px-4 py-6 text-center text-[13px] text-ink-muted',
        dashed && 'rounded-[10px] border border-dashed border-line',
        className,
      )}
    >
      {children}
    </div>
  );
}
