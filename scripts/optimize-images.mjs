/**
 * One-off asset optimizer.
 *
 * The PNGs dropped into src/images/ are print-sized (3000–3848px, up to
 * ~22 MB) and some sit on an opaque white background. This emits web-sized
 * WebP into src/assets/:
 *
 *   - money-*.png  keep their alpha, just resize.
 *   - logo.png     opaque white background is flood-filled away, then the
 *                  art is cropped to its largest connected shape (the
 *                  emblem) — the wordmark baked into the PNG would be an
 *                  illegible smudge at nav size.
 *   - vault.png    opaque white background flood-filled away. Uses a lower
 *                  white threshold so the soft grey contact shadow under the
 *                  vault is punched out too (it left a white smudge at 230).
 *
 *   npm run optimize:images
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "src", "images");
const OUT = join(HERE, "..", "src", "assets");

/** Longest output edge per asset, in CSS px. */
const PLAN = {
  "logo.png": { max: 256, cutout: true, cropLargest: true },
  /* 200 (not 230): the vault's grey contact shadow sits around 200-225 and
     otherwise survives the cut-out as a pale smudge under the feet. */
  "vault.png": { max: 900, cutout: true, cropLargest: false, white: 200 },
};
const DEFAULT_PLAN = { max: 1280, cutout: false, cropLargest: false };

/** Anything lighter than this (all channels) counts as background white. */
const WHITE = 230;
/** Alpha above this counts as "content" when finding shapes. */
const OPAQUE = 128;

/** Flood-fill near-white from the border and punch it to alpha 0. */
function cutOutWhite(data, w, h, c, thresh = WHITE) {
  const white = (p) => data[p * c] > thresh && data[p * c + 1] > thresh && data[p * c + 2] > thresh;
  const bg = new Uint8Array(w * h);
  const stack = [];
  const seed = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (bg[p] || !white(p)) return;
    bg[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x++) {
    seed(x, 0);
    seed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    seed(0, y);
    seed(w - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p / w) | 0;
    seed(x + 1, y);
    seed(x - 1, y);
    seed(x, y + 1);
    seed(x, y - 1);
  }
  let removed = 0;
  for (let p = 0; p < w * h; p++) {
    if (bg[p]) {
      data[p * c + 3] = 0;
      removed++;
    }
  }
  return removed;
}

/** Bounding box of the largest 4-connected opaque shape. */
function largestShape(data, w, h, c) {
  const seen = new Uint8Array(w * h);
  const stack = [];
  let best = null;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (seen[p]) continue;
      seen[p] = 1;
      if (data[p * c + 3] <= OPAQUE) continue;

      let area = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      stack.length = 0;
      stack.push(p);
      while (stack.length) {
        const q = stack.pop();
        const qx = q % w;
        const qy = (q / w) | 0;
        area++;
        if (qx < minX) minX = qx;
        if (qx > maxX) maxX = qx;
        if (qy < minY) minY = qy;
        if (qy > maxY) maxY = qy;
        for (const n of [q - 1, q + 1, q - w, q + w]) {
          if (n < 0 || n >= w * h || seen[n]) continue;
          const nx = n % w;
          const ny = (n / w) | 0;
          if (Math.abs(nx - qx) + Math.abs(ny - qy) !== 1) continue; // no wrap
          seen[n] = 1;
          if (data[n * c + 3] > OPAQUE) stack.push(n);
        }
      }
      if (!best || area > best.area) best = { area, minX, maxX, minY, maxY };
    }
  }
  return best;
}

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.png$/i.test(f));
if (files.length === 0) {
  console.error(`No PNGs found in ${SRC}`);
  process.exit(1);
}

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const plan = PLAN[file] || DEFAULT_PLAN;
  const input = join(SRC, file);
  const output = join(OUT, `${basename(file, ".png")}.webp`);
  const before = (await stat(input)).size;

  let pipe;
  let note = "";

  if (plan.cutout) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: c } = info;
    const removed = cutOutWhite(data, w, h, c, plan.white ?? WHITE);
    note += ` cutout:${Math.round((removed / (w * h)) * 100)}%`;

    let src = sharp(data, { raw: { width: w, height: h, channels: c } });
    if (plan.cropLargest) {
      const box = largestShape(data, w, h, c);
      const pad = Math.round(Math.min(box.maxX - box.minX, box.maxY - box.minY) * 0.06);
      const left = Math.max(0, box.minX - pad);
      const top = Math.max(0, box.minY - pad);
      const width = Math.min(w - left, box.maxX - box.minX + 1 + pad * 2);
      const height = Math.min(h - top, box.maxY - box.minY + 1 + pad * 2);
      src = src.extract({ left, top, width, height });
      note += ` crop:${width}x${height}`;
    }
    pipe = src;
  } else {
    pipe = sharp(input);
  }

  await pipe
    .resize({ width: plan.max, height: plan.max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(output);

  const after = (await stat(output)).size;
  totalIn += before;
  totalOut += after;

  const meta = await sharp(output).metadata();
  console.log(
    `${file.padEnd(14)} -> ${basename(output).padEnd(14)}` +
      ` ${String(Math.round(before / 1024)).padStart(6)} KB -> ${String(Math.round(after / 1024)).padStart(4)} KB` +
      `  (${meta.width}x${meta.height}${meta.hasAlpha ? " a" : ""}${note})`,
  );
}

console.log(`\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)} MB -> ${(totalOut / 1024 / 1024).toFixed(2)} MB`);
