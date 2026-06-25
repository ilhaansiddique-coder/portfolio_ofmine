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
      'hobbymartbd-ecom-drone',
      'mega_auth_nextjs_postgresql',
      'yangkedu_ecom_theme_template',
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

  // --- PER-PROJECT COPY (optional) ---------------------------
  // Each project gets an auto-generated summary, skills and highlights
  // from its README + languages. To override with your own punchy copy,
  // add an entry here keyed by the EXACT repo name. Any field is optional.
  //
  // Example:
  // 'hobbymartbd-ecom-drone': {
  //   tagline: 'A full e-commerce storefront for a drone & hobby shop.',
  //   summary: 'Built a complete shopping experience with product catalog, ...',
  //   skills: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
  //   highlights: ['Cart & checkout flow', 'Admin product management', 'Responsive UI'],
  //   demo: 'https://your-live-demo.com',
  // },
  projectOverrides: {} as Record<
    string,
    {
      tagline?: string;
      summary?: string;
      skills?: string[];
      highlights?: string[];
      demo?: string;
    }
  >,

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
    email: 'proxadbd', // ⚠️ add the full address, e.g. proxadbd@gmail.com
    website: '',
    // Shown as a "Call" button (tel: link).
    phone: '0919187587',
    // International WhatsApp number — digits only, with country code, NO
    // leading 0 and NO "+". Used for the wa.me link. (Assumed +880 / Bangladesh.)
    whatsapp: '880919187587',
  },
};

export type SiteConfig = typeof config;
