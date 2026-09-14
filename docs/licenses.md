# Licencias de assets externos

Todos los assets gráficos externos de este proyecto pertenecen a **Kenney**
(https://www.kenney.nl/assets/new-platformer-pack — pack "New Platformer Pack")
y están publicados bajo **Creative Commons CC0 1.0 Universal (dominio público)**.

- Puedes copiar, modificar y usar los assets incluso con fines comerciales
  sin pedir permiso y sin atribución (la atribución es voluntaria y se incluye
  por cortesía en el menú del juego y en el README).
- Texto legal: https://creativecommons.org/publicdomain/zero/1.0/

## Archivos incluidos (public/assets/kenney/)

| Fichero local | Origen | Uso en el juego |
|---|---|---|
| Characters_character_yellow_{idle,jump,walk_a,walk_b,hit}.png | New Platformer Pack / Sprites / Characters | Jugador (animado) |
| Enemies_slime_normal_{rest,walk_a,walk_b}.png | New Platformer Pack / Sprites / Enemies | Enemigo walker (animado) |
| Enemies_fly_{rest,a,b}.png | New Platformer Pack / Sprites / Enemies | Enemigo flyer (animado) |
| Enemies_saw_{a,b}.png | New Platformer Pack / Sprites / Enemies | Sierras (animadas) |
| Tiles_coin_gold{,_side}.png | New Platformer Pack / Sprites / Tiles | Fragmentos de luz (giro) |
| Tiles_spikes.png | New Platformer Pack / Sprites / Tiles | Pinchos |
| Tiles_flag_{off,green_a,green_b}.png | New Platformer Pack / Sprites / Tiles | Checkpoints |
| Tiles_torch_on_{a,b}.png | New Platformer Pack / Sprites / Tiles | Antorchas del faro |
| Tiles_terrain_grass_block_top.png | New Platformer Pack / Sprites / Tiles | Plataformas |
| Tiles_bridge_logs.png | New Platformer Pack / Sprites / Tiles | Plataformas móviles |
| Tiles_heart.png | New Platformer Pack / Sprites / Tiles | Power-up corazón |
| Tiles_star.png | New Platformer Pack / Sprites / Tiles | Power-up estrella |

Obtenidos el 2026-09-14 vía mirror https://github.com/shorepine/kenney
(copia declarada de los assets CC0 de kenney.nl) porque kenney.nl no era
accesible desde la red de desarrollo. Los ficheros son los PNG originales
de Kenney, solo renombrados con prefijo de carpeta.

## Assets propios (sin licencia externa)

- Faro/checkpoint original, iconos de power-ups (botas, pluma, escudo, imán, dash),
  gólem, partículas: generados por código en `src/game/scenes/Boot.ts`.
- Audio: 100% procedural con WebAudio (`src/game/systems/audio.ts`).
