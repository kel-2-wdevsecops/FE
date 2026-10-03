import type { ReactNode } from 'react';

export function TableFooterNote({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <>
      <span className="text-[12.5px] text-ink-muted">{children}</span>
      {action}
    </>
  );
}
