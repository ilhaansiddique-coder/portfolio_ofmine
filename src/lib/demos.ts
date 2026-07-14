import { asset } from '@/config';

/**
 * Template repos that ship a full, browsable storefront on this site.
 *
 * The two ecom themes are theme packages, not apps — they only render inside
 * the storefront engine (./demo-engine). `scripts/build-demos.mjs` builds each
 * one into public/demo/<slug>/ before the site build, so these paths are real
 * pages served from our own origin.
 *
 * Keep the slugs in step with DEMOS in scripts/build-demos.mjs.
 */
const DEMO_SLUGS: Record<string, string> = {
  theme_template_ecom: 'cd-ecom',
  'theme_like_ghorerbazar-ecom': 'shopkart',
  yangkedu_ecom_theme_template: 'yangkedu',
};

/** The live storefront for a repo, or null if it doesn't have one. */
export function demoUrl(repoName: string): string | null {
  const slug = DEMO_SLUGS[repoName];
  // asset() adds the site's basePath — a bare "/demo/..." 404s on GitHub Pages.
  return slug ? asset(`/demo/${slug}/`) : null;
}

export function hasDemo(repoName: string): boolean {
  return repoName in DEMO_SLUGS;
}
