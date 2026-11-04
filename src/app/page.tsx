import { fetchRepos, fetchUser } from '@/lib/github';
import { deriveCategory } from '@/lib/enrich';
import { config } from '@/config';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Workflow from '@/components/Workflow';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Home() {
  // These run at BUILD time (static export) — the data is baked in.
  const [user, repos] = await Promise.all([
    fetchUser(),
    fetchRepos(),
  ]);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  // Feed the typed code block from the real repos, so it can never drift out
  // of sync with what's actually shown in the Projects section. The full
  // lists are passed through — CodeTyping shows the first few and appends
  // "..." for the remainder.
  const rank = (order: string[]) => (a: string, b: string) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  };

  // Languages actually present in the repos lead the list; the rest of the
  // declared skills follow, so the trailing "..." in the code block honestly
  // stands for real remaining skills rather than being decoration.
  const repoLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter((l): l is string => !!l))
  ).sort(rank(['JavaScript', 'TypeScript', 'PHP', 'Dart']));

  const stack = [
    ...repoLanguages,
    ...config.skills.filter((s) => !repoLanguages.includes(s)),
  ];

  const domains = Array.from(new Set(repos.map(deriveCategory))).sort(
    rank(['E-commerce', 'Dashboard / Admin', 'Authentication'])
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Navbar />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Hero
          user={user}
          repoCount={repos.length}
          repoNames={repos.map((r) => r.name)}
          totalStars={totalStars}
          stack={stack}
          domains={domains}
        />
        <div className="saas-content">
          <Projects repos={repos} />
          <About user={user} />
          <Services />
          <Workflow />
          <Contact />
        </div>
      </div>
      <Footer />
    </main>
  );
}
