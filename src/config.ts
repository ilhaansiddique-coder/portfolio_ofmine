/**
 * ============================================================
 *  EDIT THIS FILE TO MAKE THE PORTFOLIO YOURS
 * ============================================================
 *
 * Everything visible on the site is driven from here. The
 * projects are pulled LIVE from the GitHub API at build time
 * using `github.username` below — you don't list them by hand.
 *
 * To feature/pin specific repos at the top, add their names to
 * `github.featured`. To hide repos, add them to `github.exclude`.
 */

export const config = {
  // --- WHO YOU ARE -------------------------------------------
  name: 'Ilhaan Siddique',
  // Short logo/wordmark shown in the navbar & footer.
  logo: 'IlhaanSq',
  // Short title shown under your name in the hero.
  role: 'Full-Stack Developer',
  // One or two sentences. Shown in the hero.
  tagline:
    'I ship code every single day — building e-commerce platforms, auth systems, and modern web apps with Next.js & TypeScript. Explore my work below.',
  // A longer paragraph for the About section.
  about:
    "I'm Ilhaan Siddique, a full-stack developer who lives in the editor — building real, " +
    "production-style projects from e-commerce storefronts to authentication systems and reusable themes. " +
    "Every project below is pulled straight from my GitHub, where I push commits daily. " +
    "Each card links to the live source so you can dive into the code, the README, and the demos.",
  // Optional: path to a photo placed in /public (e.g. '/avatar.jpg').
  // Leave empty to use your GitHub avatar automatically.
  avatar: '',
  location: '',

  // --- GITHUB ------------------------------------------------
  github: {
    // 👇 PUT YOUR EXACT GITHUB USERNAME HERE 👇
    username: 'ilhaansiddique-coder',

    // Repo names to pin to the front, in this order. Optional.
    // e.g. ['my-cool-app', 'algo-visualizer']
    featured: [
      'hobbymartbd-ecom',
      'mega_auth_nextjs',
      'yangkedu_ecom_theme',
      'HRM_IlhaanSq',
    ] as string[],

    // Repo names to hide from the site. Optional.
    exclude: [] as string[],

    // Hide forks / archived repos from the grid.
    hideForks: true,
    hideArchived: true,

    // Max number of projects to show.
    maxProjects: 24,
  },

  // --- SKILLS (shown as chips in the About section) ----------
  skills: [
    'TypeScript',
    'JavaScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Tailwind CSS',
    'PostgreSQL',
    'Git',
    'Docker',
  ],

  // --- SOCIAL / CONTACT --------------------------------------
  // Leave any value empty ('') to hide that link.
  social: {
    github: 'https://github.com/ilhaansiddique-coder',
    linkedin: '',
    twitter: '',
    email: 'nike0307@yahoo.se',
    website: '',
  },
};

export type SiteConfig = typeof config;
