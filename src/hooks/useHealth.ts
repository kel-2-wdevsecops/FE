import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { queryKeys } from '@/api/queryKeys';

/** Status & versi BE (GET /health). Dipakai Beranda. */
export const useHealth = () =>
  useQuery({ queryKey: queryKeys.health, queryFn: api.health, retry: false });
