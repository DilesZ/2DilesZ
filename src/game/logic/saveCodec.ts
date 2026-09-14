export interface SaveData {
  version: 1;
  unlocked: number;
  best: Record<number, number>;
  totalBest: number;
  muted: boolean;
  shake: boolean;
  dashUnlocked: boolean;
}

export function defaultSave(): SaveData {
  return {
    version: 1,
    unlocked: 1,
    best: {},
    totalBest: 0,
    muted: false,
    shake: true,
    dashUnlocked: false,
  };
}

export function sanitizeSave(raw: unknown): SaveData {
  const d = defaultSave();
  if (typeof raw !== 'object' || raw === null) return d;
  const r = raw as Partial<SaveData>;
  const unlocked = typeof r.unlocked === 'number' ? Math.min(6, Math.max(1, Math.floor(r.unlocked))) : 1;
  const best: Record<number, number> = {};
  if (r.best && typeof r.best === 'object') {
    for (const [k, v] of Object.entries(r.best)) {
      const id = Number(k);
      if (Number.isInteger(id) && id >= 1 && id <= 6 && typeof v === 'number' && v >= 0) {
        best[id] = Math.floor(v);
      }
    }
  }
  return {
    version: 1,
    unlocked,
    best,
    totalBest: typeof r.totalBest === 'number' && r.totalBest >= 0 ? Math.floor(r.totalBest) : 0,
    muted: r.muted === true,
    shake: r.shake !== false,
    dashUnlocked: r.dashUnlocked === true,
  };
}

export function encodeSave(s: SaveData): string {
  return JSON.stringify(s);
}

export function decodeSave(text: string | null): SaveData {
  if (!text) return defaultSave();
  try {
    return sanitizeSave(JSON.parse(text));
  } catch {
    return defaultSave();
  }
}
