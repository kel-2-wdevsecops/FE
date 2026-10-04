import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/useUiStore';
import { MenuIcon } from './icons';
import { MobileSidebarOverlay } from './MobileSidebarOverlay';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  return (
    <div className="flex min-h-screen items-stretch bg-canvas">
      <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      <MobileSidebarOverlay />
      <main className="min-w-0 flex-1 px-4 pt-[22px] pb-11 sm:px-6">
        <div className="mb-3.5 flex items-center gap-2.5 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Buka menu"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-ink-soft hover:bg-line-soft"
          >
            <MenuIcon />
          </button>
          <span className="truncate text-[14px] font-medium text-ink">Axon Sales</span>
        </div>
        {/* `key={pathname}` memaksa remount tiap pindah halaman, supaya animasi
            `animate-ams-in` terpicu ulang. */}
        <div key={pathname} className="mx-auto flex w-full max-w-[1360px] animate-ams-in flex-col gap-3.5">
          {children}
        </div>
      </main>
    </div>
  );
}
