'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  LogOut,
  ArrowLeft,
  Search,
} from 'lucide-react';
import type { Repo } from '@/lib/github';
import { prettyName } from '@/lib/enrich';
import { config } from '@/config';
import { useVisibility, setOwner, toggleHidden } from '@/lib/visibility';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  PHP: '#4F5D95',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
};

/**
 * Private owner console (rendered at /ilsq). If owner mode isn't unlocked in
 * this browser it shows a PIN prompt; once unlocked it lists every project
 * with a visibility switch. Toggling writes to the same localStorage set the
 * home-page cards read, so changes reflect everywhere instantly.
 */
export default function OwnerConsole({ repos }: { repos: Repo[] }) {
  const { owner, hidden } = useVisibility();

  if (!owner) return <PinGate />;

  return <Console repos={repos} hidden={hidden} />;
}

/* ----------------------------- PIN gate ----------------------------- */

function PinGate() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === config.owner.pin) {
      setOwner(true);
    } else {
      setError(true);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-card p-8 text-center"
      >
        <Lock className="mx-auto mb-4 text-neon" size={30} />
        <h1 className="mb-1 text-xl font-semibold text-white">Owner console</h1>
        <p className="mb-6 text-sm text-slate-400">
          Enter your PIN to manage project visibility.
        </p>

        <input
          type="password"
          value={pin}
          autoFocus
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          placeholder="PIN"
          className={`w-full rounded-lg border bg-bg/60 px-4 py-2.5 text-center text-white outline-none transition-colors placeholder:text-slate-500 ${
            error ? 'border-red-400/70' : 'border-line focus:border-neon/60'
          }`}
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">Incorrect PIN — try again.</p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg border border-neon/40 bg-neon/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neon/20"
        >
          Unlock
        </button>

        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <ArrowLeft size={13} /> Back to portfolio
        </Link>
      </form>
    </main>
  );
}

/* ----------------------------- Console ------------------------------ */

function Console({ repos, hidden }: { repos: Repo[]; hidden: string[] }) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = repos.filter((r) =>
    prettyName(r.name).toLowerCase().includes(query.toLowerCase())
  );
  // Count against the actual project list so a stale name in localStorage
  // can't skew the numbers.
  const hiddenCount = repos.filter((r) => hidden.includes(r.name)).length;
  const visibleCount = repos.length - hiddenCount;

  const hiddenLine =
    hidden.length > 0
      ? `hidden: [${hidden.map((n) => `'${n}'`).join(', ')}],`
      : `hidden: [],`;

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(hiddenLine);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = hiddenLine;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-3xl px-5 pt-12 sm:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
            <ShieldCheck size={14} /> Owner console
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
            {visibleCount} {visibleCount === 1 ? 'project' : 'projects'} visible
            {hiddenCount > 0 && (
              <span className="text-slate-500"> · {hiddenCount} hidden</span>
            )}
          </span>
          <button
            onClick={() => setOwner(false)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-neon/50 hover:text-white"
          >
            <LogOut size={13} /> Lock
          </button>
        </header>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
          Project visibility
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Flip a project off to hide its card and detail page{' '}
          <span className="text-slate-300">in this browser</span>. To hide it
          from the public everywhere, use{' '}
          <span className="font-medium text-white">Copy hidden list</span> below,
          paste into{' '}
          <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-neon-cyan">
            config.github.hidden
          </code>
          , and redeploy.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[12rem]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-lg border border-line bg-bg/60 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-neon/60"
            />
          </div>
          <button
            onClick={copyList}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neon/40 bg-neon/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neon/20"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy hidden list'}
          </button>
        </div>

        {/* Project list */}
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {filtered.length === 0 && (
            <li className="px-5 py-6 text-center text-sm text-slate-500">
              No projects match “{query}”.
            </li>
          )}
          {filtered.map((repo) => {
            const isHidden = hidden.includes(repo.name);
            const color = repo.language
              ? LANG_COLORS[repo.language] ?? '#7c5cff'
              : '#7c5cff';
            return (
              <li
                key={repo.id}
                className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                  isHidden ? 'bg-amber-400/5' : ''
                }`}
              >
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/projects/${repo.name}`}
                    className="block truncate font-medium text-white transition-colors hover:text-neon"
                  >
                    {prettyName(repo.name)}
                  </Link>
                  <span className="text-xs text-slate-500">
                    {repo.language ?? 'Other'}
                    {repo.featured && ' · Featured'}
                  </span>
                </div>

                <span
                  className={`inline-flex w-14 items-center justify-end gap-1 text-xs font-medium transition-colors duration-300 ${
                    isHidden ? 'text-slate-500' : 'text-emerald-300'
                  }`}
                >
                  {isHidden ? 'Hidden' : 'Visible'}
                </span>

                {/* Animated toggle switch */}
                <motion.button
                  role="switch"
                  aria-checked={!isHidden}
                  aria-label={`${isHidden ? 'Show' : 'Hide'} ${prettyName(repo.name)}`}
                  onClick={() => toggleHidden(repo.name)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex h-7 w-[3.25rem] shrink-0 items-center rounded-full px-1 outline-none transition-[background,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-neon/50 ${
                    isHidden
                      ? 'justify-start bg-white/10 ring-1 ring-inset ring-white/10'
                      : 'justify-end bg-gradient-to-r from-neon to-neon-cyan shadow-[0_0_16px_-3px_rgba(124,92,255,0.85)]'
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 34 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
                  >
                    <motion.span
                      key={isHidden ? 'off' : 'on'}
                      initial={{ scale: 0, opacity: 0, rotate: -120 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="flex"
                    >
                      {isHidden ? (
                        <EyeOff size={11} className="text-slate-400" />
                      ) : (
                        <Eye size={11} className="text-neon" />
                      )}
                    </motion.span>
                  </motion.span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-300"
          >
            <ArrowLeft size={13} /> View portfolio
          </Link>
          <span>Changes apply instantly on this device.</span>
        </div>
      </div>
    </main>
  );
}
