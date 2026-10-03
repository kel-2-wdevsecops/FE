import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUiStore } from '@/store/useUiStore';

/** Backdrop untuk drawer sidebar mobile — klik luar/Escape untuk tutup. */
export function MobileSidebarOverlay() {
  const open = useUiStore((s) => s.mobileSidebarOpen);
  const setOpen = useUiStore((s) => s.setMobileSidebarOpen);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={() => setOpen(false)}
      aria-hidden="true"
      className="fixed inset-0 z-60 animate-ams-fade bg-zinc-950/40 md:hidden"
    />,
    document.body,
  );
}
