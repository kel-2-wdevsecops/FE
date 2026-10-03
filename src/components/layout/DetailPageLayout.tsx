import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface DetailPageLayoutProps {
  title: string;
  code?: string;
  badge?: ReactNode;
  /** Tujuan tombol kembali. Kosongkan untuk `navigate(-1)` (riwayat browser). */
  backTo?: string;
  backLabel?: string;
  /** Aksi di kepala halaman, mis. menu titik tiga atau tombol Ubah/Simpan. */
  actions?: ReactNode;
  /** Konten bebas (mis. kartu info/ringkasan) di antara judul dan kartu tab — selalu tampil terlepas dari tab yang aktif. */
  aboveTabs?: ReactNode;
  /** Baris tab (mis. `<Tabs />`) — dirender rata di tepi atas kartu, di atas padding konten. */
  tabs?: ReactNode;
  children: ReactNode;
}

/**
 * Bingkai halaman detail entity — pengganti `Drawer`/`DrawerHeader` sekarang
 * setiap entity (aset/laporan/penanganan/pengguna/jadwal) adalah halaman
 * dengan URL sendiri, bukan panel overlay. Meniru tipografi `PageHeader`
 * (judul h1) dan bingkai kartu `DetailCard` supaya terasa konsisten dengan
 * sisa app, tapi tanpa asumsi "duduk di sebelah tabel" seperti `DetailCard`.
 */
export function DetailPageLayout({
  title,
  code,
  badge,
  backTo,
  backLabel = 'Kembali',
  actions,
  aboveTabs,
  tabs,
  children,
}: DetailPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex animate-ams-in flex-col gap-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="mb-1.5 cursor-pointer text-[12.5px] text-zinc-600 hover:text-ink"
          >
            ‹ {backLabel}
          </button>
          <h1 className="m-0 text-[20px] font-semibold tracking-[-0.015em] text-pretty">{title}</h1>
          {(badge || code) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
              {badge}
              {code && <span className="tnum text-[13px] text-ink-muted">{code}</span>}
            </div>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {aboveTabs}

      <div className="overflow-clip rounded-xl border border-line bg-white">
        {tabs}
        <div className="flex flex-col gap-[18px] px-[18px] pt-4 pb-5">{children}</div>
      </div>
    </div>
  );
}
