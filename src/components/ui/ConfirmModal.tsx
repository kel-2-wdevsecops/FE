import { Button } from './Button';
import { Modal } from './Modal';
import { useConfirmStore } from '@/store/useConfirmStore';

/** Dirender sekali di root aplikasi; dipicu lewat `confirmAction()`. */
export function ConfirmModal() {
  const { isOpen, title, message, confirmLabel, variant, answer } = useConfirmStore();
  if (!isOpen) return null;

  return (
    <Modal onClose={() => answer(false)} width={360}>
      <div className="flex flex-col gap-3">
        <div className="text-[15px] font-semibold tracking-[-0.01em]">{title}</div>
        <p className="m-0 text-[13.5px] leading-relaxed text-ink-soft text-pretty">{message}</p>
        <div className="flex justify-end gap-2">
          <Button size="md" onClick={() => answer(false)}>
            Batal
          </Button>
          <Button variant={variant} size="md" onClick={() => answer(true)}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
