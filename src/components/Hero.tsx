'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Github, Star, FolderGit2 } from 'lucide-react';
import { config } from '@/config';
import type { GitHubUser } from '@/lib/github';

export default function Hero({
  user,
  repoCount,
  totalStars,
}: {
  user: GitHubUser | null;
  repoCount: number;
  totalStars: number;
}) {
  const avatar = config.avatar || user?.avatarUrl || '';
  const name = config.name || user?.name || user?.login || 'Developer';

  return (
    <section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center py-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8"
      >
        {avatar ? (
          <div className="relative inline-block animate-float">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon via-neon-cyan to-neon-pink opacity-70 blur-md" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt={name}
              className="relative h-28 w-28 rounded-full border-2 border-white/10 object-cover"
            />
          </div>
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="chip mb-6 inline-flex"
      >
        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Available for work
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl"
      >
        Hi, I&apos;m <span className="gradient-text">{name}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-4 font-mono text-lg text-neon-cyan sm:text-xl"
      >
        {config.role}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 max-w-2xl text-balance text-base text-slate-400 sm:text-lg"
      >
        {config.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <a href="#projects" className="btn-primary">
          <FolderGit2 size={18} /> View Projects
        </a>
        <a
          href={config.social.github || `https://github.com/${config.github.username}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <Github size={18} /> GitHub Profile
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-14 flex items-center gap-8 text-sm text-slate-400"
      >
        <Stat icon={<FolderGit2 size={16} />} value={repoCount} label="Projects" />
        <div className="h-8 w-px bg-line" />
        <Stat icon={<Star size={16} />} value={totalStars} label="Stars" />
        {user ? (
          <>
            <div className="h-8 w-px bg-line" />
            <Stat
              icon={<Github size={16} />}
              value={user.followers}
              label="Followers"
            />
          </>
        ) : null}
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-slate-500 transition-colors hover:text-neon"
        aria-label="Scroll down"
      >
        <ArrowDown className="animate-bounce" />
      </motion.a>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-xl font-bold text-white">
        <span className="text-neon">{icon}</span>
        {value}
      </div>
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}
