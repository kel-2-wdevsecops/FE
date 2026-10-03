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
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {/* Hint/error sengaja di luar <label>: di dalamnya, teks itu ikut menjadi
          nama aksesibel isian ("Kode kantor Unik, maksimal 10 karakter."). */}
      <label className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[12.5px] text-ink-muted">{label}</span>
        {children}
      </label>
      {error ? (
        <span role="alert" className="text-[11.5px] text-red-600">
          {error}
        </span>
      ) : (
        hint && <span className="text-[11.5px] text-ink-faint">{hint}</span>
      )}
    </div>
  );
}
