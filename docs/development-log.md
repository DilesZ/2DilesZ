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

## 2026-09-14 — Checkpoints GitHub (FASES 15-16)
- `3f9c508` feat: initialize 2DilesZ El Faro Perdido (48 ficheros, 6195 líneas). Push OK a `main`.
- `47d5971` chore: normalize line endings with .gitattributes. Push OK.
- Verificado en GitHub web: repo ya muestra README, src, tests, docs, vercel.json.
- CI GitHub Actions: runs #1 (34s) y #2 lanzados en los pushes. En local el pipeline
  equivalente (typecheck+lint+test+build) está en verde.
- `.gitignore` verificado: node_modules, dist, .vercel, coverage, smoke-*.png y .env excluidos.
  Sin secretos en el diff (solo código + lockfile + docs).
- Vercel CLI 59.16.0 instalado globalmente. `vercel whoami` → logged out.
- BLOQUEO: el deploy CLI requiere `vercel login` (OAuth manual del propietario) o que el
  proyecto Vercel conectado haga auto-deploy del push. Pendiente URL del proyecto Vercel
  para verificar producción.

## 2026-09-14 — Mejora gráfica con assets gratuitos (v1.1.0)
- Decisión: pack **"New Platformer Pack" de Kenney (CC0)** — único set completo y
  cohesionado accesible (kenney.nl/opengameart/itch bloquean TLS desde esta red;
  se usó el mirror shorepine/kenney vía raw.githubusercontent, ficheros originales).
- Descargados 26 PNG (40KB) a `public/assets/kenney/`. Licencias en `docs/licenses.md`
  + crédito en menú y README.
- Nueva escena `Preloader` (barra de progreso) + `systems/trim.ts` (recorte de
  transparencias con bbox unión para animaciones sin jitter).
- Jugador/enemigos/sierras animados por intercambio de frames; moneda giratoria;
  flags y antorchas ambientales; plataformas con tileSprites; pose de daño.
- Tests 19/19 (nuevo `assets.test.ts`). Typecheck/lint/build OK.
- Playtesting: N1 + N2 (slime, pinchos, +50, Dash ✓) con 0 errores; menú reajustado
  dos veces por solape de la fila decorativa (verificado en captura).
- Bug de test: Nivel 2 bloqueado en perfil fresco (correcto) → seed de localStorage.
- Pista N2: cangrejos → babosas.
- Pendiente: commit + push + deploy + smokes en producción.

## 2026-09-14 — Dirección de arte v2 "Neon Night" (v2.0.0)
- Motivo: feedback del usuario ("horrible gráficamente"). Diagnóstico: estilos
  mezclados (cartoon + pixel + plano), fondos vacíos, UI básica.
- Decisión: rehacer la capa visual completa con arte 100% procedural cohesionado
  (luz contra la oscuridad); se eliminan los 25 PNG Kenney del repo.
- Nuevo `Boot.ts` (~450 líneas de pintores Canvas2D): espíritu (4 poses), sombras,
  murciélago (2 frames), engranaje (2), orbe-moneda, pinchos neón, farolillos,
  tile nocturno, tablones, gólem obsidiana, faro, beam, glow, niebla, 3 ridges,
  2 auroras, viñeta, 7 orbes de power-up. `ui/backdrop.ts` compartido.
- Gameplay intacto (mecánicas y niveles no cambian): aura, estela, polvo de
  aterrizaje, parpadeo, tilt; beam del faro + halo; power-ups como orbes.
- UI: Baloo 2 (CDN + espera máx 900ms en Boot), botones primary/neón, Pause
  reconstruida con helpers, HowTo/Settings/GameOver/Victory con backdrop.
- Tests 17/17, typecheck, lint, build OK. Smokes desktop+móvil OK, 0 errores.
- Bugs visuales corregidos: ridges tapando plataformas (depths -10..-5),
  AJUSTES cortado + solape deco (re-layout menú), spikes flotantes (ya en v1.1).
- Commit `93cfc14` (45 ficheros), push OK, deploy prod READY, smokes desktop+móvil
  en producción OK con 0 errores (capturas revisadas).

## 2026-09-14 — Login Vercel + deploy + producción (FASES 15-16)
- `vercel login` por device-code (`RQJN-QXVQ`, luego `PCBF-QMTX` por email
  davidramosoler@gmail.com). Usuario autenticado: `dilesz`. CLI 59.16.0.
- Primer `vercel --prod` falló por nombre con mayúsculas (`2DilesZ-game`); relanzado con
  `--name 2dilesz-game` → proyecto creado, deployment READY:
  https://2dilesz-game.vercel.app (+ URL con hash).
- Smoke en PRODUCCIÓN (desktop): menú → N1, avance 80→381px, 1 moneda, 0 errores. OK.
- Smoke en PRODUCCIÓN (móvil 390x844 táctil): controles visibles, tap en JUGAR arranca,
  salto con ⤒ (466→373px), 0 errores. OK.
- Bug móvil detectado en captura: botones táctiles tapaban el aviso de rotación
  (posicionados respecto al shell). Fix: `#touch-controls` dentro de `#game-container`
  + `position: relative`. Rebuild, commit `1eb61e3`, push, redeploy, re-smoke desktop+móvil OK.
- Mejora de test: `dispatchEvent` (no `dispatch_event`) en Playwright JS; el tap corto da
  saltito (salto variable, correcto) → el test móvil mantiene pulsado para salto completo.
- Pendiente recomendado: conectar repo Git en dashboard para auto-deploy por push.
