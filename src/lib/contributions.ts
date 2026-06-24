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
  source: 'graphql' | 'public' | 'none';
};

/**
 * Fetch the contribution calendar for the configured user.
 *
 * Resolution order:
 *  1. GitHub GraphQL API — the official, authoritative source. When the
 *     token is a Personal Access Token owned by YOU, the total INCLUDES
 *     your private contributions (so it matches the number on your
 *     profile, e.g. 473). Set it via the GH_CONTRIB_TOKEN env / secret.
 *  2. Public aggregator — token-less fallback. Sees only PUBLIC
 *     contributions unless you enabled "Show private contributions on my
 *     profile" in GitHub → Contribution settings.
 *  3. Empty calendar — so the page always renders (e.g. offline build).
 */
export async function fetchContributions(): Promise<Contributions> {
  const fromGraphQL = await fetchFromGraphQL();
  if (fromGraphQL) return fromGraphQL;

  const fromPublic = await fetchFromPublic();
  if (fromPublic) return fromPublic;

  return shape(emptyYear(), false, 'none');
}

const CONTRIB_LEVEL: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchFromGraphQL(): Promise<Contributions | null> {
  const token =
    process.env.GH_CONTRIB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN;
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { login: config.github.username },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) throw new Error('no calendar in response');

    const days: ContribDay[] = cal.weeks.flatMap((w: any) =>
      w.contributionDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        level: CONTRIB_LEVEL[d.contributionLevel] ?? 0,
      }))
    );
    // Use GitHub's authoritative total (matches the profile headline).
    return shape(days, true, 'graphql', cal.totalContributions);
  } catch (err) {
    console.warn('[contributions] graphql failed:', err);
    return null;
  }
}

async function fetchFromPublic(): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${config.github.username}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { contributions: ContribDay[] };
    return shape(data.contributions, true, 'public');
  } catch (err) {
    console.warn('[contributions] public api failed:', err);
    return null;
  }
}

function shape(
  days: ContribDay[],
  available: boolean,
  source: Contributions['source'],
  totalOverride?: number
): Contributions {
  const total = totalOverride ?? days.reduce((s, d) => s + d.count, 0);

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
    source,
  };
}

/** 53 weeks of zero-contribution days, so the grid renders when offline. */
function emptyYear(): ContribDay[] {
  const days: ContribDay[] = [];
  for (let i = 0; i < 371; i++) {
    days.push({ date: `cell-${i}`, count: 0, level: 0 });
  }
  return days;
}
