import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, children, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(
        'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-[14px] text-zinc-600 hover:bg-line-soft',
        className,
      )}
    >
      {children}
    </button>
  );
}
