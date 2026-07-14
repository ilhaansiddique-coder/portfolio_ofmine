import type { Repo, LanguageStat } from './github';

// A repo can be booted live by StackBlitz only if it's a Node/web project.
// We key off the PRIMARY language so a Flutter app that happens to contain a
// little HTML/CSS isn't mistakenly offered an in-browser runtime it can't use.
const RUNNABLE_PRIMARY = new Set([
  'TypeScript',
  'JavaScript',
  'Vue',
  'Svelte',
  'Astro',
  'HTML',
]);

/** A live screenshot of a deployed URL (no API key required). */
export function screenshotUrl(url: string): string {
  return `https://image.thum.io/get/width/1000/crop/700/noanimate/${url}`;
}

/** Best thumbnail for a card: real screenshot if deployed, else GitHub card. */
export function thumbnailFor(repo: Repo): string {
  if (repo.homepage && repo.homepage.startsWith('http')) {
    return screenshotUrl(repo.homepage);
  }
  return repo.ogImage;
}

/** StackBlitz embed that boots the repo and shows the running app preview. */
export function stackblitzEmbedUrl(fullName: string): string {
  return `https://stackblitz.com/github/${fullName}?embed=1&view=preview&hideNavigation=1&hideDevTools=1&ctl=1`;
}

export type LiveTab = {
  id: 'live' | 'run';
  label: string;
  url: string;
  note: string;
};

/**
 * Decide how a project can be shown "live":
 *  - a deployed site (homepage) → embed it directly
 *  - a web project → boot & run it in-browser via StackBlitz
 * Returns [] when neither is possible (e.g. a Flutter/mobile repo), so the
 * caller can fall back to a screenshot + README.
 */
export function buildLiveTabs(
  repo: Repo,
  languages: LanguageStat[],
  demo: string | null
): LiveTab[] {
  const tabs: LiveTab[] = [];

  if (demo) {
    // A demo we build and host ourselves (public/demo/<slug>/) is same-origin,
    // so it always embeds — unlike a third-party deployment, which may refuse.
    const isOwnDemo = demo.includes('/demo/');
    tabs.push({
      id: 'live',
      label: isOwnDemo ? 'Live Demo' : 'Live Site',
      url: demo,
      note: isOwnDemo
        ? 'The real storefront, built from this repository and running here — browse it, add to cart, check out.'
        : 'Live deployment, embedded here. If it appears blank, the site blocks embedding — use “Open in new tab”.',
    });
  }

  const primary = repo.language || languages[0]?.name || '';
  const isRunnable = RUNNABLE_PRIMARY.has(primary);

  // If we already host the real thing, don't also offer StackBlitz. It would be
  // redundant, and for the theme packages it cannot work at all: they declare no
  // dependencies and their build script shells out to the storefront engine,
  // which lives outside the repo.
  const hasOwnDemo = Boolean(demo && demo.includes('/demo/'));

  if (isRunnable && !hasOwnDemo) {
    tabs.push({
      id: 'run',
      label: 'Run in Browser',
      url: stackblitzEmbedUrl(repo.fullName),
      note: 'Boots the actual repository in your browser via StackBlitz — the first load installs dependencies and starts the dev server (~20–40s).',
    });
  }

  return tabs;
}
