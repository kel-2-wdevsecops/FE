import type { ComponentType, SVGProps } from 'react';
import { HomeIcon } from '@/components/layout/icons';

export interface NavEntry {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/** Menu sidebar: satu entri per halaman dashboard. */
export const NAV: NavEntry[] = [{ to: '/', label: 'Beranda', icon: HomeIcon }];
