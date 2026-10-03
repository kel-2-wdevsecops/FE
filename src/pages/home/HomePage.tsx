import type { ReactNode } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { MetaList } from '@/components/ui/MetaList';
import { Spinner } from '@/components/ui/Spinner';
import { useHealth } from '@/hooks/useHealth';
import { APP_VERSION } from '@/lib/appVersion';
import { formatDuration } from '@/lib/format';

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 rounded-xl border border-line bg-white px-[18px] pt-4 pb-5">
      <h2 className="m-0 text-[14px] font-semibold tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

/** Beranda: status sistem (FE & BE). Titik awal dasbor penjualan nanti. */
export function HomePage() {
  const health = useHealth();

  return (
    <>
      <PageHeader title="Beranda" subtitle="Status aplikasi web dan API" />

      <div className="grid gap-3.5 md:grid-cols-2">
        <Card title="API">
          {health.isLoading ? (
            <Spinner compact />
          ) : (
            <MetaList
              rows={[
                {
                  key: 'Status',
                  value: health.data ? (
                    <Badge className="border-green-200 bg-green-50 text-green-700">Sehat</Badge>
                  ) : (
                    <Badge className="border-red-200 bg-red-50 text-red-700">Tidak terjangkau</Badge>
                  ),
                },
                { key: 'Versi', value: health.data ? `v${health.data.version}` : '—' },
                { key: 'Berjalan', value: health.data ? formatDuration(health.data.uptime) : '—' },
              ]}
            />
          )}
        </Card>

        <Card title="Aplikasi web">
          <MetaList
            rows={[
              { key: 'Versi', value: `v${APP_VERSION}` },
              { key: 'Mode', value: import.meta.env.DEV ? 'Pengembangan' : 'Produksi' },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
