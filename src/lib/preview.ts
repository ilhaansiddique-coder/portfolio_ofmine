import type { Repo, LanguageStat } from './github';

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
  _repo: Repo,
  _languages: LanguageStat[],
  demo: string | null
): LiveTab[] {
  // Only a demo we build and host ourselves (public/demo/<slug>/) gets the
  // embedded, browse-it-here treatment — it's same-origin, so it always loads.
  // Every other project falls through to the standardized ProjectPreview
  // (real screenshot / labelled mockup), which is more reliable and consistent
  // than embedding a third-party deployment or booting the repo via StackBlitz.
  if (demo && demo.includes('/demo/')) {
    return [
      {
        id: 'live',
        label: 'Live Demo',
        url: demo,
        note: 'The real app, built from this repository and running here — browse it freely.',
      },
    ];
  }
  return [];
}
