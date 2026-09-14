import { SAVE_KEY } from '../constants';
import { decodeSave, defaultSave, encodeSave, type SaveData } from '../logic/saveCodec';

/** Wrapper fino sobre localStorage. Nunca lanza. */
export const SaveService = {
  load(): SaveData {
    try {
      if (typeof localStorage === 'undefined') return defaultSave();
      return decodeSave(localStorage.getItem(SAVE_KEY));
    } catch {
      return defaultSave();
    }
  },
  store(s: SaveData): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(SAVE_KEY, encodeSave(s));
    } catch {
      /* almacenamiento no disponible: se juega sin persistencia */
    }
  },
  clear(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* noop */
    }
  },
};
