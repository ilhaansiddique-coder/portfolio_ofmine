import { config } from '@/config';
import type { Repo, LanguageStat } from './github';

export type ProjectInsight = {
  title: string;
  category: string;
  tagline: string;
  summary: string;
  skills: string[];
  highlights: string[];
  demo: string | null;
};

/** Turn a kebab/snake repo name into a readable title. */
export function prettyName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bIlhaansq\b/i, 'IlhaanSq')
    .replace(/\bEcom\b/i, 'E-commerce')
    .replace(/\bHrm\b/i, 'HRM')
    .replace(/\bBd\b/i, 'BD');
}

// Keyword → (category, skills, descriptive phrase). Detected from the repo
// name, topics and languages — purely factual signals, no invention.
const SIGNALS: {
  test: (s: string) => boolean;
  category?: string;
  skills?: string[];
  phrase?: string;
}[] = [
  {
    test: (s) => /ecom|commerce|shop|store|cart|tireshop|mart/.test(s),
    category: 'E-commerce',
    skills: ['E-commerce', 'Responsive UI'],
    phrase: 'an online storefront with product browsing and a shopping experience',
  },
  {
    test: (s) => /auth/.test(s),
    category: 'Authentication',
    skills: ['Authentication', 'Sessions', 'Security'],
    phrase: 'a secure authentication system with sign-up, login and session handling',
  },
  {
    test: (s) => /hrm|hr[-_]|payroll|admin|dashboard|management/.test(s),
    category: 'Dashboard / Admin',
    skills: ['Dashboard UI', 'CRUD', 'Data Management'],
    phrase: 'a management dashboard for handling records and day-to-day operations',
  },
  {
    test: (s) => /theme|template/.test(s),
    category: 'UI / Theme',
    skills: ['UI Design', 'Component Architecture', 'Theming'],
    phrase: 'a reusable, polished UI theme/template',
  },
  {
    test: (s) => /portfolio/.test(s),
    category: 'Portfolio',
    skills: ['UI Design', 'Animations'],
    phrase: 'a personal portfolio site',
  },
  {
    test: (s) => /flutter|app|mobile|akhiyan|assaaliyah/.test(s),
    category: 'Mobile App',
    skills: ['Mobile Development', 'Cross-platform UI'],
    phrase: 'a cross-platform mobile application',
  },
];

// Language → skills it implies.
const LANG_SKILLS: Record<string, string[]> = {
  TypeScript: ['TypeScript', 'React', 'Next.js'],
  JavaScript: ['JavaScript'],
  Dart: ['Dart', 'Flutter'],
  Python: ['Python'],
  HTML: ['HTML'],
  CSS: ['CSS', 'Tailwind CSS'],
  Java: ['Java'],
  Kotlin: ['Kotlin'],
  PHP: ['PHP'],
  Go: ['Go'],
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year(s) ago`;
}

/**
 * Just the project's category (E-commerce, Authentication, …). Split out from
 * deriveInsight so client components can theme a cover without running the
 * full insight pass (which reads the clock and would risk a hydration
 * mismatch).
 */
export function deriveCategory(repo: Repo): string {
  const haystack = [repo.name, repo.description ?? '', ...repo.topics]
    .join(' ')
    .toLowerCase();
  return SIGNALS.find((s) => s.test(haystack))?.category ?? 'Web App';
}

export function deriveInsight(
  repo: Repo,
  languages: LanguageStat[]
): ProjectInsight {
  const override = config.projectOverrides[repo.name] ?? {};
  const haystack = [repo.name, repo.description ?? '', ...repo.topics]
    .join(' ')
    .toLowerCase();

  // --- category + descriptive phrase from signals ---
  const matched = SIGNALS.filter((s) => s.test(haystack));
  const category = matched[0]?.category ?? 'Web App';
  const phrases = matched.map((m) => m.phrase).filter(Boolean) as string[];

  // --- skills: signals + languages, de-duped, ordered ---
  const skillSet = new Set<string>();
  matched.forEach((m) => m.skills?.forEach((s) => skillSet.add(s)));
  languages.forEach((l) =>
    (LANG_SKILLS[l.name] ?? [l.name]).forEach((s) => skillSet.add(s))
  );
  const skills = override.skills ?? Array.from(skillSet).slice(0, 10);

  // --- tagline + summary ---
  const langPart = languages.length
    ? languages
        .slice(0, 3)
        .map((l) => l.name)
        .join(', ')
    : repo.language ?? 'multiple technologies';

  const tagline =
    override.tagline ??
    repo.description ??
    `${prettyName(repo.name)} — a ${category.toLowerCase()} project.`;

  const summary =
    override.summary ??
    [
      `${prettyName(repo.name)} is ${
        phrases[0] ?? `a ${category.toLowerCase()} project`
      }${phrases[1] ? `, also serving as ${phrases[1]}` : ''}.`,
      `It is built primarily with ${langPart}` +
        (repo.description ? `. ${repo.description}.` : '.'),
    ].join(' ');

  // --- factual highlights ---
  const highlights = override.highlights ?? buildHighlights(repo, languages);

  return {
    title: prettyName(repo.name),
    category,
    tagline,
    summary,
    skills,
    highlights,
    demo: override.demo ?? (repo.homepage?.startsWith('http') ? repo.homepage : null),
  };
}

function buildHighlights(repo: Repo, languages: LanguageStat[]): string[] {
  const out: string[] = [];
  if (languages[0]) {
    out.push(`Primary language: ${languages[0].name} (${languages[0].percent}%)`);
  } else if (repo.language) {
    out.push(`Built with ${repo.language}`);
  }
  if (languages.length > 1) {
    out.push(`Multi-language stack (${languages.length} languages)`);
  }
  if (repo.homepage?.startsWith('http')) out.push('Has a live deployment');
  if (repo.topics.length) out.push(`Tagged: ${repo.topics.slice(0, 4).join(', ')}`);
  out.push(`Last updated ${timeAgo(repo.updatedAt)}`);
  if (repo.stars > 0) out.push(`${repo.stars} GitHub star${repo.stars === 1 ? '' : 's'}`);
  return out;
}
