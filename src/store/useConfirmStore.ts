import { create } from 'zustand';

interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'danger' | 'primary';
  resolve: ((value: boolean) => void) | null;
  confirm: (message: string, opts?: ConfirmOptions) => Promise<boolean>;
  answer: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  title: 'Konfirmasi',
  message: '',
  confirmLabel: 'Hapus',
  variant: 'danger',
  resolve: null,

  confirm: (message, opts) => {
    set({
      isOpen: true,
      message,
      title: opts?.title ?? 'Konfirmasi',
      confirmLabel: opts?.confirmLabel ?? 'Hapus',
      variant: opts?.variant ?? 'danger',
    });
    return new Promise((resolve) => set({ resolve }));
  },

  answer: (value) => {
    get().resolve?.(value);
    set({ isOpen: false, resolve: null });
  },
}));

/** Modal konfirmasi global berbasis promise — `if (await confirmAction('Hapus X?')) { ... }`. */
export const confirmAction = (message: string, opts?: ConfirmOptions) =>
  useConfirmStore.getState().confirm(message, opts);
