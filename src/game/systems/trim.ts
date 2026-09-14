import type { TrimGroup } from '../data/kenney';

interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** BBox del contenido no transparente de un canvas. null si está vacío. */
function contentBox(canvas: HTMLCanvasElement): BBox | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const { width, height } = canvas;
  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, width, height);
  } catch {
    return null;
  }
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  const px = data.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (px[(y * width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  return { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}

/**
 * Recorta los marcos transparentes de cada grupo con la bbox UNIÓN del grupo
 * (todos los frames resultantes miden lo mismo: cero jitter de animación)
 * y registra las texturas recortadas con `outKeys`. Libera las originales.
 */
export function trimTextureGroups(scene: Phaser.Scene, groups: TrimGroup[]): void {
  for (const g of groups) {
    const canvases: HTMLCanvasElement[] = [];
    for (const src of g.srcKeys) {
      if (!scene.textures.exists(src)) continue;
      const img = scene.textures.get(src).getSourceImage() as HTMLImageElement;
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) continue;
      ctx.drawImage(img, 0, 0);
      canvases.push(c);
    }
    if (canvases.length === 0) continue;
    // unión
    let ux0 = Number.MAX_SAFE_INTEGER;
    let uy0 = Number.MAX_SAFE_INTEGER;
    let ux1 = 0;
    let uy1 = 0;
    const boxes = canvases.map((c) => contentBox(c));
    boxes.forEach((b) => {
      if (!b) return;
      ux0 = Math.min(ux0, b.x0);
      uy0 = Math.min(uy0, b.y0);
      ux1 = Math.max(ux1, b.x1);
      uy1 = Math.max(uy1, b.y1);
    });
    g.srcKeys.forEach((src, i) => {
      const out = g.outKeys[i];
      const c = canvases[i];
      if (!c || !out) return;
      const box = ux1 > 0 ? { x0: ux0, y0: uy0, x1: ux1, y1: uy1 } : null;
      if (box && scene.textures.exists(out)) scene.textures.remove(out);
      if (box) {
        const t = document.createElement('canvas');
        t.width = Math.max(1, box.x1 - box.x0);
        t.height = Math.max(1, box.y1 - box.y0);
        const tctx = t.getContext('2d');
        tctx?.drawImage(c, box.x0, box.y0, t.width, t.height, 0, 0, t.width, t.height);
        scene.textures.addCanvas(out, t);
      }
      if (scene.textures.exists(src)) scene.textures.remove(src);
    });
  }
}
