import { fetchRepos, fetchUser } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Home() {
  // These run at BUILD time (static export) — the data is baked in.
  const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Navbar />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Hero user={user} repoCount={repos.length} totalStars={totalStars} />
        <About user={user} />
        <Projects repos={repos} />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
