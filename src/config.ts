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

/**
 * Files in /public are served under the site's basePath. Plain <a href="...">
 * links do NOT get the basePath prefixed automatically (unlike next/link), so
 * build public-asset URLs with this helper or they 404 on GitHub Pages.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
export const asset = (path: string) =>
  `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

export const config = {
  // --- OWNER MODE (private project visibility) ---------------
  // Per-project hide/show toggles are gated behind "owner mode".
  // Unlock it on any device by visiting the site once with your PIN:
  //   https://your-site/?owner=change-this-pin
  // It's stored in that browser's localStorage, so you stay unlocked.
  // This is only a SOFT gate for a cosmetic control, so the PIN does
  // not need to be a real secret — but change it from the default.
  owner: {
    pin: '464966',
  },

  // --- WHO YOU ARE -------------------------------------------
  name: 'Ilhaan Siddique',
  // Short logo/wordmark shown in the navbar & footer.
  logo: 'IlhaanSq',
  // Short title shown under your name in the hero.
  role: 'Full-Stack Web, SaaS & Android, iOS App Developer',
  // One or two sentences. Shown in the hero.
  tagline:
    'I build production-ready web apps, SaaS dashboards, backend systems and mobile-ready experiences with Next.js, TypeScript, PostgreSQL and modern deployment workflows.',
  // A longer paragraph for the About section.
  about:
    "I'm Ilhaan Siddique, a full-stack developer focused on practical product engineering: polished interfaces, secure authentication, database-backed dashboards, SaaS architecture and mobile-first user experiences. " +
    "The work below is pulled straight from my GitHub and shaped into case studies so you can inspect the code, the product decisions and the technical depth behind each build.",
  // Optional: path to a photo placed in /public (e.g. '/avatar.jpg').
  // Leave empty to use your GitHub avatar automatically.
  avatar: '/newupdatedimageofmine.png',
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

    // Repo names to hide from the site. Everything else is imported and shown.
    // 'tireshop' is the older version — 'new_tireshop_dc' (kept) has a live demo.
    exclude: ['portfolio_ofmine', 'tireshop'] as string[],

    // Repo names hidden from EVERYONE at build time — the "permanent /
    // public" hide. Unlike `exclude`, this list is what the owner-mode
    // "Copy hidden list" button generates: toggle projects off in the
    // browser, click copy, paste the result here, then redeploy to make
    // those projects invisible to the public. Removed from the site
    // entirely (cards + detail pages), just like `exclude`.
    hidden: [] as string[],

    // GitHub reports a repo's "primary language" by counting bytes, which can
    // misrepresent a project. ecom-futurebd is a Laravel app, but its React
    // frontend edges out the PHP backend on line count (356KB TS vs 312KB PHP),
    // so GitHub labels it TypeScript. Override it here so the card reflects
    // what the project actually IS, not what it has the most bytes of.
    languageOverrides: {
      'ecom-futurebd': 'PHP',
    } as Record<string, string>,

    // Show everything, including forks and archived repos.
    hideForks: false,
    hideArchived: false,

    // Effectively "no limit" (the API returns up to 100 per page).
    maxProjects: 100,
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
    'Nest.js',
    'PHP',
    'Laravel',
    'Python',
    'Tailwind CSS',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Git',
    'Docker',
    'CI/CD Pipeline',
  ],

  services: [
    {
      title: 'Full-Stack Web Apps',
      description:
        'Responsive, production-style web applications with React, Next.js, TypeScript, API integration and clean component architecture.',
      skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'SaaS & Dashboards',
      description:
        'Tenant-aware admin panels, role-based access, data tables, reports, exports and business workflows backed by PostgreSQL.',
      skills: ['PostgreSQL', 'Prisma', 'Auth', 'RBAC'],
    },
    {
      title: 'Android & Mobile Apps',
      description:
        'Mobile-first product experiences, Android-ready interfaces and app flows connected to real backend services and APIs.',
      skills: ['Android', 'Mobile UI', 'APIs', 'Offline-ready UX'],
    },
    {
      title: 'Backend & Deployment',
      description:
        'Secure server logic, database design, Docker-based deployment, CI/CD setup, monitoring and maintainable production workflows.',
      skills: ['Node.js', 'Docker', 'CI/CD', 'Sentry'],
    },
  ],

  workflow: [
    {
      step: '01',
      title: 'Plan',
      description:
        'Turn product requirements into features, data models, routes, roles and a clear implementation path.',
    },
    {
      step: '02',
      title: 'Build',
      description:
        'Create the UI, backend logic, authentication, database flows and integrations with clean reusable code.',
    },
    {
      step: '03',
      title: 'Ship',
      description:
        'Prepare deployment, environment variables, migrations, performance checks and production-ready docs.',
    },
    {
      step: '04',
      title: 'Improve',
      description:
        'Iterate from real use: polish UX, tighten security, add reporting and improve speed where it matters.',
    },
  ],

  // --- SOCIAL / CONTACT --------------------------------------
  // Leave any value empty ('') to hide that link.
  // Path to the downloadable resume PDF in /public. asset() prefixes the
  // GitHub Pages basePath — a plain "/resume.pdf" would 404 there.
  resume: asset('/Ilhaan_Siddique_Resume.pdf'),
  social: {
    github: 'https://github.com/ilhaansiddique-coder',
    linkedin:
      'https://www.linkedin.com/in/abdullah-al-mamun-ilhaan-468974390/',
    twitter: '',
    email: 'proxadbd@gmail.com',
    website: '',
    // Downloadable CV in /public. asset() adds the GitHub Pages basePath.
    resume: asset('/Ilhaan_Siddique_Resume.pdf'),
    // Shown as a "Call" button (tel: link).
    phone: '+8801919187587',
    // International WhatsApp number. The contact component normalizes this for
    // the wa.me link.
    whatsapp: '+8801919187587',
  },
};

export type SiteConfig = typeof config;
