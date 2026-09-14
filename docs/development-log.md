# Development log

## 2026-09-14 — Auditoría (FASE 0)
- Objetivo: repo `https://github.com/DilesZ/2DilesZ.git` existe pero **vacío** (sin ramas/commits/código).
- Local `Downloads/owa` NO es el repo del juego (docs Agent365 + git sin commits ni remote). No se toca.
- Entorno: Node v24.13.0, npm 11.6.2, git 2.52, sin Vercel CLI ni gh CLI.
- Decisión: clonar repo vacío en `Downloads/2DilesZ-game` (evita git anidado) y construir ahí.
- Archivos afectados: ninguno (solo lectura + `git ls-remote`).

## 2026-09-14 — Decisiones (FASE 1)
- Usuario: género **plataformas**, estilo **pixel-retro**, **desktop+móvil**,
  **instalar skills**, **instalar Vercel CLI y desplegar**.
- No se pregunta más: resto de decisiones las toma el equipo (autorizado).

## 2026-09-14 — Stack (FASE 2)
- Investigación: template oficial `phaserjs/template-vite-ts` (MIT, Phaser 3.90 + Vite 6 + TS 5.7).
- Decisión: Phaser 3.90 (estable) + TS + Vite, sin React, assets/audio procedurales,
  `dist/` estático → Vercel. Phaser 4 descartado por ecosistema menos maduro.

## 2026-09-14 — Skills (FASE 3)
- Instaladas y verificadas (`npx skills list`): `game-development`, `2d-games`, `game-design`,
  `tdd`, `web-design-guidelines` (todas de `sickn33/agentic-awesome-skills`, riesgo bajo).
- No existen con esos nombres exactos: `web-games`, `platformer`, `game-asset-generation`,
  `develop-web-game` (openai/skills no lo contiene), `vercel-deploy` parcial. Se documenta y se sigue.
- Leídas: SKILL.md de las 5 instaladas; aplicadas en diseño/arquitectura/código/tests.

## 2026-09-14 — Scaffold + implementación (FASES 4-10)
- Juego: **2DilesZ: El Faro Perdido** (original, pixel-retro, 6 niveles, 7 power-ups).
- Archivos: package.json, vite.config, vercel.json, index.html, style.css, favicon, eslint,
  prettier, CI, src/ (constants, config, levels, logic, services, systems, entities, scenes, ui),
  tests/ (4 suites), docs/ (5), README, CHANGELOG.
- Dependencias: phaser 3.90.0, vite 6.3.1, typescript 5.7.2, vitest, eslint, prettier.
## 2026-09-14 — Verificación (FASES 11-14)
- `typecheck` OK, `lint` OK (2 errores iniciales corregidos: import sin usar, var sin usar),
  `test` 17/17 OK, `build` OK (`dist/`: juego 44KB + phaser 1.48MB/340KB gzip + css 1.4KB).
- Seguridad (`npm audit`): HIGH de Vite corregido subiendo a 6.4.3. Quedan 2 moderate de
  `@vitest/mocker` (solo dev/test, sin exposición en producción): riesgo aceptado y documentado.
- Playtesting real (Playwright + Chromium contra `vite preview` del build):
  menú → ESPACIO → N1, mover → (80→527px), 2 monedas (+100), 0 errores de consola. Capturas
  `smoke-*.png` (ignoradas en git). Script reutilizable: `npm run smoke`.
- Bugs encontrados y corregidos:
  1. `#touch-controls { display:flex }` anulaba el atributo `hidden` → añadida regla `[hidden]`.
  2. Detección táctil demasiado laxa (`ontouchstart` existe en headless) → exige
     `maxTouchPoints > 0` o puntero grueso.
- Re-smoke tras el fix: OK (2 monedas, 0 errores).
- Pendiente: push a GitHub, deploy Vercel, prueba de producción.
