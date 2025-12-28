import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const url = process.argv[2] || "http://127.0.0.1:4000/guides/nj-tile-guide/";
const out = process.argv[3] || "assets/downloads/nj-tile-guide.pdf";

const outDir = path.dirname(out);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(url, { waitUntil: "networkidle" });

// optional: ensure fonts/layout settle
await page.waitForTimeout(500);

await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" }
});

await browser.close();
console.log(`Saved: ${out}`);
