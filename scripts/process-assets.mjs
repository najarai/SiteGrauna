import sharp from "sharp";
import fs from "fs";
import path from "path";

const ref = "referencias";
const looksOut = "public/looks";
const brandsOut = "public/brands";

fs.mkdirSync(looksOut, { recursive: true });
fs.mkdirSync(brandsOut, { recursive: true });

// Instagram screenshot: strip status/header/profile (top) and likes/caption (bottom)
const TOP = 355;
const BOTTOM = 310;
const SIDE = 8;

for (let i = 1; i <= 15; i++) {
  const src = path.join(ref, `foto${i}.jpeg`);
  const img = sharp(src);
  const meta = await img.metadata();
  const w = meta.width;
  const h = meta.height;
  const cropH = h - TOP - BOTTOM;
  const cropW = w - SIDE * 2;
  await sharp(src)
    .extract({ left: SIDE, top: TOP, width: cropW, height: cropH })
    .jpeg({ quality: 100, mozjpeg: true })
    .toFile(path.join(looksOut, `look-${String(i).padStart(2, "0")}.jpg`));
  console.log(`look ${i}: ${cropW}x${cropH}`);
}

await sharp(path.join(ref, "logo.jpg")).png().toFile("public/logo.png");
console.log("logo ok");

async function extractCircles(file, names) {
  const meta = await sharp(file).metadata();
  const w = meta.width;
  const h = meta.height;
  const n = names.length;
  const diameter = Math.floor(h * 0.62);
  const top = Math.floor(h * 0.06);
  const gapTotal = w - diameter * n;
  const gap = gapTotal / (n + 1);

  for (let i = 0; i < n; i++) {
    const left = Math.round(gap + i * (diameter + gap));
    const size = Math.min(diameter, w - left, h - top);
    await sharp(file)
      .extract({ left: Math.max(0, left), top, width: size, height: size })
      .resize(256, 256, { fit: "cover" })
      .png()
      .toFile(path.join(brandsOut, `${names[i]}.png`));
    console.log(`brand ${names[i]} (${size}x${size} from ${left},${top})`);
  }
}

// Clean broken brand files
for (const f of fs.readdirSync(brandsOut)) {
  fs.unlinkSync(path.join(brandsOut, f));
}

await extractCircles(path.join(ref, "LogosMarcasVendidas1.jpeg"), [
  "ambicione",
  "sly-wear",
  "flor-de-lis",
  "triton",
]);
await extractCircles(path.join(ref, "LogoMarcasVendidas2.jpeg"), [
  "triton-dup",
  "gatos-atos",
  "morena-rosa",
  "zinco",
]);

const dup = path.join(brandsOut, "triton-dup.png");
if (fs.existsSync(dup)) fs.unlinkSync(dup);

console.log("done");
