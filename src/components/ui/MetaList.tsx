import type { ReactNode } from 'react';

export interface MetaRow {
  key: string;
  value: ReactNode;
}

export function MetaList({ rows }: { rows: MetaRow[] }) {
  return (
    <dl className="flex flex-col gap-px">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex items-baseline gap-3 border-b border-line-soft py-[7px]"
        >
          <dt className="w-[132px] shrink-0 text-[12.5px] text-ink-muted">{row.key}</dt>
          <dd className="min-w-0 flex-1 text-[13.5px]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
