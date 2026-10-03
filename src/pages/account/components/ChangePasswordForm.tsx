import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/inputs';
import { useChangePassword } from '@/hooks/useAuth';
import { errorInputClass, getFieldErrors } from '@/lib/formErrors';

// Sama dengan PasswordSchema di BE (auth.dto.ts).
const MIN_LENGTH = 8;

const EMPTY = { current: '', next: '', confirm: '' };

export function ChangePasswordForm() {
  const change = useChangePassword();
  const [draft, setDraft] = useState(EMPTY);

  const set = (key: keyof typeof EMPTY, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  // Key error 422 = nama field BE (current_password/new_password), di-remap ke draft.
  const beErrors = getFieldErrors(change.error);
  const errors = {
    current: beErrors.current_password,
    next:
      beErrors.new_password ??
      (draft.next && draft.next.length < MIN_LENGTH ? `Minimal ${MIN_LENGTH} karakter.` : undefined),
    confirm: draft.confirm && draft.confirm !== draft.next ? 'Tidak sama dengan kata sandi baru.' : undefined,
  };
  const canSubmit =
    !change.isPending && Boolean(draft.current) && draft.next.length >= MIN_LENGTH && draft.confirm === draft.next;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await change.mutateAsync({ current: draft.current, next: draft.next });
    setDraft(EMPTY);
  };

  return (
    <form onSubmit={(e) => void submit(e).catch(() => {})} noValidate className="flex max-w-[380px] flex-col gap-3">
      <Field label="Kata sandi saat ini" error={errors.current}>
        <TextInput
          type="password"
          autoComplete="current-password"
          value={draft.current}
          onChange={(e) => set('current', e.target.value)}
          className={errors.current ? errorInputClass : undefined}
        />
      </Field>
      <Field label="Kata sandi baru" hint={`Minimal ${MIN_LENGTH} karakter.`} error={errors.next}>
        <TextInput
          type="password"
          autoComplete="new-password"
          value={draft.next}
          onChange={(e) => set('next', e.target.value)}
          className={errors.next ? errorInputClass : undefined}
        />
      </Field>
      <Field label="Ulangi kata sandi baru" error={errors.confirm}>
        <TextInput
          type="password"
          autoComplete="new-password"
          value={draft.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          className={errors.confirm ? errorInputClass : undefined}
        />
      </Field>
      <div>
        <Button type="submit" variant="primary" size="md" disabled={!canSubmit}>
          {change.isPending ? 'Menyimpan…' : 'Ganti kata sandi'}
        </Button>
      </div>
    </form>
  );
}
