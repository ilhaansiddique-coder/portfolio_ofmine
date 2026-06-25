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
    // 'tireshop' is the older version; 'new_tireshop_dc' (kept) has a live demo.
    exclude: ['portfolio_ofmine', 'tireshop'] as string[],

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
  projectOverrides: {
    'HRM_IlhaanSq': {
      tagline:
        'A commercial-grade, multi-tenant HR Management SaaS covering the full employee lifecycle.',
      summary:
        'HRM SaaS is a multi-tenant Human Resource Management platform built on a modern Next.js SaaS stack. ' +
        'Each organization gets a tenant-isolated workspace to manage its entire employee lifecycle — ' +
        'onboarding, attendance, leave, payroll, performance, recruitment, learning and documents. ' +
        'It is a full product, not a demo: real database schema (PostgreSQL/PLpgSQL), Docker tooling, and a ' +
        'modular architecture organised around distinct HR domains.',
      skills: [
        'Next.js',
        'TypeScript',
        'PostgreSQL',
        'Multi-tenant SaaS',
        'Docker',
        'Authentication',
        'Payroll Logic',
      ],
      highlights: [
        'Multi-tenant, tenant-isolated workspaces',
        'Full HR suite: employees, attendance, leave, payroll, performance, recruitment',
        'PostgreSQL data layer with PLpgSQL',
        'Dockerized for deployment',
        'Modular, domain-driven architecture',
      ],
    },
    'mega_auth_nextjs_postgresql': {
      tagline:
        'A full authentication system built with Next.js and PostgreSQL.',
      summary:
        'An authentication-focused application built with Next.js and a PostgreSQL backend, ' +
        'implementing the core building blocks of secure user access — registration, login and ' +
        'session handling — with a persistent relational user store.',
      skills: [
        'Next.js',
        'TypeScript',
        'PostgreSQL',
        'Authentication',
        'Sessions',
        'Security',
      ],
      highlights: [
        'Sign-up and login flows',
        'PostgreSQL-backed user store',
        'Session / access management',
        'Built on the Next.js App Router',
      ],
    },
    'hobbymartbd-ecom-drone': {
      tagline:
        'An e-commerce storefront for a hobby & drone shop, built with Next.js.',
      summary:
        'HobbyMart BD is an e-commerce storefront for a hobby and drone retailer, built with Next.js, ' +
        'TypeScript and a custom-styled UI. It focuses on a clean, responsive shopping experience for ' +
        'browsing and presenting products.',
      skills: [
        'Next.js',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'E-commerce',
        'Responsive UI',
      ],
      highlights: [
        'E-commerce storefront UI',
        'Responsive, mobile-first design',
        'Next.js App Router architecture',
        'Component-driven front end',
      ],
    },
    'yangkedu_ecom_theme_template': {
      tagline:
        'A reusable e-commerce theme/template built with Next.js and TypeScript.',
      summary:
        'A reusable e-commerce theme template built with Next.js and TypeScript — a styled, ' +
        'component-driven storefront layout designed to be adapted across different online shops.',
      skills: [
        'Next.js',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'UI Design',
        'Theming',
      ],
      highlights: [
        'Reusable storefront theme',
        'Component-driven layout',
        'Responsive design',
        'Next.js + TypeScript foundation',
      ],
    },
  } as Record<
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
