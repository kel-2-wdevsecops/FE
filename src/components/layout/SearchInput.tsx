interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-w-0 flex-1 rounded-[9px] border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-ink-faint md:w-[248px] md:flex-none"
    />
  );
}
