import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white border border-transparent hover:bg-accent-hover',
  secondary: 'bg-white text-zinc-900 border border-line hover:bg-line-soft',
  ghost: 'bg-transparent text-ink-soft border border-transparent hover:bg-line-soft',
  danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-[12px] rounded-[7px]',
  sm: 'px-3 py-1.5 text-[12.5px] rounded-lg',
  md: 'px-3.5 py-2 text-[13.5px] rounded-[9px]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Kalau diisi, dirender sebagai `<a target="_blank">` (buka tab baru) alih-alih `<button>` navigasi SPA. */
  href?: string;
}

export function Button({
  variant = 'secondary',
  size = 'sm',
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const cls = cn(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...rest} className={cls}>
      {children}
    </button>
  );
}
