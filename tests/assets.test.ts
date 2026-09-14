import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KENNEY_FILES, TRIM_GROUPS } from '../src/game/data/kenney';

const DIR = join(process.cwd(), 'public', 'assets', 'kenney');

describe('kenney assets', () => {
  it('todos los ficheros del manifiesto existen y pesan algo', () => {
    expect(KENNEY_FILES.length).toBeGreaterThan(0);
    let total = 0;
    for (const f of KENNEY_FILES) {
      const p = join(DIR, f.file);
      expect(existsSync(p), `falta ${f.file}`).toBe(true);
      const size = statSync(p).size;
      expect(size).toBeGreaterThan(100);
      total += size;
    }
    expect(total).toBeLessThan(500 * 1024);
  });

  it('sin claves duplicadas y grupos de trim coherentes', () => {
    const keys = KENNEY_FILES.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
    const known = new Set(keys);
    for (const g of TRIM_GROUPS) {
      expect(g.srcKeys.length).toBe(g.outKeys.length);
      for (const s of g.srcKeys) expect(known.has(s), `trim sin fuente: ${s}`).toBe(true);
    }
    const covered = new Set(TRIM_GROUPS.flatMap((g) => g.srcKeys));
    expect(covered.size).toBe(keys.length);
  });
});
