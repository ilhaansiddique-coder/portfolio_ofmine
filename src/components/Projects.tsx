'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { Repo } from '@/lib/github';
import { config } from '@/config';
import { useVisibility } from '@/lib/visibility';
import { SectionHeading } from './Section';
import ProjectCard from './ProjectCard';

export default function Projects({ repos }: { repos: Repo[] }) {
  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => r.language && set.add(r.language));
    const extra = ['PHP', 'Laravel'].filter((l) =>
      repos.some((r) => r.name.toLowerCase().includes(l.toLowerCase()))
    );
    extra.forEach((l) => set.add(l));
    const sorted = Array.from(set).sort((a, b) => {
      const order = ['PHP', 'Laravel', 'TypeScript'];
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return ['All', ...sorted];
  }, [repos]);

  const [filter, setFilter] = useState('All');
  const { hidden } = useVisibility();

  const visible = useMemo(() => {
    const byLang =
      filter === 'All'
        ? repos
        : filter === 'PHP'
          ? repos.filter((r) => r.language === 'PHP' || r.name.toLowerCase().includes('php'))
          : filter === 'Laravel'
            ? repos.filter((r) => r.language === 'Laravel' || r.name.toLowerCase().includes('laravel'))
            : repos.filter((r) => r.language === filter);
    // Visibility is controlled from the /ilsq console; the home page just
    // reflects it. Projects hidden there drop out here too.
    return byLang.filter((r) => !hidden.includes(r.name));
  }, [repos, filter, hidden]);

  return (
    <section id="projects" className="scroll-mt-24 py-16">
      <SectionHeading eyebrow="My work" title="Projects" />

      {repos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {languages.length > 2 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                    filter === lang
                      ? 'border-neon bg-neon/15 text-white'
                      : 'border-line text-slate-400 hover:border-neon/50 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((repo, i) => (
              <ProjectCard key={repo.id} repo={repo} index={i} />
            ))}
          </motion.div>
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-card p-8 text-center">
      <AlertCircle className="mx-auto mb-4 text-amber-400" size={32} />
      <h3 className="mb-2 font-semibold text-white">No projects loaded yet</h3>
      <p className="text-sm text-slate-400">
        Set your GitHub username in{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-neon-cyan">
          src/config.ts
        </code>{' '}
        (currently{' '}
        <span className="font-mono text-neon">
          &quot;{config.github.username}&quot;
        </span>
        ), then rebuild. Projects are pulled live from the GitHub API.
      </p>
    </div>
  );
}
