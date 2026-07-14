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
  { slug: 'yangkedu', repo: 'yangkedu_ecom_theme_template', kind: 'next-app' },
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

/**
 * A static export has to know every URL up front, which a live app doesn't.
 * These edits are made to the throwaway clone in .demo-src — never to the repo.
 */
function patchForStaticExport(src) {
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

/** A standalone Next app: build it on its own, just with our basePath. */
function buildNextApp(demo, src) {
  const base = `${SITE_BASE}/demo/${demo.slug}`;
  patchForStaticExport(src);
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
};
`);
  run('npx', ['next', 'build'], { cwd: src, env: { ...process.env, NEXT_PUBLIC_DEMO_BASE: base } });
  return resolve(src, 'out');
}

mkdirSync(OUT, { recursive: true });

for (const demo of targets) {
  console.log(`\n[demos] ── ${demo.slug} (${demo.repo}) ─────────────────`);
  const src = fetchSource(demo);

  const built = demo.kind === 'engine-theme'
    ? buildEngineTheme(demo, src)
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
