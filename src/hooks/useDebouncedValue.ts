import { useEffect, useState } from 'react';

/** Tunda nilai berubah sampai `delay` ms tanpa perubahan lagi — dipakai supaya
 * kotak pencarian tidak mengirim satu request per ketikan ke server. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
