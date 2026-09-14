# Diseño del juego — El Faro Perdido

## Pitch
Eres Pip, el farero. Sube la montaña y enciende los 6 faros.

## Core loop (30s)
Correr → saltar → esquivar/derrotar → recoger luz → llegar al faro → power-up → repetir.

## Power-ups (7, combinables salvo corazón)
| Power-up | Efecto | Duración |
|---|---|---|
| Botas ligeras | +22% velocidad | 25s |
| Pluma | doble salto (nivel) | nivel |
| Escudo | bloquea 1 golpe (máx 2) | hasta usar |
| Imán | atrae fragmentos (170px) | 25s |
| Estrella | puntos x2 | 20s |
| Corazón | +1 vida | instantáneo |
| Dash | desbloquea dash | permanente |

Feedback: icono flotante + nombre + sonido + partículas + línea en HUD con cuenta atrás.

## Curva
1. Sendero: moverse/saltar, botas, sin enemigos.
2. Pasto: walkers + stomp, pinchos, corazón.
3. Viento: pluma + dash, flyer, plataforma móvil.
4. Sierras: sierras, imán, estrella.
5. Subida: todo combinado, escudo.
6. Faro: boss Gólem + checkpoints triples.

## Game feel
Partículas en moneda/kill/power/checkpoint/meta, floatText de puntos, flash + iframes al daño,
shake 160/260ms, squash&stretch del jugador, tween en meta/checkpoints/monedas.
