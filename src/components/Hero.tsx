'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Star, FolderGit2, Download } from 'lucide-react';
import { config } from '@/config';
import type { GitHubUser } from '@/lib/github';
import avatarImg from '@/images/newupdatedimageofmine.png';
import CodeTyping from './CodeTyping';

export default function Hero({
  user,
  repoCount,
  totalStars,
  stack,
  domains,
}: {
  user: GitHubUser | null;
  repoCount: number;
  totalStars: number;
  /** Languages present across the real repos — typed into the code block. */
  stack: string[];
  /** Project categories present across the real repos. */
  domains: string[];
}) {
  const avatar = avatarImg.src;
  const name = config.name || user?.name || user?.login || 'Developer';

  return (
    <section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center py-28"
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-12">
        {/* LEFT — Intro text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="chip mb-6 inline-flex items-center"
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
            Hi, I&apos;m <br />
            <span className="gradient-text">{name}</span>
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
            className="mx-auto mt-6 max-w-xl text-balance text-base text-slate-400 sm:text-lg"
          >
            {config.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3 lg:justify-start justify-center"
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
            {config.resume && (
              <a href={config.resume} download className="btn-ghost">
                <Download size={18} /> Resume
              </a>
            )}

          </motion.div>
        </motion.div>

        {/* RIGHT — Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="order-first flex-shrink-0 mt-8 lg:order-last lg:mt-16"
        >
          {avatar ? (
            <div className="relative inline-block animate-float">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-neon via-neon-cyan to-neon-pink opacity-60 blur-xl" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neon/40 via-neon-cyan/40 to-neon-pink/40 blur-md" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={name}
                className="relative h-80 w-80 rounded-2xl border-2 border-white/10 object-cover shadow-glow sm:h-96 sm:w-96"
              />
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* TYPED CODE BLOCK — below the hero, above the stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mt-16 w-full"
      >
        <CodeTyping
          projectCount={repoCount}
          stack={stack}
          domains={domains}
        />
      </motion.div>

      {/* STATS — separate centered section */}
      <StatsBar
        user={user}
        repoCount={repoCount}
        totalStars={totalStars}
      />

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-slate-500 transition-colors hover:text-neon"
        aria-label="Scroll down"
      >
        <ArrowDown className="animate-bounce" size={28} />
      </motion.a>
    </section>
  );
}

function StatsBar({
  user,
  repoCount,
  totalStars,
}: {
  user: GitHubUser | null;
  repoCount: number;
  totalStars: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-12 flex items-center justify-center gap-12 sm:gap-20"
    >
      <AnimatedStat icon={<FolderGit2 size={22} />} value={repoCount} label="Projects" />
      <div className="h-12 w-px bg-line" />
      <AnimatedStat icon={<Star size={22} />} value={totalStars} label="Stars" />
      {user ? (
        <>
          <div className="h-12 w-px bg-line" />
          <AnimatedStat icon={<Github size={22} />} value={user.followers} label="Followers" />
        </>
      ) : null}
    </motion.div>
  );
}

function AnimatedStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 text-4xl font-extrabold text-white sm:text-5xl">
        <span className="text-neon">{icon}</span>
        {display}
      </div>
      <span className="mt-1 text-sm uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}
