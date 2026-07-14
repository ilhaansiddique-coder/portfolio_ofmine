/** @type {import('next').NextConfig} */

// Each theme demo is exported as a static site and mounted under the portfolio
// at <portfolio basePath>/demo/<slug>/, so it must be built with a matching
// basePath or every asset and link resolves to the wrong place.
// scripts/build-demos.mjs sets DEMO_BASE_PATH per theme.
const rawBase = process.env.DEMO_BASE_PATH || '';
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

const nextConfig = {
  // GitHub Pages has no Node server — emit a fully static ./out.
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  // Matches the portfolio, so /demo/<slug>/shop/ resolves without a redirect.
  trailingSlash: true,
  // Next 16 / Turbopack: pin the workspace root to this folder so a stray
  // parent lockfile doesn't get picked as the root.
  turbopack: { root: import.meta.dirname },
  // Mock images are local or external; there is no optimizer in a static export.
  images: { unoptimized: true },
  // The theme is written against the real engine's types; here it compiles
  // against stubs, so don't let type noise block the demo build.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
