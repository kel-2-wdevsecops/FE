import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/inputs';
import { useOfficeMutations } from '@/hooks/useOffices';
import { errorInputClass, getFieldErrors } from '@/lib/formErrors';
import type { Office, OfficeInput } from '@/types';

// Panjang maksimum = VARCHAR(n) kolom `offices` (prisma/schema.prisma di BE).
const MAX: Record<keyof OfficeInput, number> = {
  officeCode: 10,
  city: 50,
  phone: 50,
  addressLine1: 50,
  addressLine2: 50,
  state: 50,
  country: 50,
  postalCode: 15,
  territory: 10,
};

const REQUIRED: (keyof OfficeInput)[] = ['officeCode', 'city', 'phone', 'addressLine1', 'country', 'postalCode', 'territory'];

interface OfficeFormProps {
  office?: Office;
  onDone: () => void;
  onCancel: () => void;
}

/** Contoh acuan form: draft lokal, validasi ringan di FE, error 422 BE per field. */
export function OfficeForm({ office, onDone, onCancel }: OfficeFormProps) {
  const { create, update } = useOfficeMutations();
  const [draft, setDraft] = useState<OfficeInput>({
    officeCode: office?.officeCode ?? '',
    city: office?.city ?? '',
    phone: office?.phone ?? '',
    addressLine1: office?.addressLine1 ?? '',
    addressLine2: office?.addressLine2 ?? '',
    state: office?.state ?? '',
    country: office?.country ?? '',
    postalCode: office?.postalCode ?? '',
    territory: office?.territory ?? '',
  });

  // Nama field FE = nama field BE, jadi key error 422 bisa dipakai langsung.
  const fieldErrors = getFieldErrors(office ? update.error : create.error);
  const busy = create.isPending || update.isPending;
  const incomplete = REQUIRED.some((key) => !draft[key].trim());

  const submit = async () => {
    if (office) {
      const { officeCode: _code, ...patch } = draft;
      await update.mutateAsync({ code: office.officeCode, patch });
    } else {
      await create.mutateAsync(draft);
    }
    onDone();
  };

  /** Satu isian teks yang terhubung ke draft, batas panjang, dan error BE-nya. */
  const input = (key: keyof OfficeInput, label: string, extra: { placeholder?: string; hint?: string; disabled?: boolean } = {}) => (
    <Field label={label} hint={extra.hint} error={fieldErrors[key]}>
      <TextInput
        value={draft[key]}
        maxLength={MAX[key]}
        disabled={extra.disabled}
        placeholder={extra.placeholder}
        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
        className={fieldErrors[key] ? errorInputClass : undefined}
      />
    </Field>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {input('officeCode', 'Kode kantor', {
          placeholder: '8',
          disabled: Boolean(office),
          hint: office ? 'Kode tidak bisa diubah.' : 'Unik, maksimal 10 karakter.',
        })}
        {input('city', 'Kota', { placeholder: 'Jakarta' })}
      </div>
      {input('addressLine1', 'Alamat', { placeholder: 'Jl. Sudirman No. 1' })}
      {input('addressLine2', 'Alamat baris 2', { hint: 'Opsional.' })}
      <div className="grid gap-3 sm:grid-cols-2">
        {input('state', 'Provinsi/negara bagian', { hint: 'Opsional.' })}
        {input('country', 'Negara', { placeholder: 'Indonesia' })}
        {input('postalCode', 'Kode pos', { placeholder: '10220' })}
        {input('territory', 'Wilayah', { placeholder: 'APAC' })}
      </div>
      {input('phone', 'Telepon', { placeholder: '+62 21 555 0100' })}
      <div className="mt-0.5 flex gap-2">
        <Button variant="primary" size="md" disabled={busy || incomplete} onClick={() => void submit().catch(() => {})}>
          {office ? 'Simpan perubahan' : 'Simpan kantor'}
        </Button>
        <Button size="md" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </div>
  );
}
