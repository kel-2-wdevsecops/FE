import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OfficeFormModal } from '@/pages/offices/components/OfficeFormModal';
import { UserFormModal } from '@/pages/users/components/UserFormModal';
import { useUiStore } from '@/store/useUiStore';

/**
 * Titik pemasangan modal global: semua `<Entity>FormModal` dipasang SEKALI di
 * sini dan dibuka lewat target di useUiStore (`setXFormTarget`). Melihat
 * detail entity tetap halaman ber-URL sendiri; buat/ubah lewat modal.
 */
export function GlobalOverlays() {
  // Tanpa ini, modal yang dibuka di satu halaman ikut terbawa ke halaman
  // berikutnya. `useLayoutEffect` supaya dibersihkan sebelum halaman baru
  // sempat digambar.
  const { pathname } = useLocation();
  const resetOverlays = useUiStore((s) => s.resetOverlays);
  useLayoutEffect(() => resetOverlays(), [pathname, resetOverlays]);

  return (
    <>
      <OfficeFormModal />
      <UserFormModal />
    </>
  );
}
