import { config } from '@/config';

export type Repo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  updatedAt: string;
  fork: boolean;
  archived: boolean;
  featured: boolean;
  // A best-effort live preview image (GitHub OpenGraph card).
  ogImage: string;
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  followers: number;
  publicRepos: number;
  location: string | null;
  blog: string | null;
};

const GH_API = 'https://api.github.com';

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  // Any GitHub token lifts the unauthenticated rate limit (60/hr -> 5000/hr).
  // The deploy workflow passes the built-in GITHUB_TOKEN; locally you can set
  // GH_CONTRIB_TOKEN in .env.local — the same token also powers projects,
  // your avatar and the contribution graph.
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GH_CONTRIB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * Fetch the user's public profile. Returns null on failure so the
 * build never crashes (e.g. bad username / offline / rate limited).
 */
export async function fetchUser(): Promise<GitHubUser | null> {
  const { username } = config.github;
  try {
    const res = await fetch(`${GH_API}/users/${username}`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[github] user fetch failed: ${res.status}`);
      return null;
    }
    const u = await res.json();
    return {
      login: u.login,
      name: u.name,
      avatarUrl: u.avatar_url,
      bio: u.bio,
      htmlUrl: u.html_url,
      followers: u.followers,
      publicRepos: u.public_repos,
      location: u.location,
      blog: u.blog,
    };
  } catch (err) {
    console.warn('[github] user fetch error:', err);
    return null;
  }
}

/**
 * Fetch, filter, sort and shape the user's public repositories
 * according to src/config.ts. Returns [] on failure.
 */
export async function fetchRepos(): Promise<Repo[]> {
  const { username, featured, exclude, hideForks, hideArchived, maxProjects } =
    config.github;

  let raw: any[] = [];
  try {
    const res = await fetch(
      `${GH_API}/users/${username}/repos?per_page=100&sort=updated`,
      { headers: headers(), next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.warn(`[github] repos fetch failed: ${res.status}`);
      return [];
    }
    raw = await res.json();
  } catch (err) {
    console.warn('[github] repos fetch error:', err);
    return [];
  }

  const excludeSet = new Set(exclude.map((n) => n.toLowerCase()));
  const featuredSet = new Set(featured.map((n) => n.toLowerCase()));

  let repos: Repo[] = raw
    .filter((r) => !excludeSet.has(r.name.toLowerCase()))
    .filter((r) => (hideForks ? !r.fork : true))
    .filter((r) => (hideArchived ? !r.archived : true))
    .map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      htmlUrl: r.html_url,
      homepage: r.homepage,
      language: r.language,
      topics: r.topics ?? [],
      stars: r.stargazers_count,
      forks: r.forks_count,
      watchers: r.watchers_count,
      updatedAt: r.updated_at,
      fork: r.fork,
      archived: r.archived,
      featured: featuredSet.has(r.name.toLowerCase()),
      ogImage: `https://opengraph.githubassets.com/1/${r.full_name}`,
    }));

  // Sort: featured first (in given order), then by stars, then recency.
  const featuredIndex = (name: string) => {
    const i = featured.findIndex(
      (f) => f.toLowerCase() === name.toLowerCase()
    );
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  repos.sort((a, b) => {
    const fa = featuredIndex(a.name);
    const fb = featuredIndex(b.name);
    if (fa !== fb) return fa - fb;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return +new Date(b.updatedAt) - +new Date(a.updatedAt);
  });

  return repos.slice(0, maxProjects);
}
