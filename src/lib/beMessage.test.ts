import { describe, expect, it } from 'vitest';
import { translateBeMessage } from './beMessage';

describe('translateBeMessage', () => {
  it('menerjemahkan pesan yang dikenal', () => {
    expect(translateBeMessage('Too many requests. Please try again later.')).toMatch(/Terlalu banyak/);
    expect(translateBeMessage('Invalid email or password.')).toBe('Email atau kata sandi salah.');
  });

  it('pesan yang belum dikenal dikembalikan apa adanya', () => {
    expect(translateBeMessage('Something new.')).toBe('Something new.');
  });
});
