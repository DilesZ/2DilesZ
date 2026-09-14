import { describe, expect, it } from 'vitest';
import { decodeSave, defaultSave, encodeSave, sanitizeSave } from '../src/game/logic/saveCodec';

describe('saveCodec', () => {
  it('roundtrip conserva datos', () => {
    const s = { ...defaultSave(), unlocked: 4, totalBest: 1234, muted: true };
    expect(decodeSave(encodeSave(s))).toEqual(s);
  });

  it('null o JSON roto → defaults', () => {
    expect(decodeSave(null)).toEqual(defaultSave());
    expect(decodeSave('{{{')).toEqual(defaultSave());
  });

  it('sanea valores fuera de rango', () => {
    const s = sanitizeSave({ unlocked: 99, best: { 1: 100, 7: 5, 2: -3 }, totalBest: -5 });
    expect(s.unlocked).toBe(6);
    expect(s.best).toEqual({ 1: 100 });
    expect(s.totalBest).toBe(0);
  });
});
