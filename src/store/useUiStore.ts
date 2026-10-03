import { create } from 'zustand';

/**
 * State UI sementara (TIDAK di-persist): teks pencarian per halaman, target
 * modal buat/ubah tiap entity, dan drawer sidebar mobile.
 * Overlay baru -> tambah field `xTarget` + setter di sini, dan reset di
 * `resetOverlays`; jangan bikin store baru per overlay.
 */
export type PageKey = 'users';

/** Target modal buat/ubah: null = tertutup, {} = buat baru, { id } = ubah. */
export type FormTarget = { id?: string } | null;

interface UiState {
  /** Teks pencarian per halaman daftar (bertahan saat pindah halaman). */
  search: Record<PageKey, string>;
  setSearch: (page: PageKey, value: string) => void;

  userFormTarget: FormTarget;
  setUserFormTarget: (target: FormTarget) => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  /** Tutup semua panel/modal — dipanggil GlobalOverlays saat pindah halaman. */
  resetOverlays: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  search: { users: '' },
  setSearch: (page, value) => set((s) => ({ search: { ...s.search, [page]: value } })),

  userFormTarget: null,
  setUserFormTarget: (target) => set({ userFormTarget: target }),

  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  resetOverlays: () => set({ mobileSidebarOpen: false, userFormTarget: null }),
}));
