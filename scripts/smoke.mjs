/** Smoke test de playtesting: sirve dist/, abre el juego, juega 3s y verifica.
 * Uso: SMOKE_URL=http://127.0.0.1:4173/ node scripts/smoke.mjs
 * Criterios: canvas visible, hook __2dilesz activo, el jugador avanza con →, cero errores de consola.
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173/';
const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'smoke-menu.png' });

// El menú arranca el juego con ESPACIO
await page.keyboard.press('Space');
await page.waitForTimeout(2500);
const snap1 = await page.evaluate(() =>
  typeof window.__2dilesz === 'function' ? window.__2dilesz() : 'NO_HOOK',
);
await page.screenshot({ path: 'smoke-game0.png' });

// Avanzar a la derecha + saltar
await page.keyboard.down('ArrowRight');
await page.waitForTimeout(1500);
await page.keyboard.press('Space');
await page.waitForTimeout(1500);
await page.keyboard.up('ArrowRight');
const snap2 = await page.evaluate(() =>
  typeof window.__2dilesz === 'function' ? window.__2dilesz() : 'NO_HOOK',
);
await page.screenshot({ path: 'smoke-game1.png' });

console.log('SNAP1:', snap1);
console.log('SNAP2:', snap2);
console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
await browser.close();

function playerPos(s) {
  const m = /player=(\d+),(\d+)/.exec(s ?? '');
  return m ? { x: Number(m[1]), y: Number(m[2]) } : null;
}
let fail = 0;
if (!snap1 || snap1 === 'NO_HOOK') {
  console.error('FAIL: sin hook de juego (Game no arrancó)');
  fail = 1;
}
const a = playerPos(snap1);
const b = playerPos(snap2);
if (a && b && b.x <= a.x) {
  console.error(`FAIL: el jugador no avanzó con ArrowRight (${a.x} -> ${b.x})`);
  fail = 1;
}
if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} error(es) de consola`);
  fail = 1;
}
if (fail === 0) console.log('SMOKE OK: menú, gameplay, movimiento y consola limpios.');
process.exit(fail);
