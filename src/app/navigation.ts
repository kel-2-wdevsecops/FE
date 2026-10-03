import type { ComponentType, SVGProps } from 'react';
import { HomeIcon, OfficeIcon, UsersNavIcon } from '@/components/layout/icons';

export interface NavEntry {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Hanya tampil untuk akun admin. Route-nya tetap dijaga di App.tsx. */
  adminOnly?: boolean;
}

/** Menu utama sidebar. Halaman daftar baru juga didaftarkan di WIDE_PATHS (AppShell). */
export const NAV: NavEntry[] = [
  { to: '/', label: 'Beranda', icon: HomeIcon },
  { to: '/kantor', label: 'Kantor', icon: OfficeIcon },
  { to: '/pengguna', label: 'Pengguna', icon: UsersNavIcon, adminOnly: true },
];
