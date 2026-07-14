import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Star,
  GitFork,
  ExternalLink,
  Github,
  CircleDot,
  Calendar,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { fetchRepos, fetchRepoDetail } from '@/lib/github';
import { deriveInsight, prettyName } from '@/lib/enrich';
import { buildLiveTabs, thumbnailFor } from '@/lib/preview';
import { config } from '@/config';
import LanguageBar from '@/components/LanguageBar';
import LiveProject from '@/components/LiveProject';
import Readme from '@/components/Readme';

// Pre-render one static page per repo at build time.
export async function generateStaticParams() {
  const repos = await fetchRepos();
  return repos.map((r) => ({ slug: r.name }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const detail = await fetchRepoDetail(params.slug);
  if (!detail) return { title: 'Project not found' };
  const insight = deriveInsight(detail.repo, detail.languages);
  return {
    title: `${insight.title} — ${config.name}`,
    description: insight.tagline,
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const detail = await fetchRepoDetail(params.slug);
  if (!detail) notFound();

  const { repo, languages, readme } = detail;
  const insight = deriveInsight(repo, languages);
  const liveTabs = buildLiveTabs(repo, languages, insight.demo);

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-4xl px-5 pt-10 sm:px-8">
        {/* Header */}
        <header className="mt-8">
          <div className="flex items-center gap-3">
            <span className="chip border-neon/40 text-neon">{insight.category}</span>
            {repo.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-neon/15 px-3 py-1 text-xs font-semibold text-neon">
                <Sparkles size={12} /> Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-neon">{insight.title}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{insight.tagline}</p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Star size={15} className="text-amber-400" /> {repo.stars} stars
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork size={15} /> {repo.forks} forks
            </span>
            <span className="flex items-center gap-1.5">
              <CircleDot size={15} className="text-emerald-400" /> {repo.openIssues} issues
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> Created {fmtDate(repo.createdAt)}
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            {insight.demo && (
              <a href={insight.demo} target="_blank" rel="noreferrer" className="btn-primary">
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
            <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              <Github size={18} /> View Code
            </a>
          </div>
        </header>

        {/* Live, rendered project */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Live preview
          </h2>
          {liveTabs.length > 0 ? (
            <LiveProject tabs={liveTabs} title={insight.title} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line bg-card">
              <img
                src={thumbnailFor(repo)}
                alt={`${insight.title} preview`}
                className="w-full"
              />
              <p className="border-t border-line px-4 py-3 text-xs text-slate-400">
                This project can&apos;t be booted live in the browser (e.g. a
                native/mobile app or a non-web stack). Explore the README below
                or{' '}
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neon hover:underline"
                >
                  view the code on GitHub
                </a>
                .
              </p>
            </div>
          )}
        </section>

        {/* Insight grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* What it demonstrates */}
          <section className="rounded-2xl border border-line bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle2 size={18} className="text-neon" /> What this demonstrates
            </h2>
            <ul className="space-y-2.5">
              {insight.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* Tech stack */}
          <section className="rounded-2xl border border-line bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Tech stack</h2>
            <LanguageBar languages={languages} />
            <div className="mt-5 flex flex-wrap gap-2">
              {insight.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <section className="mt-6 rounded-2xl border border-line bg-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Overview</h2>
          <p className="leading-relaxed text-slate-300">{insight.summary}</p>
        </section>

        {/* README */}
        <section className="mt-10">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-white">
            <BookOpen size={20} className="text-neon" /> Project README
          </h2>
          {readme ? (
            <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
              <Readme
                markdown={readme}
                fullName={repo.fullName}
                branch={repo.defaultBranch}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-card p-8 text-center text-sm text-slate-400">
              This repository doesn&apos;t have a README yet.{' '}
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="text-neon hover:underline"
              >
                Browse the code on GitHub →
              </a>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
