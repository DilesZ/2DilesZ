# Licencias de assets

**Este proyecto no contiene ningún asset externo.** Todo el arte y el audio
se generan por código en tiempo de ejecución:

- Sprites, tiles, fondos, iconos, faro, enemigos, partículas: pintados con
  Canvas2D en `src/game/scenes/Boot.ts` (dirección de arte "Neon Night" v2).
- Audio: 100% procedural con WebAudio (`src/game/systems/audio.ts`).
- Tipografía UI: Baloo 2 (Google Fonts, licencia SIL Open Font License 1.1),
  cargada por CDN con fallbacks del sistema si no hay conexión.

## Historial

- v1.1.0 incluía 25 PNG del pack "New Platformer Pack" de Kenney (CC0),
  obtenidos vía mirror. En v2.0 se eliminaron por completo del repositorio
  al rehacer la dirección de arte con gráficos propios (el usuario prefirió
  un estilo original cohesionado). No queda ningún fichero de Kenney en
  `public/`, `src/` ni `dist/`.
