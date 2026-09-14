# CHANGELOG

Todos los cambios notables de **2DilesZ: El Faro Perdido**.

## [2.0.0] - 2026-09-14

### Dirección de arte "Neon Night" (rehaciendo v1.x por feedback)
- Eliminados todos los PNG Kenney: ahora el 100% del arte es procedural propio
  pintado con Canvas2D (degradados, glows, siluetas). Cero assets externos.
- Protagonista rediseñado: Pip, espíritu de luz con gorra de farero (poses idle,
  salto, daño, parpadeo), aura aditiva pulsante, inclinación, squash & stretch,
  estela de luz al correr/dashear y polvo al aterrizar.
- Enemigos de sombra con ojos neón: babosa gelatinosa, murciélago con aleteo,
  gólem de obsidiana con grietas y engranajes con dientes animados.
- Mundo: cielo en gradiente, auroras animadas, luna con halo, estrellas con
  titileo, 3 cordilleras en parallax, luciérnagas, niebla a la deriva y viñeta.
- Plataformas de pizarra con musgo neón, puentes de madera, pinchos metálicos
  con puntas de neón, checkpoints como farolillos de piedra (encendido pulsante),
  faro redibujado con haz de luz oscilante y halo.
- UI profesional: tipografía Baloo 2, botones primario/neón con hover glow,
  títulos con sombra, pantallas con fondo ambiental (menú, cómo jugar, ajustes,
  pausa, game over, victoria).

## [1.1.0] - 2026-09-14

### Añadido
- Assets profesionales **Kenney (CC0)**: jugador animado (idle/walk/jump/hit), slime,
  mosca y sierras animados, moneda giratoria, pinchos, flags de checkpoint, antorchas,
  tiles de hierba y puentes de madera. Ver `docs/licenses.md` (26 ficheros, 40KB).
- Escena `Preloader` con barra de progreso + recorte automático de transparencias.
- Fila decorativa con sprites en el menú + crédito a Kenney.
- Test `assets.test.ts`: manifiesto de assets verificado (existencia, peso, trim).

### Cambiado
- Plataformas con textura de hierba repetida; móviles con madera; checkpoints con
  bandera apagada/verde ondeante; corazón y estrella usan PNG Kenney.
- Pista del nivel 2 actualizada (babosas en vez de cangrejos).

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
