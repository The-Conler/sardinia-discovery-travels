// Post-process the static export (dist/client) for GitHub Pages under /sardinia-discovery-travels.
// Usage: node scripts/pages-postprocess.mjs <outDir> [extraDir]
import fs from "node:fs";
import path from "node:path";
const BASE = "/sardinia-discovery-travels";
const [, , out, extra] = process.argv;
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync("dist/client", out, { recursive: true });
if (extra && fs.existsSync(extra)) fs.cpSync(extra, out, { recursive: true });
for (const f of ["_headers", "vinext-client-entry-manifest.json"]) fs.rmSync(path.join(out, f), { force: true });
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.writeFileSync(path.join(out, "destinations.html"),
  `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${BASE}/"><link rel="canonical" href="${BASE}/"><a href="${BASE}/">Home</a>`);
const names = [...new Set(fs.readdirSync(out).map((n) => n.replace(/\.(html|rsc)$/, "")).filter((n) => !n.startsWith(".")))];
names.push("destinations", "partner");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const re = new RegExp(`(["'\`(]|url\\()/(${[...new Set(names)].map(esc).join("|")})(?=[/"'\`?#)\\s.,]|\\\\)`, "g");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
let n = 0;
for (const f of walk(out)) {
  const ext = path.extname(f);
  if (![".html", ".rsc", ".js", ".css", ".json", ".xml", ".txt", ".webmanifest"].includes(ext)) continue;
  let s = fs.readFileSync(f, "utf8");
  const o = s;
  s = s.replace(re, `$1${BASE}/$2`);
  if (ext === ".html" || ext === ".rsc") s = s.replace(/href=(["'])\/\1/g, `href=$1${BASE}/$1`).replace(/"href":"\/"/g, `"href":"${BASE}/"`).replace(/\\"href\\":\\"\/\\"/g, `\\"href\\":\\"${BASE}/\\"`);
  s = s.replace(/href:(["`])\/\1/g, `href:$1${BASE}/$1`);
  // Vite's modulepreload base and srcset candidates (", /path 2x").
  s = s.replace(/=function\(e\)\{return`\/`\+e\}/g, `=function(e){return\`${BASE}/\`+e}`);
  s = s.replace(new RegExp(`(, )/(${[...new Set(names)].map(esc).join("|")})/`, "g"), `$1${BASE}/$2/`);
  if (s !== o) { fs.writeFileSync(f, s); n++; }
}
console.log("rewrote", n, "files; prefixes:", names.length);

// Trailing-slash URLs (/off-road/) -> X/index.html copies.
for (const f of walk(out)) {
  if (!f.endsWith(".html") || path.basename(f) === "index.html" || path.basename(f) === "404.html") continue;
  const dir = f.slice(0, -5);
  if (fs.existsSync(path.join(dir, "index.html"))) continue;
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(f, path.join(dir, "index.html"));
}
