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
  name: 'Ilhaan',
  // Short title shown under your name in the hero.
  role: 'Full-Stack Developer',
  // One or two sentences. Shown in the hero.
  tagline:
    'I build clean, performant web apps and love turning ideas into shipped products. Explore my open-source work below.',
  // A longer paragraph for the About section.
  about:
    "I'm a developer passionate about crafting delightful user experiences and robust back-end systems. " +
    "My projects below are pulled straight from my GitHub — each card links to the live source so you can " +
    "dive into the code, the README, and the demos. Always learning, always building.",
  // Optional: path to a photo placed in /public (e.g. '/avatar.jpg').
  // Leave empty to use your GitHub avatar automatically.
  avatar: '',
  location: '',

  // --- GITHUB ------------------------------------------------
  github: {
    // 👇 PUT YOUR EXACT GITHUB USERNAME HERE 👇
    username: 'ilhaan',

    // Repo names to pin to the front, in this order. Optional.
    // e.g. ['my-cool-app', 'algo-visualizer']
    featured: [] as string[],

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
    github: 'https://github.com/ilhaan',
    linkedin: '',
    twitter: '',
    email: '',
    website: '',
  },
};

export type SiteConfig = typeof config;
