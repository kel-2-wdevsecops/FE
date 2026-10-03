import { create } from 'zustand';

/**
 * State UI sementara (TIDAK di-persist): drawer sidebar mobile, dan nanti
 * teks pencarian per halaman serta target modal buat/ubah tiap entity.
 * Overlay baru -> tambah field `xTarget` + setter di sini, dan reset di
 * `resetOverlays`; jangan bikin store baru per overlay.
 */
interface UiState {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  /** Tutup semua panel/modal — dipanggil GlobalOverlays saat pindah halaman. */
  resetOverlays: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  resetOverlays: () => set({ mobileSidebarOpen: false }),
}));
