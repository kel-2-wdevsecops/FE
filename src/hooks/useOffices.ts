import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/api';
import { queryKeys } from '@/api/queryKeys';
import { toastMutationError } from '@/lib/toastError';
import type { OfficeInput } from '@/types';

// Contoh pola hook per entity (ikuti untuk modul lain): list ber-paginasi,
// detail per id dari server, dan mutation yang meng-invalidate list + detail.

/** Halaman daftar: satu halaman per request, pencarian di server, "Tampilkan lagi". */
export function useOfficesList(search: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.officesList(search),
    queryFn: ({ pageParam }) => api.listOfficesPage({ page: pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
  });
}

/** Satu kantor (GET /offices/:code) — halaman detail & modal ubah. */
export const useOffice = (code?: string) =>
  useQuery({ queryKey: queryKeys.officeByCode(code), queryFn: () => api.getOffice(code!), enabled: Boolean(code) });

export function useOfficeMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.officesListAll });
    qc.invalidateQueries({ queryKey: queryKeys.officeByCodeAll });
  };

  return {
    create: useMutation({
      mutationFn: (input: OfficeInput) => api.createOffice(input),
      onSuccess: () => {
        invalidate();
        toast.success('Kantor ditambahkan');
      },
      onError: (err) => toastMutationError(err, 'Gagal menambahkan kantor'),
    }),
    update: useMutation({
      mutationFn: ({ code, patch }: { code: string; patch: Partial<Omit<OfficeInput, 'officeCode'>> }) =>
        api.updateOffice(code, patch),
      onSuccess: () => {
        invalidate();
        toast.success('Kantor diperbarui');
      },
      onError: (err) => toastMutationError(err, 'Gagal memperbarui kantor'),
    }),
    remove: useMutation({
      mutationFn: (code: string) => api.deleteOffice(code),
      onSuccess: () => {
        invalidate();
        toast.success('Kantor dihapus');
      },
      // 409 "masih punya karyawan" diterjemahkan lib/beMessage.ts.
      onError: (err) => toastMutationError(err, 'Gagal menghapus kantor'),
    }),
  };
}
