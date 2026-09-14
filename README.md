# 2DilesZ: El Faro Perdido

Plataformas pixel-retro para navegador. Reactiva los 6 faros de la montaña.

- **Stack:** Phaser 3.90 + TypeScript 5.7 + Vite 6. Sin React (el HUD vive en Phaser).
- **Assets:** 100% procedurales generados en `Boot.ts`. Sin descargas, sin copyright.
- **Audio:** 100% procedural con WebAudio (`systems/audio.ts`). Sin ficheros.
- **Persistencia:** `localStorage` (`2dilesz-save-v1`): niveles, récords, mute, dash.

## Controles

| Acción | Teclado | Táctil |
|---|---|---|
| Moverse | ◀ ▶ / A D | Botones ◀ ▶ |
| Salto (variable) | ESPACIO / W / ▲ | ⤒ |
| Dash (desde N3) | SHIFT / K | 💨 |
| Pausa | P / ESC o botón ❚❚ | botón ❚❚ |
| Mute | M | Ajustes |

Mecánicas: coyote-time, jump-buffer, salto variable, doble salto (pluma), dash con cooldown,
stomp a enemigos, checkpoints, 7 power-ups combinables.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:8080
npm run test     # vitest
npm run typecheck
npm run lint
npm run build    # dist/
npm run preview
```

## Despliegue (Vercel)

Build estático: `npm run build` → `dist/`. Ver `vercel.json` y `docs/deployment.md`.
El repo GitHub está conectado al proyecto Vercel (deploy automático en push a main).

## Estructura

```
src/
  main.ts            # boot DOM + controles táctiles
  game/
    main.ts          # config Phaser
    constants.ts     # dims, texturas, power-up meta
    config.ts        # tuning centralizado (jugador/enemigos/puntos)
    data/levels.ts   # 6 niveles como datos
    logic/           # puro y testeado: powerups, scoring, saveCodec
    services/save.ts # localStorage seguro
    systems/         # audio procedural, input, fx
    entities/        # Player (coyote/buffer/dash), Enemy (FSM)
    scenes/          # Boot, Menu, HowTo, Settings, Game, Pause, GameOver, Victory
    ui/menu.ts       # botones/textos compartidos
tests/               # vitest: powerups, scoring, save, levels
docs/                # architecture, game-design, testing, deployment, development-log
```

## Licencias

Código propio (MIT). Pixel-art y audio generados por código en este repo: sin atribución externa.
