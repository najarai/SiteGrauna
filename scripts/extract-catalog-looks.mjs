import { pathToFileURL } from "url";
import { pdf } from "pdf-to-img";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const pdfjsPath = path.join(
  process.cwd(),
  "node_modules/pdf-to-img/node_modules/pdfjs-dist/legacy/build/pdf.mjs",
);
const { getDocument } = await import(pathToFileURL(pdfjsPath).href);

const REF = "referencias";
const OUT = REF; // final crops go here as requested
const WORK = path.join(REF, "_catalog_work");
const PAGES = path.join(WORK, "pages");
const CROPS = path.join(WORK, "crops");

fs.mkdirSync(PAGES, { recursive: true });
fs.mkdirSync(CROPS, { recursive: true });

const WHITE = 248;

function slugColor(raw) {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[()/]/g, " ")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 60);
}

function slugCat(raw) {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 24);
}

async function extractPageMeta(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const parts = tc.items.map((i) => i.str).filter((s) => s && s.trim());
    const joined = parts.join(" ");
    const sku = (joined.match(/\d{3}\.\d{3}\.\d{5}/) || [])[0] || null;
    const cat =
      parts.find((t) =>
        /^(BLUSA|VESTIDO|CALCA|CAMISA|MACACAO|SAIA|CASACO|SHORT|CONJUNTO)$/i.test(
          t.trim(),
        ),
      ) || null;
    const coresIdx = parts.findIndex((t) => /^Cores:?$/i.test(t.trim()));
    let cor = null;
    if (coresIdx >= 0) {
      cor = parts
        .slice(coresIdx + 1)
        .join(" ")
        .replace(/^:\s*/, "")
        .trim();
    }
    pages.push({ page: p, sku, cat, cor, text: joined });
  }
  return pages;
}

/** Detect main photo box by rejecting near-white margins + header/footer strips */
async function detectPhotoBox(pngPath) {
  const { data, info } = await sharp(pngPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isWhite = (x, y) => {
    const i = (y * width + x) * channels;
    return data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE;
  };

  const rowNonWhite = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let c = 0;
    for (let x = 0; x < width; x++) if (!isWhite(x, y)) c++;
    rowNonWhite[y] = c / width;
  }

  // Find densest vertical band (the photo), ignoring sparse header/footer text
  const thresh = 0.08;
  let best = null;
  let y = 0;
  while (y < height) {
    while (y < height && rowNonWhite[y] < thresh) y++;
    if (y >= height) break;
    const start = y;
    while (y < height && rowNonWhite[y] >= thresh) y++;
    const end = y - 1;
    const len = end - start + 1;
    // Prefer bands that look like photos (tall enough), not thin text lines
    if (len > height * 0.35) {
      const score = len;
      if (!best || score > best.score) best = { start, end, score };
    }
  }

  if (!best) {
    // fallback: trim uniform white borders
    let top = 0,
      bottom = height - 1,
      left = 0,
      right = width - 1;
    while (top < height && rowNonWhite[top] < 0.01) top++;
    while (bottom > top && rowNonWhite[bottom] < 0.01) bottom--;
    return { left, top, width: width - left, height: bottom - top + 1 };
  }

  // Within photo band, trim left/right white
  let left = 0;
  let right = width - 1;
  const midY = Math.floor((best.start + best.end) / 2);
  const sampleRows = [
    best.start + Math.floor((best.end - best.start) * 0.2),
    midY,
    best.start + Math.floor((best.end - best.start) * 0.8),
  ];

  const colScore = (x) => {
    let nw = 0;
    for (const yy of sampleRows) if (!isWhite(x, yy)) nw++;
    return nw;
  };

  while (left < width && colScore(left) === 0) left++;
  while (right > left && colScore(right) === 0) right--;

  // Slight inset to drop grey divider lines
  const inset = 2;
  left = Math.min(width - 2, left + inset);
  right = Math.max(left + 2, right - inset);
  const top = Math.min(height - 2, best.start + inset);
  const bottom = Math.max(top + 2, best.end - inset);

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function enhanceAndSave(inputPng, outJpg, box) {
  const base = sharp(inputPng).extract(box);
  const meta = await base.metadata();
  // Upscale ~2x toward HD while preserving fidelity (source PDFs are limited)
  const targetW = Math.min(2400, Math.round((meta.width || box.width) * 2));

  await sharp(inputPng)
    .extract(box)
    .resize({
      width: targetW,
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 0.3 })
    .jpeg({ quality: 100, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(outJpg);
}

function uniquePath(dir, filename) {
  let p = path.join(dir, filename);
  if (!fs.existsSync(p)) return p;
  const ext = path.extname(filename);
  const stem = path.basename(filename, ext);
  let i = 2;
  while (fs.existsSync(path.join(dir, `${stem}_${i}${ext}`))) i++;
  return path.join(dir, `${stem}_${i}${ext}`);
}

const pdfs = fs.readdirSync(REF).filter((f) => f.endsWith(".pdf"));
const manifest = [];

for (const file of pdfs) {
  const pdfPath = path.join(REF, file);
  const short = file.startsWith("ACFr")
    ? file.slice(0, 24)
    : file.replace(".pdf", "");
  const safe = short.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48);
  console.log("\n==>", file.slice(0, 70));

  const metas = await extractPageMeta(pdfPath);
  let pageNum = 1;
  const doc = await pdf(pdfPath, { scale: 3.5 });

  for await (const image of doc) {
    const pagePng = path.join(PAGES, `${safe}_p${String(pageNum).padStart(2, "0")}.png`);
    fs.writeFileSync(pagePng, image);

    const meta = metas[pageNum - 1] || {};
    const box = await detectPhotoBox(pagePng);

    let name;
    if (meta.sku && meta.cat) {
      const cor = slugColor(meta.cor || "sem_cor");
      name = `${slugCat(meta.cat)}_${meta.sku}_${cor}.jpg`;
    } else if (/MORENA\s*ROSA/i.test(meta.text || "")) {
      name = `CAPA_MORENA_ROSA_p${pageNum}.jpg`;
    } else if (/MARIA\s*VALENTINA/i.test(meta.text || "")) {
      name = `CAPA_MARIA_VALENTINA_p${pageNum}.jpg`;
    } else {
      // Cover without extractable brand text — detect from filename codes
      const brandHint = file.includes("MOR")
        ? "MORENA_ROSA"
        : file.includes("MAR")
          ? "MARIA_VALENTINA"
          : "CATALOGO";
      name = `CAPA_${brandHint}_p${pageNum}.jpg`;
    }

    const outJpg = uniquePath(OUT, name);
    const workJpg = path.join(CROPS, path.basename(outJpg));

    await enhanceAndSave(pagePng, workJpg, box);
    fs.copyFileSync(workJpg, outJpg);

    const info = {
      source: file,
      page: pageNum,
      meta,
      box,
      output: path.basename(outJpg),
    };
    manifest.push(info);
    console.log(
      `  p${pageNum} → ${path.basename(outJpg)}  [${box.width}x${box.height}]`,
    );
    pageNum++;
  }
}

fs.writeFileSync(
  path.join(WORK, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`\nDone. ${manifest.length} images → ${path.resolve(OUT)}`);
