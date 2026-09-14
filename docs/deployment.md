# Despliegue (Vercel)

## Producción (verificado 2026-09-14)
- https://2dilesz-game.vercel.app (alias estable)
- Proyecto: `2dilesz-game` (scope `dilesz`), creado vía `vercel --prod` con CLI 59.16.0.
- Estado del deployment: READY. Smoke tests en producción: desktop OK + móvil OK, 0 errores.

## Configuración
- `vercel.json`: `buildCommand: npm run build`, `outputDirectory: dist`, `framework: null`.
- Build local: `npm run build` genera `dist/` estático (base `./`, chunk `phaser` separado).
- Conexión: repo GitHub `DilesZ/2DilesZ` → proyecto Vercel (deploy automático en push a main).

## CLI (requiere login OAuth manual del propietario)
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Verificación post-deploy (obligatoria)
1. Abrir la URL pública en incógnito.
2. Jugar N1 completo (mover, saltar, botas, checkpoint, faro).
3. Revisar consola (cero errores) y rendimiento (60fps en desktop).
4. Probar en móvil (táctil) al menos N1.
5. Si hay fallo: reproducir en local → corregir → test → push → re-verificar.

## Auto-deploy con Git (recomendado, pendiente)
El despliegue actual se hizo con la CLI. Para desplegar cada push automáticamente:
Vercel Dashboard → proyecto `2dilesz-game` → Settings → Git → Connect
(`DilesZ/2DilesZ`, rama `main`). La config (`buildCommand`, `outputDirectory`) ya está
en `vercel.json`, no hay que cambiar nada más.
