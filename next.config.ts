import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static export for GitHub Pages
// (then run scripts/pages-postprocess.mjs to add the /sardinia-discovery-travels prefix).
// Local dev and the normal build are unchanged.
const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = pages
  ? { output: "export", images: { unoptimized: true } }
  : {};

export default nextConfig;
