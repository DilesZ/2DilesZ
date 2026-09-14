/** Smoke test móvil: viewport estrecho + táctil contra una URL (local o producción).
 * Uso: SMOKE_URL=https://2dilesz-game.vercel.app/ node scripts/smoke-mobile.mjs
 * Verifica: controles táctiles visibles, tap en JUGAR arranca el juego,
 * tap en ⤒ hace saltar al jugador, cero errores de consola.
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://localhost:4173/';
const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 20000 });
await page.waitForTimeout(2500);

const touchVisible = await page.evaluate(() => {
  const el = document.getElementById('touch-controls');
  return !!el && !el.hidden && getComputedStyle(el).display !== 'none';
});
console.log('TOUCH_VISIBLE:', touchVisible);
await page.screenshot({ path: 'smoke-mobile-menu.png' });

// Tap en el botón JUGAR del menú (coords de juego 480,300 → coords de página)
const box = await page.locator('canvas').boundingBox();
if (!box) throw new Error('sin canvas');
const toPage = (gx, gy) => ({ x: box.x + (gx / 960) * box.width, y: box.y + (gy / 540) * box.height });
const jugar = toPage(480, 300);
await page.touchscreen.tap(jugar.x, jugar.y);
await page.waitForTimeout(2500);
const snap1 = await page.evaluate(() =>
  typeof window.__2dilesz === 'function' ? window.__2dilesz() : 'NO_HOOK',
);
console.log('SNAP1:', snap1);

// Mantener pulsado ⤒ (salto variable: pulsación larga = salto alto) y medir ápice
const y0 = await page.evaluate(() => {
  const m = /player=(\d+),(\d+)/.exec(window.__2dilesz?.() ?? '');
  return m ? Number(m[2]) : -1;
});
await page.locator('#btn-jump').dispatchEvent('pointerdown');
let minY = y0;
for (let i = 0; i < 16; i++) {
  await page.waitForTimeout(50);
  const y = await page.evaluate(() => {
    const m = /player=(\d+),(\d+)/.exec(window.__2dilesz?.() ?? '');
    return m ? Number(m[2]) : 9999;
  });
  if (y < minY) minY = y;
}
await page.locator('#btn-jump').dispatchEvent('pointerup');
console.log(`JUMP_Y: ${y0} -> min ${minY}`);
await page.screenshot({ path: 'smoke-mobile-game.png' });
console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
await browser.close();

let fail = 0;
if (!touchVisible) {
  console.error('FAIL: controles táctiles no visibles en móvil');
  fail = 1;
}
if (!snap1 || snap1 === 'NO_HOOK') {
  console.error('FAIL: el tap en JUGAR no arrancó el juego');
  fail = 1;
}
if (!(minY < y0 - 40)) {
  console.error(`FAIL: mantener ⤒ no produjo un salto alto (y0=${y0}, min=${minY})`);
  fail = 1;
}
if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} error(es) de consola`);
  fail = 1;
}
if (fail === 0) console.log('MOBILE SMOKE OK.');
process.exit(fail);
