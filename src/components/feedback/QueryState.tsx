import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

interface QueryStateProps {
  isLoading: boolean;
  isError?: boolean;
  children: ReactNode;
}

export function QueryState({ isLoading, isError, children }: QueryStateProps) {
  if (isLoading) return <Spinner />;
  if (isError) return <EmptyState dashed>Gagal memuat data. Coba muat ulang halaman.</EmptyState>;
  return <>{children}</>;
}
