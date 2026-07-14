import { fetchRepos, fetchUser } from '@/lib/github';
import { fetchContributions } from '@/lib/contributions';
import { deriveCategory } from '@/lib/enrich';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Contributions from '@/components/Contributions';
import Workflow from '@/components/Workflow';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Home() {
  // These run at BUILD time (static export) — the data is baked in.
  const [user, repos, contributions] = await Promise.all([
    fetchUser(),
    fetchRepos(),
    fetchContributions(),
  ]);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  // Feed the typed code block from the real repos, so it can never drift out
  // of sync with what's actually shown in the Projects section.
  const stack = Array.from(
    new Set(repos.map((r) => r.language).filter((l): l is string => !!l))
  ).slice(0, 5);
  const domains = Array.from(new Set(repos.map(deriveCategory))).slice(0, 4);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Navbar />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Hero
          user={user}
          repoCount={repos.length}
          totalStars={totalStars}
          stack={stack}
          domains={domains}
        />
        <About user={user} />
        <Services />
        <Contributions data={contributions} />
        <Workflow />
        <Projects repos={repos} />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
