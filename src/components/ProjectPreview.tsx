'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Camera, Sparkles, Clock, Github } from 'lucide-react';
import type { Preview } from '@/lib/previews';

/**
 * The standard visual presentation for a project that has no in-browser live
 * demo — a real screenshot, a labelled UI mockup, or a "coming soon" state.
 * Kept deliberately honest: the badge always tells the visitor what they're
 * looking at, so an illustrative mockup is never mistaken for the real app.
 */
export default function ProjectPreview({
  preview,
  imageUrl,
  title,
  liveUrl,
  codeUrl,
}: {
  preview: Preview;
  imageUrl?: string;
  title: string;
  liveUrl?: string | null;
  codeUrl: string;
}) {
  if (preview.source === 'coming-soon') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-neon/30 bg-neon/10 text-neon">
          <Clock size={22} />
        </span>
        <h3 className="text-lg font-semibold text-white">Coming soon</h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          This project is planned — the repository is reserved and the build is
          in progress. Check back soon.
        </p>
        <a
          href={codeUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost mt-6"
        >
          <Github size={16} /> View repository
        </a>
      </div>
    );
  }

  const badge = BADGES[preview.source];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-line bg-card"
    >
      {/* Header: source badge + optional live link */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}
        >
          <badge.Icon size={12} /> {badge.label}
        </span>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Open live site <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Image — mockups arrive with their own device framing, so it's shown
          cleanly on a neutral backdrop rather than double-framed. */}
      <div
        className={`flex justify-center bg-gradient-to-b from-surface to-bg ${
          preview.kind === 'mobile' ? 'px-4 py-6' : 'p-0'
        }`}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${title} — ${badge.label.toLowerCase()}`}
            loading="lazy"
            className={
              preview.kind === 'mobile'
                ? 'max-h-[560px] w-auto rounded-2xl shadow-glow'
                : 'w-full'
            }
          />
        )}
      </div>

      <p className="border-t border-line px-4 py-2.5 text-xs text-slate-500">
        {badge.note}
      </p>
    </motion.div>
  );
}

const BADGES: Record<
  Exclude<Preview['source'], 'coming-soon'>,
  { label: string; Icon: typeof Camera; className: string; note: string }
> = {
  live: {
    label: 'Live screenshot',
    Icon: Camera,
    className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    note: 'A screenshot of the project’s live deployment. Use “Open live site” to visit it.',
  },
  screenshot: {
    label: 'App screenshot',
    Icon: Camera,
    className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    note: 'A real screenshot taken from the app, included in the project repository.',
  },
  illustrative: {
    label: 'Illustrative UI preview',
    Icon: Sparkles,
    className: 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan',
    note: 'A representative UI concept for this project — illustrative, not a screenshot of the running app. Explore the code and README below.',
  },
};
