import { config } from '@/config';

export type ContribDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type Contributions = {
  total: number;
  days: ContribDay[];
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number };
  available: boolean;
};

/**
 * Fetch the public contribution calendar for the configured user.
 *
 * Uses a free, token-less aggregator of GitHub's public contribution
 * graph so this works at build time without auth. Falls back to an
 * empty (but correctly-shaped) calendar if the network is unavailable,
 * so the page always renders.
 */
export async function fetchContributions(): Promise<Contributions> {
  const { username } = config.github;
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      contributions: ContribDay[];
    };
    return shape(data.contributions, true);
  } catch (err) {
    console.warn('[contributions] fetch failed, using empty calendar:', err);
    return shape(emptyYear(), false);
  }
}

function shape(days: ContribDay[], available: boolean): Contributions {
  const total = days.reduce((s, d) => s + d.count, 0);

  // Streaks (counting consecutive days with at least one contribution).
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  // Current streak = trailing run of active days from the end.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else break;
  }

  const bestDay = days.reduce(
    (best, d) => (d.count > best.count ? { date: d.date, count: d.count } : best),
    { date: '', count: 0 }
  );

  return {
    total,
    days,
    currentStreak: current,
    longestStreak: longest,
    bestDay,
    available,
  };
}

/** 53 weeks of zero-contribution days, so the grid renders when offline. */
function emptyYear(): ContribDay[] {
  const days: ContribDay[] = [];
  // Deterministic dates would require a fixed "today"; we only need the
  // count of cells for layout, so dates are placeholders here.
  for (let i = 0; i < 371; i++) {
    days.push({ date: `cell-${i}`, count: 0, level: 0 });
  }
  return days;
}
