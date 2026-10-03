// Format tampilan (fungsi murni, tanpa efek samping UI).

const dateTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

/** "3 Okt 2026, 16.20" dari ISO string; '—' kalau kosong atau tidak valid. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : dateTime.format(date);
}

/** "1 j 5 m" dari detik; dipakai untuk uptime server. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3_600);
  const m = Math.floor((s % 3_600) / 60);
  if (d) return `${d} h ${h} j`;
  if (h) return `${h} j ${m} m`;
  return `${m} m`;
}

/** Inisial avatar: "Diane Murphy" -> "DM", "admin" -> "A". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}
