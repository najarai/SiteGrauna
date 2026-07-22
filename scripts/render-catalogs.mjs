import { pdf } from "pdf-to-img";
import fs from "fs";
import path from "path";

const dir = "referencias";
const out = "referencias/_catalog_work/pages";
fs.mkdirSync(out, { recursive: true });

const pdfs = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf"));

for (const file of pdfs) {
  const id = file.startsWith("ACFr") ? file.slice(0, 24) : file.replace(".pdf", "");
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48);
  console.log("Rendering", file.slice(0, 60), "...");
  let page = 1;
  const doc = await pdf(path.join(dir, file), { scale: 3 });
  for await (const image of doc) {
    const name = `${safe}_p${String(page).padStart(2, "0")}.png`;
    fs.writeFileSync(path.join(out, name), image);
    console.log(" ", name, `${(image.length / 1024).toFixed(0)} KB`);
    page++;
  }
  console.log(" total pages:", page - 1);
}
