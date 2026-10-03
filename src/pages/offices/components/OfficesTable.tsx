import { CellLink } from '@/components/table/CellLink';
import { CellText } from '@/components/table/CellText';
import { DataTable, type Column } from '@/components/table/DataTable';
import { TableFooterNote } from '@/components/table/TableFooterNote';
import { Button } from '@/components/ui/Button';
import { officePath } from '@/lib/entityLinks';
import type { Office } from '@/types';

const GRID = 'minmax(0,1.3fr) minmax(0,2fr) minmax(0,1.2fr) minmax(0,0.6fr) minmax(0,0.7fr)';

interface OfficesTableProps {
  offices: Office[];
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function OfficesTable({ offices, total, hasMore, isLoadingMore, onLoadMore }: OfficesTableProps) {
  const columns: Column<Office>[] = [
    {
      id: 'city',
      label: 'Kantor',
      render: (office) => (
        <CellLink label={office.city} sub={`Kode ${office.officeCode}`} to={officePath(office.officeCode)} />
      ),
    },
    {
      id: 'address',
      label: 'Alamat',
      render: (office) => <CellText value={office.addressLine1} sub={office.addressLine2 ?? undefined} muted />,
    },
    {
      id: 'country',
      label: 'Negara',
      render: (office) => <CellText value={office.country} sub={office.state ?? undefined} />,
    },
    { id: 'territory', label: 'Wilayah', render: (office) => <CellText value={office.territory} muted /> },
    {
      id: 'employees',
      label: 'Karyawan',
      align: 'right',
      render: (office) => <CellText align="right" value={`${office.employeeCount} orang`} muted />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={offices}
      rowKey={(office) => office.officeCode}
      gridTemplate={GRID}
      empty="Belum ada kantor yang cocok."
      footer={
        <TableFooterNote
          action={
            hasMore ? (
              <Button onClick={onLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? 'Memuat…' : 'Tampilkan lagi'}
              </Button>
            ) : undefined
          }
        >
          Menampilkan {offices.length} dari {total} kantor
        </TableFooterNote>
      }
    />
  );
}
