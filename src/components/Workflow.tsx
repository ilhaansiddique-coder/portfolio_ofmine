'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { config } from '@/config';
import { SectionHeading } from './Section';

export default function Workflow() {
  return (
    <section id="workflow" className="scroll-mt-24 py-24">
      <SectionHeading eyebrow="How I build" title="From Idea To Production" />

      <div className="grid gap-4 md:grid-cols-4">
        {config.workflow.map((item, index) => (
          <motion.article
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="relative rounded-2xl border border-line bg-card p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-sm text-neon-cyan">{item.step}</span>
              {index < config.workflow.length - 1 ? (
                <ArrowRight className="hidden text-slate-600 md:block" size={18} />
              ) : null}
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
