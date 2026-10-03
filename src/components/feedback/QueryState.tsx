import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { translateBeMessage } from '@/lib/beMessage';

interface QueryStateProps {
  isLoading: boolean;
  error?: Error | null;
  children: ReactNode;
}

/** Loader / pesan gagal untuk satu query; isi baru dirender setelah data ada. */
export function QueryState({ isLoading, error, children }: QueryStateProps) {
  if (isLoading) return <Spinner />;
  if (error) {
    return <EmptyState dashed>{`Gagal memuat data: ${translateBeMessage(error.message)}`}</EmptyState>;
  }
  return <>{children}</>;
}
