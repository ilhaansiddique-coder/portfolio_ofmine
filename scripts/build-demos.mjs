// Builds a full, browsable storefront demo for each template repo and mounts it
// under public/demo/<slug>/, so a visitor clicking a project card lands on the
// real, running UI instead of a screenshot.
//
//   node scripts/build-demos.mjs            # all demos
//   node scripts/build-demos.mjs cd-ecom    # just one
//   SKIP_DEMOS=1 npm run build              # skip them entirely (fast rebuilds)
//
// The two ecom themes are not standalone apps: they are theme packages that
// only render inside the storefront engine, which lives in ./demo-engine. The
// engine is built once per theme with THEME_SRC pointing at that theme's source.
//
// Each demo is exported with basePath <site basePath>/demo/<slug>, so it must be
// rebuilt if the site's basePath changes.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(ROOT, 'demo-engine');
const WORK = resolve(ROOT, '.demo-src');
const OUT = resolve(ROOT, 'public', 'demo');

const SITE_BASE = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** slug = the folder under /demo/. `repo` is cloned fresh so CI can build it. */
const DEMOS = [
  { slug: 'cd-ecom', repo: 'theme_template_ecom', kind: 'engine-theme' },
  { slug: 'shopkart', repo: 'theme_like_ghorerbazar-ecom', kind: 'engine-theme' },
  { slug: 'yangkedu', repo: 'yangkedu_ecom_theme_template', kind: 'next-app', patch: 'yangkedu' },
  // A full-stack app (Prisma/Postgres + NextAuth). It can't run its backend on a
  // static host, so the demo swaps the DB layer for seeded mock data and drops
  // the server-only surface (API routes, admin, auth) — a browse-only storefront.
  { slug: 'hobbymart', repo: 'hobbymartbd-ecom-drone', kind: 'next-app', patch: 'hobbymart' },
  // A raw static HTML site (in-browser Babel/React) whose product data comes from
  // a live EonTyre API via serverless proxies. The demo vendors the CDN libs,
  // serves seeded mock tyres in place of the API, and drops the checkout backend.
  { slug: 'tireshop', repo: 'new_tireshop_dc', kind: 'static-site', patch: 'tireshop' },
];

// Runs as a `prebuild` hook, so give people an escape hatch: the demos clone
// three repos and run three Next builds, which is slow when you only want to
// iterate on the portfolio itself.
if (process.env.SKIP_DEMOS) {
  console.log('[demos] SKIP_DEMOS set — skipping demo builds.');
  console.log('[demos] Any demo already in public/demo/ is reused; missing ones will 404.');
  process.exit(0);
}

const only = process.argv[2];
const targets = only ? DEMOS.filter((d) => d.slug === only) : DEMOS;
if (!targets.length) {
  console.error(`[demos] Unknown demo "${only}". Known: ${DEMOS.map((d) => d.slug).join(', ')}`);
  process.exit(1);
}

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });

/** Every .ts/.tsx under a path (which may be a single file). */
function tsFiles(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return /\.tsx?$/.test(path) ? [path] : [];
  return readdirSync(path).flatMap((n) => tsFiles(resolve(path, n)));
}

/** Every JS/JSX/TS/TSX file under a dir — for the raw static tyre-shop site. */
function tsFilesAny(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return /\.(jsx?|tsx?)$/.test(path) ? [path] : [];
  return readdirSync(path)
    .filter((n) => n !== 'node_modules' && n !== 'vendor')
    .flatMap((n) => tsFilesAny(resolve(path, n)));
}

function fetchSource({ repo }) {
  const dest = resolve(WORK, repo);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(WORK, { recursive: true });
  run('git', ['clone', '--quiet', '--depth', '1',
    `https://github.com/ilhaansiddique-coder/${repo}.git`, dest]);
  return dest;
}

/** A theme package: render it through the storefront engine. */
function buildEngineTheme(demo, src) {
  const base = `${SITE_BASE}/demo/${demo.slug}`;

  // demo-engine/node_modules is gitignored, so a fresh checkout (CI) has none.
  if (!existsSync(resolve(ENGINE, 'node_modules'))) {
    console.log('[demos]   installing demo-engine dependencies…');
    run('npm', ['install', '--silent', '--no-audit', '--no-fund'], { cwd: ENGINE });
  }

  const env = {
    ...process.env,
    THEME_SRC: src,
    DEMO_BASE_PATH: base,          // basePath for _next assets + next/link
    NEXT_PUBLIC_DEMO_BASE: base,   // plain <img src="/..."> needs it too
  };
  rmSync(resolve(ENGINE, 'out'), { recursive: true, force: true });
  run('npm', ['run', 'build'], { cwd: ENGINE, env });
  return resolve(ENGINE, 'out');
}

const PATCHES_DIR = resolve(ENGINE, 'patches');

