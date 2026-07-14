'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Github, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Repo } from '@/lib/github';
import { deriveCategory } from '@/lib/enrich';
import { demoUrl } from '@/lib/demos';
import ProjectCover from './ProjectCover';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
};

function prettyName(name: string) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectCard({ repo, index }: { repo: Repo; index: number }) {
  const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#7c5cff' : '#7c5cff';
  // Template repos ship a full storefront on this site (public/demo/<slug>/);
  // everything else falls back to whatever deployment the repo points at.
  const demo =
    demoUrl(repo.name) ??
    (repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : null);
  const isLocalDemo = Boolean(demoUrl(repo.name));

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className={`card-hover group flex flex-col overflow-hidden rounded-2xl border bg-card ${
        repo.featured
          ? 'border-neon/40 shadow-glow'
          : 'border-line'
      }`}
    >
      {/* Preview image links to the project's case-study page */}
      <Link
        href={`/projects/${repo.name}`}
        className="relative block aspect-[2/1] overflow-hidden border-b border-line bg-surface"
      >
        {repo.featured && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-neon/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-glow backdrop-blur">
            <Sparkles size={12} /> Featured
          </span>
        )}
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProjectCover
            title={prettyName(repo.name)}
            category={deriveCategory(repo)}
            language={repo.language}
            variant="card"
          />
        </div>
        <div className="absolute inset-0 bg-card/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 z-10 inline-flex translate-y-2 items-center gap-1 rounded-full bg-bg/80 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
          View details <ArrowUpRight size={13} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/projects/${repo.name}`}
            className="font-semibold text-white transition-colors hover:text-neon group-hover:text-neon"
          >
            {prettyName(repo.name)}
          </Link>
          <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
            {repo.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-400" /> {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork size={13} /> {repo.forks}
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">
          {repo.description || 'No description provided.'}
        </p>

        {repo.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-neon/10 px-2 py-0.5 text-[11px] font-medium text-neon"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          {repo.language ? (
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-slate-300 transition-colors hover:text-neon"
            >
              <Github size={14} /> Code
            </a>
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-neon-cyan transition-colors hover:text-white"
              >
                <ExternalLink size={14} /> {isLocalDemo ? 'Live Demo' : 'Live'}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
