'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { config } from '@/config';
import type { GitHubUser } from '@/lib/github';
import { SectionHeading } from './Section';

export default function About({ user }: { user: GitHubUser | null }) {
  const location = config.location || user?.location || '';
  const bio = config.about || user?.bio || '';

  return (
    <section id="about" className="scroll-mt-24 py-24">
      <SectionHeading eyebrow="Get to know me" title="About Me" />

      <div className="grid gap-10 md:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <p className="text-lg leading-relaxed text-slate-300">{bio}</p>

          {location ? (
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={16} className="text-neon" /> {location}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-slate-400">
            Tech I work with
          </h3>
          <div className="flex flex-wrap gap-2">
            {config.skills.map((skill) => (
              <span
                key={skill}
                className="chip transition-colors hover:border-neon/60 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