/**
 * A static export has to know every URL up front, which a live app doesn't.
 * These edits are made to the throwaway clone in .demo-src — never to the repo.
 */
function patchYangkedu(src) {
  const productRoute = resolve(src, 'src/app/product/[id]/page.tsx');
  if (existsSync(productRoute)) {
    let s = readFileSync(productRoute, 'utf8');
    if (!s.includes('generateStaticParams')) {
      s = s.replace(
        /(import \{[^}]*\} from "@\/lib\/products";)/,
        `$1\nimport { products as allProducts } from "@/lib/products";\n\n` +
          `// Static export: enumerate every product page at build time.\n` +
          `export function generateStaticParams() {\n` +
          `  return allProducts.map((p) => ({ id: String(p.id) }));\n}`,
      );
      writeFileSync(productRoute, s);
      console.log('[demos]   + generateStaticParams for /product/[id]');
    }
  }

  // The app renders its art with plain <img src="/banners/x.png">. Next only
  // rewrites basePath for next/link, next/image and _next assets, so those
  // root-absolute paths 404 once the demo is mounted under /demo/<slug>/.
  // (Verified: this app imports next/image nowhere — all 23 are plain <img> —
  // so prefixing here cannot double up.)
  const BASE = '${process.env.NEXT_PUBLIC_DEMO_BASE ?? ""}';
  const ASSET_DIR = '(?:banners|products|categories|images)';
  let patched = 0;

  for (const rel of ['src/lib/products.ts', 'src/components', 'src/app']) {
    for (const f of tsFiles(resolve(src, rel))) {
      const before = readFileSync(f, 'utf8');
      let s = before;

      // Quoted:   "/banners/x.png"        -> `${BASE}/banners/x.png`
      s = s.replace(
        new RegExp(`"(/${ASSET_DIR}/[^"]+\\.(?:png|jpe?g|webp|svg))"`, 'g'),
        (_m, p) => `\`${BASE}${p}\``,
      );
      // Templated: `/products/${p.id}-1.png` -> `${BASE}/products/${p.id}-1.png`
      s = s.replace(
        new RegExp('`(/' + ASSET_DIR + '/[^`]*)`', 'g'),
        (_m, p) => (p.includes('NEXT_PUBLIC_DEMO_BASE') ? _m : `\`${BASE}${p}\``),
      );
      // Bare JSX attr: src="/icon.svg"    -> src={`${BASE}/icon.svg`}
      s = s.replace(
        /(\bsrc)="(\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|svg))"/g,
        (_m, attr, p) => `${attr}={\`${BASE}${p}\`}`,
      );

      if (s !== before) { writeFileSync(f, s); patched++; }
    }
  }
  if (patched) console.log(`[demos]   ~ made image paths basePath-aware in ${patched} file(s)`);

  // Order ids are minted at runtime (`YKD${Date.now()}`), so no static file can
  // ever match /orders/<id>. Drop the detail route and send those links to the
  // orders list, which still works (it reads the browser's local storage).
  const orderRoute = resolve(src, 'src/app/orders/[id]');
  if (existsSync(orderRoute)) {
    rmSync(orderRoute, { recursive: true, force: true });
    for (const rel of ['src/app/me/page.tsx', 'src/app/thank-you/page.tsx']) {
      const f = resolve(src, rel);
      if (!existsSync(f)) continue;
      const s = readFileSync(f, 'utf8')
        .replace(/href=\{`\/orders\/\$\{o\.id\}`\}/g, 'href="/orders"')
        .replace(/href=\{order \? `\/orders\/\$\{order\.id\}` : "\/orders"\}/g, 'href="/orders"');
      writeFileSync(f, s);
    }
    console.log(
      '[demos]   - /orders/[id] removed: order ids are generated at runtime, so a ' +
        'static host cannot serve them. Order links now point at the orders list.',
    );
  }
}

/**
 * HobbyMart is a full-stack app (Prisma/Postgres + NextAuth). A static host has
 * no database and no server, so turn it into a browse-only storefront demo:
 *   - swap the Prisma singleton for a mock backed by seeded data
 *   - drop the server-only surface that can't be statically exported
 *     (API route handlers, the admin area, the NextAuth endpoint)
 *   - remove `force-dynamic` so pages can be prerendered
 * Client-side auth degrades to a logged-out "demo mode" on its own.
 */
