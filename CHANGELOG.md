# CHANGELOG

Todos los cambios notables de **2DilesZ: El Faro Perdido**.

## [1.0.1] - 2026-09-14

### Corregido
- Controles táctiles: ahora flotan sobre el marco del juego en vez de solaparse con el
  aviso de rotación en móvil vertical (verificado con `smoke-mobile` en producción).
- Detección táctil más estricta (exige `maxTouchPoints > 0` o puntero grueso) y regla
  CSS `[hidden]` para que nunca se muestren en desktop.
- Seguridad: Vite 6.3.1 → 6.4.3 (corrige HIGH de `server.fs`).

## [1.0.0] - 2026-09-14

### Añadido
- Plataformas pixel-retro completo: Boot, Menu, HowTo, Settings, Game, Pause, GameOver, Victory.
- 6 niveles data-driven con curva de dificultad (tutorial → boss Gólem).
- Jugador con coyote-time, jump-buffer, salto variable, doble salto y dash.
- 7 power-ups combinables: botas, pluma, escudo, imán, estrella x2, corazón, dash.
- Enemigos: walker, flyer, golem + pinchos, sierras y plataformas móviles.
- Checkpoints, vidas, fragmentos, puntuación con bonus de tiempo, récords locales.
- HUD, pausa, game over, victoria, ajustes (sonido/vibración), reinicio.
- Audio 100% procedural WebAudio + mute persistido.
- Pixel-art 100% procedural (cero assets externos).
- Controles táctiles + hint de rotación + responsive FIT 16:9.
- Tests Vitest (powerups, scoring, save, levels), ESLint, TS strict, CI GitHub Actions.
- `vercel.json` para deploy estático (`dist/`).
- Docs: architecture, game-design, testing, deployment, development-log.
