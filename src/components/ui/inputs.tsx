import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const base =
  'w-full min-w-0 rounded-[9px] border border-line bg-white px-2.5 py-2 text-[13.5px] text-ink outline-none focus:border-ink-faint disabled:bg-line-soft disabled:text-ink-muted';

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(base, className)} />;
}

export interface SelectOption {
  value: string;
  label: string;
}

/** `<select>` bawaan browser dengan gaya yang sama dengan TextInput. Dibungkus `Field`. */
export function SelectInput({
  options,
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }) {
  return (
    <select {...rest} className={cn(base, 'cursor-pointer', className)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