function patchHobbymart(src) {
  const p = resolve(PATCHES_DIR, 'hobbymart');

  // 1. Data layer: mock Prisma + seed data.
  cpSync(resolve(p, 'prisma.ts'), resolve(src, 'src/lib/prisma.ts'));
  cpSync(resolve(p, 'mock-data.ts'), resolve(src, 'src/lib/mock-data.ts'));
  cpSync(resolve(p, 'public/mock'), resolve(src, 'public/mock'), { recursive: true });
  console.log('[demos]   ~ swapped Prisma for mock data layer + seed');

  // 2. Drop the server-only surface a static export cannot contain.
  for (const dir of ['src/app/api', 'src/app/admin']) {
    const d = resolve(src, dir);
    if (existsSync(d)) { rmSync(d, { recursive: true, force: true }); }
  }
  console.log('[demos]   - removed src/app/api and src/app/admin (server-only)');

  // 3. `export const dynamic = "force-dynamic"` forbids static export.
  let stripped = 0;
  for (const f of tsFiles(resolve(src, 'src/app'))) {
    const before = readFileSync(f, 'utf8');
    const after = before.replace(/export const dynamic\s*=\s*["']force-dynamic["'];?\n?/g, '');
    if (after !== before) { writeFileSync(f, after); stripped++; }
  }
  if (stripped) console.log(`[demos]   ~ removed force-dynamic from ${stripped} route(s)`);

  // 4. The shop page reads `await searchParams` for its filters, which forces
  //    dynamic rendering and is incompatible with a static export. Neutralize it
  //    to render the full catalogue (filters become display-only in the demo).
  const shopPage = resolve(src, 'src/app/(shop)/products/page.tsx');
  if (existsSync(shopPage)) {
    let s = readFileSync(shopPage, 'utf8');
    s = s.replace(/const params = await searchParams;/, 'const params: any = {}; // demo: static export, no runtime search params');
    s = s.replace(/const limit = \d+;/, 'const limit = 100; // demo: show the whole catalogue on one page');
    writeFileSync(shopPage, s);
    console.log('[demos]   ~ neutralized searchParams in the shop page (static export)');
  }

  // 5. Neutralize links into the removed admin area so no card 404s.
  for (const f of tsFiles(resolve(src, 'src/components'))) {
    const before = readFileSync(f, 'utf8');
    const after = before.replace(/href=["']\/admin[^"']*["']/g, 'href="/"');
    if (after !== before) writeFileSync(f, after);
  }

  // 6. next/image with `unoptimized` doesn't prefix basePath, so literal app
  //    asset refs (logo, placeholder) 404 under /demo/<slug>/. Prefix them.
  const BASE = '${process.env.NEXT_PUBLIC_DEMO_BASE ?? ""}';
  let imaged = 0;
  for (const f of tsFiles(resolve(src, 'src/components'))) {
    const before = readFileSync(f, 'utf8');
    // src="/logo.png" -> src={`${BASE}/logo.png`}  (skip data:/http/already-templated)
    const after = before.replace(
      /(\bsrc)=["'](\/[A-Za-z0-9][A-Za-z0-9._/-]*\.(?:png|jpe?g|webp|svg|gif))["']/g,
      (_m, attr, p) => `${attr}={\`${BASE}${p}\`}`,
    );
    if (after !== before) { writeFileSync(f, after); imaged++; }
  }
  if (imaged) console.log(`[demos]   ~ prefixed basePath on literal image refs in ${imaged} file(s)`);

  // 7. Plain <a href="/internal"> anchors don't get basePath (only next/link
  //    does), so they 404 under /demo/<slug>/. Prefix internal ones. next/link
  //    uses <Link>, and external links start with http/// — both left alone.
  let anchored = 0;
  for (const f of tsFiles(resolve(src, 'src/app'))) {
    const before = readFileSync(f, 'utf8');
    const after = before.replace(
      /<a\s+href=["'](\/[A-Za-z0-9][^"']*)["']/g,
      (_m, p) => `<a href={\`${BASE}${p}\`}`,
    );
    if (after !== before) { writeFileSync(f, after); anchored++; }
  }
  if (anchored) console.log(`[demos]   ~ basePath-prefixed plain <a> internal links in ${anchored} file(s)`);
}

/** A standalone Next app: build it on its own, just with our basePath. */
function buildNextApp(demo, src) {
  const base = `${SITE_BASE}/demo/${demo.slug}`;
  if (demo.patch === 'yangkedu') patchYangkedu(src);
  if (demo.patch === 'hobbymart') patchHobbymart(src);
  run('npm', ['install', '--silent', '--no-audit', '--no-fund'], { cwd: src });

  // The repo's own next.config doesn't know about a basePath or static export,
  // so supply one. A .mjs config wins over the repo's .ts config.
  const cfg = resolve(src, 'next.config.mjs');
  const tsCfg = resolve(src, 'next.config.ts');
  if (existsSync(tsCfg)) rmSync(tsCfg);
  // Next 16 removed the `eslint` key, and picks a stray parent lockfile as the
  // workspace root unless turbopack.root is pinned.
  writeFileSync(cfg, `const basePath = ${JSON.stringify(base)};
export default {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  turbopack: { root: import.meta.dirname },
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
`);
  run('npx', ['next', 'build'], { cwd: src, env: { ...process.env, NEXT_PUBLIC_DEMO_BASE: base } });
  return resolve(src, 'out');
}

/**
 * The tyre shop is not a framework app — it's flat .html pages that transpile
 * their .jsx in the browser and fetch tyres from serverless API proxies. On a
 * static host there is no server, so the demo:
 *   - vendors the React/Babel CDN libs (self-contained, no unpkg dependency)
 *   - serves a seeded mock in place of GET /api/products (any search returns it)
 *   - drops the server-only files (server.js, api/*.js, tests, docs)
 *   - auto-loads the catalogue so the shop isn't an empty search form
 * Nothing here needs a build — the patched files are the output.
 */
function buildStaticSite(demo, src) {
  const base = `${SITE_BASE}/demo/${demo.slug}`;
  const p = resolve(PATCHES_DIR, demo.patch);

  // Drop server-only + noise; the rest of the repo is the deployable site.
  for (const junk of ['server.js', 'api', 'prisma', 'node_modules', '.git',
    'Dockerfile', 'test-checkout.js', 'test.html', 'vercel.json']) {
    rmSync(resolve(src, junk), { recursive: true, force: true });
  }
  for (const f of readdirSync(src)) {
    if (f.endsWith('.md') || f.endsWith('.txt')) rmSync(resolve(src, f), { force: true });
  }

  // Vendor libs + mock API + mock images.
  cpSync(resolve(p, 'vendor'), resolve(src, 'vendor'), { recursive: true });
  cpSync(resolve(p, 'api'), resolve(src, 'api'), { recursive: true });
  cpSync(resolve(p, 'public/mock'), resolve(src, 'mock'), { recursive: true });

  // Rewrite CDN <script> tags to the vendored copies, and neutralize the one
  // absolute link (href="/") so it stays inside the demo folder.
  const CDN = [
    [/https:\/\/unpkg\.com\/react@[\d.]+\/umd\/react\.development\.js/g, 'vendor/react.js'],
    [/https:\/\/unpkg\.com\/react-dom@[\d.]+\/umd\/react-dom\.development\.js/g, 'vendor/react-dom.js'],
    [/https:\/\/unpkg\.com\/@babel\/standalone@[\d.]+\/babel\.min\.js/g, 'vendor/babel.min.js'],
  ];
  for (const f of readdirSync(src)) {
    if (!f.endsWith('.html')) continue;
    const fp = resolve(src, f);
    let s = readFileSync(fp, 'utf8');
    for (const [re, local] of CDN) s = s.replace(re, local);
    s = s.replace(/href="\/"/g, 'href="index.html"');
    writeFileSync(fp, s);
  }

  // Client fetches to `/api/...` are root-absolute; under a basePath they'd hit
  // the site root. Make them relative so they resolve inside the demo folder.
  for (const f of tsFilesAny(src)) {
    const before = readFileSync(f, 'utf8');
    const after = before.replace(/(['"`])\/api\//g, '$1api/');
    if (after !== before) writeFileSync(f, after);
  }

  // Auto-load the catalogue on mount so the shop shows tyres immediately.
  const shop = resolve(src, 'pages/ShopPage.jsx');
  if (existsSync(shop)) {
    let s = readFileSync(shop, 'utf8');
    s = s.replace(
      /const \[products, setProducts\] = useState\(\[\]\);/,
      `const [products, setProducts] = useState([]);\n` +
        `  // Demo: preload the mock catalogue so the shop isn't an empty search form.\n` +
        `  useEffect(() => { fetch('api/products').then(r => r.json()).then(d => { if (d.products) setProducts(d.products); if (d.car) setCarInfo(d.car); }).catch(() => {}); }, []);`,
    );
    writeFileSync(shop, s);
    console.log('[demos]   ~ tireshop: vendored CDN libs, mock /api/products, auto-load catalogue');
  }

  return src; // the patched clone IS the deployable output
}

mkdirSync(OUT, { recursive: true });

for (const demo of targets) {
  console.log(`\n[demos] ── ${demo.slug} (${demo.repo}) ─────────────────`);
  const src = fetchSource(demo);

  const built = demo.kind === 'engine-theme'
    ? buildEngineTheme(demo, src)
    : demo.kind === 'static-site'
      ? buildStaticSite(demo, src)
      : buildNextApp(demo, src);

  if (!existsSync(built)) {
    console.error(`[demos] ${demo.slug}: build produced no output at ${built}`);
    process.exit(1);
  }

  const dest = resolve(OUT, demo.slug);
  rmSync(dest, { recursive: true, force: true });
  cpSync(built, dest, { recursive: true });
  console.log(`[demos] ${demo.slug} -> public/demo/${demo.slug}/`);
}

console.log(`\n[demos] Done. Mounted at ${SITE_BASE || ''}/demo/<slug>/`);
