# Testing

## Automático (`npm run test`, Vitest)
- `tests/powerups.test.ts`: duraciones, multiplicadores, escudo (máx 2), expiración, combinación.
- `tests/scoring.test.ts`: monedas/stomp con x2, bonus de tiempo, penalización por muerte, suelo 100.
- `tests/saveCodec.test.ts`: roundtrip, JSON roto → defaults, saneo de rangos.
- `tests/levels.test.ts`: 6 niveles, spawn/meta en mundo, plataformas/monedas/checkpoints,
  kinds válidos, escalado de peligro, dash en N3.

## Manual / playtesting (obligatorio por cambio de gameplay)
1. `npm run dev` → abrir http://localhost:8080.
2. Consola sin errores.
3. N1: moverse, salto variable, recoger botas, checkpoint, faro → N2.
4. N2: stomp walker, pincho quita vida, corazón.
5. N3: pluma (doble salto), dash con SHIFT, plataforma móvil.
6. Pausa (P), reanudar, reiniciar, salir. Mute (M) persiste.
7. Game over (perder 3 vidas) → reintentar. N6 → Victory.
8. Táctil: emular móvil, botones ◀ ▶ ⤒ 💨.
9. `window.__2dilesz()` en consola devuelve snapshot `level/score/lives/coins/player/powers`.
10. `npm run build && npm run preview` y repetir 2-7 en el build.

## CI
GitHub Actions: install → typecheck → lint → test → build.
