import sharp from "sharp";
import fs from "fs";
import path from "path";

const SIZE = 768;
const PAD = 0.06; // less padding = larger logo mark
const OUT = "public/brands";
const BG = { r: 207, g: 196, b: 182 }; // --color-cream-dim #cfc4b6

const SOURCES = [
  { id: "ambicione", file: "referencias/LogoAmbicione.png" },
  { id: "sly-wear", file: "referencias/LogoSlyWear.png" },
  { id: "flor-de-lis", file: "referencias/LogoFlorDeLis.png" },
  { id: "triton", file: "referencias/LogoTriton.png" },
  { id: "gatos-atos", file: "referencias/LogoGatosEAtos.png" },
  { id: "morena-rosa", file: "referencias/LogoGrupoMorenaRosa.png" },
  { id: "zinco", file: "referencias/LogoZinco.png" },
];

fs.mkdirSync(OUT, { recursive: true });

/**
 * Normalize any logo to black ink on pure white square PNG (high quality).
 */
async function normalizeLogo(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = width * height;

  let opaque = 0;
  let bright = 0;
  let dark = 0;
  let sum = 0;

  for (let i = 0; i < pixels; i++) {
    const o = i * channels;
    const a = data[o + 3];
    if (a < 20) continue;
    opaque++;
    const v = (data[o] + data[o + 1] + data[o + 2]) / 3;
    sum += v;
    if (v > 200) bright++;
    else if (v < 60) dark++;
  }

  const avg = opaque ? sum / opaque : 128;
  const opaqueRatio = opaque / pixels;
  const hasUsefulAlpha = opaqueRatio < 0.92;

  // Decide how to extract the mark as a binary mask (true = logo ink)
  let mode;
  if (hasUsefulAlpha && avg < 80) mode = "alpha-dark"; // black mark on transparent
  else if (hasUsefulAlpha && avg > 180) mode = "alpha-light"; // white mark on transparent
  else if (avg < 100 && bright > opaque * 0.01) mode = "luma-light-on-dark"; // white on black
  else mode = "luma-dark-on-light"; // black on white/cream

  const mask = Buffer.alloc(pixels); // 255 = ink
  for (let i = 0; i < pixels; i++) {
    const o = i * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const a = data[o + 3];
    const v = (r + g + b) / 3;

    let ink = false;
    if (mode === "alpha-dark") ink = a > 28;
    else if (mode === "alpha-light") ink = a > 28;
    else if (mode === "luma-light-on-dark") ink = a > 28 && v > 90;
    else ink = a > 28 && v < 170; // dark-on-light / cream

    mask[i] = ink ? 255 : 0;
  }

  // Tight crop around ink
  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x]) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    throw new Error(`No logo content detected in ${inputPath} (mode=${mode})`);
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Build RGBA cropped logo: black ink, transparent elsewhere
  const crop = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const src = (minY + y) * width + (minX + x);
      const dst = (y * cropW + x) * 4;
      const ink = mask[src];
      crop[dst] = 0;
      crop[dst + 1] = 0;
      crop[dst + 2] = 0;
      crop[dst + 3] = ink;
    }
  }

  const inner = Math.round(SIZE * (1 - PAD * 2));
  const fit = await sharp(crop, { raw: { width: cropW, height: cropH, channels: 4 } })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: BG,
    },
  })
    .composite([{ input: fit, gravity: "centre" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  console.log(
    `${path.basename(outputPath)} ← ${mode} | crop ${cropW}x${cropH} | opaque ${(opaqueRatio * 100).toFixed(1)}% avg=${avg.toFixed(0)}`,
  );
}

for (const src of SOURCES) {
  const out = path.join(OUT, `${src.id}.png`);
  await normalizeLogo(src.file, out);
}

console.log("done");
