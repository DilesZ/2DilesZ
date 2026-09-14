# Arquitectura

## Stack (decisión FASE 2)
`Phaser 3.90 + TypeScript 5.7 + Vite 6`. Plantilla de referencia: `phaserjs/template-vite-ts` (MIT).
Sin React: el HUD/menús viven en escenas Phaser; el DOM solo aporta shell, botones táctiles y
accesibilidad. Build estático `dist/` → Vercel.

## Principios (skills aplicadas)
- `game-development`: state machine (Idle/Walk/Jump/Dash), pooling (partículas efímeras),
  input por acciones (`systems/input.ts`), contenido como datos (`data/levels.ts`).
- `2d-games`: coyote-time, jump-buffer, salto variable, cámara follow+deadzone, shake 50-260ms,
  AABB, tiles simples.
- `game-design`: core loop 30s (correr→saltar→recoger→faro), flow (tutorial → reto → boss),
  progresión skill+power+contenido.
- `tdd`: lógica pura (`logic/`) testeada verticalmente; Phaser solo en escenas/entidades.
- `web-design-guidelines`: contraste, textos con stroke, botones ≥40px, foco visible.

## Flujo de escenas
`Boot (genera texturas) → Menu ⇄ HowTo/Settings → Game ⇄ Pause → GameOver | Game(+1) | Victory`

## Datos
`LevelDef` describe plataformas, monedas, power-ups, enemigos, pinchos, sierras, checkpoints y meta.
Añadir un nivel = añadir un objeto a `LEVELS` (los tests validan invariantes).

## Rendimiento
- Phaser en chunk separado (`manualChunks`).
- Sin assets de red (todo generado). `assetsInlineLimit` 4KB.
- Partículas de vida corta (se destruyen a los 600ms). Enemigos ≤6 por nivel.
- `pixelArt: true`, DPR gestionado por Phaser, FPS target 60.
