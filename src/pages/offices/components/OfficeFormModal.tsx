import { Modal } from '@/components/ui/Modal';
import { useOffice } from '@/hooks/useOffices';
import { useUiStore } from '@/store/useUiStore';
import { OfficeForm } from './OfficeForm';

/** Modal buat/ubah kantor — dipasang global di `GlobalOverlays`, dibuka lewat `setOfficeFormTarget`. */
export function OfficeFormModal() {
  const target = useUiStore((s) => s.officeFormTarget);
  const setTarget = useUiStore((s) => s.setOfficeFormTarget);

  const editing = Boolean(target?.id);
  // Data ubah diambil per kode dari server; modal tertutup = nol request.
  const { data: office } = useOffice(editing ? target!.id : undefined);

  if (!target) return null;
  if (editing && !office) return null;

  const close = () => setTarget(null);

  return (
    <Modal title={editing ? 'Ubah kantor' : 'Kantor baru'} onClose={close} width={560}>
      {/* Setelah menambah, tetap di halaman yang sama; daftar diperbarui lewat invalidasi. */}
      <OfficeForm office={office} onDone={close} onCancel={close} />
    </Modal>
  );
}
