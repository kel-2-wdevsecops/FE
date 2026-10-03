import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label: string;
  hint?: string;
  /** Pesan error field (mis. dari validasi 422 BE) — menggantikan hint saat ada. */
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, error, children, className }: FieldProps) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-[12.5px] text-ink-muted">{label}</span>
      {children}
      {error ? (
        <span className="text-[11.5px] text-red-600">{error}</span>
      ) : (
        hint && <span className="text-[11.5px] text-ink-faint">{hint}</span>
      )}
    </label>
  );
}
