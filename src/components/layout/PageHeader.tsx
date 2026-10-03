import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end gap-3.5">
      <div className="min-w-[180px] flex-1">
        <h1 className="m-0 text-[20px] font-semibold tracking-[-0.015em]">{title}</h1>
        <div className="mt-[3px] text-[13px] text-ink-muted">{subtitle}</div>
      </div>
      {children}
    </header>
  );
}
