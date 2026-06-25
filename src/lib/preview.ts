import type { Repo, LanguageStat } from './github';

// Languages StackBlitz WebContainers can boot & run live in the browser.
const WEB_LANGS = new Set([
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'SCSS',
  'Vue',
  'Svelte',
  'Astro',
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
    tabs.push({
      id: 'live',
      label: 'Live Site',
      url: demo,
      note: 'Live deployment, embedded here. If it appears blank, the site blocks embedding — use “Open in new tab”.',
    });
  }

  const isWeb =
    (repo.language && WEB_LANGS.has(repo.language)) ||
    languages.some((l) => WEB_LANGS.has(l.name));

  if (isWeb) {
    tabs.push({
      id: 'run',
      label: 'Run in Browser',
      url: stackblitzEmbedUrl(repo.fullName),
      note: 'Boots the actual repository in your browser via StackBlitz — the first load installs dependencies and starts the dev server (~20–40s).',
    });
  }

  return tabs;
}
