'use client';

import { motion } from 'framer-motion';

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <p className="mb-1 font-mono text-sm uppercase tracking-[0.2em] text-neon-cyan">
        {eyebrow}
      </p>
      <h2 className="section-title text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-neon to-neon-cyan" />
    </motion.div>
  );
}
