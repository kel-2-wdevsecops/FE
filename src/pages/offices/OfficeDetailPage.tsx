import { useNavigate, useParams } from 'react-router-dom';
import { QueryState } from '@/components/feedback/QueryState';
import { DetailPageLayout } from '@/components/layout/DetailPageLayout';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { MetaList } from '@/components/ui/MetaList';
import { MoreActionsButton } from '@/components/ui/MoreActionsButton';
import { useIsAdmin } from '@/hooks/useCurrentUser';
import { useOffice, useOfficeMutations } from '@/hooks/useOffices';
import { confirmAction } from '@/store/useConfirmStore';
import { useUiStore } from '@/store/useUiStore';

/** Detail kantor — murni tampilan; ubah lewat `OfficeFormModal`. Contoh acuan halaman detail. */
export function OfficeDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const query = useOffice(code);
  const { remove } = useOfficeMutations();
  const office = query.data;

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError}>
      {office && (
        <DetailPageLayout
          title={office.city}
          code={`Kode ${office.officeCode}`}
          backTo="/kantor"
          actions={
            isAdmin && (
              <DropdownMenu
                trigger={<MoreActionsButton />}
                items={[
                  {
                    label: 'Ubah',
                    onClick: () => useUiStore.getState().setOfficeFormTarget({ id: office.officeCode }),
                  },
                  {
                    label: 'Hapus kantor',
                    danger: true,
                    onClick: async () => {
                      const ok = await confirmAction(`Hapus kantor ${office.city} (kode ${office.officeCode})?`, {
                        title: 'Hapus kantor',
                      });
                      if (!ok) return;
                      // Tunggu hasilnya dulu: BE menolak (409) kantor yang masih punya karyawan.
                      remove.mutate(office.officeCode, { onSuccess: () => navigate('/kantor') });
                    },
                  },
                ]}
              />
            )
          }
        >
          <MetaList
            rows={[
              {
                key: 'Alamat',
                value: [office.addressLine1, office.addressLine2].filter(Boolean).join(', '),
              },
              { key: 'Kota', value: office.city },
              { key: 'Provinsi/negara bagian', value: office.state ?? '—' },
              { key: 'Negara', value: office.country },
              { key: 'Kode pos', value: office.postalCode },
              { key: 'Wilayah', value: office.territory },
              { key: 'Telepon', value: office.phone },
              { key: 'Karyawan', value: `${office.employeeCount} orang` },
            ]}
          />
        </DetailPageLayout>
      )}
    </QueryState>
  );
}
