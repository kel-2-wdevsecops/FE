import { describe, expect, it } from 'vitest';
import { formatDateTime, formatDuration, initials } from './format';

describe('formatDateTime', () => {
  it('kosong atau tidak valid menjadi tanda pisah', () => {
    expect(formatDateTime(null)).toBe('—');
    expect(formatDateTime('bukan tanggal')).toBe('—');
  });

  it('memformat tanggal ISO', () => {
    expect(formatDateTime('2026-10-03T09:00:00.000Z')).toMatch(/2026/);
  });
});

describe('formatDuration', () => {
  it.each([
    [59, '0 m'],
    [3_900, '1 j 5 m'],
    [90_000, '1 h 1 j'],
    [-5, '0 m'],
  ])('%s detik -> %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});

describe('initials', () => {
  it.each([
    ['Diane Murphy', 'DM'],
    ['admin', 'A'],
    ['  mary  ann  smith ', 'MA'],
  ])('%s -> %s', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
