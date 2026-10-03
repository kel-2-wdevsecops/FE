import { describe, expect, it } from 'vitest';
import { registerBeMessages, translateBeMessage } from './beMessage';

describe('translateBeMessage', () => {
  it('menerjemahkan pesan bawaan', () => {
    expect(translateBeMessage('Too many requests. Please try again later.')).toMatch(/Terlalu banyak/);
  });

  it('pesan yang belum dikenal dikembalikan apa adanya', () => {
    expect(translateBeMessage('Something new.')).toBe('Something new.');
  });

  it('mendukung terjemahan tambahan berpola', () => {
    registerBeMessages({}, [[/^Thing has (\d+) item\(s\)\.$/, (m) => `Masih ada ${m[1]} item.`]]);
    expect(translateBeMessage('Thing has 6 item(s).')).toBe('Masih ada 6 item.');
  });
});
