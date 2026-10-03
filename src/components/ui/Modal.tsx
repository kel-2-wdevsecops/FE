import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './IconButton';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  width?: number;
  /** Kalau diisi, dirender sebagai baris kepala (judul + tombol tutup) di atas konten. */
  title?: string;
}

let openModalCount = 0;

export function Modal({ onClose, children, width = 480, title }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Kunci scroll body selama modal terbuka — tanpa ini, wheel/touch masih
  // bisa menggulir halaman DI BELAKANG modal (elemen `fixed` di atasnya cuma
  // menutupi secara visual, tidak otomatis mematikan scroll dokumen).
  // Counter modul (bukan langsung set/reset overflow) supaya modal yang
  // bertumpuk — mis. `ConfirmModal` muncul di atas modal lain — tidak saling
  // menimpa: scroll cuma dibuka lagi kalau modal TERAKHIR sudah tertutup.
  useEffect(() => {
    if (openModalCount === 0) document.body.style.overflow = 'hidden';
    openModalCount += 1;
    return () => {
      openModalCount -= 1;
      if (openModalCount === 0) document.body.style.overflow = '';
    };
  }, []);

  // Di-portal ke document.body — sama seperti dropdown Select — supaya
  // `fixed inset-0` di bawah ini betul-betul menutupi seluruh viewport,
  // bukan cuma dibatasi ke ukuran leluhur terdekatnya. Kalau tidak
  // di-portal, leluhur mana pun yang kebetulan punya `transform` (mis.
  // animasi fade-in halaman di AppShell) otomatis jadi containing block
  // baru untuk elemen `position: fixed` di dalamnya — modal jadi cuma
  // menutupi area <main>, bukan seluruh layar termasuk sidebar.
  return createPortal(
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-ams-fade bg-zinc-950/40"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ width }}
        className="relative flex max-h-[85vh] w-full max-w-full animate-ams-in flex-col overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_24px_60px_rgba(9,9,11,0.2)]"
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line-soft px-5 py-3.5">
            <div className="text-[16px] font-semibold tracking-[-0.01em]">{title}</div>
            <IconButton label="Tutup" onClick={onClose}>
              ✕
            </IconButton>
          </div>
        )}
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
