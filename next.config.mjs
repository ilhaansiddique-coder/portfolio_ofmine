/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages at https://<user>.github.io/<repo>,
// the site is served from a sub-path. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to "/<repo>" automatically. For a user/org
// page (https://<user>.github.io) leave it empty.
// `/` (a user/org page root) is not a valid Next basePath — treat it as none.
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || '';
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

// `output: 'export'` is only for production builds. Applying it during
// `next dev` breaks dynamic routes (Next falsely reports a missing
// generateStaticParams), so we omit it in development.
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // Produce a fully static site in ./out for GitHub Pages (build only).
  ...(isDev ? {} : { output: 'export' }),
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimization server.
    unoptimized: true,
  },
  // The theme/app demos in public/demo/<slug>/ are prebuilt static sites. A
  // static host (GitHub Pages) serves `/demo/x/` -> `/demo/x/index.html`
  // automatically, but `next dev` does not, so every demo link 404s locally.
  // This rewrite restores that directory-index behaviour for dev. It is not
  // needed (and not supported) with `output: 'export'`, so it's dev-only.
  ...(isDev
    ? {
        async rewrites() {
          return [
            { source: '/demo/:path*/', destination: '/demo/:path*/index.html' },
          ];
        },
      }
    : {}),
};

export default nextConfig;
