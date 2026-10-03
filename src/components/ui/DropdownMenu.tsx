import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
}

/** Trigger + menu titik-tiga: klik trigger untuk buka, klik luar/Escape untuk tutup. */
export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const updatePos = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 200;
      const rawLeft = align === 'right' ? rect.right - menuWidth : rect.left;
      const left = Math.max(8, Math.min(rawLeft, window.innerWidth - menuWidth - 8));
      setPos({ top: rect.bottom + 6, left });
    };
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open, align]);

  return (
    <>
      <div ref={triggerRef} onClick={() => setOpen((v) => !v)} className="inline-flex">
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: 200 }}
            className="fixed z-70 animate-ams-in overflow-hidden rounded-[10px] border border-line bg-white p-1 shadow-[0_16px_40px_rgba(9,9,11,0.16)]"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  setOpen(false);
                  item.onClick();
                }}
                className={cn(
                  'block w-full cursor-pointer rounded-[7px] border-none bg-transparent px-2.5 py-2 text-left text-[13.5px] transition-colors hover:bg-line-soft',
                  item.danger ? 'text-red-600' : 'text-ink',
                  item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
