import { config } from '@/config';
import { readCache, writeCache } from './cache';

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
  defaultBranch: string;
  createdAt: string;
  openIssues: number;
  // A best-effort live preview image (GitHub OpenGraph card).
  ogImage: string;
};

export type LanguageStat = { name: string; percent: number; bytes: number };

export type RepoDetail = {
  repo: Repo;
  readme: string | null; // raw markdown, with relative URLs rewritten
  languages: LanguageStat[];
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
 * GET JSON from GitHub with a disk-cache fallback. On a successful response
 * the body is cached; on any failure (e.g. 403 rate limit) the last cached
 * copy is returned so the site keeps rendering. Returns null only when the
 * call fails AND nothing is cached.
 */
async function ghJSON<T = any>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: headers(), next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as T;
      await writeCache(url, data);
      return data;
    }
    const cached = await readCache<T>(url);
    if (cached) {
      console.warn(`[github] ${res.status} for ${url} — served from cache`);
      return cached;
    }
    console.warn(`[github] ${res.status} for ${url} — no cache available`);
    return null;
  } catch (err) {
    const cached = await readCache<T>(url);
    if (cached) {
      console.warn(`[github] error for ${url} — served from cache`);
      return cached;
    }
    console.warn(`[github] error for ${url}:`, err);
    return null;
  }
}

/**
 * Fetch the user's public profile. Returns null on failure so the
 * build never crashes (e.g. bad username / offline / rate limited).
 */
export async function fetchUser(): Promise<GitHubUser | null> {
  const { username } = config.github;
  const u = await ghJSON<any>(`${GH_API}/users/${username}`);
  if (!u) return null;
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
}

/**
 * Fetch, filter, sort and shape the user's public repositories
 * according to src/config.ts. Returns [] on failure.
 */
export async function fetchRepos(): Promise<Repo[]> {
  const { username, featured, exclude, hideForks, hideArchived, maxProjects } =
    config.github;
  const languageOverrides = config.github.languageOverrides ?? {};
  // Projects hidden from the public at build time (owner-mode "Copy hidden
  // list" feeds this). Folded in with `exclude` so they never ship.
  const hidden = config.github.hidden ?? [];

  const raw = await ghJSON<any[]>(
    `${GH_API}/users/${username}/repos?per_page=100&sort=updated`
  );
  if (!raw) return [];

  const excludeSet = new Set(
    [...exclude, ...hidden].map((n) => n.toLowerCase())
  );
  const featuredSet = new Set(featured.map((n) => n.toLowerCase()));

  const repos: Repo[] = raw
    .filter((r) => !excludeSet.has(r.name.toLowerCase()))
    // Reserved repositories are not finished work. Keep the known chat
    // project even if GitHub's size metadata has not caught up yet.
    .filter((r) => !/planned|reserved|implementation not yet published/i.test(r.description ?? ''))
    .filter((r) => r.size > 0 || r.name === 'chat_application_multi_room_with_django')
    .filter((r) => (hideForks ? !r.fork : true))
    .filter((r) => (hideArchived ? !r.archived : true))
    .map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      htmlUrl: r.html_url,
      homepage: r.homepage,
      language: languageOverrides[r.name] ?? r.language,
      topics: r.topics ?? [],
      stars: r.stargazers_count,
      forks: r.forks_count,
      watchers: r.watchers_count,
      updatedAt: r.updated_at,
      fork: r.fork,
      archived: r.archived,
      featured: featuredSet.has(r.name.toLowerCase()),
      defaultBranch: r.default_branch ?? 'main',
      createdAt: r.created_at,
      openIssues: r.open_issues_count ?? 0,
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

/** Language byte-breakdown for a repo, as sorted percentages. */
export async function fetchLanguages(fullName: string): Promise<LanguageStat[]> {
  const data = await ghJSON<Record<string, number>>(
    `${GH_API}/repos/${fullName}/languages`
  );
  if (!data) return [];
  const total = Object.values(data).reduce((s, n) => s + n, 0) || 1;
  return Object.entries(data)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Math.round((bytes / total) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

/** The repo's README as raw markdown (or null if it has none). */
export async function fetchReadme(fullName: string): Promise<string | null> {
  const data = await ghJSON<any>(`${GH_API}/repos/${fullName}/readme`);
  if (!data?.content) return null;
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

/** Everything needed to render a single project case-study page. */
export async function fetchRepoDetail(name: string): Promise<RepoDetail | null> {
  const repos = await fetchRepos();
  const repo = repos.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (!repo) return null;

  const [languages, readme] = await Promise.all([
    fetchLanguages(repo.fullName),
    fetchReadme(repo.fullName),
  ]);

  return { repo, languages, readme };
}
