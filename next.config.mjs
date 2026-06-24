/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages at https://<user>.github.io/<repo>,
// the site is served from a sub-path. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to "/<repo>" automatically. For a user/org
// page (https://<user>.github.io) leave it empty.
// `/` (a user/org page root) is not a valid Next basePath — treat it as none.
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || '';
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

const nextConfig = {
  // Produce a fully static site in ./out for GitHub Pages.
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
